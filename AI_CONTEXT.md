# 🤖 AI Agent Onboarding & Architecture Context

> **Este documento é o guia de contexto master para qualquer Agente de IA (Claude, GPT-4o, Gemini, DeepSeek, Cursor, Windsurf, Antigravity) que trabalhe no codebase do English Lab.**

---

## 1. O Que É o English Lab?
O **English Lab** é uma plataforma web para domínio de inglês por meio de **conversação ativa, imersão auditiva e recuperação de memória**, cobrindo do nível **Iniciante (A1)** até a **Maestria (C2)** e simulados de proficiência internacional (**IELTS / TOEFL**).

### 🎯 Princípio Pedagógico Não Negociável
* **Eliminar a tradução mental:** O aluno não deve ficar traduzindo frases do português para o inglês na cabeça. Ele deve construir associações diretas em inglês através de pistas contextuais, repetição espaçada (**SuperMemo-2**) e conversação ativa.

---

## 2. Padrões de Design e Identidade Visual (CRÍTICO)

Qualquer alteração ou novo componente criado DEVE seguir rigorosamente a identidade visual **"Obsidian Noir & Vibrant Studio Aurora"**:

1. **Fundo:** Sempre preto puro e aveludado (`#050507` / `--bg-main`). **NUNCA** usar cinzas lavados ou tons de ardósia opacos (`slate-800/900` como fundo principal).
2. **Cards:** Usar a classe `.studio-card` (`#0D0D12`) com bordas sutis (`rgba(255,255,255,0.08)`).
3. **Halos de Cor Vivos:**
   * 🗣️ Módulos de Conversação: `.card-halo-cyan` (Ciano elétrico & Cobalto).
   * 🧠 Módulos de Vocabulário SRS: `.card-halo-emerald` (Esmeralda Menta).
   * 📚 Trilha de Aulas: `.card-halo-purple` (Púrpura & Magenta).
   * ☀️ Missão do Dia & Destaques: `.card-halo-amber` (Âmbar Solar).
4. **Tipografia:**
   * UI & Textos gerais: `Plus Jakarta Sans` (`font-sans`).
   * Destaques editoriais: `Newsreader Serif` (`font-editorial`).
   * Transcrições fonéticas IPA, timers e métricas: `JetBrains Mono` (`font-mono`).

---

## 3. Arquitetura Técnica & Decisões Chave

### 3.1. Frontend
* **Framework:** Next.js 16 (App Router com Turbopack).
* **Estilização:** Tailwind CSS v4 com tokens CSS customizados em `src/app/globals.css`.
* **Áudio:** Web Speech API nativa em `src/lib/audio.ts` (TTS com sotaques `en-US`, `en-GB`, `en-AU` e STT com reconhecimento contínuo).

### 3.2. Camada de IA Desacoplada (`src/lib/ai/`)
* **Padrão Strategy:** A classe `AIRouter` recebe as requisições e delega para o provedor ativo configurado:
  * `OpenAICompatibleProvider`: atende OpenRouter, NVIDIA NIM, OpenAI, Groq, DeepSeek, Ollama e endpoints customizados.
  * `GeminiProvider`: atende Google Gemini.
  * `AnthropicProvider`: atende Claude.
* **Streaming em Tempo Real:** A rota `/api/ai/chat` entrega Server-Sent Events (SSE) palavra por palavra.
* **Avaliação CEFR:** A rota `/api/ai/evaluate` analisa o histórico da conversa e gera um relatório JSON estruturado com 5 notas e correções de frases.

### 3.3. Banco de Dados & Autenticação (Supabase)
* **PostgreSQL Schema:** Localizado em `supabase/schema.sql`.
* **Row Level Security (RLS):** Ativo em todas as tabelas. Os usuários só acessam seus próprios registros.
* **Autenticação:**
  * E-mail e Senha.
  * Google OAuth.
  * **Biometria Nativa / WebAuthn Passkeys (`src/lib/biometrics.ts`):** Face ID, Touch ID e leitor de impressão digital em celulares e desktops.
* **Sessão:** Mantida via cookies com `@supabase/ssr` em `src/middleware.ts`.

### 3.4. Motor de Vocabulário & Algoritmo SRS (`src/lib/srs.ts`)
* Implementa o **SuperMemo-2 (SM-2)**:
  * Recebe uma avaliação de 1 a 4 (1: *Errei*, 2: *Difícil*, 3: *Bom*, 4: *Fácil*).
  * Recalcula `repetitionCount`, `intervalDays`, `easeFactor` e `nextReviewDate`.

---

## 4. Mapeamento das Rotas da Aplicação

| Rota | Descrição |
| :--- | :--- |
| `/` | Landing page com visualizador de áudio, recursos e CTA. |
| `/login` | Login mobile-first com biometria (Face ID/Touch ID) e e-mail. |
| `/signup` | Cadastro de novo aluno com seleção de nível CEFR inicial (A1 a B2). |
| `/dashboard` | Painel do aluno: Missão do dia (10m-45m), Streak de 7 dias, Living Voice Orb e Radar. |
| `/learn` | Trilha estruturada de aulas (A1 ao C2) + Simulador de Certificação (IELTS/TOEFL). |
| `/talk` | Laboratório de conversação com Sarah UK e Marcus US, 6 cenários e relatório pós-sessão. |
| `/vocabulary` | Banco de vocabulário ativo com busca, filtros por CEFR e Flashcards 3D (SM-2). |
| `/progress` | Diagnóstico de 6 competências (Radar) e Listening Lab com Ditado Diff. |
| `/settings` | Configurações de IA desacoplada, teste de conexão, áudio e perfil. |

---

## 5. Regras para Novas Edições de Código

1. **Nunca quebre o TypeScript (`npm run build` deve sempre sair com código 0).**
2. **Nunca reintroduza fundos cinzas claros ou o estilo genérico de dashboard administrativo.**
3. **Mantenha todos os botões e elementos interativos responsivos para telas de celular (mobile-first).**
4. **Preserve a modularidade da camada de IA:** Chaves de API nunca devem ser expostas no código do cliente.
