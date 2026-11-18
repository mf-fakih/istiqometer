"use client";

import { motion, useReducedMotion } from "framer-motion";
import { formatScore } from "@/lib/calculateScore";
import type { QuizResult } from "@/types/quiz";

export default function AspectBreakdown({ result }: { result: QuizResult }) {
  const reduce = useReducedMotion();
  const balanced = result.strongest.normalized === result.weakest.normalized;
  return (
    // Trigger lives on the container: a scaleX(0) bar has no area, so it
    // would never register as "in view" itself.
    <motion.div
      className="aspects"
      role="list"
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {result.aspects.map((a, i) => {
        const tag = balanced
          ? undefined
          : a.id === result.strongest.id
            ? "strong"
            : a.id === result.weakest.id
              ? "weak"
              : undefined;
        return (
          <div key={a.id} className="aspect" role="listitem" data-tag={tag}>
            <div>
              <div className="aspect__name">{a.label}</div>
              <span className="aspect__raw tech">
                {a.points} / {a.max} poin
              </span>
            </div>
            <div className="aspect__bar" aria-hidden="true">
              <motion.div
                className="aspect__bar-fill"
                variants={{
                  hidden: { scaleX: 0 },
                  show: {
                    scaleX: a.normalized / 100,
                    transition: { duration: reduce ? 0 : 1, delay: reduce ? 0 : i * 0.12, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              />
              <span className="aspect__ticks" />
            </div>
            <div>
              <div className="aspect__val">
                {formatScore(a.normalized)}
                <span className="sr-only"> dari 100</span>
              </div>
              <span className="aspect__tag tech">
                {tag === "strong" ? "Paling kuat" : tag === "weak" ? "Perlu ditingkatkan" : "Skala 0–100"}
              </span>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
