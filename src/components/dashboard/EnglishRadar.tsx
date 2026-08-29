"use client";

import React from "react";
import { SkillRadarData } from "@/types/profile";

interface EnglishRadarProps {
  data: SkillRadarData;
  size?: number;
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

  const getCoordinates = (angle: number, valueRatio: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    const r = radius * valueRatio;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  // Concentric web rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // User polygon path
  const points = skills
    .map((s) => {
      const val = data[s.key] / 100;
      const { x, y } = getCoordinates(s.angle, val);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
          </linearGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Concentric grid rings */}
        {rings.map((ringRatio, i) => {
          const ringPoints = skills
            .map((s) => {
              const { x, y } = getCoordinates(s.angle, ringRatio);
              return `${x},${y}`;
            })
            .join(" ");

          return (
            <polygon
              key={i}
              points={ringPoints}
              fill="none"
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray={i === rings.length - 1 ? "none" : "3 3"}
              opacity={0.6}
            />
          );
        })}

        {/* Radial axis lines */}
        {skills.map((s, i) => {
          const { x, y } = getCoordinates(s.angle, 1.0);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#334155"
              strokeWidth="1"
              opacity={0.7}
            />
          );
        })}

        {/* User Data Polygon */}
        <polygon
          points={points}
          fill="url(#radarGradient)"
          stroke="#818cf8"
          strokeWidth="2.5"
          filter="url(#radarGlow)"
        />

        {/* Vertex dots and Labels */}
        {skills.map((s, i) => {
          const val = data[s.key] / 100;
          const { x: vx, y: vy } = getCoordinates(s.angle, val);
          const { x: lx, y: ly } = getCoordinates(s.angle, 1.25);

          return (
            <g key={i}>
              <circle
                cx={vx}
                cy={vy}
                r="4.5"
                fill="#ffffff"
                stroke="#6366f1"
                strokeWidth="2"
                className="transition-all duration-300"
              />
              <text
                x={lx}
                y={ly + 4}
                textAnchor="middle"
                className="text-[11px] font-bold fill-slate-300 select-none"
              >
                {s.label}
              </text>
              <text
                x={lx}
                y={ly + 16}
                textAnchor="middle"
                className="text-[10px] font-medium fill-indigo-400 select-none"
              >
                {data[s.key]}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
