import { CEFRLevel } from "./profile";

export type ConversationMode = "free" | "guided" | "roleplay" | "interview" | "debate";

export type ErrorSeverity = "critical" | "important" | "minor";

export interface ErrorCorrection {
  originalText: string;
  improvedText: string;
  explanationPt: string;
  severity: ErrorSeverity;
  category: "grammar" | "vocabulary" | "pronunciation" | "naturalness";
}

export interface ConversationMessage {
  id: string;
  sessionId: string;
  sender: "user" | "ai";
  content: string;
  audioUrl?: string;
  corrections?: ErrorCorrection[];
  timestamp: string;
}

export interface ConversationReport {
  sessionId: string;
  durationSeconds: number;
  fluencyScore: number;
  vocabularyScore: number;
  grammarScore: number;
  naturalnessScore: number;
  confidenceScore: number;
  whatYouDidWell: string[];
  whatToImprove: string[];
  extractedVocabulary: Array<{
    word: string;
    translationPt: string;
    context: string;
  }>;
  corrections: ErrorCorrection[];
}

export interface ConversationSession {
  id: string;
  userId: string;
  mode: ConversationMode;
  topic: string;
  targetLevel: CEFRLevel;
  messages: ConversationMessage[];
  report?: ConversationReport;
  createdAt: string;
}
