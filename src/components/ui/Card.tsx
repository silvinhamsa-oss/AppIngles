import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "solid" | "bordered" | "glow";
  hoverable?: boolean;
}

export function Card({
  className,
  variant = "glass",
  hoverable = false,
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    glass: "glass-panel rounded-2xl p-6",
    solid: "bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl",
    bordered: "bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6",
    glow: "glass-panel border-indigo-500/30 shadow-xl shadow-indigo-500/5 rounded-2xl p-6",
  };

  const hoverStyles = hoverable ? "transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer" : "";

  return (
    <div className={cn(variantStyles[variant], hoverStyles, className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold text-slate-100 tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center pt-4 mt-4 border-t border-slate-800/60", className)} {...props}>
      {children}
    </div>
  );
}
