# English Lab - Lista de Correções Pendentes

Este documento lista apenas os problemas que **AINDA PRECISAM SER CORRIGIDOS** após a verificação inicial. Os problemas críticos de segurança já foram resolvidos.

## 🔴 Problemas Pendentes de Alta Gravidade
*Problemas que afetam arquitetura, integridade de dados ou manutenibilidade que devem ser abordados na próxima sprint.*

### 1. Valores Mock Hardcoded do Supabase
   - **Arquivo**: 
     - `src/lib/supabase/client.ts:4-5`
     - `src/lib/supabase/server.ts:7-8`
   - **Problema**: As funções ainda têm valores de fallback hardcoded (`https://mgotoricuqyeykcfwfaf.supabase.co`, chave publishable) em vez de falhar quando variáveis de ambiente estão faltando.
   - **Correção Necessária**: Remover completamente os fallbacks. Se `process.env.NEXT_PUBLIC_SUPABASE_URL` ou `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` estiverem faltando, lançar um erro claro durante a inicialização (não fazer fallback para mocks ou valores hardcoded).

### 2. Dados Mock Hardcoded no Dashboard
   - **Arquivo**: `src/app/(dashboard)/dashboard/page.tsx:26-67`
   - **Problema**: O dashboard ainda usa dados mock hardcoded para:
     - `DASHBOARD_SRS_ITEMS` (array fixo de 4 palavras)
     - `WEEK_DAYS` (array fixo de dias da semana)
     - `radarData` (objeto fixo com pontuações)
   - **Correção Necessária**: Substituir por dados reais das tabelas do Supabase:
     - `user_vocabulary` para itens SRS (filtrados pelo usuário logado)
     - Nova tabela ou campo em `profiles` para streak de dias
     - Cálculo real do radar de habilidades a partir de `conversation_evaluations` (média das pontuações recentes por skill)

### 3. Dados de Radar Hardcoded na Página de Progresso
   - **Arquivo**: `src/app/(dashboard)/progress/page.tsx:29-46`
   - **Problema**: O `radarData` e `cefrLevels` ainda são hardcoded, não refletindo o progresso real do usuário.
   - **Correção Necessária**: 
     - Calcular as pontuações do radar de habilidades a partir das avaliações de conversa agregadas (média de relatórios recentes em `conversation_evaluations`)
     - Determinar a progressão do nível CEFR a partir de `user_lesson_progress` (lições concluídas) e XP acumulado
     - Buscar esses dados via Supabase ao carregar a página

### 4. Lógica Pedagógica Hardcoded no Mission Card
   - **Arquivo**: `src/components/dashboard/MissionCard.tsx:20-66`
   - **Problema**: A lógica do plano pedagógico (blocos de tempo, descrições) ainda está embutida no componente via função `getMissionPlan`, tornando-a não configurável e difícil de atualizar.
   - **Correção Necessária**: 
     - Mover os planos de missão para um arquivo de configuração JSON (ex: `/data/mission-plans.json`) ou tabela do Supabase (`mission_plans`)
     - Buscar o plano dinamicamente baseado em `targetLevel` e duração selecionada
     - Permitir atualizações sem redeploy (se usar JSON estático) ou via admin (se usar Supabase)

### 5. Exercícios de Ditado Hardcoded
   - **Arquivo**: `src/components/listening/DictationPlayer.tsx:32-73`
   - **Problema**: O array `SEED_DICTATIONS` ainda está hardcoded no componente, limitando a extensibilidade e exigindo redeploy para atualizações.
   - **Correção Necessária**: 
     - Mover os exercícios de ditado para um arquivo JSON (ex: `/data/dictation-exercises.json`) ou tabela do Supabase (`dictation_exercises`)
     - Carregá-los via chamada de API ou import de um JSON estático (se estático, permitir atualizações via CI/CD)
     - Manter tipagem correta com interface `DictationExercise`

### 6. Simulador de Exame Falta Avaliação Real da IA
   - **Arquivo**: `src/components/learn/ExamSimulatorModal.tsx`
   - **Problema**: O simulador de exame ainda só usa um timer e UI mock; ele não avalia a fala do usuário via IA após o término.
   - **Correção Necessária**: 
     - Após o usuário terminar de falar (em `handleFinishExam`), enviar a transcrição (`userSpeech`) para `/api/ai/evaluate`
     - Usar prompts específicos para exames IELTS/TOEFL no corpo da requisição
     - Exibir resultados reais: Band Score, nível CEFR equivalente, feedback pedagógico
     - Manter a UI de resultado existente, mas com dados reais da IA em vez de mocks

## 📊 Progresso Atual
- **✅ 5 de 6 problemas CRÍTICOS de segurança já corrigidos**
- **✅ 1 de 6 problemas de ALTA GRAVIDADE já corrigido** (vocabulário no Supabase)
- **⚠️ 5 de 6 problemas de ALTA GRAVIDADE ainda PENDENTES** (listados acima)

## 🎯 Próximos Passos Recomendados
1. **Prioridade Imediata**: Corrigir os itens 2, 3 e 4 (Dashboard, Progress, Mission Card) pois afetam diretamente a experiência do usuário core
2. **Em seguida**: Itens 5 e 6 (Dictation e Exam Simulator) para melhorar funcionalidades específicas
3. **Por último**: Item 1 (Supabase mocks) - importante para robustez, mas menos impactante na UX imediata

Cada correção inclui o arquivo específico e descrição clara do que precisa ser feito para facilitar o desenvolvimento.

*Última atualização: 2026-08-29 - Status pós-verificação de correções críticas*