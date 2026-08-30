import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "glow" | "gold";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5 font-semibold",
      icon: "w-10 h-10 p-2",
    };

    const variantStyles = {
      primary: "bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-lg shadow-amber-500/25 border border-amber-400/40",
      secondary: "bg-[#14141e] hover:bg-[#1a1a28] text-white border border-white/10 shadow-sm",
      outline: "bg-transparent hover:bg-white/10 text-zinc-200 border border-white/20",
      ghost: "bg-transparent hover:bg-white/5 text-zinc-300 hover:text-white",
      danger: "bg-red-500/90 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 border border-red-500/30",
      glow: "bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-400 text-zinc-950 font-bold shadow-lg shadow-amber-500/30 hover:brightness-110 border border-amber-300/40",
      gold: "bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:brightness-105 border border-amber-300/40",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
