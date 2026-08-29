"use client";

import React from "react";
import { MessageCircle, Brain, RefreshCw, Trophy } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Fale (Talk)",
    description: "Tenha diálogos naturais sobre temas do seu dia a dia, viagens ou carreira sem medo de errar.",
    icon: MessageCircle,
    color: "from-amber-500 to-yellow-400 text-zinc-950",
  },
  {
    number: "02",
    title: "Aprenda (Learn)",
    description: "A IA identifica lacunas gramaticais e termos desconhecidos silenciosamente durante a conversa.",
    icon: Brain,
    color: "from-emerald-500 to-teal-400 text-zinc-950",
  },
  {
    number: "03",
    title: "Revise (Review)",
    description: "Treine a recuperação ativa (Active Recall) com algoritmo de repetição espaçada na hora certa.",
    icon: RefreshCw,
    color: "from-amber-400 to-orange-500 text-zinc-950",
  },
  {
    number: "04",
    title: "Evolua (Improve)",
    description: "Acompanhe seu English Radar de 6 eixos e suba de nível CEFR com feedback pedagógico contínuo.",
    icon: Trophy,
    color: "from-amber-300 to-yellow-500 text-zinc-950",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative border-t border-[var(--border-subtle)] bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 font-mono">Metodologia</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Como o English Lab funciona
          </p>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-3">
            O princípio central: <em className="font-editorial text-amber-400">&ldquo;Don&apos;t just study English. Use it.&rdquo;</em> Você não apenas resolve exercícios gramaticais, você se comunica de fato.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="studio-card rounded-3xl p-6 relative overflow-hidden group">
                <div className="text-4xl font-black text-zinc-800/80 group-hover:text-amber-500/30 transition-colors mb-4 font-mono">
                  {step.number}
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.color} p-0.5 mb-4 flex items-center justify-center font-bold shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
