"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { FlashcardModal } from "@/components/vocabulary/FlashcardModal";
import { playPronunciation } from "@/lib/audio";
import { VocabularyItem } from "@/types/vocabulary";
import {
  Library,
  Search,
  Plus,
  Volume2,
  Brain,
  Star,
  Sparkles,
  RotateCw,
} from "lucide-react";

const SEED_VOCABULARY: VocabularyItem[] = [
  {
    id: "1",
    word: "actually",
    translationPt: "na verdade / realmente",
    definitionEn: "in fact or really, often used to correct a misconception",
    partOfSpeech: "adverb",
    cefrLevel: "B1",
    exampleSentence: "Actually, I prefer having team syncs in the morning.",
    contextNote: "/ˈæktʃu.ə.li/",
  },
  {
    id: "2",
    word: "although",
    translationPt: "embora / apesar de que",
    definitionEn: "despite the fact that",
    partOfSpeech: "connector",
    cefrLevel: "B1+",
    exampleSentence: "Although it was raining, we went for a run.",
    contextNote: "/ɔːlˈðoʊ/",
  },
  {
    id: "3",
    word: "exhausted",
    translationPt: "extremamente cansado / exausto",
    definitionEn: "very tired or having no energy left",
    partOfSpeech: "adjective",
    cefrLevel: "B1",
    exampleSentence: "After 8 hours of intense coding, I was completely exhausted.",
    contextNote: "/ɪɡˈzɔː.stɪd/",
  },
  {
    id: "4",
    word: "figure out",
    translationPt: "descobrir / resolver / entender",
    definitionEn: "to understand or find the solution to a problem",
    partOfSpeech: "phrasal_verb",
    cefrLevel: "B1",
    exampleSentence: "We need to figure out how to optimize this API latency.",
    contextNote: "/ˈfɪɡ.jɚ aʊt/",
  },
  {
    id: "5",
    word: "meanwhile",
    translationPt: "enquanto isso / nesse meio tempo",
    definitionEn: "in the intervening period of time",
    partOfSpeech: "connector",
    cefrLevel: "B1+",
    exampleSentence: "The script is running; meanwhile, let's review the code.",
    contextNote: "/ˈmiːn.waɪl/",
  },
  {
    id: "6",
    word: "breakfast",
    translationPt: "café da manhã",
    definitionEn: "the first meal of the day",
    partOfSpeech: "noun",
    cefrLevel: "A1",
    exampleSentence: "I usually have scrambled eggs and black coffee for breakfast.",
    contextNote: "/ˈbrek.fəst/",
  },
];

export default function VocabularyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const filteredItems = SEED_VOCABULARY.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.translationPt.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === "all") return true;
    if (activeTab === "a1") return item.cefrLevel === "A1" || item.cefrLevel === "A2";
    if (activeTab === "b1") return item.cefrLevel.startsWith("B");
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="gold">Spaced Repetition System • SM-2</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mt-2">
            Banco de Vocabulário & Active Recall
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Treine a retenção ativa com áudio fonético nativo e intervalos calculados para memória de longo prazo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="gold"
            size="md"
            onClick={() => setIsReviewOpen(true)}
            className="shadow-lg shadow-amber-500/10"
          >
            <Brain className="w-4 h-4 mr-2" />
            <span>Praticar Flashcards 3D ({SEED_VOCABULARY.length})</span>
          </Button>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-80">
          <Input
            placeholder="Buscar termo ou tradução..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex-1 w-full">
          <Tabs
            tabs={[
              { id: "all", label: "Todas as Palavras", badge: SEED_VOCABULARY.length },
              { id: "b1", label: "Intermediário (B1/B2)" },
              { id: "a1", label: "Fundamentos (A1/A2)" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>

      {/* Word Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="studio-card rounded-2xl p-6 flex flex-col justify-between group hover:border-amber-500/40"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-zinc-100 font-mono tracking-tight group-hover:text-amber-300 transition-colors">
                      {item.word}
                    </h3>
                    <button
                      onClick={() => playPronunciation(item.word)}
                      className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-300 transition-all cursor-pointer"
                      title="Ouvir pronúncia"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {item.contextNote}
                  </span>
                </div>

                <Badge variant={item.cefrLevel.startsWith("A") ? "success" : "gold"} size="sm">
                  {item.cefrLevel}
                </Badge>
              </div>

              <div className="space-y-1 mb-4">
                <p className="text-sm font-semibold text-zinc-200">
                  {item.translationPt}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.definitionEn}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80 text-xs text-zinc-300 italic leading-relaxed">
                &ldquo;{item.exampleSentence}&rdquo;
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider">{item.partOfSpeech}</span>
              <button
                onClick={() => {
                  setIsReviewOpen(true);
                }}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Revisar</span>
                <RotateCw className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3D Flashcard Modal */}
      <FlashcardModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        items={SEED_VOCABULARY}
      />
    </div>
  );
}
