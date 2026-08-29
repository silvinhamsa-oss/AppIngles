"use client";

import React from "react";
import { CheckCircle2, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function LevelComparison() {
  return (
    <section id="levels" className="py-20 sm:py-28 relative border-t border-[var(--border-subtle)] bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Para Você e Sua Família</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Do Primeiro Contato (A1) à Fluência Intermediária (B1+)
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-3">
            Uma plataforma única com perfis independentes. O pai pratica conversação avançada e o filho aprende desde o zero com apoio calmo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Beginner Card */}
          <div className="studio-card rounded-3xl p-8 border-emerald-500/25 relative">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="success">Iniciante • A1 / A2</Badge>
              <span className="text-xs text-[var(--text-muted)] font-medium">Para filhos & iniciantes</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Trilha de Fundamentos</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Aprenda a base com calma, passo a passo, com áudio nativo e suporte da IA em português quando surgir dúvida.
            </p>

            <ul className="space-y-3.5 mb-8 text-sm text-[var(--text-muted)]">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-white">Lições guiadas curtas (5 a 10 min)</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-white">Vocabulário de sobrevivência e rotina diária</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-white">IA com explicações simples e encorajadoras</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-white">Treinamento de pronúncia e escuta lenta</span>
              </li>
            </ul>

            <Link href="/learn" className="block">
              <Button variant="outline" className="w-full">
                Ver Trilha de Fundamentos
              </Button>
            </Link>
          </div>

          {/* Intermediate Card */}
          <div className="studio-card rounded-3xl p-8 border-amber-500/40 relative">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="gold">Intermediário • B1 / B1+ / B2</Badge>
              <span className="text-xs text-amber-400 font-bold">Foco em Fluência</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Laboratório de Conversação</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Destrave a fala, pare de traduzir mentalmente e resgate vocabulário na ponta da língua sob demanda.
            </p>

            <ul className="space-y-3.5 mb-8 text-sm text-[var(--text-muted)]">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-white">Conversação imersiva 100% em inglês</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-white">Active Recall de verbos frasais e conectivos</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-white">Recursos &quot;I forgot the word&quot; e &quot;Think in English&quot;</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-white">Relatórios pós-conversa com análise de fluência</span>
              </li>
            </ul>

            <Link href="/talk" className="block">
              <Button variant="gold" className="w-full shadow-lg shadow-amber-500/10">
                <span>Praticar Conversação</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
