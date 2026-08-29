"use client";

import React from "react";
import { CheckCircle2, User, Users, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function LevelComparison() {
  return (
    <section id="levels" className="py-20 sm:py-28 relative bg-slate-950/60 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Para Você e Sua Família</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Do Primeiro Contato (A1) à Fluência Intermediária (B1+)
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Uma plataforma única com perfis independentes. O pai pratica conversação avançada e o filho aprende desde o zero com suporte bilíngue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Beginner Card */}
          <Card variant="bordered" className="relative p-8 border-emerald-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950/90">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="success">Iniciante • A1 / A2</Badge>
              <span className="text-xs text-slate-400 font-medium">Para filhos & iniciantes</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-2">Trilha de Fundamentos</h3>
            <p className="text-sm text-slate-400 mb-6">
              Aprenda a base com calma, passo a passo, com áudio nativo e suporte da IA em português quando surgir dúvida.
            </p>

            <ul className="space-y-3.5 mb-8 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lições guiadas curtas (5 a 10 min)</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Vocabulário de sobrevivência e rotina diária</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>IA com explicações simples e encorajadoras</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Treinamento de pronúncia e escuta lenta</span>
              </li>
            </ul>

            <Link href="/learn" className="block">
              <Button variant="outline" className="w-full">
                Ver Trilha de Fundamentos
              </Button>
            </Link>
          </Card>

          {/* Intermediate Card */}
          <Card variant="glow" className="relative p-8 border-indigo-500/40 bg-gradient-to-b from-indigo-950/20 via-slate-900/90 to-slate-950/90 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="primary">Intermediário • B1 / B1+ / B2</Badge>
              <span className="text-xs text-indigo-400 font-bold">Foco em Fluência</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-2">Laboratório de Conversação</h3>
            <p className="text-sm text-slate-400 mb-6">
              Destrave a fala, pare de traduzir mentalmente e resgate vocabulário na ponta da língua sob demanda.
            </p>

            <ul className="space-y-3.5 mb-8 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Conversação imersiva 100% em inglês</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Active Recall de verbos frasais e conectivos</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Recursos &quot;I forgot the word&quot; e &quot;Think in English&quot;</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Relatórios pós-conversa com análise de fluência</span>
              </li>
            </ul>

            <Link href="/talk" className="block">
              <Button variant="glow" className="w-full">
                <span>Praticar Conversação</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </section>
  );
}
