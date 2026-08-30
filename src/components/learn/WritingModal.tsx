"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  PenTool,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Plus,
  BookOpen,
  Award,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import confetti from "canvas-confetti";
import { createClient } from "@/lib/supabase/client";
import { CEFRLevel } from "@/types/profile";

export interface WritingPrompt {
  id: string;
  level: CEFRLevel;
  title: string;
  category: string;
  description: string;
  guidelines: string[];
  targetWords: number;
}

const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: "a1_daily",
    level: "A1",
    title: "Minha Rotina & Hobbies",
    category: "Vida Cotidiana",
    description: "Escreva sobre o que você costuma fazer de manhã, à tarde e como aproveita seus finais de semana.",
    guidelines: [
      "Use o presente simples (I wake up, I work, I like...)",
      "Mencione pelo menos 3 atividades diárias",
      "Escreva entre 50 e 80 palavras",
    ],
    targetWords: 60,
  },
  {
    id: "a2_trip",
    level: "A2",
    title: "Uma Viagem Inesquecível",
    category: "Experiências Passadas",
    description: "Descreva um lugar que você visitou no passado, quem estava com você e o que você mais gostou.",
    guidelines: [
      "Use o passado simples (I visited, we went, it was...)",
      "Descreva o clima ou a comida do local",
      "Escreva entre 80 e 120 palavras",
    ],
    targetWords: 100,
  },
  {
    id: "b1_remote_work",
    level: "B1",
    title: "Home Office vs. Presencial",
    category: "Opinião & Trabalho",
    description: "Apresente as vantagens e desvantagens do trabalho remoto em comparação ao trabalho presencial no escritório.",
    guidelines: [
      "Use conectivos de contraste (However, On the one hand, Although...)",
      "Dê sua opinião pessoal no parágrafo final",
      "Escreva entre 120 e 160 palavras",
    ],
    targetWords: 140,
  },
  {
    id: "b2_ai_future",
    level: "B2",
    title: "O Impacto da IA no Mercado de Trabalho",
    category: "Tecnologia & Sociedade",
    description: "Analise como a Inteligência Artificial está transformando profissões e quais habilidades humanas se tornarão indispensáveis.",
    guidelines: [
      "Utilize vocabulário técnico e formal (automate, cognitive skills, workforce)",
      "Estruture em: Introdução, Argumentos a favor/contra e Conclusão",
      "Escreva entre 150 e 200 palavras",
    ],
    targetWords: 180,
  },
  {
    id: "c1_leadership",
    level: "C1",
    title: "Tomada de Decisão Estratégica sob Incerteza",
    category: "Liderança & Negócios",
    description: "Elabore um ensaio analítico sobre como líderes devem equilibrar risco e inovação durante períodos de crise econômica.",
    guidelines: [
      "Empregue estruturas gramaticais complexas e inversões",
      "Incorpore expressões idiomáticas e phrasal verbs avançados",
      "Escreva entre 200 e 260 palavras",
    ],
    targetWords: 220,
  },
];

interface WritingAssessmentResult {
  cefrLevel: string;
  overallScore: number;
  grammarScore: number;
  vocabularyScore: number;
  cohesionScore: number;
  feedbackPt: string;
  strengths: string[];
  improvements: string[];
  sentenceCorrections: {
    original: string;
    suggested: string;
    explanationPt: string;
  }[];
  polishedVersion: string;
  vocabularyToSave: {
    word: string;
    phoneticIpa: string;
    translationPt: string;
    exampleEn: string;
  }[];
}

interface WritingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLevel?: CEFRLevel;
}

export function WritingModal({ isOpen, onClose, initialLevel = "B1" }: WritingModalProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt>(
    WRITING_PROMPTS.find((p) => p.level === initialLevel) || WRITING_PROMPTS[2]
  );
  const [essayText, setEssayText] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<WritingAssessmentResult | null>(null);
  const [savedWords, setSavedWords] = useState<Record<string, boolean>>({});

  const words = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;

  const handleSelectPrompt = (prompt: WritingPrompt) => {
    setSelectedPrompt(prompt);
    setEssayText("");
    setResult(null);
  };

  const handleEvaluate = async () => {
    if (words < 15) {
      alert("Por favor, escreva pelo menos 15 a 20 palavras antes de enviar para avaliação.");
      return;
    }

    setIsEvaluating(true);
    setResult(null);

    try {
      // 1. Resolve AI provider config from local cache / Supabase
      const savedConfig = localStorage.getItem("english-lab-ai-config");
      const clientConfig = savedConfig ? JSON.parse(savedConfig) : undefined;

      const evaluationPrompt = `
You are a senior Cambridge/IELTS English Writing Assessor.
Evaluate the student's essay below written for target level ${selectedPrompt.level} on the topic "${selectedPrompt.title}".

STUDENT ESSAY:
"""
${essayText}
"""

Evaluate strictly and return a JSON object without markdown code blocks, backticks, or extra commentary, following this exact schema:
{
  "cefrLevel": "${selectedPrompt.level}",
  "overallScore": 8.5,
  "grammarScore": 8.0,
  "vocabularyScore": 9.0,
  "cohesionScore": 8.5,
  "feedbackPt": "Resumo pedagógico em português destacando clareza e áreas de aprimoramento.",
  "strengths": ["Ponto forte 1", "Ponto forte 2"],
  "improvements": ["Área para melhorar 1", "Área para melhorar 2"],
  "sentenceCorrections": [
    {
      "original": "Frase original com erro ou pouco natural",
      "suggested": "Frase reescrita nativa e elegante",
      "explanationPt": "Explicação gramatical ou de escolha de palavras em português"
    }
  ],
  "polishedVersion": "O texto completo do aluno reescrito de forma 100% nativa, polida e fluida mantendo a ideia original.",
  "vocabularyToSave": [
    {
      "word": "Palavra ou expressão avançada",
      "phoneticIpa": "/.../",
      "translationPt": "Tradução em português",
      "exampleEn": "Exemplo prático de uso"
    }
  ]
}
`;

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a professional CEFR Writing Examiner that strictly returns raw JSON." },
            { role: "user", content: evaluationPrompt },
          ],
          providerConfig: clientConfig,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro na API de IA (${res.status})`);
      }

      // Read streaming / full response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6).trim();
              if (dataStr === "[DONE]") break;
              try {
                const json = JSON.parse(dataStr);
                if (json.content) fullText += json.content;
              } catch {}
            }
          }
        }
      }

      let cleanJson = fullText.trim();
      const firstBrace = cleanJson.indexOf("{");
      const lastBrace = cleanJson.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
        cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
      }

      const parsed: WritingAssessmentResult = JSON.parse(cleanJson);
      setResult(parsed);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#10b981", "#ffffff"],
      });

      // Bonus XP persistence
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("xp_points")
            .eq("id", user.id)
            .single();
          const curXp = prof?.xp_points || 1240;
          await supabase.from("profiles").upsert({
            id: user.id,
            xp_points: curXp + 50,
            updated_at: new Date().toISOString(),
          });
        }
      } catch {}
    } catch (err: unknown) {
      console.error("Writing evaluation error:", err);
      alert("Não foi possível avaliar o texto no momento. Verifique sua chave de IA nas Configurações.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSaveWordToVocab = async (vocab: WritingAssessmentResult["vocabularyToSave"][0]) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("user_vocabulary").insert({
          user_id: user.id,
          word: vocab.word,
          phonetic_ipa: vocab.phoneticIpa,
          part_of_speech: "phrase",
          cefr_level: selectedPrompt.level,
          translation_pt: vocab.translationPt,
          example_sentence: vocab.exampleEn,
          status: "learning",
        });
      }
      setSavedWords((prev) => ({ ...prev, [vocab.word]: true }));
    } catch (err) {
      console.error("Save vocab error:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Laboratório de Escrita Ativa (Writing Lab)"
      description="Pratique redações e redações guiadas por nível com avaliação inteligente em tempo real."
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Prompt Selector Tabs */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
            Escolha o Tema por Nível:
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {WRITING_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => handleSelectPrompt(prompt)}
                className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all shrink-0 cursor-pointer ${
                  selectedPrompt.id === prompt.id
                    ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/25"
                    : "bg-[#14141e] border border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                <span>{prompt.level} — {prompt.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Prompt Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#14141e] border border-amber-500/30 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Nível {selectedPrompt.level} • {selectedPrompt.category}
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Meta: <strong>{selectedPrompt.targetWords} palavras</strong>
            </span>
          </div>

          <h4 className="text-base font-black text-white">{selectedPrompt.title}</h4>
          <p className="text-xs text-zinc-300 leading-relaxed font-normal">{selectedPrompt.description}</p>

          <div className="pt-2 border-t border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Diretrizes de Escrita:
            </span>
            <ul className="text-xs text-zinc-300 space-y-1 list-disc list-inside">
              {selectedPrompt.guidelines.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Writing Editor */}
        {!result ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Sua Redação em Inglês:</span>
              <span
                className={`font-mono font-bold ${
                  words >= selectedPrompt.targetWords * 0.7 ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {words} / {selectedPrompt.targetWords} palavras
              </span>
            </div>

            <textarea
              rows={8}
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Start writing your essay here in English... Example: In my opinion, working remotely provides several key advantages..."
              className="w-full rounded-2xl bg-[#09090e] border border-white/15 p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 leading-relaxed"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <p className="text-[11px] text-zinc-400">
                ⚡ Ao enviar, a IA avaliará gramática, vocabulário e coerência com retorno imediato.
              </p>

              <Button
                type="button"
                variant="gold"
                onClick={handleEvaluate}
                isLoading={isEvaluating}
                className="w-full sm:w-auto px-6 text-xs font-bold"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                <span>Avaliar com IA (+50 XP)</span>
              </Button>
            </div>
          </div>
        ) : (
          /* Assessment Report Screen */
          <div className="space-y-5">
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/30 shrink-0">
                  {result.overallScore}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Nível Avaliado: {result.cefrLevel}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      +50 XP
                    </span>
                  </h4>
                  <p className="text-xs text-zinc-300 mt-0.5">{result.feedbackPt}</p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setResult(null)}
                className="text-xs shrink-0 w-full sm:w-auto"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>Editar Texto</span>
              </Button>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-[#14141e] border border-white/10">
                <div className="text-xs text-zinc-400 font-mono">Gramática</div>
                <div className="text-lg font-black text-amber-400 font-mono">{result.grammarScore} / 10</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#14141e] border border-white/10">
                <div className="text-xs text-zinc-400 font-mono">Vocabulário</div>
                <div className="text-lg font-black text-emerald-400 font-mono">{result.vocabularyScore} / 10</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#14141e] border border-white/10">
                <div className="text-xs text-zinc-400 font-mono">Coesão</div>
                <div className="text-lg font-black text-cyan-400 font-mono">{result.cohesionScore} / 10</div>
              </div>
            </div>

            {/* Sentence Corrections */}
            {result.sentenceCorrections && result.sentenceCorrections.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                  🔍 Correções & Sugestões Frase a Frase:
                </h5>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {result.sentenceCorrections.map((corr, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#14141e] border border-white/10 space-y-1 text-xs">
                      <div className="text-red-300 line-through">"{corr.original}"</div>
                      <div className="text-emerald-300 font-semibold">✓ "{corr.suggested}"</div>
                      <div className="text-[11px] text-zinc-400 italic font-normal">{corr.explanationPt}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Polished Native Version */}
            {result.polishedVersion && (
              <div className="p-4 rounded-2xl bg-[#14141e] border border-emerald-500/30 space-y-1.5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  Versão Nativa Aprimorada (Polished Essay):
                </h5>
                <p className="text-xs text-zinc-200 leading-relaxed font-normal">{result.polishedVersion}</p>
              </div>
            )}

            {/* Vocabulary to Save */}
            {result.vocabularyToSave && result.vocabularyToSave.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  📚 Vocabulário Extraído para Salvar no Banco:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.vocabularyToSave.map((v, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#14141e] border border-white/10 flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">{v.word}</span>
                        <span className="text-[10px] text-zinc-400 font-mono block">{v.translationPt}</span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant={savedWords[v.word] ? "outline" : "gold"}
                        onClick={() => handleSaveWordToVocab(v)}
                        disabled={savedWords[v.word]}
                        className="text-[10px] py-1 px-2.5 shrink-0"
                      >
                        {savedWords[v.word] ? "✓ Salvo" : "+ Flashcard"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button type="button" variant="gold" onClick={onClose} className="px-6 text-xs">
                <span>Concluir Prática de Escrita</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
