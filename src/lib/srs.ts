export interface SRSCardState {
  repetitionCount: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewDate: string; // ISO date string
  lastReviewedDate?: string;
}

export type SRSRating = 1 | 2 | 3 | 4; // 1: Errei (Again), 2: Difícil (Hard), 3: Bom (Good), 4: Fácil (Easy)

/**
 * Implements the SuperMemo-2 (SM-2) Spaced Repetition Algorithm.
 * Recalculates repetition interval and ease factor based on learner's recall grade.
 */
export function calculateSM2(
  currentState: SRSCardState = {
    repetitionCount: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    nextReviewDate: new Date().toISOString(),
  },
  rating: SRSRating
): SRSCardState {
  let { repetitionCount, intervalDays, easeFactor } = currentState;

  // Grade mapping for SM-2 formula:
  // 1 -> 0 (Blackout / Total failure)
  // 2 -> 3 (Hard with significant hesitation)
  // 3 -> 4 (Good with minor hesitation)
  // 4 -> 5 (Perfect recall / Instant)
  const quality = {
    1: 0,
    2: 3,
    3: 4,
    4: 5,
  }[rating];

  if (quality >= 3) {
    if (repetitionCount === 0) {
      intervalDays = 1;
    } else if (repetitionCount === 1) {
      intervalDays = 3;
    } else if (repetitionCount === 2) {
      intervalDays = 7;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitionCount += 1;
  } else {
    // Failed recall: reset repetition count and review tomorrow
    repetitionCount = 0;
    intervalDays = 1;
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const now = new Date();
  const nextDate = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return {
    repetitionCount,
    intervalDays,
    easeFactor: Number(easeFactor.toFixed(2)),
    nextReviewDate: nextDate.toISOString(),
    lastReviewedDate: now.toISOString(),
  };
}

export function isDueForReview(nextReviewDateStr: string): boolean {
  if (!nextReviewDateStr) return true;
  const reviewDate = new Date(nextReviewDateStr);
  const now = new Date();
  return reviewDate <= now;
}
