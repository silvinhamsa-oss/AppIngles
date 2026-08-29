"use client";

import React from "react";
import {
  MessageSquare,
  Mic,
  Brain,
  Headphones,
  BookCheck,
  TrendingUp,
  Cpu,
  HelpCircle,
} from "lucide-react";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Conversação Livre & Guiada",
    description: "Pratique bate-papo sem pressão, simulações da vida real (Role Play), entrevistas e debates com o tutor.",
  },
  {
    icon: Mic,
    title: "Prática de Fala (Speaking)",
    description: "Desafios de fala diários de 60 segundos com medição de fluência e naturalidade sem punição escolar.",
  },
  {
    icon: HelpCircle,
    title: "Botão 'Esqueci a Palavra'",
    description: "Travou no meio da frase? O tutor dá pistas conceituais em inglês para você resgatar o termo pela memória ativa.",
  },
  {
    icon: Brain,
    title: "Motor 'Think in English'",
    description: "Treinamento cognitivo para ligar 'Ideia ➔ Inglês Direto', eliminando a tradução mental intermediária em português.",
  },
  {
    icon: BookCheck,
    title: "Banco de Vocabulário & SRS",
    description: "Mapeie palavras de passivas para ativas com repetição espaçada inteligente (SuperMemo/SM-2).",
  },
  {
    icon: Headphones,
    title: "Compreensão Auditiva (Listening)",
    description: "Áudios autênticos com perguntas de interpretação, ditados e resumos nos níveis A1 a B2.",
  },
  {
    icon: TrendingUp,
    title: "English Radar de 6 Eixos",
    description: "Visualização clara da sua evolução em Fala, Vocabulário, Áudio, Gramática, Leitura e Escrita.",
  },
  {
    icon: Cpu,
    title: "Provedores de IA Desacoplados",
    description: "Use OpenRouter, NVIDIA NIM, OpenAI, Gemini, Anthropic ou Ollama local com segurança total das suas chaves.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 sm:py-28 relative border-t border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 font-mono">Recursos de Estúdio</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tudo o que você precisa para destravar o inglês
          </p>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-3">
            Construído para quem tem rotina real e precisa falar e pensar em inglês com segurança.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="studio-card rounded-3xl p-6 group hover:border-amber-500/40">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-all mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
