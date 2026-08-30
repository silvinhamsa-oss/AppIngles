# English Lab — Technical Memory & Architecture

Este documento consolida a arquitetura, decisões técnicas, regras de segurança, integrações de IA e PWA do repositório.

---

## 🏗️ 1. Arquitetura e Tecnologias
* **Framework:** Next.js 16.3.3 (App Router com Turbopack)
* **Frontend:** React 19.2.8, Tailwind CSS v4, Lucide Icons, Canvas Confetti
* **Autenticação & Banco:** Supabase SSR (`@supabase/ssr`), PostgreSQL com Row Level Security (RLS)
* **PWA:** Service Worker com cache inteligente (`public/sw.js`), Web App Manifest (`src/app/manifest.ts` e `public/manifest.json`), Ícones SVG/PNG 512x512 e 192x192, suporte standalone para Android, iOS e Desktop.
* **IA & Áudio:** Pipeline multi-provedor (Groq LPU, OpenRouter, NVIDIA NIM, OpenAI, Gemini, Anthropic, Ollama), Web Speech API para STT/TTS com feedback acústico.
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

## 🤖 3. Pipeline de Inteligência Artificial & Multi-Provedores

### Provedores Suportados:
1. **⚡ Groq LPU:** Processamento em milissegundos (~800 tokens/s) com `llama-3.3-70b-versatile`, `llama-3.1-70b-versatile`, `llama-3.1-8b-instant`, `mixtral-8x7b-32768` e `gemma2-9b-it`.
2. **NVIDIA NIM:** Totalmente integrado com endpoint `https://integrate.api.nvidia.com/v1`, suporte a `meta/llama-3.1-70b-instruct`, `mistralai/mistral-large-2-instruct`, `deepseek-ai/deepseek-r1`, `qwen/qwen2.5-72b-instruct` e auto-fallback em cascata.
3. **OpenRouter:** Multi-provedor com mais de 100 modelos.
4. **OpenAI, Google Gemini, Anthropic, Ollama Local e Provedores Customizados.**

### Recursos de IA e Gestão de Modelos:
* **Auto-Detecção de Modelos Ativos:** Endpoint `POST /api/ai/models` com `action: "auto-detect"` que realiza pings de latência paralelos e seleciona o melhor modelo liberado na conta do usuário.
* **Fallback em Cascata Server-side:** Se um modelo específico da NVIDIA/Groq responder `404` ou `410`, o servidor automaticamente tenta os modelos de backup estáveis para nunca travar a conversa no chat.
* **Persistência de API Keys no Supabase:** Credenciais e configurações salvas na tabela `public.profiles` (`ai_provider`, `ai_api_key`, `ai_model`, `ai_base_url`, `ai_temperature`, `ai_max_tokens`) e sincronizadas no `localStorage`.

---

## 🎙️ 4. Experiência de Conversação em Áudio (`/talk`)
* **Controle de Mudo / Leitura Silenciosa:** Botão `Audio On` / `Muted` no cabeçalho. Quando em modo mudo, a IA responde apenas por texto (sem fala automática), com possibilidade de ouvir qualquer frase individual clicando no ícone de som do balão.
* **Interrupção Imediata:** Alternar para mudo interrompe o sintetizador de voz (`speechSynthesis.cancel()`) no mesmo milissegundo.
* **Status 100% em Inglês:** Indicadores de carregamento exibem `Sarah is thinking...` ou `Marcus is thinking...` com animação de pontos pulsantes (`animate-pulse`).
* **Reconhecimento de Voz (STT):** Suporte nativo a Web Speech API para gravação contínua e transcrição em tempo real.

---

## 📱 5. Progressive Web App (PWA)
* **Web App Manifest:** `src/app/manifest.ts` e `public/manifest.json` com `display: standalone`, temas de cores `#f59e0b` / `#09090e` e atalhos rápidos de navegação.
* **Service Worker (`public/sw.js`):** Cache-first para fontes e ícones, stale-while-revalidate para UI estática, e network-first para rotas de IA/Supabase.
* **Componente de Instalação (`src/components/pwa/PwaRegister.tsx`):** Captura `beforeinstallprompt` e oferece banner de instalação para Android, iOS e Desktop.
* **Ícones Oficiais:** Ícones vetoriais de estúdio (512x512 maskable, 192x192 e apple-touch-icon).

---

## 🧹 6. Qualidade de Código & Verificação
* **ESLint:** 0 erros e 0 avisos.
* **TypeScript:** Verificação estrita.
* **Build Next.js (Turbopack):** 18 rotas compiladas com sucesso (100% de cobertura).
