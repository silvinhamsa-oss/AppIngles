# 🎙️ English Lab — Studio Voice & AI English Tutor

> **Tutor particular de inglês de alto padrão com conversação imersiva por voz, repetição espaçada (SRS) e aplicativo PWA instalável.**

---

## 🌟 Principais Funcionalidades

### 1. 🤖 Conversação Imersiva com IA (`/talk`)
- **Personas Nativas:** Sarah (Inglês Britânico • UK) e Marcus (Inglês Americano • US).
- **Cenários Guiados & Free Conversation:** Treinos específicos (Tech Standup, Negociações, Viagens, Pedidos) ou conversação livre.
- **Streaming em Tempo Real:** Respostas com baixa latência e status imersivo em inglês (`Sarah is thinking...`).
- **Controle de Áudio & Mudo:** Alterne com 1 clique entre `Audio On` (com reprodução por voz) e `Muted` (apenas texto/leitura silenciosa).
- **Avaliação Pedagógica Pós-Sessão:** Relatório CEFR completo com métricas de vocabulário, gramática, fluência e correções contextuais.

### 2. ⚡ Multi-Provedores de IA
- **⚡ Groq LPU (Ultra Rápido):** Modelos `llama-3.3-70b-versatile`, `llama-3.1-70b-versatile`, `llama-3.1-8b-instant`, `mixtral-8x7b-32768`.
- **NVIDIA NIM:** `meta/llama-3.1-70b-instruct`, `mistralai/mistral-large-2-instruct`, `deepseek-ai/deepseek-r1`, com auto-detecção em tempo real e fallback de segurança.
- **OpenRouter, OpenAI, Google Gemini, Anthropic Claude, Ollama Local e Provedores Customizados.**
- **Persistência das Chaves:** Suas chaves de API ficam salvas de forma segura no Supabase e não são perdidas após novos deploys.

### 3. 🧠 Vocabulário & Active Recall (`/vocabulary`)
- **Algoritmo SuperMemo-2 (SM-2):** Repetição espaçada baseada na sua facilidade de lembrança.
- **Pronúncia em Áudio:** Ouça a pronúncia nativa de qualquer palavra ou frase com 1 clique.
- **Classificação CEFR:** Cards organizados por níveis (A1, A2, B1, B2, C1, C2).

### 4. 📱 Progressive Web App (PWA) & Mobile UX
- **Instalação Nativa:** Instale no Android, iPhone/iPad (iOS) ou Computador (Windows/Mac) diretamente do navegador.
- **Modo Standalone:** Abre sem a barra de navegação do browser, com ícones oficiais e tela cheia.
- **Menu Inferior Mobile Adaptativo:** Barra inferior com 6 abas essenciais (*Início, Aprender, Conversar flutuante central, Vocab, Progresso e Ajustes*), suporte a safe-area de iPhones e micro-animações de toque.
- **Modais e Chat com Rolagem Fluida:** Seletores de cenários e visualizador de mensagens otimizados com `100dvh` para telas de celulares.
- **Service Worker & Cache Offline:** Carregamento instantâneo de assets estáticos e funcionamento offline para revisão.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** Next.js 16.3.3 (App Router com Turbopack)
- **UI:** React 19, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Backend & Auth:** Supabase SSR (`@supabase/ssr`), PostgreSQL com Row Level Security (RLS)
- **Voz & Áudio:** Web Speech API (SpeechRecognition & SpeechSynthesis)
- **PWA:** Service Worker (`public/sw.js`), Web App Manifest (`public/manifest.json` e `src/app/manifest.ts`)

---

## 🚀 Como Executar o Projeto

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis no .env.local
NEXT_PUBLIC_SUPABASE_URL=seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon

# 3. Rodar em desenvolvimento
npm run dev

# 4. Build de produção
npm run build
```

---

## 📄 Licença
Distribuído sob a licença MIT. Desenvolvido para máxima fluência e performance.
