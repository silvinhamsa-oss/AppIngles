"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Library, Headphones, BookOpen, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function QuickActions() {
  const actions = [
    {
      title: "Conversar com IA",
      subtitle: "Bate-papo livre ou guiado por tema",
      href: "/talk",
      icon: MessageSquare,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white",
      badge: "Speaking",
    },
    {
      title: "Revisar Vocabulário",
      subtitle: "12 palavras prontas para SRS hoje",
      href: "/vocabulary",
      icon: Library,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:bg-cyan-600 group-hover:text-white",
      badge: "Active Recall",
    },
    {
      title: "Trilha Guiada / Aulas",
      subtitle: "Curso estruturado (A1 ao B2)",
      href: "/learn",
      icon: BookOpen,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white",
      badge: "Iniciante & Interm.",
    },
    {
      title: "Compreensão Auditiva",
      subtitle: "Exercícios de áudio e ditado",
      href: "/learn",
      icon: Headphones,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-600 group-hover:text-white",
      badge: "Listening",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <Link key={idx} href={action.href} className="group">
            <Card variant="glass" hoverable className="h-full p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${action.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-slate-300">
                    {action.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-100 mb-1 group-hover:text-indigo-300 transition-colors">
                  {action.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {action.subtitle}
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                <span>Acessar</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
