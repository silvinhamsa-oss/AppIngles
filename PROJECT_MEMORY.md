# English Lab - Technical Memory & Architecture

Este documento consolida a arquitetura, decisões técnicas, regras de segurança e o estado do repositório.

---

## 🏗️ 1. Arquitetura e Tecnologias
* **Framework:** Next.js 16.3.3 (App Router com Turbopack)
* **Frontend:** React 19.2.8, Tailwind CSS v4, Lucide Icons, Canvas Confetti
* **Autenticação & Banco:** Supabase SSR (`@supabase/ssr`), PostgreSQL com RLS
* **IA & Áudio:** Pipeline multi-provedor (OpenRouter, OpenAI, Gemini, Anthropic, Ollama), Web Speech API para STT/TTS com feedback acústico.
* **Algoritmo Pedagógico:** SuperMemo-2 (SM-2) para Spaced Repetition System (SRS).

---

## 🛡️ 2. Camada de Segurança & Roteamento
* **Proxy / Middleware (`src/proxy.ts` & `src/lib/supabase/middleware.ts`):** Roda em conformidade com o Next.js 16 utilizando os métodos modernos `getAll()` e `setAll(cookiesToSet)` do `@supabase/ssr`, garantindo sincronização imediata de cookies em chunks.
* **Proteção de Rotas:** 
  - Rotas protegidas: `/(dashboard)/*` (`/dashboard`, `/talk`, `/learn`, `/vocabulary`, `/progress`, `/settings`, `/test`).
  - Redirecionamento automático: se `supabase.auth.getUser()` retornar nulo, o usuário é direcionado para `/login?next=...`.
  - Se o usuário já estiver logado e visitar `/login` ou `/signup`, é redirecionado para `/dashboard`.
  - Navegação pós-login com `router.push()` + `router.refresh()` forçando a revalidação imediata dos cookies de sessão no servidor.
* **Biometria Segura (`src/lib/biometrics.ts`):** Validação real de token no Supabase após leitura biométrica local.
* **Trigger de Criação de Perfil (`supabase/fix_trigger.sql`):** Função `handle_new_user()` ultra-resiliente com `SECURITY DEFINER`, `search_path = public, auth, pg_temp`, `ON CONFLICT DO UPDATE` e tratamento de exceções para evitar o erro "Database error saving new user".

---

## 🤖 3. Pipeline de Inteligência Artificial
* **Rotas de API:**
  - `POST /api/ai/chat`: Streaming SSE de conversação com cenários e personas.
  - `POST /api/ai/evaluate`: Avaliação pedagógica automática com pontuação CEFR (fluência, vocabulário, gramática, naturalidade e correções).
  - `POST /api/ai/test-connection`: Teste de conectividade e validação de chaves.
* **Contrato Unificado:** Suporta tanto `config` quanto `providerConfig`, com fallback seguro para variáveis de ambiente do servidor.

---

## 🧹 4. Qualidade de Código & Linter
* **ESLint:** 0 erros e 0 avisos.
* **TypeScript:** Verificação estrita sem uso de `any`.
* **Build:** 16 páginas compiladas com Turbopack (Código de saída: 0).

