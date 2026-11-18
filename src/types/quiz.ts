export type AnswerKey = "A" | "B" | "C" | "D";

export type AspectId = "ibadah" | "belajar" | "disiplin";

export interface AnswerOption {
  key: AnswerKey;
  text: string;
  /** Short meme reaction shown after the option is picked. */
  reaction: string;
}

export interface Question {
  id: number; // 1-based, matches Q1..Q10
  aspect: AspectId;
  text: string;
  hint: string; // supporting microcopy
  options: AnswerOption[];
}

/** answers[i] = answer for question index i (0-based), or null if unanswered. */
export type Answers = (AnswerKey | null)[];

export interface AspectScore {
  id: AspectId;
  label: string;
  points: number;
  max: number;
  normalized: number; // 0..100
}

export interface ResultCategory {
  min: number;
  max: number;
  title: string;
  description: string;
  shareLine: string;
}

export interface QuizResult {
  total: number; // 10..100, raw sum
  aspects: AspectScore[];
  strongest: AspectScore;
  weakest: AspectScore;
  category: ResultCategory;
}
