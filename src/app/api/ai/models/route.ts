import { NextRequest, NextResponse } from "next/server";
import { AIProviderType } from "@/lib/ai/types";

interface ModelItem {
  id: string;
  name?: string;
  description?: string;
  isTestedOnline?: boolean;
  latencyMs?: number;
  error?: string;
}

async function pingModel(
  baseUrl: string,
  apiKey: string,
  modelId: string
): Promise<{ success: boolean; latencyMs: number; error?: string; status?: number }> {
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
      signal: AbortSignal.timeout(5000),
    });

    const latencyMs = Date.now() - start;
    if (res.ok) {
      return { success: true, latencyMs };
    }
    const errText = await res.text();
    return { success: false, latencyMs, error: errText, status: res.status };
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

    let defaultUrl = "https://api.openai.com/v1";
    if (provider === "nvidia") defaultUrl = "https://integrate.api.nvidia.com/v1";
    if (provider === "groq") defaultUrl = "https://api.groq.com/openai/v1";

    const effectiveBaseUrl = (baseUrl?.trim() || defaultUrl).replace(/\/+$/, "");

    // 1. Buscar a lista real de modelos retornada pela conta do provedor
    let listUrl = `${effectiveBaseUrl}/models`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey.trim()}`;
    }

    if (provider === "openrouter") {
      listUrl = "https://openrouter.ai/api/v1/models";
      headers["HTTP-Referer"] = "https://englishlab.app";
      headers["X-Title"] = "English Lab AI Tutor";
    } else if (provider === "openai") {
      listUrl = "https://api.openai.com/v1/models";
    } else if (provider === "groq") {
      listUrl = "https://api.groq.com/openai/v1/models";
    }

    let fetchedRawModels: ModelItem[] = [];
    try {
      const response = await fetch(listUrl, {
        method: "GET",
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.data)) {
          fetchedRawModels = data.data.map((item: { id: string; name?: string; description?: string }) => ({
            id: item.id,
            name: item.name || item.id,
            description: item.description,
          }));
        } else if (Array.isArray(data.models)) {
          fetchedRawModels = data.models.map((item: { name?: string; model?: string }) => ({
            id: item.name || item.model || "",
            name: item.name || item.model || "",
          }));
        }
      }
    } catch {
      // Ignora erro de fetch da lista geral se cair no fallback
    }

    // Filtrar modelos candidatos a chat (remover embeddings, rerank, audio, vision guards)
    const excludeKeywords = ["embed", "rerank", "clip", "sdxl", "stable-diffusion", "whisper", "tts", "parakeet", "reward", "guard", "segformer", "yolo", "paddle"];
    let chatCandidateModels = fetchedRawModels.filter((m) => {
      const lower = m.id.toLowerCase();
      return !excludeKeywords.some((k) => lower.includes(k));
    });

    // Se a busca de modelos retornar vazia ou não permitida, usa lista de fallback
    if (chatCandidateModels.length === 0) {
      const fallbackList = provider === "groq"
        ? [
            "llama-3.3-70b-versatile",
            "llama-3.1-70b-versatile",
            "llama-3.1-8b-instant",
            "mixtral-8x7b-32768",
            "gemma2-9b-it",
          ]
        : [
            "meta/llama-3.1-70b-instruct",
            "mistralai/mistral-large-2-instruct",
            "meta/llama-3.1-8b-instruct",
            "deepseek-ai/deepseek-r1",
            "qwen/qwen2.5-72b-instruct",
            "google/gemma-2-27b-it",
            "microsoft/phi-3.5-mini-instruct",
          ];
      chatCandidateModels = fallbackList.map((id) => ({ id, name: id }));
    }

    // AÇÃO: AUTO-DETECTAR MODELOS ATIVOS
    if (action === "auto-detect") {
      // Pega os primeiros 10 modelos de chat da conta
      const toTest = chatCandidateModels.slice(0, 10);
      let firstErrorDiagnostic = "";

      const pingPromises = toTest.map(async (m) => {
        const result = await pingModel(effectiveBaseUrl, apiKey, m.id);
        if (!result.success && result.error && !firstErrorDiagnostic) {
          firstErrorDiagnostic = `Modelo ${m.id} (${result.status || 'erro'}): ${result.error}`;
        }
        return {
          id: m.id,
          name: m.name || m.id,
          isTestedOnline: result.success,
          latencyMs: result.latencyMs,
          error: result.error,
        };
      });

      const results = await Promise.all(pingPromises);
      const onlineModels = results.filter((r) => r.isTestedOnline);

      if (onlineModels.length > 0) {
        return NextResponse.json({
          success: true,
          action: "auto-detect",
          bestModel: onlineModels[0].id,
          onlineModels,
          message: `✓ Encontramos ${onlineModels.length} modelo(s) ativos na sua conta! Selecionamos: ${onlineModels[0].id}`,
        });
      }

      return NextResponse.json({
        success: false,
        action: "auto-detect",
        onlineModels: [],
        diagnostic: firstErrorDiagnostic,
        message: firstErrorDiagnostic 
          ? `Resposta da NVIDIA: ${firstErrorDiagnostic.slice(0, 160)}...`
          : "Nenhum modelo respondeu. Verifique se a sua chave nvapi-... possui acesso à API da NVIDIA.",
      });
    }

    // AÇÃO PADRÃO: LISTAR TODOS OS MODELOS DISPONÍVEIS
    chatCandidateModels.sort((a, b) => a.id.localeCompare(b.id));

    return NextResponse.json({
      success: true,
      provider: provider as AIProviderType,
      models: chatCandidateModels,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao buscar modelos do provedor.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
