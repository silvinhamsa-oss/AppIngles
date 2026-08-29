"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Clock, Volume2, Play, CheckCircle2, ChevronRight } from "lucide-react";
import { CEFRLevel } from "@/types/profile";
import { playPronunciation } from "@/lib/audio";

interface MissionCardProps {
  targetLevel?: CEFRLevel;
}

export function MissionCard({
  targetLevel = "B1+",
}: MissionCardProps) {
  const [duration, setDuration] = useState<10 | 20 | 30 | 45>(20);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Dynamic pedagogical breakdown based on selected duration (PRD Section 39)
  const getMissionPlan = (dur: 10 | 20 | 30 | 45) => {
    switch (dur) {
      case 10:
        return {
          title: "Sessão Concentrada: Fluência em 10 Minutos",
          description: "Revisão rápida de vocabulário pendente + 5 minutos de conversação direta sem tradução mental.",
          blocks: [
            { time: "3 min", task: "Revisão SRS (4 palavras)", skill: "Vocabulário" },
            { time: "5 min", task: "Conversa Livre com IA", skill: "Speaking" },
            { time: "2 min", task: "Feedback e Correções", skill: "Análise" },
          ],
        };
      case 20:
        return {
          title: "Missão Diária Padrão: Fale sobre sua semana e projetos",
          description: "Prática integrada: conectivos de transição (however, although), passado simples e expressão espontânea.",
          blocks: [
            { time: "5 min", task: "Active Recall (Vocabulário SRS)", skill: "Memória" },
            { time: "5 min", task: "Compreensão Auditiva", skill: "Listening" },
            { time: "8 min", task: "Conversação com Tutor IA", skill: "Speaking" },
            { time: "2 min", task: "Relatório de Fluência & Erros", skill: "Feedback" },
          ],
        };
      case 30:
        return {
          title: "Imersão Completa: Debate e Situações Práticas",
          description: "Aprofundamento de vocabulário ativo, simulação de reunião de trabalho e análise fonética.",
          blocks: [
            { time: "7 min", task: "Spaced Repetition Avançado", skill: "Vocabulário" },
            { time: "8 min", task: "Áudio Autêntico & Resumo", skill: "Listening" },
            { time: "12 min", task: "Role Play / Debate com IA", skill: "Speaking" },
            { time: "3 min", task: "Análise de Erros Críticos", skill: "Gramática" },
          ],
        };
      case 45:
        return {
          title: "Laboratório Intensivo de Domínio",
          description: "Treinamento exaustivo de fala, desafios de 60 segundos, expansão lexical e redação de síntese.",
          blocks: [
            { time: "10 min", task: "Active Recall & Frases Autorais", skill: "Vocabulário" },
            { time: "10 min", task: "Listening & Ditado", skill: "Áudio" },
            { time: "20 min", task: "Conversação Guiada & Debate", skill: "Speaking" },
            { time: "5 min", task: "Relatório Pedagógico Completo", skill: "Diagnóstico" },
          ],
        };
    }
  };

  const plan = getMissionPlan(duration);

  const handlePreviewAudio = () => {
    setIsPlayingAudio(true);
    const audioText = `Today's mission: ${plan.title}. ${plan.description}`;
    const utter = playPronunciation(audioText, 0.95, "en-US");
    if (utter) {
      utter.onend = () => setIsPlayingAudio(false);
      utter.onerror = () => setIsPlayingAudio(false);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 2500);
    }
  };

  return (
    <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-br from-[#18110b] via-[#0d0d12] to-[#0d0d12] border border-amber-500/35 shadow-2xl shadow-amber-500/10 group">
      {/* Radiant Solar Aura Glow in the background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/20 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-4 max-w-2xl">
          {/* Header Badges & Duration Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold font-mono tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "8s" }} />
              <span>MISSÃO DO DIA</span>
            </span>

            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40 text-xs font-bold font-mono">
              Nível {targetLevel}
            </span>

            {/* Interactive Duration Pills (10m, 20m, 30m, 45m) */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10">
              {([10, 20, 30, 45] as const).map((dur) => (
                <button
                  key={dur}
                  onClick={() => setDuration(dur)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    duration === dur
                      ? "bg-amber-500 text-zinc-950 shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {dur}m
                </button>
              ))}
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            {plan.title}
          </h2>

          <p className="text-sm text-zinc-300 leading-relaxed font-normal">
            {plan.description}
          </p>

          {/* Time Blocks Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {plan.blocks.map((block, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-left"
              >
                <div className="text-[10px] font-mono font-bold text-amber-400">
                  {block.time}
                </div>
                <div className="text-xs font-semibold text-white truncate mt-0.5">
                  {block.task}
                </div>
                <div className="text-[10px] text-zinc-400">
                  {block.skill}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
          <button
            onClick={handlePreviewAudio}
            className={`px-4 py-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              isPlayingAudio
                ? "bg-amber-500/25 border-amber-400 text-amber-300 animate-pulse ring-2 ring-amber-500/30"
                : "bg-white/10 hover:bg-white/15 border-white/15 text-white"
            }`}
            title="Ouvir instruções da missão em inglês"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>{isPlayingAudio ? "Reproduzindo..." : "Ouvir Áudio"}</span>
          </button>

          <Link href="/talk" className="flex-1 sm:flex-none">
            <button className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-zinc-950 text-sm font-black tracking-wide shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95">
              <Play className="w-4 h-4 fill-zinc-950" />
              <span>Iniciar ({duration} min)</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
