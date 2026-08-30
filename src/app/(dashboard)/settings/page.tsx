"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import {
  Cpu,
  User,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Save,
  RefreshCw,
  Sparkles,
  ListFilter,
  Zap,
} from "lucide-react";
import { AIProviderType } from "@/types/ai";
import { CEFRLevel } from "@/types/profile";
import { createClient } from "@/lib/supabase/client";

function getSavedAIConfig() {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("english-lab-ai-config");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

const NVIDIA_RECOMMENDED_MODELS = [
  { id: "meta/llama-3.1-70b-instruct", label: "Llama 3.1 70B (Recomendado)", badge: "Conversação Natural" },
  { id: "mistralai/mistral-large-2-instruct", label: "Mistral Large 2", badge: "Vocabulário Rico" },
  { id: "meta/llama-3.1-8b-instruct", label: "Llama 3.1 8B", badge: "Ultra Rápido" },
  { id: "deepseek-ai/deepseek-r1", label: "DeepSeek R1", badge: "Raciocínio Profundo" },
  { id: "qwen/qwen2.5-72b-instruct", label: "Qwen 2.5 72B", badge: "Fluência Global" },
  { id: "google/gemma-2-27b-it", label: "Gemma 2 27B", badge: "Google" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === "undefined") return "ai";
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    return tabParam && ["ai", "profile", "voice"].includes(tabParam) ? tabParam : "ai";
  });

  // AI Configuration State with lazy initializers
  const [provider, setProvider] = useState<AIProviderType>(() => getSavedAIConfig()?.provider || "openrouter");
  const [apiKey, setApiKey] = useState<string>(() => getSavedAIConfig()?.apiKey || "");
  const [model, setModel] = useState<string>(() => getSavedAIConfig()?.model || "meta/llama-3.1-70b-instruct");
  const [baseUrl, setBaseUrl] = useState<string>(() => getSavedAIConfig()?.baseUrl || "");
  const [temperature, setTemperature] = useState<number>(() => getSavedAIConfig()?.temperature ?? 0.7);
  const [maxTokens, setMaxTokens] = useState<number>(() => getSavedAIConfig()?.maxTokens ?? 2048);

  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testFeedback, setTestFeedback] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Dynamic Models State
  const [fetchedModels, setFetchedModels] = useState<{ id: string; name?: string; latencyMs?: number }[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [modelsFeedback, setModelsFeedback] = useState<string | null>(null);
  const [isCustomModelInput, setIsCustomModelInput] = useState(false);

  // Profile States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>("B1+");
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(20);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Voice States
  const [sttProvider, setSttProvider] = useState("web-speech");
  const [ttsVoice, setTtsVoice] = useState("browser-samantha");
  const [voiceSaveSuccess, setVoiceSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadUserProfileAndAIConfig() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setEmail(user.email || "");
          setFullName(user.user_metadata?.full_name || "");
          if (user.user_metadata?.cefr_level) {
            setCefrLevel(user.user_metadata.cefr_level as CEFRLevel);
          }

          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile) {
            if (profile.full_name) setFullName(profile.full_name);
            if (profile.email) setEmail(profile.email);
            if (profile.cefr_level) setCefrLevel(profile.cefr_level as CEFRLevel);
            if (profile.daily_goal_minutes) setDailyGoalMinutes(profile.daily_goal_minutes);

            // Carrega chaves e configurações de IA salvas na nuvem (Supabase)
            if (profile.ai_provider) setProvider(profile.ai_provider as AIProviderType);
            if (profile.ai_api_key) setApiKey(profile.ai_api_key);
            if (profile.ai_model) setModel(profile.ai_model);
            if (profile.ai_base_url) setBaseUrl(profile.ai_base_url);
            if (profile.ai_temperature !== undefined && profile.ai_temperature !== null) {
              setTemperature(Number(profile.ai_temperature));
            }
            if (profile.ai_max_tokens) setMaxTokens(profile.ai_max_tokens);

            // Sincroniza também no cache local
            if (profile.ai_provider || profile.ai_api_key) {
              localStorage.setItem(
                "english-lab-ai-config",
                JSON.stringify({
                  provider: profile.ai_provider || "openrouter",
                  apiKey: profile.ai_api_key || "",
                  model: profile.ai_model || "meta/llama-3.1-70b-instruct",
                  baseUrl: profile.ai_base_url || "",
                  temperature: Number(profile.ai_temperature) || 0.7,
                  maxTokens: profile.ai_max_tokens || 2048,
                })
              );
            }
          }
        }
      } catch (err) {
        console.error("Error loading user profile & AI config in settings:", err);
      }
    }

    loadUserProfileAndAIConfig();
  }, []);

  const handleProviderChange = (newProvider: AIProviderType) => {
    setProvider(newProvider);
    setFetchedModels([]);
    setModelsFeedback(null);
    if (newProvider === "nvidia") {
      setModel("meta/llama-3.1-70b-instruct");
      setBaseUrl("https://integrate.api.nvidia.com/v1");
    } else if (newProvider === "openrouter") {
      setModel("meta-llama/llama-3.3-70b-instruct");
      setBaseUrl("");
    } else if (newProvider === "openai") {
      setModel("gpt-4o-mini");
      setBaseUrl("");
    } else if (newProvider === "gemini") {
      setModel("gemini-2.0-flash");
      setBaseUrl("");
    } else if (newProvider === "anthropic") {
      setModel("claude-3-5-sonnet-20241022");
      setBaseUrl("");
    } else if (newProvider === "ollama") {
      setModel("llama3.2");
      setBaseUrl("http://localhost:11434/v1");
    }
  };

  const handleAutoDetectOnlineModels = async () => {
    if (!apiKey && provider !== "ollama") {
      setModelsFeedback("Cole sua chave de API primeiro para testar os modelos.");
      return;
    }

    setIsAutoDetecting(true);
    setModelsFeedback(null);

    try {
      const res = await fetch("/api/ai/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey,
          baseUrl,
          action: "auto-detect",
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.onlineModels) && data.onlineModels.length > 0) {
        setFetchedModels(data.onlineModels);
        if (data.bestModel) {
          setModel(data.bestModel);
        }
        setModelsFeedback(`✓ Sucesso! ${data.onlineModels.length} modelo(s) de chat ativos encontrados e validados na sua conta! Selecionamos: ${data.bestModel}`);
      } else {
        setModelsFeedback(data.message || data.error || "Nenhum modelo respondeu com sucesso.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao auto-detectar modelos.";
      setModelsFeedback(message);
    } finally {
      setIsAutoDetecting(false);
    }
  };

  const handleFetchAvailableModels = async () => {
    if (!apiKey && provider !== "ollama") {
      setModelsFeedback("Cole sua chave de API acima para listar os modelos disponíveis.");
      return;
    }

    setIsLoadingModels(true);
    setModelsFeedback(null);

    try {
      const res = await fetch("/api/ai/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey,
          baseUrl,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.models) && data.models.length > 0) {
        setFetchedModels(data.models);
        setModelsFeedback(`✓ ${data.models.length} modelos de chat encontrados na sua conta do provedor.`);
      } else {
        setModelsFeedback(data.error || "Nenhum modelo retornado pelo provedor.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao buscar modelos do provedor.";
      setModelsFeedback(message);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const getApiKeyPlaceholder = () => {
    switch (provider) {
      case "nvidia":
        return "Cole sua chave NVIDIA (nvapi-...)";
      case "openrouter":
        return "Cole sua chave OpenRouter (sk-or-v1-...)";
      case "openai":
        return "Cole sua chave OpenAI (sk-proj-...)";
      case "gemini":
        return "Cole sua chave Google Gemini (AIzaSy...)";
      case "anthropic":
        return "Cole sua chave Anthropic (sk-ant-...)";
      case "ollama":
        return "Opcional para servidor Ollama Local";
      default:
        return "Cole sua chave de API (sk-...)";
    }
  };

  const handleTestConnection = async () => {
    setTestStatus("testing");
    setTestFeedback("");

    try {
      const res = await fetch("/api/ai/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey,
          model,
          baseUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestStatus("success");
        setTestFeedback(data.message || "Conexão realizada com sucesso!");
      } else {
        setTestStatus("error");
        setTestFeedback(data.message || "Não foi possível conectar com o provedor.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro de rede ao testar conexão.";
      setTestStatus("error");
      setTestFeedback(message);
    }
  };

  const handleSaveAIConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      provider,
      apiKey,
      model,
      baseUrl,
      temperature,
      maxTokens,
    };

    // 1. Salva no cache local (navegador)
    localStorage.setItem("english-lab-ai-config", JSON.stringify(config));

    // 2. Salva na nuvem (Supabase) para persistir mesmo após novos deploys
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            email: user.email,
            ai_provider: provider,
            ai_api_key: apiKey,
            ai_model: model,
            ai_base_url: baseUrl,
            ai_temperature: temperature,
            ai_max_tokens: maxTokens,
            updated_at: new Date().toISOString(),
          });
      }
    } catch (err) {
      console.warn("Could not persist AI config to Supabase profiles:", err);
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileFeedback(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      // 1. Update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: email || user.email,
          full_name: fullName,
          cefr_level: cefrLevel,
          daily_goal_minutes: dailyGoalMinutes,
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.warn("Could not upsert profile table, updating auth metadata:", profileError);
      }

      // 2. Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          cefr_level: cefrLevel,
        },
      });

      if (authError) {
        throw authError;
      }

      setProfileFeedback({
        type: "success",
        message: "Perfil atualizado com sucesso! Suas alterações já estão ativas.",
      });
      setTimeout(() => setProfileFeedback(null), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar perfil.";
      setProfileFeedback({
        type: "error",
        message,
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveVoiceConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      "english-lab-voice-config",
      JSON.stringify({ sttProvider, ttsVoice })
    );
    setVoiceSaveSuccess(true);
    setTimeout(() => setVoiceSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Badge variant="gold">Painel de Controle</Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
          Configurações da Plataforma
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Configure seus provedores de IA, parâmetros pedagógicos e preferências de voz.
        </p>
      </div>

      <Tabs
        tabs={[
          { id: "ai", label: "Provedor de IA", icon: <Cpu className="w-4 h-4" /> },
          { id: "profile", label: "Perfil & Nível CEFR", icon: <User className="w-4 h-4" /> },
          { id: "voice", label: "Voz & Áudio", icon: <Volume2 className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* TAB 1: AI ROUTER CONFIG */}
      {activeTab === "ai" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-lg font-bold text-white">Camada de IA Desacoplada (AI Router)</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 font-normal">
                Conecte seu provedor de preferência com segurança. As chaves são salvas no seu banco Supabase e no dispositivo para não se perderem em novos deploys.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveAIConfig} className="space-y-5">
            {/* Provider Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
                Provedor de IA
              </label>
              <select
                value={provider}
                onChange={(e) => handleProviderChange(e.target.value as AIProviderType)}
                className="w-full rounded-2xl bg-[#14141e] border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="openrouter">OpenRouter (Mais de 100 modelos — Recomendado)</option>
                <option value="nvidia">NVIDIA NIM (Llama 3.3 70B, Nemotron, Mistral)</option>
                <option value="openai">OpenAI (GPT-4o, GPT-4o-mini)</option>
                <option value="gemini">Google Gemini (Gemini 2.0 Flash)</option>
                <option value="anthropic">Anthropic (Claude 3.5 Sonnet / Haiku)</option>
                <option value="ollama">Ollama (Servidor Local no PC)</option>
                <option value="custom">Provedor Customizado (Compatível com OpenAI)</option>
              </select>
            </div>

            {/* API Key */}
            <Input
              label="Chave de API (API Key)"
              type="password"
              placeholder={getApiKeyPlaceholder()}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              helperText="Persistida de forma segura no Supabase e no cache local do seu navegador."
            />

            {/* Model Selection & Dynamic Fetcher */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
                  Modelo de IA ({provider.toUpperCase()})
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {provider === "nvidia" && (
                    <button
                      type="button"
                      onClick={handleAutoDetectOnlineModels}
                      disabled={isAutoDetecting || isLoadingModels}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-mono font-bold transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-amber-500/20"
                    >
                      <Zap className={`w-3.5 h-3.5 ${isAutoDetecting ? "animate-bounce text-zinc-950" : ""}`} />
                      <span>{isAutoDetecting ? "Testando Modelos..." : "⚡ Auto-Detectar Ativo"}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleFetchAvailableModels}
                    disabled={isLoadingModels || isAutoDetecting}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingModels ? "animate-spin text-amber-400" : ""}`} />
                    <span>{isLoadingModels ? "Consultando..." : "Listar Todos"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCustomModelInput(!isCustomModelInput)}
                    className="text-[11px] text-zinc-400 hover:text-white underline font-mono"
                  >
                    {isCustomModelInput ? "Usar Lista" : "Digitar Manual"}
                  </button>
                </div>
              </div>

              {modelsFeedback && (
                <div className={`p-3 rounded-2xl text-xs font-mono flex items-center gap-2.5 ${
                  modelsFeedback.startsWith("✓") 
                    ? "bg-emerald-500/15 border border-emerald-400/30 text-emerald-300"
                    : "bg-amber-500/15 border border-amber-400/30 text-amber-300"
                }`}>
                  <ListFilter className="w-4 h-4 shrink-0" />
                  <span>{modelsFeedback}</span>
                </div>
              )}

              {/* Dynamic Select if fetched from API */}
              {fetchedModels.length > 0 && !isCustomModelInput ? (
                <div className="space-y-1.5">
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full rounded-2xl bg-[#14141e] border border-amber-500/40 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 font-mono shadow-lg shadow-amber-500/5"
                  >
                    {fetchedModels.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id} {m.latencyMs ? `(${m.latencyMs}ms - Online)` : ""}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-emerald-400 font-mono">
                    ✓ {fetchedModels.length} modelos sincronizados diretamente da sua conta do provedor.
                  </p>
                </div>
              ) : (
                <Input
                  type="text"
                  placeholder="Ex: meta/llama-3.1-70b-instruct"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  helperText="Use o botão '⚡ Auto-Detectar Ativo' ou selecione um dos presets abaixo."
                />
              )}

              {/* Recommended Presets for NVIDIA */}
              {provider === "nvidia" && (
                <div className="pt-2 space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-zinc-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Modelos de Conversação em Alta (Clique para Escolher):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {NVIDIA_RECOMMENDED_MODELS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setModel(item.id);
                          setTestStatus("idle");
                          setTestFeedback("");
                        }}
                        className={`p-3 rounded-2xl border text-xs font-mono transition-all flex flex-col justify-between gap-1 text-left cursor-pointer ${
                          model === item.id
                            ? "bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/20 font-bold"
                            : "bg-[#14141e] border-white/10 text-zinc-300 hover:border-white/30 hover:bg-[#181824]"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold">{item.label}</span>
                          {model === item.id && <span className="text-[10px] text-amber-400">✓ Ativo</span>}
                        </div>
                        <span className="text-[10px] text-zinc-400">
                          {item.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Base URL */}
            <Input
              label="URL Base (Base URL — Opcional)"
              type="text"
              placeholder={provider === "ollama" ? "http://localhost:11434/v1" : "https://api..."}
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />

            {/* Sliders: Temperature and Max Tokens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-300">Temperatura (Criatividade)</span>
                  <span className="text-amber-400 font-mono">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-300">Tokens Máximos</span>
                  <span className="text-amber-400 font-mono">{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="512"
                  max="4096"
                  step="256"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Connection Test Status Feedback */}
            {testStatus === "success" && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2.5 shadow-lg">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>{testFeedback}</span>
              </div>
            )}

            {testStatus === "error" && (
              <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-xs text-red-300 flex items-center gap-2.5 shadow-lg">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                <span>{testFeedback}</span>
              </div>
            )}

            {saveSuccess && (
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-xs text-amber-300 flex items-center gap-2.5 shadow-lg">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-amber-400" />
                <span>Configurações de IA salvas com sucesso!</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                isLoading={testStatus === "testing"}
                className="w-full sm:w-auto"
              >
                <span>Testar Conexão</span>
              </Button>

              <Button type="submit" variant="gold" className="w-full sm:w-auto">
                <Save className="w-4 h-4 mr-1.5" />
                <span>Salvar Configurações de IA</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: PROFILE AND CEFR GOALS */}
      {activeTab === "profile" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-white/10 shadow-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Perfil e Metas de Estudo</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Personalize seu nome, nível CEFR atual e meta diária de estudo.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nome do Aluno"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome"
                required
              />
              <Input
                label="E-mail"
                value={email}
                disabled
                placeholder="seu@email.com"
                helperText="O e-mail é vinculado à sua conta Supabase."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
                Nível Atual no CEFR
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                {(["A1", "A2", "B1", "B1+", "B2", "C1", "C2"] as CEFRLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCefrLevel(lvl)}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      cefrLevel === lvl
                        ? "bg-amber-500 border-amber-400 text-zinc-950 shadow-md shadow-amber-500/20"
                        : "bg-[#14141e] border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-300">Meta Diária de Prática</span>
                <span className="text-amber-400 font-mono font-bold">{dailyGoalMinutes} minutos / dia</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {profileFeedback && (
              <div
                className={`p-4 rounded-2xl border text-xs flex items-center gap-2.5 shadow-lg ${
                  profileFeedback.type === "success"
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                    : "bg-red-500/15 border-red-500/40 text-red-300"
                }`}
              >
                {profileFeedback.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                )}
                <span>{profileFeedback.message}</span>
              </div>
            )}

            <Button type="submit" variant="gold" isLoading={isSavingProfile}>
              <Save className="w-4 h-4 mr-1.5" />
              <span>Salvar Alterações do Perfil</span>
            </Button>
          </form>
        </div>
      )}

      {/* TAB 3: VOICE CONFIG */}
      {activeTab === "voice" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-white/10 shadow-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Configurações de Fala & Áudio</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Preferências de reconhecimento de fala (STT) e síntese de voz (TTS).
            </p>
          </div>

          <form onSubmit={handleSaveVoiceConfig} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
                  Reconhecimento de Fala (Speech-to-Text)
                </label>
                <select
                  value={sttProvider}
                  onChange={(e) => setSttProvider(e.target.value)}
                  className="w-full rounded-2xl bg-[#14141e] border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="web-speech">Web Speech API (Nativa do Navegador — Gratuita & Rápida)</option>
                  <option value="whisper">OpenAI Whisper API</option>
                  <option value="groq">Groq Whisper (Ultra Baixa Latência)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
                  Síntese de Voz (Text-to-Speech)
                </label>
                <select
                  value={ttsVoice}
                  onChange={(e) => setTtsVoice(e.target.value)}
                  className="w-full rounded-2xl bg-[#14141e] border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="browser-samantha">Voz Nativa do Navegador (Samantha / Daniel UK / Google US)</option>
                  <option value="elevenlabs">ElevenLabs AI Voice (Ultra Realista)</option>
                  <option value="openai-alloy">OpenAI TTS (Alloy / Nova / Echo)</option>
                </select>
              </div>
            </div>

            {voiceSaveSuccess && (
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-xs text-amber-300 flex items-center gap-2.5 shadow-lg">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-amber-400" />
                <span>Preferências de áudio salvas com sucesso!</span>
              </div>
            )}

            <Button type="submit" variant="gold">
              <Save className="w-4 h-4 mr-1.5" />
              <span>Salvar Preferências de Áudio</span>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
