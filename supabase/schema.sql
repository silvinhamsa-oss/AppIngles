-- ==============================================================================
-- ENGLISH LAB — SUPABASE POSTGRESQL DATABASE SCHEMA
-- Multi-user, CEFR A1-C2 journey, SRS Spaced Repetition, and AI Conversation Log
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
CREATE TYPE cefr_level AS ENUM ('A1', 'A2', 'B1', 'B1+', 'B2', 'C1', 'C2');
CREATE TYPE part_of_speech AS ENUM ('noun', 'verb', 'phrasal_verb', 'adjective', 'adverb', 'connector', 'idiom');
CREATE TYPE conversation_mode AS ENUM ('free', 'guided', 'roleplay', 'interview', 'debate');
CREATE TYPE vocabulary_status AS ENUM ('new', 'learning', 'reviewing', 'active', 'mastered', 'difficult');

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  cefr_level cefr_level DEFAULT 'B1+',
  target_level cefr_level DEFAULT 'B2',
  daily_goal_minutes INT DEFAULT 20,
  streak_days INT DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  xp_points INT DEFAULT 0,
  biometrics_enabled BOOLEAN DEFAULT FALSE,
  preferred_persona TEXT DEFAULT 'sarah',
  ai_provider TEXT DEFAULT 'openrouter',
  ai_api_key TEXT,
  ai_model TEXT DEFAULT 'meta-llama/llama-3.3-70b-instruct',
  ai_base_url TEXT,
  ai_temperature NUMERIC DEFAULT 0.7,
  ai_max_tokens INT DEFAULT 2048,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER VOCABULARY & SRS (SUPERMEMO-2) TABLE
CREATE TABLE IF NOT EXISTS public.user_vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  translation_pt TEXT NOT NULL,
  definition_en TEXT,
  example_sentence TEXT,
  part_of_speech part_of_speech DEFAULT 'verb',
  cefr_level cefr_level DEFAULT 'B1',
  context_note TEXT,
  status vocabulary_status DEFAULT 'learning',
  repetition_count INT DEFAULT 0,
  interval_days INT DEFAULT 0,
  ease_factor NUMERIC(4, 2) DEFAULT 2.50,
  retrieval_score INT DEFAULT 50,
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_vocabulary_user_review ON public.user_vocabulary (user_id, next_review_at);

-- 5. CONVERSATION SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  mode conversation_mode DEFAULT 'guided',
  topic TEXT NOT NULL,
  persona TEXT DEFAULT 'sarah',
  duration_seconds INT DEFAULT 0,
  message_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONVERSATION MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.conversation_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
  content TEXT NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CONVERSATION EVALUATIONS (CEFR REPORT) TABLE
CREATE TABLE IF NOT EXISTS public.conversation_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL UNIQUE REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  fluency_score INT NOT NULL,
  vocabulary_score INT NOT NULL,
  grammar_score INT NOT NULL,
  naturalness_score INT NOT NULL,
  confidence_score INT NOT NULL,
  average_score INT NOT NULL,
  what_you_did_well JSONB DEFAULT '[]'::jsonb,
  what_to_improve JSONB DEFAULT '[]'::jsonb,
  corrections JSONB DEFAULT '[]'::jsonb,
  extracted_vocabulary JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. USER LESSON PROGRESS TABLE (CURRICULUM A1-C2)
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  level_category TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT TRUE,
  xp_earned INT DEFAULT 50,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 9. USER BIOMETRIC CREDENTIALS (WEBAUTHN / PASSKEYS) TABLE
CREATE TABLE IF NOT EXISTS public.user_biometric_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  credential_id TEXT NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  counter INT DEFAULT 0,
  device_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_biometric_credentials ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read, insert and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Vocabulary: Users can only manage their own vocabulary
CREATE POLICY "Users can view own vocabulary" ON public.user_vocabulary FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vocabulary" ON public.user_vocabulary FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vocabulary" ON public.user_vocabulary FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vocabulary" ON public.user_vocabulary FOR DELETE USING (auth.uid() = user_id);

-- Conversations & Evaluations
CREATE POLICY "Users can manage own conversations" ON public.conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own messages" ON public.conversation_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_messages.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can view own evaluations" ON public.conversation_evaluations FOR ALL USING (auth.uid() = user_id);

-- Lessons & Biometrics
CREATE POLICY "Users can manage own lesson progress" ON public.user_lesson_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own biometric credentials" ON public.user_biometric_credentials FOR ALL USING (auth.uid() = user_id);

-- Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP (RESILIENT)
-- ==============================================================================

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
  -- Safe parsing of cefr_level
  BEGIN
    v_raw_level := NEW.raw_user_meta_data->>'cefr_level';
    IF v_raw_level IN ('A1', 'A2', 'B1', 'B1+', 'B2', 'C1', 'C2') THEN
      v_level := v_raw_level::public.cefr_level;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    v_level := 'B1+';
  END;

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
  -- Prevent aborting auth.users creation if profile insertion fails
  RAISE WARNING 'handle_new_user exception for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

