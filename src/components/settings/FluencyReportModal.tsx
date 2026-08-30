"use client";

import React, { useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  Award,
  Download,
  Printer,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { CEFRLevel, SkillRadarData } from "@/types/profile";

interface FluencyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  cefrLevel: CEFRLevel;
  totalXp: number;
  streakDays: number;
  radarData: SkillRadarData;
}

export function FluencyReportModal({
  isOpen,
  onClose,
  userName,
  userEmail,
  cefrLevel,
  totalXp,
  streakDays,
  radarData,
}: FluencyReportModalProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const todayDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  const levelDescriptions: Record<CEFRLevel, { name: string; desc: string }> = {
    A1: {
      name: "Iniciante • Breakthrough",
      desc: "Compreende e utiliza expressões familiares cotidianas e frases básicas para satisfazer necessidades imediatas.",
    },
    A2: {
      name: "Básico • Waystage",
      desc: "Capaz de se comunicar em tarefas simples e rotineiras sobre assuntos familiares e de troca direta de informações.",
    },
    B1: {
      name: "Independente • Threshold",
      desc: "Compreende os pontos principais de textos claros em padrão de linguagem sobre assuntos conhecidos (trabalho, estudos e lazer).",
    },
    "B1+": {
      name: "Intermediário Sólido • Target Profile",
      desc: "Comunicação fluida em conversas de negócios, reuniões ágeis e viagens com boa precisão gramatical.",
    },
    B2: {
      name: "Avançado • Vantage",
      desc: "Compreende ideias principais de textos complexos sobre tópicos concretos e abstratos, comunicando-se com alto grau de espontaneidade.",
    },
    C1: {
      name: "Proficiência Operacional Eficaz",
      desc: "Fluência natural e espontânea em ambientes acadêmicos e executivos complexos sem esforço aparente.",
    },
    C2: {
      name: "Domínio Pleno • Mastery",
      desc: "Compreende com facilidade tudo o que ouve ou lê, expressando-se com precisão e nuances de significado nativo.",
    },
  };

  const info = levelDescriptions[cefrLevel] || levelDescriptions["B1+"];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Relatório Oficial de Diagnóstico CEFR"
      description="Certificado de proficiência e evolução do aluno no English Lab."
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Printable Certificate Box */}
        <div
          ref={reportRef}
          className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#11111a] to-[#0a0a0f] border border-amber-500/40 shadow-2xl space-y-6 text-white print:bg-white print:text-black print:p-0 print:border-none"
        >
          {/* Certificate Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10 print:border-black/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-black text-zinc-950 text-base shadow-lg shadow-amber-500/25 shrink-0">
                EL
              </div>
              <div>
                <h4 className="text-lg font-black tracking-tight text-white print:text-black">
                  ENGLISH LAB • CEFR DIAGNOSTIC
                </h4>
                <p className="text-[11px] text-zinc-400 font-mono print:text-zinc-600">
                  Relatório Individual de Competências em Língua Inglesa
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Emitido em:</span>
              <span className="text-xs font-bold text-amber-300 font-mono print:text-black">{todayDate}</span>
            </div>
          </div>

          {/* Student & Level Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#14141e] border border-white/10 sm:col-span-2 print:border-black/10">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block font-bold">Aluno(a):</span>
              <h3 className="text-base font-bold text-white print:text-black">{userName || "Aluno English Lab"}</h3>
              <p className="text-xs text-zinc-400 font-mono">{userEmail || "aluno@englishlab.app"}</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-center flex flex-col items-center justify-center print:border-black/20">
              <span className="text-[10px] uppercase font-mono text-amber-300 block font-bold">Nível Atestado:</span>
              <div className="text-2xl font-black text-amber-400 font-mono">{cefrLevel}</div>
              <span className="text-[10px] text-zinc-300 font-medium mt-0.5">{info.name.split("•")[0]}</span>
            </div>
          </div>

          {/* Level Description */}
          <div className="p-4 rounded-2xl bg-[#14141e] border border-white/5 space-y-1.5 print:border-black/10">
            <h5 className="text-xs font-bold text-amber-400 uppercase font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Descrição do Nível ({cefrLevel}):
            </h5>
            <p className="text-xs text-zinc-300 leading-relaxed font-normal print:text-zinc-800">{info.desc}</p>
          </div>

          {/* 6 Skills Competency Breakdown */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
              Equilíbrio das 6 Competências Linguísticas:
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-[#14141e] border border-white/5 text-center">
                <span className="text-[10px] text-zinc-400 block font-mono">Speaking (Fala)</span>
                <span className="text-sm font-black text-amber-400 font-mono">{radarData.speaking}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14141e] border border-white/5 text-center">
                <span className="text-[10px] text-zinc-400 block font-mono">Listening (Escuta)</span>
                <span className="text-sm font-black text-emerald-400 font-mono">{radarData.listening}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14141e] border border-white/5 text-center">
                <span className="text-[10px] text-zinc-400 block font-mono">Grammar (Gramática)</span>
                <span className="text-sm font-black text-cyan-400 font-mono">{radarData.grammar}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14141e] border border-white/5 text-center">
                <span className="text-[10px] text-zinc-400 block font-mono">Vocabulary (Vocab)</span>
                <span className="text-sm font-black text-purple-400 font-mono">{radarData.vocabulary}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14141e] border border-white/5 text-center">
                <span className="text-[10px] text-zinc-400 block font-mono">Reading (Leitura)</span>
                <span className="text-sm font-black text-blue-400 font-mono">{radarData.reading}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14141e] border border-white/5 text-center">
                <span className="text-[10px] text-zinc-400 block font-mono">Writing (Escrita)</span>
                <span className="text-sm font-black text-yellow-400 font-mono">{radarData.writing}%</span>
              </div>
            </div>
          </div>

          {/* Gamification Stats */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Pontuação Total: <strong className="text-amber-400">{totalXp} XP</strong></span>
            <span>Ofensiva Ativa: <strong className="text-emerald-400">{streakDays} dias</strong></span>
            <span>Status: <strong className="text-white">Autenticado</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto text-xs">
            <span>Fechar</span>
          </Button>

          <Button type="button" variant="gold" onClick={handlePrint} className="w-full sm:w-auto text-xs font-bold shadow-md shadow-amber-500/20">
            <Printer className="w-4 h-4 mr-1.5" />
            <span>Imprimir / Salvar em PDF</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
