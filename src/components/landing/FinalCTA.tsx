"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden border-t border-slate-800/80">
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 mb-6">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight mb-4">
          Comece sua jornada no inglês hoje.
        </h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-8">
          Pratique 15 minutos por dia com seu tutor de IA adaptativo e sinta a diferença na naturalidade e na recuperação de vocabulário.
        </p>
        <Link href="/dashboard">
          <Button variant="glow" size="lg">
            <span>Acessar o English Lab</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
