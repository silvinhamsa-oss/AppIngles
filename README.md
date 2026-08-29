# 🎙️ English Lab — Studio Voice & AI English Tutor

> **A plataforma definitiva de imersão, conversação ativa com IA, teste de nivelamento interativo e preparação para exames internacionais (CEFR A1 ao C2 + IELTS/TOEFL).**

---

## 🧭 Visão Geral para IAs e Desenvolvedores

O **English Lab** é uma aplicação web moderna (Next.js 16 App Router, TypeScript e Tailwind CSS v4) projetada para **eliminar a tradução mental** e construir fluência espontânea em inglês. 

O app atende desde **iniciantes absolutos (A1)** até o nível de **maestria quase nativa (C2)**, conta com **teste de nivelamento rápido (3 min)** e um simulador oficial de exames internacionais (**IELTS, TOEFL iBT e Cambridge**).

---

## ⚡ Principais Funcionalidades e Características

### 1. 🔮 Interface "Obsidian Noir & Vibrant Studio Aurora"
* **Paleta:** Fundo preto profundo (`#050507`), cartões ônix (`#0D0D12`), auras luminosas de cores (`card-halo-cyan`, `card-halo-emerald`, `card-halo-purple`, `card-halo-amber`).
* **Living AI Voice Orb:** Orbe de voz fluido e pulsante no topo que reage ao toque e sintetiza voz em tempo real.
* **Tipografia Editorial:** `Plus Jakarta Sans` (UI moderna), `Newsreader` (itálico editorial) e `JetBrains Mono` (fonética IPA, cronômetros e métricas).

### 2. 🧪 Teste de Nivelamento Interativo em 3 Minutos (`/test`)
* **Diagnóstico Progressivo:** 5 questões de complexidade crescente (A1 ao C1) cobrindo gramática, conectivos e phrasal verbs.
* **Avaliação de Fala Oral:** 30 segundos de fala espontânea via microfone com transcrição em tempo real.
* **Diagnóstico Instantâneo:** Cálculo do nível CEFR exato com bônus de +100 XP e calibração automática do perfil.

### 3. 🗣️ Laboratório de Conversação com Streaming Real (`/talk`)
* **Personas:** **Sarah (Londres/Oxford - UK)** e **Marcus (Califórnia - US)**.
* **6 Cenários de Treino:** Bate-papo Livre, Projetos Tech, Entrevista STAR, Daily Standup, Viagem e Debates.
* **Recursos em Tempo Real:** Cronômetro de fala ativa, áudio nativo e botão de resgate *"Esqueci a palavra"*.
* **Relatório CEFR Pós-Sessão:** 5 Notas automáticas, calibração de frases (*você disse vs forma nativa*) e extração de vocabulário para o SRS.

### 4. 🧠 Banco de Vocabulário & Motor SRS SuperMemo-2 (`/vocabulary`)
* **Algoritmo SuperMemo-2 (SM-2):** Intervalos matemáticos dinâmicos (1d, 3d, 7d, 14d, 30d) e fator de facilidade (*Ease Factor*).
* **Flashcards 3D:** Física de giro, áudio nativo e atalhos de teclado (`Space` para girar, `1-4` para avaliar).
* **Criação Manual e Filtros:** Busca instantânea e filtros por nível CEFR (A1 ao C1) e classe gramatical.

### 5. 🗺️ Trilha Estruturada de Aulas CEFR A1 ao C2 (`/learn`)
* **Níveis Cobertos:** A1 (Breakthrough), A2 (Waystage), B1 (Threshold), B2 (Vantage), C1 (Effective Proficiency) e C2 (Mastery).
* **Player Interativo de Lições:** Áudio com transcrição, vocabulário com IPA e exercícios de fixação/ditado com ganho de XP.

### 6. 🎓 Simulador de Certificação Internacional (IELTS / TOEFL)
* Simulado cronometrado oficial de Speaking (Parte 1: Entrevista + Parte 2: Monólogo longo de 90s).
* Emissão de **Certificado Digital de Nível Estimado** e Band Score.

### 7. 🎧 Laboratório de Compreensão Auditiva & Ditado (`/progress`)
* Player de ditado com **velocidade variável (0.75x, 1.0x, 1.25x)** e múltiplos sotaques.
* Verificador de diferenças palavra por palavra com cálculo de acurácia.

### 8. 🔐 Autenticação Mobile-First & Biometria Nativa
* Suporte a **Face ID / Touch ID / Impressão Digital** via padrão **WebAuthn / Passkeys** (`src/lib/biometrics.ts`).
* Login com Google (**OAuth**) e E-mail/Senha com suporte a múltiplos perfis de estudo.

### 9. 🤖 Camada de IA 100% Desacoplada (`src/lib/ai/`)
* Suporte unificado no backend para: **OpenRouter, NVIDIA NIM, OpenAI (GPT-4o), Google Gemini, Anthropic, Ollama e Endpoints Customizados**.
* Rota com **Server-Sent Events (SSE)** em `/api/ai/chat` e teste seguro em `/api/ai/test-connection`.

---

## 🏗️ Estrutura de Diretórios do Projeto

```
english-lab/
├── supabase/
│   └── schema.sql              # Script SQL completo com tabelas, RLS e triggers
├── src/
│   ├── app/
│   │   ├── (auth)/             # Telas de Login e Cadastro (Mobile-First + Biometria)
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/        # Área logada do aluno
│   │   │   ├── dashboard/page.tsx # Painel principal com missão adaptativa e streak
│   │   │   ├── test/page.tsx      # Teste de Nivelamento Interativo em 3 Minutos
│   │   │   ├── learn/page.tsx     # Trilha A1-C2 e Simulador de Exames
│   │   │   ├── talk/page.tsx      # Chat com IA, streaming de voz e relatório CEFR
│   │   │   ├── vocabulary/page.tsx# Banco de palavras e Flashcards 3D (SM-2)
│   │   │   ├── progress/page.tsx  # Radar de 6 competências e Listening Lab
│   │   │   ├── settings/page.tsx  # Configurações de IA, voz e perfil
│   │   │   └── layout.tsx
│   │   ├── api/ai/             # Endpoints backend de IA
│   │   │   ├── chat/route.ts          # Streaming SSE de mensagens
│   │   │   ├── evaluate/route.ts      # Avaliação pedagógica estruturada
│   │   │   └── test-connection/route.ts# Teste seguro de chaves de API
│   │   ├── globals.css         # Design System, Aurora Mesh e Halos de cor
│   │   └── layout.tsx          # Fontes Google (Plus Jakarta Sans, Newsreader, JetBrains)
│   ├── components/
│   │   ├── dashboard/          # MissionCard, EnglishRadar, QuickActions, LevelSwitcher
│   │   ├── learn/              # LessonModal, ExamSimulatorModal
│   │   ├── listening/          # DictationPlayer (Player de Ditado com Diff)
│   │   ├── talk/               # TopicSelector, SessionReportModal
│   │   ├── ui/                 # VoiceOrb, AudioVisualizer, Button, Card, Badge, Tabs
│   │   └── vocabulary/         # FlashcardModal (3D), AddWordModal
│   ├── lib/
│   │   ├── ai/                 # AIRouter, Provedores (OpenAI, Gemini, Anthropic) e Prompts
│   │   ├── audio.ts            # Áudio nativo Web Speech (TTS e STT com múltiplos sotaques)
│   │   ├── biometrics.ts       # Autenticação WebAuthn (Face ID / Touch ID)
│   │   ├── curriculum-data.ts  # Banco de aulas estruturadas do A1 ao C2
│   │   ├── srs.ts              # Algoritmo matemático SuperMemo-2 (SM-2)
│   │   ├── supabase/           # Clientes SSR (Browser, Server e Middleware)
│   │   └── vocabulary-data.ts  # Banco inicial de vocabulário contextual
│   ├── middleware.ts           # Next.js Middleware para autenticação e sessão
│   └── types/                  # Definições TypeScript (CEFR, IA, SRS, Conversas)
├── .env.example                # Modelo de variáveis de ambiente
├── AI_CONTEXT.md               # Contexto master para Agentes de IA
└── PRD_ENGLISH_LAB_PT.md       # Documentação oficial de requisitos do produto
```

---

## 🚀 Como Executar o Projeto Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente (Supabase)
# Crie o arquivo .env.local baseado no .env.example

# 3. Iniciar o servidor de desenvolvimento
npm run dev

# Acesse no navegador: http://localhost:3000
```

---

*English Lab — Your English. Your Pace. Your AI Tutor.*
