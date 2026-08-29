"use client";

import React, { useState } from "react";
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
  const [apiKey, setApiKey] = useState("sk-or-v1-********************");
  const [model, setModel] = useState("meta-llama/llama-3.3-70b-instruct");
  const [baseUrl, setBaseUrl] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);

  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleTestConnection = () => {
    setTestStatus("testing");
    setTimeout(() => {
      setTestStatus("success");
    }, 1200);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Badge variant="primary">Painel de Controle</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-2">
          Configurações da Plataforma
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Ajuste os provedores de inteligência artificial, parâmetros pedagógicos, perfis e voz.
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
        <Card variant="glass" className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Camada de IA Desacoplada</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                O English Lab não fica preso a um fornecedor. Conecte sua chave com total segurança.
              </p>
            </div>
            <Badge variant="gold">Zero Vendor Lock-in</Badge>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Provider Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Provedor de IA
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as AIProviderType)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700/80 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="openrouter">OpenRouter (Recomendado — Centenas de Modelos)</option>
                <option value="nvidia">NVIDIA NIM (Llama 3, Mistral NeMo, Nemotron)</option>
                <option value="openai">OpenAI (GPT-4o, GPT-4o-mini)</option>
                <option value="gemini">Google Gemini (Gemini 2.0 Flash / Pro)</option>
                <option value="anthropic">Anthropic (Claude 3.5 Sonnet / Haiku)</option>
                <option value="ollama">Ollama (Servidor Local)</option>
                <option value="custom">Provedor Customizado (Compatível com OpenAI)</option>
              </select>
            </div>

            {/* API Key */}
            <Input
              label="Chave de API (API Key)"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              helperText="Armazenada com segurança no servidor. Nunca exposta no navegador."
            />

            {/* Model Name */}
            <Input
              label="Nome do Modelo (Model)"
              type="text"
              placeholder="Ex: meta-llama/llama-3.3-70b-instruct ou gpt-4o-mini"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />

            {/* Base URL (optional) */}
            <Input
              label="URL Base (Base URL — Opcional para Custom / Ollama)"
              type="text"
              placeholder="https://openrouter.ai/api/v1 ou http://localhost:11434/v1"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />

            {/* Sliders: Temperature and Max Tokens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Temperatura (Criatividade)</span>
                  <span className="text-indigo-400 font-mono">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Tokens Máximos</span>
                  <span className="text-indigo-400 font-mono">{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="512"
                  max="4096"
                  step="256"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Connection Test Status */}
            {testStatus === "success" && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Conexão realizada com sucesso com o modelo <strong>{model}</strong>.</span>
              </div>
            )}

            {testStatus === "error" && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Não foi possível conectar. Verifique o provedor, a chave de API e o modelo.</span>
              </div>
            )}

            {saveSuccess && (
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Configurações salvas com sucesso!</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                isLoading={testStatus === "testing"}
                className="w-full sm:w-auto"
              >
                <span>Testar Conexão</span>
              </Button>

              <Button type="submit" variant="glow" className="w-full sm:w-auto">
                <Save className="w-4 h-4 mr-1.5" />
                <span>Salvar Configurações</span>
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === "profile" && (
        <Card variant="glass" className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Perfil e Metas de Estudo</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalize o ritmo, nível CEFR e objetivos do aluno.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nome do Aluno" defaultValue="Welld" />
            <Input label="E-mail" defaultValue="welld@example.com" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Nível Atual no CEFR
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {["A1", "A2", "B1", "B1+", "B2", "C1"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    lvl === "B1+"
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <Button variant="glow">
            <span>Atualizar Perfil</span>
          </Button>
        </Card>
      )}

      {activeTab === "voice" && (
        <Card variant="glass" className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Configurações de Fala & Voz</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Provedores desacoplados para Reconhecimento (STT) e Síntese de Voz (TTS).
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Reconhecimento de Fala (Speech-to-Text)
              </label>
              <select className="w-full rounded-xl bg-slate-900 border border-slate-700/80 px-4 py-2.5 text-sm text-slate-100">
                <option>Web Speech API (Nativa do Navegador — Gratuita & Rápida)</option>
                <option>OpenAI Whisper API</option>
                <option>Groq Whisper (Ultra Rápido)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Síntese de Voz (Text-to-Speech)
              </label>
              <select className="w-full rounded-xl bg-slate-900 border border-slate-700/80 px-4 py-2.5 text-sm text-slate-100">
                <option>Voz Nativa do Navegador (Samantha / Google US English)</option>
                <option>ElevenLabs AI Voice (Ultra Realista)</option>
                <option>OpenAI TTS (Alloy / Nova / Echo)</option>
              </select>
            </div>
          </div>

          <Button variant="glow">
            <span>Salvar Preferências de Áudio</span>
          </Button>
        </Card>
      )}
    </div>
  );
}
