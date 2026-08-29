import React from "react";
import { LandingNavbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { LevelComparison } from "@/components/landing/LevelComparison";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <FeaturesGrid />
        <LevelComparison />
        <FinalCTA />
      </main>
      <footer className="glass-panel border-t border-slate-800/80 py-8 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">English Lab</span>
            <span>— Your English. Your Pace. Your AI Tutor.</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} English Lab. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
