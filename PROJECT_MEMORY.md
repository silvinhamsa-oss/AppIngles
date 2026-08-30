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
* **Fallback em Cascata Server-side (404, 410 e 429 Rate Limit):** Se um modelo da NVIDIA/Groq responder erro `404/410` (indisponível) ou `429` (limite de taxa do free tier atingido), o servidor salta automaticamente para o próximo modelo estável da lista em tempo real.
* **Extrator Resiliente de JSON (`/api/ai/evaluate`):** Recorta blocos `{ ... }` garantindo 100% de sucesso no parsing do relatório de avaliação CEFR pós-conversa, mesmo com preâmbulos de texto.
* **Persistência de API Keys no Supabase:** Credenciais e configurações salvas na tabela `public.profiles` (`ai_provider`, `ai_api_key`, `ai_model`, `ai_base_url`, `ai_temperature`, `ai_max_tokens`) e sincronizadas no `localStorage`.

---

## 🎙️ 4. Experiência de Conversação em Áudio (`/talk`)
* **Controle de Mudo / Leitura Silenciosa:** Botão `Audio On` / `Muted` no cabeçalho. Quando em modo mudo, a IA responde apenas por texto (sem fala automática), com possibilidade de ouvir qualquer frase individual clicando no ícone de som do balão.
* **Interrupção Imediata:** Alternar para mudo interrompe o sintetizador de voz (`speechSynthesis.cancel()`) no mesmo milissegundo.
* **Status 100% em Inglês:** Indicadores de carregamento exibem `Sarah is thinking...` ou `Marcus is thinking...` com animação de pontos pulsantes (`animate-pulse`).
* **Reconhecimento de Voz (STT):** Suporte nativo a Web Speech API para gravação contínua e transcrição em tempo real.
* **Mensagens de Diagnóstico Inteligentes:** Identificação clara de erros HTTP (401 chave inválida, 402 créditos, 429 limite de taxa, 5xx instabilidade).

---

## 📱 5. Progressive Web App (PWA)
* **Web App Manifest:** `src/app/manifest.ts` e `public/manifest.json` com `display: standalone`, temas de cores `#f59e0b` / `#09090e` e atalhos rápidos de navegação.
* **Service Worker (`public/sw.js`):** Cache-first para fontes e ícones, stale-while-revalidate para UI estática, e network-first para rotas de IA/Supabase.
* **Componente de Instalação (`src/components/pwa/PwaRegister.tsx`):** Captura `beforeinstallprompt` e oferece banner de instalação para Android, iOS e Desktop.
* **Ícones Oficiais:** Ícones vetoriais de estúdio (512x512 maskable, 192x192 e apple-touch-icon).

---

## 🎨 6. Sistema de Temas (Claro / Escuro) & Anti-Flash
* **Persistência de Tema (`ThemeToggle.tsx`):** Armazena preferência no `localStorage` com alternância suave e ícone interativo (Sol ☀️ / Lua 🌙).
* **Script Anti-Flash (`layout.tsx`):** Injeta script síncrono no `<head>` para carregar o tema antes do render, eliminando qualquer flash de tela ao recarregar.
* **Modo Claro Profissional (`globals.css`):** Adaptação completa de headers, sidebars, bottom nav, studio cards, inputs e tipografia.

---

## 📱 7. Experiência Mobile & Responsividade (UI/UX)
* **Barra de Navegação Inferior Simétrica (`BottomNav.tsx`):** Exatamente 5 itens perfeitamente distribuídos (*Início, Aprender, 🎙️ Conversar [Destaque Central Flutuante com Glow], Vocabulário, Progresso*), com tamanho de toque confortável e suporte a safe area (`pb-safe`).
* **Cabeçalho Mobile Otimizado (`Header.tsx`):**
  - Distintivo de estúdio compacto `EL`.
  - Distintivo de nível `🎓 B1+` transformado em **atalho de 1 toque** para o **Teste de Nível (3 min)** (`/test`).
  - Botão de engrenagem ⚙️ (`Settings`) dedicado para acesso rápido a Provedores de IA, Perfil e Voz sem poluir o menu inferior.
  - Eliminação de encavalamento de textos entre nível e ofensiva em telas pequenas.
* **Modal de Tópicos e Projetos (`TopicSelector.tsx`):** Grid responsivo com limitação de altura (`max-h-[85dvh]`) e rolagem vertical suave (`overflow-y-auto`), evitando qualquer estouro de cards em celulares.
* **View Height Dinâmico (`100dvh`):** O chat de conversação com áudio (`/talk`) utiliza `h-[calc(100dvh-8rem)]` para não ser comprimido pelas barras de endereços móveis (Safari iOS e Chrome Android).

---

## 🧹 8. Qualidade de Código & Verificação
* **ESLint:** 0 erros e 0 avisos.
* **TypeScript:** Verificação estrita com `tsc --noEmit` (0 erros).
* **Build Next.js (Turbopack):** 18 rotas compiladas com sucesso (100% de cobertura).

