"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  User,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { registerBiometrics } from "@/lib/biometrics";
import { CEFRLevel } from "@/types/profile";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>("B1+");
  const [enableBiometrics, setEnableBiometrics] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            cefr_level: cefrLevel,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (enableBiometrics) {
        await registerBiometrics(email);
      }

      // Se o usuário foi criado e já autenticado diretamente
      if (data.session) {
        setFeedback({
          type: "success",
          message: "Conta criada com sucesso! Redirecionando para o teste de nivelamento inteligente...",
        });
        router.push("/test?onboarding=true");
        router.refresh();
      } else if (data.user) {
        // Se o Supabase exige confirmação de email
        setFeedback({
          type: "success",
          message: "Conta criada com sucesso! Enviamos um e-mail de confirmação. Por favor, verifique sua caixa de entrada antes de entrar.",
        });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "";
      let friendlyMessage = errorMessage || "Erro ao criar conta. Tente novamente.";

      if (errorMessage.includes("User already registered")) {
        friendlyMessage = "Este e-mail já está cadastrado. Tente fazer login.";
      } else if (errorMessage.includes("Password should be at least 6 characters")) {
        friendlyMessage = "A senha deve ter no mínimo 6 caracteres.";
      } else if (
        errorMessage.includes("Database error saving new user") ||
        errorMessage.includes("Database error")
      ) {
        friendlyMessage =
          "Erro no banco de dados do Supabase ao registrar perfil. Execute o script 'supabase/fix_trigger.sql' no SQL Editor do Supabase para corrigir o trigger automático.";
      }

      setFeedback({
        type: "error",
        message: friendlyMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#050507] text-[#fafafa] aurora-bg">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-400 flex items-center justify-center shadow-xl shadow-amber-500/25 font-black text-zinc-950 text-base">
              EL
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Criar sua Conta no <span className="text-amber-400">English Lab</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Comece do seu nível real com tutor de IA e voz nativa.
          </p>
        </div>

        {/* Main Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-amber-500/30 shadow-2xl shadow-amber-500/5 space-y-5">
          {feedback && (
            <div
              className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 animate-in fade-in ${
                feedback.type === "success"
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                  : "bg-red-500/15 border-red-500/40 text-red-300"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  placeholder="Seu nome ou apelido"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#14141e] border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#14141e] border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#14141e] border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Starting CEFR Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-white/80 font-mono flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>Nível Inicial Estimado</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { lvl: "A1", desc: "Iniciante Zero" },
                  { lvl: "B1+", desc: "Intermediário" },
                  { lvl: "B2", desc: "Avançado" },
                ].map((item) => (
                  <button
                    key={item.lvl}
                    type="button"
                    onClick={() => setCefrLevel(item.lvl as CEFRLevel)}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      cefrLevel === item.lvl
                        ? "bg-amber-500 text-zinc-950 border-amber-400 font-bold shadow-md shadow-amber-500/20"
                        : "bg-[#14141e] border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="text-xs font-mono font-bold">{item.lvl}</div>
                    <div className="text-[9px] truncate">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Enable Biometrics Checkbox */}
            <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
              <input
                type="checkbox"
                checked={enableBiometrics}
                onChange={(e) => setEnableBiometrics(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
              <div className="text-xs">
                <span className="text-white font-bold flex items-center gap-1">
                  <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                  Ativar Biometria (Face ID / Digital)
                </span>
                <p className="text-[10px] text-zinc-400">Entrar com 1 toque no celular</p>
              </div>
            </label>

            <Button
              type="submit"
              variant="gold"
              className="w-full py-3.5 text-xs font-black uppercase tracking-wider shadow-xl shadow-amber-500/25"
              isLoading={isLoading}
            >
              <span>Criar Conta Gratuita</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-zinc-400">
          Já possui uma conta?{" "}
          <Link href="/login" className="text-amber-400 hover:text-amber-300 font-bold">
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
