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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-lg border-t border-[var(--border-subtle)] pb-safe pt-2 px-3">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

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
                      ? "bg-gradient-to-tr from-amber-400 to-yellow-500 text-zinc-950 shadow-amber-500/40 ring-4 ring-zinc-950 scale-105"
                      : "bg-amber-500 text-zinc-950 shadow-amber-500/25 ring-4 ring-zinc-950 group-hover:scale-105"
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold mt-1 transition-colors",
                    isActive ? "text-amber-400" : "text-zinc-500"
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
                isActive ? "text-amber-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
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
