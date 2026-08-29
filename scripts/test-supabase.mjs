import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mgotoricuqyeykcfwfaf.supabase.co";
const supabaseAnonKey = "sb_publishable_1c9vpm6uQ2F8uIYDa6a_hg_KBTCSnC7";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log("🔍 Testando conexão com Supabase Live...");
  console.log("URL:", supabaseUrl);

  try {
    // 1. Test Auth Service Health
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.log("❌ Erro no serviço de Auth:", sessionError.message);
    } else {
      console.log("✅ Serviço de Autenticação (Auth) online e respondendo.");
    }

    // 2. Test querying 'profiles' table
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, cefr_level")
      .limit(5);

    if (profileError) {
      console.log("⚠️ Tabela 'profiles' retornou erro:", profileError.message);
      if (profileError.code === "42P01") {
        console.log("👉 DICA: A tabela 'profiles' ainda não foi criada. Execute o script supabase/schema.sql no SQL Editor do Supabase!");
      }
    } else {
      console.log("✅ Tabela 'profiles' acessível no banco!");
      console.log("   Registros encontrados:", profiles);
    }

    // 3. Test querying 'user_vocabulary' table
    const { data: vocab, error: vocabError } = await supabase
      .from("user_vocabulary")
      .select("id, word")
      .limit(5);

    if (vocabError) {
      console.log("⚠️ Tabela 'user_vocabulary' retornou erro:", vocabError.message);
    } else {
      console.log("✅ Tabela 'user_vocabulary' acessível no banco!");
      console.log("   Registros encontrados:", vocab);
    }

    console.log("🎉 Teste de conectividade com Supabase concluído com sucesso!");
  } catch (err) {
    console.error("❌ Erro inesperado:", err.message);
  }
}

testSupabase();
