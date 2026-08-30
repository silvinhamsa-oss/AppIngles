import { NextRequest, NextResponse } from "next/server";
import { AIRouter } from "@/lib/ai/router";
import { AIConfig, ChatMessage } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, scenarioId, persona, config, stream = true } = body;

    // Resolve AI configuration with server-side environment variables as fallback
    const activeConfig: AIConfig = {
      provider: config?.provider || (process.env.AI_PROVIDER as any) || "openrouter",
      apiKey: config?.apiKey || process.env.AI_API_KEY || "",
      model: config?.model || process.env.AI_MODEL || "meta-llama/llama-3.3-70b-instruct",
      baseUrl: config?.baseUrl || process.env.AI_BASE_URL,
      temperature: config?.temperature ?? 0.7,
      maxTokens: config?.maxTokens ?? 500,
    };

    // Ensure API Key exists (unless using local Ollama)
    if (!activeConfig.apiKey && activeConfig.provider !== "ollama") {
      return NextResponse.json(
        {
          error: "NO_API_KEY_CONFIGURED",
          message: "Nenhuma chave de IA configurada. Por favor, insira sua chave de API em Configurações.",
        },
        { status: 400 }
      );
    }

    const systemPrompt = AIRouter.buildSystemPrompt({
      scenarioId: scenarioId || "free-chat",
      persona: persona || "sarah",
      userLevel: "B1+",
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
          } catch (streamErr: any) {
            console.error("Stream generation error:", streamErr);
            controller.enqueue(
              textEncoder.encode(
                `data: ${JSON.stringify({ error: streamErr.message || "Erro no streaming da IA." })}\n\n`
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
  } catch (error: any) {
    console.error("Chat API route error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar conversa com o tutor de IA." },
      { status: 500 }
    );
  }
}
