"use client";

import React, { useState } from "react";
import { X, Plus, BookPlus, Volume2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { VocabularyItem, PartOfSpeech } from "@/types/vocabulary";
import { CEFRLevel } from "@/types/profile";
import { playPronunciation } from "@/lib/audio";

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWord: (word: VocabularyItem) => void;
}

export function AddWordModal({ isOpen, onClose, onAddWord }: AddWordModalProps) {
  const [word, setWord] = useState("");
  const [translationPt, setTranslationPt] = useState("");
  const [definitionEn, setDefinitionEn] = useState("");
  const [exampleSentence, setExampleSentence] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech>("verb");
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>("B1");
  const [contextNote, setContextNote] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !translationPt.trim()) return;

    const newItem: VocabularyItem = {
      id: "usr_" + Date.now(),
      word: word.trim(),
      translationPt: translationPt.trim(),
      definitionEn: definitionEn.trim() || "Term or expression used in active speech",
      exampleSentence: exampleSentence.trim() || `I regularly use the term '${word.trim()}' in conversations.`,
      partOfSpeech,
      cefrLevel,
      contextNote: contextNote.trim() || undefined,
    };

    onAddWord(newItem);
    onClose();

    // Reset form
    setWord("");
    setTranslationPt("");
    setDefinitionEn("");
    setExampleSentence("");
    setContextNote("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[85dvh] overflow-y-auto rounded-3xl bg-[#0b0b10] border border-amber-500/40 p-5 sm:p-8 shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Adicionar Nova Palavra ao Banco</h3>
            <p className="text-xs text-zinc-400">Entre com o termo e suas associações para o algoritmo SRS.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
                Palavra / Expressão em Inglês *
              </label>
              {word && (
                <button
                  type="button"
                  onClick={() => playPronunciation(word)}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Testar Áudio</span>
                </button>
              )}
            </div>
            <input
              type="text"
              required
              placeholder="Ex: catch up with"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="w-full rounded-2xl bg-[#14141e] border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <Input
            label="Tradução / Significado em Português *"
            type="text"
            required
            placeholder="Ex: colocar a conversa em dia / alcançar"
            value={translationPt}
            onChange={(e) => setTranslationPt(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
                Classe Gramatical
              </label>
              <div className="relative">
                <select
                  value={partOfSpeech}
                  onChange={(e) => setPartOfSpeech(e.target.value as PartOfSpeech)}
                  className="w-full appearance-none rounded-2xl bg-[#14141e] border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 pr-8"
                >
                  <option value="verb">Verbo</option>
                  <option value="phrasal_verb">Phrasal Verb</option>
                  <option value="noun">Substantivo</option>
                  <option value="adjective">Adjetivo</option>
                  <option value="adverb">Advérbio</option>
                  <option value="connector">Conectivo</option>
                  <option value="idiom">Expressão Idiomática</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
                Nível CEFR
              </label>
              <div className="relative">
                <select
                  value={cefrLevel}
                  onChange={(e) => setCefrLevel(e.target.value as CEFRLevel)}
                  className="w-full appearance-none rounded-2xl bg-[#14141e] border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 pr-8"
                >
                  <option value="A1">A1 (Iniciante)</option>
                  <option value="A2">A2 (Básico)</option>
                  <option value="B1">B1 (Intermediário)</option>
                  <option value="B1+">B1+ (Interm. Avançado)</option>
                  <option value="B2">B2 (Independente)</option>
                  <option value="C1">C1 (Avançado)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <Input
            label="Frase de Exemplo em Contexto"
            type="text"
            placeholder="Ex: Let's catch up over coffee this Friday."
            value={exampleSentence}
            onChange={(e) => setExampleSentence(e.target.value)}
          />

          <Input
            label="Transcrição Fonética (IPA) ou Dica de Pronúncia"
            type="text"
            placeholder="Ex: /kætʃ ʌp wɪð/"
            value={contextNote}
            onChange={(e) => setContextNote(e.target.value)}
          />

          <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="gold">
              <Plus className="w-4 h-4 mr-1" />
              <span>Salvar no Banco</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
