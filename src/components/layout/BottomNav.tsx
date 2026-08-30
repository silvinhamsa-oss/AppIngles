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
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_NAV_ITEMS = [
  { label: "Início", href: "/dashboard", icon: LayoutDashboard },
  { label: "Aprender", href: "/learn", icon: BookOpen },
  { label: "Conversar", href: "/talk", icon: MessageSquare, isPrimary: true },
  { label: "Vocab", href: "/vocabulary", icon: Library },
  { label: "Progresso", href: "/progress", icon: TrendingUp },
  { label: "Ajustes", href: "/settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07070a]/95 backdrop-blur-xl border-t border-white/10 pb-safe pt-1.5 px-2 select-none shadow-[0_-8px_20px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-5 group focus:outline-none px-1"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-tr from-amber-400 to-yellow-500 text-zinc-950 shadow-amber-500/40 ring-4 ring-[#07070a] scale-110"
                      : "bg-amber-500 text-zinc-950 shadow-amber-500/25 ring-4 ring-[#07070a] group-active:scale-95"
                  )}
                >
                  <Icon className="w-5 h-5 fill-zinc-950" />
                </div>
                <span
                  className={cn(
                    "text-[9px] font-bold mt-1 transition-colors",
                    isActive ? "text-amber-400" : "text-zinc-400"
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
                "flex flex-col items-center justify-center py-1 px-1.5 min-w-[50px] rounded-xl transition-all active:scale-95",
                isActive
                  ? "text-amber-400 font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-4 h-4 mb-0.5 transition-transform", isActive && "scale-110")} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
                )}
              </div>
              <span className="text-[9px] font-medium tracking-tight mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
