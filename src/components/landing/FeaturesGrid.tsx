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
import { Card } from "@/components/ui/Card";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Conversação Livre & Guiada",
    description: "Pratique bate-papo livre, simulações de situações reais (Role Play), entrevistas de emprego e debates com a IA.",
  },
  {
    icon: Mic,
    title: "Prática de Fala (Speaking)",
    description: "Desafios de fala diários de 60 segundos com medição de fluência, ritmo e naturalidade sem punição escolar.",
  },
  {
    icon: HelpCircle,
    title: "Botão 'Esqueci a Palavra'",
    description: "Travou no meio da frase? O tutor dá pistas conceituais em inglês para você resgatar a palavra pela memória ativa.",
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
    description: "Áudios curtos e autênticos com perguntas de interpretação, ditados e resumos nos níveis A1 a B2.",
  },
  {
    icon: TrendingUp,
    title: "English Radar de 6 Eixos",
    description: "Visualização clara da sua evolução em Fala, Vocabulário, Áudio, Gramática, Leitura e Escrita.",
  },
  {
    icon: Cpu,
    title: "Provedores de IA Desacoplados",
    description: "Use OpenRouter, NVIDIA NIM, OpenAI, Gemini, Anthropic ou Ollama local com segurança total das chaves de API.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Recursos Premium</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Tudo o que você precisa para destravar o inglês
          </p>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Construído para adultos e jovens com rotina real que precisam falar e pensar em inglês com segurança.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} variant="glass" hoverable className="group">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
