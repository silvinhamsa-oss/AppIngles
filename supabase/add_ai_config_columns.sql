-- ==============================================================================
-- ADICIONA COLUNAS DE CONFIGURAÇÃO DE IA NA TABELA PROFILES DO SUPABASE
-- Execute este script no SQL Editor do Supabase para persistir suas chaves na nuvem
-- ==============================================================================

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS ai_provider TEXT DEFAULT 'openrouter',
  ADD COLUMN IF NOT EXISTS ai_api_key TEXT,
  ADD COLUMN IF NOT EXISTS ai_model TEXT DEFAULT 'meta-llama/llama-3.3-70b-instruct',
  ADD COLUMN IF NOT EXISTS ai_base_url TEXT,
  ADD COLUMN IF NOT EXISTS ai_temperature NUMERIC DEFAULT 0.7,
  ADD COLUMN IF NOT EXISTS ai_max_tokens INT DEFAULT 2048;

-- Concede permissões atualizadas
GRANT ALL ON public.profiles TO authenticated, service_role;
