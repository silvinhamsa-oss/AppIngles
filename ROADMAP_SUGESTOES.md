# English Lab — Roadmap de Sugestões & Ideias

> **Documento vivo** para decisões de produto. Qualquer IA/humano pode ler, entender o contexto e escolher o que implementar.
> Atualizado em: 2025-08-30

---

## 📍 Contexto Atual (O que já existe)

| Módulo | Status | Arquivos-chave |
|--------|--------|----------------|
| **Conversação por Voz (/talk)** | ✅ Completo | `src/app/(dashboard)/talk/page.tsx`, `src/lib/audio.ts` |
| **Feedback de Pronúncia (IPA Scoring)** | ✅ **IMPLEMENTADO** | `src/components/talk/PronunciationFeedbackModal.tsx`, `talk/page.tsx` |
| **Busca Global (Cmd+K Palette)** | ✅ **IMPLEMENTADO** | `src/components/layout/CommandPalette.tsx`, `Header.tsx` |
| **Export/Import & Relatório CEFR** | ✅ **IMPLEMENTADO** | `src/components/settings/FluencyReportModal.tsx`, `settings/page.tsx` |
| **Error Boundaries (Blindagem Global)** | ✅ **IMPLEMENTADO** | `src/app/global-error.tsx`, `src/app/(dashboard)/error.tsx` |
| **Dicionário de Toque no Chat** | ✅ **IMPLEMENTADO** | `src/components/talk/WordLookupModal.tsx`, `talk/page.tsx` |
| **Desafio Diário (Daily Challenge)** | ✅ **IMPLEMENTADO** | `src/lib/daily-challenge.ts`, `dashboard/page.tsx` |
| **Escrita Ativa (Writing Lab)** | ✅ **IMPLEMENTADO** | `src/components/learn/WritingModal.tsx`, `learn/page.tsx`, `progress/page.tsx` |
| **Onboarding Inteligente com Nivelamento** | ✅ **IMPLEMENTADO** | `src/app/(auth)/signup/page.tsx`, `src/app/(dashboard)/test/page.tsx` |
| **Vocabulário SRS (SM-2)** | ✅ Completo | `src/lib/srs.ts`, `src/app/(dashboard)/vocabulary/page.tsx` |
| **Teste de Nivelamento CEFR** | ✅ Completo | `src/app/(dashboard)/test/page.tsx` |
| **Trilha de Aulas A1-C2 + Simulados** | ✅ Completo | `src/app/(dashboard)/learn/page.tsx`, `src/lib/curriculum-data.ts` |
| **Progresso + Radar + Listening Lab** | ✅ Completo | `src/app/(dashboard)/progress/page.tsx` |
| **Configurações IA Multi-Provider** | ✅ Completo | `src/app/(dashboard)/settings/page.tsx`, `src/lib/ai/router.ts` |
| **Seleção de Voz Nativa (Sarah/Marcus)** | ✅ Completo | `src/lib/audio.ts`, `src/app/(dashboard)/settings/page.tsx` |
| **PWA + Mobile UX** | ✅ Completo | `public/sw.js`, `src/components/layout/BottomNav.tsx` |
| **Auth Biométrico + Supabase** | ✅ Completo | `src/lib/biometrics.ts`, `supabase/schema.sql` |

**Stack**: Next.js 16 (App Router), React 19, Tailwind v4, Supabase SSR, Web Speech API

---

## 🎯 Sugestões Priorizadas

### Formato de cada item:
```
### N. Título
**Impacto**: Alto/Médio/Baixo | **Esforço**: Baixo/Médio/Alto
**Por que**: Justificativa estratégica
**Como**: Abordagem técnica sugerida (arquivos a tocar)
**Dependências**: O que precisa existir antes
**Risco**: O que pode dar errado
**Métrica de Sucesso**: Como medir se valeu a pena
```

---

## 1. Feedback de Pronúncia (Pronunciation Scoring) — ✅ CONCLUÍDO
**Impacto**: 🔴 **Alto** | **Esforço**: 🟡 **Médio** | **Status**: ✅ **Implementado**

**Por que**: Avaliação acústica e fonêmica que orienta o aluno a atingir a pronúncia natural e inteligível de nativos.

**O que foi entregue**:
- Componente `PronunciationFeedbackModal.tsx` com motor de avaliação fonética e acurácia de 0 a 100%.
- Análise fonética palavra por palavra com IPA (`/ˈlʊk.ɪŋ/`), feedback específico e dicas fonoaudiológicas/coaching de connected speech.
- Botão "🎯 Pronúncia" e "🎯 Score" integrado diretamente nos balões de fala da IA e do usuário no chat `/talk`.

---

## 2. Escrita Ativa (Writing Practice) — ✅ CONCLUÍDO
**Impacto**: 🔴 **Alto** | **Esforço**: 🟢 **Baixo** | **Status**: ✅ **Implementado**

**Por que**: Completa as 4 habilidades (Listening ✅, Speaking ✅, Reading ✅ via curriculum, Writing ✅). Essencial para preparação para exames IELTS/TOEFL e escrita formal.

**O que foi entregue**:
- Componente `WritingModal.tsx` com temas guiados do A1 ao C1.
- Contador de palavras em tempo real e diretrizes de escrita.
- Avaliação com IA retornando: nota CEFR, pontuação de gramática/vocabulário/coesão, correções frase a frase, versão reescrita 100% nativa e vocabulário extraído pronto para salvar no banco Supabase.
- Integrado nas páginas `/learn` (Trilha de Aulas) e `/progress` (Mapa de Fluência).

---

## 3. Onboarding Inteligente + Placement Test Obrigatório — ✅ CONCLUÍDO
**Impacto**: 🔴 **Alto** | **Esforço**: 🟢 **Baixo** | **Status**: ✅ **Implementado**

**Por que**: Remove o atrito de escolha incorreta de nível no signup e calibra o tutor de IA e as missões no ponto exato desde o primeiro segundo.

**O que foi entregue**:
- Redirect automático pós-cadastro `/signup` para `/test?onboarding=true`.
- Modo Onboarding no `/test` com mensagem acolhedora de boas-vindas e opção de pular direto para o painel caso o aluno prefira.
- Ao concluir o teste rápido (5 questões + 30s de fala), o nível CEFR e os +100 XP são persistidos no perfil Supabase e o aluno é direcionado para o Dashboard calibrado.

---

## 4. Export/Import de Dados & Emissão de Relatório CEFR — ✅ CONCLUÍDO
**Impacto**: 🟡 **Médio** | **Esforço**: 🟢 **Baixo** | **Status**: ✅ **Implementado**

**Por que**: Usuários querem backup, migração entre dispositivos e certificação/comprovação do seu progresso.

**O que foi entregue**:
- Aba "Dados & Relatório CEFR" no `/settings`.
- Exportação de backup completo em JSON (`english-lab-backup-YYYY-MM-DD.json`) contendo vocabulário, perfil, XP e preferências.
- Importação e restauração automática com sincronização imediata no Supabase.
- Modal de Emissão de Relatório Oficial de Diagnóstico CEFR (`FluencyReportModal.tsx`) pronto para impressão e download em PDF com radar das 6 competências.

---

## 5. Modo "Desafio Diário" (Daily Challenge) — ✅ CONCLUÍDO
**Impacto**: 🟡 **Médio** | **Esforço**: 🟢 **Baixo** | **Status**: ✅ **Implementado**

**Por que**: Gamificação leve e diária que aumenta o engajamento e a manutenção da ofensiva (`streak`).

**O que foi entregue**:
- Gerador determinístico de desafio diário por nível CEFR (`src/lib/daily-challenge.ts`).
- Card de destaque na tela principal (`/dashboard`) com detalhes da missão, recompensa em XP e atalho direto para o módulo correspondente.
- Botão de resgate interativo com persistência no Supabase, XP bônus e chuva de confetti.

---

## 6. Busca Global / Command Palette (Cmd+K) — ✅ CONCLUÍDO
**Impacto**: 🟡 **Médio** | **Esforço**: 🟢 **Baixo** | **Status**: ✅ **Implementado**

**Por que**: Navegação instantânea e universal para power users e navegação veloz em celulares.

**O que foi entregue**:
- Componente `CommandPalette.tsx` com atalho global `Cmd+K` / `Ctrl+K` e botão com ícone de lupa no Header desktop e mobile.
- Busca unificada através de rotas do sistema, lições da trilha A1-C2, tópicos de conversação e termos do vocabulário do aluno.
- Navegação fluida por teclado (`↑`, `↓`, `Enter`, `ESC`) e filtros instantâneos.

---

## 7. Teacher/Coach Dashboard (B2B)
**Impacto**: 🔴 **Alto (Receita)** | **Esforço**: 🔴 **Alto**

**Por que**: Mercado B2B (escolas, empresas, professores particulares) paga assinaturas corporativas. Transforma app em plataforma.

**Como**:
```
- Nova role: "teacher" / "coach" no Supabase (auth metadata)
- Dashboard: lista alunos, progresso agregado, CEFR médio, streaks
- Ações: atribuir lição, criar vocab custom, ver relatório detalhado
- Convite: link único → aluno entra → auto-vincula ao teacher
- Billing: Stripe Connect ou plano fixo por professor
```

**Arquivos**: Muitos. Novo schema Supabase, novas rotas `/teacher/*`, novo middleware de auth, Stripe integration.

**Dependências**: Auth roles, RLS policies complexas, Stripe.

**Risco**: Complexidade alta. Validar demanda antes (landing page + waitlist).

**Métrica**: # professores ativos; # alunos por professor; MRR B2B.

---

## 8. Conteúdo Comunitário (User-Generated Content)
**Impacto**: 🟡 **Médio** | **Esforço**: 🟡 **Médio**

**Por que**: Efeito rede. Usuários criam cenários, listas vocab, exercícios → conteúdo infinito grátis.

**Como**:
```
- "Criar Cenário" em /talk: título, descrição, nível, modo, prompt inicial
- "Compartilhar Lista" em /vocabulary: exportar 20 palavras → link público
- Moderação: auto-aprovação se user > nível B2 + 30 dias ativo; senão fila
- Votação: upvote/downvote + denúncia
- Discovery: aba "Comunidade" em /talk e /vocabulary
```

**Arquivos**: Novas tabelas Supabase (`community_scenarios`, `community_vocab_lists`), moderação automática via IA (prompt no `/api/ai/moderate`), UI nova.

**Dependências**: Moderação confiável (spam, conteúdo impróprio).

**Risco**: Qualidade do conteúdo; moderação escala mal sem IA.

**Métrica**: % usuários usam conteúdo comunitário; retenção de quem usa vs não usa.

---

## 9. IA Multi-Agente Especializada (Pipeline)
**Impacto**: 🟡 **Médio (Qualidade)** | **Esforço**: 🟡 **Médio**

**Por que**: Hoje 1 provider faz tudo. Agentes especializados = melhor conversação, melhor avaliação, exercícios personalizados.

**Como**:
```
AIRouter atual → Pipeline:
1. ConversationAgent (Sarah/Marcus) - foco: naturalidade, pedagogia
2. EvaluationAgent (CEFR) - foco: precisão métricas, correções
3. ExerciseGeneratorAgent - foco: criar exercícios personalizados do histórico
4. VocabCuratorAgent - foco: extrair palavras relevantes de conversas reais
- Cada agente = prompt otimizado + provider ideal (ex: EvaluationAgent = GPT-4o/Claude)
- Fallback chain por agente
```

**Arquivos**: `src/lib/ai/router.ts` (refatorar para pipeline), novos providers/agents em `src/lib/ai/agents/`.

**Dependências**: Providers com capacidades diferentes (já tem multi-provider).

**Risco**: Latência (várias chamadas paralelas/sequenciais); custo.

**Métrica**: Qualidade avaliação (correlação com examinador humano); satisfação conversação.

---

## 10. Qualidade de Vida (Quick Wins — 1 dia cada)

| Feature | Esforço | Valor | Arquivos |
|---------|---------|-------|----------|
| Tema "High Contrast" / Dislexia-friendly | 🟢 Baixo | ♿ Acessibilidade | `globals.css`, `ThemeToggle.tsx` |
| Atalhos globais (T=Talk, V=Vocab, L=Learn, P=Progress, S=Settings) | 🟢 Baixo | ⚡ Power users | `src/app/(dashboard)/layout.tsx` (keydown listener) |
| Modo "Focus" (oculta UI, só chat + timer) | 🟢 Baixo | 🧘 Imersão | `talk/page.tsx` (state `focusMode`) |
| Exportar conversa (PDF/Markdown) | 🟢 Baixo | 📄 Revisão offline | `talk/page.tsx`, `jspdf` ou server route |
| Dicionário inline no chat (clique palavra → def + add SRS) | 🟡 Médio | 📚 Vocab contextual | `talk/page.tsx` (popover), `src/lib/dictionary.ts` |
| Revisão espaçada de FRASES (não só palavras) | 🟡 Médio | 🗣️ Fluência | `src/lib/srs.ts` (estender), novo tipo `phrase` |

---

## ⚠️ Dívida Técnica (Fundação)

| Item | Prioridade | Esforço | Por que |
|------|------------|---------|---------|
| **Testes automatizados** (Jest + RTL + Playwright) | 🔴 Crítica | 🟡 Médio | 0% coverage. Qualquer refator quebra silent. |
| **Error Boundaries** por rota | 🔴 Crítica | 🟢 Baixo | Hoje try/catch inline. Crash = tela branca. |
| **Bundle Analyzer** (`next-bundle-analyzer`) | 🟡 Alta | 🟢 Baixo | Lucide (muitos ícones), confetti, SW — pode estar pesado. |
| **TypeScript strict + no `any`** | 🟡 Alta | 🟢 Baixo | `audio.ts` interfaces usam `any` em SpeechRecognition. |
| **CI/CD** (GitHub Actions: lint, typecheck, test, build) | 🟡 Alta | 🟢 Baixo | Evita merge quebrado. |
| **Monitoring** (Sentry / Vercel Analytics) | 🟡 Média | 🟢 Baixo | Erros em produção invisíveis hoje. |

---

## 🗂️ Como Usar Este Documento

### Para decidir o que fazer agora:
1. **Filtre por Impacto × Esforço** → quadrante "Alto Impacto / Baixo Esforço" = faça já
2. **Valide demanda** se esforço > 1 semana (landing page, waitlist, enquete no app)
3. **Uma feature por vez** — não paralelize features grandes
4. **Atualize este doc** ao começar/terminar: mude status, adicione learnings

### Status sugerido para cada item:
- [ ] **Backlog** — ideia, não priorizada
- [ ] **Validando** — pesquisando demanda/viabilidade
- [ ] **Spec** — escrevendo spec técnico (PRD leve)
- [ ] **Em desenvolvimento** — branch aberta
- [ ] **Em review** — PR aberta
- [ ] **Done** — em produção
- [ ] **Cancelado** — não faz sentido agora (registre por que)

---

## 📝 Decisões Registradas (Histórico)

| Data | Decisão | Racional |
|------|---------|----------|
| 2025-08-30 | Implementar seleção de voz nativa (Fase 1) | Zero custo, offline, UX imediata. Fase 2 (ElevenLabs/Whisper) só se houver demanda paga. |
| 2025-08-30 | Melhorar error handling 429 + mensagens específicas | Free tier users travavam sem saber por quê. Reduz support tickets. |
| 2025-08-29 | Corrigir todos os mocks Supabase + proteger rotas | Base sólida para qualquer feature futura. |

---

## 🔗 Links Úteis

- **Repo**: https://github.com/welloliver1974/appingles
- **Deploy**: Vercel (preview em PRs)
- **Supabase Project**: [configurado em .env.local]
- **Docs Next.js 16**: `node_modules/next/dist/docs/`
- **Web Speech API MDN**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

---

> **Próxima ação recomendada**: Escolher **UM** item do quadrante "Alto Impacto / Baixo Esforço" (3, 4, 5 ou 6) e criar branch `feat/nome-da-feature`. Começar pequeno, entregar rápido, medir, iterar.