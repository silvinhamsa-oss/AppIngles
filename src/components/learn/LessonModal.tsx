"use client";

import React, { useState } from "react";
import {
  X,
  Volume2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Award,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Lesson } from "@/types/curriculum";
import { playPronunciation } from "@/lib/audio";
import confetti from "canvas-confetti";


interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  onCompleteLesson: (lessonId: string, xpEarned: number) => void;
}

export function LessonModal({
  isOpen,
  onClose,
  lesson,
  onCompleteLesson,
}: LessonModalProps) {
  const [activeStep, setActiveStep] = useState<"content" | "exercises" | "completed">("content");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [exerciseFeedback, setExerciseFeedback] = useState<Record<string, boolean>>({});

  if (!isOpen || !lesson) return null;

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    const utter = playPronunciation(lesson.audioText, 0.95, "en-US");
    if (utter) {
      utter.onend = () => setIsPlayingAudio(false);
      utter.onerror = () => setIsPlayingAudio(false);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  const handleSelectAnswer = (exerciseId: string, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [exerciseId]: answer }));
  };

  const handleCheckExercises = () => {
    const feedback: Record<string, boolean> = {};
    lesson.exercises.forEach((ex) => {
      if (ex.correctAnswer) {
        const userAns = (selectedAnswers[ex.id] || "").trim().toLowerCase();
        const isCorrect = userAns === ex.correctAnswer.trim().toLowerCase();
        feedback[ex.id] = isCorrect;
      } else {
        feedback[ex.id] = true;
      }
    });

    setExerciseFeedback(feedback);
    const allCorrect = Object.values(feedback).every((v) => v);

    if (allCorrect) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#10b981", "#ffffff"],
      });
      setActiveStep("completed");
      onCompleteLesson(lesson.id, lesson.xpReward);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b0b10] border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: Content & Native Audio */}
        {activeStep === "content" && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>NÍVEL {lesson.level} • UNIDADE {lesson.unit}</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mt-2">
                {lesson.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-1 font-normal">
                {lesson.description}
              </p>
            </div>

            {/* Audio Story Box */}
            <div className="p-5 rounded-2xl bg-[#14141e] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Áudio da Lição (Native Speaker)
                </span>
                <button
                  onClick={handlePlayAudio}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isPlayingAudio
                      ? "bg-amber-500 border-amber-400 text-zinc-950 animate-pulse"
                      : "bg-white/5 hover:bg-white/10 border-white/15 text-white"
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingAudio ? "Ouvindo..." : "Tocar Áudio"}</span>
                </button>
              </div>

              <p className="text-sm text-zinc-200 leading-relaxed font-serif italic bg-black/40 p-4 rounded-xl border border-white/5">
                &ldquo;{lesson.audioText}&rdquo;
              </p>
            </div>

            {/* Key Vocabulary Highlights */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
                Vocabulário-Chave da Lição
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {lesson.keyVocabulary.map((vocab, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-[#14141e] border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{vocab.term}</span>
                        <button
                          onClick={() => playPronunciation(vocab.term)}
                          className="text-zinc-400 hover:text-amber-300 p-0.5"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                      {vocab.ipa && <div className="text-[10px] text-amber-400 font-mono">{vocab.ipa}</div>}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-2">{vocab.translationPt}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <Button variant="gold" onClick={() => setActiveStep("exercises")}>
                <span>Ir para os Exercícios ({lesson.exercises.length})</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Practice Exercises */}
        {activeStep === "exercises" && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400">PRÁTICA ATIVA</span>
              <h2 className="text-xl font-black text-white tracking-tight mt-1">
                Exercícios de Fixação & Ditado
              </h2>
            </div>

            <div className="space-y-4">
              {lesson.exercises.map((ex, idx) => (
                <div
                  key={ex.id}
                  className="p-5 rounded-2xl bg-[#14141e] border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-zinc-400">
                      Questão {idx + 1} de {lesson.exercises.length}
                    </span>
                    {ex.audioPrompt && (
                      <button
                        onClick={() => playPronunciation(ex.audioPrompt!)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Ouvir Ditado</span>
                      </button>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-white">{ex.question}</p>

                  {/* Multiple Choice or Fill Blanks Options */}
                  {ex.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {ex.options.map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectAnswer(ex.id, opt)}
                          className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                            selectedAnswers[ex.id] === opt
                              ? "bg-amber-500/20 border-amber-400 text-amber-200"
                              : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Text Input for Dictation */}
                  {ex.type === "dictation" && (
                    <input
                      type="text"
                      placeholder="Digite o que ouviu no áudio em inglês..."
                      value={selectedAnswers[ex.id] || ""}
                      onChange={(e) => handleSelectAnswer(ex.id, e.target.value)}
                      className="w-full rounded-xl bg-[#09090e] border border-white/15 p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  )}

                  {/* Feedback feedback per exercise */}
                  {exerciseFeedback[ex.id] === false && (
                    <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Resposta incorreta. Tente novamente!</span>
                    </div>
                  )}

                  {exerciseFeedback[ex.id] === true && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>Correto! {ex.explanationPt}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between">
              <Button variant="outline" onClick={() => setActiveStep("content")}>
                Voltar à Lição
              </Button>
              <Button variant="gold" onClick={handleCheckExercises}>
                <Check className="w-4 h-4 mr-1" />
                <span>Verificar Respostas</span>
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Completed Congratulations */}
        {activeStep === "completed" && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400/40 mx-auto flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/20">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-white">Lição Concluída com Sucesso! 🚀</h2>
            <p className="text-xs text-zinc-300 max-w-md mx-auto">
              Você dominou as estruturas desta aula e acumulou <strong>+{lesson.xpReward} XP</strong> para seu perfil.
            </p>

            <div className="pt-4">
              <Button variant="gold" onClick={onClose} className="px-8">
                <span>Continuar Trilha</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
