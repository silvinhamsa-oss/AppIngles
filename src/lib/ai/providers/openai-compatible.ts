import { AIProvider, AIProviderConfig, ChatRequest, ChatResponse } from "../types";

export class OpenAICompatibleProvider implements AIProvider {
  private getBaseUrl(config: AIProviderConfig): string {
    if (config.baseUrl && config.baseUrl.trim()) {
      return config.baseUrl.trim().replace(/\/+$/, "");
    }

    switch (config.provider) {
      case "openrouter":
        return "https://openrouter.ai/api/v1";
      case "nvidia":
        return "https://integrate.api.nvidia.com/v1";
      case "openai":
        return "https://api.openai.com/v1";
      case "ollama":
        return "http://localhost:11434/v1";
      default:
        return "https://api.openai.com/v1";
    }
  }

  private getHeaders(config: AIProviderConfig): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (config.apiKey) {
      headers["Authorization"] = `Bearer ${config.apiKey.trim()}`;
    }

    if (config.provider === "openrouter") {
      headers["HTTP-Referer"] = "https://englishlab.app";
      headers["X-Title"] = "English Lab AI Tutor";
    }

    return headers;
  }

  async chat(request: ChatRequest, config: AIProviderConfig): Promise<ChatResponse> {
    const baseUrl = this.getBaseUrl(config);
    const headers = this.getHeaders(config);

    const payload = {
      model: config.model || "meta-llama/llama-3.3-70b-instruct",
      messages: request.messages,
      temperature: request.temperature ?? config.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? config.maxTokens ?? 2048,
    };

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI Provider Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || "";

    return {
      content: message,
      finishReason: data.choices?.[0]?.finish_reason,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }

  async *stream(request: ChatRequest, config: AIProviderConfig): AsyncIterable<string> {
    const baseUrl = this.getBaseUrl(config);
    const headers = this.getHeaders(config);

    const payload = {
      model: config.model || "meta-llama/llama-3.3-70b-instruct",
      messages: request.messages,
      temperature: request.temperature ?? config.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? config.maxTokens ?? 2048,
      stream: true,
    };

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text();
      throw new Error(`AI Streaming Error (${response.status}): ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(":")) continue;

        if (trimmed === "data: [DONE]") return;

        if (trimmed.startsWith("data: ")) {
          try {
            const json = JSON.parse(trimmed.slice(6));
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) yield delta;
          } catch {}
        }
      }
    }
  }

  async testConnection(config: AIProviderConfig): Promise<{ success: boolean; message: string }> {
    try {
      await this.chat(
        {
          messages: [{ role: "user", content: "hi" }],
          maxTokens: 1,
        },
        config
      );

      return {
        success: true,
        message: `Conexão bem-sucedida com ${config.provider.toUpperCase()} (${config.model}).`,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Falha ao conectar com o provedor de IA.";
      return {
        success: false,
        message,
      };
    }
  }
}

