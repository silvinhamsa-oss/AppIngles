# 🎙️ English Lab — Studio Voice & AI English Tutor

[![CI Pipeline](https://github.com/welloliver1974/appingles/actions/workflows/ci.yml/badge.svg)](https://github.com/welloliver1974/appingles/actions/workflows/ci.yml)

> **Tutor particular de inglês de alto padrão com conversação imersiva por voz, repetição espaçada (SRS) e aplicativo PWA instalável.**

---

## 🌟 Principais Funcionalidades

### 1. 🤖 Conversação Imersiva com IA (`/talk`)
- **Personas Nativas:** Sarah (Inglês Britânico • UK) e Marcus (Inglês Americano • US).
- **Cenários Guiados & Free Conversation:** Treinos específicos (Tech Standup, Negociações, Viagens, Pedidos) ou conversação livre.
- **Dicionário de Toque no Chat:** Toque em qualquer palavra da fala da IA para ver tradução contextual, fonética IPA, áudio e salvar nos flashcards com 1 clique.
- **Feedback de Pronúncia Fonética (IPA):** Avaliação de 0 a 100% de acurácia fonêmica e ritmo com dicas de fonoaudiólogo/coach.
- **Streaming em Tempo Real:** Respostas com baixa latência e status imersivo em inglês (`Sarah is thinking...`).
- **Controle de Áudio & Mudo:** Alterne com 1 clique entre `Audio On` (com reprodução por voz) e `Muted` (apenas texto/leitura silenciosa).
- **Avaliação Pedagógica Pós-Sessão:** Relatório CEFR completo com métricas de vocabulário, gramática, fluência e correções contextuais.

### 2. 🔍 Busca Global / Command Palette (`Cmd+K`)
- **Atalho Rápido e Botão de Lupa:** Localize qualquer lição do currículo A1-C2, cenário de conversação, rota do app ou palavra do seu vocabulário instantaneamente pelo teclado ou no celular.

### 3. 🏆 Desafio Diário (Daily Challenge) & Gamificação
- **Missão Única Diária por Nível:** Desafios rotativos determinísticos para manter sua ofensiva (*streak*).
- **Recompensas em XP:** Resgate de +50 a +100 XP por dia com persistência no Supabase e celebração com confetti.

### 4. ✍️ Laboratório de Escrita Ativa (`/learn` e `/progress`)
- **Redações Guiadas A1-C1:** Temas do cotidiano e ensaios analíticos profissionais.
- **Avaliação em Tempo Real com IA:** Pontuação CEFR, notas de gramática, vocabulário e coesão baseadas nos critérios de Cambridge/IELTS.
- **Feedback Detalhado:** Correções frase a frase e versão reescrita 100% nativa com salvamento de novos termos nos Flashcards.

### 5. 💾 Portabilidade de Dados & Relatório Oficial CEFR (`/settings`)
- **Backup & Restauração (.JSON):** Baixe e sincronize seu vocabulário, notas e configurações entre aparelhos.
- **Certificado de Diagnóstico CEFR:** Relatório oficial com radar das 6 competências pronto para visualização, impressão e exportação em PDF.

### 6. 🎓 Teste de Nivelamento & Onboarding Inteligente (`/test`)
- **Calibração em 3 Minutos:** Quiz de gramática/vocabulário + 30 segundos de fala espontânea com o microfone.
- **Onboarding Automático:** Novos alunos são guiados para o teste logo após o cadastro para personalizar missões e o tom do tutor de IA.
- **Persistência Instantânea:** O nível CEFR e os +100 XP são salvos no perfil do Supabase.

### 7. 🧠 Vocabulário & Active Recall (`/vocabulary`)
- **Algoritmo SuperMemo-2 (SM-2):** Repetição espaçada baseada na sua facilidade de lembrança.
- **Pronúncia em Áudio:** Ouça a pronúncia nativa de qualquer palavra ou frase com 1 clique.
- **Classificação CEFR:** Cards organizados por níveis (A1, A2, B1, B2, C1, C2).

### 8. ⚡ Multi-Provedores de IA Desacoplados
- **⚡ Groq LPU (Ultra Rápido):** Modelos `llama-3.3-70b-versatile`, `llama-3.1-70b-versatile`, `llama-3.1-8b-instant`, `mixtral-8x7b-32768`.
- **NVIDIA NIM:** `meta/llama-3.1-70b-instruct`, `mistralai/mistral-large-2-instruct`, `deepseek-ai/deepseek-r1`, com auto-detecção em tempo real e fallback de segurança.
- **OpenRouter, OpenAI, Google Gemini, Anthropic Claude, Ollama Local e Provedores Customizados.**
- **Persistência das Chaves:** Suas chaves de API ficam salvas de forma segura no Supabase e não são perdidas após novos deploys.

### 9. 📱 Progressive Web App (PWA), Biometria & Mobile UX
- **Instalação Nativa:** Instale no Android, iPhone/iPad (iOS) ou Computador (Windows/Mac) diretamente do navegador.
- **Autenticação Biométrica:** Login seguro via Face ID / Touch ID / Leitor de Digital (WebAuthn).
- **Modo Standalone & Error Boundaries:** Abre em tela cheia e conta com proteção contra telas brancas em todas as rotas.

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
