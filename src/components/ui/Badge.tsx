import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "outline" | "cyan" | "gold";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 font-medium rounded-md",
    md: "text-xs px-2.5 py-1 font-semibold rounded-lg",
  };

  const variantStyles = {
    primary: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
    secondary: "bg-slate-800 text-slate-300 border border-slate-700/60",
    success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    danger: "bg-red-500/15 text-red-300 border border-red-500/30",
    cyan: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
    gold: "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-400/40 shadow-sm shadow-amber-500/10",
    outline: "bg-transparent text-slate-300 border border-slate-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 justify-center tracking-wide",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
