"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { CEFRLevel } from "@/types/profile";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>("B1");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 bg-radial-gradient">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-black text-xl group-hover:scale-105 transition-transform">
              EL
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Crie sua conta
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure seu perfil de aprendizagem no English Lab
          </p>
        </div>

        {/* Signup Card */}
        <Card variant="glass" className="border-slate-800/90 shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Nome Completo"
              type="text"
              placeholder="Ex: Welld ou Filho"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            {/* Level selection */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Seu Nível Estimado Inicial
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["A1", "A2", "B1", "B1+", "B2", "C1"] as CEFRLevel[]).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      selectedLevel === lvl
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30"
                        : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {selectedLevel === "A1" || selectedLevel === "A2"
                  ? "Iniciante: Foco em fundamentos, vocabulário essencial e explicações simples."
                  : "Intermediário/Avançado: Foco em conversação, active recall e fluência."}
              </p>
            </div>

            <Button
              type="submit"
              variant="glow"
              size="lg"
              className="w-full mt-3"
              isLoading={isLoading}
            >
              <span>Começar Agora</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Fazer login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
