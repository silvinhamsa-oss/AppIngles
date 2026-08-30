import { AIProvider, AIProviderConfig, ChatRequest, ChatResponse } from "../types";

export class GeminiProvider implements AIProvider {
  private getEndpoint(config: AIProviderConfig): string {
    const model = config.model || "gemini-2.0-flash";
    const apiKey = config.apiKey || "";
    return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  }

  async chat(request: ChatRequest, config: AIProviderConfig): Promise<ChatResponse> {
    const endpoint = this.getEndpoint(config);

    // Convert messages to Gemini format
    const contents = request.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const systemInstruction = request.messages.find((m) => m.role === "system");

    interface GeminiPayload {
      contents: Array<{ role: string; parts: Array<{ text: string }> }>;
      generationConfig: {
        temperature: number;
        maxOutputTokens: number;
      };
      systemInstruction?: {
        parts: Array<{ text: string }>;
      };
    }

    const payload: GeminiPayload = {
      contents,
      generationConfig: {
        temperature: request.temperature ?? config.temperature ?? 0.7,
        maxOutputTokens: request.maxTokens ?? config.maxTokens ?? 2048,
      },
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction.content }],
      };
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Gemini Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const message = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return {
      content: message,
      finishReason: data.candidates?.[0]?.finishReason,
      usage: data.usageMetadata
        ? {
            promptTokens: data.usageMetadata.promptTokenCount,
            completionTokens: data.usageMetadata.candidatesTokenCount,
            totalTokens: data.usageMetadata.totalTokenCount,
          }
        : undefined,
    };
  }

  async testConnection(config: AIProviderConfig): Promise<{ success: boolean; message: string }> {
    try {
      await this.chat(
        {
          messages: [{ role: "user", content: "Say OK" }],
          maxTokens: 5,
        },
        config
      );

      return {
        success: true,
        message: `Conexão bem-sucedida com Google Gemini (${config.model || "gemini-2.0-flash"}).`,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Falha ao conectar com a API do Google Gemini.";
      return {
        success: false,
        message,
      };
    }
  }
}

