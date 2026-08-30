"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  HelpCircle,
  Award,
  Layers,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AudioVisualizer } from "@/components/ui/AudioVisualizer";
import { TopicSelector, SCENARIO_TOPICS, ScenarioTopic } from "@/components/talk/TopicSelector";
import { SessionReportModal, EvaluationReport } from "@/components/talk/SessionReportModal";
import { playPronunciation, startSpeechRecognition } from "@/lib/audio";
import { createClient } from "@/lib/supabase/client";
import confetti from "canvas-confetti";

interface MessageItem {
  id: string;
  sender: "ai" | "user";
  content: string;
  timestamp: string;
}

export default function TalkPage() {
  const [selectedTopic, setSelectedTopic] = useState<ScenarioTopic>(SCENARIO_TOPICS[1]); // Tech projects default
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [persona, setPersona] = useState<"sarah" | "marcus">("sarah");
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Report Modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReport | null>(null);

  const speechRecognizerRef = useRef<{ stop: () => void } | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "1",
      sender: "ai",
      content:
        "Hello Welld! Good to connect today. What are the key technical challenges you've been tackling on your current project?",
      timestamp: "14:20",
    },
  ]);

  // Sync AI configuration from Supabase if not present in local cache
  useEffect(() => {
    async function syncCloudAIConfig() {
      try {
        const local = localStorage.getItem("english-lab-ai-config");
        if (!local) {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("ai_provider, ai_api_key, ai_model, ai_base_url, ai_temperature, ai_max_tokens")
              .eq("id", user.id)
              .single();

            if (profile && (profile.ai_provider || profile.ai_api_key)) {
              localStorage.setItem(
                "english-lab-ai-config",
                JSON.stringify({
                  provider: profile.ai_provider || "openrouter",
                  apiKey: profile.ai_api_key || "",
                  model: profile.ai_model || "meta-llama/llama-3.3-70b-instruct",
                  baseUrl: profile.ai_base_url || "",
                  temperature: Number(profile.ai_temperature) || 0.7,
                  maxTokens: profile.ai_max_tokens || 2048,
                })
              );
            }
          }
        }
      } catch (err) {
        console.warn("Could not sync cloud AI config in TalkPage:", err);
      }
    }
    syncCloudAIConfig();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiSpeaking, isGenerating]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSpeakText = (text: string, msgId?: string) => {
    if (!text || typeof window === "undefined") return;

    // Se já estiver falando essa mesma mensagem, cancela/pausa
    if (isAiSpeaking && playingMessageId === msgId) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsAiSpeaking(false);
      setPlayingMessageId(null);
      return;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsAiSpeaking(true);
    if (msgId) setPlayingMessageId(msgId);

    const utter = playPronunciation(text, 0.95, persona === "sarah" ? "en-GB" : "en-US", persona);
    if (utter) {
      utter.onend = () => {
        setIsAiSpeaking(false);
        setPlayingMessageId(null);
      };
      utter.onerror = () => {
        setIsAiSpeaking(false);
        setPlayingMessageId(null);
      };
    } else {
      setTimeout(() => {
        setIsAiSpeaking(false);
        setPlayingMessageId(null);
      }, 2000);
    }
  };

  const handleToggleMute = () => {
    if (autoPlayAudio) {
      // Cancela qualquer fala ativa imediatamente
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsAiSpeaking(false);
      setPlayingMessageId(null);
      setAutoPlayAudio(false);
    } else {
      setAutoPlayAudio(true);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      speechRecognizerRef.current?.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const recognizer = startSpeechRecognition("en-US", {
        onResult: (transcript) => {
          setInputMessage(transcript);
        },
        onError: (err) => {
          console.warn("Speech recognition error:", err);
          setIsRecording(false);
        },
        onEnd: () => {
          setIsRecording(false);
        },
      });
      speechRecognizerRef.current = recognizer;
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isGenerating) return;

    if (isRecording) {
      speechRecognizerRef.current?.stop();
      setIsRecording(false);
    }

    const userText = inputMessage.trim();
    const userMsg: MessageItem = {
      id: String(Date.now()),
      sender: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage("");
    setIsGenerating(true);

    const aiMsgId = String(Date.now() + 1);
    const aiMsgPlaceholder: MessageItem = {
      id: aiMsgId,
      sender: "ai",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...newMessages, aiMsgPlaceholder]);

    try {
      const chatPayload = newMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.content,
      }));

      const savedAiConfig = localStorage.getItem("english-lab-ai-config");
      const providerConfig = savedAiConfig ? JSON.parse(savedAiConfig) : {};

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatPayload,
          providerConfig,
          level: selectedTopic.level,
          mode: selectedTopic.mode,
          topic: selectedTopic.title,
          persona,
          stream: true,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errorMsg = errData.error || errData.message || `Erro do servidor (${res.status}).`;

        // Provide more specific guidance based on HTTP status code
        let specificGuidance = "";
        if (res.status === 401) {
          specificGuidance = "\n\n🔑 Sua chave de API pode estar inválida ou expirada. Verifique-a em Configurações > Provedor de IA.";
        } else if (res.status === 402) {
          specificGuidance = "\n\n💳 Créditos esgotados. Verifique seu plano e limites de uso no provedor de IA.";
        } else if (res.status === 429) {
          specificGuidance = "\n\n⏱️ Limite de taxa excedido. Aguarde alguns minutos antes de tentar novamente ou considere atualizar seu plano.";
        } else if (res.status >= 500 && res.status < 600) {
          specificGuidance = "\n\n🌐 Problema temporário no servidor do provedor. Tente novamente em instantes.";
        } else {
          specificGuidance = "\n\n👉 Acesse o menu Configurações para validar sua chave de API e modelo.";
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? {
                  ...msg,
                  content: `⚠️ Não foi possível obter resposta da IA: ${errorMsg}${specificGuidance}`,
                }
              : msg
          )
        );
        setIsGenerating(false);
        return;
      }

      if (!res.body) {
        throw new Error("Corpo da resposta vazio.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullAiText = "";
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
          if (trimmed === "data: [DONE]") break;

          if (trimmed.startsWith("data: ")) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.error) {
                fullAiText = `⚠️ Erro do provedor de IA: ${data.error}`;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMsgId ? { ...msg, content: fullAiText } : msg
                  )
                );
              } else if (data.content) {
                fullAiText += data.content;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMsgId ? { ...msg, content: fullAiText } : msg
                  )
                );
              }
            } catch {}
          }
        }
      }

      setIsGenerating(false);
      if (autoPlayAudio && fullAiText && !fullAiText.startsWith("⚠️")) {
        handleSpeakText(fullAiText);
      }
    } catch (err: unknown) {
      console.error("AI response error:", err);
      const errorMsg = err instanceof Error ? err.message : "Erro desconhecido de conexão com a IA.";

      // Provide more specific guidance based on error message patterns
      let specificGuidance = "";
      const lowerErrorMsg = errorMsg.toLowerCase();
      if (lowerErrorMsg.includes("401") || lowerErrorMsg.includes("unauthorized") || lowerErrorMsg.includes("invalid api key")) {
        specificGuidance = "\n\n🔑 Sua chave de API pode estar inválida ou expirada. Verifique-a em Configurações > Provedor de IA.";
      } else if (lowerErrorMsg.includes("402") || lowerErrorMsg.includes("payment required") || lowerErrorMsg.includes("credits")) {
        specificGuidance = "\n\n💳 Créditos esgotados. Verifique seu plano e limites de uso no provedor de IA.";
      } else if (lowerErrorMsg.includes("429") || lowerErrorMsg.includes("rate limit") || lowerErrorMsg.includes("quota")) {
        specificGuidance = "\n\n⏱️ Limite de taxa excedido. Aguarde alguns minutos antes de tentar novamente ou considere atualizar seu plano.";
      } else if (lowerErrorMsg.includes("500") || lowerErrorMsg.includes("502") || lowerErrorMsg.includes("503") || lowerErrorMsg.includes("504")) {
        specificGuidance = "\n\n🌐 Problema temporário no servidor do provedor. Tente novamente em instantes.";
      } else {
        specificGuidance = "\n\n👉 Vá em Configurações > Provedor de IA e teste sua conexão.";
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                content: `⚠️ Falha ao se comunicar com o provedor de IA: ${errorMsg}${specificGuidance}`,
              }
            : msg
        )
      );
      setIsGenerating(false);
    }
  };

  const handleSelectTopic = (topic: ScenarioTopic) => {
    setSelectedTopic(topic);
    setIsTopicModalOpen(false);
    setMessages([
      {
        id: String(Date.now()),
        sender: "ai",
        content: `Great! We are now practicing: "${topic.title}". Let's get started whenever you are ready!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleForgotWord = () => {
    setHintMessage("💡 Dica de resgate: Quando você quer expressar 'vale a pena', use a estrutura: 'It is worth it...'");
    setTimeout(() => setHintMessage(null), 7000);
  };

  const handleEndSession = async () => {
    setIsTimerRunning(false);
    setIsEvaluating(true);

    try {
      const savedAiConfig = localStorage.getItem("english-lab-ai-config");
      const providerConfig = savedAiConfig ? JSON.parse(savedAiConfig) : {};

      const res = await fetch("/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.sender, content: m.content })),
          providerConfig,
        }),
      });

      const reportData = await res.json();
      setEvaluationReport(reportData);
      setIsReportModalOpen(true);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error("Error evaluating session:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="h-[calc(100dvh-8rem)] lg:h-[calc(100vh-8.5rem)] flex flex-col space-y-2.5 sm:space-y-3 max-w-5xl mx-auto">
      {/* Studio Audio Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 p-3 sm:p-4 rounded-3xl bg-[#0d0d14] border border-amber-500/30 shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Persona selector toggle */}
          <button
            onClick={() => setPersona(persona === "sarah" ? "marcus" : "sarah")}
            className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/50 transition-all cursor-pointer shrink-0"
            title="Alternar entre Sarah (UK) e Marcus (US)"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-black text-zinc-950 text-xs">
              {persona === "sarah" ? "GB" : "US"}
            </div>
            <div className="text-left hidden xs:block sm:block pr-1 sm:pr-2">
              <div className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                {persona === "sarah" ? "Sarah (UK)" : "Marcus (US)"}
              </div>
              <div className="text-[9px] sm:text-[10px] text-zinc-400">Clique p/ trocar</div>
            </div>
          </button>

          {/* Topic Selector Button */}
          <button
            onClick={() => setIsTopicModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 text-left transition-all cursor-pointer group min-w-0"
          >
            <Layers className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110" />
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-bold text-white flex items-center gap-1">
                <span className="truncate max-w-[100px] xs:max-w-[140px] sm:max-w-none">{selectedTopic.title}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
              </div>
              <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono truncate">
                Nível {selectedTopic.level} • {selectedTopic.mode}
              </div>
            </div>
          </button>
        </div>

        {/* Timer, Live Visualizer and Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Active Speaking Timer */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/40 border border-white/10 text-white text-[11px] sm:text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <AudioVisualizer isActive={isAiSpeaking || isRecording || isGenerating} variant={isRecording ? "emerald" : "amber"} />

          {/* Audio Auto-Play / Mute Button */}
          <button
            onClick={handleToggleMute}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              autoPlayAudio
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-500/10"
                : "bg-white/5 border-white/10 text-zinc-400 hover:text-zinc-200"
            }`}
            title={autoPlayAudio ? "Áudio automático ativado (clique para mutar)" : "Modo Mudo ativado (somente leitura de texto)"}
          >
            {autoPlayAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline font-mono">Audio On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline font-mono">Muted</span>
              </>
            )}
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleForgotWord}
            className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10 text-xs hidden md:flex"
          >
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            <span>Esqueci a palavra</span>
          </Button>

          {/* End Session Button */}
          <button
            onClick={handleEndSession}
            disabled={isEvaluating || messages.length <= 1}
            className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-zinc-950 text-[11px] sm:text-xs font-black tracking-wide shadow-md shadow-amber-500/20 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <Award className="w-3.5 h-3.5" />
            <span>{isEvaluating ? "..." : "Concluir"}</span>
          </button>
        </div>
      </div>

      {/* Hint Alert if triggered */}
      {hintMessage && (
        <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-xs text-amber-300 animate-in fade-in flex items-center justify-between shadow-lg">
          <span>{hintMessage}</span>
          <button onClick={() => setHintMessage(null)} className="text-amber-400 hover:text-amber-200">✕</button>
        </div>
      )}

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-hidden p-3 sm:p-5 rounded-3xl bg-[#09090e] border border-white/10 shadow-2xl flex flex-col justify-between min-h-0">
        <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-1 scroll-smooth">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 sm:gap-3.5 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === "user"
                    ? "bg-[#181822] text-white border border-white/15"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}
              >
                {msg.sender === "user" ? "EU" : "AI"}
              </div>

              {/* Speech Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-xl rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold rounded-tr-none shadow-lg shadow-amber-500/20"
                    : "bg-[#13131b] border border-white/10 text-white rounded-tl-none"
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  {msg.content ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : isGenerating && msg.id === messages[messages.length - 1].id ? (
                    <div className="flex items-center gap-2 text-amber-300/90 font-mono text-xs py-1">
                      <span className="animate-pulse">
                        {persona === "sarah" ? "Sarah" : "Marcus"} is thinking...
                      </span>
                      <span className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                      </span>
                    </div>
                  ) : null}

                  {msg.sender === "ai" && msg.content && (
                    <button
                      type="button"
                      onClick={() => handleSpeakText(msg.content, msg.id)}
                      className={`p-1 sm:p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 mt-0.5 ${
                        playingMessageId === msg.id && isAiSpeaking
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "text-zinc-400 hover:text-amber-300 hover:bg-white/5"
                      }`}
                      title={playingMessageId === msg.id && isAiSpeaking ? "Pausar áudio" : "Ouvir pronúncia desta frase"}
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${playingMessageId === msg.id && isAiSpeaking ? "animate-pulse text-amber-400" : ""}`} />
                    </button>
                  )}
                </div>
                <div
                  className={`text-[9px] sm:text-[10px] mt-1.5 font-mono ${
                    msg.sender === "user" ? "text-zinc-950/70" : "text-zinc-500"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar with Speech-to-Text */}
        <form onSubmit={handleSendMessage} className="pt-3 sm:pt-4 border-t border-white/10 flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleRecording}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              isRecording
                ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40 ring-4 ring-red-500/20"
                : "bg-white/5 hover:bg-white/10 border border-white/10 text-amber-400 hover:text-amber-300"
            }`}
            title={isRecording ? "Stop Recording" : "Speak in English (Speech-to-Text)"}
          >
            {isRecording ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          <input
            type="text"
            placeholder={
              isRecording
                ? "Listening to you speak in English..."
                : isGenerating
                ? `${persona === "sarah" ? "Sarah" : "Marcus"} is thinking...`
                : "Type in English or tap mic to speak..."
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isGenerating}
            className="flex-1 min-w-0 bg-[#13131b] border border-white/10 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40"
          />

          <Button
            type="submit"
            variant="gold"
            size="icon"
            disabled={!inputMessage.trim() || isGenerating}
            isLoading={isGenerating}
            className="shrink-0 w-10 h-10 sm:w-11 sm:h-11"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* Topic Selection Modal */}
      {isTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[85dvh] flex flex-col rounded-3xl bg-[#0b0b10] border border-amber-500/40 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0e0e16]">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Selecione o Tema ou Cenário</h3>
                <p className="text-[11px] sm:text-xs text-zinc-400">Escolha o tópico para guiar as perguntas do seu tutor de IA.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsTopicModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
              <TopicSelector
                selectedTopicId={selectedTopic.id}
                onSelectTopic={handleSelectTopic}
              />
            </div>
          </div>
        </div>
      )}

      {/* Post-Session Evaluation Report Modal */}
      <SessionReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        report={evaluationReport}
        durationMinutes={Math.max(1, Math.round(secondsElapsed / 60))}
      />
    </div>
  );
}
