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
      let customError = `AI Provider Error (${response.status}): ${errorText}`;
      if (response.status === 410) {
        customError = `O modelo '${config.model}' atingiu o fim de vida (End of Life) na NVIDIA/provedor e foi desativado. Clique em 'Puxar Modelos da API' nas Configurações para escolher um modelo ativo.`;
      } else if (response.status === 404) {
        customError = `O modelo '${config.model}' não foi encontrado ou não está provisionado na sua conta. Clique em 'Puxar Modelos da API' para listar os modelos disponíveis.`;
      } else if (response.status === 401 || response.status === 403) {
        customError = `Chave de API inválida ou sem permissão para acessar o modelo '${config.model}'. Verifique sua chave no painel do provedor.`;
      }
      throw new Error(customError);
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
      let customError = `AI Streaming Error (${response.status}): ${errorText}`;
      if (response.status === 410) {
        customError = `O modelo '${config.model}' atingiu o fim de vida (End of Life) e não está mais disponível. Selecione outro modelo nas Configurações.`;
      } else if (response.status === 404) {
        customError = `O modelo '${config.model}' não foi encontrado na sua conta. Atualize a lista nas Configurações.`;
      }
      throw new Error(customError);
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
    const startTime = Date.now();
    try {
      await this.chat(
        {
          messages: [{ role: "user", content: "Hello! Reply with 1 word." }],
          maxTokens: 5,
        },
        config
      );

      const latency = Date.now() - startTime;
      return {
        success: true,
        message: `✓ Conexão bem-sucedida com ${config.provider.toUpperCase()} (${config.model})! Latência: ${latency}ms. Pronto para conversar!`,
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

