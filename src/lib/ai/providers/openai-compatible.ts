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
      case "groq":
        return "https://api.groq.com/openai/v1";
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

    const candidateModels = [config.model || (config.provider === "groq" ? "llama-3.3-70b-versatile" : "meta-llama/llama-3.3-70b-instruct")];
    if (config.provider === "nvidia") {
      const nvidiaFallbacks = [
        "meta/llama-3.1-70b-instruct",
        "mistralai/mistral-large-2-instruct",
        "meta/llama-3.1-8b-instruct",
        "deepseek-ai/deepseek-r1",
      ];
      for (const m of nvidiaFallbacks) {
        if (!candidateModels.includes(m)) candidateModels.push(m);
      }
    } else if (config.provider === "groq") {
      const groqFallbacks = [
        "llama-3.3-70b-versatile",
        "llama-3.1-70b-versatile",
        "llama-3.1-8b-instant",
        "mixtral-8x7b-32768",
        "gemma2-9b-it",
      ];
      for (const m of groqFallbacks) {
        if (!candidateModels.includes(m)) candidateModels.push(m);
      }
    }

    let lastError: Error | null = null;

    for (const currentModel of candidateModels) {
      const payload = {
        model: currentModel,
        messages: request.messages,
        temperature: request.temperature ?? config.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? config.maxTokens ?? 2048,
      };

      try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        if (response.ok) {
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

        const errorText = await response.text();
        if (response.status === 410 || response.status === 404) {
          // Tenta o próximo modelo do loop caso disponível
          lastError = new Error(`O modelo '${currentModel}' não está disponível na NVIDIA (${response.status}).`);
          continue;
        } else {
          throw new Error(`AI Provider Error (${response.status}): ${errorText}`);
        }
      } catch (err) {
        if (err instanceof Error && !err.message.includes("não está disponível")) {
          throw err;
        }
        lastError = err instanceof Error ? err : new Error("Erro desconhecido");
      }
    }

    throw lastError || new Error(`Não foi possível conectar com os modelos da NVIDIA.`);
  }

  async *stream(request: ChatRequest, config: AIProviderConfig): AsyncIterable<string> {
    const baseUrl = this.getBaseUrl(config);
    const headers = this.getHeaders(config);

    const candidateModels = [config.model || (config.provider === "groq" ? "llama-3.3-70b-versatile" : "meta-llama/llama-3.3-70b-instruct")];
    if (config.provider === "nvidia") {
      const nvidiaFallbacks = [
        "meta/llama-3.1-70b-instruct",
        "mistralai/mistral-large-2-instruct",
        "meta/llama-3.1-8b-instruct",
        "deepseek-ai/deepseek-r1",
      ];
      for (const m of nvidiaFallbacks) {
        if (!candidateModels.includes(m)) candidateModels.push(m);
      }
    } else if (config.provider === "groq") {
      const groqFallbacks = [
        "llama-3.3-70b-versatile",
        "llama-3.1-70b-versatile",
        "llama-3.1-8b-instant",
        "mixtral-8x7b-32768",
        "gemma2-9b-it",
      ];
      for (const m of groqFallbacks) {
        if (!candidateModels.includes(m)) candidateModels.push(m);
      }
    }

    let activeResponse: Response | null = null;
    let lastErrorMsg = "";

    for (const currentModel of candidateModels) {
      const payload = {
        model: currentModel,
        messages: request.messages,
        temperature: request.temperature ?? config.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? config.maxTokens ?? 2048,
        stream: true,
      };

      try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        if (response.ok && response.body) {
          activeResponse = response;
          break;
        }

        const errorText = await response.text();
        if (response.status === 410 || response.status === 404) {
          lastErrorMsg = `O modelo '${currentModel}' não está disponível na sua conta NVIDIA (${response.status}).`;
          continue;
        } else {
          throw new Error(`AI Streaming Error (${response.status}): ${errorText}`);
        }
      } catch (err) {
        if (err instanceof Error && !err.message.includes("não está disponível")) {
          throw err;
        }
      }
    }

    if (!activeResponse || !activeResponse.body) {
      throw new Error(lastErrorMsg || "Nenhum dos modelos da NVIDIA respondeu. Acesse Configurações para validar sua chave.");
    }

    const reader = activeResponse.body.getReader();
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

