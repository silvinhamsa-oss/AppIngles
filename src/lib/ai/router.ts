import { AIProvider, AIProviderConfig, ChatRequest, ChatResponse } from "./types";
import { OpenAICompatibleProvider } from "./providers/openai-compatible";
import { GeminiProvider } from "./providers/gemini";
import { AnthropicProvider } from "./providers/anthropic";

export class AIRouter {
  private static getProviderInstance(providerType: string): AIProvider {
    switch (providerType) {
      case "gemini":
        return new GeminiProvider();
      case "anthropic":
        return new AnthropicProvider();
      case "openrouter":
      case "nvidia":
      case "openai":
      case "ollama":
      case "custom":
      default:
        return new OpenAICompatibleProvider();
    }
  }

  static async chat(request: ChatRequest, config: AIProviderConfig): Promise<ChatResponse> {
    const provider = this.getProviderInstance(config.provider);
    return provider.chat(request, config);
  }

  static async *stream(request: ChatRequest, config: AIProviderConfig): AsyncIterable<string> {
    const provider = this.getProviderInstance(config.provider);
    if (provider.stream) {
      yield* provider.stream(request, config);
    } else {
      const response = await provider.chat(request, config);
      yield response.content;
    }
  }

  static async testConnection(config: AIProviderConfig): Promise<{ success: boolean; message: string }> {
    const provider = this.getProviderInstance(config.provider);
    return provider.testConnection(config);
  }
}
