"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  Volume2,
  BookmarkPlus,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { playPronunciation } from "@/lib/audio";
import { createClient } from "@/lib/supabase/client";

interface WordDetails {
  word: string;
  phoneticIpa: string;
  partOfSpeech: string;
  translationPt: string;
  definitionEn: string;
  exampleEn: string;
}

interface WordLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetWord: string;
  contextSentence?: string;
}

export function WordLookupModal({
  isOpen,
  onClose,
  targetWord,
  contextSentence,
}: WordLookupModalProps) {
  const [details, setDetails] = useState<WordDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!isOpen || !targetWord) return;

    setIsSaved(false);
    setIsLoading(true);

    async function lookupWord() {
      try {
        const clean = targetWord.replace(/[.,!?;:"'()]/g, "").trim().toLowerCase();
        
        // 1. Resolve AI provider config from local cache
        const savedConfig = localStorage.getItem("english-lab-ai-config");
        const clientConfig = savedConfig ? JSON.parse(savedConfig) : undefined;

        const prompt = `
Define the English word "${clean}" in this context: "${contextSentence || clean}".
Return strictly a JSON object without markdown or backticks:
{
  "word": "${clean}",
  "phoneticIpa": "/.../",
  "partOfSpeech": "verb/noun/adjective/idiom/phrasal_verb",
  "translationPt": "Tradução concisa em português",
  "definitionEn": "Short clear English definition",
  "exampleEn": "Natural example sentence with the word"
}
`;

        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { role: "system", content: "You are a precise bilingual English-Portuguese dictionary. Output pure JSON only." },
              { role: "user", content: prompt },
            ],
            providerConfig: clientConfig,
          }),
        });

        if (!res.ok) throw new Error("Lookup failed");

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

        const parsed: WordDetails = JSON.parse(cleanJson);
        setDetails(parsed);
      } catch {
        // Fallback simple dictionary item
        const clean = targetWord.replace(/[.,!?;:"'()]/g, "").trim();
        setDetails({
          word: clean,
          phoneticIpa: `/${clean}/`,
          partOfSpeech: "palavra",
          translationPt: "Clique para praticar",
          definitionEn: "Vocabulary term from conversation",
          exampleEn: contextSentence || `I learned the word "${clean}".`,
        });
      } finally {
        setIsLoading(false);
      }
    }

    lookupWord();
  }, [isOpen, targetWord, contextSentence]);

  const handleSaveToVocab = async () => {
    if (!details || isSaved) return;

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("user_vocabulary").insert({
          user_id: user.id,
          word: details.word,
          phonetic_ipa: details.phoneticIpa,
          part_of_speech: details.partOfSpeech,
          cefr_level: "B1",
          translation_pt: details.translationPt,
          definition_en: details.definitionEn,
          example_sentence: details.exampleEn,
          status: "learning",
        });
      }

      // Also cache in local storage
      const saved = localStorage.getItem("english-lab-vocab-items");
      const list = saved ? JSON.parse(saved) : [];
      list.unshift({
        id: `lookup_${Date.now()}`,
        word: details.word,
        phoneticIpa: details.phoneticIpa,
        partOfSpeech: details.partOfSpeech,
        cefrLevel: "B1",
        translationPt: details.translationPt,
        definitionEn: details.definitionEn,
        exampleSentence: details.exampleEn,
        status: "learning",
      });
      localStorage.setItem("english-lab-vocab-items", JSON.stringify(list));

      setIsSaved(true);
    } catch (err) {
      console.error("Error saving word:", err);
    }
  };

  const handlePlayAudio = () => {
    if (!details) return;
    playPronunciation(details.word, 0.9, "en-US");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dicionário Contextual de Toque"
      description="Tradução, fonética e active recall com 1 toque no chat."
      maxWidth="md"
    >
      <div className="space-y-5">
        {isLoading ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-zinc-400 font-mono">Buscando definição contextual...</p>
          </div>
        ) : details ? (
          <div className="space-y-4">
            {/* Header Word & Audio */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white">{details.word}</h3>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#181824] text-amber-300 border border-amber-400/20">
                    {details.partOfSpeech}
                  </span>
                </div>
                <span className="text-xs text-zinc-400 font-mono mt-0.5 block">{details.phoneticIpa}</span>
              </div>

              <button
                type="button"
                onClick={handlePlayAudio}
                className="w-10 h-10 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
                title="Ouvir Pronúncia"
              >
                <Volume2 className="w-5 h-5 fill-zinc-950" />
              </button>
            </div>

            {/* Translation & Definition */}
            <div className="p-4 rounded-2xl bg-[#14141e] border border-white/10 space-y-2">
              <div>
                <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block">Tradução em Português:</span>
                <span className="text-sm font-bold text-emerald-400">{details.translationPt}</span>
              </div>

              {details.definitionEn && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block">Definição em Inglês:</span>
                  <p className="text-xs text-zinc-300 font-normal mt-0.5">{details.definitionEn}</p>
                </div>
              )}
            </div>

            {/* Example Sentence */}
            {details.exampleEn && (
              <div className="p-3.5 rounded-2xl bg-[#14141e] border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block">Exemplo Prático:</span>
                <p className="text-xs text-zinc-200 italic">"{details.exampleEn}"</p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <Button
                type="button"
                variant={isSaved ? "outline" : "gold"}
                onClick={handleSaveToVocab}
                disabled={isSaved}
                className="w-full sm:w-auto text-xs font-bold"
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
                    <span>Salvo no Banco de Flashcards!</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4 mr-1.5" />
                    <span>+ Salvar nos Meus Flashcards</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
