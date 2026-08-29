"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-800/80 px-4 sm:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/30 font-black text-white text-lg tracking-wider group-hover:scale-105 transition-transform">
            EL
          </div>
          <div>
            <span className="font-bold text-lg text-slate-100 tracking-tight">
              English<span className="text-indigo-400 font-extrabold">Lab</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30">
              AI Tutor
            </span>
          </div>
        </Link>

        {/* Links Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">Como Funciona</a>
          <a href="#features" className="hover:text-indigo-400 transition-colors">Recursos</a>
          <a href="#levels" className="hover:text-indigo-400 transition-colors">Iniciante & Intermediário</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-2">
            Entrar
          </Link>
          <Link href="/dashboard">
            <Button variant="glow" size="sm" className="hidden sm:flex">
              <span>Acessar Plataforma</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
