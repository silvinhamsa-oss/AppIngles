"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AudioVisualizerProps {
  isActive?: boolean;
  barCount?: number;
  className?: string;
  variant?: "amber" | "emerald" | "indigo" | "cyan";
}

export function AudioVisualizer({
  isActive = false,
  barCount = 18,
  className,
  variant = "amber",
}: AudioVisualizerProps) {
  const colorMap = {
    amber: "bg-amber-400 shadow-amber-500/30",
    emerald: "bg-emerald-400 shadow-emerald-500/30",
    indigo: "bg-indigo-400 shadow-indigo-500/30",
    cyan: "bg-cyan-400 shadow-cyan-500/30",
  };

  const selectedColor = colorMap[variant];

  return (
    <div className={cn("flex items-center justify-center gap-1 h-8 px-2 select-none", className)}>
      {Array.from({ length: barCount }).map((_, i) => {
        // Vary heights and animation delays
        const delay = (i * 0.08) % 1.2;
        const defaultHeight = isActive ? 8 + ((i % 5) * 4) : 4;

        return (
          <div
            key={i}
            className={cn(
              "w-1 rounded-full transition-all duration-150",
              selectedColor,
              isActive ? "animate-pulse" : "opacity-30"
            )}
            style={{
              height: isActive ? `${Math.max(6, Math.sin(i * 1.3) * 10 + 14)}px` : `${defaultHeight}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${0.6 + (i % 4) * 0.2}s`,
            }}
          />
        );
      })}
    </div>
  );
}
