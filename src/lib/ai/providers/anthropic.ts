import { AIProvider, AIProviderConfig, ChatRequest, ChatResponse } from "../types";

export class AnthropicProvider implements AIProvider {
  async chat(request: ChatRequest, config: AIProviderConfig): Promise<ChatResponse> {
    const apiKey = config.apiKey || "";
    const systemMessage = request.messages.find((m) => m.role === "system");
    const userAndAssistantMessages = request.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    interface AnthropicPayload {
      model: string;
      max_tokens: number;
      temperature: number;
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      system?: string;
    }

    const payload: AnthropicPayload = {
      model: config.model || "claude-3-5-sonnet-20241022",
      max_tokens: request.maxTokens ?? config.maxTokens ?? 2048,
      temperature: request.temperature ?? config.temperature ?? 0.7,
      messages: userAndAssistantMessages,
    };

    if (systemMessage) {
      payload.system = systemMessage.content;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic Claude Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || "";

    return {
      content,
      finishReason: data.stop_reason,
      usage: data.usage
        ? {
            promptTokens: data.usage.input_tokens,
            completionTokens: data.usage.output_tokens,
            totalTokens: data.usage.input_tokens + data.usage.output_tokens,
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
        message: `Conexão bem-sucedida com Anthropic Claude (${config.model || "claude-3-5-sonnet"}).`,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Falha ao conectar com a API Anthropic.";
      return {
        success: false,
        message,
      };
    }
  }
}

