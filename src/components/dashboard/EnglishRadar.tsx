"use client";

import React from "react";
import { SkillRadarData, CEFRLevel } from "@/types/profile";

interface EnglishRadarProps {
  data: SkillRadarData;
  size?: number;
  currentLevel?: CEFRLevel;
}

export function EnglishRadar({
  data = {
    speaking: 65,
    vocabulary: 70,
    listening: 75,
    grammar: 80,
    reading: 85,
    writing: 70,
  },
  size = 280,
  currentLevel = "B1+",
}: EnglishRadarProps) {
  const center = size / 2;
  const radius = center * 0.72;

  const skills: Array<{ label: string; key: keyof SkillRadarData; angle: number }> = [
    { label: "Speaking", key: "speaking", angle: 0 },
    { label: "Vocabulary", key: "vocabulary", angle: 60 },
    { label: "Listening", key: "listening", angle: 120 },
    { label: "Grammar", key: "grammar", angle: 180 },
    { label: "Reading", key: "reading", angle: 240 },
    { label: "Writing", key: "writing", angle: 300 },
  ];

  // Convert polar coordinates (angle, radius) to cartesian (x, y)
  const getCoordinates = (angleDeg: number, distance: number) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: center + distance * Math.cos(angleRad),
      y: center + distance * Math.sin(angleRad),
    };
  };

  // Generate web concentric polygon rings (25%, 50%, 75%, 100%)
  const rings = [0.25, 0.5, 0.75, 1.0];

  const getPolygonPoints = (scale: number) => {
    return skills
      .map((s) => {
        const { x, y } = getCoordinates(s.angle, radius * scale);
        return `${x},${y}`;
      })
      .join(" ");
  };

  // Student skill data polygon points
  const dataPoints = skills
    .map((s) => {
      const score = data[s.key] || 50;
      const normalizedScore = Math.max(10, Math.min(100, score)) / 100;
      const { x, y } = getCoordinates(s.angle, radius * normalizedScore);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#0d0d14] border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between w-full mb-3">
        <h4 className="text-sm font-bold text-white tracking-tight">
          Radar de 6 Competências
        </h4>
        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/20">
          Nível {currentLevel}
        </span>
      </div>

      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="overflow-visible select-none">
          {/* Concentric Grid Rings */}
          {rings.map((scale, idx) => (
            <polygon
              key={idx}
              points={getPolygonPoints(scale)}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={idx === rings.length - 1 ? "1.5" : "1"}
              strokeDasharray={idx < rings.length - 1 ? "3 3" : undefined}
            />
          ))}

          {/* Radial Spokes from Center */}
          {skills.map((s, idx) => {
            const { x, y } = getCoordinates(s.angle, radius);
            return (
              <line
                key={idx}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
            );
          })}

          {/* Student Filled Data Polygon Area */}
          <polygon
            points={dataPoints}
            fill="url(#radarGradient)"
            stroke="#f59e0b"
            strokeWidth="2.5"
            className="transition-all duration-700 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]"
          />

          {/* Skill Data Point Dots */}
          {skills.map((s, idx) => {
            const score = data[s.key] || 50;
            const normalizedScore = Math.max(10, Math.min(100, score)) / 100;
            const { x, y } = getCoordinates(s.angle, radius * normalizedScore);
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="4"
                fill="#f59e0b"
                stroke="#0d0d14"
                strokeWidth="2"
                className="transition-all duration-700"
              />
            );
          })}

          {/* Skill Axis Text Labels */}
          {skills.map((s, idx) => {
            const { x, y } = getCoordinates(s.angle, radius + 20);
            return (
              <text
                key={idx}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#a1a1aa"
                fontSize="10"
                fontFamily="inherit"
                fontWeight="600"
              >
                {s.label} ({data[s.key]}%)
              </text>
            );
          })}

          {/* SVG Gradient Definition */}
          <defs>
            <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.15" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="text-[11px] text-zinc-400 mt-2 text-center font-normal">
        Média geral: <strong className="text-white font-mono">{Math.round((data.speaking + data.vocabulary + data.listening + data.grammar + data.reading + data.writing) / 6)}%</strong> de proficiência
      </div>
    </div>
  );
}
