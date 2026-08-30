import { CEFRLevel } from "./profile";

export type VocabularyStatus = "new" | "learning" | "reviewing" | "active" | "mastered" | "difficult";

export type PartOfSpeech = "noun" | "verb" | "phrasal_verb" | "adjective" | "adverb" | "connector" | "idiom";

export interface VocabularyItem {
  id: string;
  word: string;
  phoneticIpa?: string;
  translationPt: string;
  definitionEn?: string;
  partOfSpeech: PartOfSpeech;
  cefrLevel: CEFRLevel;
  exampleSentence: string;
  contextNote?: string;
  audioUrl?: string;
  tags?: string[];
  repetitionCount?: number;
  intervalDays?: number;
  easeFactor?: number;
  nextReviewDate?: string;
  status?: VocabularyStatus;
}

export interface UserVocabularyItem extends VocabularyItem {
  userVocabularyId: string;
  status: VocabularyStatus;
  retrievalScore: number; // 0 a 100
  easeFactor: number;
  intervalDays: number;
  timesSeen: number;
  timesRecalled: number;
  timesFailed: number;
  lastReviewedAt?: string;
  nextReviewAt: string;
  isFavorite: boolean;
  isDifficult: boolean;
  userExampleSentence?: string;
}

export type ReviewFormat = "recall" | "fill_blanks" | "context_clue" | "speaking" | "translation";
