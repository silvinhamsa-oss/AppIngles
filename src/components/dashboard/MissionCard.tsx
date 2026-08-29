"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Clock, Target, Play, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CEFRLevel } from "@/types/profile";

interface MissionCardProps {
  title?: string;
  durationMinutes?: number;
  skillsWorked?: string[];
  description?: string;
  targetLevel?: CEFRLevel;
}

export function MissionCard({
  title = "Fale sobre a sua semana e planos de trabalho",
  durationMinutes = 20,
  skillsWorked = ["Conversação", "Vocabulário Ativo", "Listening"],
  description = "Foco pedagógico: praticar conectivos de frase (however, although) e uso natural do passado simples sem tradução mental.",
  targetLevel = "B1+",
}: MissionCardProps) {
  return (
    <Card variant="glow" className="relative overflow-hidden border-indigo-500/30 p-6 sm:p-8">
      {/* Glow background accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" size="md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MISSÃO DO DIA</span>
            </Badge>
            <Badge variant="cyan" size="sm">
              <Clock className="w-3 h-3" />
              <span>{durationMinutes} minutos</span>
            </Badge>
            <Badge variant="gold" size="sm">
              <span>Nível {targetLevel}</span>
            </Badge>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            {title}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-semibold">Habilidades:</span>
            {skillsWorked.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="w-full lg:w-auto shrink-0">
          <Link href="/talk">
            <Button variant="glow" size="lg" className="w-full lg:w-auto shadow-xl">
              <Play className="w-5 h-5 fill-current" />
              <span>Iniciar Missão Agora</span>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
