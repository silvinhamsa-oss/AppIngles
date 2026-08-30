"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Award,
  Headphones,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Zap,
  PenTool,
} from "lucide-react";
import { EnglishRadar } from "@/components/dashboard/EnglishRadar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { DictationPlayer } from "@/components/listening/DictationPlayer";
import { WritingModal } from "@/components/learn/WritingModal";
import { WeaknessQuizModal } from "@/components/progress/WeaknessQuizModal";
import { SkillRadarData, CEFRLevel } from "@/types/profile";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === "undefined") return "overview";
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    return tabParam && ["overview", "listening", "writing", "quiz", "history"].includes(tabParam) ? tabParam : "overview";
  });
  const [userLevel, setUserLevel] = useState<CEFRLevel>("B1+");
  const [totalXp, setTotalXp] = useState(1240);

  const [radarData] = useState<SkillRadarData>({
    speaking: 74,
    vocabulary: 70,
    listening: 80,
    grammar: 82,
    reading: 86,
    writing: 75,
  });

  const [isWritingModalOpen, setIsWritingModalOpen] = useState(false);
  const [isWeaknessQuizOpen, setIsWeaknessQuizOpen] = useState(false);

  useEffect(() => {
    async function loadProgressData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile) {
            if (profile.cefr_level) setUserLevel(profile.cefr_level as CEFRLevel);
            if (profile.xp_points !== undefined) setTotalXp(profile.xp_points || 100);
          }
        }
      } catch (err) {
        console.error("Error loading progress from Supabase:", err);
      }
    }

    loadProgressData();
  }, []);

  const cefrLevels = [
    { code: "A1", label: "Breakthrough", status: userLevel === "A1" ? "current" : "completed", percent: 100 },
    { code: "A2", label: "Waystage", status: userLevel === "A2" ? "current" : userLevel === "A1" ? "next" : "completed", percent: userLevel === "A1" ? 0 : 100 },
    { code: "B1", label: "Threshold", status: userLevel === "B1" ? "current" : ["A1", "A2"].includes(userLevel) ? "locked" : "completed", percent: ["A1", "A2"].includes(userLevel) ? 0 : 100 },
    { code: "B1+", label: "Target Profile", status: userLevel === "B1+" ? "current" : ["A1", "A2", "B1"].includes(userLevel) ? "locked" : "completed", percent: userLevel === "B1+" ? 74 : ["A1", "A2", "B1"].includes(userLevel) ? 0 : 100 },
    { code: "B2", label: "Vantage", status: userLevel === "B2" ? "current" : ["C1", "C2"].includes(userLevel) ? "completed" : "next", percent: ["C1", "C2"].includes(userLevel) ? 100 : 0 },
    { code: "C1", label: "Effective", status: userLevel === "C1" ? "current" : userLevel === "C2" ? "completed" : "locked", percent: userLevel === "C2" ? 100 : 0 },
    { code: "C2", label: "Mastery", status: userLevel === "C2" ? "current" : "locked", percent: 0 },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>DIAGNÓSTICO & EVOLUÇÃO CEFR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
            Seu Mapa de Fluência & Progresso
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 font-normal">
            Acompanhe o equilíbrio das 6 competências essenciais e seu avanço contínuo do nível {userLevel} rumo ao C2.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/talk">
            <Button variant="gold" size="sm">
              <Zap className="w-4 h-4 mr-1 fill-zinc-950" />
              <span>Praticar Conversa Hoje</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "overview", label: "Visão Geral & Radar", icon: <TrendingUp className="w-4 h-4" /> },
          { id: "quiz", label: "Quiz dos Pontos Fracos", icon: <Zap className="w-4 h-4" /> },
          { id: "listening", label: "Laboratório de Escuta & Ditado", icon: <Headphones className="w-4 h-4" /> },
          { id: "writing", label: "Laboratório de Escrita (Writing)", icon: <PenTool className="w-4 h-4" /> },
          { id: "history", label: "Histórico de Sessões", icon: <Calendar className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* CEFR Level Progression Milestone */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-amber-500/30 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>Jornada de Nível: Rumo ao B2</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Pontuação acumulada: <strong className="text-amber-400 font-mono">{totalXp} XP</strong> • Meta atual: Fluência independente
                </p>
              </div>
              <Badge variant="gold" size="md" className="font-mono">
                Nível Atual: {userLevel}
              </Badge>
            </div>

            {/* Step markers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
              {cefrLevels.map((lvl) => (
                <div
                  key={lvl.code}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    lvl.status === "current"
                      ? "bg-amber-500/20 border-amber-400 ring-2 ring-amber-500/30"
                      : lvl.status === "completed"
                      ? "bg-[#14141e] border-emerald-500/40"
                      : "bg-[#101018] border-white/5 opacity-60"
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-white">{lvl.code}</div>
                  <div className="text-[10px] text-zinc-400 truncate my-1">{lvl.label}</div>
                  <div className="text-[9px] font-mono font-bold uppercase text-amber-400">
                    {lvl.status === "completed" && "Concluído"}
                    {lvl.status === "current" && "Em Foco"}
                    {lvl.status === "next" && "Próximo"}
                    {lvl.status === "locked" && "Bloqueado"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2-Column: Radar + Key Strengths */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnglishRadar data={radarData} currentLevel={userLevel} />

            <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-white/10 shadow-2xl space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Diagnóstico Pedagógico de Competências</span>
                </h3>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#14141e] border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">Domínio de Reading & Estrutura</span>
                      <span className="font-mono text-emerald-400 font-bold">{radarData.reading}%</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">Excelente compreensão textual sem bloqueios de vocabulário técnico.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#14141e] border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">Compreensão Auditiva (Listening)</span>
                      <span className="font-mono text-emerald-400 font-bold">{radarData.listening}%</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">Boa assimilação de sotaques americano e britânico em velocidades normais.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#14141e] border border-amber-500/20 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-300">Speaking & Espontaneidade (Foco Atual)</span>
                      <span className="font-mono text-amber-400 font-bold">{radarData.speaking}%</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">Pratique 15 min diários no chat com áudio para acelerar o tempo de resposta e eliminar pausas.</p>
                  </div>
                </div>
              </div>

              <Link href="/talk" className="pt-3">
                <Button variant="gold" className="w-full text-xs font-bold">
                  <span>Praticar Fala com Sarah Agora</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeTab === "listening" && (
        <div className="space-y-6">
          <DictationPlayer />
        </div>
      )}

      {activeTab === "writing" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-amber-500/30 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400/40 mx-auto flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/20">
            <PenTool className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 uppercase">
              AVALIAÇÃO DE REDAÇÃO & ENSAIOS COM IA
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">Laboratório de Escrita Ativa</h3>
            <p className="text-xs text-zinc-300 max-w-lg mx-auto font-normal">
              Pratique redações e redações estruturadas para o nível <strong>{userLevel}</strong>. A IA avalia sua gramática, vocabulário e coesão com base nos critérios internacionais de Cambridge e IELTS.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <Button
              variant="gold"
              onClick={() => setIsWritingModalOpen(true)}
              className="px-8 py-3.5 text-xs font-bold shadow-lg shadow-amber-500/20"
            >
              <PenTool className="w-4 h-4 mr-1.5" />
              <span>Abrir Editor de Redação com IA</span>
            </Button>
          </div>
        </div>
      )}

      {activeTab === "quiz" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-amber-500/30 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400/40 mx-auto flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/20">
            <Zap className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 uppercase">
              TREINO ADAPTATIVO POR IA
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">Quiz de Reforço das Suas Lacunas</h3>
            <p className="text-xs text-zinc-300 max-w-lg mx-auto font-normal">
              A IA cruza suas menores pontuações no Radar e gera exercícios sob medida com foco em <strong>Phrasal Verbs, Conectivos e Regência Preposicional</strong>.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <Button
              variant="gold"
              onClick={() => setIsWeaknessQuizOpen(true)}
              className="px-8 py-3.5 text-xs font-bold shadow-lg shadow-amber-500/20"
            >
              <Zap className="w-4 h-4 mr-1.5 fill-zinc-950" />
              <span>Iniciar Quiz de Pontos Fracos (+50 XP)</span>
            </Button>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-white/10 shadow-2xl space-y-4 text-center">
          <Calendar className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Histórico de Sessões de Fala</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Todas as suas conversas avaliadas com relatórios pós-sessão e notas CEFR ficam salvas com segurança no seu banco de dados Supabase.
          </p>
        </div>
      )}

      {/* Writing Modal */}
      <WritingModal
        isOpen={isWritingModalOpen}
        onClose={() => setIsWritingModalOpen(false)}
        initialLevel={userLevel}
      />

      {/* Weakness Quiz Modal */}
      <WeaknessQuizModal
        isOpen={isWeaknessQuizOpen}
        onClose={() => setIsWeaknessQuizOpen(false)}
        onRewardXp={(xp) => setTotalXp((prev) => prev + xp)}
      />
    </div>
  );
}
