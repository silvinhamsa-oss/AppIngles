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

## 🤖 3. Pipeline de Inteligência Artificial & Persistência na Nuvem
* **Provedores Suportados no AI Router:** OpenRouter, NVIDIA NIM, OpenAI, Google Gemini, Anthropic, Ollama Local e Provedores Customizados compatíveis com OpenAI.
* **NVIDIA NIM:** Totalmente integrado com endpoint padrão `https://integrate.api.nvidia.com/v1` e suporte nativo a `meta/llama-3.3-70b-instruct`, `nvidia/llama-3.1-nemotron-70b-instruct`, etc.
* **Persistência de API Keys na Nuvem:**
  - As chaves de API e preferências de IA são salvas e persistidas na tabela `public.profiles` do Supabase (`ai_provider`, `ai_api_key`, `ai_model`, `ai_base_url`, `ai_temperature`, `ai_max_tokens`).
  - Sincronização bidirecional: ao abrir o app em qualquer dispositivo ou após um novo deploy no Vercel/VPS, o app recupera automaticamente as credenciais do usuário do Supabase sem que ele perca suas chaves.
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


