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
