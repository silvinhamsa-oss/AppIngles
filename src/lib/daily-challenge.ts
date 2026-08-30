import { CEFRLevel } from "@/types/profile";

export interface DailyChallenge {
  id: string;
  dateKey: string;
  level: CEFRLevel;
  title: string;
  type: "speaking" | "vocabulary" | "listening" | "writing";
  description: string;
  taskPrompt: string;
  targetCount: number;
  xpReward: number;
  badgeName: string;
}

const CHALLENGES_POOL: Record<CEFRLevel, Omit<DailyChallenge, "id" | "dateKey" | "level">[]> = {
  A1: [
    {
      title: "Descreva 3 Alimentos do Seu Café da Manhã",
      type: "speaking",
      description: "Pratique frases simples no presente falando sobre o que você comeu ou bebeu hoje pela manhã.",
      taskPrompt: "Fale em inglês: 'Today I had coffee, bread, and fruits for breakfast...'",
      targetCount: 1,
      xpReward: 50,
      badgeName: "Breakfast Master",
    },
    {
      title: "Dominando 5 Verbos de Rotina",
      type: "vocabulary",
      description: "Revise e memorize 5 verbos essenciais: wake up, drink, work, study, sleep.",
      taskPrompt: "Abra seus flashcards e complete a revisão diária de vocabulário.",
      targetCount: 5,
      xpReward: 50,
      badgeName: "Routine Builder",
    },
  ],
  A2: [
    {
      title: "Conte Sobre Sua Última Viagem",
      type: "speaking",
      description: "Use o passado simples (went, visited, enjoyed) em pelo menos 3 frases de áudio.",
      taskPrompt: "Grave um áudio: 'Last year, I traveled to the beach with my family and it was great.'",
      targetCount: 1,
      xpReward: 50,
      badgeName: "Memory Explorer",
    },
    {
      title: "Ditado Rápido de Áudio",
      type: "listening",
      description: "Ouça e acerte 3 frases no Laboratório de Escuta sem errar a pontuação.",
      taskPrompt: "Complete 1 lição de ditado no mapa de progresso.",
      targetCount: 3,
      xpReward: 50,
      badgeName: "Sharp Ears",
    },
  ],
  B1: [
    {
      title: "Pratique Conectivos de Contraste",
      type: "writing",
      description: "Escreva um mini-parágrafo no Laboratório de Escrita usando 'Although', 'However' e 'Therefore'.",
      taskPrompt: "Embora o projeto fosse desafiador, a equipe entregou no prazo.",
      targetCount: 1,
      xpReward: 50,
      badgeName: "Connector Pro",
    },
    {
      title: "Diálogo de 2 Minutos com Sarah",
      type: "speaking",
      description: "Converse em inglês sobre seu trabalho atual ou planos de carreira no chat de voz.",
      taskPrompt: "Envie pelo menos 4 mensagens de voz seguidas na conversa.",
      targetCount: 4,
      xpReward: 50,
      badgeName: "Conversationalist",
    },
  ],
  "B1+": [
    {
      title: "Desafio Phrasal Verbs em Ação",
      type: "vocabulary",
      description: "Use 'figure out', 'come up with' ou 'look forward to' em uma conversa com o Marcus.",
      taskPrompt: "Aplique pelo menos um dos phrasal verbs durante o chat com áudio.",
      targetCount: 1,
      xpReward: 60,
      badgeName: "Phrasal Ace",
    },
    {
      title: "Pitch Pessoal de 60 Segundos",
      type: "speaking",
      description: "Apresente quem você é, o que faz e sua principal meta profissional para a IA.",
      taskPrompt: "Faça um pitch fluido sem pausas longas em inglês.",
      targetCount: 1,
      xpReward: 60,
      badgeName: "Confident Speaker",
    },
  ],
  B2: [
    {
      title: "Debate sobre Tendências Tecnológicas",
      type: "speaking",
      description: "Defenda uma opinião sobre Inteligência Artificial ou trabalho remoto no modo Tech Standup.",
      taskPrompt: "Apresente argumentos estruturados a favor ou contra uma tese.",
      targetCount: 1,
      xpReward: 75,
      badgeName: "Tech Debater",
    },
    {
      title: "Ensaio Analítico de 150 Palavras",
      type: "writing",
      description: "Complete uma redação no Laboratório de Escrita e obtenha nota de coesão acima de 8.0.",
      taskPrompt: "Escreva sobre desafios modernos do mercado de trabalho.",
      targetCount: 1,
      xpReward: 75,
      badgeName: "Analytical Writer",
    },
  ],
  C1: [
    {
      title: "Inversão Enfática & Expressões Idiomáticas",
      type: "speaking",
      description: "Use estruturas avançadas como 'Hardly had I...', 'Seldom do we...' ou expressões idiomáticas em conversa.",
      taskPrompt: "Demonstre domínio estilístico e naturalidade com o tutor nativo.",
      targetCount: 1,
      xpReward: 100,
      badgeName: "Nuance Master",
    },
  ],
  C2: [
    {
      title: "Negociação de Alto Nível & Retórica",
      type: "speaking",
      description: "Conduza uma negociação complexa no cenário Business Deal com vocabulário diplomático e persuasivo.",
      taskPrompt: "Finalize a sessão de negociação obtendo avaliação máxima do examinador.",
      targetCount: 1,
      xpReward: 100,
      badgeName: "Executive Fluent",
    },
  ],
};

export function getDailyChallenge(level: CEFRLevel = "B1+"): DailyChallenge {
  const now = new Date();
  const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  
  // Calculate day index for deterministic daily rotation
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const pool = CHALLENGES_POOL[level] || CHALLENGES_POOL["B1+"];
  const challengeTemplate = pool[dayOfYear % pool.length];

  return {
    id: `daily_${dateKey}_${level}`,
    dateKey,
    level,
    ...challengeTemplate,
  };
}

export function isDailyChallengeCompleted(challengeId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const completedList = JSON.parse(localStorage.getItem("english-lab-completed-challenges") || "{}");
    return !!completedList[challengeId];
  } catch {
    return false;
  }
}

export function markDailyChallengeCompleted(challengeId: string): void {
  if (typeof window === "undefined") return;
  try {
    const completedList = JSON.parse(localStorage.getItem("english-lab-completed-challenges") || "{}");
    completedList[challengeId] = new Date().toISOString();
    localStorage.setItem("english-lab-completed-challenges", JSON.stringify(completedList));
  } catch {}
}
