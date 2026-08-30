import { CEFRLevel } from "@/types/profile";

export interface DictationExercise {
  id: string;
  title: string;
  level: CEFRLevel;
  accent: "en-US" | "en-GB" | "en-AU";
  accentLabel: string;
  targetSentence: string;
  hintPt: string;
  category: "phrasal_verbs" | "daily_sync" | "travel" | "tech";
}

export const SEED_DICTATIONS: DictationExercise[] = [
  {
    id: "dict_1",
    title: "Alinhamento de Projeto & Latência",
    level: "B1+",
    accent: "en-US",
    accentLabel: "American English",
    targetSentence: "We need to figure out how to optimize this API latency.",
    hintPt: "Dica: 'descobrir / resolver' como phrasal verb",
    category: "tech",
  },
  {
    id: "dict_2",
    title: "Conectivo de Transição em Reunião",
    level: "B1+",
    accent: "en-GB",
    accentLabel: "British English (Oxford)",
    targetSentence: "Although it was challenging, the deployment was successful.",
    hintPt: "Dica: Conectivo concessivo de contraste no início da frase",
    category: "daily_sync",
  },
  {
    id: "dict_3",
    title: "Expressão Idiomática Corporativa",
    level: "B2",
    accent: "en-US",
    accentLabel: "American English",
    targetSentence: "Let us cut to the chase and discuss the core bottleneck.",
    hintPt: "Dica: Expressão para 'ir direto ao ponto'",
    category: "phrasal_verbs",
  },
  {
    id: "dict_4",
    title: "Situação em Aeroporto e Viagem",
    level: "A2",
    accent: "en-US",
    accentLabel: "American English",
    targetSentence: "I am traveling to San Francisco for an annual developer conference.",
    hintPt: "Dica: 'Eu estou viajando para...'",
    category: "travel",
  },
];
