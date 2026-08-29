"use client";

import React, { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BookOpen, CheckCircle2, Play, Lock, Clock, Sparkles } from "lucide-react";
import Link from "next/link";

const MODULES_BEGINNER = [
  {
    id: "beg-1",
    title: "Módulo 01: Apresentação e Saudações",
    level: "A1",
    lessons: [
      { id: "l1", title: "Como se apresentar e perguntar nomes", duration: "8 min", status: "completed" },
      { id: "l2", title: "Países, nacionalidades e de onde você é", duration: "10 min", status: "current" },
      { id: "l3", title: "Família e pessoas próximas", duration: "12 min", status: "locked" },
    ],
  },
  {
    id: "beg-2",
    title: "Módulo 02: Rotina Diária e Hábitos",
    level: "A1",
    lessons: [
      { id: "l4", title: "Horários, dias da semana e rotina matinal", duration: "10 min", status: "locked" },
      { id: "l5", title: "Comidas, bebidas e refeições favoritas", duration: "10 min", status: "locked" },
    ],
  },
];

const MODULES_INTERMEDIATE = [
  {
    id: "int-1",
    title: "Módulo 01: Fluência em Conversação & Conectivos",
    level: "B1",
    lessons: [
      { id: "l6", title: "Expressando opiniões sem hesitação (However, Although, Besides)", duration: "15 min", status: "completed" },
      { id: "l7", title: "Contando histórias no passado simples e contínuo com fluidez", duration: "20 min", status: "current" },
      { id: "l8", title: "Verbos Frasais essenciais para conversas reais", duration: "18 min", status: "locked" },
    ],
  },
  {
    id: "int-2",
    title: "Módulo 02: Situações Práticas e Negócios",
    level: "B1+",
    lessons: [
      { id: "l9", title: "Reuniões em inglês, apresentações e falar sobre projetos", duration: "25 min", status: "locked" },
      { id: "l10", title: "Debates e defesa de pontos de vista", duration: "20 min", status: "locked" },
    ],
  },
];

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="cyan">Catálogo de Aulas</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-2">
          Trilhas de Aprendizagem Guiada
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Aulas estruturadas com áudio, exercícios interativos e reforço da IA — desde o iniciante absoluto (A1) até a fluência intermediária (B1/B2).
        </p>
      </div>

      <Tabs
        tabs={[
          { id: "all", label: "Todos os Níveis" },
          { id: "beginner", label: "Iniciante (A1 / A2)", badge: "Para Filhos" },
          { id: "intermediate", label: "Intermediário (B1 / B2)", badge: "Para Adultos" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Beginner Modules Section */}
      {(activeTab === "all" || activeTab === "beginner") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Trilha de Fundamentos (Iniciante • A1 / A2)</span>
            </h2>
            <Badge variant="success">Passo a Passo</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MODULES_BEGINNER.map((mod) => (
              <Card key={mod.id} variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-200">{mod.title}</h3>
                  <Badge variant="success" size="sm">{mod.level}</Badge>
                </div>
                <div className="space-y-3">
                  {mod.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        {lesson.status === "completed" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : lesson.status === "current" ? (
                          <Play className="w-4 h-4 text-indigo-400 fill-indigo-400 shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className={lesson.status === "locked" ? "text-slate-500" : "text-slate-200"}>
                          {lesson.title}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 shrink-0 ml-2">{lesson.duration}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Intermediate Modules Section */}
      {(activeTab === "all" || activeTab === "intermediate") && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span>Laboratório de Fluência (Intermediário • B1 / B2)</span>
            </h2>
            <Badge variant="primary">Fluência & Conversação</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MODULES_INTERMEDIATE.map((mod) => (
              <Card key={mod.id} variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-200">{mod.title}</h3>
                  <Badge variant="primary" size="sm">{mod.level}</Badge>
                </div>
                <div className="space-y-3">
                  {mod.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        {lesson.status === "completed" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : lesson.status === "current" ? (
                          <Play className="w-4 h-4 text-indigo-400 fill-indigo-400 shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className={lesson.status === "locked" ? "text-slate-500" : "text-slate-200"}>
                          {lesson.title}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 shrink-0 ml-2">{lesson.duration}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
