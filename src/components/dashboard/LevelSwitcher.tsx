"use client";

import React from "react";
import { User, Users, ChevronDown, Check } from "lucide-react";
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
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
      <button
        onClick={() => onSwitchProfile("parent", "B1+")}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          currentProfile === "parent"
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
        }`}
      >
        <User className="w-3.5 h-3.5" />
        <span>Meu Perfil (Intermediário • B1+)</span>
        {currentProfile === "parent" && <Check className="w-3 h-3 ml-1 text-indigo-200" />}
      </button>

      <button
        onClick={() => onSwitchProfile("child", "A1")}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          currentProfile === "child"
            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
        }`}
      >
        <Users className="w-3.5 h-3.5" />
        <span>Perfil Filho (Iniciante • A1)</span>
        {currentProfile === "child" && <Check className="w-3 h-3 ml-1 text-emerald-200" />}
      </button>
    </div>
  );
}
