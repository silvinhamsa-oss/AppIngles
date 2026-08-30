"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Sparkles, MessageSquare, Wand2, UserCheck, Layers } from "lucide-react";
import { CEFRLevel } from "@/types/profile";
import { ScenarioTopic } from "./TopicSelector";

interface CustomScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomScenario: (topic: ScenarioTopic, initialPrompt?: string) => void;
}

export function CustomScenarioModal({
  isOpen,
  onClose,
  onApplyCustomScenario,
}: CustomScenarioModalProps) {
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [level, setLevel] = useState<CEFRLevel>("B1");
  const [isGenerating, setIsGenerating] = useState(false);

  const predefinedTemplates = [
    {
      title: "Entrevista de Emprego Tech (Tech Lead)",
      context: "Você é o Diretor de Engenharia de uma startup no Vale do Silício me entrevistando para a vaga de Senior Fullstack Engineer.",
      level: "B2" as CEFRLevel,
    },
    {
      title: "Check-in em Hotel 5 Estrelas em Londres",
      context: "Você é o recepcionista do hotel The Savoy em Londres. Eu acabei de chegar com minha família e quero fazer check-in e tirar dúvidas sobre a cidade.",
      level: "A2" as CEFRLevel,
    },
    {
      title: "Negociação de Contrato e Prazos",
      context: "Você é um cliente corporativo exigente pedindo desconto de 20% e entrega adiantada. Eu sou o gerente de contas negociando um meio-termo.",
      level: "B1+" as CEFRLevel,
    },
    {
      title: "Pitch de Startup para Investidores",
      context: "Você é um investidor-anjo americano fazendo perguntas difíceis sobre tração, CAC, LTV e roadmap do meu aplicativo SaaS.",
      level: "C1" as CEFRLevel,
    },
  ];

  const handleApply = () => {
    if (!title.trim() || !context.trim()) return;

    const customTopic: ScenarioTopic = {
      id: `custom_${Date.now()}`,
      title: title.trim(),
      subtitle: context.trim(),
      icon: Layers,
      mode: "guided",
      level: level,
      color: "text-amber-400 bg-amber-500/15 border-amber-500/40",
    };

    const initialPrompt = `[SCENARIO: ${title.trim()} (${level})]\nCONTEXT: ${context.trim()}\nAct strictly in character as the role described in this scenario. Greet the user naturally in English according to the scene.`;

    onApplyCustomScenario(customTopic, initialPrompt);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🎭 Criar Cenário Personalizado de Conversa"
      description="Defina qualquer situação do mundo real para a Sarah ou o Marcus simularem com você."
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Quick Templates */}
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block mb-2">
            💡 Ou escolha um modelo pronto:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {predefinedTemplates.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTitle(t.title);
                  setContext(t.context);
                  setLevel(t.level);
                }}
                className="p-2.5 rounded-xl bg-[#14141e] hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-amber-300">
                  <span className="truncate">{t.title}</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-amber-400 shrink-0">
                    {t.level}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 truncate mt-0.5 font-normal">{t.context}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Form */}
        <div className="space-y-3.5 pt-2 border-t border-white/10">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/80 font-mono mb-1">
              Nome do Cenário:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Pedindo reembolso na Amazon US, Negociação de Salário..."
              className="w-full rounded-2xl bg-[#14141e] border border-white/15 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/80 font-mono mb-1">
              Contexto & Papel da IA:
            </label>
            <textarea
              rows={3}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Descreva quem a IA é e qual é a situação (Ex: 'Você é um atendente simpático da Delta Airlines resolvendo um voo cancelado...')"
              className="w-full rounded-2xl bg-[#14141e] border border-white/15 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/80 font-mono mb-1">
              Nível de Dificuldade Esperado (CEFR):
            </label>
            <div className="flex flex-wrap gap-2">
              {(["A1", "A2", "B1", "B1+", "B2", "C1", "C2"] as CEFRLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    level === lvl
                      ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/25"
                      : "bg-[#14141e] text-zinc-400 hover:text-white border border-white/10"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto text-xs">
            <span>Cancelar</span>
          </Button>

          <Button
            type="button"
            variant="gold"
            disabled={!title.trim() || !context.trim()}
            onClick={handleApply}
            className="w-full sm:w-auto text-xs font-bold shadow-md shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            <span>Iniciar Conversa Neste Cenário</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
