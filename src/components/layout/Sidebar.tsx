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
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Painel", href: "/dashboard", icon: LayoutDashboard },
  { label: "Aprender (Curso)", href: "/learn", icon: BookOpen, badge: "A1/B1" },
  { label: "Conversar com IA", href: "/talk", icon: MessageSquare, badge: "Live" },
  { label: "Banco & Active Recall", href: "/vocabulary", icon: Library },
  { label: "Progresso & Radar", href: "/progress", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-zinc-950/90 border-r border-zinc-800/80 p-5 select-none sticky top-0 h-screen">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black text-zinc-950 text-lg">
          EL
        </div>
        <div>
          <h1 className="font-extrabold text-base text-zinc-100 tracking-tight flex items-center gap-1">
            English<span className="text-amber-400">Lab</span>
          </h1>
          <p className="text-[11px] text-zinc-500 font-medium">Studio Voice Tutor</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
          Navegação
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
                  ? "bg-zinc-800 text-amber-400 border border-amber-500/30 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/90 border border-transparent"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-110",
                    isActive ? "text-amber-400" : "text-zinc-500 group-hover:text-zinc-300"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                    isActive
                      ? "bg-amber-400/20 text-amber-300"
                      : "bg-zinc-900 text-zinc-400 border border-zinc-800"
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
      <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-zinc-200">Prática de Fala Diária</span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
          Fale 15 minutos hoje para manter a ofensiva ativa.
        </p>
        <Link
          href="/talk"
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-md transition-all"
        >
          Abrir Chat com Áudio
        </Link>
      </div>

      {/* Settings Footer */}
      <div className="pt-3 border-t border-zinc-800/80">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all",
            pathname.startsWith("/settings")
              ? "bg-zinc-800 text-amber-400 border border-amber-500/30"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80"
          )}
        >
          <Settings className="w-4 h-4 text-zinc-500" />
          <span>Configurações</span>
        </Link>
      </div>
    </aside>
  );
}
