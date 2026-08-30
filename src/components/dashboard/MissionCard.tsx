"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Clock, Volume2, Play, CheckCircle2, ChevronRight } from "lucide-react";
import { CEFRLevel } from "@/types/profile";
import { playPronunciation } from "@/lib/audio";
import { getMissionPlan } from "@/lib/mission-data";

interface MissionCardProps {
  targetLevel?: CEFRLevel;
}

export function MissionCard({
  targetLevel = "B1+",
}: MissionCardProps) {
  const [duration, setDuration] = useState<10 | 20 | 30 | 45>(20);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const plan = getMissionPlan(duration, targetLevel);

  const handlePlayPrompt = () => {
    setIsPlayingAudio(true);
    const audio = playPronunciation(
      "Good morning! In today's session, let's practice explaining your current project goals and key challenges without mental translation.",
      0.95,
      "en-GB"
    );
    if (audio) {
      audio.onend = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  return (
    <div className="card-halo-amber relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-[#0d0d14] border border-amber-500/30 shadow-2xl transition-all group">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header with Duration Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            Missão Adaptativa do Dia • Meta {targetLevel}
          </span>
        </div>

        {/* Time Selector */}
        <div className="flex items-center gap-1 bg-[#14141e] p-1 rounded-2xl border border-white/10 self-start sm:self-auto shadow-inner">
          <Clock className="w-3.5 h-3.5 text-amber-400 ml-2 mr-1" />
          {[10, 20, 30, 45].map((mins) => (
            <button
              key={mins}
              onClick={() => setDuration(mins as any)}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                duration === mins
                  ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/25"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Mission Core Content */}
      <div className="space-y-4 relative z-10 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {duration === 10 && "Sessão Concentrada: Fluência em 10 Minutos"}
            {duration === 20 && "Missão Diária Padrão: Fale sobre seus projetos e desafios"}
            {duration === 30 && "Imersão Completa: Debate e Situações Práticas"}
            {duration === 45 && "Laboratório Intensivo de Maestria"}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 font-normal leading-relaxed">
            {duration === 10 && "Revisão rápida de vocabulário pendente + 5 minutos de conversação direta sem tradução mental."}
            {duration === 20 && "Prática integrada: conectivos de transição, vocabulário ativo no SRS e fala espontânea com áudio nativo."}
            {duration === 30 && "Aprofundamento de vocabulário ativo, simulação de reunião de trabalho e análise de pronúncia."}
            {duration === 45 && "Treinamento exaustivo de fala, desafios de 60 segundos, expansão lexical e simulação de exames."}
          </p>
        </div>

        {/* Audio prompt button */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/40 border border-white/5">
          <button
            onClick={handlePlayPrompt}
            disabled={isPlayingAudio}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold transition-all cursor-pointer"
          >
            <Volume2 className={`w-4 h-4 text-amber-400 ${isPlayingAudio ? "animate-pulse" : ""}`} />
            <span>{isPlayingAudio ? "Ouvindo áudio..." : "Ouvir introdução de Sarah"}</span>
          </button>
          <span className="text-[11px] text-zinc-400 italic">
            "Good morning! Let's practice explaining your project goals..."
          </span>
        </div>
      </div>

      {/* Structured pedagogical blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6 relative z-10">
        {plan.blocks.map((b, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-[#14141e] border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                  {b.durationMin} MIN
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10 uppercase">
                  {b.type}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mb-1">{b.title}</h4>
              <p className="text-[11px] text-zinc-400 leading-snug">{b.description}</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-2 pt-2 border-t border-white/5">
              <CheckCircle2 className="w-3 h-3" />
              <span>Pronto para iniciar</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="font-mono font-bold text-amber-400">+{plan.xpReward} XP</span>
          <span>ao concluir os {duration} minutos</span>
        </div>

        <Link
          href="/talk"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:brightness-105 active:scale-98 transition-all"
        >
          <Play className="w-4 h-4 fill-zinc-950" />
          <span>Iniciar Missão Diária ({duration}m)</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
