"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden border-t border-[var(--border-subtle)] studio-mesh">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 mx-auto flex items-center justify-center text-zinc-950 shadow-xl shadow-amber-500/20 mb-6">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-[-0.03em] mb-4">
          Comece sua jornada no inglês hoje.
        </h2>
        <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-xl mx-auto mb-8 font-normal">
          Pratique 15 minutos por dia com seu tutor de IA adaptativo e sinta a diferença na naturalidade e na recuperação de vocabulário.
        </p>
        <Link href="/dashboard">
          <Button variant="gold" size="lg" className="shadow-xl shadow-amber-500/15">
            <span>Acessar o English Lab</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
