# Correção: Remoção de Valores Mock Hardcoded do Supabase

## Problema Identificado
Os arquivos `src/lib/supabase/client.ts` e `src/lib/supabase/server.ts` ainda possuem valores de fallback hardcoded para as variáveis de ambiente do Supabase. Quando `NEXT_PUBLIC_SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY` não estão definidas, a aplicação usa valores hardcoded em vez de falhar claramente, o que pode causar:
- Conexão acidental a um projeto Supabase específico em ambientes de staging/produção
- Comportamento inesperado ou vazamento de dados
- Dificuldade em detectar problemas de configuração

## Solução
Remover completamente os valores de fallback hardcoded e lançar um erro claro quando as variáveis de ambiente obrigatórias estiverem faltando.

## Arquivos a Corrigir

### 1. src/lib/supabase/client.ts

**Código Atual (problemático):**
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.");
  }

  return createBrowserClient(
    supabaseUrl || "https://mgotoricuqyeykcfwfaf.supabase.co",
    supabaseAnonKey || "sb_publishable_1c9vpm6uQ2F8uIYDa6a_hg_KBTCSnC7"
  );
}
```

**Código Corrigido:**
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables. " +
      "Please check your .env.local file."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
```

### 2. src/lib/supabase/server.ts

**Código Atual (problemático):**
```typescript
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mgotoricuqyeykcfwfaf.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_1c9vpm6uQ2F8uIYDa6a_hg_KBTCSnC7";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Can be ignored if called from Server Component
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Can be ignored if called from Server Component
        }
      },
    },
  });
}
```

**Código Corrigido:**
```typescript
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables. " +
      "Please check your .env.local file."
    );
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Can be ignored if called from Server Component
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Can be ignored if called from Server Component
        }
      },
    },
  });
}
```

## Instruções de Aplicação
1. Substituir o conteúdo de `src/lib/supabase/client.ts` pelo código corrigido acima
2. Substituir o conteúdo de `src/lib/supabase/server.ts` pelo código corrigido acima
3. Garantir que as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estejam definidas no arquivo `.env.local` (não versionado)
4. Testar a aplicação localmente e em ambientes de staging para garantir que ela falhe claramente quando as variáveis de ambiente estiverem faltando

## Impacto
- ✅ Elimina o risco de conexão acidental a projetos Supabase errados
- ✅ Fornece feedback claro e imediato quando há problemas de configuração
- ✅ Mantém a mesma funcionalidade quando as variáveis de ambiente estão corretamente definidas
- ✅ Segue o princípio de "fail fast" para melhorar a depuração e a confiabilidade

## Observação Importante
Após aplicar esta correção, se as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY` não estiverem definidas, a aplicação lançará um erro claro durante a inicialização, impedindo que ela funcione com configurações inválidas ou hardcoded.

*Correção preparada em: 2026-08-29*