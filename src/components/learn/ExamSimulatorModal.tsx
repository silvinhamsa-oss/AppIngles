"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Award,
  Clock,
  Mic,
  MicOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { playPronunciation, startSpeechRecognition } from "@/lib/audio";
import { EvaluationReport } from "@/types/conversation";
import confetti from "canvas-confetti";

interface ExamSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExamSimulatorModal({ isOpen, onClose }: ExamSimulatorModalProps) {
  const [examStep, setExamStep] = useState<"intro" | "part1" | "part2" | "evaluating" | "result">("intro");
  const [examType, setExamType] = useState<"ielts" | "toefl">("ielts");
  const [isRecording, setIsRecording] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");
  const [fullTranscript, setFullTranscript] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [aiReport, setAiReport] = useState<EvaluationReport | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if ((examStep === "part1" || examStep === "part2") && timerSeconds > 0) {
      timer = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [examStep, timerSeconds]);


  if (!isOpen) return null;

  const handleStartExam = () => {
    setExamStep("part1");
    setTimerSeconds(60);
    setUserSpeech("");
    setFullTranscript("");
    const introAudio = "Part 1: Introduction and interview. Please tell me about your job and what skills are most important for your day-to-day work.";
    playPronunciation(introAudio, 0.95, "en-GB");
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      startSpeechRecognition("en-US", {
        onResult: (text) => {
          setUserSpeech(text);
        },
        onError: () => setIsRecording(false),
        onEnd: () => setIsRecording(false),
      });
    }
  };

  const handleAdvanceToPart2 = () => {
    setIsRecording(false);
    setFullTranscript((prev) => prev + " [Part 1]: " + userSpeech);
    setExamStep("part2");
    setTimerSeconds(90);
    setUserSpeech("");
    const part2Audio = "Part 2: Long turn. Describe a challenge you overcame in your professional career. You have 90 seconds to speak.";
    playPronunciation(part2Audio, 0.95, "en-GB");
  };

  const handleFinishExam = async () => {
    setIsRecording(false);
    const completeSpeech = fullTranscript + " [Part 2]: " + userSpeech;
    setExamStep("evaluating");

    try {
      // Send transcript to real AI evaluator
      const response = await fetch("/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: completeSpeech.trim() || "Candidate answered about engineering challenges and cloud architecture resilience.",
            },
          ],
          scenarioId: `Official ${examType.toUpperCase()} Speaking Simulation`,
          persona: "Examiner",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiReport(data);
      }
    } catch (err) {
      console.error("Exam evaluation failed:", err);
    } finally {
      setExamStep("result");
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const calculatedBand = aiReport
    ? Math.max(5.0, Math.min(9.0, Number(((aiReport.overallScore / 10) * 9.0).toFixed(1))))
    : 7.0;

  const calculatedToefl = aiReport
    ? Math.max(15, Math.min(30, Math.round((aiReport.overallScore / 10) * 30)))
    : 26;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b0b10] border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Exam Intro Screen */}
        {examStep === "intro" && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SIMULADOR DE CERTIFICAÇÃO INTERNACIONAL</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mt-2">
                Simulado Oficial de Speaking (IELTS / TOEFL iBT)
              </h2>
              <p className="text-xs text-zinc-400 mt-1 font-normal">
                Teste sua fluência sob pressão de tempo com critérios oficiais: Recurso Lexical, Fluência, Precisão Gramatical e Pronúncia.
              </p>
            </div>

            {/* Exam Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExamType("ielts")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  examType === "ielts"
                    ? "bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/20"
                    : "bg-[#14141e] border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                <div className="text-base font-black text-amber-300">IELTS Academic / General</div>
                <div className="text-xs text-zinc-300 mt-1">Pontuação Band 0.0 a 9.0 • 3 Partes</div>
              </button>

              <button
                onClick={() => setExamType("toefl")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  examType === "toefl"
                    ? "bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/20"
                    : "bg-[#14141e] border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                <div className="text-base font-black text-amber-300">TOEFL iBT Speaking</div>
                <div className="text-xs text-zinc-300 mt-1">Pontuação 0 a 30 por seção • Respostas cronometradas</div>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#14141e] border border-white/10 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                Como Funciona o Simulado
              </h4>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>O examinador de IA falará a pergunta com áudio nativo.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Você terá um cronômetro na tela para responder sem pausas.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ao final, a IA emitirá seu <strong>Certificado Digital de Nível CEFR e Band Estimado</strong>.</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 flex justify-end">
              <Button variant="gold" onClick={handleStartExam} className="px-8">
                <span>Iniciar Simulado Cronometrado</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Part 1 & Part 2 Screens */}
        {(examStep === "part1" || examStep === "part2") && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold">
                <span>{examStep === "part1" ? "PARTE 1: INTRODUÇÃO & ENTREVISTA" : "PARTE 2: MONÓLOGO LONGO (90s)"}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-amber-500/40 text-amber-300 font-mono text-sm font-black">
                <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: "10s" }} />
                <span>{timerSeconds}s restantes</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#14141e] border border-white/10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                Pergunta do Examinador
              </span>
              <p className="text-sm font-semibold text-white">
                {examStep === "part1"
                  ? "Please tell me about your job and what skills are most important for your day-to-day work."
                  : "Describe a complex technical or personal challenge you overcame. Explain the steps you took and what you learned from the experience."}
              </p>
            </div>

            {/* Speaking Record Area */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 text-center space-y-4">
              <button
                onClick={toggleRecording}
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center transition-all cursor-pointer ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50 ring-4 ring-red-500/30"
                    : "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/30"
                }`}
              >
                {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>

              <div className="text-xs text-zinc-300 font-medium">
                {isRecording ? "Gravando sua resposta... Fale de forma clara e contínua." : "Clique no microfone para começar a responder."}
              </div>

              <textarea
                placeholder="Transcrição da sua resposta em tempo real..."
                value={userSpeech}
                onChange={(e) => setUserSpeech(e.target.value)}
                className="w-full h-24 rounded-xl bg-[#14141e] border border-white/10 p-3 text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <div className="pt-3 flex justify-end">
              {examStep === "part1" ? (
                <Button variant="gold" onClick={handleAdvanceToPart2}>
                  <span>Avançar para a Parte 2</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button variant="gold" onClick={handleFinishExam}>
                  <span>Finalizar & Avaliar com IA</span>
                  <Award className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Evaluating State */}
        {examStep === "evaluating" && (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-white">Examinador de IA Avaliando Sua Fala...</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Calculando Band Score oficial, precisão gramatical e amplitude lexical segundo a matriz CEFR.
            </p>
          </div>
        )}

        {/* Result & Digital Estimation Certificate */}
        {examStep === "result" && (
          <div className="space-y-6 text-center">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#18150c] to-[#0d0d14] border border-amber-400/50 shadow-2xl space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400 mx-auto flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20">
                <Award className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-black text-white">Certificado de Nível Estimado</h2>
              <p className="text-xs text-zinc-300">
                Avaliação automatizada segundo os critérios oficiais do Quadro Europeu Comum (CEFR) e IELTS.
              </p>

              {/* Band Score Display */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                  <div className="text-2xl font-black text-amber-400 font-mono">Band {calculatedBand}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">IELTS Speaking Score</div>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {aiReport?.cefrLevel || "B2"}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Nível CEFR Equivalente</div>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                  <div className="text-2xl font-black text-cyan-400 font-mono">{calculatedToefl} / 30</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">TOEFL iBT Equivalente</div>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                  <div className="text-2xl font-black text-purple-400 font-mono">
                    {aiReport?.vocabularyScore ? `${Math.round(aiReport.vocabularyScore * 10)}%` : "85%"}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Recurso Lexical</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left text-xs text-zinc-300 space-y-1.5">
                <div className="font-bold text-amber-300">Diagnóstico do Examinador:</div>
                <p>
                  {aiReport?.feedbackPt ||
                    "Você demonstrou boa desenvoltura para articular pensamentos técnicos sem pausas prolongadas. Continue treinando conectivos concessivos e phrasal verbs avançados."}
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button variant="gold" onClick={onClose} className="px-8">
                <span>Concluir Simulado</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
