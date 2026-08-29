import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  variant?: "primary" | "cyan" | "emerald" | "amber" | "gradient";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  variant = "gradient",
  size = "md",
  showLabel = false,
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4 rounded-xl",
  };

  const fillVariants = {
    primary: "bg-indigo-500",
    cyan: "bg-cyan-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    gradient: "bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-400">
          <span>Progresso</span>
          <span className="text-slate-200">{percentage}%</span>
        </div>
      )}
      <div className={cn("w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/40 p-0.5", sizeStyles[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out shadow-sm", fillVariants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
