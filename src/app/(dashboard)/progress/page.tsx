"use client";

import React from "react";
import { EnglishRadar } from "@/components/dashboard/EnglishRadar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TrendingUp, Award, Flame, Calendar, CheckCircle2 } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="primary">Diagnóstico e Estatísticas</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-2">
          Progresso & English Radar
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Acompanhamento detalhado da sua evolução segundo a escala do Quadro Comum Europeu (CEFR).
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <Award className="w-4 h-4" />
            <span>Nível Atual</span>
          </div>
          <div className="text-2xl font-black text-slate-100">B1+ Intermediário</div>
          <div className="text-[11px] text-slate-400 mt-1">Meta: B2 Independente</div>
        </Card>

        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>Ofensiva (Streak)</span>
          </div>
          <div className="text-2xl font-black text-slate-100">5 dias seguidos</div>
          <div className="text-[11px] text-slate-400 mt-1">Recorde: 14 dias</div>
        </Card>

        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Palavras Ativas</span>
          </div>
          <div className="text-2xl font-black text-slate-100">142 palavras</div>
          <div className="text-[11px] text-slate-400 mt-1">92% de retenção SRS</div>
        </Card>

        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
            <Calendar className="w-4 h-4" />
            <span>Minutos Falados</span>
          </div>
          <div className="text-2xl font-black text-slate-100">85 minutos</div>
          <div className="text-[11px] text-slate-400 mt-1">Neste mês</div>
        </Card>
      </div>

      {/* Radar and Skills Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card variant="glass" className="lg:col-span-6 p-6 flex flex-col items-center justify-center">
          <h3 className="text-base font-bold text-slate-100 mb-4 self-start">
            Radar Global de Competências (6 Eixos)
          </h3>
          <EnglishRadar
            data={{
              speaking: 72,
              vocabulary: 68,
              listening: 78,
              grammar: 82,
              reading: 85,
              writing: 74,
            }}
            size={300}
          />
        </Card>

        <Card variant="glass" className="lg:col-span-6 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-100 mb-2">
            Detalhamento por Habilidade
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Speaking (Conversação)</span>
                <span className="text-indigo-400">72%</span>
              </div>
              <ProgressBar value={72} variant="primary" size="sm" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Vocabulary (Recuperação de Vocabulário)</span>
                <span className="text-cyan-400">68%</span>
              </div>
              <ProgressBar value={68} variant="cyan" size="sm" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Listening (Compreensão Auditiva)</span>
                <span className="text-emerald-400">78%</span>
              </div>
              <ProgressBar value={78} variant="emerald" size="sm" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Grammar (Estruturas em Contexto)</span>
                <span className="text-amber-400">82%</span>
              </div>
              <ProgressBar value={82} variant="amber" size="sm" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Reading (Leitura)</span>
                <span className="text-indigo-400">85%</span>
              </div>
              <ProgressBar value={85} variant="primary" size="sm" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Writing (Produção Textual)</span>
                <span className="text-cyan-400">74%</span>
              </div>
              <ProgressBar value={74} variant="cyan" size="sm" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
