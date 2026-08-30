"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { authenticateWithBiometrics, isBiometricsAvailable } from "@/lib/biometrics";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [hasBiometrics, setHasBiometrics] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    isBiometricsAvailable().then((avail) => setHasBiometrics(avail));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setFeedback({ type: "success", message: "Login realizado com sucesso! Redirecionando..." });
      router.push("/dashboard");
    } catch (err: any) {
      let friendlyMessage = err.message || "Erro ao fazer login. Verifique seu e-mail e senha.";
      if (err.message?.includes("Invalid login credentials")) {
        friendlyMessage = "E-mail ou senha incorretos. Por favor, tente novamente.";
      } else if (err.message?.includes("Email not confirmed")) {
        friendlyMessage = "E-mail ainda não confirmado. Verifique sua caixa de entrada.";
      }
      setFeedback({
        type: "error",
        message: friendlyMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    setIsBiometricLoading(true);
    setFeedback(null);

    try {
      const res = await authenticateWithBiometrics();
      if (res.success && res.userEmail) {
        setFeedback({
          type: "success",
          message: "Autenticação biométrica validada! Redirecionando...",
        });
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        setFeedback({ type: "error", message: res.message });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Falha na leitura biométrica." });
    } finally {
      setIsBiometricLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: "Falha ao iniciar autenticação com Google.",
      });
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
            Acessar o <span className="text-amber-400">English Lab</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Entre na sua conta para continuar sua jornada de fluência.
          </p>
        </div>

        {/* Main Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-amber-500/30 shadow-2xl shadow-amber-500/5 space-y-5">
          {/* Biometric One-Touch Login Button (Mobile First) */}
          <button
            type="button"
            onClick={handleBiometricAuth}
            disabled={isBiometricLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-500/20 border border-amber-400/40 hover:border-amber-400 text-amber-300 font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-amber-500/10 active:scale-98 disabled:opacity-50"
          >
            <Fingerprint className="w-5 h-5 text-amber-400 animate-pulse" />
            <span>
              {isBiometricLoading ? "Lendo Biometria..." : "Entrar com Biometria / Face ID"}
            </span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-mono uppercase text-zinc-500">ou com e-mail</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Feedback Messages */}
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

          {/* Email / Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-white/80 font-mono">
                  Senha
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#14141e] border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              className="w-full py-3.5 text-xs font-black uppercase tracking-wider shadow-xl shadow-amber-500/25"
              isLoading={isLoading}
            >
              <span>Entrar na Plataforma</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar com Google</span>
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-zinc-400">
          Ainda não tem uma conta?{" "}
          <Link href="/signup" className="text-amber-400 hover:text-amber-300 font-bold">
            Criar conta gratuita
          </Link>
        </div>
      </div>
    </div>
  );
}
