"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Library, Headphones, BookOpen, ArrowRight } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Conversar com IA",
      subtitle: "Bate-papo livre ou guiado por tema",
      href: "/talk",
      icon: MessageSquare,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500 group-hover:text-zinc-950",
      badge: "Speaking",
    },
    {
      title: "Revisar Vocabulário",
      subtitle: "Praticar Flashcards 3D & SRS",
      href: "/vocabulary",
      icon: Library,
      color: "text-amber-300 bg-amber-400/10 border-amber-400/20 group-hover:bg-amber-400 group-hover:text-zinc-950",
      badge: "Active Recall",
    },
    {
      title: "Trilha Guiada / Aulas",
      subtitle: "Curso estruturado do A1 ao B2",
      href: "/learn",
      icon: BookOpen,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-zinc-950",
      badge: "Iniciante & Interm.",
    },
    {
      title: "Compreensão Auditiva",
      subtitle: "Exercícios de áudio e ditado",
      href: "/learn",
      icon: Headphones,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500 group-hover:text-zinc-950",
      badge: "Listening",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <Link key={idx} href={action.href} className="group">
            <div className="studio-card rounded-2xl h-full p-5 flex flex-col justify-between hover:border-amber-500/40">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${action.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#181822] border border-white/10 text-white/80 font-mono uppercase">
                    {action.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                  {action.title}
                </h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {action.subtitle}
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                <span>Acessar</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
