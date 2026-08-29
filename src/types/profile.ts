export type CEFRLevel = "A1" | "A2" | "B1" | "B1+" | "B2" | "C1" | "C2";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  currentLevel: CEFRLevel;
  targetLevel: CEFRLevel;
  dailyGoalMinutes: number;
  streakDays: number;
  xpPoints: number;
  interests: string[];
  role: "learner" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface SkillRadarData {
  speaking: number; // 0 - 100
  vocabulary: number;
  listening: number;
  grammar: number;
  reading: number;
  writing: number;
}
