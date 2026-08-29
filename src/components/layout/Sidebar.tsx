"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Library,
  TrendingUp,
  Settings,
  Sparkles,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Painel", href: "/dashboard", icon: LayoutDashboard },
  { label: "Aprender (Curso)", href: "/learn", icon: BookOpen, badge: "A1/B1" },
  { label: "Conversar com IA", href: "/talk", icon: MessageSquare, badge: "IA" },
  { label: "Banco de Vocabulário", href: "/vocabulary", icon: Library },
  { label: "Progresso & Radar", href: "/progress", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-slate-950/80 glass-panel border-r border-slate-800/80 p-5 select-none sticky top-0 h-screen">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 font-black text-white text-lg">
          EL
        </div>
        <div>
          <h1 className="font-bold text-base text-slate-100 tracking-tight flex items-center gap-1.5">
            English<span className="text-indigo-400 font-extrabold">Lab</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">AI Personal Tutor</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Menu Principal
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/20 font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/90 border border-transparent hover:border-slate-800/80"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-indigo-950 text-indigo-300 border border-indigo-500/30"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Pro / AI Tutor Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/20 mb-4 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-200">Tutor de IA Ativo</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
          Pratique fala diária e transforme vocabulário passivo em ativo.
        </p>
        <Link
          href="/talk"
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
        >
          Iniciar Conversa
        </Link>
      </div>

      {/* Settings Footer */}
      <div className="pt-3 border-t border-slate-800/80">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
            pathname.startsWith("/settings")
              ? "bg-indigo-600/90 text-white"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
          )}
        >
          <Settings className="w-4 h-4" />
          <span>Configurações</span>
        </Link>
      </div>
    </aside>
  );
}
