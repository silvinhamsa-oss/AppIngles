"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MessageSquare,
  BookOpen,
  Brain,
  TrendingUp,
  Settings,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Layers,
  X,
} from "lucide-react";
import { CURRICULUM_LESSONS } from "@/lib/curriculum-data";
import { SCENARIO_TOPICS } from "@/components/talk/TopicSelector";
import { SEED_VOCABULARY } from "@/lib/vocabulary-data";

interface SearchResultItem {
  id: string;
  title: string;
  category: "Navegação" | "Lição" | "Cenário de Conversa" | "Vocabulário";
  description?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open trigger is handled by parent or custom event
          const event = new CustomEvent("toggle-command-palette");
          window.dispatchEvent(event);
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Static navigation routes
  const navigationItems: SearchResultItem[] = [
    {
      id: "nav_talk",
      title: "Conversar com IA (Sarah & Marcus)",
      category: "Navegação",
      description: "Chat imersivo por voz com STT/TTS",
      icon: <MessageSquare className="w-4 h-4 text-amber-400" />,
      action: () => {
        router.push("/talk");
        onClose();
      },
    },
    {
      id: "nav_learn",
      title: "Trilha de Aulas A1-C2",
      category: "Navegação",
      description: "Cursos estruturados e preparação para exames",
      icon: <BookOpen className="w-4 h-4 text-blue-400" />,
      action: () => {
        router.push("/learn");
        onClose();
      },
    },
    {
      id: "nav_vocab",
      title: "Banco de Vocabulário (SRS)",
      category: "Navegação",
      description: "Flashcards com repetição espaçada SuperMemo-2",
      icon: <Brain className="w-4 h-4 text-emerald-400" />,
      action: () => {
        router.push("/vocabulary");
        onClose();
      },
    },
    {
      id: "nav_progress",
      title: "Mapa de Fluência & Radar",
      category: "Navegação",
      description: "Diagnóstico das 6 competências e ditado",
      icon: <TrendingUp className="w-4 h-4 text-purple-400" />,
      action: () => {
        router.push("/progress");
        onClose();
      },
    },
    {
      id: "nav_test",
      title: "Teste de Nivelamento (3 min)",
      category: "Navegação",
      description: "Diagnóstico rápido de nível CEFR",
      icon: <GraduationCap className="w-4 h-4 text-amber-400" />,
      action: () => {
        router.push("/test");
        onClose();
      },
    },
    {
      id: "nav_settings",
      title: "Configurações da Plataforma",
      category: "Navegação",
      description: "Provedores de IA, Perfil e Vozes",
      icon: <Settings className="w-4 h-4 text-zinc-400" />,
      action: () => {
        router.push("/settings");
        onClose();
      },
    },
  ];

  // Curriculum Lessons items
  const lessonItems: SearchResultItem[] = CURRICULUM_LESSONS.map((lesson) => ({
    id: `lesson_${lesson.id}`,
    title: `${lesson.level}: ${lesson.title}`,
    category: "Lição" as const,
    description: lesson.description || lesson.subtitle,
    icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
    action: () => {
      router.push("/learn");
      onClose();
    },
  }));

  // Scenario topics items
  const scenarioItems: SearchResultItem[] = SCENARIO_TOPICS.map((topic) => ({
    id: `topic_${topic.id}`,
    title: `Cenário: ${topic.title} (${topic.level})`,
    category: "Cenário de Conversa" as const,
    description: topic.subtitle,
    icon: <Layers className="w-4 h-4 text-amber-400" />,
    action: () => {
      router.push("/talk");
      onClose();
    },
  }));

  // Vocabulary items
  const vocabItems: SearchResultItem[] = SEED_VOCABULARY.map((v) => ({
    id: `vocab_${v.id}`,
    title: `${v.word} (${v.phoneticIpa})`,
    category: "Vocabulário" as const,
    description: `${v.translationPt} • Nível ${v.cefrLevel}`,
    icon: <Brain className="w-4 h-4 text-emerald-400" />,
    action: () => {
      router.push("/vocabulary");
      onClose();
    },
  }));

  const allItems = [...navigationItems, ...lessonItems, ...scenarioItems, ...vocabItems];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(query.toLowerCase())) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : navigationItems;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-150">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-[#0d0d14] border border-amber-500/30 rounded-3xl shadow-2xl shadow-black/90 overflow-hidden z-10 text-white animate-in zoom-in-95 duration-150 flex flex-col max-h-[75dvh]">
        {/* Search Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-[#12121c]">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar lição, palavra, tela ou cenário de conversa..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-white/10 rounded-lg text-zinc-400 border border-white/10">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto flex-1 divide-y divide-white/5">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isSelected ? "bg-amber-500/15 border border-amber-500/30" : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="truncate">{item.title}</span>
                        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10 shrink-0">
                          {item.category}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5 font-normal">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? "text-amber-400 translate-x-0.5" : "text-zinc-600"
                    }`}
                  />
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-2">
              <Search className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">Nenhum resultado encontrado para "{query}".</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-white/10 bg-[#0a0a0f] flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <div className="flex items-center gap-3">
            <span>Navegar: <strong>↑ ↓</strong></span>
            <span>Abrir: <strong>Enter</strong></span>
          </div>
          <span>English Lab Search</span>
        </div>
      </div>
    </div>
  );
}
