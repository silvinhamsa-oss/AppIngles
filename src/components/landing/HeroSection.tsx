"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Volume2, ArrowRight, Sparkles, Headphones } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AudioVisualizer } from "@/components/ui/AudioVisualizer";
import { playPronunciation } from "@/lib/audio";


export function HeroSection() {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  const handlePlayDemoAudio = () => {
    setIsPlayingDemo(true);
    const text = "Welcome to English Lab. I am your personal conversational tutor. Let us practice speaking naturally without mental translation.";
    const utter = playPronunciation(text, 0.95, "en-US");
    if (utter) {
      utter.onend = () => setIsPlayingDemo(false);
      utter.onerror = () => setIsPlayingDemo(false);
    } else {
      setTimeout(() => setIsPlayingDemo(false), 3000);
    }
  };

  return (
    <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-32 overflow-hidden studio-mesh">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-amber-300 text-xs font-semibold mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Tutor Particular com Inteligência Artificial Adaptativa</span>
        </div>

        {/* Main Headline with Editorial Serif Touch */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-100 tracking-[-0.03em] leading-[1.08] mb-6">
          Your English. <br />
          <span className="font-editorial text-amber-400 font-normal">Your Pace. </span>
          <span>Your AI Tutor.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 font-normal leading-relaxed mb-10">
          Chega de apenas preencher regras gramaticais. Destrave sua conversação, recupere vocabulário em tempo real e pense em inglês com um tutor que se adapta ao seu ritmo.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="gold" size="lg" className="w-full sm:w-auto shadow-xl shadow-amber-500/15">
              <span>Começar a Aprender</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <Link href="/learn" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <span>Ver Trilha de Aulas</span>
            </Button>
          </Link>
        </div>

        {/* Live Audio Tutor Demo Card */}
        <div className="max-w-2xl mx-auto p-6 studio-card rounded-3xl border-zinc-800 text-left relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Demonstração de Áudio Nativo
                </div>
                <div className="text-sm font-semibold text-zinc-200 mt-0.5">
                  Ouça como a IA conduz uma sessão de fala natural
                </div>
              </div>
            </div>

            <button
              onClick={handlePlayDemoAudio}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isPlayingDemo
                  ? "bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse"
                  : "bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200"
              }`}
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>{isPlayingDemo ? "Falando..." : "Testar Voz do Tutor"}</span>
            </button>
          </div>

          {isPlayingDemo && (
            <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between animate-in fade-in">
              <span className="text-xs text-zinc-400 font-serif italic">
                &ldquo;Welcome to English Lab. Let us practice speaking naturally...&rdquo;
              </span>
              <AudioVisualizer isActive={true} variant="amber" barCount={12} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
