"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  MessageSquare,
  Mic,
  Send,
  Sparkles,
  HelpCircle,
  Brain,
  Volume2,
  Settings2,
} from "lucide-react";
import { ConversationMode } from "@/types/conversation";

export default function TalkPage() {
  const [mode, setMode] = useState<ConversationMode>("guided");
  const [topic, setTopic] = useState("Trabalho e Projetos");
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "ai",
      content: "Hello Welld! Good to see you today. What are the main projects you are currently focusing on this week?",
      timestamp: "14:20",
    },
    {
      id: "2",
      sender: "user",
      content: "I am developing an AI-powered English learning application with Next.js and Supabase.",
      timestamp: "14:21",
    },
    {
      id: "3",
      sender: "ai",
      content: "That sounds like a fascinating project! How are you handling the AI provider integration to make sure it's flexible?",
      timestamp: "14:22",
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: String(Date.now()),
      sender: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "ai",
          content: "That's a very solid architectural decision! By decoupling the provider interface, you ensure zero vendor lock-in.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col space-y-4">
      {/* Top Bar with Modes and Tools */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 glass-panel rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Badge variant="primary">Modo: {mode.toUpperCase()}</Badge>
          <span className="text-xs font-semibold text-slate-300">Tema: {topic}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* I forgot the word button */}
          <Button
            variant="outline"
            size="sm"
            className="text-amber-300 border-amber-500/30 hover:bg-amber-500/10"
            onClick={() => alert("Dica da IA: 'It is when you do something without being locked into one single tool...' -> 'Vendor lock-in'")}
          >
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            <span>Esqueci a palavra</span>
          </Button>

          {/* Think in English toggle */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span>Think in English ON</span>
          </div>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <Card variant="glass" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 rounded-2xl flex flex-col justify-between">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                }`}
              >
                {msg.sender === "user" ? "EU" : "AI"}
              </div>

              <div
                className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20"
                    : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none"
                }`}
              >
                <p>{msg.content}</p>
                <div
                  className={`text-[10px] mt-1.5 ${
                    msg.sender === "user" ? "text-indigo-200" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
          <Button
            type="button"
            variant={isRecording ? "danger" : "secondary"}
            size="icon"
            onClick={() => setIsRecording(!isRecording)}
            title="Praticar Fala por Microfone"
          >
            <Mic className={`w-4 h-4 ${isRecording ? "animate-pulse" : ""}`} />
          </Button>

          <input
            type="text"
            placeholder="Digite sua resposta em inglês..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />

          <Button type="submit" variant="glow" size="icon" disabled={!inputMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
