"use client";

import React from "react";
import { User, Users, Check } from "lucide-react";
import { CEFRLevel } from "@/types/profile";

interface LevelSwitcherProps {
  currentProfile: "parent" | "child";
  currentLevel: CEFRLevel;
  onSwitchProfile: (profile: "parent" | "child", level: CEFRLevel) => void;
}

export function LevelSwitcher({
  currentProfile,
  currentLevel,
  onSwitchProfile,
}: LevelSwitcherProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#0f0f15] border border-white/10 rounded-2xl shadow-inner">
      <button
        onClick={() => onSwitchProfile("parent", "B1+")}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          currentProfile === "parent"
            ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
            : "text-zinc-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <User className="w-3.5 h-3.5" />
        <span>Meu Perfil (Nível {currentLevel})</span>
        {currentProfile === "parent" && <Check className="w-3.5 h-3.5 ml-1 text-zinc-950 stroke-[3]" />}
      </button>

      <button
        onClick={() => onSwitchProfile("child", "A1")}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          currentProfile === "child"
            ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20"
            : "text-zinc-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <Users className="w-3.5 h-3.5" />
        <span>Perfil Filho (Iniciante • A1)</span>
        {currentProfile === "child" && <Check className="w-3.5 h-3.5 ml-1 text-zinc-950 stroke-[3]" />}
      </button>
    </div>
  );
}
