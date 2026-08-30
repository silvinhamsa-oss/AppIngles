"use client";

import React from "react";
import {
  MessageSquare,
  Briefcase,
  Plane,
  Coffee,
  Code2,
  TrendingUp,
  ChevronRight,
  Check,
} from "lucide-react";
import { ConversationMode } from "@/types/conversation";
import { CEFRLevel } from "@/types/profile";

export interface ScenarioTopic {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  mode: ConversationMode;
  level: CEFRLevel;
  color: string;
}

export const SCENARIO_TOPICS: ScenarioTopic[] = [
  {
    id: "free_chat",
    title: "Bate-Papo Livre (Free Chat)",
    subtitle: "Fale livremente sobre seu dia, planos ou qualquer assunto sem script",
    icon: MessageSquare,
    mode: "free",
    level: "B1",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  {
    id: "tech_projects",
    title: "Projetos & Arquitetura Tech",
    subtitle: "Explique como funciona um sistema, APIs, desafios de código e bugs",
    icon: Code2,
    mode: "guided",
    level: "B1+",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  },
  {
    id: "job_interview",
    title: "Entrevista Internacional (Tech/HR)",
    subtitle: "Treine respostas comportamentais e técnicas usando método STAR",
    icon: Briefcase,
    mode: "interview",
    level: "B2",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  },
  {
    id: "daily_standup",
    title: "Daily Standup & Alinhamento",
    subtitle: "O que você fez ontem, o que fará hoje e impedimentos",
    icon: Coffee,
    mode: "guided",
    level: "B1",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  {
    id: "travel_airport",
    title: "Viagem, Imigração & Aeroporto",
    subtitle: "Check-in, alfândega, hotel e pedidos em restaurantes",
    icon: Plane,
    mode: "roleplay",
    level: "A2",
    color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
  },
  {
    id: "trends_debate",
    title: "Debate: Futuro da IA e Carreira",
    subtitle: "Defenda seu ponto de vista usando argumentos estruturados",
    icon: TrendingUp,
    mode: "debate",
    level: "B2",
    color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  },
];

interface TopicSelectorProps {
  selectedTopicId: string;
  onSelectTopic: (topic: ScenarioTopic) => void;
}

export function TopicSelector({ selectedTopicId, onSelectTopic }: TopicSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
      {SCENARIO_TOPICS.map((topic) => {
        const Icon = topic.icon;
        const isSelected = selectedTopicId === topic.id;

        return (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic)}
            type="button"
            className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.98] ${
              isSelected
                ? "bg-[#161622] border-amber-400 shadow-lg shadow-amber-500/15 ring-2 ring-amber-500/30"
                : "bg-[#0d0d14] border-white/10 hover:border-white/20 hover:bg-[#14141e]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${topic.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                    {topic.level}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                {topic.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed font-normal">
                {topic.subtitle}
              </p>
            </div>

            <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-amber-400 font-mono">
              <span className="capitalize">Modo: {topic.mode}</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
