"use client";

import React from "react";
import Link from "next/link";
import { Flame, Sparkles, GraduationCap } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { CEFRLevel } from "@/types/profile";

interface HeaderProps {
  currentLevel?: CEFRLevel;
  streakDays?: number;
  xpPoints?: number;
  userName?: string;
}

export function Header({
  currentLevel = "B1+",
  streakDays = 5,
  xpPoints = 1420,
  userName = "Welld",
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#07070a]/90 backdrop-blur-lg border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Brand mobile */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-md shadow-amber-500/20 font-black text-zinc-950 text-xs tracking-wider group-hover:scale-105 transition-transform">
            EL
          </div>
          <span className="font-extrabold text-base text-white tracking-tight block sm:hidden">
            English<span className="text-amber-400">Lab</span>
          </span>
        </Link>

        {/* Level Indicator Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#121218] border border-white/10 text-amber-300 text-xs font-mono font-bold">
          <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
          <span>Nível: {currentLevel}</span>
        </div>
      </div>

      {/* Stats & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Flame */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>{streakDays} <span className="hidden sm:inline font-normal text-amber-400/70">dias</span></span>
        </div>

        {/* XP Points */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121218] border border-white/10 text-white text-xs font-bold font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{xpPoints} XP</span>
        </div>

        <ThemeToggle />

        {/* User avatar */}
        <Link
          href="/settings"
          className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#121218] hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all"
        >
          <div className="w-5 h-5 rounded-md bg-amber-500 text-zinc-950 flex items-center justify-center text-[10px] font-black">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:inline font-medium text-white/90">{userName}</span>
        </Link>
      </div>
    </header>
  );
}
