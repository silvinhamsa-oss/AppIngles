"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Award,
  Clock,
  Brain,
  Headphones,
  CheckCircle2,
  Calendar,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { EnglishRadar } from "@/components/dashboard/EnglishRadar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { DictationPlayer } from "@/components/listening/DictationPlayer";
import { SkillRadarData } from "@/types/profile";
import Link from "next/link";

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const radarData: SkillRadarData = {
    speaking: 74,
    vocabulary: 70,
    listening: 80,
    grammar: 82,
    reading: 86,
    writing: 75,
  };

  const cefrLevels = [
    { code: "A1", label: "Breakthrough", status: "completed", percent: 100 },
    { code: "A2", label: "Waystage", status: "completed", percent: 100 },
    { code: "B1", label: "Threshold", status: "completed", percent: 100 },
    { code: "B1+", label: "Target Profile", status: "current", percent: 72 },
    { code: "B2", label: "Vantage", status: "next", percent: 0 },
    { code: "C1", label: "Effective", status: "locked", percent: 0 },
    { code: "C2", label: "Mastery", status: "locked", percent: 0 },
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
            Acompanhe o equilíbrio das 6 competências essenciais e seu avanço contínuo do nível B1+ rumo ao C2.
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
          { id: "listening", label: "Laboratório de Escuta & Ditado", icon: <Headphones className="w-4 h-4" /> },
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
                  Você completou <strong>72% dos requisitos</strong> para validar o nível B2 Independente.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                Nível Atual: B1+
              </span>
            </div>

            {/* Stepper pills */}
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
              {cefrLevels.map((lvl) => (
                <div
                  key={lvl.code}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    lvl.status === "completed"
                      ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                      : lvl.status === "current"
                      ? "bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-500/30 shadow-lg"
                      : "bg-[#14141e] border-white/5 text-zinc-500 opacity-60"
                  }`}
                >
                  <div className="text-xs font-mono font-bold">{lvl.code}</div>
                  <div className="text-[10px] truncate mt-0.5">{lvl.label}</div>
                  {lvl.status === "completed" && <CheckCircle2 className="w-3.5 h-3.5 mx-auto mt-1 text-emerald-400" />}
                  {lvl.status === "current" && <div className="text-[9px] font-bold font-mono text-amber-400 mt-1">{lvl.percent}%</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Radar & Detailed Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* English Radar Visualizer */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-white/10 shadow-2xl flex flex-col items-center justify-center">
              <div className="w-full flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>English Radar Diagnóstico</span>
                </h3>
                <span className="text-xs font-mono text-zinc-400">Score Médio: 77%</span>
              </div>

              <div className="py-4">
                <EnglishRadar data={radarData} size={300} />
              </div>
            </div>

            {/* Individual Skills Progress Bars */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-white/10 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Desempenho por Competência</h3>

              {[
                { label: "Reading (Leitura & Compreensão)", score: radarData.reading, color: "amber" },
                { label: "Grammar (Precisão Estrutural)", score: radarData.grammar, color: "emerald" },
                { label: "Listening (Compreensão Auditiva)", score: radarData.listening, color: "amber" },
                { label: "Writing (Redação & Síntese)", score: radarData.writing, color: "emerald" },
                { label: "Speaking (Fluência Oral)", score: radarData.speaking, color: "amber" },
                { label: "Vocabulary (Vocabulário Ativo)", score: radarData.vocabulary, color: "emerald" },
              ].map((skill, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-300">{skill.label}</span>
                    <span className="text-white font-mono font-bold">{skill.score}%</span>
                  </div>
                  <ProgressBar value={skill.score} max={100} variant={skill.color as any} size="sm" showLabel={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "listening" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-[#0d0d12] to-cyan-500/20 border border-amber-500/30">
            <h3 className="text-xl font-bold text-white">Laboratório de Compreensão Auditiva & Ditado</h3>
            <p className="text-xs text-zinc-300 mt-1">
              Treine seu ouvido para diferentes sotaques nativos (US, UK, AU) e velocidade de fala variável.
            </p>
          </div>

          <DictationPlayer />
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-[#0d0d14] border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white">Histórico de Sessões de Fala Recentes</h3>

            <div className="space-y-3">
              {[
                {
                  date: "Hoje às 14:35",
                  topic: "Projetos & Arquitetura Tech",
                  duration: "18 min",
                  score: "82%",
                  xp: "+75 XP",
                  status: "Excelente Fluência",
                },
                {
                  date: "Ontem às 19:10",
                  topic: "Daily Standup & Alinhamento",
                  duration: "15 min",
                  score: "78%",
                  xp: "+60 XP",
                  status: "Bom ritmo",
                },
                {
                  date: "27 de Agosto",
                  topic: "Bate-Papo Livre (Free Chat)",
                  duration: "22 min",
                  score: "85%",
                  xp: "+90 XP",
                  status: "Vocabulário rico",
                },
              ].map((sess, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#14141e] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{sess.topic}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {sess.status}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      {sess.date} • Duração: {sess.duration}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-base font-black text-amber-400 font-mono">{sess.score}</div>
                      <div className="text-[10px] text-zinc-400">{sess.xp}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
