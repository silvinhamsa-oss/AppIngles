import { Lesson, LevelCategory } from "@/types/curriculum";

export interface LevelInfo {
  id: LevelCategory;
  name: string;
  badge: string;
  description: string;
  color: string;
  totalHours: number;
}

export const LEVEL_METADATA: Record<LevelCategory, LevelInfo> = {
  A1: {
    id: "A1",
    name: "Iniciante (Breakthrough)",
    badge: "A1 • Básico Zero",
    description: "Saudações, apresentação pessoal, números, rotina diária e pronúncia básica sem bloqueios.",
    color: "from-blue-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-300",
    totalHours: 25,
  },
  A2: {
    id: "A2",
    name: "Básico (Waystage)",
    badge: "A2 • Prático",
    description: "Passado simples, viagens, compras, pedidos em restaurantes e direções.",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300",
    totalHours: 35,
  },
  B1: {
    id: "B1",
    name: "Intermediário (Threshold)",
    badge: "B1 • Conversação",
    description: "Expressão de opiniões, conectivos de transição, reuniões de trabalho e superação da tradução mental.",
    color: "from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-300",
    totalHours: 45,
  },
  B2: {
    id: "B2",
    name: "Independente (Vantage)",
    badge: "B2 • Fluência Profissional",
    description: "Debates complexos, linguagem técnica, argumentação com solidez e reuniões executivas.",
    color: "from-orange-500/20 to-rose-500/20 border-orange-500/30 text-orange-300",
    totalHours: 55,
  },
  C1: {
    id: "C1",
    name: "Avançado (Effective Proficiency)",
    badge: "C1 • Fluência Espontânea",
    description: "Nuances idiomáticas, negociações estratégicas, humor, sarcasmo e discurso flexível sem hesitação.",
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-300",
    totalHours: 65,
  },
  C2: {
    id: "C2",
    name: "Maestria (Mastery / Quase Nativo)",
    badge: "C2 • Domínio Pleno",
    description: "Compreensão de sotaques raros, linguagem jurídica/acadêmica sofisticada, retórica e precisão cirúrgica.",
    color: "from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-300",
    totalHours: 70,
  },
  EXAM_PREP: {
    id: "EXAM_PREP",
    name: "Preparatório para Exames Internacionais",
    badge: "🎓 IELTS & TOEFL iBT",
    description: "Simulados cronometrados de Speaking & Writing com critérios oficiais de pontuação (Band 0 a 9.0).",
    color: "from-amber-400/25 to-yellow-400/20 border-amber-400/50 text-amber-300",
    totalHours: 40,
  },
};

export const CURRICULUM_LESSONS: Lesson[] = [
  // --- A1 LESSONS ---
  {
    id: "a1_1",
    level: "A1",
    unit: 1,
    title: "Apresentação Pessoal & Saudações Naturais",
    subtitle: "Diga quem você é, de onde vem e o que faz sem gaguejar",
    description: "Aprenda as estruturas mais comuns de apresentação pessoal com entonação amigável e pronúncia clara.",
    durationMinutes: 12,
    xpReward: 50,
    audioText: "Hi there! My name is Alex. I am from Brazil and I live in São Paulo. It is great to meet you!",
    keyVocabulary: [
      { term: "Great to meet you", translationPt: "Muito prazer em conhecê-lo", ipa: "/ɡreɪt tuː miːt juː/" },
      { term: "Where are you from?", translationPt: "De onde você é?", ipa: "/wɛər ɑːr juː frɒm/" },
      { term: "Daily routine", translationPt: "Rotina diária", ipa: "/ˈdeɪli ruːˈtiːn/" },
    ],
    exercises: [
      {
        id: "ex_a1_1",
        type: "fill_blanks",
        question: "Complete a frase: 'Nice to ______ you.'",
        options: ["meet", "know", "see", "listen"],
        correctAnswer: "meet",
        explanationPt: "'Nice to meet you' é a forma padrão ao conhecer alguém.",
      },
      {
        id: "ex_a1_2",
        type: "dictation",
        question: "Ouça o áudio e escreva a frase em inglês:",
        audioPrompt: "I live in Brazil and I work with technology.",
        correctAnswer: "I live in Brazil and I work with technology.",
      },
    ],
  },
  {
    id: "a1_2",
    level: "A1",
    unit: 1,
    title: "Minha Rotina & Horários",
    subtitle: "Descreva seu dia a dia com verbos simples no presente",
    description: "Treine acordar, tomar café, trabalhar e descansar com o Present Simple.",
    durationMinutes: 15,
    xpReward: 55,
    audioText: "Every morning I wake up at seven o'clock, drink coffee, and start working on my computer.",
    keyVocabulary: [
      { term: "Wake up", translationPt: "Acordar", ipa: "/weɪk ʌp/" },
      { term: "Have breakfast", translationPt: "Tomar café da manhã", ipa: "/hæv ˈbrɛkfəst/" },
    ],
    exercises: [
      {
        id: "ex_a1_3",
        type: "multiple_choice",
        question: "Qual frase expressa rotina corretamente?",
        options: [
          "I drink coffee every morning.",
          "I drinking coffee every morning.",
          "I am drink coffee every morning.",
        ],
        correctAnswer: "I drink coffee every morning.",
        explanationPt: "Para hábitos cotidianos, usamos o Simple Present.",
      },
    ],
  },

  // --- A2 LESSONS ---
  {
    id: "a2_1",
    level: "A2",
    unit: 1,
    title: "Falando sobre o Passado: O que você fez no fim de semana?",
    subtitle: "Domine o Simple Past regular e irregular",
    description: "Aprenda a contar histórias sobre viagens recentes, passeios e fins de semana sem travar.",
    durationMinutes: 15,
    xpReward: 60,
    audioText: "Last weekend, I went to the beach with my family. We ate delicious seafood and walked along the shore.",
    keyVocabulary: [
      { term: "Went", translationPt: "Fui / foi (passado de go)", ipa: "/wɛnt/" },
      { term: "Last weekend", translationPt: "No fim de semana passado", ipa: "/læst ˈwiːkˌɛnd/" },
      { term: "Ate", translationPt: "Comi / comeu (passado de eat)", ipa: "/eɪt/" },
    ],
    exercises: [
      {
        id: "ex_a2_1",
        type: "fill_blanks",
        question: "Complete: 'Yesterday, I ______ an interesting podcast.'",
        options: ["listened to", "listening", "listen", "listens"],
        correctAnswer: "listened to",
        explanationPt: "Passado de 'listen' é 'listened', sempre acompanhado de 'to'.",
      },
    ],
  },

  // --- B1 LESSONS ---
  {
    id: "b1_1",
    level: "B1",
    unit: 1,
    title: "Conectivos de Transição: Soando Natural e Fluido",
    subtitle: "Una ideias com 'however', 'although', 'meanwhile' e 'actually'",
    description: "Elimine frases curtas e telegráficas. Conecte pensamentos de forma madura e profissional.",
    durationMinutes: 18,
    xpReward: 70,
    audioText: "Although the deadline was extremely tight, we managed to deliver the software update on time. Meanwhile, the client sent positive feedback.",
    keyVocabulary: [
      { term: "Although", translationPt: "Embora / apesar de que", ipa: "/ɔːlˈðoʊ/" },
      { term: "Meanwhile", translationPt: "Enquanto isso", ipa: "/ˈmiːn.waɪl/" },
      { term: "Actually", translationPt: "Na verdade / realmente", ipa: "/ˈæktʃu.ə.li/" },
    ],
    exercises: [
      {
        id: "ex_b1_1",
        type: "multiple_choice",
        question: "Qual conectivo indica contraste concessivo?",
        options: ["Although", "Therefore", "Furthermore", "Meanwhile"],
        correctAnswer: "Although",
        explanationPt: "'Although' expressa uma concessão ('embora / apesar de').",
      },
    ],
  },

  // --- B2 LESSONS ---
  {
    id: "b2_1",
    level: "B2",
    unit: 1,
    title: "Reuniões Técnicas & Defesa de Arquitetura",
    subtitle: "Argumente sobre trade-offs, escalabilidade e prazos",
    description: "Aprenda a liderar discussões técnicas com phrasal verbs corporativos e precisão léxica.",
    durationMinutes: 20,
    xpReward: 80,
    audioText: "From an architectural standpoint, adopting microservices introduces latency overhead. Furthermore, we need to consider data consistency across bounded contexts.",
    keyVocabulary: [
      { term: "Trade-off", translationPt: "Compromisso / concessão técnica", ipa: "/ˈtreɪd.ɑːf/" },
      { term: "Standpoint", translationPt: "Ponto de vista / perspectiva", ipa: "/ˈstænd.pɔɪnt/" },
      { term: "Furthermore", translationPt: "Além disso / ademais", ipa: "/ˌfɝː.ðɚˈmɔːr/" },
    ],
    exercises: [
      {
        id: "ex_b2_1",
        type: "dictation",
        question: "Escreva a frase técnica ouvida:",
        audioPrompt: "We need to figure out a scalable caching strategy.",
        correctAnswer: "We need to figure out a scalable caching strategy.",
      },
    ],
  },

  // --- C1 LESSONS ---
  {
    id: "c1_1",
    level: "C1",
    unit: 1,
    title: "Negociações Estratégicas & Nuances Idiomáticas",
    subtitle: "Fale com diplomacia, persuasão e metáforas corporativas",
    description: "Domine expressões idiomáticas de alto nível como 'cut to the chase', 'play devil's advocate' e 'touch base'.",
    durationMinutes: 22,
    xpReward: 90,
    audioText: "Let's play devil's advocate for a moment. If the market shifts towards local LLMs, our cloud pipeline might become obsolete.",
    keyVocabulary: [
      { term: "Play devil's advocate", translationPt: "Fazer o papel de advogado do diabo", ipa: "/pleɪ ˈdɛv.əlz ˈæd.və.kət/" },
      { term: "Cut to the chase", translationPt: "Ir direto ao ponto", ipa: "/kʌt tuː ðə tʃeɪs/" },
    ],
    exercises: [
      {
        id: "ex_c1_1",
        type: "multiple_choice",
        question: "O que significa 'play devil's advocate'?",
        options: [
          "Apresentar contra-argumentos para testar a solidez de uma ideia",
          "Acusar um colega de erro grave",
          "Defender uma causa ilegal",
        ],
        correctAnswer: "Apresentar contra-argumentos para testar a solidez de uma ideia",
      },
    ],
  },

  // --- C2 LESSONS ---
  {
    id: "c2_1",
    level: "C2",
    unit: 1,
    title: "Retórica Executiva & Precisão Cirúrgica",
    subtitle: "Domínio pleno de estilo, ironia sutil e discursos de alto impacto",
    description: "Treine a elaboração de discursos persuasivos no nível de executivos globais e palestrantes internacionais.",
    durationMinutes: 25,
    xpReward: 100,
    audioText: "It is an incontrovertible reality that technological disruption transcends mere tooling; it fundamentally reshapes organizational cognitive architecture.",
    keyVocabulary: [
      { term: "Incontrovertible", translationPt: "Indiscutível / irrefutável", ipa: "/ˌɪn.kɑːn.trəˈvɝː.t̬ə.bəl/" },
      { term: "Transcends", translationPt: "Transcende / vai além de", ipa: "/trænˈsɛndz/" },
    ],
    exercises: [
      {
        id: "ex_c2_1",
        type: "fill_blanks",
        question: "Complete: 'The findings provided ______ proof of the algorithm's efficacy.'",
        options: ["incontrovertible", "good", "clear", "easy"],
        correctAnswer: "incontrovertible",
        explanationPt: "Para nível C2, 'incontrovertible' confere rigor estilístico e precisão acadêmica.",
      },
    ],
  },

  // --- EXAM PREP (IELTS / TOEFL) ---
  {
    id: "exam_ielts_1",
    level: "EXAM_PREP",
    unit: 1,
    title: "IELTS Speaking Part 2: O Monólogo de 2 Minutos (STAR Method)",
    subtitle: "Treine falar por 2 minutos ininterruptos com estrutura lógica",
    description: "Simulado real de Speaking com cartão de tópicos (Cue Card), 1 minuto de preparação e feedback oficial em 4 critérios.",
    durationMinutes: 20,
    xpReward: 120,
    audioText: "Describe a time when you solved a complex problem under pressure. You should say: what the problem was, how you approached it, and what the outcome was.",
    keyVocabulary: [
      { term: "Under pressure", translationPt: "Sob pressão / em momento crítico", ipa: "/ˈʌn.dɚ ˈprɛʃ.ɚ/" },
      { term: "Outcome", translationPt: "Resultado / desfecho", ipa: "/ˈaʊt.kʌm/" },
    ],
    exercises: [
      {
        id: "ex_exam_1",
        type: "speaking_prompt",
        question: "Fale durante 60 a 90 segundos respondendo ao Cue Card utilizando o microfone.",
        explanationPt: "A IA avaliará: Fluência & Coerência, Recurso Lexical, Gramática e Pronúncia.",
      },
    ],
  },
];
