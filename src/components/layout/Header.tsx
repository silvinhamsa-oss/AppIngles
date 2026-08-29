"use client";

import React from "react";
import Link from "next/link";
import { Flame, Sparkles, User, Settings, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "./ThemeToggle";
import { CEFRLevel } from "@/types/profile";

interface HeaderProps {
  currentLevel?: CEFRLevel;
  streakDays?: number;
  xpPoints?: number;
  userName?: string;
  onLevelChange?: (level: CEFRLevel) => void;
}

export function Header({
  currentLevel = "B1+",
  streakDays = 5,
  xpPoints = 1420,
  userName = "Aluno",
  onLevelChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      {/* Brand mobile */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-600/30 font-bold text-white tracking-wider group-hover:scale-105 transition-transform">
            EL
          </div>
          <span className="font-bold text-base sm:text-lg text-slate-100 tracking-tight block sm:hidden">
            English<span className="text-indigo-400 font-extrabold">Lab</span>
          </span>
        </Link>

        {/* Level Indicator Pill with Quick Switcher capability */}
        <div className="relative group">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Nível: {currentLevel}</span>
          </div>
        </div>
      </div>

      {/* Stats & Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Streak Flame */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold shadow-sm shadow-amber-500/10">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse fill-amber-400" />
          <span>{streakDays} <span className="hidden sm:inline font-normal text-amber-400/80">dias</span></span>
        </div>

        {/* XP Points */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-bold shadow-sm shadow-cyan-500/10">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{xpPoints} <span className="hidden sm:inline font-normal text-cyan-400/80">XP</span></span>
        </div>

        <ThemeToggle />

        {/* User avatar & quick settings */}
        <Link
          href="/settings"
          className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 text-xs font-medium transition-all"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:inline font-medium text-slate-300">{userName}</span>
        </Link>
      </div>
    </header>
  );
}
