"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  Search,
  Plus,
  Play,
  Volume2,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FlashcardModal } from "@/components/vocabulary/FlashcardModal";
import { AddWordModal } from "@/components/vocabulary/AddWordModal";
import { SEED_VOCABULARY } from "@/lib/vocabulary-data";
import { VocabularyItem } from "@/types/vocabulary";
import { playPronunciation } from "@/lib/audio";
import { CEFRLevel } from "@/types/profile";
import { createClient } from "@/lib/supabase/client";

interface DBVocabularyRow {
  id: string;
  word: string;
  phonetic_ipa?: string;
  part_of_speech?: "noun" | "verb" | "phrasal_verb" | "adjective" | "adverb" | "connector" | "idiom";
  cefr_level?: string;
  translation_pt: string;
  definition_en?: string;
  example_sentence?: string;
  repetition_count?: number;
  interval_days?: number;
  ease_factor?: number;
  next_review_date?: string;
  status?: "new" | "learning" | "reviewing" | "active" | "mastered" | "difficult";
}

export default function VocabularyPage() {
  const [items, setItems] = useState<VocabularyItem[]>(SEED_VOCABULARY);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [deckMode, setDeckMode] = useState<"ALL" | "WORDS" | "PHRASES">("ALL");

  // Modals
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
  const [isAddWordOpen, setIsAddWordOpen] = useState(false);

  useEffect(() => {
    async function loadVocabulary() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from("user_vocabulary")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (!error && data && data.length > 0) {
            const mappedItems: VocabularyItem[] = (data as unknown as DBVocabularyRow[]).map((d) => ({
              id: d.id,
              word: d.word,
              phoneticIpa: d.phonetic_ipa || "/.../",
              partOfSpeech: d.part_of_speech || "noun",
              cefrLevel: (d.cefr_level as CEFRLevel) || "B1+",
              translationPt: d.translation_pt,
              definitionEn: d.definition_en || "",
              exampleSentence: d.example_sentence || "",
              repetitionCount: d.repetition_count || 0,
              intervalDays: d.interval_days || 1,
              easeFactor: Number(d.ease_factor) || 2.5,
              nextReviewDate: d.next_review_date || new Date().toISOString(),
              status: d.status || "learning",
            }));
            setItems(mappedItems);
            return;
          }
        }

        // Fallback to local cache if offline or unauthenticated
        const saved = localStorage.getItem("english-lab-vocab-items");
        if (saved) {
          setItems(JSON.parse(saved));
        }
      } catch (err) {
        console.error("Error loading vocabulary:", err);
      }
    }

    loadVocabulary();
  }, []);

  const handleAddWord = async (newItem: VocabularyItem) => {
    const updated = [newItem, ...items];
    setItems(updated);
    localStorage.setItem("english-lab-vocab-items", JSON.stringify(updated));

    // Persist to Supabase if authenticated
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("user_vocabulary").insert({
          user_id: user.id,
          word: newItem.word,
          phonetic_ipa: newItem.phoneticIpa,
          part_of_speech: newItem.partOfSpeech,
          cefr_level: newItem.cefrLevel,
          translation_pt: newItem.translationPt,
          definition_en: newItem.definitionEn,
          example_sentence: newItem.exampleSentence,
          repetition_count: newItem.repetitionCount || 0,
          interval_days: newItem.intervalDays || 1,
          ease_factor: newItem.easeFactor || 2.5,
          next_review_date: newItem.nextReviewDate,
          status: newItem.status || "learning",
        });
      }
    } catch (err) {
      console.error("Failed to persist word to Supabase:", err);
    }
  };

  const wordsCount = items.filter(
    (i) => i.partOfSpeech !== "idiom" && !i.word.trim().includes(" ")
  ).length;
  const phrasesCount = items.filter(
    (i) => i.partOfSpeech === "idiom" || i.partOfSpeech === "phrasal_verb" || i.word.trim().includes(" ")
  ).length;

  const filteredItems = items.filter((item) => {
    const isPhrase =
      item.partOfSpeech === "idiom" ||
      item.partOfSpeech === "phrasal_verb" ||
      item.word.trim().includes(" ");

    if (deckMode === "WORDS" && isPhrase) return false;
    if (deckMode === "PHRASES" && !isPhrase) return false;

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
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 text-xs font-mono font-bold">
            <Brain className="w-3.5 h-3.5 text-emerald-400" />
            <span>MOTOR SRS (SPACED REPETITION)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
            Banco de Vocabulário & Frases Ativas
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 font-normal">
            Treine sua memória de longo prazo com o algoritmo SuperMemo-2 (SM-2) e elimine a tradução mental.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsAddWordOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Adicionar Termo</span>
          </Button>

          <Button
            variant="gold"
            onClick={() => setIsFlashcardOpen(true)}
            className="flex items-center gap-2 text-xs font-black shadow-lg shadow-amber-500/20"
          >
            <Play className="w-4 h-4 fill-zinc-950" />
            <span>Praticar Flashcards ({filteredItems.length})</span>
          </Button>
        </div>
      </div>

      {/* Deck Mode Selector (Tabs) */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0d0d14] border border-white/10 w-fit">
        <button
          type="button"
          onClick={() => setDeckMode("ALL")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            deckMode === "ALL"
              ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Todos ({items.length})
        </button>
        <button
          type="button"
          onClick={() => setDeckMode("WORDS")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            deckMode === "WORDS"
              ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          🔤 Palavras ({wordsCount})
        </button>
        <button
          type="button"
          onClick={() => setDeckMode("PHRASES")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            deckMode === "PHRASES"
              ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          🗣️ Frases ({phrasesCount})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0d0d14] border border-white/10 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por termo, tradução ou contexto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#14141e] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Level Filter */}
          <div className="flex items-center gap-1 bg-[#14141e] p-1 rounded-xl border border-white/10 text-xs">
            {["ALL", "A1", "A2", "B1", "B1+", "B2", "C1"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? "bg-amber-500 text-zinc-950 shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-xl bg-[#14141e] border border-white/10 text-xs text-zinc-300 focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
            >
              <option value="ALL">Todas as Classes</option>
              <option value="verb">Verbos</option>
              <option value="phrasal_verb">Phrasal Verbs</option>
              <option value="noun">Substantivos</option>
              <option value="adjective">Adjetivos</option>
              <option value="connector">Conectivos</option>
              <option value="idiom">Expressões / Idioms</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-[#0d0d14] border border-white/10 hover:border-emerald-500/40 transition-all group relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                    {item.word}
                  </h3>
                  <button
                    onClick={() => playPronunciation(item.word, 0.95, "en-US")}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-300 transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                    {item.cefrLevel}
                  </Badge>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10 uppercase">
                    {item.partOfSpeech}
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono text-zinc-400 mb-2">
                {item.phoneticIpa}
              </div>

              <div className="p-2.5 rounded-xl bg-[#14141e] border border-white/5 text-xs text-emerald-200 font-semibold mb-3">
                {item.translationPt}
              </div>

              {item.exampleSentence && (
                <p className="text-xs text-zinc-300 italic leading-relaxed border-l-2 border-emerald-500/40 pl-2.5 py-0.5">
                  &ldquo;{item.exampleSentence}&rdquo;
                </p>
              )}
            </div>

            {/* SRS Status Footer */}
            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 font-mono">
                <RotateCcw className="w-3 h-3 text-emerald-400" />
                Int: <strong>{item.intervalDays}d</strong> (Rev #{item.repetitionCount})
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <FlashcardModal
        isOpen={isFlashcardOpen}
        onClose={() => setIsFlashcardOpen(false)}
        items={filteredItems.length > 0 ? filteredItems : items}
      />

      <AddWordModal
        isOpen={isAddWordOpen}
        onClose={() => setIsAddWordOpen(false)}
        onAddWord={handleAddWord}
      />
    </div>
  );
}
