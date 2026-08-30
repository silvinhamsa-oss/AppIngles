"use client";

import React, { useState, useEffect } from "react";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { EnglishRadar } from "@/components/dashboard/EnglishRadar";
import { FlashcardModal } from "@/components/vocabulary/FlashcardModal";
import { VoiceOrb } from "@/components/ui/VoiceOrb";
import { CEFRLevel, SkillRadarData } from "@/types/profile";
import { VocabularyItem } from "@/types/vocabulary";
import { playPronunciation } from "@/lib/audio";
import { createClient } from "@/lib/supabase/client";
import { SEED_VOCABULARY } from "@/lib/vocabulary-data";
import {
  Brain,
  ArrowRight,
  Volume2,
  Flame,
  Check,
} from "lucide-react";

interface DBVocabItem {
  id: string;
  word: string;
  phonetic_ipa?: string;
  part_of_speech?: "noun" | "verb" | "phrasal_verb" | "adjective" | "adverb" | "connector" | "idiom";
  cefr_level?: string;
  translation_pt: string;
  definition_en?: string;
  example_sentence?: string;
  repetition_count?: number;
  interval_days?: number;
  ease_factor?: number;
  next_review_date?: string;
  status?: "new" | "learning" | "reviewing" | "active" | "mastered" | "difficult";
}

export default function DashboardPage() {
  const [level, setLevel] = useState<CEFRLevel>("B1+");
  const [isSRSModalOpen, setIsSRSModalOpen] = useState(false);
  const [srsItems, setSrsItems] = useState<VocabularyItem[]>(SEED_VOCABULARY.slice(0, 4));
  const [streakDays, setStreakDays] = useState(5);
  const [userXp, setUserXp] = useState(1240);
  const [userName, setUserName] = useState("Welld");

  const [radarData] = useState<SkillRadarData>({
    speaking: 72,
    vocabulary: 68,
    listening: 78,
    grammar: 82,
    reading: 85,
    writing: 74,
  });


  useEffect(() => {
    async function loadDashboardData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // 1. Load user profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile) {
            if (profile.cefr_level) setLevel(profile.cefr_level as CEFRLevel);
            if (profile.streak_days !== undefined) setStreakDays(profile.streak_days || 1);
            if (profile.xp_points !== undefined) setUserXp(profile.xp_points || 100);
            if (profile.full_name) setUserName(profile.full_name.split(" ")[0]);
          }

          // 2. Load user vocabulary
          const { data: vocab } = await supabase
            .from("user_vocabulary")
            .select("*")
            .eq("user_id", user.id)
            .limit(4);

          if (vocab && vocab.length > 0) {
            const mappedVocab: VocabularyItem[] = (vocab as unknown as DBVocabItem[]).map((v) => ({
              id: v.id,
              word: v.word,
              phoneticIpa: v.phonetic_ipa || "/.../",
              partOfSpeech: v.part_of_speech || "noun",
              cefrLevel: (v.cefr_level as CEFRLevel) || "B1+",
              translationPt: v.translation_pt,
              definitionEn: v.definition_en || "",
              exampleSentence: v.example_sentence || "",
              repetitionCount: v.repetition_count || 0,
              intervalDays: v.interval_days || 1,
              easeFactor: Number(v.ease_factor) || 2.5,
              nextReviewDate: v.next_review_date || new Date().toISOString(),
              status: v.status || "learning",
            }));
            setSrsItems(mappedVocab);
          }
        }
      } catch (err) {
        console.error("Dashboard Supabase loading error:", err);
      }
    }

    loadDashboardData();
  }, []);

  // Compute current week calendar days dynamically
  const today = new Date();
  const currentDayIndex = today.getDay(); // 0 is Sunday, 1 is Monday...
  const mondayOffset = currentDayIndex === 0 ? -6 : 1 - currentDayIndex;
  const mondayDate = new Date(today);
  mondayDate.setDate(today.getDate() + mondayOffset);

  const dayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const weekDays = dayNames.map((name, i) => {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + i);
    const isPast = d < today && d.toDateString() !== today.toDateString();
    const isToday = d.toDateString() === today.toDateString();
    return {
      day: name,
      date: String(d.getDate()).padStart(2, "0"),
      completed: isPast,
      isToday,
    };
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Living AI Voice Orb Hero */}
      <VoiceOrb
        userName={userName}
        targetLevel={level}
        streakDays={streakDays}
        dailyGoalMinutes={20}
      />

      {/* Main Adaptive Mission Card */}
      <MissionCard targetLevel={level} />

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Spaced Repetition & Streak Engine */}
        <div className="lg:col-span-2 space-y-6">
          {/* Spaced Repetition Active Recall Panel */}
          <div className="card-halo-emerald rounded-3xl p-6 sm:p-7 bg-[#0d0d14] border border-emerald-500/30 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-500/15">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Active Recall & Vocabulário Ativo
                  </h3>
                  <p className="text-xs text-zinc-400 font-normal">
                    {srsItems.length} palavras prioritárias para revisão hoje no motor SuperMemo-2
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSRSModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                <span>Praticar Flashcards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Word Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {srsItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#14141e] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {item.word}
                      </span>
                      <button
                        onClick={() => playPronunciation(item.word, 0.95, "en-US")}
                        className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-emerald-300 font-semibold mb-1">
                      {item.translationPt}
                    </p>
                    <p className="text-[11px] text-zinc-400 italic line-clamp-2">
                      &ldquo;{item.exampleSentence}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-2.5 pt-2 border-t border-white/5 font-mono">
                    <span>{item.partOfSpeech}</span>
                    <span className="text-emerald-400 font-bold">{item.cefrLevel}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex sm:hidden">
              <button
                onClick={() => setIsSRSModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 text-xs font-bold"
              >
                <span>Praticar Flashcards 3D</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 7-Day Consistency & Streak Tracker */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#0d0d14] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Flame className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Ofensiva de Consistência</h4>
                  <p className="text-xs text-zinc-400 font-normal">
                    {streakDays} dias seguidos praticando em inglês
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
                {userXp} XP Total
              </span>
            </div>

            {/* 7 Day Visual Checkmark Grid */}
            <div className="grid grid-cols-7 gap-2 pt-2">
              {weekDays.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    item.isToday
                      ? "bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/20"
                      : item.completed
                      ? "bg-[#14141e] border-amber-500/40"
                      : "bg-[#101018] border-white/5"
                  }`}
                >
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">
                    {item.day}
                  </span>
                  <span className="text-xs font-bold text-white block my-1">{item.date}</span>
                  <div className="flex justify-center">
                    {item.completed ? (
                      <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-zinc-950">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/10" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: English Radar & Quick Actions */}
        <div className="space-y-6">
          <EnglishRadar data={radarData} currentLevel={level} />
          <QuickActions />
        </div>
      </div>

      {/* Spaced Repetition Modal */}
      <FlashcardModal
        isOpen={isSRSModalOpen}
        onClose={() => setIsSRSModalOpen(false)}
        items={srsItems}
      />
    </div>
  );
}
