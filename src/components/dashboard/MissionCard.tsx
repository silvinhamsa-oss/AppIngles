"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Clock, Volume2, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CEFRLevel } from "@/types/profile";
import { playPronunciation } from "@/lib/audio";

interface MissionCardProps {
  title?: string;
  durationMinutes?: number;
  skillsWorked?: string[];
  description?: string;
  targetLevel?: CEFRLevel;
}

export function MissionCard({
  title = "Fale sobre a sua semana e novos projetos",
  durationMinutes = 20,
  skillsWorked = ["Conversação", "Vocabulário Ativo", "Listening"],
  description = "Foco pedagógico: praticar conectivos de frase (however, although) e uso natural do passado simples sem tradução mental.",
  targetLevel = "B1+",
}: MissionCardProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePreviewAudio = () => {
    setIsPlayingAudio(true);
    const audioText = `Today's mission: ${title}. ${description}`;
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
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-tr from-purple-600/15 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-4 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold font-mono tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "8s" }} />
              <span>MISSÃO DO DIA</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/15 text-xs font-medium font-mono">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>{durationMinutes} min</span>
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40 text-xs font-bold font-mono">
              Nível {targetLevel}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            {title}
          </h2>

          <p className="text-sm text-zinc-300 leading-relaxed font-normal">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-amber-400/80 font-bold uppercase tracking-wider font-mono">Foco:</span>
            {skillsWorked.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-zinc-200 font-medium"
              >
                {skill}
              </span>
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
              <span>Iniciar Sessão</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
