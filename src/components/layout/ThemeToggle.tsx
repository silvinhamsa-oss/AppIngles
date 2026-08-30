"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun, Eye } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light" | "contrast">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem("english-lab-theme") as "dark" | "light" | "contrast" | null) || "dark";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (t: "dark" | "light" | "contrast") => {
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.classList.remove("dark", "light", "contrast");
    document.documentElement.classList.add(t === "contrast" ? "dark" : t);
  };

  const toggleTheme = () => {
    const cycle: Record<"dark" | "light" | "contrast", "dark" | "light" | "contrast"> = {
      dark: "light",
      light: "contrast",
      contrast: "dark",
    };
    const nextTheme = cycle[theme] || "dark";
    setTheme(nextTheme);
    localStorage.setItem("english-lab-theme", nextTheme);
    applyTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-xl bg-[#121218] border border-white/10 shrink-0" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="w-8 h-8 rounded-xl bg-[#121218] border border-white/10 hover:border-amber-400/40 text-amber-400 hover:text-amber-300 transition-all flex items-center justify-center cursor-pointer shadow-sm shrink-0 active:scale-90"
      title={`Tema atual: ${theme === "dark" ? "Escuro" : theme === "light" ? "Claro" : "Alto Contraste"} (Clique para alternar)`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : theme === "light" ? (
        <Moon className="w-4 h-4 text-indigo-400" />
      ) : (
        <Eye className="w-4 h-4 text-emerald-400" />
      )}
    </button>
  );
}
