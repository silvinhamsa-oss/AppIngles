# English Lab — Roadmap de Sugestões & Ideias

> **Documento vivo** para decisões de produto. Qualquer IA/humano pode ler, entender o contexto e escolher o que implementar.
> Atualizado em: 2025-08-30

---

## 📍 Contexto Atual (O que já existe)

| Módulo | Status | Arquivos-chave |
|--------|--------|----------------|
| **Conversação por Voz (/talk)** | ✅ Completo | `src/app/(dashboard)/talk/page.tsx`, `src/lib/audio.ts` |
| **Vocabulário SRS (SM-2)** | ✅ Completo | `src/lib/srs.ts`, `src/app/(dashboard)/vocabulary/page.tsx` |
| **Teste de Nivelamento CEFR** | ✅ Completo | `src/app/(dashboard)/test/page.tsx` |
| **Trilha de Aulas A1-C2 + Simulados** | ✅ Completo | `src/app/(dashboard)/learn/page.tsx`, `src/lib/curriculum-data.ts` |
| **Escrita Ativa (Writing Lab)** | ✅ **IMPLEMENTADO** | `src/components/learn/WritingModal.tsx`, `learn/page.tsx`, `progress/page.tsx` |
| **Onboarding Inteligente com Nivelamento** | ✅ **IMPLEMENTADO** | `src/app/(auth)/signup/page.tsx`, `src/app/(dashboard)/test/page.tsx` |
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

## 1. Feedback de Pronúncia (Pronunciation Scoring)
**Impacto**: 🔴 **Alto** | **Esforço**: 🟡 **Médio**

**Por que**: Diferencial competitivo mortal. Apps como ELSA Speak, Speechling, BoldVoice cobram $10-30/mês só por isso. Você já tem 80% da infra (STT + TTS + personas).

**Como**:
```
Opção A (Client-side, grátis, limitada):
- Web Audio API → analisar pitch/formants do áudio gravado vs referência
- Arquivos: src/lib/audio.ts (nova fn analyzePronunciation), talk/page.tsx (UI)

Opção B (Server-side, melhor, custo baixo):
- Enviar áudio user + texto referência → Groq Whisper (já em sttProvider) 
- Prompt: "Score 0-100, erros fonêmicos, sugestão"
- Arquivos: src/app/api/ai/pronunciation/route.ts (novo), talk/page.tsx

Opção C (Premium, melhor qualidade):
- ElevenLabs Pronunciation Assessment API / Speechace / Azure Speech
- Requer API key paga
```

**Dependências**: `startSpeechRecognition` já captura áudio; `playPronunciation` gera referência.

**Risco**: Web Speech API não dá acesso ao áudio bruto (só transcript). Opção B precisa `MediaRecorder` + upload.

**Métrica**: % usuários que usam >1x/semana; NPS de "melhorou minha pronúncia".

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

## 4. Export/Import de Dados (Portabilidade)
**Impacto**: 🟡 **Médio** | **Esforço**: 🟢 **Baixo**

**Por que**: Usuários querem backup, migração device, professores exportam progresso de alunos. Diferencial de "dono dos dados".

**Como**:
```
Settings → nova aba "Dados":
- Export: JSON com { vocabulary[], progress[], conversations[], settings, cefr_level, streak }
- Download: english-lab-backup-YYYY-MM-DD.json
- Import: Upload JSON → valida schema → upsert no Supabase + localStorage sync
- Bonus: Export PDF relatório CEFR (usa jsPDF ou server-side)
```

**Arquivos**: Nova tab em `settings/page.tsx`, `src/lib/export-import.ts` (utils), API routes `/api/user/export`, `/api/user/import`.

**Dependências**: RLS no Supabase já garante isolamento por user_id.

**Risco**: Schema migration se mudar estrutura → versionar JSON exportado.

**Métrica**: % usuários que exportam; support tickets "perdi meus dados" → 0.

---

## 5. Modo "Desafio Diário" (Daily Challenge)
**Impacto**: 🟡 **Médio** | **Esforço**: 🟢 **Baixo**

**Por que**: Gamificação leve aumenta retenção. Já tem streak, XP, missions — isso é a "cereja do bolo".

**Como**:
```
- 1 desafio único/dia por nível CEFR (rotaciona: writing, speaking, vocab, listening)
- Ex: "Use 'come up with' em 3 frases diferentes" (B2)
- Completar = +50 XP bonus + badge "Desafiador do Dia"
- Push notification (PWA + service worker já configurado)
- Compartilhamento: canvas confetti → gerar image → share API
```

**Arquivos**: `src/lib/daily-challenge.ts` (novo, gera desafio baseado em nível + data), `src/app/(dashboard)/dashboard/page.tsx` (card no topo), `public/sw.js` (push notification).

**Dependências**: PWA + SW funcionando; `cefr_level` no perfil.

**Risco**: Notificação pode ser chata → opt-in obrigatório.

**Métrica**: % usuários completam desafio/dia; impacto no streak médio.

---

## 6. Busca Global / Command Palette (Cmd+K)
**Impacto**: 🟡 **Médio** | **Esforço**: 🟢 **Baixo**

**Por que**: Power users adoram. Navegação instantânea sem mouse. Já tem atalho no Header (Level badge → /test).

**Como**:
```
- Lib: cmdk ou kbar (React) — leve, acessível
- Sources: rotas (talk, vocab, learn, progress, settings), palavras do vocab do usuário, lições
- Atalho: Cmd/Ctrl + K global
- UI: Modal centralizado, fuzzy search, navegação setas + Enter
```

**Arquivos**: Novo componente `CommandPalette.tsx`, integração em `src/app/(dashboard)/layout.tsx` (provider context).

**Dependências**: Nenhuma crítica.

**Risco**: Baixo. Aditivo.

**Métrica**: % sessões com >1 uso do Cmd+K; tempo para alcançar página-alvo.

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