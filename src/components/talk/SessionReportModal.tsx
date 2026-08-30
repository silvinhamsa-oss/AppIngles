"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Brain,
  Award,
  BookPlus,
  ArrowRight,
  X,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { playPronunciation } from "@/lib/audio";
import confetti from "canvas-confetti";


export interface EvaluationReport {
  fluencyScore: number;
  vocabularyScore: number;
  grammarScore: number;
  naturalnessScore: number;
  confidenceScore: number;
  whatYouDidWell: string[];
  whatToImprove: string[];
  extractedVocabulary: Array<{
    word: string;
    translationPt: string;
    context: string;
  }>;
  corrections: Array<{
    originalText: string;
    improvedText: string;
    explanationPt: string;
    severity: "critical" | "important" | "minor";
    category: "grammar" | "vocabulary" | "naturalness";
  }>;
}

interface SessionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: EvaluationReport | null;
  durationMinutes: number;
}

export function SessionReportModal({
  isOpen,
  onClose,
  report,
  durationMinutes,
}: SessionReportModalProps) {
  const [savedWords, setSavedWords] = useState<Record<string, boolean>>({});

  if (!isOpen || !report) return null;

  const handleSaveWord = (word: string) => {
    setSavedWords((prev) => ({ ...prev, [word]: true }));
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#f59e0b", "#10b981", "#ffffff"],
    });
  };

  const averageScore = Math.round(
    (report.fluencyScore +
      report.vocabularyScore +
      report.grammarScore +
      report.naturalnessScore +
      report.confidenceScore) /
      5
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b0b10] border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Score Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>RELATÓRIO DE SESSÃO CONCLUÍDA</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mt-2">
              Excelente prática, Welld! 🚀
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Duração da sessão: <strong>{durationMinutes} minutos</strong> • +75 XP adicionados à sua conta!
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#14141e] border border-white/10 shrink-0">
            <div className="text-3xl font-black text-amber-400 font-mono">
              {averageScore}%
            </div>
            <div className="text-[11px] text-zinc-400 leading-tight">
              Índice Geral de<br />
              <strong className="text-white">Fluência Ativa</strong>
            </div>
          </div>
        </div>

        {/* Scores Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
          {[
            { label: "Fluência", score: report.fluencyScore, color: "text-amber-400" },
            { label: "Vocabulário", score: report.vocabularyScore, color: "text-emerald-400" },
            { label: "Gramática", score: report.grammarScore, color: "text-cyan-400" },
            { label: "Naturalidade", score: report.naturalnessScore, color: "text-purple-400" },
            { label: "Confiança", score: report.confidenceScore, color: "text-amber-300" },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className={`text-xl font-black font-mono ${item.color}`}>{item.score}%</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* What You Did Well & Opportunities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Positive Reinforcement */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>O que você fez muito bem:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {report.whatYouDidWell.map((pt, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Constructive Improvements */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Pontos para calibrar no próximo treino:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {report.whatToImprove.map((pt, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pedagogical Corrections (Original vs Improved) */}
        {report.corrections && report.corrections.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
              Calibração de Frases (Você disse vs Melhor forma natural)
            </h4>
            <div className="space-y-2.5">
              {report.corrections.map((corr, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-[#14141e] border border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-red-400 font-mono line-through">❌ {corr.originalText}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-mono uppercase">
                      {corr.category}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
                    <span>✨ {corr.improvedText}</span>
                    <button
                      onClick={() => playPronunciation(corr.improvedText)}
                      className="text-zinc-400 hover:text-emerald-300 p-0.5"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400 italic">
                    {corr.explanationPt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extracted Vocabulary ready to add to SRS */}
        {report.extractedVocabulary && report.extractedVocabulary.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vocabulário Novo Identificado nesta Conversa</span>
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {report.extractedVocabulary.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-[#14141e] border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-mono">{item.word}</span>
                      <button
                        onClick={() => playPronunciation(item.word)}
                        className="text-zinc-400 hover:text-amber-400 p-0.5"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[11px] text-amber-300/80 mt-1">{item.translationPt}</p>
                    <p className="text-[10px] text-zinc-500 italic mt-0.5 truncate">&ldquo;{item.context}&rdquo;</p>
                  </div>

                  <button
                    onClick={() => handleSaveWord(item.word)}
                    disabled={savedWords[item.word]}
                    className={`mt-3 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      savedWords[item.word]
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-sm"
                    }`}
                  >
                    {savedWords[item.word] ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Salvo no SRS!</span>
                      </>
                    ) : (
                      <>
                        <BookPlus className="w-3 h-3" />
                        <span>Salvar no Banco</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Action */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <Button variant="gold" onClick={onClose} className="w-full sm:w-auto">
            <span>Concluir e Voltar ao Painel</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
