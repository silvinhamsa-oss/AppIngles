import { NextRequest, NextResponse } from "next/server";
import { AIRouter } from "@/lib/ai/router";
import { getBaseSystemPrompt } from "@/lib/ai/prompts";
import { AIProviderConfig, ChatMessage } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages = [],
      providerConfig = {},
      level = "B1+",
      mode = "guided",
      topic = "Work & Daily Life",
      persona = "sarah",
      stream = true,
    } = body;

    // Resolve active configuration (falling back to server environment variables if empty)
    const activeConfig: AIProviderConfig = {
      provider: providerConfig.provider || process.env.AI_PROVIDER || "openrouter",
      apiKey: providerConfig.apiKey || process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || "",
      model: providerConfig.model || process.env.AI_MODEL || "meta-llama/llama-3.3-70b-instruct",
      baseUrl: providerConfig.baseUrl || process.env.AI_BASE_URL || "",
      temperature: providerConfig.temperature ?? 0.7,
      maxTokens: providerConfig.maxTokens ?? 2048,
    };

    // Construct conversation payload with modular system prompt
    const systemPrompt = getBaseSystemPrompt(level, mode, topic, persona);
    const fullMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    // Check if streaming is requested
    if (stream) {
      const textEncoder = new TextEncoder();
      const customStream = new ReadableStream({
        async start(controller) {
          try {
            // If no API key configured anywhere, return a helpful conversational response
            if (!activeConfig.apiKey && activeConfig.provider !== "ollama") {
              const mockResponses = [
                "That's really interesting! Keeping your conversational flow going is the best way to develop confidence. How do you plan to implement that in your day-to-day routine?",
                "Great phrasing! Using that verb in context makes the sentence sound very natural. What other goals are you aiming for this week?",
                "I understand your point completely. When you communicate in English, focusing on being clear is always better than translating word by word. Tell me more!",
              ];
              const reply = mockResponses[Math.floor(Math.random() * mockResponses.length)];
              
              // Simulate real-time word-by-word streaming
              const words = reply.split(" ");
              for (const word of words) {
                controller.enqueue(textEncoder.encode(`data: ${JSON.stringify({ content: word + " " })}\n\n`));
                await new Promise((r) => setTimeout(r, 40));
              }
              controller.enqueue(textEncoder.encode("data: [DONE]\n\n"));
              controller.close();
              return;
            }

            for await (const chunk of AIRouter.stream({ messages: fullMessages }, activeConfig)) {
              controller.enqueue(textEncoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
            }

            controller.enqueue(textEncoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (err: any) {
            console.error("AI Streaming error:", err);
            controller.enqueue(
              textEncoder.encode(`data: ${JSON.stringify({ error: err.message || "Erro no fluxo de IA." })}\n\n`)
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
    const response = await AIRouter.chat({ messages: fullMessages }, activeConfig);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Chat API route error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar mensagem com a IA." },
      { status: 500 }
    );
  }
}
