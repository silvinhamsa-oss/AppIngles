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
      case "groq":
      case "openai":
      case "ollama":
      case "custom":
        return new OpenAICompatibleProvider();
      default:
        throw new Error(`Provedor de IA desconhecido ou não suportado: "${providerType}". Escolha entre openrouter, nvidia, groq, openai, gemini, anthropic, ollama ou custom.`);
    }
  }

  static async generate(request: ChatRequest, config: AIProviderConfig): Promise<ChatResponse> {
    const provider = this.getProviderInstance(config.provider);
    return provider.chat(request, config);
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

  static buildSystemPrompt(params: { scenarioId: string; persona: string; userLevel: string }): string {
    const { scenarioId, persona, userLevel } = params;
    const personaStyle =
      persona === "marcus"
        ? "You are Marcus, a friendly, modern American English coach from California. Your style is dynamic, encouraging, and natural."
        : "You are Sarah, an articulate and warm British English coach from Oxford/London. Your style is polished, supportive, and engaging.";

    return `${personaStyle}
You are conducting a high-impact interactive English speaking session for a student currently aiming at CEFR ${userLevel}.
Current practice scenario: "${scenarioId}".

PEDAGOGICAL RULES:
1. Speak 100% in English in your direct responses. Never switch to Portuguese unless directly explaining a tricky idiom or requested.
2. Keep your conversational turns concise (2 to 4 sentences maximum) so the student has ample opportunity to speak.
3. Always ask an open-ended question at the end of each turn to invite the student to elaborate.
4. Naturally reformulate and model better vocabulary choices in your answers without interrupting the student's flow.
5. If the student makes a minor grammar error, gently embed the correct version in your response.`;
  }
}
