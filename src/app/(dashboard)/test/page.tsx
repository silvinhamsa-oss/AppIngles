"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Volume2,
  Mic,
  MicOff,
  ArrowRight,
  RotateCcw,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { playPronunciation, startSpeechRecognition } from "@/lib/audio";
import { CEFRLevel } from "@/types/profile";
import confetti from "canvas-confetti";
import { createClient } from "@/lib/supabase/client";


interface Question {
  id: number;
  stage: string;
  levelTested: CEFRLevel;
  question: string;
  options: string[];
  correctIndex: number;
  explanationPt: string;
}

const PLACEMENT_QUESTIONS: Question[] = [
  {
    id: 1,
    stage: "Fundamentos (A1)",
    levelTested: "A1",
    question: "Complete: 'Every morning, I ______ coffee before going to work.'",
    options: ["drink", "drinking", "drank", "drinks"],
    correctIndex: 0,
    explanationPt: "Para hábitos cotidianos na primeira pessoa (I), usamos o verbo no infinitivo sem 'to'.",
  },
  {
    id: 2,
    stage: "Estruturas Básicas (A2)",
    levelTested: "A2",
    question: "Complete: 'Yesterday, we ______ an important meeting with our client.'",
    options: ["have", "having", "had", "has had"],
    correctIndex: 2,
    explanationPt: "'Yesterday' exige o passado simples irregular de have: 'had'.",
  },
  {
    id: 3,
    stage: "Conectivos de Transição (B1)",
    levelTested: "B1",
    question: "Complete: '______ it was raining heavily, the team completed the release.'",
    options: ["Although", "Therefore", "Because", "Meanwhile"],
    correctIndex: 0,
    explanationPt: "'Although' expressa contraste concessivo ('embora / apesar de que').",
  },
  {
    id: 4,
    stage: "Phrasal Verbs & Precisão (B2)",
    levelTested: "B2",
    question: "Qual phrasal verb significa 'propor ou ter uma ideia inovadora'?",
    options: ["come up with", "run out of", "figure out", "look forward to"],
    correctIndex: 0,
    explanationPt: "'Come up with' significa sugerir, bolar ou propor uma ideia/solução.",
  },
  {
    id: 5,
    stage: "Expressões Avançadas & Nuances (C1)",
    levelTested: "C1",
    question: "O que expressa a expressão idiomática 'play devil's advocate'?",
    options: [
      "Apresentar contra-argumentos deliberados para testar a solidez de uma ideia",
      "Concordar imediatamente com o ponto de vista do interlocutor",
      "Criticar a postura ética de um concorrente",
      "Desistir de uma negociação difícil",
    ],
    correctIndex: 0,
    explanationPt: "'Play devil's advocate' é assumir uma postura crítica temporária para fortalecer o debate.",
  },
];

export default function PlacementTestPage() {
  const [currentStep, setCurrentStep] = useState<"intro" | "quiz" | "speaking" | "result">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  // Speaking stage
  const [isRecording, setIsRecording] = useState(false);
  const [speakingTranscript, setSpeakingTranscript] = useState("");
  const [calculatedLevel, setCalculatedLevel] = useState<CEFRLevel>("B1+");

  const currentQ = PLACEMENT_QUESTIONS[currentQuestionIndex];

  const handleStartTest = () => {
    setCurrentStep("quiz");
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
  };

  const handleNextQuestion = () => {
    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex < PLACEMENT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Go to speaking test
      setCurrentStep("speaking");
      const promptAudio = "Speaking diagnostic: Please talk for 30 seconds about your job, your daily routine, or why you want to speak fluent English.";
      playPronunciation(promptAudio, 0.95, "en-US");
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      startSpeechRecognition("en-US", {
        onResult: (text) => setSpeakingTranscript(text),
        onError: () => setIsRecording(false),
        onEnd: () => setIsRecording(false),
      });
    }
  };

  const handleFinishSpeaking = async () => {
    // Calculate estimated CEFR level based on quiz score + speaking length
    let finalLvl: CEFRLevel = "A1";
    if (score === 1) finalLvl = "A2";
    else if (score === 2 || score === 3) finalLvl = "B1";
    else if (score === 4) finalLvl = "B1+";
    else if (score === 5) finalLvl = "B2";

    if (speakingTranscript.split(" ").length > 15 && score >= 4) {
      finalLvl = "B2";
    }

    setCalculatedLevel(finalLvl);
    setCurrentStep("result");

    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#10b981", "#ffffff"],
    });

    // Persist new level and +100 XP to Supabase
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: currentProfile } = await supabase
          .from("profiles")
          .select("xp_points")
          .eq("id", user.id)
          .single();

        const currentXp = currentProfile?.xp_points || 1240;
        await supabase.from("profiles").upsert({
          id: user.id,
          cefr_level: finalLvl,
          xp_points: currentXp + 100,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn("Could not save placement test level to Supabase:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Intro Screen */}
      {currentStep === "intro" && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#0d0d14] border border-amber-500/30 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400/40 mx-auto flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/20">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 uppercase">
              DIAGNÓSTICO CEFR EM 3 MINUTOS
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Teste de Nivelamento Interativo
            </h1>
            <p className="text-sm text-zinc-300 max-w-lg mx-auto font-normal">
              Descubra com precisão matemática em qual nível do <strong>A1 ao C2</strong> você ou seu filho estão para calibrar o tutor de IA e as missões diárias.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-[#14141e] border border-white/10">
              <div className="text-amber-400 font-mono font-bold text-xs mb-1">Etapa 1</div>
              <div className="text-sm font-bold text-white">5 Questões Rápidas</div>
              <div className="text-xs text-zinc-400 mt-1">Vocabulário, conectivos e gramática em contexto.</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#14141e] border border-white/10">
              <div className="text-emerald-400 font-mono font-bold text-xs mb-1">Etapa 2</div>
              <div className="text-sm font-bold text-white">Fala no Microfone</div>
              <div className="text-xs text-zinc-400 mt-1">30 segundos de fala espontânea com IA.</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#14141e] border border-white/10">
              <div className="text-cyan-400 font-mono font-bold text-xs mb-1">Resultado</div>
              <div className="text-sm font-bold text-white">Diagnóstico CEFR</div>
              <div className="text-xs text-zinc-400 mt-1">Calibração imediata do seu perfil no app.</div>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Button variant="gold" onClick={handleStartTest} className="px-8 py-3.5 text-xs font-black uppercase tracking-wider">
              <span>Iniciar Teste de Nivelamento</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Quiz Screen */}
      {currentStep === "quiz" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-amber-500/30 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase">
              {currentQ.stage} • Questão {currentQuestionIndex + 1} de {PLACEMENT_QUESTIONS.length}
            </span>
            <span className="text-xs font-mono text-zinc-400">
              Nível Avaliado: <strong>{currentQ.levelTested}</strong>
            </span>
          </div>

          <ProgressBar
            value={currentQuestionIndex + 1}
            max={PLACEMENT_QUESTIONS.length}
            variant="amber"
            size="sm"
            showLabel={false}
          />

          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>

            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    selectedOption === idx
                      ? "bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-500/30"
                      : "bg-[#14141e] border-white/10 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-mono ${
                      selectedOption === idx
                        ? "border-amber-400 bg-amber-500 text-zinc-950 font-black"
                        : "border-white/20"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <Button
              variant="gold"
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className="text-xs font-bold"
            >
              <span>{currentQuestionIndex === PLACEMENT_QUESTIONS.length - 1 ? "Ir para Teste de Fala" : "Próxima Questão"}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Speaking Screen */}
      {currentStep === "speaking" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-amber-500/30 shadow-2xl space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
              ETAPA 2: AVALIAÇÃO DE FALA (SPEAKING DIAGNOSTIC)
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              Fale livremente por 30 segundos em inglês
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Responda em voz alta sobre seu trabalho, sua rotina ou seus objetivos de aprendizado.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#14141e] border border-white/10 flex items-center justify-between">
            <div className="text-sm font-semibold text-white">
              &ldquo;Tell me about your job and why you want to improve your English.&rdquo;
            </div>
            <button
              onClick={() => playPronunciation("Tell me about your job and why you want to improve your English.", 0.95, "en-US")}
              className="p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-300"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Record Button & Live Transcript */}
          <div className="p-8 rounded-3xl bg-black/40 border border-white/10 text-center space-y-4">
            <button
              onClick={toggleRecording}
              className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all cursor-pointer ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse shadow-xl shadow-red-500/40 ring-4 ring-red-500/30"
                  : "bg-gradient-to-tr from-amber-500 to-yellow-400 text-zinc-950 shadow-xl shadow-amber-500/25"
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>

            <div className="text-xs font-semibold text-zinc-300">
              {isRecording ? "Ouvindo você falar em inglês... Continue falando!" : "Clique no microfone para começar a falar"}
            </div>

            <textarea
              placeholder="Sua fala transcrita aparecerá aqui..."
              value={speakingTranscript}
              onChange={(e) => setSpeakingTranscript(e.target.value)}
              className="w-full h-24 rounded-2xl bg-[#14141e] border border-white/10 p-3 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="gold" onClick={handleFinishSpeaking} className="text-xs font-bold">
              <span>Finalizar & Ver Meu Diagnóstico</span>
              <Award className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Result Diagnostic Screen */}
      {currentStep === "result" && (
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#18150c] to-[#0d0d14] border border-amber-400/50 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400 mx-auto flex items-center justify-center text-amber-300 shadow-xl shadow-amber-500/20">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase">
              DIAGNÓSTICO OFICIAL CONCLUÍDO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Seu Nível Atual: <span className="text-amber-400">{calculatedLevel}</span>
            </h2>
            <p className="text-xs text-zinc-300 max-w-md mx-auto">
              Você possui boa base de vocabulário e compreensão. O foco ideal agora é **soltar a fluência de fala** e dominar conectivos naturais.
            </p>
          </div>

          {/* Metrics breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <div className="text-xl font-black text-amber-400 font-mono">{score} / 5</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Gramática & Vocab</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <div className="text-xl font-black text-emerald-400 font-mono">
                {speakingTranscript ? "Ativo" : "Básico"}
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Speaking Spontaneity</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <div className="text-xl font-black text-cyan-400 font-mono">B2</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Próxima Meta CEFR</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
              <div className="text-xl font-black text-purple-400 font-mono">+100 XP</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Recompensa Ganha</div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/dashboard">
              <Button variant="gold" className="w-full sm:w-auto px-8">
                <span>Ir para o Meu Painel Calibrado</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>

            <Button variant="outline" onClick={handleStartTest} className="w-full sm:w-auto">
              <RotateCcw className="w-4 h-4 mr-1.5" />
              <span>Refazer Teste</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
