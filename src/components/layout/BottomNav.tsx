"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Library,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_NAV_ITEMS = [
  { label: "Início", href: "/dashboard", icon: LayoutDashboard },
  { label: "Aprender", href: "/learn", icon: BookOpen },
  { label: "Conversar", href: "/talk", icon: MessageSquare, isPrimary: true },
  { label: "Vocabulário", href: "/vocabulary", icon: Library },
  { label: "Progresso", href: "/progress", icon: TrendingUp },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800/90 pb-safe pt-2 px-3">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-6 group focus:outline-none"
              >
                <div
                  className={cn(
                    "w-13 h-13 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 text-white shadow-indigo-600/40 ring-4 ring-slate-950 scale-105"
                      : "bg-indigo-600 text-white shadow-indigo-600/25 ring-4 ring-slate-950 group-hover:scale-105"
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold mt-1 transition-colors",
                    isActive ? "text-indigo-400" : "text-slate-400"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-1.5 px-3 rounded-xl transition-all",
                isActive ? "text-indigo-400 font-semibold" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
