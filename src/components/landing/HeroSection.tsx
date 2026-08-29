"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, MessageSquare, Volume2, ArrowRight, ShieldCheck, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 animate-pulse-subtle shadow-md shadow-indigo-950/50">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tutor Particular de Inglês com Inteligência Artificial Adaptativa</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-100 tracking-tight leading-[1.1] mb-6">
          Your English. <br />
          <span className="text-gradient">Your Pace. Your AI Tutor.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 font-normal leading-relaxed mb-10">
          Melhore seu inglês usando-o de verdade — falando, ouvindo, recuperando vocabulário e tendo conversas reais com um tutor de IA que se adapta exatamente ao seu nível.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="glow" size="lg" className="w-full sm:w-auto">
              <span>Começar a Aprender</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <Link href="/learn" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <span>Fazer Teste de Nível</span>
            </Button>
          </Link>
        </div>

        {/* Trust & Spec Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80 text-left">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Conversação Real</div>
              <div className="text-[11px] text-slate-400">Feedback sem travar o fluxo</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Active Recall</div>
              <div className="text-[11px] text-slate-400">Repetição espaçada (SRS)</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Do A1 ao C1</div>
              <div className="text-[11px] text-slate-400">Iniciante ou Intermediário</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Provedor Livre</div>
              <div className="text-[11px] text-slate-400">OpenRouter, NVIDIA, OpenAI</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
