"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem("english-lab-theme") as "dark" | "light" | null) || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("english-lab-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
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
      title={`Alternar para modo ${theme === "dark" ? "claro" : "escuro"}`}
    >
      {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
    </button>
  );
}
