"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Clock, Volume2, Play, CheckCircle2 } from "lucide-react";
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
    <div className="studio-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border-amber-500/30">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gold" size="md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MISSÃO DO DIA</span>
            </Badge>
            <Badge variant="secondary" size="sm">
              <Clock className="w-3 h-3" />
              <span>{durationMinutes} minutos</span>
            </Badge>
            <Badge variant="outline" size="sm">
              <span className="font-mono font-bold text-amber-400">Nível {targetLevel}</span>
            </Badge>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            {title}
          </h2>

          <p className="text-sm text-zinc-300 leading-relaxed font-normal">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Foco:</span>
            {skillsWorked.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium"
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
            className={`px-4 py-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              isPlayingAudio
                ? "bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse"
                : "bg-zinc-900/90 border-zinc-700/80 text-zinc-300 hover:text-white hover:bg-zinc-800"
            }`}
            title="Ouvir instruções da missão em inglês"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>{isPlayingAudio ? "Reproduzindo..." : "Ouvir Áudio"}</span>
          </button>

          <Link href="/talk" className="flex-1 sm:flex-none">
            <Button variant="gold" size="lg" className="w-full shadow-xl shadow-amber-500/10">
              <Play className="w-4 h-4 fill-current mr-1.5" />
              <span>Iniciar Sessão</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
