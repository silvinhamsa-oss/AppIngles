"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import {
  Library,
  Search,
  Plus,
  Volume2,
  Brain,
  Star,
  Flame,
  CheckCircle2,
} from "lucide-react";

const SEED_VOCABULARY = [
  {
    id: "1",
    word: "actually",
    translationPt: "na verdade / realmente",
    definitionEn: "in fact or really, often used to correct a misconception",
    partOfSpeech: "adverb",
    level: "B1",
    exampleSentence: "Actually, I prefer having meetings in the morning.",
    status: "learning",
    intervalDays: 3,
  },
  {
    id: "2",
    word: "although",
    translationPt: "embora / apesar de que",
    definitionEn: "despite the fact that",
    partOfSpeech: "connector",
    level: "B1+",
    exampleSentence: "Although it was raining, we went for a run.",
    status: "active",
    intervalDays: 7,
  },
  {
    id: "3",
    word: "exhausted",
    translationPt: "extremamente cansado / exausto",
    definitionEn: "very tired or having no energy left",
    partOfSpeech: "adjective",
    level: "B1",
    exampleSentence: "After 8 hours of coding, I was completely exhausted.",
    status: "reviewing",
    intervalDays: 14,
  },
  {
    id: "4",
    word: "figure out",
    translationPt: "descobrir / resolver / entender",
    definitionEn: "to understand or find the solution to a problem",
    partOfSpeech: "phrasal_verb",
    level: "B1",
    exampleSentence: "We need to figure out how to optimize this API.",
    status: "learning",
    intervalDays: 1,
  },
  {
    id: "5",
    word: "breakfast",
    translationPt: "café da manhã",
    definitionEn: "the first meal of the day",
    partOfSpeech: "noun",
    level: "A1",
    exampleSentence: "I usually have eggs for breakfast.",
    status: "mastered",
    intervalDays: 30,
  },
];

export default function VocabularyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredItems = SEED_VOCABULARY.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.translationPt.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === "all") return true;
    return item.status === activeTab;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="cyan">Motor de Vocabulário & SRS</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-2">
            Banco de Vocabulário Pessoal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Mapeie e transforme vocabulário passivo em vocabulário ativo através do método de repetição espaçada.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="glow" size="sm">
            <Brain className="w-4 h-4 mr-1.5" />
            <span>Iniciar Revisão SRS (12)</span>
          </Button>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-80">
          <Input
            placeholder="Buscar palavra ou tradução..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex-1 w-full">
          <Tabs
            tabs={[
              { id: "all", label: "Todas", badge: SEED_VOCABULARY.length },
              { id: "learning", label: "Em Aprendizado" },
              { id: "active", label: "Ativas" },
              { id: "mastered", label: "Dominadas" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>

      {/* Word Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} variant="glass" hoverable className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-indigo-300 font-mono">{item.word}</h3>
                  <Badge variant="primary" size="sm">{item.level}</Badge>
                </div>
                <Badge
                  variant={
                    item.status === "active"
                      ? "success"
                      : item.status === "mastered"
                      ? "cyan"
                      : "warning"
                  }
                  size="sm"
                >
                  {item.status}
                </Badge>
              </div>

              <p className="text-sm font-semibold text-slate-200 mb-1">{item.translationPt}</p>
              <p className="text-xs text-slate-400 mb-3">{item.definitionEn}</p>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 italic">
                &ldquo;{item.exampleSentence}&rdquo;
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Intervalo: <strong>{item.intervalDays} dias</strong></span>
              <button className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer">
                <Star className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
