"use client";

import React, { useState, useEffect } from "react";
import { Volume2, RotateCw, Check, X, Sparkles, ArrowRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { playPronunciation } from "@/lib/audio";
import { VocabularyItem } from "@/types/vocabulary";
import confetti from "canvas-confetti";

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: VocabularyItem[];
  onRate?: (itemId: string, rating: number) => void;
}

export function FlashcardModal({
  isOpen,
  onClose,
  items,
  onRate,
}: FlashcardModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsFlipped(false);
      setIsCompleted(false);
    }
  }, [isOpen]);

  // Keyboard shortcut support: Space to flip, 1-4 to rate
  useEffect(() => {
    if (!isOpen || isCompleted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped && ["1", "2", "3", "4"].includes(e.key)) {
        handleScore(parseInt(e.key));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFlipped, isCompleted, currentIndex]);

  const handleScore = (score: number) => {
    if (onRate && currentItem) {
      onRate(currentItem.id, score);
    }

    if (currentIndex + 1 < items.length) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      {!isCompleted && currentItem ? (
        <div className="space-y-6">
          {/* Header Progress */}
          <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
            <span className="font-semibold uppercase tracking-wider text-amber-400">
              Active Recall • SRS Review
            </span>
            <span className="font-mono text-zinc-300 font-bold">
              {currentIndex + 1} / {items.length}
            </span>
          </div>

          {/* 3D Flip Card Container */}
          <div
            className="perspective-1000 w-full min-h-[300px] cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className={`w-full min-h-[300px] rounded-3xl p-8 transition-transform duration-500 transform-style-3d relative flex flex-col justify-between studio-card border-zinc-700/60 ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* Front Side */}
              <div className={`space-y-6 text-center my-auto ${isFlipped ? "hidden" : "block"}`}>
                <div className="inline-block px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold">
                  Nível {currentItem.cefrLevel} • {currentItem.partOfSpeech}
                </div>

                <div className="space-y-2">
                  <h2 className="text-4xl sm:text-5xl font-black text-zinc-100 tracking-tight font-mono">
                    {currentItem.word}
                  </h2>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-mono text-amber-400/90">
                      {currentItem.contextNote || "/ˈæktʃu.ə.li/"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playPronunciation(currentItem.word);
                      }}
                      className="p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
                      title="Ouvir pronúncia nativa"
                    >
                      <Volume2 className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-zinc-500 flex items-center justify-center gap-1.5 pt-4">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Clique ou aperte <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">Espaço</kbd> para virar o card</span>
                </div>
              </div>

              {/* Back Side */}
              <div
                className={`space-y-4 my-auto rotate-y-180 ${
                  isFlipped ? "block" : "hidden"
                }`}
              >
                <div className="text-center pb-3 border-b border-zinc-800/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Significado</span>
                  <h3 className="text-2xl font-bold text-zinc-100 mt-1">
                    {currentItem.translationPt}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    {currentItem.definitionEn}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    Exemplo em contexto real:
                  </span>
                  <p className="text-sm text-zinc-200 italic">
                    &ldquo;{currentItem.exampleSentence}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Controls when Flipped */}
          {isFlipped ? (
            <div className="space-y-2 animate-in fade-in duration-200">
              <div className="text-center text-xs font-semibold text-zinc-400">
                Como foi a recuperação da sua memória? (Atalhos: 1, 2, 3, 4)
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleScore(1)}
                  className="p-3 rounded-2xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1"
                >
                  <span>1. Esqueci</span>
                  <span className="text-[10px] opacity-60">1 dia</span>
                </button>
                <button
                  onClick={() => handleScore(2)}
                  className="p-3 rounded-2xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1"
                >
                  <span>2. Difícil</span>
                  <span className="text-[10px] opacity-60">3 dias</span>
                </button>
                <button
                  onClick={() => handleScore(3)}
                  className="p-3 rounded-2xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30 text-blue-300 text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1"
                >
                  <span>3. Bom</span>
                  <span className="text-[10px] opacity-60">7 dias</span>
                </button>
                <button
                  onClick={() => handleScore(4)}
                  className="p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1"
                >
                  <span>4. Fácil</span>
                  <span className="text-[10px] opacity-60">14 dias</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsFlipped(true)}
              >
                <span>Mostrar Tradução & Exemplo</span>
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Completed State */
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-100">
            Revisão Concluída com Sucesso!
          </h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            Você reforçou a memória ativa de <strong>{items.length} palavras</strong>. Os intervalos de repetição foram recalculados.
          </p>
          <Button variant="glow" onClick={onClose} className="mt-4">
            Voltar ao Banco de Vocabulário
          </Button>
        </div>
      )}
    </Modal>
  );
}
