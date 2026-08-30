"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  RotateCcw,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { createClient } from "@/lib/supabase/client";

interface QuizQuestion {
  question: string;
  contextPt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skillFocus: string;
}

const WEAKNESS_QUESTIONS: QuizQuestion[] = [
  {
    question: "We need to ______ the budget constraints before presenting to the board.",
    contextPt: "Preencha com o phrasal verb correto para 'levar em consideração / solucionar':",
    options: ["figure out", "look up to", "come across", "give up on"],
    correctIndex: 0,
    explanation: "'Figure out' significa resolver, entender ou calcular uma solução para um problema complexo.",
    skillFocus: "Phrasal Verbs & Vocabulário",
  },
  {
    question: "______ the release was delayed, the team delivered all critical security fixes.",
    contextPt: "Escolha o conectivo de contraste correto para 'Apesar de que':",
    options: ["Furthermore", "Although", "Meanwhile", "Therefore"],
    correctIndex: 1,
    explanation: "'Although' expressa concessão e contraste ('embora / apesar de que'), introduzindo uma oração subordinada.",
    skillFocus: "Grammar & Connectors",
  },
  {
    question: "Which sentence uses the correct preposition for business meetings?",
    contextPt: "Identifique a regência preposicional exata em inglês:",
    options: [
      "Let's touch base with the design team tomorrow.",
      "Let's touch base on the design team tomorrow.",
      "Let's touch base into the design team tomorrow.",
      "Let's touch base for the design team tomorrow.",
    ],
    correctIndex: 0,
    explanation: "A expressão idiomática correta é 'touch base WITH someone' (fazer um alinhamento com alguém).",
    skillFocus: "Collocations & Prepositions",
  },
  {
    question: "I look forward to ______ from you regarding the contract proposal.",
    contextPt: "Atenção à estrutura de gerúndio após a preposição 'to':",
    options: ["hear", "hearing", "heard", "be heard"],
    correctIndex: 1,
    explanation: "Após 'look forward to', o 'to' é preposição, exigindo o verbo no gerúndio (-ing): 'look forward to hearing'.",
    skillFocus: "Advanced Grammar (Gerunds)",
  },
];

interface WeaknessQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXp?: (xp: number) => void;
}

export function WeaknessQuizModal({
  isOpen,
  onClose,
  onRewardXp,
}: WeaknessQuizModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = WEAKNESS_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < WEAKNESS_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#10b981", "#ffffff"],
      });

      // Grant XP
      if (onRewardXp) {
        onRewardXp(50);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setIsCompleted(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🧠 Quiz de Reforço dos Pontos Fracos"
      description="Exercícios adaptativos gerados com base nas áreas de maior oportunidade do seu radar."
      maxWidth="lg"
    >
      <div className="space-y-5">
        {!isCompleted ? (
          <>
            {/* Progress Bar & Skill Tag */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Foco: {currentQ.skillFocus}
              </span>
              <span className="text-zinc-400 font-mono">
                Questão <strong>{currentIndex + 1}</strong> de {WEAKNESS_QUESTIONS.length}
              </span>
            </div>

            {/* Question Card */}
            <div className="p-5 rounded-2xl bg-[#14141e] border border-white/10 space-y-2">
              <span className="text-[11px] text-zinc-400 block font-normal">{currentQ.contextPt}</span>
              <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                {currentQ.question}
              </h4>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyles = "bg-[#14141e] hover:bg-white/5 border-white/10 text-white";
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyles = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300";
                  } else if (isSelected) {
                    btnStyles = "bg-red-500/20 border-red-500/50 text-red-300";
                  } else {
                    btnStyles = "opacity-40 bg-[#14141e] border-white/5 text-zinc-500";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all text-left flex items-center justify-between cursor-pointer ${btnStyles}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation when answered */}
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1 animate-in fade-in">
                <span className="font-bold text-amber-300 block font-mono uppercase text-[10px]">
                  💡 Explicação Gramatical:
                </span>
                <p className="text-zinc-200 leading-relaxed font-normal">{currentQ.explanation}</p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div className="pt-2 flex justify-end">
                <Button type="button" variant="gold" onClick={handleNext} className="text-xs px-6 font-bold shadow-md shadow-amber-500/20">
                  <span>{currentIndex + 1 === WEAKNESS_QUESTIONS.length ? "Ver Resultado" : "Próxima Questão →"}</span>
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Completion Screen */
          <div className="p-6 rounded-3xl bg-[#14141e] border border-amber-500/30 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <Award className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">Treino de Reforço Concluído!</h3>
              <p className="text-xs text-zinc-300">
                Você acertou <strong>{correctCount} de {WEAKNESS_QUESTIONS.length}</strong> questões focadas nas suas maiores lacunas.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold inline-block">
              +50 XP BÔNUS ADICIONADOS
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button type="button" variant="outline" onClick={handleRestart} className="w-full sm:w-auto text-xs">
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                <span>Refazer Treino</span>
              </Button>

              <Button type="button" variant="gold" onClick={onClose} className="w-full sm:w-auto text-xs font-bold">
                <span>Finalizar</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
