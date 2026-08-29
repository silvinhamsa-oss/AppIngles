"use client";

import React, { useState } from "react";
import {
  Volume2,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Gauge,
  HelpCircle,
  ArrowRight,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { playPronunciation } from "@/lib/audio";
import { CEFRLevel } from "@/types/profile";
import confetti from "canvas-confetti";

export interface DictationExercise {
  id: string;
  title: string;
  level: CEFRLevel;
  accent: "en-US" | "en-GB" | "en-AU";
  accentLabel: string;
  targetSentence: string;
  hintPt: string;
  category: "phrasal_verbs" | "daily_sync" | "travel" | "tech";
}

export const SEED_DICTATIONS: DictationExercise[] = [
  {
    id: "dict_1",
    title: "Alinhamento de Projeto & Latência",
    level: "B1+",
    accent: "en-US",
    accentLabel: "American English",
    targetSentence: "We need to figure out how to optimize this API latency.",
    hintPt: "Dica: 'descobrir / resolver' como phrasal verb",
    category: "tech",
  },
  {
    id: "dict_2",
    title: "Conectivo de Transição em Reunião",
    level: "B1+",
    accent: "en-GB",
    accentLabel: "British English (Oxford)",
    targetSentence: "Although it was challenging, the deployment was successful.",
    hintPt: "Dica: Conectivo concessivo de contraste no início da frase",
    category: "daily_sync",
  },
  {
    id: "dict_3",
    title: "Expressão Idiomática Corporativa",
    level: "B2",
    accent: "en-US",
    accentLabel: "American English",
    targetSentence: "Let us cut to the chase and discuss the core bottleneck.",
    hintPt: "Dica: Expressão para 'ir direto ao ponto'",
    category: "phrasal_verbs",
  },
  {
    id: "dict_4",
    title: "Saudações e Rotina Cotidiana (Iniciante)",
    level: "A1",
    accent: "en-US",
    accentLabel: "American English",
    targetSentence: "I drink coffee every morning and read tech news.",
    hintPt: "Dica: Presente simples sobre hábito diário",
    category: "daily_sync",
  },
];

export function DictationPlayer() {
  const [exercises, setExercises] = useState<DictationExercise[]>(SEED_DICTATIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.75 | 1.0 | 1.25>(1.0);
  const [userInput, setUserInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<{
    checked: boolean;
    isExact: boolean;
    accuracyPercent: number;
    diffWords: Array<{ word: string; status: "correct" | "missing" | "extra" }>;
  } | null>(null);

  const currentExercise = exercises[currentIndex];

  const handlePlayAudio = (speed = playbackSpeed) => {
    setIsPlaying(true);
    const utter = playPronunciation(currentExercise.targetSentence, speed, currentExercise.accent);
    if (utter) {
      utter.onend = () => setIsPlaying(false);
      utter.onerror = () => setIsPlaying(false);
    } else {
      setTimeout(() => setIsPlaying(false), 2500);
    }
  };

  const handleCheckDictation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const targetWords = currentExercise.targetSentence
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      .toLowerCase()
      .split(/\s+/);

    const userWords = userInput
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      .toLowerCase()
      .split(/\s+/);

    let matchCount = 0;
    const diff: Array<{ word: string; status: "correct" | "missing" | "extra" }> = [];

    targetWords.forEach((word, idx) => {
      if (userWords.includes(word)) {
        diff.push({ word, status: "correct" });
        matchCount++;
      } else {
        diff.push({ word, status: "missing" });
      }
    });

    const accuracyPercent = Math.round((matchCount / Math.max(1, targetWords.length)) * 100);
    const isExact = accuracyPercent === 100;

    setResult({
      checked: true,
      isExact,
      accuracyPercent,
      diffWords: diff,
    });

    if (isExact) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10b981", "#f59e0b", "#ffffff"],
      });
    }
  };

  const handleNextExercise = () => {
    setResult(null);
    setUserInput("");
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % exercises.length);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-amber-500/30 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 uppercase">
              {currentExercise.level} • {currentExercise.accentLabel}
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Exercício {currentIndex + 1} de {exercises.length}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">{currentExercise.title}</h3>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10">
          <span className="text-[10px] font-mono text-zinc-400 pl-2 pr-1">Velocidade:</span>
          {([0.75, 1.0, 1.25] as const).map((speed) => (
            <button
              key={speed}
              onClick={() => {
                setPlaybackSpeed(speed);
                handlePlayAudio(speed);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                playbackSpeed === speed
                  ? "bg-amber-500 text-zinc-950 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Main Audio Player Box */}
      <div className="p-8 rounded-3xl bg-black/50 border border-white/10 text-center space-y-4 relative overflow-hidden">
        <button
          onClick={() => handlePlayAudio(playbackSpeed)}
          className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all cursor-pointer ${
            isPlaying
              ? "bg-amber-400 text-zinc-950 scale-110 shadow-2xl shadow-amber-500/50 animate-pulse ring-4 ring-amber-400/30"
              : "bg-gradient-to-tr from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 shadow-xl shadow-amber-500/25 active:scale-95"
          }`}
          title="Tocar áudio da frase"
        >
          {isPlaying ? <Volume2 className="w-9 h-9" /> : <Play className="w-9 h-9 fill-zinc-950 ml-1" />}
        </button>

        <div>
          <div className="text-sm font-bold text-white">
            {isPlaying ? "Reproduzindo áudio nativo..." : "Clique para ouvir a frase"}
          </div>
          <div className="text-xs text-zinc-400 mt-0.5">
            Ouça quantas vezes precisar e digite o que ouviu abaixo
          </div>
        </div>
      </div>

      {/* Dictation Input Form */}
      <form onSubmit={handleCheckDictation} className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
              O que você ouviu? (Digite a frase em inglês)
            </label>
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? "Ocultar Dica" : "Ver Dica"}</span>
            </button>
          </div>

          {showHint && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 animate-in fade-in">
              {currentExercise.hintPt}
            </div>
          )}

          <input
            type="text"
            required
            placeholder="Digite exatamente as palavras ouvidas..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full rounded-2xl bg-[#14141e] border border-white/15 px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Diff Result Analysis */}
        {result && (
          <div
            className={`p-5 rounded-2xl border space-y-3 animate-in fade-in ${
              result.isExact
                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                : "bg-amber-950/30 border-amber-500/40 text-amber-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold">
                {result.isExact ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Perfeito! 100% de Precisão Auditiva 🎉</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <span>Precisão: {result.accuracyPercent}%</span>
                  </>
                )}
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/40">
                +{result.isExact ? "30" : "15"} XP
              </span>
            </div>

            <div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono mb-1">
                Frase Original:
              </div>
              <div className="text-sm font-semibold text-white">
                "{currentExercise.targetSentence}"
              </div>
            </div>

            {/* Word by word breakdown */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {result.diffWords.map((item, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2.5 py-1 rounded-lg font-mono font-semibold ${
                    item.status === "correct"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-red-500/20 text-red-300 border border-red-500/40"
                  }`}
                >
                  {item.word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handlePlayAudio(0.75)}
            className="text-xs border-white/10"
          >
            <Volume2 className="w-3.5 h-3.5 mr-1" />
            <span>Ouvir em Câmera Lenta (0.75x)</span>
          </Button>

          <div className="flex items-center gap-2">
            {!result ? (
              <Button type="submit" variant="gold" className="text-xs">
                <span>Verificar Ditado</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button type="button" variant="gold" onClick={handleNextExercise} className="text-xs">
                <span>Próximo Exercício</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
