# 🇧🇷 ENGLISH LAB — PRD V1.0
### Tutor Pessoal de Inglês com IA

**Versão:** 1.0  
**Status:** Especificação para desenvolvimento  
**Plataforma:** Web responsiva / Pronta para PWA (PWA-ready)  
**Usuário inicial:** 1 usuário  
**Nível:** Intermediário — B1/B1+  
**Foco principal:** Conversação (Speaking) + Retenção de Vocabulário  

---

## 1. VISÃO DO PRODUTO

O **English Lab** será uma plataforma pessoal de aprendizagem de inglês utilizando Inteligência Artificial como tutor particular.

O sistema deverá criar uma experiência de estudo personalizada, adaptativa e contínua.

A plataforma **não será apenas um chatbot**.

A IA deverá conhecer o perfil do aluno, acompanhar seu desempenho, identificar dificuldades, conduzir conversações, corrigir erros, revisar vocabulário e adaptar as atividades seguintes.

### Princípio Central
> **"Don't just study English. Use it."** *(Não apenas estude inglês. Use-o.)*  
> O objetivo é fazer o aluno usar o inglês, e não apenas responder exercícios.

---

## 2. PERFIL DO ALUNO

O usuário inicial possui:
* **Nível:** B1/B1+

### Principais Dificuldades
* Conversação (Speaking)
* Lembrar do vocabulário durante a comunicação

### Objetivos
* Falar inglês com maior naturalidade;
* Aumentar a fluência;
* Conseguir recuperar palavras rapidamente na memória;
* Ampliar o vocabulário ativo;
* Melhorar a compreensão auditiva (Listening);
* Reduzir a tradução mental;
* Ganhar confiança;
* Melhorar estruturas gramaticais quando necessário.

---

## 3. PRIORIDADES PEDAGÓGICAS

A plataforma deverá priorizar:

| Habilidade | Prioridade |
| :--- | :--- |
| 🗣️ **Conversação (Speaking)** | Muito alta |
| 🧠 **Recuperação de Vocabulário (Vocabulary Retrieval)** | Muito alta |
| 🎧 **Compreensão Auditiva (Listening)** | Alta |
| 📚 **Gramática (Grammar)** | Média |
| 📖 **Leitura (Reading)** | Média |
| ✍️ **Escrita (Writing)** | Média |

O sistema **não deverá transformar o aprendizado em um curso predominantemente gramatical**.

A Gramática deverá aparecer principalmente quando:
* O aluno cometer erros recorrentes;
* Determinada estrutura for estritamente necessária;
* Uma explicação puder melhorar diretamente a comunicação.

---

## 4. EXPERIÊNCIA DO PRODUTO

### Fluxo Principal
```text
Página Inicial (Landing Page)
             ↓
           Login
             ↓
     Painel (Dashboard)
             ↓
Missão do Dia (Today's Mission)
             ↓
Aula / Conversa / Vocabulário
             ↓
     Feedback / Correção
             ↓
          Progresso
             ↓
           Revisão
```

O usuário deverá conseguir começar uma sessão de estudo rapidamente.

---

## 5. PÁGINA INICIAL (LANDING PAGE)

A página inicial deverá possuir a aparência de um produto SaaS / EdTech premium.

### Seção Principal (Hero)
* **Título Principal (Headline):** `Your English. Your Pace. Your AI Tutor.` *(Seu Inglês. Seu Ritmo. Seu Tutor IA.)*
* **Subtítulo (Subheadline):** `Improve your English by actually using it — speaking, listening, learning vocabulary and having real conversations with an AI tutor that adapts to you.` *(Melhore seu inglês usando-o de verdade — falando, ouvindo, aprendendo vocabulário e tendo conversas reais com um tutor de IA que se adapta a você.)*
* **Chamada para Ação Principal (CTA principal):** `Começar a Aprender` *(Start Learning)*
* **Chamada para Ação Secundária (CTA secundário):** `Fazer Teste de Nível` *(Take the Level Test)*

### Seções
* **Como Funciona (How It Works):**
  * 01 — Fale (Talk)
  * 02 — Aprenda (Learn)
  * 03 — Revise (Review)
  * 04 — Evolua (Improve)
* **Recursos (Features):**
  * Conversação com IA (AI Conversation)
  * Prática de Fala (Speaking Practice)
  * Memória de Vocabulário (Vocabulary Memory)
  * Compreensão Auditiva (Listening)
  * Gramática (Grammar)
  * Aulas Personalizadas (Personalized Lessons)
  * Acompanhamento de Progresso (Progress Tracking)
* **Personalização:**
  * *"Suas aulas se adaptam aos seus erros, interesses e evolução."*
* **Prévia da Plataforma (Dashboard Preview):** Mostrar visualmente a interface da plataforma.
* **Chamada Final (Final CTA):** `Comece sua jornada no inglês.` *(Start your English journey.)*

---

## 6. SISTEMA DE DESIGN (DESIGN SYSTEM)

A interface deverá ser:
* Moderna;
* Premium;
* Elegante;
* Adulta;
* Responsiva;
* Mobile-first (foco inicial no celular);
* Intuitiva;
* Rápida;
* Visualmente rica.

### Tecnologia Visual
* **Tailwind CSS**
* Utilizar componentes modulares reutilizáveis.

### Tema
Suportar:
* Modo Escuro (Dark Mode)
* Modo Claro (Light Mode)
* **Preferência inicial:** Modo Escuro (Dark Mode)

### O Que Evitar
Não utilizar aparência:
* Infantil;
* Excessivamente colorida;
* Escolar;
* Genérica;
* De painel administrativo tradicional.

---

## 7. PAINEL PRINCIPAL (DASHBOARD)

Após o login:

### Cabeçalho (Header)
* Logotipo;
* Ofensiva / Sequência de dias (Streak);
* Pontos de experiência (XP);
* Foto de perfil / Avatar;
* Configurações.

### Saudação
Exemplo:
> *"Bom dia! Pronto para a missão de inglês de hoje?"*  
> *(Good morning! Ready for today's English mission?)*

### Missão do Dia (Today's Mission)
Mostrar:
* Duração;
* Objetivo pedagógico;
* Habilidades trabalhadas;
* Progresso.

**Exemplo Visual:**
```text
┌──────────────────────────────────────────┐
│ MISSÃO DO DIA                            │
│                                          │
│ Fale sobre a sua semana                  │
│                                          │
│ 🗣️ Conversação   🧠 Vocabulário          │
│                                          │
│ 20 minutos                               │
│                                          │
│ [ INICIAR MISSÃO ]                       │
└──────────────────────────────────────────┘
```

### Ações Rápidas (Quick Actions)
* 🗣️ **Conversar com a IA (Talk to AI)**
* 🧠 **Revisar Vocabulário (Review Vocabulary)**
* 🎧 **Compreensão Auditiva (Listening)**
* 📚 **Aula Guiada (Lesson)**

### Cartões de Progresso (Progress Cards)
Mostrar indicadores de desempenho para:
* Conversação (Speaking);
* Vocabulário (Vocabulary);
* Compreensão Auditiva (Listening);
* Gramática (Grammar).

---

## 8. TUTOR DE IA (AI TUTOR)

O Tutor de IA é o núcleo do sistema.

Ele deverá possuir:
* Personalidade consistente e encorajadora;
* Perfil pedagógico adaptativo;
* Memória de aprendizagem contínua;
* Contexto preservado da sessão;
* Histórico de erros do aluno;
* Histórico de vocabulário assimilado e difícil;
* Alinhamento com os objetivos do aluno.

---

## 9. SISTEMA DE PROVEDORES DE IA (AI PROVIDER SYSTEM)

### Requisito Importante
O English Lab **NÃO deverá ficar preso a um único fornecedor de IA**.

Criar uma camada de abstração desacoplada:
`AIProvider`

A aplicação deverá permitir selecionar livremente qual provedor será utilizado em tempo de execução.

---

## 10. PROVEDORES DE IA SUPORTADOS

O sistema deverá permitir a configuração de provedores como:
* OpenRouter
* NVIDIA
* OpenAI
* Google Gemini
* Anthropic
* Ollama
* Outros provedores compatíveis

*A lista de provedores deverá ser facilmente extensível no código.*

---

## 11. TELA DE CONFIGURAÇÃO DO PROVEDOR

Interface: **Configuração de IA (AI Configuration)**

```text
Provedor (Provider)
[ OpenRouter                 ▼ ]

Chave de API (API Key)
[ ********                     ]

Modelo (Model)
[ modelo selecionado         ▼ ]

URL Base (Base URL)
[ opcional                     ]

Temperatura (Temperature)
[ 0.7                          ]

Tokens Máximos (Max Tokens)
[ 2048                         ]

[ Testar Conexão ]
```

---

## 12. PROVEDOR CUSTOMIZADO

Permitir adicionar qualquer endpoint compatível:
* **Tipo de Provedor (Provider Type):** `Compatível com OpenAI (OpenAI Compatible)`
* **Nome do Provedor (Provider Name):** `Meu Provedor`
* **URL Base (Base URL):** `https://...`
* **Chave de API (API Key):** `****`
* **Modelo (Model):** `...`
* `[ Testar Conexão ]`

*Dessa forma, qualquer API compatível poderá ser utilizada sem refatoração.*

---

## 13. ROTEADOR DE IA (AI ROUTER)

Criar internamente o componente **AI Router**, responsável por receber:
* `task` (tarefa/contexto)
* `provider` (provedor)
* `model` (modelo)
* `messages` (histórico de mensagens)
* `parameters` (parâmetros de inferência)

e encaminhar a requisição para o provedor selecionado.

**Exemplos de Fluxo:**
```text
Conversa ➔ AI Router ➔ OpenRouter ➔ Modelo Selecionado
Conversa ➔ AI Router ➔ NVIDIA     ➔ Modelo Selecionado
```

---

## 14. ABSTRAÇÃO DO PROVEDOR DE IA

Criar uma interface em TypeScript semelhante a:

```typescript
interface AIProvider {
  chat(request: ChatRequest): Promise<ChatResponse>
  testConnection(): Promise<boolean>
  listModels?(): Promise<Model[]>
}
```

*Cada conector de provedor implementará obrigatoriamente essa interface.*

---

## 15. SEGURANÇA DAS CHAVES DE API (API KEY SECURITY)

As Chaves de API (API Keys):
* **NUNCA** devem ser expostas no frontend/navegador.
* Devem ser armazenadas de forma segura.
* **Preferencialmente:**
  * Variável de ambiente (`.env`) para configuração global da aplicação; ou
  * Armazenamento criptografado e seguro no backend para configuração por usuário.
* A interface de configuração deverá mascarar os caracteres da chave.
* Nunca registrar Chaves de API em arquivos de log ou console.

---

## 16. MÓDULO DE CONVERSAÇÃO (CONVERSATION)

Área: **Fale com seu Tutor (Talk to Your Tutor)**

### Modos de Conversação:
* **Conversa Livre (Free Conversation):** Bate-papo aberto sem pauta fixa.
* **Conversa Guiada (Guided Conversation):** A IA conduz o assunto com perguntas temáticas.
* **Simulação de Papéis (Role Play):** Simulações de situações práticas da vida real.
* **Entrevista (Interview):** Simulação de entrevista de emprego ou profissional.
* **Debate (Debate):** Discussão estruturada de ideias e pontos de vista.

---

## 17. TEMAS DE CONVERSAÇÃO (CONVERSATION TOPICS)

Criar temas conectados ao cotidiano e aos interesses reais do usuário.

### Exemplos de Temas:
* **Cotidiano (Everyday):** Rotina Diária, Família, Alimentação/Culinária, Hobbies, Fim de Semana, Compras.
* **Viagem (Travel):** Aeroporto, Hotel, Restaurante, Meios de Transporte, Bagagem Extraviada.
* **Tecnologia (Technology):** Inteligência Artificial, Programação, Vibe Coding, Software, Tendências Tecnológicas.
* **Profissional (Professional):** Reuniões de Trabalho, Apresentações, Ambiente Corporativo, Gestão de Projetos.
* **Opiniões e Sociedade (Opinions):** Cinema/Filmes, Impactos da Tecnologia, Sociedade Moderna, O Futuro, Preferências Pessoais.

---

## 18. REGRAS PEDAGÓGICAS DA CONVERSAÇÃO

Durante uma sessão de diálogo:

### A IA deve:
* Incentivar constantemente o usuário a se expressar;
* Manter o fluxo natural do diálogo;
* Fazer perguntas abertas de acompanhamento;
* Adaptar a complexidade do vocabulário ao nível do aluno;
* Reutilizar ativamente o vocabulário em estudo;
* Observar e registrar erros silenciosamente sem travar o diálogo;
* Analisar a fluência e o tempo de resposta.

### A IA não deve:
* Interromper o aluno a todo momento;
* Corrigir cada pequeno erro gramatical pontual durante o diálogo;
* Transformar uma conversa espontânea em uma aula teórica de gramática;
* Enviar respostas excessivamente longas quando uma resposta concisa for suficiente.

---

## 19. RELATÓRIO PÓS-CONVERSA (CORREÇÃO)

Imediatamente após a conclusão da conversa:

### Relatório de Conversação (Conversation Report)
* **Fluência (Fluency):** 78%
* **Vocabulário (Vocabulary):** 71%
* **Gramática (Grammar):** 82%
* **Naturalidade (Naturalness):** 69%
* **Confiança (Confidence):** 84%

### O Que Você Fez Bem (What you did well)
> Exemplo: *"Você comunicou suas ideias com clareza e manteve o fluxo da conversa."*

### O Que Melhorar (What to improve)
* Uso do passado simples (Past tense)
* Verbos frasais (Phrasal verbs)
* Conectivos de frase (Connectors)

---

## 20. CLASSIFICAÇÃO DE ERROS

Classificar os desvios em:
* **Crítico (Critical):** Prejudica a compreensão da mensagem transmitida.
* **Importante (Important):** Erro recorrente ou estrutural de gramática/uso.
* **Leve (Minor):** Pequeno detalhe ou deslize que não impacta a clareza.

> **A IA deverá priorizar:** Erros `Críticos` + `Importantes`

---

## 21. PRÁTICA DE FALA (SPEAKING)

O sistema deverá suportar interação por voz de ponta a ponta.

### Fluxo de Áudio:
```text
Usuário fala
     ↓
Reconhecimento de Fala (Speech-to-Text)
     ↓
Processamento no Tutor de IA
     ↓
Geração da Resposta
     ↓
Síntese de Voz (Text-to-Speech)
     ↓
Usuário escuta
```

---

## 22. DESAFIO DE FALA (SPEAKING CHALLENGE)

Exemplo de desafio diário:
> *"Fale sobre o seu último fim de semana durante 60 segundos."*  
> *(Talk about your last weekend for 60 seconds.)*

Critérios avaliados:
* Fluência (Fluency);
* Riqueza de vocabulário (Vocabulary);
* Correção gramatical (Grammar);
* Pronúncia (quando o recurso for suportado);
* Completude da resposta (Completeness).

---

## 23. MÉTRICAS DE FALA (SPEAKING METRICS)

Exibição visual após o exercício:
* **Fluência:** 82%
* **Vocabulário:** 74%
* **Gramática:** 65%
* **Pronúncia:** 81%
* **Geral (Overall):** 76%

*A pontuação serve estritamente para acompanhar a evolução ao longo do tempo, sem soar punitiva ou como prova escolar.*

---

## 24. RECURSO "ESQUECI A PALAVRA" ("I FORGOT THE WORD")

Criar botão de suporte imediato: **[ Esqueci a palavra / I forgot the word ]**

A IA deverá fornecer pistas conceituais antes de entregar a tradução pronta:

* **IA:** *"It's something you use when you are very tired..."* *(É uma palavra usada quando você está extremamente cansado...)*
* **Usuário:** *"Exhausted?"*
* **IA:** *"Exactly! 🎯"* *(Exatamente!)*

*Objetivo: Treinar o mecanismo cognitivo de recuperação ativa de memória (retrieval).*

---

## 25. MODO "PENSAR EM INGLÊS" (THINK IN ENGLISH)

Modo especial de treinamento: **Think in English**

Durante essa atividade, deve-se evitar a tradução literal direta.

Se o usuário perguntar:
> *"Como fala..."*

A IA responderá guiando a associação direta:
> *"Try to explain it in English."* *(Tente explicar o conceito em inglês.)*

### Objetivo Pedagógico:
Desenvolver o caminho cognitivo:
```text
Ideia ➔ Inglês Direto
```
em vez de:
```text
Ideia ➔ Português ➔ Tradução Mental ➔ Inglês
```

---

## 26. MOTOR DE VOCABULÁRIO (VOCABULARY ENGINE)

Módulo fundamental da plataforma.

### Objetivo:
Mapear e acelerar a transição do vocabulário:
```text
Vocabulário Passivo ➔ Reconhecido ➔ Recuperado ➔ Usado ➔ Vocabulário Ativo
```

---

## 27. BANCO DE VOCABULÁRIO (VOCABULARY BANK)

Cada termo cadastrado armazenará:
* `word` (palavra/expressão em inglês)
* `translation` (tradução em português)
* `definition` (definição simples em inglês)
* `pronunciation` (guia fonético/áudio)
* `part_of_speech` (classe gramatical)
* `example` (frase de exemplo)
* `context` (contexto de aplicação)
* `difficulty` (nível de dificuldade)
* `source` (origem: conversa, aula ou leitura)
* `familiarity` (grau de familiaridade)
* `retrieval_score` (pontuação de recuperação)
* `review_interval` (intervalo de repetição espaçada)
* `last_reviewed` (data da última revisão)
* `next_review` (data da próxima revisão agendada)
* `mistakes` (histórico de falhas de memória)
* `user_sentence` (frase autoral criada pelo aluno)

---

## 28. RECORDAÇÃO ATIVA (ACTIVE RECALL)

O sistema não deve depender apenas de cartões de memorização passivos (flashcards).

### Tipos de Atividades:
* **Recuperação Direta (Recall):** Ex: `"na verdade"` ➔ Resposta esperada: `actually`
* **Preenchimento de Lacunas (Sentence Completion):** `I __ don't think that's a good idea.`
* **Aplicação em Fala (Speaking):** Use `"actually"` em uma frase falada.
* **Construção Contextual (Context):** Criar uma situação real em que o termo seja indispensável.
* **Desafio de Tradução Ativa (Translation Challenge):** Produzir uma frase completa em inglês a partir de uma ideia em português.

---

## 29. EXTRAÇÃO DE VOCABULÁRIO DA CONVERSA

Durante qualquer conversa, a IA identificará termos relevantes utilizados ou que causaram hesitação.

* **Exemplo de Termo:** `exhausted`
* **Prompt do Sistema na Tela:**
  ```text
  Adicionar ao seu banco de vocabulário?
  [ SIM ]  [ AGORA NÃO ]
  ```

---

## 30. ESTADOS DO VOCABULÁRIO (VOCABULARY STATUS)

Cada palavra passará por estágios de maturidade:
* `Novo (New)`
* `Em Aprendizado (Learning)`
* `Em Revisão (Reviewing)`
* `Ativo (Active)`
* `Dominado (Mastered)`
* `Difícil (Difficult)`

---

## 31. REPETIÇÃO ESPAÇADA (SPACED REPETITION - SRS)

### Intervalos Iniciais do Algoritmo:
* 1 dia
* 3 dias
* 7 dias
* 14 dias
* 30 dias
* 60 dias

### Lógica de Ajuste:
* **Acerto na recordação:** ➔ Aumenta o intervalo para a próxima revisão.
* **Erro / Hesitação prolongada:** ➔ Reduz o intervalo para reforço imediato.

*O MVP deve possuir um mecanismo simples, confiável e explicável, permitindo algoritmos mais sofisticados (ex: FSRS/SM-2) no futuro.*

---

## 32. REVISÃO DE MEMÓRIA (MEMORY REVIEW)

Tela: **Revisão de Vocabulário (Vocabulary Review)**

Exemplo de Alerta:
> *"Você tem 12 palavras prontas para revisar hoje."*  
> *(You have 12 words ready for review.)*

Exemplo de Palavras:
* `actually`
* `although`
* `unless`
* `however`
* `exhausted`

*Cada palavra será testada sob ângulos diferentes (recall, lacunas, fala).*

---

## 33. VOCABULÁRIO PESSOAL

Permitir classificar palavras com marcadores rápidos:
* ⭐ Importante (Important)
* 🔥 Difícil (Difficult)
* ❤️ Favorita (Favorite)
* Revisar Mais Tarde (Review Later)

---

## 34. COMPREENSÃO AUDITIVA (LISTENING)

Atividades de áudio curtas e objetivas.

* **Níveis:** B1, B1+, B2
* **Formatos de Exercício:**
  * Compreensão geral do áudio;
  * Múltipla escolha;
  * Preenchimento de lacunas (fill in the blanks);
  * Ditado de frases (dictation);
  * Resumo falado ou escrito da ideia principal.

*A complexidade dos sotaques e velocidade deve aumentar gradualmente.*

---

## 35. GRAMÁTICA ADAPTATIVA (GRAMMAR)

Módulo estritamente adaptativo baseado em lacunas reais.

### Tópicos Iniciais Mapeados:
* Present Simple (Presente Simples)
* Present Continuous (Presente Contínuo)
* Past Simple (Passado Simples)
* Present Perfect (Presente Perfeito)
* Future Forms (Formas de Futuro: Will / Going to)
* Modal Verbs (Verbos Modais: Can, Could, Should, Must)
* Conditionals (Condicionais: Zero, First, Second)
* Articles (Artigos: A, An, The)
* Prepositions (Preposições: In, On, At, By, For)
* Phrasal Verbs (Verbos Frasais frequentes)
* Word Order (Ordem das palavras na oração)
* Question Formation (Construção de perguntas)

*A IA recomendará tópicos gramaticais pontuais com base nos erros recorrentes detectados na fala e escrita.*

---

## 36. LEITURA (READING)

Textos curtos e envolventes. Sempre que possível:
* Conectados aos interesses do usuário;
* Vocabulário moderno e funcional;
* Calibrados para o nível B1/B1+.

### Atividades Pós-Leitura:
* Perguntas de compreensão de texto;
* Extração e salvamento de novos termos;
* Mini-discussão falada sobre a opinião do aluno a respeito do texto.

---

## 37. ESCRITA (WRITING)

### Formatos Práticos:
* Respostas curtas opinativas;
* Mensagens rápidas de bate-papo;
* Descrição de cenários ou acontecimentos;
* Expressão de opiniões pessoais;
* Redação de e-mails profissionais curtos.

### Critérios de Avaliação da IA:
* Correção gramatical;
* Variedade de vocabulário;
* Naturalidade do tom;
* Estrutura e coerência do texto.

---

## 38. MOTOR DE APRENDIZAGEM ADAPTATIVA (ADAPTIVE LEARNING ENGINE)

O sistema deverá orquestrar as recomendações analisando continuamente:
* `user_level` (nível atual estimado)
* `recent_performance` (desempenho nas últimas sessões)
* `weak_skills` (habilidades mais frágeis)
* `vocabulary_retention` (taxa de retenção de vocabulário)
* `speaking_frequency` (tempo dedicado à conversação)
* `grammar_errors` (padrões de erros de gramática)
* `listening_score` (aproveitamento em áudio)
* `study_time` (tempo disponível para o estudo)

**Exemplo de Lógica Aplicada:**
* Cenário: Aluno com `Speaking = fraco`, `Vocabulário = fraco`, `Gramática = boa`
* Próxima sessão sugerida: **Conversação + Vocabulário Prático** (e nunca mais uma aula isolada de regras de gramática).

---

## 39. MISSÃO DIÁRIA (DAILY MISSION)

Gerador de trilha diária adaptada ao tempo disponível.

* **Opções de Duração:** 10 minutos, 20 minutos, 30 minutos ou 45 minutos.

**Exemplo de Estrutura (Sessão de 20 min):**
* 5 min — Revisão Ativa de Vocabulário (Spaced Repetition)
* 7 min — Compreensão Auditiva (Listening)
* 10 min — Conversação Dinâmica com o Tutor IA (Speaking)
* 5 min — Feedback Pedagógico e Correções

---

## 40. SESSÃO RÁPIDA (QUICK SESSION)

Para dias com agenda cheia: **Inglês em 5 Minutos (5-Minute English)**

### Conteúdo Concentrado:
* 3 recordações ativas de palavras pendentes;
* 1 pergunta temática para resposta rápida falada;
* 1 mini-áudio de interpretação;
* Feedback imediato da IA.

---

## 41. TESTE DE DIAGNÓSTICO INICIAL (DIAGNOSTIC TEST)

Aplicado no primeiro acesso do usuário para calibração do modelo:
* **Gramática:** 10 questões rápidas.
* **Vocabulário:** 10 questões de aplicação e contexto.
* **Leitura:** 1 texto curto + 5 perguntas de interpretação.
* **Compreensão Auditiva:** 1 áudio autêntico + 5 perguntas.
* **Escrita:** 1 tarefa curta de redação de e-mail/mensagem.
* **Conversação:** 2 tarefas de fala gravada.

### Resultado Apresentado:
* Nível Geral Consolidado (Overall)
* Diagnóstico individual de Gramática, Vocabulário, Leitura, Áudio, Fala e Escrita.

---

## 42. NIVELAMENTO CEFR

Utilização do Quadro Comum Europeu de Referência para Línguas (CEFR):
* Níveis: A1, A2, B1, B2, C1, C2

O painel sempre indicará com clareza:
* `Nível Estimado: B1+` *(Estimated Level: B1+)*
* `Objetivo em Andamento: Rumo ao B2` *(Working toward B2)*

*Importante: O sistema nunca deverá rebaixar ou alterar o nível global com base no resultado isolado de uma única atividade.*

---

## 43. RADAR DE HABILIDADES (ENGLISH RADAR)

Visualização gráfica em formato de teia/radar com 6 eixos:
* Conversação (Speaking)
* Vocabulário (Vocabulary)
* Compreensão Auditiva (Listening)
* Gramática (Grammar)
* Leitura (Reading)
* Escrita (Writing)

*Permite ao usuário visualizar imediatamente seus pontos fortes e áreas que demandam atenção.*

---

## 44. PAINEL DE PROGRESSO (PROGRESS)

Métricas exibidas em tempo real:
* **Conversação:** Minutos totais falados na semana.
* **Vocabulário:** Quantidade de palavras no status Ativo.
* **Retenção:** Porcentagem de sucesso nas repetições espaçadas.
* **Compreensão Auditiva:** Taxa de acerto nos exercícios.
* **Gramática:** Tópicos que geraram mais correções na semana.
* **Ofensiva (Streak):** Sequência ininterrupta de dias estudados.

---

## 45. GRÁFICOS E VISUALIZAÇÕES

Interface limpa, moderna e discreta.

Exibir:
* Gráfico de evolução semanal;
* Gráfico de evolução mensal;
* Tempo dedicado à fala ao longo das semanas;
* Curva de retenção do vocabulário assimilado;
* Histórico de sessões e missões concluídas.

---

## 46. GAMIFICAÇÃO ORIENTADA A ADULTOS (GAMIFICATION)

Mecanismos de engajamento sem apelo infantil.

### Elementos:
* Pontos de Experiência (XP);
* Sequência diária (Streak);
* Conquistas e Insígnias (Badges);
* Metas de estudo semanais;
* Desafios práticos.

### Exemplos de Conquistas:
* 🏆 Primeira conversa de 10 minutos contínuos
* 🏆 100 palavras ativas consolidadas no vocabulário
* 🏆 7 dias seguidos de estudo (Ofensiva de 7 dias)
* 🏆 Meta semanal batida: 30 minutos de conversa falada

---

## 47. INTERESSES DO USUÁRIO

Durante o processo de cadastro/onboarding, permitir marcar tópicos de interesse:
* Tecnologia (Technology)
* Inteligência Artificial (AI)
* Programação (Programming)
* Viagens (Travel)
* Família (Family)
* Cinema / Filmes (Movies)
* Música (Music)
* Gastronomia / Comida (Food)
* Carreira e Trabalho (Work)
* Vida Cotidiana (Daily Life)

*A IA usará esses temas de preferência para gerar analogias, exercícios e conversas personalizadas.*

---

## 48. PERSONALIZAÇÃO CONTÍNUA PELA IA

O Tutor de IA deverá carregar em seu contexto operacional:
* Nível atual do usuário (User Level)
* Objetivos definidos (Goals)
* Interesses selecionados (Interests)
* Habilidades que precisam de reforço (Weak Skills)
* Banco de vocabulário atual (Vocabulary)
* Erros gramaticais recentes (Grammar Errors)
* Conteúdo das aulas anteriores (Previous Lessons)
* Desempenho registrado nas últimas sessões (Recent Performance)

---

## 49. ARQUITETURA DE MEMÓRIA DA IA (AI MEMORY)

Evitar armazenar transcrições brutas e infinitas. A IA deve manter uma memória estruturada em três camadas:

### 1. Perfil do Usuário (User Profile)
* `level` (nível)
* `goals` (metas)
* `interests` (interesses)
* `preferred_topics` (temas preferidos)
* `study_duration` (tempo de estudo diário desejado)

### 2. Memória Pedagógica (Learning Memory)
* `mastered_vocabulary` (vocabulário dominado)
* `weak_vocabulary` (vocabulário com falhas de recordação)
* `recurring_grammar_errors` (erros gramaticais frequentes)
* `speaking_weaknesses` (dificuldades na fala)
* `listening_weaknesses` (dificuldades auditivas)
* `completed_lessons` (histórico de atividades concluídas)

### 3. Memória de Conversação (Conversation Memory)
* Histórico essencial recente e geração de resumos pedagógicos após cada sessão.

---

## 50. ARQUITETURA DE PROMPTS MODULARES

Não utilizar um prompt gigantesco e monolítico. Criar prompts especializados por função:
* Prompt do Sistema Base (System prompt)
* Prompt de Personalidade do Tutor (Tutor prompt)
* Prompt do Modo Conversação (Conversation prompt)
* Prompt do Motor de Vocabulário (Vocabulary prompt)
* Prompt de Avaliação de Desempenho (Assessment prompt)
* Prompt Gerador de Missões/Aulas (Lesson generator prompt)
* Prompt de Feedback e Correção (Feedback prompt)
* Prompt do Motor Adaptativo (Adaptive learning prompt)

---

## 51. PROMPT BASE DO SISTEMA (SYSTEM PROMPT BASE)

```text
You are an expert English language tutor.

Your primary goal is to help the learner communicate naturally and confidently.

The learner is an intermediate English speaker.

Prioritize:
1. Speaking
2. Vocabulary retrieval
3. Listening
4. Natural communication
5. Grammar when useful

Do not interrupt unnecessarily.
Do not correct every minor mistake.
Encourage the learner to keep speaking.
Use English by default.
Use Portuguese only when a short explanation is genuinely helpful.

Remember the learner's recurring mistakes and vocabulary difficulties.

Whenever appropriate, recycle previously learned vocabulary in new contexts.

Your goal is not merely to teach English.
Your goal is to make the learner USE English.
```

*(Tradução conceitual de referência: "Você é um tutor especialista de língua inglesa. Seu objetivo primordial é ajudar o aluno a se comunicar com naturalidade e confiança. O aluno é de nível intermediário. Priorize: 1. Fala; 2. Recuperação de vocabulário; 3. Compreensão auditiva; 4. Comunicação natural; 5. Gramática quando útil. Não interrompa sem necessidade. Não corrija cada pequeno deslize. Encoraje o aluno a continuar falando. Fale em inglês por padrão. Use português apenas quando uma explicação curta for verdadeiramente necessária. Lembre-se dos erros recorrentes do aluno e de suas dificuldades de vocabulário. Sempre que apropriado, reutilize vocabulário aprendido anteriormente em novos contextos. Seu objetivo não é apenas ensinar inglês: é fazer o aluno USAR o inglês.")*

---

## 52. BANCO DE DADOS (DATABASE)

Utilizar o **Supabase PostgreSQL**.

### Tabelas / Entidades Principais:
* `users` (usuários)
* `user_profiles` (perfis de usuário)
* `learning_profiles` (perfis de aprendizagem e preferências)
* `lessons` (catálogo de aulas)
* `lesson_sessions` (sessões de aula executadas)
* `activities` (atividades práticas)
* `conversation_sessions` (sessões de bate-papo realizadas)
* `conversation_messages` (mensagens trocadas)
* `speaking_attempts` (tentativas e gravações de fala)
* `vocabulary` (dicionário base de palavras)
* `user_vocabulary` (banco de vocabulário individual do aluno)
* `vocabulary_reviews` (histórico das revisões de vocabulário)
* `grammar_topics` (tópicos gramaticais)
* `grammar_errors` (registro de erros do aluno)
* `listening_exercises` (exercícios de áudio)
* `writing_attempts` (produções textuais do aluno)
* `progress_snapshots` (fotografias periódicas de evolução)
* `achievements` (conquistas desbloqueadas)
* `daily_goals` (metas diárias cumpridas)
* `ai_feedback` (relatórios pedagógicos gerados pela IA)
* `ai_providers` (configurações dos provedores de IA)
* `ai_models` (modelos de LLM cadastrados)

---

## 53. MODELAGEM DA TABELA `USER_VOCABULARY`

Campos essenciais:
* `id` (identificador único / UUID)
* `user_id` (referência ao usuário)
* `vocabulary_id` (referência à palavra no catálogo)
* `status` (estado atual: New, Learning, Reviewing, Active, Mastered, Difficult)
* `familiarity_score` (nível de familiaridade)
* `retrieval_score` (facilidade de resgate da memória)
* `ease_score` (fator de facilidade para o cálculo de repetição)
* `times_seen` (quantas vezes a palavra foi visualizada)
* `times_recalled` (quantas vezes foi lembrada corretamente)
* `times_failed` (quantas vezes o aluno errou ou esqueceu)
* `last_reviewed_at` (data/hora da última revisão realizada)
* `next_review_at` (data/hora agendada para a próxima repetição)
* `created_at` (data de criação)
* `updated_at` (data de atualização)

---

## 54. CONFIGURAÇÃO DA TABELA `AI_PROVIDERS`

Modelagem conceitual:
* `id`
* `name` (ex: OpenRouter, OpenAI, Groq, NVIDIA)
* `type` (ex: openai_compatible, gemini, anthropic, ollama)
* `base_url` (URL base da API)
* `is_enabled` (ativo / inativo)
* `created_at`
* `updated_at`

*Importante: Chaves de API (API Keys) devem ser armazenadas com criptografia no backend ou em variáveis de ambiente, nunca expostas em texto puro para o navegador.*

---

## 55. ARQUITETURA DO SISTEMA

```text
                   ENGLISH LAB
                        │
             ┌──────────▼──────────┐
             │       Vercel        │
             │                     │
             │ Next.js             │
             │ React               │
             │ TypeScript          │
             │ Tailwind CSS        │
             └──────────┬──────────┘
                        │
             ┌──────────▼──────────┐
             │      Supabase       │
             │                     │
             │ PostgreSQL          │
             │ Auth                │
             │ Storage             │
             │ RLS                 │
             └─────────────────────┘
                        │
                    AI Router
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    OpenRouter       NVIDIA         Outros
         │              │              │
      Model A        Model B        Model C
```

---

## 56. STACK TECNOLÓGICA CONSOLIDADA

* **Frontend / Aplicação:** Next.js (App Router), React, TypeScript
* **Estilização:** Tailwind CSS
* **Banco de Dados:** Supabase PostgreSQL
* **Autenticação:** Supabase Auth
* **Armazenamento de Arquivos:** Supabase Storage (quando necessário para áudios)
* **Hospedagem / Deploy:** Vercel
* **Inteligência Artificial:** Provedor desacoplado e configurável
* **Servidor VPS:** Não utilizar na V1

---

## 57. JUSTIFICATIVA: POR QUE NÃO UTILIZAR O VPS NA V1

O servidor VPS existente não será necessário nesta primeira versão.

### Motivos:
* Reduzir drásticamente a complexidade operacional;
* Eliminar a sobrecarga de manutenção de infraestrutura;
* Simplificar o processo de deploy contínuo (CI/CD via Vercel);
* Evitar custos e configurações desnecessárias de servidores;
* Tirar máximo proveito da arquitetura gerenciada Serverless da Vercel + Supabase;
* Manter foco 100% no desenvolvimento do produto e na experiência do usuário.

*O VPS poderá permanecer dedicado a outros projetos e utilidades pessoais.*

---

## 58. PROVEDORES DE VOZ (VOICE PROVIDERS)

Criar contratos/interfaces desacopladas:
* `SpeechToTextProvider` (STT — Fala para Texto)
* `TextToSpeechProvider` (TTS — Texto para Fala)

*Dessa forma, motores de áudio (como Whisper, ElevenLabs, Web Speech API nativa ou outros) poderão ser trocados sem alterar o restante da aplicação.*

---

## 59. INDEPENDÊNCIA DOS PROVEDORES

A arquitetura deverá garantir que a escolha de IA de texto e o provedor de voz sejam 100% independentes entre si.

**Exemplo de Configuração Ativa:**
* **IA de Texto:** `OpenRouter`
* **Reconhecimento de Fala (STT):** `Provedor A`
* **Síntese de Fala (TTS):** `Provedor B`

---

## 60. RESPONSIVIDADE E DISPOSITIVOS

A interface deverá funcionar com total fluidez em:
* Smartphones (Android / iOS);
* Tablets;
* Notebooks;
* Desktops com monitores amplos.

> **Prioridade de Engenharia:** Mobile-first (desenvolver primeiro para celular).

---

## 61. NAVEGAÇÃO NO CELULAR (MOBILE NAVIGATION)

Barra inferior fixa de navegação rápida (Bottom Navigation):
* Início (Home)
* Aprender (Learn)
* Conversar (Talk)
* Vocabulário (Vocabulary)
* Progresso (Progress)

---

## 62. NAVEGAÇÃO NO COMPUTADOR (DESKTOP NAVIGATION)

Menu lateral fixo (Sidebar):
* 🏠 **Início (Home)**
* 📚 **Aprender (Learn)**
* 🗣️ **Conversar (Talk)**
* 🧠 **Vocabulário (Vocabulary)**
* 📊 **Progresso (Progress)**
* ────────────
* ⚙️ **Configurações (Settings)**

---

## 63. PAINEL DE CONFIGURAÇÕES (SETTINGS)

Áreas de ajuste do sistema:
* **Perfil (Profile):** Nome, nível atual, objetivos principais, temas de interesse.
* **Estudo (Learning):** Duração padrão da missão diária, frequência de estudo, foco prioritário.
* **IA (AI Configuration):** Provedor ativo, Chave de API, modelo selecionado, URL Base, parâmetros de temperatura e tokens.
* **Voz (Voice):** Provedor de STT, provedor de TTS, seleção de voz sintética, velocidade de fala.
* **Aparência (Appearance):** Alternador entre Modo Escuro (Dark) e Modo Claro (Light).

---

## 64. TESTE DE CONEXÃO (TEST CONNECTION)

Na tela de configuração de IA:
Botão de validação: `[ Testar Conexão ]`

### Mensagens de Retorno:
* **Sucesso (Success):** `Conexão realizada com sucesso.` *(Connection successful.)*
* **Erro (Error):** `Não foi possível conectar. Verifique o provedor, a chave de API e o modelo.` *(Unable to connect. Check provider, API key and model.)*

*Regra rígida de segurança: Nunca exibir a Chave de API ou detalhes sensíveis dentro do texto da mensagem de erro.*

---

## 65. MONITORAMENTO DE CUSTOS DE IA

Registrar o consumo de inferência sempre que os cabeçalhos da API permitirem:
* `provider` (provedor acionado)
* `model` (modelo utilizado)
* `tokens_input` (tokens de entrada/prompt)
* `tokens_output` (tokens de saída/gerados)
* `estimated_cost` (custo estimado da chamada)
* `request_type` (tipo de requisição: chat, vocabulário, correção)
* `created_at` (data e hora da chamada)

*O banco já deverá ficar preparado na V1 para receber esses dados, permitindo a criação de um painel financeiro de consumo no futuro.*

---

## 66. REQUISITOS DE SEGURANÇA

Implementar rigorosamente:
* Autenticação via Supabase Auth;
* Políticas de Segurança por Linha no Banco de Dados (Row Level Security - RLS);
* Sanitização e validação de todos os dados de entrada (inputs);
* Camada de autorização para proteção das rotas de API no Next.js;
* Mecanismo de Rate Limiting para evitar abusos acidentais;
* Segredos e chaves de API restritos exclusivamente ao ambiente de backend;
* Nenhuma chave de API vazada no código JavaScript do frontend;
* Registros de log higienizados e livres de credenciais.

---

## 67. PRIVACIDADE DE DADOS

O conteúdo pedagógico e as conversas pertencem exclusivamente ao usuário.

Permitir, a qualquer momento, a exclusão sob demanda de:
* Histórico de conversas;
* Banco de vocabulário;
* Registros de progresso;
* Conta de usuário completa com remoção de todos os dados vinculados.

---

## 68. PAINEL ADMINISTRATIVO (ADMIN)

Como a plataforma terá inicialmente um único usuário:
* O painel administrativo deve ser simples e objetivo.

Permitir de forma prática:
* Visualizar métricas globais de progresso;
* Ajustar manualmente o nível do aluno (ex: B1 para B2);
* Consultar e editar a base de vocabulário;
* Criar ou editar aulas e missões pré-programadas;
* Visualizar o histórico completo de sessões;
* Alterar parâmetros operacionais da IA.

---

## 69. CONTEÚDO BASE INICIAL (SEED CONTENT)

### 10 Temas Estruturados para o MVP:
1. Rotina Diária (Daily Routine)
2. Família e Relacionamentos (Family)
3. Trabalho e Projetos (Work)
4. Tecnologia em Geral (Technology)
5. Inteligência Artificial (AI)
6. Viagens e Férias (Travel)
7. Culinária e Restaurantes (Food)
8. Hobbies e Lazer (Hobbies)
9. Opiniões e Debates (Opinions)
10. Planos e Sonhos Futuros (Future Plans)

### Banco Base de Vocabulário:
Cadastrar uma carga inicial de **pelo menos 100 palavras e expressões no nível B1/B1+**.

Critérios de seleção:
* Alta frequência no inglês falado real;
* Grande utilidade para conversação;
* Verbos frasais (Phrasal verbs) comuns;
* Conectivos de discurso e transição (Connectors);
* Expressões idiomáticas e naturais do dia a dia.

---

## 70. ESCOPO DO MVP (PRODUTO MÍNIMO VIÁVEL)

A primeira versão funcional deverá conter:

### Itens Obrigatórios:
* Página Inicial (Landing Page);
* Sistema de Autenticação completo;
* Fluxo de Integração / Diagnóstico Inicial (Onboarding);
* Painel Principal (Dashboard);
* Tutor de IA operacional;
* Conversação funcional por texto;
* Banco de Vocabulário com busca e filtros;
* Mecanismos de Recordação Ativa (Active Recall);
* Sistema de Repetição Espaçada (Spaced Repetition);
* Acompanhamento de Progresso e Estatísticas;
* Tela de Configuração de Provedores de IA.

### Itens de Alta Prioridade (conforme estabilidade):
* Conversação por voz (Speaking sessions);
* Reconhecimento de Fala (STT);
* Síntese de Fala (TTS).

---

## 71. ROTEIRO DE FASES DO DESENVOLVIMENTO (MVP)

* **Fase 1 — Fundação (Foundation):** Criação do projeto Next.js, configuração do Tailwind CSS, integração com Supabase, Auth, layout base responsivo e componentes do Design System.
* **Fase 2 — Painel (Dashboard):** Implementação da interface do Dashboard, perfil do aluno, painel de progresso e componente da Missão do Dia.
* **Fase 3 — Camada de IA (AI Engine):** Construção do AI Router, sistema de provedores compatíveis com OpenAI, tela de configuração, teste de conexão e System Prompt do AI Tutor.
* **Fase 4 — Módulo de Conversação (Conversation):** Chat de conversação por texto, seleção de modos, relatórios de feedback e histórico de conversas.
* **Fase 5 — Módulo de Vocabulário (Vocabulary):** Banco de vocabulário, rotinas de recordação ativa, tela de revisão e motor de repetição espaçada.
* **Fase 6 — Diagnóstico (Diagnostic):** Teste inicial de nivelamento, avaliação de habilidades e montagem do perfil pedagógico.
* **Fase 7 — Módulo de Voz (Voice):** Integração com APIs de STT (reconhecimento) e TTS (fala), permitindo sessões de conversação por voz.

---

## 72. REGRA DE DESENVOLVIMENTO INCREMENTAL

**Proibido tentar desenvolver todas as fases de uma única vez.**

O fluxo de trabalho com a IA de programação deve ser rigoroso:
1. Analisar os requisitos específicos da fase atual do PRD;
2. Apresentar um resumo breve do plano de implementação;
3. Escrever o código exclusivamente para a fase em andamento;
4. Executar os testes locais;
5. Validar a tipagem do TypeScript;
6. Executar o linter e build do projeto;
7. Verificar o comportamento responsivo no mobile e desktop;
8. Reportar claramente o que foi concluído;
9. **Parar e aguardar aprovação humana** antes de seguir para a próxima fase.

---

## 73. DEFINIÇÃO DE CONCLUÍDO (DEFINITION OF DONE - DoD)

Uma funcionalidade somente será considerada entregue quando:
* Estiver 100% funcional sem erros aparentes;
* Estiver salvando e persistindo dados corretamente no Supabase;
* Estiver totalmente responsiva e agradável no smartphone (mobile-first);
* Possuir estado visual de carregamento (loading state);
* Possuir estado visual de tela vazia (empty state);
* Possuir tratamento e estado visual de erro amigável (error state);
* Oferecer feedback visual claro em todas as ações do usuário;
* Não apresentar nenhum erro de tipagem no TypeScript;
* Compilar perfeitamente no build de produção (`next build`);
* Não possuir nenhuma credencial ou chave de API exposta;
* O fluxo principal tiver sido manualmente testado e validado.

---

## 74. PROMPT MESTRE PARA CODIFICAÇÃO (VIBE CODING)

```text
You are a senior full-stack engineer, product designer and AI learning-platform architect.

You are building ENGLISH LAB, a personal AI-powered English learning platform.

Read and follow the complete PRD before writing code.

IMPORTANT:

Do not build the entire application in one step.

Work incrementally.

For each development phase:

1. Analyze the requirements.
2. Explain the implementation plan briefly.
3. Implement only the current phase.
4. Run tests.
5. Check TypeScript.
6. Check lint.
7. Check build.
8. Verify responsive behavior.
9. Report what was implemented.
10. Stop and wait for approval.

PRODUCT GOAL:

The learner is an intermediate English speaker.

The two main difficulties are:

1. Speaking/conversation.
2. Remembering and actively retrieving vocabulary.

Therefore prioritize:

- speaking;
- conversation;
- active recall;
- spaced repetition;
- vocabulary recycling;
- listening;
- natural communication.

Do not build a generic chatbot.

Build a personalized AI tutor.

TECHNOLOGY:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage when required
- Vercel

Do NOT use the VPS for the V1.

AI ARCHITECTURE:

The application MUST NOT be tied to one AI provider.

Implement an AI Provider abstraction.

Support:

- OpenRouter
- NVIDIA
- OpenAI
- Google Gemini
- Anthropic
- Ollama
- OpenAI-compatible providers
- custom providers

The user must be able to configure:

- provider;
- API key;
- model;
- base URL when applicable;
- temperature;
- max tokens.

API keys MUST NEVER be exposed to the browser.

Create an AI Router responsible for selecting and calling the configured provider.

VOICE:

Create provider abstractions for:

SpeechToTextProvider
TextToSpeechProvider

The providers must be replaceable.

PEDAGOGY:

The learner is B1/B1+.

Priority:

1. Speaking
2. Vocabulary Retrieval
3. Listening
4. Grammar
5. Reading
6. Writing

Do not interrupt the learner constantly during conversation.

Do not correct every minor error.

Focus on communication.

Track recurring errors.

Recycle vocabulary.

Encourage spontaneous English production.

Use English by default.

Use Portuguese only when genuinely useful for explanation.

VOCABULARY:

The system must distinguish between:

Passive Vocabulary
and
Active Vocabulary.

Use:

- active recall;
- spaced repetition;
- sentence production;
- contextual practice;
- vocabulary recycling.

The goal is to make the learner retrieve and use words during real communication.

UI/UX:

Create a premium, modern, adult interface.

Use Tailwind CSS.

Mobile first.

Support dark and light themes.

Do not create a generic admin dashboard.

Use:

- animations;
- microinteractions;
- clear hierarchy;
- beautiful typography;
- responsive layouts;
- loading states;
- empty states;
- error states.

SECURITY:

- use Supabase RLS;
- validate input;
- protect APIs;
- never expose secrets;
- never log API keys;
- use environment variables for server secrets.

DEVELOPMENT RULE:

Do not invent requirements.

Do not silently skip requirements.

Do not claim a feature works if it has not been tested.

Do not move to the next phase without approval.

START WITH PHASE 1 ONLY.
```

---

## 75. VISÃO DE LONGO PRAZO DO PRODUTO

O English Lab deverá chegar ao patamar de maturidade onde o usuário poderá simplesmente abrir o aplicativo e afirmar:
> *"Tenho 20 minutos disponíveis hoje."*  
> *(I have 20 minutes.)*

E o sistema responderá instantaneamente:
> *"Perfeito. Eu sei exatamente o que você deve praticar agora."*  
> *(Perfect. I know exactly what you should practice today.)*

A sessão diária será automaticamente sintetizada com base em:
* Nível atual do aluno;
* Histórico acumulado de desempenho;
* Vocabulário que está entrando na janela de esquecimento;
* Padrões de erros identificados;
* Minutos de fala pendentes na semana;
* Desempenho nas tarefas de compreensão auditiva;
* Temas de interesse pessoal;
* Dados das últimas sessões realizadas.

O objetivo do produto não é apenas preencher formulários ou acumular aulas concluídas.  
O objetivo principal é:
> **"Fazer o inglês se tornar parte do seu pensamento e da sua comunicação espontânea."**  
> *(Make English part of your thinking and communication.)*

---

## 76. FRASE E ASSINATURA DO PRODUTO

```text
ENGLISH LAB
Seu Inglês. Seu Ritmo. Seu Tutor IA.
(Your English. Your Pace. Your AI Tutor.)

Não apenas estude inglês. Use-o.
(Don't just study English. Use it.)
```

---
*Fim da especificação oficial do PRD V1.0 traduzida em Português.*
