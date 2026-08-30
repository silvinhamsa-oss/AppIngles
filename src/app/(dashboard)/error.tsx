"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard route error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0d0d14] border border-amber-500/30 shadow-2xl space-y-5 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/20">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30">
            PROTEÇÃO DE ROTA ATIVA
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Não foi possível carregar este módulo
          </h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto font-normal leading-relaxed">
            Houve uma falha de conexão temporária com o servidor ou provedor de IA.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="gold" onClick={() => reset()} className="w-full sm:w-auto text-xs">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Recarregar Tela</span>
          </Button>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto text-xs">
              <Home className="w-3.5 h-3.5 mr-1.5" />
              <span>Painel Inicial</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
