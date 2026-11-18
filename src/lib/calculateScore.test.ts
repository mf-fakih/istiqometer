import { describe, expect, it } from "vitest";
import { QUESTIONS } from "@/data/questions";
import {
  POINTS,
  aspectScores,
  calculateResult,
  formatScore,
  isComplete,
  totalScore,
} from "@/lib/calculateScore";
import { RESULT_CATEGORIES, getResultCategory } from "@/lib/resultCategories";
import type { AnswerKey, Answers } from "@/types/quiz";

const all = (k: AnswerKey): Answers => Array(10).fill(k);
const fromString = (s: string): Answers => s.split("") as AnswerKey[];

describe("quiz content", () => {
  it("has exactly 10 questions in order with 4 options A–D each", () => {
    expect(QUESTIONS).toHaveLength(10);
    QUESTIONS.forEach((q, i) => {
      expect(q.id).toBe(i + 1);
      expect(q.options.map((o) => o.key)).toEqual(["A", "B", "C", "D"]);
    });
  });

  it("maps Q1–Q3 to ibadah, Q4–Q7 to belajar, Q8–Q10 to disiplin", () => {
    expect(QUESTIONS.map((q) => q.aspect)).toEqual([
      "ibadah", "ibadah", "ibadah",
      "belajar", "belajar", "belajar", "belajar",
      "disiplin", "disiplin", "disiplin",
    ]);
  });
});

describe("points", () => {
  it("uses A=10, B=7, C=4, D=1", () => {
    expect(POINTS).toEqual({ A: 10, B: 7, C: 4, D: 1 });
  });

  it("max is 100 and min is 10", () => {
    expect(calculateResult(all("A")).total).toBe(100);
    expect(calculateResult(all("D")).total).toBe(10);
  });

  it("matches the brief's worked example (67)", () => {
    // 10,7,7,10,7,4,4,7,4,7
    expect(totalScore(fromString("ABBABCCBCB"))).toBe(67);
  });
});

describe("aspect normalization", () => {
  it("normalizes per aspect max (30 / 40 / 30)", () => {
    const aspects = aspectScores(all("A"));
    expect(aspects.map((a) => a.max)).toEqual([30, 40, 30]);
    expect(aspects.every((a) => a.normalized === 100)).toBe(true);
  });

  it("matches brief example 80 / 62.5 / 60", () => {
    // Ibadah 24: A,B,B → 10+7+7. Belajar 25: A,B,C,C → 10+7+4+4.
    // Disiplin 18: B,C,B → 7+4+7.
    const r = calculateResult(fromString("ABBABCCBCB"));
    expect(r.aspects.map((a) => a.points)).toEqual([24, 25, 18]);
    expect(r.aspects.map((a) => a.normalized)).toEqual([80, 62.5, 60]);
    // overall stays raw sum, not the sum/average of normalized scores
    expect(r.total).toBe(67);
  });

  it("never double counts: aspect points sum to total", () => {
    const answers = fromString("DCBADCBADC");
    const r = calculateResult(answers);
    expect(r.aspects.reduce((s, a) => s + a.points, 0)).toBe(r.total);
  });
});

describe("result categories", () => {
  it("covers every integer 10..100 exactly once", () => {
    for (let s = 10; s <= 100; s++) {
      const matches = RESULT_CATEGORIES.filter((c) => s >= c.min && s <= c.max);
      expect(matches).toHaveLength(1);
    }
  });

  it.each([
    [100, "The Consistency Legend"],
    [90, "The Consistency Legend"],
    [89, "Santri Produktif"],
    [80, "Santri Produktif"],
    [79, "Si Rajin Terstruktur"],
    [70, "Si Rajin Terstruktur"],
    [69, "Lumayan Konsisten"],
    [60, "Lumayan Konsisten"],
    [59, "The Procrastinator"],
    [40, "The Procrastinator"],
    [39, "Loading Santri..."],
    [10, "Loading Santri..."],
  ])("score %i → %s", (score, title) => {
    expect(getResultCategory(score).title).toBe(title);
  });

  it("rejects out-of-range scores", () => {
    expect(() => getResultCategory(9)).toThrow();
    expect(() => getResultCategory(101)).toThrow();
  });
});

describe("completion guard", () => {
  it("refuses to calculate with unanswered questions", () => {
    const partial: Answers = [...all("A").slice(0, 9), null];
    expect(isComplete(partial)).toBe(false);
    expect(() => calculateResult(partial)).toThrow();
    expect(() => calculateResult([])).toThrow();
  });

  it("changing an answer updates the result", () => {
    const a = all("A");
    const b = [...a];
    b[9] = "D";
    expect(calculateResult(a).total - calculateResult(b).total).toBe(9);
    expect(calculateResult(b).aspects[2].points).toBe(21);
  });
});

describe("strongest / weakest", () => {
  it("picks highest and lowest normalized aspect", () => {
    // ibadah all A (100), belajar all C (40), disiplin all B (70)
    const r = calculateResult(fromString("AAACCCCBBB"));
    expect(r.strongest.id).toBe("ibadah");
    expect(r.weakest.id).toBe("belajar");
  });

  it("compares normalized, not raw points", () => {
    // belajar raw 28/40 = 70; disiplin raw 24/30 = 80
    const r = calculateResult(fromString("DDDBBBBAAC"));
    expect(r.aspects[1].points).toBe(28);
    expect(r.aspects[2].points).toBe(24);
    expect(r.strongest.id).toBe("disiplin");
    expect(r.weakest.id).toBe("ibadah");
  });

  it("resolves ties deterministically and never picks the same aspect twice", () => {
    const r = calculateResult(all("B"));
    expect(r.strongest.id).toBe("ibadah");
    expect(r.weakest.id).toBe("disiplin");
    // tie between belajar & disiplin at the top
    const t = calculateResult(fromString("DDDAAAAAAA"));
    expect(t.strongest.id).toBe("belajar");
    expect(t.weakest.id).toBe("ibadah");
  });
});

describe("formatScore", () => {
  it("formats integers and one-decimal values", () => {
    expect(formatScore(80)).toBe("80");
    expect(formatScore(62.5)).toBe("62.5");
    expect(formatScore(100 / 3)).toBe("33.3");
  });
});
