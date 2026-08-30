-- ==============================================================================
-- CORREÇÃO DEFINITIVA DO ERRO "Database error saving new user" NO SUPABASE
-- Execute este script no SQL Editor do Supabase (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Garante que os tipos ENUM existam
DO $$ BEGIN
  CREATE TYPE cefr_level AS ENUM ('A1', 'A2', 'B1', 'B1+', 'B2', 'C1', 'C2');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Concede permissões essenciais de schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- 3. Atualiza políticas RLS da tabela profiles para permitir INSERT do usuário e do trigger
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Criação da função handle_new_user ultra-resiliente (SECURITY DEFINER + search_path)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, auth, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  v_level public.cefr_level := 'B1+';
  v_raw_level text;
BEGIN
  -- Safe parsing do nível CEFR
  BEGIN
    v_raw_level := NEW.raw_user_meta_data->>'cefr_level';
    IF v_raw_level IN ('A1', 'A2', 'B1', 'B1+', 'B2', 'C1', 'C2') THEN
      v_level := v_raw_level::public.cefr_level;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    v_level := 'B1+';
  END;

  -- Inserção ou atualização garantida
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    cefr_level,
    target_level,
    daily_goal_minutes,
    streak_days,
    xp_points
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(COALESCE(NEW.email, 'user'), '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    v_level,
    'B2',
    20,
    1,
    100
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    updated_at = NOW();

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Evita que qualquer erro cancele a criação do usuário no auth.users
  RAISE WARNING 'handle_new_user falhou para o usuário %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- 5. Recria o trigger na tabela auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
