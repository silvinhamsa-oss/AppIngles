"use client";

import React from "react";
import { MessageCircle, Brain, RefreshCw, Trophy } from "lucide-react";
import { Card } from "@/components/ui/Card";

const STEPS = [
  {
    number: "01",
    title: "Fale (Talk)",
    description: "Tenha diálogos naturais sobre temas do seu dia a dia, viagens ou carreira sem medo de errar.",
    icon: MessageCircle,
    color: "from-indigo-500 to-cyan-400",
  },
  {
    number: "02",
    title: "Aprenda (Learn)",
    description: "A IA identifica lacunas gramaticais e termos desconhecidos silenciosamente durante a conversa.",
    icon: Brain,
    color: "from-cyan-400 to-emerald-400",
  },
  {
    number: "03",
    title: "Revise (Review)",
    description: "Treine a recuperação ativa (Active Recall) com algoritmo de repetição espaçada na hora certa.",
    icon: RefreshCw,
    color: "from-amber-400 to-orange-500",
  },
  {
    number: "04",
    title: "Evolua (Improve)",
    description: "Acompanhe seu English Radar de 6 eixos e suba de nível CEFR com feedback pedagógico contínuo.",
    icon: Trophy,
    color: "from-purple-500 to-indigo-500",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Metodologia</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Como o English Lab funciona
          </p>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            O princípio central: <em>&ldquo;Don&apos;t just study English. Use it.&rdquo;</em> Você não apenas resolve exercícios gramaticais, você se comunica de fato.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.number} variant="glass" hoverable className="relative overflow-hidden group">
                <div className="text-4xl font-black text-slate-800 group-hover:text-indigo-900/50 transition-colors mb-4">
                  {step.number}
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.color} p-0.5 mb-4`}>
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
