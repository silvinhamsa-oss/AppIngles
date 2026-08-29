"use client";

import React, { useState } from "react";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { EnglishRadar } from "@/components/dashboard/EnglishRadar";
import { LevelSwitcher } from "@/components/dashboard/LevelSwitcher";
import { FlashcardModal } from "@/components/vocabulary/FlashcardModal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CEFRLevel, SkillRadarData } from "@/types/profile";
import { VocabularyItem } from "@/types/vocabulary";
import { playPronunciation } from "@/lib/audio";
import {
  TrendingUp,
  Brain,
  Clock,
  ArrowRight,
  Volume2,
} from "lucide-react";
import Link from "next/link";

const DASHBOARD_SRS_ITEMS: VocabularyItem[] = [
  {
    id: "1",
    word: "actually",
    translationPt: "na verdade / realmente",
    definitionEn: "in fact or really",
    partOfSpeech: "adverb",
    cefrLevel: "B1",
    exampleSentence: "Actually, I prefer having team syncs in the morning.",
    contextNote: "/ˈæktʃu.ə.li/",
  },
  {
    id: "2",
    word: "although",
    translationPt: "embora / apesar de que",
    definitionEn: "despite the fact that",
    partOfSpeech: "connector",
    cefrLevel: "B1+",
    exampleSentence: "Although it was raining, we went for a run.",
    contextNote: "/ɔːlˈðoʊ/",
  },
  {
    id: "3",
    word: "exhausted",
    translationPt: "extremamente cansado / exausto",
    definitionEn: "very tired or having no energy left",
    partOfSpeech: "adjective",
    cefrLevel: "B1",
    exampleSentence: "After 8 hours of coding, I was completely exhausted.",
    contextNote: "/ɪɡˈzɔː.stɪd/",
  },
  {
    id: "4",
    word: "figure out",
    translationPt: "descobrir / resolver / entender",
    definitionEn: "to understand or find the solution to a problem",
    partOfSpeech: "phrasal_verb",
    cefrLevel: "B1",
    exampleSentence: "We need to figure out how to optimize this API.",
    contextNote: "/ˈfɪɡ.jɚ aʊt/",
  },
];

export default function DashboardPage() {
  const [profile, setProfile] = useState<"parent" | "child">("parent");
  const [level, setLevel] = useState<CEFRLevel>("B1+");
  const [isSRSModalOpen, setIsSRSModalOpen] = useState(false);

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
      ? "Pratique conectivos de frase (however, although) e o passado simples sem tradução mental com o tutor de IA."
      : "Aprenda e pratique vocabulário básico de apresentação pessoal, saudações e frases simples com áudio calmo.";

  const missionSkills =
    profile === "parent"
      ? ["Conversação", "Vocabulário Ativo", "Listening"]
      : ["Fundamentos A1", "Vocabulário Básico", "Pronúncia"];

  return (
    <div className="space-y-8">
      {/* Top Greeting and Multi-Profile Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {profile === "parent" ? "Olá, Welld! 👋" : "Olá, Campeão! 🚀"}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 font-normal">
            {profile === "parent"
              ? "Pronto para a missão de hoje? Foque em soltar a fala e recuperar palavras."
              : "Vamos avançar nos fundamentos do inglês com calma e diversão!"}
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
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 font-mono">
          Ações Rápidas
        </h3>
        <QuickActions />
      </div>

      {/* Radar de Habilidades e Estatísticas Semanais */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Card */}
        <div className="lg:col-span-6 p-6 studio-card rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>English Radar (CEFR {level})</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 font-normal">
                  Diagnóstico equilibrado das suas 6 competências
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Hoje
              </span>
            </div>

            <div className="py-2">
              <EnglishRadar data={radarData} size={280} />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Objetivo do Perfil: <strong className="text-white">{profile === "parent" ? "Rumo ao B2" : "Rumo ao A2"}</strong></span>
            <Link href="/progress" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
              <span>Ver detalhes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Vocabulary SRS & Weekly Progress */}
        <div className="lg:col-span-6 space-y-6">
          {/* SRS Memory Review Card */}
          <div className="p-6 studio-card rounded-3xl border-amber-500/30">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Revisão Ativa de Memória</h4>
                  <p className="text-xs text-[var(--text-muted)]">Spaced Repetition System (SRS)</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-400/30">
                {DASHBOARD_SRS_ITEMS.length} prontas
              </span>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex flex-wrap gap-2">
                {DASHBOARD_SRS_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => playPronunciation(item.word)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-[#14141d] border border-white/10 hover:border-amber-500/50 text-amber-300 font-mono flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                  >
                    <span>{item.word}</span>
                    <Volume2 className="w-3.5 h-3.5 text-white/40 hover:text-amber-300" />
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="gold"
              size="sm"
              onClick={() => setIsSRSModalOpen(true)}
              className="w-full"
            >
              <span>Abrir Flashcards 3D</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Weekly Goals Progress */}
          <div className="p-6 studio-card rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Meta Semanal de Estudo</span>
              </h4>
              <span className="text-xs font-mono font-bold text-emerald-400">65 / 100 min</span>
            </div>

            <ProgressBar value={65} max={100} variant="emerald" size="md" showLabel={false} />

            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/10 text-center">
              <div>
                <div className="text-lg font-black text-white font-mono">45 min</div>
                <div className="text-[11px] text-[var(--text-muted)]">Conversação</div>
              </div>
              <div>
                <div className="text-lg font-black text-white font-mono">38</div>
                <div className="text-[11px] text-[var(--text-muted)]">Palavras Ativas</div>
              </div>
              <div>
                <div className="text-lg font-black text-white font-mono">92%</div>
                <div className="text-[11px] text-[var(--text-muted)]">Retenção SRS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Flashcard Modal */}
      <FlashcardModal
        isOpen={isSRSModalOpen}
        onClose={() => setIsSRSModalOpen(false)}
        items={DASHBOARD_SRS_ITEMS}
      />
    </div>
  );
}
