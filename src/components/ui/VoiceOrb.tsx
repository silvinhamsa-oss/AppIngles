"use client";

import React, { useState } from "react";
import { Mic, Volume2, Sparkles } from "lucide-react";
import { playPronunciation } from "@/lib/audio";

interface VoiceOrbProps {
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
  onOrbClick?: () => void;
  statusText?: string;
}

export function VoiceOrb({
  size = "md",
  isActive = false,
  onOrbClick,
  statusText = "Tutor de IA Pronto",
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
    const text = "Hello! I am your AI English tutor. I am ready whenever you are!";
    const utter = playPronunciation(text, 0.95, "en-US");
    if (utter) {
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
    } else {
      setTimeout(() => setIsSpeaking(false), 2500);
    }
  };

  const active = isActive || isSpeaking;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Outer Pulse Container */}
      <div className="relative flex items-center justify-center cursor-pointer group" onClick={handleOrbClick}>
        {/* Layer 1: Ambient Outer Aura Glow */}
        <div
          className={`absolute rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
            active
              ? "w-40 h-40 bg-gradient-to-tr from-amber-500/40 via-purple-600/40 to-cyan-400/40 scale-125 animate-pulse"
              : "w-28 h-28 bg-gradient-to-tr from-amber-500/20 via-cyan-500/15 to-purple-600/20 group-hover:scale-110"
          }`}
        />

        {/* Layer 2: Rotating Colorful Liquid Ring */}
        <div
          className={`absolute rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-purple-500 to-cyan-400 transition-all duration-500 ${
            active ? "animate-spin scale-105" : "group-hover:rotate-45"
          }`}
          style={{ animationDuration: "6s" }}
        >
          <div className="rounded-full bg-zinc-950/60 backdrop-blur-md w-full h-full" />
        </div>

        {/* Layer 3: Main Core Orb */}
        <div
          className={`relative rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 overflow-hidden ${
            sizeStyles[size]
          } ${
            active
              ? "bg-gradient-to-br from-amber-400 via-rose-500 to-indigo-600 scale-105 shadow-amber-500/40 ring-4 ring-white/20"
              : "bg-gradient-to-br from-zinc-900 via-purple-950 to-zinc-900 border border-white/20 shadow-purple-500/20 group-hover:border-amber-400/50"
          }`}
        >
          {/* Inner Light Ripple */}
          <div className="absolute inset-0 bg-radial-gradient opacity-60 mix-blend-overlay" />

          {/* Central Animated Icon */}
          <div className="relative z-10 text-white flex flex-col items-center justify-center">
            {active ? (
              <Volume2 className="w-8 h-8 animate-bounce text-white drop-shadow-md" />
            ) : (
              <div className="flex flex-col items-center">
                <Sparkles className="w-6 h-6 text-amber-300 group-hover:scale-110 transition-transform drop-shadow" />
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-200 mt-0.5">Falar</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Label */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
        <span className={`w-2 h-2 rounded-full ${active ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
        <span className="text-xs font-semibold text-zinc-300 tracking-tight">
          {active ? "Tutor Falando..." : statusText}
        </span>
      </div>
    </div>
  );
}
