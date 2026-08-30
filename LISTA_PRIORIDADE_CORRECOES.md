# English Lab - Lista de Correções por Prioridade

Este documento descreve os problemas encontrados durante a revisão de código, priorizados por gravidade, juntamente com as correções recomendadas.

## 🔴 Problemas Críticos
*Problemas que representam riscos de segurança, quebram funcionalidades essenciais ou devem ser corrigidos antes de qualquer implantação em produção.*

1. **Email de Fallback Biométrico Hardcoded**
   - **Arquivo**: `src/lib/biometrics.ts:92`
   - **Problema**: A função `authenticateWithBiometrics` possui um email de fallback hardcoded `welld@example.com` no bloco `catch`, causando que a autenticação biométrica seja considerada bem-sucedida mesmo quando falha.
   - **Correção**: Remover o fallback hardcoded. Em caso de falha biométrica, retornar `{ success: false, message: err.message || "Falha na verificação biométrica." }` sem simular sucesso.

2. **Login Mock Aceitando Qualquer Credencial**
   - **Arquivo**: `src/app/(auth)/login/page.tsx:48-52`
   - **Problema**: A página de login aceita qualquer email/senha se o Supabase retornar um erro (por exemplo, chave de API inválida), permitindo acesso não autorizado.
   - **Correção**: Remover o fallback mock. Permitir login apenas via credenciais legítimas do Supabase. Mostrar mensagens de erro genuínas ao usuário.

3. **Respostas Mock da IA Sem Chave de API**
   - **Arquivo**: `src/app/api/ai/chat/route.ts:43-60`
   - **Problema**: Quando nenhuma chave de API de IA está configurada, o endpoint de chat retorna respostas mock aleatórias em vez de indicar a configuração incorreta.
   - **Correção**: Retornar um erro claro (por exemplo, 500) quando nenhum provedor de IA estiver configurado, instruindo o usuário a configurar as credenciais de IA em Configurações. Não simular respostas de IA.

4. **Relatório de Avaliação Mock**
   - **Arquivo**: `src/app/api/ai/evaluate/route.ts:21-72`
   - **Problema**: O endpoint de avaliação retorna um relatório mock estático independentemente do conteúdo da conversa.
   - **Correção**: Retornar um erro claro quando nenhuma chave de API de IA estiver configurada. Usar apenas o provedor de IA para avaliações genuínas.

5. **Configuração Incorreta do Teste de Conexão para Ollama**
   - **Arquivo**: `src/app/api/ai/test-connection/route.ts:17-22`
   - **Problema**: O endpoint de teste de conexão retorna `success: false` quando nenhuma chave de API é fornecida, mas o Ollama não requer chave de API.
   - **Correção**: Ajustar a condição para permitir testar o Ollama sem chave de API: `if (!config.apiKey && config.provider !== "ollama")`.

6. **Valores Mock Hardcoded do Supabase**
   - **Arquivos**: 
     - `src/lib/supabase/client.ts:4-5`
     - `src/lib/supabase/server.ts:7-8`
   - **Problema**: As funções de cliente e servidor do Supabase usam valores mock hardcoded (`https://example.supabase.co`, JWT falso) em vez de variáveis de ambiente.
   - **Correção**: Garantir que as funções usem estritamente `process.env.NEXT_PUBLIC_SUPABASE_URL` e `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`. Se estas estiverem faltando, lançar um erro durante a inicialização (não fazer fallback para mocks).

## 🟠 Problemas de Alta Gravidade
*Problemas que afetam arquitetura, integridade de dados ou manutenibilidade que devem ser abordados na próxima sprint.*

7. **Configuração de IA Armazenada no localStorage (Risco de Segurança)**
   - **Arquivos**: 
     - `src/app/(dashboard)/talk/page.tsx:159-173` (busca do localStorage)
     - `src/app/(dashboard)/settings/page.tsx:35-47` (salva no localStorage)
   - **Problema**: A configuração do provedor de IA (incluindo chaves de API) é armazenada no localStorage do navegador, exposta a ataques XSS.
   - **Correção**: Mover a configuração de IA para o Supabase (por exemplo, criptografada em uma tabela `user_ai_config` ou adicionada à tabela `profiles`). Buscar as configurações via chamada autenticada ao Supabase ao carregar o aplicativo.

8. **Teste de Conexão da IA desperdiça Tokens**
   - **Arquivo**: `src/lib/ai/providers/openai-compatible.ts:130-150`
   - **Problema**: O método `testConnection` faz uma chamada real de conclusão de chat (consumindo tokens) em vez de usar um endpoint leve.
   - **Correção**: Para provedores compatíveis com OpenAI, usar `GET /models` (se suportado) ou uma chamada de chat mínima com `max_tokens: 1`. Para outros, implementar verificações de saúde específicas ao provedor.

9. **Dados Mock Hardcoded no Dashboard**
   - **Arquivo**: `src/app/(dashboard)/dashboard/page.tsx:26-67`
   - **Problema**: O dashboard usa dados mock hardcoded para `DASHBOARD_SRS_ITEMS`, `WEEK_DAYS` e `radarData` em vez de buscar do Supabase.
   - **Correção**: Substituir os mocks por dados reais das tabelas do Supabase (`user_vocabulary` para itens SRS, uma nova tabela `user_streaks` ou `profiles` para streaks, e radar de habilidades calculado a partir de `conversation_evaluations`).

10. **Vocabulário Não Persistido no Supabase**
    - **Arquivo**: `src/app/(dashboard)/vocabulary/page.tsx:27-43`
    - **Problema**: Os itens de vocabulário são salvos apenas no `localStorage` (`english-lab-vocab-items`), não sincronizados com a tabela `user_vocabulary`.
    - **Correção**: Ao adicionar/atualizar/excluir um item de vocabulário, realizar a operação via Supabase (usando a tabela `user_vocabulary` com RLS). Carregar o vocabulário inicial do Supabase, não apenas de `SEED_VOCABULARY`.

11. **Dados de Radar Hardcoded na Página de Progresso**
    - **Arquivo**: `src/app/(dashboard)/progress/page.tsx:29-46`
    - **Problema**: O `radarData` e `cefrLevels` são hardcoded, não refletindo o progresso real do usuário.
    - **Correção**: Calcular as pontuações do radar de habilidades a partir das avaliações de conversa agregadas (média de relatórios recentes). Determinar a progressão do nível CEFR a partir de `user_lesson_progress` e XP.

12. **Lógica Pedagógica Hardcoded no Mission Card**
    - **Arquivo**: `src/components/dashboard/MissionCard.tsx:20-66`
    - **Problema**: A lógica do plano pedagógico (blocos de tempo, descrições) está embutida no componente, tornando-a não configurável e difícil de atualizar.
    - **Correção**: Mover os planos de missão para um arquivo de configuração JSON ou tabela do Supabase. Buscar o plano baseado em `targetLevel` e duração.

13. **Exercícios de Ditado Hardcoded**
    - **Arquivo**: `src/components/listening/DictationPlayer.tsx:32-73`
    - **Problema**: O array `SEED_DICTATIONS` está hardcoded no componente, limitando a extensibilidade.
    - **Correção**: Mover os exercícios de ditado para um arquivo JSON ou tabela do Supabase (`dictation_exercises`). Carregá-los via chamada de API ou import de um JSON estático (se estático) mas permitir atualizações por administrador.

14. **Simulador de Exame Falta Avaliação Real da IA**
    - **Arquivo**: `src/components/learn/ExamSimulatorModal.tsx`
    - **Problema**: O simulador de exame só usa um timer e UI mock; ele não avalia a fala do usuário via IA.
    - **Correção**: Após o usuário terminar de falar, enviar a transcrição para `/api/ai/evaluate` (com prompts específicos para exames) para gerar uma pontuação de banda real e estimativa de nível CEFR.

## 🟡 Problemas de Gravidade Média
*Problemas relacionados à consistência, experiência do desenvolvedor ou desempenho não crítico.*

15. **Conflito de Cores nas Variantes do Botão**
    - **Arquivo**: `src/components/ui/Button.tsx:22-28`
    - **Problema**: As variantes do botão (`primary`, `secondary`, `glow`) usam cores índigo/violeta, conflitando com a paleta do sistema de design âmbar/emerald/ciano/púrpura.
    - **Correção**: Atualizar as variantes do botão para usar as cores de destaque do sistema de design:
        - `primary`: `--accent-amber` (degradê from-amber-500 to-yellow-400)
        - `secondary`: `--accent-emerald`
        - `glow`: Considerar manter ou adaptar para combinar com o tema aurora.

16. **Modal Usa Classes Tailwind Indefinidas**
    - **Arquivo**: `src/components/ui/Modal.tsx:56,60`
    - **Problema**: O Modal usa `glass-panel` e `border-slate-700/60`, que não estão definidos em `globals.css` ou na configuração do Tailwind v4.
    - **Correção**: Substituir por classes existentes do sistema de design (por exemplo, `bg-[#0b0b10] border border-amber-500/40`). Remover classes indefinidas personalizadas.

17. **Variáveis de Fonte Não Aplicadas Corretamente**
    - **Arquivo**: `src/app/layout.tsx:43`
    - **Problema**: O `className` no `<html>` usa literais de template para variáveis de fonte (`${jakartaSans.variable}`), mas o Tailwind v4 espera que estas sejam aplicadas via variáveis CSS em `:root` ou `body`.
    - **Correção**: Mover a aplicação das variáveis de fonte para o elemento `<body>` ou usar uma abordagem CSS-in-JS. Garantir que `--font-sans`, `--font-mono`, `--font-serif` estejam definidos em `:root` em `globals.css`.

18. **O Roteador de IA Padrão para OpenAI-Compatible em Provedor Inválido**
    - **Arquivo**: `src/lib/ai/router.ts:13-20`
    - **Problema**: Se um `provider` inválido for especificado, o roteador padrão para `OpenAICompatibleProvider` sem aviso, potencialmente causando má configuração.
    - **Correção**: Lançar um erro para provedores desconhecidos (por exemplo, `default: throw new Error(\`Provedor de IA desconhecido: \${providerType}\`)`).

19. **Cálculo de Nível CEFR do Teste de Nivelamento Excessivamente Simplificado**
    - **Arquivo**: `src/app/(dashboard)/test/page.tsx:142-150`
    - **Problema**: O nível CEFR é calculado exclusivamente a partir da pontuação do quiz e contagem de palavras faladas, ignorando gramática, vocabulário e nuances.
    - **Correção**: Usar o mesmo pipeline de avaliação como em `/api/ai/evaluate` para a parte falada, combinando os resultados do quiz com avaliação de IA para uma pontuação holística.

20. **Condição de Corrida na Seleção de Voz da Web Speech**
    - **Arquivo**: `src/lib/audio.ts:18-25`
    - **Problema**: `speechSynthesis.getVoices()` pode retornar um array vazio se chamado antes das vozes serem carregadas, causando nenhuma seleção de voz.
    - **Correção**: Aguardar o evento `voiceschanged` ou chamar `getVoices()` dentro da função `speak` com fallback para a primeira voz inglesa disponível.

21. **Fonte de Dados do Seletor de Tópico Não Clara**
    - **Arquivo**: Referenciado em `src/app/(dashboard)/talk/page.tsx` (usa `SCENARIO_TOPICS`)
    - **Problema**: Necessário verificar se `SCENARIO_TOPICS` é hardcoded ou carregado dinamicamente.
    - **Correção**: Se hardcoded, mover para um arquivo JSON ou tabela do Supabase para atualizações mais fáceis. Garantir que esteja tipado corretamente.

22. **Configuração de IA Não Persistida no Perfil do Usuário**
    - **Arquivo**: `src/app/(dashboard)/settings/page.tsx:24-47`
    - **Problema**: As configurações de IA são salvas apenas no `localStorage`, não vinculadas ao perfil do usuário no Supabase.
    - **Correção**: Ao salvar, atualizar o registro do usuário na tabela `profiles` (adicionar colunas como `ai_provider`, `ai_model`, `ai_temperature`, etc.) ou uma tabela separada `user_ai_config`.

## 🔵 Melhorias de Baixa Gravidade / Qualidade de Código
*Problemas menores, lacunas de documentação ou oportunidades de refinamento.*

23. **Verificar se ChatMessage.role Aceita "system"**
    - **Arquivo**: `src/lib/ai/types.ts` (não revisado)
    - **Ação**: Confirmar que o tipo `ChatMessage` inclui `"system"` como um papel válido para todos os provedores.

24. **Documentar o Mapeamento de Qualidade do SM-2**
    - **Arquivo**: `src/lib/srs.ts:56`
    - **Ação**: Adicionar um comentário explicando o mapeamento de qualidade (1→0, 2→3, 3→4, 4→5) e seu alinhamento com o SM-2.

25. **Mover Lições Concluídas para o Supabase**
    - **Arquivo**: `src/app/(dashboard)/learn/page.tsx:28-30`
    - **Ação**: Substituir o `localStorage` para `completedLessons` com dados da tabela `user_lesson_progress`.

26. **Refletir o Intervalo Real do SM-2 nos Botões de Avaliação do Flashcard**
    - **Arquivo**: `src/components/vocabulary/FlashcardModal.tsx:168-196`
    - **Ação**: Em vez de intervalos fixos (1d, 3d, 7d, 14d), exibir o `intervalDays` real calculado por `calculateSM2` para cada avaliação.

27. **Alinhar a Nomeclatura de Variante do ProgressBar**
    - **Arquivo**: `src/components/ui/ProgressBar.tsx` (não revisado)
    - **Ação**: Garantir que a prop `variant` aceite os mesmos nomes usados no Botão (`amber`, `emerald`, etc.) ou criar um mapeamento.

28. **Revisar a Regex do Middleware para Rotas de API**
    - **Arquivo**: `src/middleware.ts:17`
    - **Ação**: Testar se o regex do matcher permite corretamente que as rotas `/api/*` bypassem o middleware (para SSR do Supabase).

29. **Considerar Downgrade do Next.js para Estável**
    - **Arquivo**: `package.json:17`
    - **Ação**: O Next.js 16.3.3 é um candidato a lançamento (RC). Se nenhuma funcionalidade específica do RC for usada, considerar downgrade para Next.js 15.x LTS para estabilidade.

30. **Garantir Compatibilidade com Tailwind v4**
    - **Arquivo**: `src/app/globals.css:3`
    - **Ação**: Verificar se `@import "tailwindcss";` e o bloco `@theme` são compatíveis com o Tailwind v4 e quaisquer plugins (ex: `tailwind-merge`, `clsx`).

---

### 📋 Como Usar Esta Lista
- **Problemas críticos** devem ser resolvidos antes de qualquer versão pública ou demonstração.
- **Problemas de alta gravidade** devem ser abordados na próxima sprint de desenvolvimento.
- **Problemas de gravidade média e baixa** podem ser abordados durante sprints de refatoração ou conforme o tempo permitir.

Cada correção inclui o arquivo específico e números de linha (onde aplicável) para referência fácil. Após implementar uma correção, verificar se a mudança não introduz regressões executando a suite de testes e verificações manuais.

*Última atualização: 2026-08-29*