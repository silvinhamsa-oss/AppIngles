"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black text-zinc-950 text-base tracking-wider group-hover:scale-105 transition-transform">
            EL
          </div>
          <div>
            <span className="font-black text-lg text-zinc-100 tracking-tight">
              English<span className="text-amber-400">Lab</span>
            </span>
          </div>
        </Link>

        {/* Links Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <a href="#how-it-works" className="hover:text-amber-400 transition-colors">Como Funciona</a>
          <a href="#features" className="hover:text-amber-400 transition-colors">Recursos</a>
          <a href="#levels" className="hover:text-amber-400 transition-colors">Iniciante & Intermediário</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="text-xs font-bold text-zinc-300 hover:text-white px-3 py-2">
            Entrar
          </Link>
          <Link href="/dashboard">
            <Button variant="gold" size="sm" className="hidden sm:flex shadow-sm">
              <span>Acessar Plataforma</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
