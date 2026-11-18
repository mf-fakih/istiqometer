import { ASPECT_ORDER, ASPECTS, QUESTIONS } from "@/data/questions";
import { getResultCategory } from "@/lib/resultCategories";
import type { AnswerKey, Answers, AspectScore, Question, QuizResult } from "@/types/quiz";

export const POINTS: Record<AnswerKey, number> = { A: 10, B: 7, C: 4, D: 1 };

export function isComplete(answers: Answers, questions: Question[] = QUESTIONS): boolean {
  return answers.length === questions.length && answers.every((a) => a !== null);
}

export function totalScore(answers: Answers): number {
  return answers.reduce<number>((sum, a) => sum + (a ? POINTS[a] : 0), 0);
}

export function aspectScores(answers: Answers, questions: Question[] = QUESTIONS): AspectScore[] {
  return ASPECT_ORDER.map((id) => {
    let points = 0;
    let max = 0;
    questions.forEach((q, i) => {
      if (q.aspect !== id) return;
      max += POINTS.A;
      const a = answers[i];
      if (a) points += POINTS[a];
    });
    return {
      id,
      label: ASPECTS[id].label,
      points,
      max,
      normalized: max === 0 ? 0 : (points / max) * 100,
    };
  });
}

/**
 * Tie-break is deterministic: on equal normalized score, the aspect that comes
 * first in ASPECT_ORDER (Ibadah → Belajar → Kedisiplinan) wins for strongest,
 * and the one that comes last wins for weakest — so strongest and weakest are
 * never the same aspect.
 */
export function pickStrongest(aspects: AspectScore[]): AspectScore {
  return aspects.reduce((best, a) => (a.normalized > best.normalized ? a : best));
}

export function pickWeakest(aspects: AspectScore[]): AspectScore {
  return aspects.reduceRight((worst, a) => (a.normalized < worst.normalized ? a : worst));
}

export function calculateResult(answers: Answers, questions: Question[] = QUESTIONS): QuizResult {
  if (!isComplete(answers, questions)) {
    throw new Error("Cannot calculate a result before every question is answered.");
  }
  const total = totalScore(answers);
  const aspects = aspectScores(answers, questions);
  return {
    total,
    aspects,
    strongest: pickStrongest(aspects),
    weakest: pickWeakest(aspects),
    category: getResultCategory(total),
  };
}

/** Display helper: 62.5 → "62.5", 80 → "80". */
export function formatScore(n: number): string {
  return Number.isInteger(n) ? String(n) : (Math.round(n * 10) / 10).toString();
}
