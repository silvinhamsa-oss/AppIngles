"use client";

import React, { useState } from "react";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { EnglishRadar } from "@/components/dashboard/EnglishRadar";
import { LevelSwitcher } from "@/components/dashboard/LevelSwitcher";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CEFRLevel, SkillRadarData } from "@/types/profile";
import {
  Sparkles,
  TrendingUp,
  Volume2,
  Brain,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Award,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [profile, setProfile] = useState<"parent" | "child">("parent");
  const [level, setLevel] = useState<CEFRLevel>("B1+");

  const handleSwitchProfile = (newProfile: "parent" | "child", newLevel: CEFRLevel) => {
    setProfile(newProfile);
    setLevel(newLevel);
  };

  const radarData: SkillRadarData =
    profile === "parent"
      ? { speaking: 72, vocabulary: 68, listening: 78, grammar: 82, reading: 85, writing: 74 }
      : { speaking: 40, vocabulary: 45, listening: 50, grammar: 35, reading: 55, writing: 30 };

  const missionTitle =
    profile === "parent"
      ? "Fale sobre a sua semana e novos projetos"
      : "Apresente sua família e seus animais favoritos";

  const missionDescription =
    profile === "parent"
      ? "Pratique conectivos (however, although) e o passado simples sem tradução mental com o tutor de IA."
      : "Aprenda e pratique vocabulário básico de apresentação pessoal, saudações e frases simples.";

  const missionSkills =
    profile === "parent"
      ? ["Conversação", "Vocabulário Ativo", "Listening"]
      : ["Fundamentos A1", "Vocabulário Básico", "Pronúncia"];

  return (
    <div className="space-y-8">
      {/* Top Greeting and Multi-Profile Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {profile === "parent" ? "Olá, Welld! 👋" : "Olá, Campeão! 🚀"}
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {profile === "parent"
              ? "Pronto para a sua missão de inglês de hoje? Foque em soltar a fala e recuperar palavras."
              : "Vamos dar mais um passo nos fundamentos do inglês com calma e diversão!"}
          </p>
        </div>

        {/* Level / Profile Switcher */}
        <LevelSwitcher
          currentProfile={profile}
          currentLevel={level}
          onSwitchProfile={handleSwitchProfile}
        />
      </div>

      {/* Mission of the Day */}
      <MissionCard
        title={missionTitle}
        description={missionDescription}
        skillsWorked={missionSkills}
        durationMinutes={profile === "parent" ? 20 : 10}
        targetLevel={level}
      />

      {/* Quick Action Hub */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Ações Rápidas de Aprendizagem
        </h3>
        <QuickActions />
      </div>

      {/* Radar de Habilidades e Estatísticas Semanais */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Card */}
        <Card variant="glass" className="lg:col-span-6 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  <span>English Radar (CEFR {level})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Diagnóstico equilibrado das suas 6 habilidades essenciais
                </p>
              </div>
              <Badge variant="primary" size="sm">
                Atualizado Hoje
              </Badge>
            </div>

            <div className="py-2">
              <EnglishRadar data={radarData} size={280} />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Objetivo do Perfil: <strong className="text-slate-200">{profile === "parent" ? "Rumo ao B2" : "Rumo ao A2"}</strong></span>
            <Link href="/progress" className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              <span>Ver detalhes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* Vocabulary SRS & Weekly Progress */}
        <div className="lg:col-span-6 space-y-6">
          {/* SRS Memory Review Alert Card */}
          <Card variant="bordered" className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-cyan-500/20">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-100">Revisão Ativa de Memória</h4>
                  <p className="text-xs text-slate-400">Repetição Espaçada (SRS Algorithm)</p>
                </div>
              </div>
              <Badge variant="cyan" size="md">
                {profile === "parent" ? "12 palavras hoje" : "5 palavras hoje"}
              </Badge>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex flex-wrap gap-2">
                {(profile === "parent"
                  ? ["actually", "although", "unless", "however", "exhausted", "figure out"]
                  : ["water", "family", "breakfast", "always", "because"]
                ).map((word, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-cyan-300 font-mono"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <Link href="/vocabulary">
              <Button variant="glow" size="sm" className="w-full">
                <span>Praticar Recordação Ativa</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </Card>

          {/* Weekly Goals Progress */}
          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Meta Semanal de Estudo</span>
              </h4>
              <span className="text-xs font-bold text-amber-400">65 / 100 min</span>
            </div>

            <ProgressBar value={65} max={100} variant="amber" size="md" showLabel={false} />

            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800/80 text-center">
              <div>
                <div className="text-lg font-extrabold text-slate-100">45 min</div>
                <div className="text-[11px] text-slate-400">Conversação</div>
              </div>
              <div>
                <div className="text-lg font-extrabold text-slate-100">38</div>
                <div className="text-[11px] text-slate-400">Palavras Ativas</div>
              </div>
              <div>
                <div className="text-lg font-extrabold text-slate-100">92%</div>
                <div className="text-[11px] text-slate-400">Retenção SRS</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
