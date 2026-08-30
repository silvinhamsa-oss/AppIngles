import { CEFRLevel } from "@/types/profile";

export interface MissionBlock {
  title: string;
  durationMin: number;
  type: "srs" | "listening" | "talk" | "eval";
  description: string;
}

export interface MissionPlan {
  totalMinutes: number;
  xpReward: number;
  blocks: MissionBlock[];
}

export const MISSION_PLANS_BY_DURATION: Record<number, MissionPlan> = {
  10: {
    totalMinutes: 10,
    xpReward: 35,
    blocks: [
      {
        title: "Active Recall Flashcards",
        durationMin: 3,
        type: "srs",
        description: "5 palavras em revisão espaçada (SM-2)",
      },
      {
        title: "Micro-Conversa de Alto Impacto",
        durationMin: 5,
        type: "talk",
        description: "Bate-papo rápido e espontâneo com Sarah",
      },
      {
        title: "Feedback & Métricas",
        durationMin: 2,
        type: "eval",
        description: "Análise imediata de fluência e pronúncia",
      },
    ],
  },
  20: {
    totalMinutes: 20,
    xpReward: 75,
    blocks: [
      {
        title: "Aquecimento: Active Recall",
        durationMin: 5,
        type: "srs",
        description: "10 palavras essenciais (SM-2) com áudio",
      },
      {
        title: "Laboratório de Escuta / Ditado",
        durationMin: 5,
        type: "listening",
        description: "Treino de velocidade de fala nativa (0.75x a 1.25x)",
      },
      {
        title: "Conversação Imersiva com Sarah/Marcus",
        durationMin: 8,
        type: "talk",
        description: "Cenário guiado com áudio bidirecional contínuo",
      },
      {
        title: "Relatório CEFR & Calibração",
        durationMin: 2,
        type: "eval",
        description: "5 notas e correções estruturadas",
      },
    ],
  },
  30: {
    totalMinutes: 30,
    xpReward: 120,
    blocks: [
      {
        title: "Treino de Vocabulário SRS",
        durationMin: 7,
        type: "srs",
        description: "15 cards com revisão de intervalos e facilidade",
      },
      {
        title: "Listening Lab & Ditado Avançado",
        durationMin: 8,
        type: "listening",
        description: "Compreensão de nuances, conectivos e sotaques",
      },
      {
        title: "Conversação Extensa & Roleplay",
        durationMin: 12,
        type: "talk",
        description: "Simulação profissional de entrevista ou projeto",
      },
      {
        title: "Relatório Pedagógico & Extração",
        durationMin: 3,
        type: "eval",
        description: "Extração de vocabulário novo e correções nativas",
      },
    ],
  },
  45: {
    totalMinutes: 45,
    xpReward: 200,
    blocks: [
      {
        title: "Imersão em Vocabulário Ativo",
        durationMin: 10,
        type: "srs",
        description: "Revisão completa do banco de palavras",
      },
      {
        title: "Listening & Dictation Mastery",
        durationMin: 10,
        type: "listening",
        description: "Velocidades 1.0x e 1.25x com verificação diff",
      },
      {
        title: "Debate ou Simulado de Exame",
        durationMin: 20,
        type: "talk",
        description: "Conversação avançada sem interrupções em português",
      },
      {
        title: "Diagnóstico Global de Fluência",
        durationMin: 5,
        type: "eval",
        description: "Relatório completo de CEFR, pontos fortes e metas",
      },
    ],
  },
};

export function getMissionPlan(duration: number, targetLevel: CEFRLevel = "B1+"): MissionPlan {
  return MISSION_PLANS_BY_DURATION[duration] || MISSION_PLANS_BY_DURATION[20];
}
