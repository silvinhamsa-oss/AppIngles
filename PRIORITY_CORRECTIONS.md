# English Lab - Priority Correction List

This document outlines the issues found during the code review, prioritized by severity, along with the recommended corrections.

## 🔴 Critical Issues
*Issues that pose security risks, break core functionality, or must be fixed before production deployment.*

1. **Hardcoded Biometric Fallback Email**
   - **File**: `src/lib/biometrics.ts:92`
   - **Problem**: The `authenticateWithBiometrics` function has a hardcoded fallback email `welld@example.com` in the catch block, causing biometric authentication to succeed even when it fails.
   - **Correction**: Remove the hardcoded fallback. On biometric failure, return `{ success: false, message: err.message || "Falha na verificação biométrica." }` without simulating success.

2. **Mock Login Accepting Any Credentials**
   - **File**: `src/app/(auth)/login/page.tsx:48-52`
   - **Problem**: The login page accepts any email/password if Supabase returns an error (e.g., invalid API key), allowing unauthorized access.
   - **Correction**: Remove the mock fallback. Only allow login via legitimate Supabase credentials. Show genuine error messages to the user.

3. **AI Mock Responses Without API Key**
   - **File**: `src/app/api/ai/chat/route.ts:43-60`
   - **Problem**: When no AI API key is configured, the chat endpoint returns randomized mock responses instead of indicating misconfiguration.
   - **Correction**: Return a clear error (e.g., 500) when no AI provider is configured, instructing the user to set up AI credentials in Settings. Do not simulate AI responses.

4. **Mock Evaluation Report**
   - **File**: `src/app/api/ai/evaluate/route.ts:21-72`
   - **Problem**: The evaluation endpoint returns a static mock report regardless of the conversation content.
   - **Correction**: Return a clear error when no AI API key is configured. Only use the AI provider for genuine evaluations.

5. **Ollama Test Connection Misconfiguration**
   - **File**: `src/app/api/ai/test-connection/route.ts:17-22`
   - **Problem**: The test connection endpoint returns `success: false` when no API key is provided, but Ollama does not require an API key.
   - **Correction**: Adjust the condition to allow testing Ollama without an API key: `if (!config.apiKey && config.provider !== "ollama")`.

6. **Hardcoded Supabase Mock Values**
   - **Files**: 
     - `src/lib/supabase/client.ts:4-5`
     - `src/lib/supabase/server.ts:7-8`
   - **Problem**: The Supabase client and server functions use hardcoded mock values (`https://example.supabase.co`, fake JWT) instead of environment variables.
   - **Correction**: Ensure the functions strictly use `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`. If these are missing, throw an error during initialization (do not fallback to mocks).

## 🟠 High Severity Issues
*Issues affecting architecture, data integrity, or maintainability that should be addressed in the next sprint.*

7. **AI Configuration Stored in localStorage (Security Risk)**
   - **Files**: 
     - `src/app/(dashboard)/talk/page.tsx:159-173` (fetches from localStorage)
     - `src/app/(dashboard)/settings/page.tsx:35-47` (saves to localStorage)
   - **Problem**: AI provider configuration (including API keys) is stored in the browser's localStorage, exposing secrets to XSS attacks.
   - **Correction**: Move AI configuration to Supabase (e.g., encrypted in a `user_ai_config` table or added to `profiles`). Fetch settings via an authenticated Supabase call on app load.

8. **AI Test Connection Wastes Tokens**
   - **File**: `src/lib/ai/providers/openai-compatible.ts:130-150`
   - **Problem**: The `testConnection` method makes a real chat completion call (consuming tokens) instead of using a lightweight endpoint.
   - **Correction**: For OpenAI-compatible providers, use `GET /models` (if supported) or a minimal chat call with `max_tokens: 1`. For others, implement provider-specific health checks.

9. **Dashboard Hardcoded Mock Data**
   - **File**: `src/app/(dashboard)/dashboard/page.tsx:26-67`
   - **Problem**: The dashboard uses hardcoded data for `DASHBOARD_SRS_ITEMS`, `WEEK_DAYS`, and `radarData` instead of fetching from Supabase.
   - **Correction**: Replace mocks with real data from Supabase tables (`user_vocabulary` for SRS items, a new `user_streaks` or `profiles` for streak, and calculated skill radar from `conversation_evaluations`).

10. **Vocabulary Not Persisted to Supabase**
    - **File**: `src/app/(dashboard)/vocabulary/page.tsx:27-43`
    - **Problem**: Vocabulary items are saved only to `localStorage` (`english-lab-vocab-items`), not synchronized with the `user_vocabulary` table.
    - **Correction**: On adding/updating/deleting a vocabulary item, perform the operation via Supabase (using the `user_vocabulary` table with RLS). Load initial vocabulary from Supabase, not `SEED_VOCABULARY` alone.

11. **Progress Page Hardcoded Radar Data**
    - **File**: `src/app/(dashboard)/progress/page.tsx:29-46`
    - **Problem**: The `radarData` and `cefrLevels` are hardcoded, not reflecting actual user progress.
    - **Correction**: Calculate skill radar scores from aggregated `conversation_evaluations` (average of recent reports). Determine CEFR level progression from `user_lesson_progress` and XP.

12. **Mission Card Pedagogical Logic Hardcoded**
    - **File**: `src/components/dashboard/MissionCard.tsx:20-66`
    - **Problem**: The mission plan logic (time blocks, descriptions) is embedded in the component, making it non-configurable and hard to update.
    - **Correction**: Move mission plans to a JSON configuration file or Supabase table. Fetch the plan based on `targetLevel` and duration.

13. **Dictation Exercises Hardcoded**
    - **File**: `src/components/listening/DictationPlayer.tsx:32-73`
    - **Problem**: The `SEED_DICTATIONS` array is hardcoded in the component, limiting extensibility.
    - **Correction**: Move dictation exercises to a JSON file or Supabase table (`dictation_exercises`). Load them via an API call or import from a static JSON (if static) but allow admin updates.

14. **Exam Simulator Lacks Real AI Evaluation**
    - **File**: `src/components/learn/ExamSimulatorModal.tsx`
    - **Problem**: The exam simulator only uses a timer and mock UI; it does not evaluate the user's speech via AI.
    - **Correction**: After the user finishes speaking, send the transcript to `/api/ai/evaluate` (with exam-specific prompts) to generate a real band score and CEFR estimate.

## 🟡 Medium Severity Issues
*Issues related to consistency, developer experience, or non-critical performance.*

15. **Button Variant Color Conflict**
    - **File**: `src/components/ui/Button.tsx:22-28`
    - **Problem**: Button variants (`primary`, `secondary`, `glow`) use indigo/violet colors, clashing with the design system's amber/emerald/cyan/purple palette.
    - **Correction**: Update Button variants to use the design system's accent colors:
        - `primary`: `--accent-amber` (gradient from-amber-500 to-yellow-400)
        - `secondary`: `--accent-emerald`
        - `glow`: Consider keeping or adapting to match the aurora theme.

16. **Modal Uses Undefined Tailwind Classes**
    - **File**: `src/components/ui/Modal.tsx:56,60`
    - **Problem**: The Modal uses `glass-panel` and `border-slate-700/60`, which are not defined in `globals.css` or Tailwind v4 configuration.
    - **Correction**: Replace with existing classes from the design system (e.g., `bg-[#0b0b10] border border-amber-500/40`). Remove custom undefined classes.

17. **Font Variables Not Applied Correctly**
    - **File**: `src/app/layout.tsx:43`
    - **Problem**: The `className` on `<html>` uses template literals for font variables (`${jakartaSans.variable}`), but Tailwind v4 expects these to be applied via CSS variables on `:root` or `body`.
    - **Correction**: Move font variable application to the `<body>` element or use a CSS-in-JS approach. Ensure `--font-sans`, `--font-mono`, `--font-serif` are set on `:root` in `globals.css`.

18. **AI Router Defaults to OpenAI-Compatible on Invalid Provider**
    - **File**: `src/lib/ai/router.ts:13-20`
    - **Problem**: If an invalid `provider` is specified, the router defaults to `OpenAICompatibleProvider` without warning, potentially causing misconfiguration.
    - **Correction**: Throw an error for unknown providers (e.g., `default: throw new Error(\`Unknown AI provider: \${providerType}\`)`).

19. **Placement Test CEFR Calculation Oversimplified**
    - **File**: `src/app/(dashboard)/test/page.tsx:142-150`
    - **Problem**: The CEFR level is calculated solely from quiz score and speaking word count, ignoring grammar, vocabulary, and nuances.
    - **Correction**: Use the same evaluation pipeline as `/api/ai/evaluate` for the speaking portion, combining quiz results with AI evaluation for a holistic score.

20. **Web Speech Voice Selection Race Condition**
    - **File**: `src/lib/audio.ts:18-25`
    - **Problem**: `speechSynthesis.getVoices()` may return an empty array if called before voices are loaded, causing no voice selection.
    - **Correction**: Wait for the `voiceschanged` event or call `getVoices()` inside the `speak` function with a fallback to the first available English voice.

21. **Topic Selector Data Source Unclear**
    - **File**: Referenced in `src/app/(dashboard)/talk/page.tsx` (uses `SCENARIO_TOPICS`)
    - **Problem**: Need to verify if `SCENARIO_TOPICS` is hardcoded or dynamically loaded.
    - **Correction**: If hardcoded, move to a JSON file or Supabase table for easier updates. Ensure it's typed correctly.

22. **AI Configuration Not Persisted to User Profile**
    - **File**: `src/app/(dashboard)/settings/page.tsx:24-47`
    - **Problem**: AI settings are saved only to `localStorage`, not tied to the user's Supabase profile.
    - **Correction**: On save, update the user's record in `profiles` (add columns like `ai_provider`, `ai_model`, `ai_temperature`, etc.) or a separate `user_ai_config` table.

## 🔵 Low Severity / Code Quality Improvements
*Minor issues, documentation gaps, or opportunities for refinement.*

23. **Verify ChatMessage.role Accepts "system"**
    - **File**: `src/lib/ai/types.ts` (not reviewed)
    - **Action**: Confirm the `ChatMessage` type includes `"system"` as a valid role for all providers.

24. **Document SM-2 Quality Mapping**
    - **File**: `src/lib/srs.ts:56`
    - **Action**: Add a comment explaining the quality mapping (1→0, 2→3, 3→4, 4→5) and its alignment with SM-2.

25. **Move Completed Lessons to Supabase**
    - **File**: `src/app/(dashboard)/learn/page.tsx:28-30`
    - **Action**: Replace `localStorage` for `completedLessons` with data from `user_lesson_progress` table.

26. **Reflect Real SM-2 Interval in Flashcard Rating Buttons**
    - **File**: `src/components/vocabulary/FlashcardModal.tsx:168-196`
    - **Action**: Instead of fixed intervals (1d, 3d, 7d, 14d), display the actual `intervalDays` calculated by `calculateSM2` for each rating.

27. **Align ProgressBar Variant Naming**
    - **File**: `src/components/ui/ProgressBar.tsx` (not reviewed)
    - **Action**: Ensure the `variant` prop accepts the same names used in Button (`amber`, `emerald`, etc.) or create a mapping.

28. **Review Middleware Regex for API Routes**
    - **File**: `src/middleware.ts:17`
    - **Action**: Test that the matcher regex correctly allows `/api/*` routes to bypass middleware (for Supabase SSR).

29. **Consider Downgrading Next.js to Stable**
    - **File**: `package.json:17`
    - **Action**: Next.js 16.3.3 is a release candidate. If no RC-specific features are used, consider downgrading to Next.js 15.x LTS for stability.

30. **Ensure Tailwind v4 Compatibility**
    - **File**: `src/app/globals.css:3`
    - **Action**: Verify that `@import "tailwindcss";` and the `@theme` block are compatible with Tailwind v4 and any plugins (e.g., `tailwind-merge`, `clsx`).

---

### 📋 How to Use This List
- **Critical issues** must be resolved before any production release or public demo.
- **High severity** issues should be addressed in the next development sprint.
- **Medium and Low** issues can be tackled during refactoring sprints or as time permits.

Each correction includes the specific file and line numbers (where applicable) for easy reference. After implementing a fix, verify the change does not introduce regressions by running the test suite and manual checks.

*Last updated: 2026-08-29*