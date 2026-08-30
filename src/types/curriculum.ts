export type LevelCategory = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "EXAM_PREP";


export interface ExerciseItem {
  id: string;
  type: "dictation" | "fill_blanks" | "speaking_prompt" | "multiple_choice";
  question: string;
  options?: string[];
  correctAnswer?: string;
  audioPrompt?: string;
  explanationPt?: string;
}

export interface Lesson {
  id: string;
  level: LevelCategory;
  unit: number;
  title: string;
  subtitle: string;
  description: string;
  durationMinutes: number;
  xpReward: number;
  audioText: string;
  keyVocabulary: Array<{
    term: string;
    translationPt: string;
    ipa?: string;
  }>;
  exercises: ExerciseItem[];
  isCompleted?: boolean;
}
