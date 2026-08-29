# PRD — English Lab (Plataforma Completa de Inglês com IA: A1 ao C2 + Preparatório Internacional)

---

## 1. Visão do Produto & Proposta de Valor

O **English Lab** é uma plataforma moderna, viva e orientada à conversação ativa, cobrindo toda a jornada de proficiência do Quadro Comum Europeu de Referência para Línguas (**CEFR A1 ao C2**) e preparação para exames de proficiência internacional (**IELTS, TOEFL iBT e Cambridge C1/C2**).

O foco pedagógico central é **eliminar a tradução mental**, destravar a fala espontânea e construir memória comunicativa de longo prazo através de:
1. **Tutor de IA com Voz Nativa & Streaming** (Sarah UK e Marcus US).
2. **Sistema de Repetição Espaçada (SRS / SuperMemo-2)** com Flashcards 3D.
3. **Trilha Completa de Aulas Estruturadas (A1, A2, B1, B2, C1, C2)** com áudio autêntico, vocabulário ativo e ditado.
4. **Simulador de Certificação Internacional** com cronômetro rígido e critérios oficiais de pontuação.
5. **Arquitetura de IA 100% Desacoplada** (OpenRouter, NVIDIA NIM, OpenAI, Gemini, Anthropic, Ollama e Custom).

---

## 2. Níveis de Proficiência (CEFR A1 ao C2)

| Nível CEFR | Foco Pedagógico & Domínio |
| :--- | :--- |
| **A1 • Breakthrough** | Fundamentos essenciais, saudações, rotina diária, números e pronúncia básica sem bloqueios. *(Ideal para iniciantes e crianças)* |
| **A2 • Waystage** | Passado simples, viagens, compras, pedidos em restaurantes e direções. |
| **B1 / B1+ • Threshold** | Conectivos de transição, narrativa de eventos, opiniões e reuniões de trabalho. *(Superação da tradução mental)* |
| **B2 • Vantage** | Fluência profissional independente, debates, vocabulário técnico e argumentação. |
| **C1 • Effective Proficiency** | Nuances idiomáticas, negociações estratégicas, humor, sarcasmo e discurso flexível sem hesitação. |
| **C2 • Mastery** | Nível quase nativo. Domínio de vocabulário raro, precisão estilística, debates acadêmicos/executivos e discursos sofisticados. |
| 🎓 **Exam Prep & Certificação** | **Simulados reais com cronômetro para IELTS, TOEFL iBT e Cambridge C1/C2**: avaliação automática com critérios oficiais (Recurso Lexical, Coerência, Fluência e Gramática) + Certificado Digital de Nível! |

---

## 3. Pilares da Arquitetura

### 3.1. Frontend & Design System
* **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4.
* **Identidade Visual:** *Obsidian Noir & Vibrant Studio Aurora* com iluminação orgânica viva, halos de cor (`card-halo-*`), Living Voice Orb e tipografia editorial (`Plus Jakarta Sans`, `Newsreader Serif` e `JetBrains Mono`).
* **Áudio:** Web Speech API nativa (TTS / STT) com suporte a múltiplos sotaques.

### 3.2. Camada de IA Desacoplada (AI Router)
* **Padrão Strategy / Provider:** Abstração TypeScript com adaptadores:
  * `OpenAICompatibleProvider` (OpenRouter, NVIDIA NIM, OpenAI, Groq, DeepSeek, Ollama local e Custom).
  * `GeminiProvider` (Google Gemini 1.5/2.0 API).
  * `AnthropicProvider` (Claude 3.5 Sonnet / Haiku).
* **Streaming Real-Time:** Server-Sent Events (SSE) via rota `/api/ai/chat`.
* **Avaliação CEFR:** Rota `/api/ai/evaluate` para relatórios pós-sessão e simulador de exames.

### 3.3. Motor de Repetição Espaçada (SRS / SM-2)
* Algoritmo SuperMemo-2 (`src/lib/srs.ts`) com cálculo dinâmico de intervalos e *Ease Factor*.
* Flashcards 3D com física de giro e atalhos de teclado (`Space`, `1-4`).

---

## 4. Estrutura de Rotas da Plataforma

* `/` — Landing Page Institucional com demonstração de áudio e CTA.
* `/dashboard` — Painel do Aluno: Missão do Dia (com seletor 10m-45m), English Radar, Ofensiva de 7 Dias e Living Voice Orb.
* `/learn` — Trilha Completa de Aulas (A1 ao C2) + Simulador de Certificação Internacional (IELTS / TOEFL).
* `/talk` — Laboratório de Conversação com Sarah UK e Marcus US, Seletor de 6 Cenários, Cronômetro e Relatório de Fluência.
* `/vocabulary` — Banco de Vocabulário Ativo com busca, filtros por CEFR/classe gramatical e Flashcards 3D.
* `/progress` — Diagnóstico de Habilidades (Speaking, Listening, Vocab, Grammar, Reading, Writing).
* `/settings` — Configurações da Camada de IA, chaves de API, parâmetros e teste de conexão seguro.
