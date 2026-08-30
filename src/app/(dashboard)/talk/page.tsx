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

  const handleSpeakText = (text: string) => {
    setIsAiSpeaking(true);
    const utter = playPronunciation(text, 0.95, persona === "sarah" ? "en-GB" : "en-US");
    if (utter) {
      utter.onend = () => setIsAiSpeaking(false);
      utter.onerror = () => setIsAiSpeaking(false);
    } else {
      setTimeout(() => setIsAiSpeaking(false), 2000);
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

      if (!res.ok || !res.body) {
        throw new Error("Erro na resposta do servidor.");
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
              if (data.content) {
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
      if (autoPlayAudio && fullAiText) {
        handleSpeakText(fullAiText);
      }
    } catch (err) {
      console.error("AI response error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                content:
                  "I understand what you mean! Developing fluency takes constant repetition and natural interaction. What would you like to explore next?",
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
    <div className="h-[calc(100vh-8.5rem)] flex flex-col space-y-3 max-w-5xl mx-auto">
      {/* Studio Audio Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-[#0d0d14] border border-amber-500/30 shadow-lg">
        <div className="flex items-center gap-3">
          {/* Persona selector toggle */}
          <button
            onClick={() => setPersona(persona === "sarah" ? "marcus" : "sarah")}
            className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/50 transition-all cursor-pointer"
            title="Alternar entre Sarah (UK) e Marcus (US)"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-black text-zinc-950 text-xs">
              {persona === "sarah" ? "GB" : "US"}
            </div>
            <div className="text-left hidden sm:block pr-2">
              <div className="text-xs font-bold text-white leading-tight">
                {persona === "sarah" ? "Sarah (UK)" : "Marcus (US)"}
              </div>
              <div className="text-[10px] text-zinc-400">Clique p/ trocar</div>
            </div>
          </button>

          {/* Topic Selector Button */}
          <button
            onClick={() => setIsTopicModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 text-left transition-all cursor-pointer group"
          >
            <Layers className="w-4 h-4 text-amber-400 group-hover:scale-110" />
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>{selectedTopic.title}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">
                Nível {selectedTopic.level} • {selectedTopic.mode}
              </div>
            </div>
          </button>
        </div>

        {/* Timer, Live Visualizer and Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Speaking Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <AudioVisualizer isActive={isAiSpeaking || isRecording || isGenerating} variant={isRecording ? "emerald" : "amber"} />

          <button
            onClick={() => setAutoPlayAudio(!autoPlayAudio)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              autoPlayAudio
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                : "bg-white/5 border-white/10 text-zinc-400"
            }`}
            title="Auto-fala da IA"
          >
            {autoPlayAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleForgotWord}
            className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10 text-xs hidden sm:flex"
          >
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            <span>Esqueci a palavra</span>
          </Button>

          {/* End Session Button */}
          <button
            onClick={handleEndSession}
            disabled={isEvaluating || messages.length <= 1}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-zinc-950 text-xs font-black tracking-wide shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Award className="w-3.5 h-3.5" />
            <span>{isEvaluating ? "Gerando..." : "Concluir"}</span>
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
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 rounded-3xl bg-[#09090e] border border-white/10 shadow-2xl flex flex-col justify-between">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === "user"
                    ? "bg-[#181822] text-white border border-white/15"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}
              >
                {msg.sender === "user" ? "EU" : "AI"}
              </div>

              {/* Speech Bubble */}
              <div
                className={`max-w-xl rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold rounded-tr-none shadow-lg shadow-amber-500/20"
                    : "bg-[#13131b] border border-white/10 text-white rounded-tl-none"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p>{msg.content || (isGenerating && msg.id === messages[messages.length - 1].id ? "Pensando..." : "")}</p>
                  {msg.sender === "ai" && msg.content && (
                    <button
                      onClick={() => handleSpeakText(msg.content)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer shrink-0 mt-0.5"
                      title="Ouvir mensagem"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div
                  className={`text-[10px] mt-2 font-mono ${
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
        <form onSubmit={handleSendMessage} className="pt-4 border-t border-white/10 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleRecording}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              isRecording
                ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40 ring-4 ring-red-500/20"
                : "bg-white/5 hover:bg-white/10 border border-white/10 text-amber-400 hover:text-amber-300"
            }`}
            title={isRecording ? "Parar Gravação" : "Falar no Microfone (Speech-to-Text)"}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            placeholder={isRecording ? "Ouvindo você falar em inglês..." : "Digite em inglês ou aperte no microfone para falar..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isGenerating}
            className="flex-1 bg-[#13131b] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40"
          />

          <Button
            type="submit"
            variant="gold"
            size="icon"
            disabled={!inputMessage.trim() || isGenerating}
            isLoading={isGenerating}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* Topic Selection Modal */}
      {isTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0b0b10] border border-amber-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Selecione o Tema ou Cenário de Treino</h3>
                <p className="text-xs text-zinc-400">Escolha o tópico para guiar as perguntas do seu tutor de IA.</p>
              </div>
              <button onClick={() => setIsTopicModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <TopicSelector
              selectedTopicId={selectedTopic.id}
              onSelectTopic={handleSelectTopic}
            />
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
