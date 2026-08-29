"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  Brain,
  RotateCcw,
  Zap,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AudioVisualizer } from "@/components/ui/AudioVisualizer";
import { playPronunciation, startSpeechRecognition } from "@/lib/audio";
import { ConversationMode } from "@/types/conversation";

interface MessageItem {
  id: string;
  sender: "ai" | "user";
  content: string;
  timestamp: string;
  correction?: {
    original: string;
    suggested: string;
    explanation: string;
  };
}

export default function TalkPage() {
  const [mode, setMode] = useState<ConversationMode>("guided");
  const [topic, setTopic] = useState("Projetos & Desenvolvimento");
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [persona, setPersona] = useState<"sarah" | "marcus">("sarah");
  const [hintMessage, setHintMessage] = useState<string | null>(null);

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
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiSpeaking]);

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
        onResult: (transcript, isFinal) => {
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

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

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

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");

    // Simulate AI response with natural pedagogical feedback
    setTimeout(() => {
      let aiReply = "";
      if (userText.toLowerCase().includes("next") || userText.toLowerCase().includes("code")) {
        aiReply = "That's a very solid architectural approach! Keeping the AI provider layer decoupled allows you to swap LLM engines with zero friction. How are you handling latency in the conversation stream?";
      } else {
        aiReply = "I see your point! Speaking naturally without translating mental sentences is exactly how fluency develops. Tell me more about that.";
      }

      const aiMsg: MessageItem = {
        id: String(Date.now() + 1),
        sender: "ai",
        content: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (autoPlayAudio) {
        handleSpeakText(aiReply);
      }
    }, 1000);
  };

  const handleForgotWord = () => {
    setHintMessage("💡 Dica de resgate: Quando você quer dizer que algo 'vale a pena', pense na expressão: 'It is worth it...'");
    setTimeout(() => setHintMessage(null), 7000);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col space-y-3 max-w-5xl mx-auto">
      {/* Studio Audio Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 studio-card rounded-2xl border-zinc-800">
        <div className="flex items-center gap-3">
          {/* Persona indicator */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 p-0.5 shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center font-bold text-amber-400 text-xs">
                {persona === "sarah" ? "GB" : "US"}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                <span>{persona === "sarah" ? "Sarah • Tutor de Conversação (UK)" : "Marcus • Tech Mentor (US)"}</span>
              </div>
              <p className="text-[11px] text-zinc-400">Modo: Conversa Guiada • Tema: {topic}</p>
            </div>
          </div>
        </div>

        {/* Live Visualizer and Audio Controls */}
        <div className="flex items-center gap-3">
          <AudioVisualizer isActive={isAiSpeaking || isRecording} variant={isRecording ? "emerald" : "amber"} />

          <button
            onClick={() => setAutoPlayAudio(!autoPlayAudio)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              autoPlayAudio
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                : "bg-zinc-800 border-zinc-700 text-zinc-400"
            }`}
            title="Auto-fala da IA"
          >
            {autoPlayAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">Voz Ativa</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleForgotWord}
            className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10 text-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            <span>Esqueci a palavra</span>
          </Button>
        </div>
      </div>

      {/* Hint Alert if triggered */}
      {hintMessage && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 animate-in fade-in flex items-center justify-between">
          <span>{hintMessage}</span>
          <button onClick={() => setHintMessage(null)} className="text-amber-400 hover:text-amber-200">✕</button>
        </div>
      )}

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 rounded-2xl studio-card flex flex-col justify-between">
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
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                    : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                }`}
              >
                {msg.sender === "user" ? "EU" : "AI"}
              </div>

              {/* Speech Bubble */}
              <div
                className={`max-w-xl rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-amber-500 text-zinc-950 font-medium rounded-tr-none shadow-lg shadow-amber-500/10"
                    : "bg-zinc-900/90 border border-zinc-800/90 text-zinc-200 rounded-tl-none"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p>{msg.content}</p>
                  {msg.sender === "ai" && (
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
                    msg.sender === "user" ? "text-zinc-900/70" : "text-zinc-400"
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
        <form onSubmit={handleSendMessage} className="pt-4 border-t border-zinc-800/80 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleRecording}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isRecording
                ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40"
                : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-400 hover:text-amber-300"
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
            className="flex-1 bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30"
          />

          <Button
            type="submit"
            variant="gold"
            size="icon"
            disabled={!inputMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
