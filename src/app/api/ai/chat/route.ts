import { NextRequest, NextResponse } from "next/server";
import { AIRouter } from "@/lib/ai/router";
import { AIConfig, AIProviderType, ChatMessage } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      scenarioId,
      topic,
      level,
      persona = "sarah",
      config,
      providerConfig,
      stream = true,
    } = body;
    const clientConfig = config || providerConfig;

    // Resolve AI configuration with server-side environment variables as fallback
    const activeConfig: AIConfig = {
      provider: (clientConfig?.provider as AIProviderType) || (process.env.AI_PROVIDER as AIProviderType) || "openrouter",
      apiKey: clientConfig?.apiKey || process.env.AI_API_KEY || "",
      model:
        clientConfig?.model ||
        process.env.AI_MODEL ||
        (clientConfig?.provider === "groq"
          ? "llama-3.3-70b-versatile"
          : clientConfig?.provider === "nvidia"
          ? "meta/llama-3.1-70b-instruct"
          : "meta-llama/llama-3.3-70b-instruct"),
      baseUrl: clientConfig?.baseUrl || process.env.AI_BASE_URL,
      temperature: clientConfig?.temperature ?? 0.7,
      maxTokens: clientConfig?.maxTokens ?? 500,
    };

    // Ensure API Key exists (unless using local Ollama)
    if (!activeConfig.apiKey && activeConfig.provider !== "ollama") {
      return NextResponse.json(
        {
          error: "Nenhuma chave de IA configurada. Por favor, acerte sua API Key na aba Configurações.",
        },
        { status: 400 }
      );
    }

    const systemPrompt = AIRouter.buildSystemPrompt({
      scenarioId: topic || scenarioId || "Free Conversation",
      persona: persona || "sarah",
      userLevel: level || "B1+",
    });

    const fullMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    if (stream) {
      const textEncoder = new TextEncoder();
      const customStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of AIRouter.stream({ messages: fullMessages }, activeConfig)) {
              controller.enqueue(textEncoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
            }
            controller.enqueue(textEncoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (streamErr: unknown) {
            console.error("Stream generation error:", streamErr);
            const errorMsg = streamErr instanceof Error ? streamErr.message : "Erro no streaming da IA.";
            controller.enqueue(
              textEncoder.encode(
                `data: ${JSON.stringify({ error: errorMsg })}\n\n`
              )
            );
            controller.close();
          }
        },
      });

      return new Response(customStream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    // Non-streaming fallback
    const response = await AIRouter.generate({ messages: fullMessages }, activeConfig);
    return NextResponse.json({
      content: response.content,
      usage: response.usage,
    });
  } catch (error: unknown) {
    console.error("Chat API route error:", error);
    const errorMsg = error instanceof Error ? error.message : "Erro ao processar conversa com o tutor de IA.";
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}

