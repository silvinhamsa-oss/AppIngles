"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Library, Headphones, BookOpen, ArrowRight } from "lucide-react";


export function QuickActions() {
  const actions = [
    {
      title: "Conversar com IA",
      subtitle: "Bate-papo livre ou guiado com áudio nativo",
      href: "/talk",
      icon: MessageSquare,
      haloClass: "card-halo-cyan",
      iconBg: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/20",
      accentText: "text-cyan-400 group-hover:text-cyan-300",
      badge: "Speaking",
      badgeBg: "bg-cyan-950/80 text-cyan-300 border border-cyan-500/40",
    },
    {
      title: "Revisar Vocabulário",
      subtitle: "Praticar Flashcards 3D com repetição espaçada",
      href: "/vocabulary",
      icon: Library,
      haloClass: "card-halo-emerald",
      iconBg: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/20",
      accentText: "text-emerald-400 group-hover:text-emerald-300",
      badge: "Active Recall",
      badgeBg: "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40",
    },
    {
      title: "Trilha de Aulas",
      subtitle: "Curso estruturado do Iniciante (A1) ao B2",
      href: "/learn",
      icon: BookOpen,
      haloClass: "card-halo-purple",
      iconBg: "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/20",
      accentText: "text-purple-400 group-hover:text-purple-300",
      badge: "A1 ao B2",
      badgeBg: "bg-purple-950/80 text-purple-300 border border-purple-500/40",
    },
    {
      title: "Compreensão Auditiva",
      subtitle: "Exercícios de escuta real, ditado e resumo",
      href: "/learn",
      icon: Headphones,
      haloClass: "card-halo-amber",
      iconBg: "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/20",
      accentText: "text-amber-400 group-hover:text-amber-300",
      badge: "Listening",
      badgeBg: "bg-amber-950/80 text-amber-300 border border-amber-500/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <Link key={idx} href={action.href} className="group">
            <div
              className={`rounded-3xl p-5 flex flex-col justify-between h-full bg-[#0d0d14] transition-all duration-300 ${action.haloClass}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${action.iconBg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-bold font-mono uppercase px-2.5 py-0.5 rounded-full ${action.badgeBg}`}
                  >
                    {action.badge}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mb-1 group-hover:translate-x-0.5 transition-transform">
                  {action.title}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                  {action.subtitle}
                </p>
              </div>

              <div className={`pt-4 flex items-center gap-1.5 text-xs font-bold ${action.accentText}`}>
                <span>Acessar Módulo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
