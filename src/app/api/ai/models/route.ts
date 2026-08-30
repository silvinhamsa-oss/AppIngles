import { NextRequest, NextResponse } from "next/server";
import { AIProviderType } from "@/lib/ai/types";

interface ModelItem {
  id: string;
  name?: string;
  description?: string;
  isTestedOnline?: boolean;
  latencyMs?: number;
}

// Lista de candidatos de chat mais estáveis da NVIDIA NIM
const NVIDIA_POPULAR_CHAT_MODELS = [
  "meta/llama-3.1-70b-instruct",
  "mistralai/mistral-large-2-instruct",
  "meta/llama-3.1-8b-instruct",
  "deepseek-ai/deepseek-r1",
  "qwen/qwen2.5-72b-instruct",
  "google/gemma-2-27b-it",
  "microsoft/phi-3.5-mini-instruct",
  "meta/llama-3.2-3b-instruct",
  "meta/llama-3.2-1b-instruct",
];

async function pingModel(
  baseUrl: string,
  apiKey: string,
  modelId: string
): Promise<{ success: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: "hi" }],
        max_tokens: 2,
        temperature: 0.1,
      }),
      signal: AbortSignal.timeout(6000),
    });

    const latencyMs = Date.now() - start;
    if (res.ok) {
      return { success: true, latencyMs };
    }
    const errText = await res.text();
    return { success: false, latencyMs, error: errText };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Timeout/Network Error";
    return { success: false, latencyMs: Date.now() - start, error: errorMsg };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider = "nvidia", apiKey, baseUrl, action } = body;

    if (!apiKey && provider !== "ollama") {
      return NextResponse.json(
        { error: "API Key é necessária para listar ou testar modelos." },
        { status: 400 }
      );
    }

    const effectiveBaseUrl = (baseUrl?.trim() || (provider === "nvidia" ? "https://integrate.api.nvidia.com/v1" : "https://api.openai.com/v1")).replace(/\/+$/, "");

    // AÇÃO 1: AUTO-DETECTAR MODELOS ONLINE
    if (action === "auto-detect" && provider === "nvidia") {
      const pingPromises = NVIDIA_POPULAR_CHAT_MODELS.map(async (modelId) => {
        const result = await pingModel(effectiveBaseUrl, apiKey, modelId);
        return {
          id: modelId,
          name: modelId,
          isTestedOnline: result.success,
          latencyMs: result.latencyMs,
          error: result.error,
        };
      });

      const results = await Promise.all(pingPromises);
      const onlineModels = results.filter((r) => r.isTestedOnline);
      const offlineModels = results.filter((r) => !r.isTestedOnline);

      return NextResponse.json({
        success: true,
        action: "auto-detect",
        bestModel: onlineModels[0]?.id || null,
        onlineModels,
        offlineModels,
        message: onlineModels.length > 0
          ? `Encontramos ${onlineModels.length} modelo(s) 100% ativos e funcionando na sua conta!`
          : "Nenhum dos modelos populares respondeu com sucesso. Verifique se sua chave NVIDIA API Key tem créditos ou permissão.",
      });
    }

    // AÇÃO 2: LISTAR TODOS OS MODELOS DO PROVEDOR COM FILTRO DE CHAT
    let url = `${effectiveBaseUrl}/models`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey.trim()}`;
    }

    if (provider === "openrouter") {
      url = "https://openrouter.ai/api/v1/models";
      headers["HTTP-Referer"] = "https://englishlab.app";
      headers["X-Title"] = "English Lab AI Tutor";
    } else if (provider === "openai") {
      url = "https://api.openai.com/v1/models";
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Erro do provedor (${response.status}): ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    let models: ModelItem[] = [];

    if (Array.isArray(data.data)) {
      models = data.data.map((item: { id: string; name?: string; description?: string }) => ({
        id: item.id,
        name: item.name || item.id,
        description: item.description,
      }));
    } else if (Array.isArray(data.models)) {
      models = data.models.map((item: { name?: string; model?: string }) => ({
        id: item.name || item.model || "",
        name: item.name || item.model || "",
      }));
    }

    // Filtro inteligente para NVIDIA: remover embeddings, rerankers, diffusion, audio
    if (provider === "nvidia") {
      const excludeKeywords = ["embed", "rerank", "clip", "sdxl", "stable-diffusion", "whisper", "tts", "parakeet", "reward", "guard"];
      models = models.filter((m) => {
        const lower = m.id.toLowerCase();
        return !excludeKeywords.some((k) => lower.includes(k));
      });
    }

    // Ordenar modelos alfabeticamente
    models.sort((a, b) => a.id.localeCompare(b.id));

    return NextResponse.json({
      success: true,
      provider: provider as AIProviderType,
      models,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao buscar modelos do provedor.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
