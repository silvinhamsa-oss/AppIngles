export type AIProviderType =
  | "openrouter"
  | "nvidia"
  | "openai"
  | "gemini"
  | "anthropic"
  | "ollama"
  | "custom";

export interface AIProviderConfig {
  provider: AIProviderType;
  apiKey?: string;
  model: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ChatResponse {
  content: string;
  finishReason?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIProvider {
  chat(request: ChatRequest, config: AIProviderConfig): Promise<ChatResponse>;
  stream?(request: ChatRequest, config: AIProviderConfig): AsyncIterable<string>;
  testConnection(config: AIProviderConfig): Promise<{ success: boolean; message: string }>;
}
