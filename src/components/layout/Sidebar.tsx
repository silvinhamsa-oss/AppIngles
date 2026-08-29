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
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Painel", href: "/dashboard", icon: LayoutDashboard },
  { label: "Teste de Nível", href: "/test", icon: GraduationCap, badge: "3 min" },
  { label: "Aprender (Curso)", href: "/learn", icon: BookOpen, badge: "A1-C2" },
  { label: "Conversar com IA", href: "/talk", icon: MessageSquare, badge: "Live" },
  { label: "Banco & Active Recall", href: "/vocabulary", icon: Library },
  { label: "Progresso & Radar", href: "/progress", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#07070a] border-r border-white/10 p-5 select-none sticky top-0 h-screen">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black text-zinc-950 text-lg">
          EL
        </div>
        <div>
          <h1 className="font-extrabold text-base text-white tracking-tight flex items-center gap-1">
            English<span className="text-amber-400">Lab</span>
          </h1>
          <p className="text-[11px] text-white/40 font-medium">Studio Voice Tutor</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono">
          Menu
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group",
                isActive
                  ? "bg-[#14141d] text-amber-400 border border-amber-500/40 shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-110",
                    isActive ? "text-amber-400" : "text-white/40 group-hover:text-white"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase font-mono",
                    isActive
                      ? "bg-amber-400/20 text-amber-300"
                      : "bg-[#121218] text-white/50 border border-white/10"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Live Audio Status */}
      <div className="p-4 rounded-2xl bg-[#0d0d12] border border-white/10 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-white">Prática de Fala Diária</span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mb-3 font-normal">
          Fale 15 minutos hoje para manter sua ofensiva ativa.
        </p>
        <Link
          href="/talk"
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/15 transition-all"
        >
          Abrir Chat com Áudio
        </Link>
      </div>

      {/* Settings Footer */}
      <div className="pt-3 border-t border-white/10">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all",
            pathname.startsWith("/settings")
              ? "bg-[#14141d] text-amber-400 border border-amber-500/40"
              : "text-white/60 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings className="w-4 h-4 text-white/40" />
          <span>Configurações</span>
        </Link>
      </div>
    </aside>
  );
}
