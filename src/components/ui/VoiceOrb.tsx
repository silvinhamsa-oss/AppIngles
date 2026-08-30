"use client";

import React, { useState } from "react";
import { Mic, Volume2, Sparkles } from "lucide-react";
import { playPronunciation } from "@/lib/audio";
import { CEFRLevel } from "@/types/profile";

interface VoiceOrbProps {
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
  onOrbClick?: () => void;
  statusText?: string;
  userName?: string;
  targetLevel?: CEFRLevel;
  streakDays?: number;
  dailyGoalMinutes?: number;
}

export function VoiceOrb({
  size = "md",
  isActive = false,
  onOrbClick,
  statusText = "Tutor de IA Pronto",
  userName = "Welld",
  targetLevel = "B1+",
  streakDays = 5,
  dailyGoalMinutes = 20,
}: VoiceOrbProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const sizeStyles = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-36 h-36",
  };

  const handleOrbClick = () => {
    if (onOrbClick) {
      onOrbClick();
      return;
    }

    setIsSpeaking(true);
    const audio = playPronunciation(
      `Hello ${userName}! I'm Sarah, your British English tutor. Ready to practice your spoken English towards level ${targetLevel}?`,
      0.95,
      "en-GB"
    );
    if (audio) {
      audio.onend = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
    } else {
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#0d0d14] border border-amber-500/20 shadow-2xl relative overflow-hidden text-center group">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Interactive Orb */}
      <div className="relative mb-4 cursor-pointer" onClick={handleOrbClick}>
        {/* Pulsing Outer Halo */}
        <div
          className={`absolute -inset-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-400 opacity-30 blur-xl transition-all duration-700 ${
            isSpeaking || isActive ? "scale-125 opacity-70 animate-pulse" : "group-hover:opacity-50"
          }`}
        />

        {/* Core Glowing Orb */}
        <div
          className={`${sizeStyles[size]} rounded-full bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-400 p-1 shadow-xl shadow-amber-500/30 flex items-center justify-center transition-transform active:scale-95`}
        >
          <div className="w-full h-full rounded-full bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center text-amber-400">
            {isSpeaking ? (
              <Volume2 className="w-8 h-8 animate-pulse text-amber-300" />
            ) : (
              <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
            )}
          </div>
        </div>
      </div>

      {/* Orb Status Labels */}
      <div className="space-y-1 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-[11px] font-mono font-bold text-amber-300">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{isSpeaking ? "Sarah Falando..." : statusText}</span>
        </div>
        <h3 className="text-lg font-black text-white tracking-tight">
          Welcome back, <span className="text-amber-400">{userName}</span>!
        </h3>
        <p className="text-xs text-zinc-400 font-normal">
          Meta ativa: <strong>Nível {targetLevel}</strong> • {dailyGoalMinutes} min diários • Toque no orbe para ouvir
        </p>
      </div>
    </div>
  );
}
