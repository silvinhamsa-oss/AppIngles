"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Flame, Sparkles, GraduationCap, LogOut, Settings } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { CEFRLevel } from "@/types/profile";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
  currentLevel?: CEFRLevel;
  streakDays?: number;
  xpPoints?: number;
  userName?: string;
}

export function Header({
  currentLevel: propLevel,
  streakDays: propStreak,
  xpPoints: propXp,
  userName: propName,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLevel, setCurrentLevel] = useState<CEFRLevel>(propLevel || "B1+");
  const [streakDays, setStreakDays] = useState(propStreak || 5);
  const [xpPoints, setXpPoints] = useState(propXp || 1420);
  const [userName, setUserName] = useState(propName || "Aluno");

  useEffect(() => {
    async function loadUserData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile) {
            if (profile.full_name) setUserName(profile.full_name);
            else if (user.user_metadata?.full_name) setUserName(user.user_metadata.full_name);
            else if (user.email) setUserName(user.email.split("@")[0]);

            if (profile.cefr_level) setCurrentLevel(profile.cefr_level as CEFRLevel);
            if (profile.streak_days !== undefined) setStreakDays(profile.streak_days);
            if (profile.xp_points !== undefined) setXpPoints(profile.xp_points);
          }
        }
      } catch (err) {
        console.error("Header user load error:", err);
      }
    }
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#07070a]/90 backdrop-blur-lg border-b border-white/10 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
      {/* Brand mobile */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link href="/dashboard" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-md shadow-amber-500/20 font-black text-zinc-950 text-xs tracking-wider group-hover:scale-105 transition-transform">
            EL
          </div>
          <span className="font-extrabold text-sm sm:text-base text-white tracking-tight block sm:hidden">
            English<span className="text-amber-400">Lab</span>
          </span>
        </Link>

        {/* Level Indicator Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#121218] border border-white/10 text-amber-300 text-[11px] sm:text-xs font-mono font-bold shrink-0">
          <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
          <span>{currentLevel}</span>
        </div>
      </div>

      {/* Stats & Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Streak Flame */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-bold font-mono shrink-0">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>{streakDays} <span className="hidden xs:inline sm:inline font-normal text-amber-400/70">dias</span></span>
        </div>

        {/* XP Points */}
        <div className="hidden xs:flex sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#121218] border border-white/10 text-white text-[11px] sm:text-xs font-bold font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{xpPoints} XP</span>
        </div>

        <ThemeToggle />

        {/* Settings Gear Button */}
        <Link
          href="/settings"
          className={`p-1.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
            pathname.startsWith("/settings")
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-400/30"
              : "bg-[#121218] hover:bg-white/10 text-zinc-400 hover:text-white border-white/10"
          }`}
          title="Configurações (IA, Perfil e Voz)"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* User avatar / profile link */}
        <Link
          href="/settings?tab=profile"
          className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#121218] hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all"
          title="Ver Perfil"
        >
          <div className="w-5 h-5 rounded-md bg-amber-500 text-zinc-950 flex items-center justify-center text-[10px] font-black">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:inline font-medium text-white/90">{userName}</span>
        </Link>

        {/* Mobile quick logout */}
        <button
          onClick={handleLogout}
          className="p-1.5 rounded-xl bg-[#121218] hover:bg-red-500/20 text-zinc-400 hover:text-red-300 border border-white/10 transition-all cursor-pointer block lg:hidden"
          title="Sair da Conta"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
