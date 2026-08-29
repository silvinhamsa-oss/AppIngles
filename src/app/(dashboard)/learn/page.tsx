"use client";

import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  Award,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LessonModal } from "@/components/learn/LessonModal";
import { ExamSimulatorModal } from "@/components/learn/ExamSimulatorModal";
import { LEVEL_METADATA, CURRICULUM_LESSONS } from "@/lib/curriculum-data";
import { LevelCategory, Lesson } from "@/types/curriculum";

export default function LearnPage() {
  const [selectedLevel, setSelectedLevel] = useState<LevelCategory>("B1");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({
    a1_1: true,
  });

  const levelInfo = LEVEL_METADATA[selectedLevel];
  const levelLessons = CURRICULUM_LESSONS.filter((l) => l.level === selectedLevel);

  const handleCompleteLesson = (lessonId: string, xpEarned: number) => {
    setCompletedLessons((prev) => ({ ...prev, [lessonId]: true }));
  };

  const levelProgress = Math.round(
    (levelLessons.filter((l) => completedLessons[l.id]).length / Math.max(1, levelLessons.length)) * 100
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>TRILHA COMPLETA CEFR (A1 AO C2 + CERTIFICAÇÃO)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
            Curso Estruturado & Preparatório
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 font-normal">
            Domine do inglês básico ao nível quase nativo com áudio autêntico, prática ativa e simulados de exames internacionais.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="gold"
            onClick={() => setIsExamModalOpen(true)}
            className="shadow-lg shadow-amber-500/20 text-xs"
          >
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            <span>Simulador de Certificação (IELTS/TOEFL)</span>
          </Button>
        </div>
      </div>

      {/* Level Navigation Tabs (A1 -> C2 + Exam Prep) */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-[#0d0d14] border border-white/10 rounded-3xl shadow-inner">
        {(["A1", "A2", "B1", "B2", "C1", "C2", "EXAM_PREP"] as LevelCategory[]).map((lvl) => {
          const isSelected = selectedLevel === lvl;
          return (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-mono transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/25"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {lvl === "EXAM_PREP" ? "🎓 Simulado IELTS/TOEFL" : `Nível ${lvl}`}
            </button>
          );
        })}
      </div>

      {/* Level Overview Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${levelInfo.color} border shadow-2xl relative overflow-hidden`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-black/40 text-white">
              {levelInfo.badge}
            </span>
            <h2 className="text-2xl font-black text-white">{levelInfo.name}</h2>
            <p className="text-sm text-zinc-200 leading-relaxed font-normal">
              {levelInfo.description}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 shrink-0 text-left sm:text-right min-w-[200px]">
            <div className="text-xs text-zinc-300 mb-1">Progresso do Nível</div>
            <div className="text-2xl font-black text-white font-mono">{levelProgress}%</div>
            <div className="mt-2">
              <ProgressBar value={levelProgress} max={100} variant="amber" size="sm" showLabel={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Lessons List Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Lições e Módulos Práticos ({levelLessons.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {levelLessons.map((lesson) => {
            const isCompleted = completedLessons[lesson.id];

            return (
              <div
                key={lesson.id}
                className="p-6 rounded-3xl bg-[#0d0d14] border border-white/10 hover:border-amber-500/40 hover:bg-[#12121a] transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-amber-300">
                        Unidade {lesson.unit}
                      </span>
                      <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>{lesson.durationMinutes} min</span>
                      </span>
                    </div>

                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Concluída</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-1">
                    {lesson.title}
                  </h4>

                  <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-4">
                    {lesson.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {lesson.keyVocabulary.slice(0, 3).map((v, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-black/40 border border-white/5 text-zinc-300"
                      >
                        {v.term}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    +{lesson.xpReward} XP
                  </span>

                  <button
                    onClick={() => setActiveLesson(lesson)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-zinc-950" />
                    <span>{isCompleted ? "Revisar Aula" : "Iniciar Aula"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lesson Modal */}
      <LessonModal
        isOpen={!!activeLesson}
        onClose={() => setActiveLesson(null)}
        lesson={activeLesson}
        onCompleteLesson={handleCompleteLesson}
      />

      {/* Exam Simulator Modal */}
      <ExamSimulatorModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
      />
    </div>
  );
}
