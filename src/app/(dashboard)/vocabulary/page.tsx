"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  Search,
  Plus,
  Play,
  Volume2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Layers,
  Filter,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FlashcardModal } from "@/components/vocabulary/FlashcardModal";
import { AddWordModal } from "@/components/vocabulary/AddWordModal";
import { SEED_VOCABULARY } from "@/lib/vocabulary-data";
import { VocabularyItem } from "@/types/vocabulary";
import { playPronunciation } from "@/lib/audio";
import { CEFRLevel } from "@/types/profile";

export default function VocabularyPage() {
  const [items, setItems] = useState<VocabularyItem[]>(SEED_VOCABULARY);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  // Modals
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
  const [isAddWordOpen, setIsAddWordOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("english-lab-vocab-items");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleAddWord = (newItem: VocabularyItem) => {
    const updated = [newItem, ...items];
    setItems(updated);
    localStorage.setItem("english-lab-vocab-items", JSON.stringify(updated));
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.translationPt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.definitionEn && item.definitionEn.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLevel =
      selectedLevel === "ALL" || item.cefrLevel === selectedLevel;

    const matchesType =
      selectedType === "ALL" || item.partOfSpeech === selectedType;

    return matchesSearch && matchesLevel && matchesType;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 text-xs font-mono font-bold">
            <Brain className="w-3.5 h-3.5 text-emerald-400" />
            <span>MOTOR SRS (SPACED REPETITION)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
            Banco de Vocabulário Ativo
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 font-normal">
            Treine sua memória de longo prazo com o algoritmo SuperMemo-2 (SM-2) e elimine a tradução mental.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsAddWordOpen(true)}
            className="border-white/15 text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>Adicionar Termo</span>
          </Button>

          <Button
            variant="gold"
            onClick={() => setIsFlashcardOpen(true)}
            className="shadow-lg shadow-amber-500/20 text-xs"
          >
            <Play className="w-4 h-4 mr-1 fill-zinc-950" />
            <span>Praticar Flashcards 3D ({items.length})</span>
          </Button>
        </div>
      </div>

      {/* Memory Status Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#0d0d14] border border-white/10 text-left">
          <div className="text-2xl font-black text-white font-mono">{items.length}</div>
          <div className="text-xs text-zinc-400 mt-0.5">Palavras no Banco</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d0d14] border border-emerald-500/30 text-left">
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {items.filter((i) => i.cefrLevel === "B1" || i.cefrLevel === "B1+").length}
          </div>
          <div className="text-xs text-emerald-300/80 mt-0.5">Nível Intermediário</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d0d14] border border-amber-500/30 text-left">
          <div className="text-2xl font-black text-amber-400 font-mono">
            {items.filter((i) => i.partOfSpeech === "phrasal_verb" || i.partOfSpeech === "connector").length}
          </div>
          <div className="text-xs text-amber-300/80 mt-0.5">Phrasal Verbs & Conectivos</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d0d14] border border-white/10 text-left">
          <div className="text-2xl font-black text-cyan-400 font-mono">94%</div>
          <div className="text-xs text-zinc-400 mt-0.5">Taxa de Retenção Ativa</div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="p-4 rounded-3xl bg-[#0d0d14] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por palavra em inglês ou tradução em português..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#14141e] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Level Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-black/40 rounded-2xl border border-white/10">
            {["ALL", "A1", "A2", "B1", "B1+", "B2"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? "bg-amber-500 text-zinc-950 shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {lvl === "ALL" ? "Todos" : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 border-t border-white/5 text-xs">
          <span className="text-zinc-500 font-bold uppercase tracking-wider font-mono text-[10px] shrink-0">
            Classe:
          </span>
          {[
            { id: "ALL", label: "Todas" },
            { id: "phrasal_verb", label: "Phrasal Verbs" },
            { id: "connector", label: "Conectivos" },
            { id: "adjective", label: "Adjetivos" },
            { id: "verb", label: "Verbos" },
            { id: "adverb", label: "Advérbios" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 font-medium ${
                selectedType === type.id
                  ? "bg-white/15 text-white border border-white/20 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-[#0d0d14] border border-white/10 hover:border-amber-500/40 hover:bg-[#12121a] transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                    {item.word}
                  </span>
                  <button
                    onClick={() => playPronunciation(item.word)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-300 transition-all cursor-pointer"
                    title="Ouvir pronúncia nativa"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 shrink-0">
                  {item.cefrLevel}
                </span>
              </div>

              {item.contextNote && (
                <div className="text-xs font-mono text-amber-400/80 mb-2">
                  {item.contextNote}
                </div>
              )}

              <p className="text-sm font-semibold text-zinc-200 mb-2">
                {item.translationPt}
              </p>

              {item.definitionEn && (
                <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-3">
                  {item.definitionEn}
                </p>
              )}

              {item.exampleSentence && (
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-xs text-zinc-300 italic">
                  "{item.exampleSentence}"
                </div>
              )}
            </div>

            <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="capitalize font-mono text-[10px] px-2 py-0.5 rounded bg-white/5">
                {item.partOfSpeech.replace("_", " ")}
              </span>
              <span className="text-emerald-400 font-medium">SRS Ativo (SM-2)</span>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-[#0d0d14] border border-white/10 space-y-3">
          <Brain className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhum termo encontrado</h3>
          <p className="text-xs text-zinc-400">Tente buscar por outra palavra ou limpe os filtros de nível.</p>
        </div>
      )}

      {/* 3D Flashcard Modal */}
      <FlashcardModal
        isOpen={isFlashcardOpen}
        onClose={() => setIsFlashcardOpen(false)}
        items={items}
      />

      {/* Add Word Modal */}
      <AddWordModal
        isOpen={isAddWordOpen}
        onClose={() => setIsAddWordOpen(false)}
        onAddWord={handleAddWord}
      />
    </div>
  );
}
