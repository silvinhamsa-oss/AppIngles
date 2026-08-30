import { NextRequest, NextResponse } from "next/server";
import { AIRouter } from "@/lib/ai/router";
import { AIProviderConfig } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const config: AIProviderConfig = {
      provider: body.provider || "openrouter",
      apiKey: body.apiKey || "",
      model: body.model || "meta-llama/llama-3.3-70b-instruct",
      baseUrl: body.baseUrl || "",
      temperature: 0.1,
      maxTokens: 10,
    };

    if (!config.apiKey && config.provider !== "ollama") {
      return NextResponse.json({
        success: false,
        message: "Chave de API não informada. Insira uma chave válida para testar.",
      });
    }

    const result = await AIRouter.testConnection(config);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Test connection API error:", error);
    const errorMsg = error instanceof Error ? error.message : "Falha ao conectar com o provedor de IA.";
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}

