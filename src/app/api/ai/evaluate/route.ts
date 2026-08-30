import { NextRequest, NextResponse } from "next/server";
import { AIRouter } from "@/lib/ai/router";
import { AIConfig, ChatMessage } from "@/lib/ai/types";
import { EvaluationReport } from "@/types/conversation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, scenarioId, persona, config } = body;

    const activeConfig: AIConfig = {
      provider: config?.provider || (process.env.AI_PROVIDER as any) || "openrouter",
      apiKey: config?.apiKey || process.env.AI_API_KEY || "",
      model: config?.model || process.env.AI_MODEL || "meta-llama/llama-3.3-70b-instruct",
      baseUrl: config?.baseUrl || process.env.AI_BASE_URL,
      temperature: 0.3,
      maxTokens: 1000,
    };

    if (!activeConfig.apiKey && activeConfig.provider !== "ollama") {
      return NextResponse.json(
        {
          error: "NO_API_KEY_CONFIGURED",
          message: "Nenhuma chave de IA configurada para gerar a avaliação. Configure sua chave em Configurações.",
        },
        { status: 400 }
      );
    }

    const evaluationPrompt = `
You are an expert CEFR English Language Assessor and Pedagogical Coach.
Analyze the following conversation between the student and the AI tutor (${persona || "Sarah"}).

Scenario: ${scenarioId || "General Practice"}

CONVERSATION TRANSCRIPT:
${messages.map((m: ChatMessage) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}

Respond ONLY with a valid, raw JSON object (without markdown code blocks, backticks, or extra text) following this exact schema:
{
  "cefrLevel": "B1+" | "B2" | "A2" | "C1",
  "overallScore": number between 1.0 and 10.0 (e.g. 8.5),
  "fluencyScore": number between 1.0 and 10.0,
  "vocabularyScore": number between 1.0 and 10.0,
  "grammarScore": number between 1.0 and 10.0,
  "naturalnessScore": number between 1.0 and 10.0,
  "confidenceScore": number between 1.0 and 10.0,
  "feedbackPt": "Resumo pedagógico em português sobre pontos fortes e onde melhorar.",
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "sentenceCorrections": [
    {
      "original": "Frase que o aluno falou",
      "suggested": "Forma nativa polida e natural",
      "explanationPt": "Explicação gramatical ou de nuance em português"
    }
  ],
  "vocabularyToSave": [
    {
      "word": "Palavra ou expressão nativa",
      "phoneticIpa": "/.../",
      "translationPt": "Significado em português",
      "exampleEn": "Frase de exemplo no contexto da conversa"
    }
  ]
}
`;

    const aiResponse = await AIRouter.generate(
      {
        messages: [
          { role: "system", content: "You are a professional CEFR language evaluator that strictly outputs valid JSON." },
          { role: "user", content: evaluationPrompt },
        ],
      },
      activeConfig
    );

    let cleanJson = aiResponse.content.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const report: EvaluationReport = JSON.parse(cleanJson);
    return NextResponse.json(report);
  } catch (error: any) {
    console.error("Evaluation API error:", error);
    return NextResponse.json(
      { error: error.message || "Falha ao gerar relatório pedagógico de avaliação." },
      { status: 500 }
    );
  }
}
