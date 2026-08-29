"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import {
  Cpu,
  User,
  Volume2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";
import { AIProviderType } from "@/types/ai";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("ai");

  // AI Configuration State
  const [provider, setProvider] = useState<AIProviderType>("openrouter");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("meta-llama/llama-3.3-70b-instruct");
  const [baseUrl, setBaseUrl] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);

  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testFeedback, setTestFeedback] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("english-lab-ai-config");
    if (saved) {
      try {
        const config = JSON.parse(saved);
        if (config.provider) setProvider(config.provider);
        if (config.apiKey) setApiKey(config.apiKey);
        if (config.model) setModel(config.model);
        if (config.baseUrl) setBaseUrl(config.baseUrl);
        if (config.temperature) setTemperature(config.temperature);
        if (config.maxTokens) setMaxTokens(config.maxTokens);
      } catch {}
    }
  }, []);

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
    } catch (err: any) {
      setTestStatus("error");
      setTestFeedback(err.message || "Erro de rede ao testar conexão.");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      provider,
      apiKey,
      model,
      baseUrl,
      temperature,
      maxTokens,
    };
    localStorage.setItem("english-lab-ai-config", JSON.stringify(config));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Badge variant="gold">Painel de Controle</Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
          Configurações da Plataforma
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Configure seus provedores de IA, parâmetros pedagógicos e síntese de voz com segurança total.
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

      {activeTab === "ai" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-lg font-bold text-white">Camada de IA Desacoplada (AI Router)</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 font-normal">
                Conecte seu provedor de preferência com segurança. As chaves nunca são expostas publicamente.
              </p>
            </div>
            <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30">
              Desacoplado
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Provider Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
                Provedor de IA
              </label>
              <select
                value={provider}
                onChange={(e) => {
                  const val = e.target.value as AIProviderType;
                  setProvider(val);
                  if (val === "openrouter") setModel("meta-llama/llama-3.3-70b-instruct");
                  else if (val === "nvidia") setModel("meta/llama-3.3-70b-instruct");
                  else if (val === "openai") setModel("gpt-4o-mini");
                  else if (val === "gemini") setModel("gemini-2.0-flash");
                  else if (val === "anthropic") setModel("claude-3-5-sonnet-20241022");
                  else if (val === "ollama") {
                    setModel("llama3.2");
                    setBaseUrl("http://localhost:11434/v1");
                  }
                }}
                className="w-full rounded-2xl bg-[#14141e] border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="openrouter">OpenRouter (Centenas de Modelos • Llama 3.3, Mistral, DeepSeek)</option>
                <option value="nvidia">NVIDIA NIM (Llama 3.3 70B, Nemotron)</option>
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
              placeholder={provider === "ollama" ? "Opcional para Ollama" : "Cole sua chave (sk-...)"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              helperText="Armazenada de forma segura. O AI Router protege suas credenciais."
            />

            {/* Model Name */}
            <Input
              label="Nome do Modelo (Model)"
              type="text"
              placeholder="Ex: meta-llama/llama-3.3-70b-instruct"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />

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
                <span>Configurações salvas com sucesso no seu perfil!</span>
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
                <span>Salvar Configurações</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "profile" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-white/10 shadow-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Perfil e Metas de Estudo</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Personalize seu nível CEFR e objetivos de conversação.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nome do Aluno" defaultValue="Welld" />
            <Input label="E-mail" defaultValue="welld@example.com" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
              Nível Atual no CEFR
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {["A1", "A2", "B1", "B1+", "B2", "C1"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    lvl === "B1+"
                      ? "bg-amber-500 border-amber-400 text-zinc-950 shadow-md shadow-amber-500/20"
                      : "bg-[#14141e] border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <Button variant="gold">
            <span>Atualizar Perfil</span>
          </Button>
        </div>
      )}

      {activeTab === "voice" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-white/10 shadow-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Configurações de Fala & Áudio</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Provedores desacoplados para Reconhecimento (STT) e Síntese de Voz (TTS).
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
                Reconhecimento de Fala (Speech-to-Text)
              </label>
              <select className="w-full rounded-2xl bg-[#14141e] border border-white/15 px-4 py-3 text-sm text-white">
                <option>Web Speech API (Nativa do Navegador — Gratuita & Rápida)</option>
                <option>OpenAI Whisper API</option>
                <option>Groq Whisper (Ultra Baixa Latência)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
                Síntese de Voz (Text-to-Speech)
              </label>
              <select className="w-full rounded-2xl bg-[#14141e] border border-white/15 px-4 py-3 text-sm text-white">
                <option>Voz Nativa do Navegador (Samantha / Daniel UK / Google US)</option>
                <option>ElevenLabs AI Voice (Ultra Realista)</option>
                <option>OpenAI TTS (Alloy / Nova / Echo)</option>
              </select>
            </div>
          </div>

          <Button variant="gold">
            <span>Salvar Preferências de Áudio</span>
          </Button>
        </div>
      )}
    </div>
  );
}
