import { NextRequest, NextResponse } from "next/server";
import { AIProviderType } from "@/lib/ai/types";

interface ModelItem {
  id: string;
  name?: string;
  description?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider = "nvidia", apiKey, baseUrl } = body;

    if (!apiKey && provider !== "ollama") {
      return NextResponse.json(
        { error: "API Key é necessária para listar os modelos." },
        { status: 400 }
      );
    }

    let url = "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey.trim()}`;
    }

    if (provider === "nvidia") {
      url = baseUrl?.trim() || "https://integrate.api.nvidia.com/v1";
      url = `${url.replace(/\/+$/, "")}/models`;
    } else if (provider === "openrouter") {
      url = "https://openrouter.ai/api/v1/models";
      headers["HTTP-Referer"] = "https://englishlab.app";
      headers["X-Title"] = "English Lab AI Tutor";
    } else if (provider === "openai") {
      url = "https://api.openai.com/v1/models";
    } else if (provider === "ollama") {
      url = baseUrl?.trim() || "http://localhost:11434/v1";
      url = `${url.replace(/\/+$/, "")}/models`;
    } else {
      url = baseUrl?.trim() ? `${baseUrl.trim().replace(/\/+$/, "")}/models` : "https://integrate.api.nvidia.com/v1/models";
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

    // Sort alphabetically
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
