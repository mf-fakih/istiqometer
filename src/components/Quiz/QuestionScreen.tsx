"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import AnswerOption from "@/components/Quiz/AnswerOption";
import { ASPECTS } from "@/data/questions";
import type { AnswerKey, Question } from "@/types/quiz";

interface Props {
  question: Question;
  total: number;
  answer: AnswerKey | null;
  direction: 1 | -1;
  onSelect: (key: AnswerKey) => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function QuestionScreen({ question, total, answer, direction, onSelect }: Props) {
  const reduce = useReducedMotion();
  const aspect = ASPECTS[question.aspect];
  const reaction = question.options.find((o) => o.key === answer)?.reaction;

  // Motion language: old screen slides + zooms out, new screen is revealed
  // through a mask from the side we're travelling toward.
  const variants = reduce
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: (d: number) => ({
          clipPath: d > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
          x: d > 0 ? 60 : -60,
        }),
        center: { clipPath: "inset(0% 0% 0% 0%)", x: 0 },
        exit: (d: number) => ({ x: d > 0 ? "-12%" : "12%", scale: 0.94, opacity: 0 }),
      };

  return (
    <motion.section
      className="qscreen"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      aria-labelledby={`q-${question.id}`}
    >
      <div className="qscreen__ask">
        <span className="qscreen__bignum" aria-hidden="true">
          {pad(question.id)}
        </span>
        <div className="qscreen__cat">
          <span className="dot" aria-hidden="true" />
          <span className="tech" style={{ color: "var(--paper)" }}>
            Kategori {aspect.index}: {aspect.label}
          </span>
          <span className="tech">
            Pertanyaan {pad(question.id)} / {pad(total)}
          </span>
        </div>
        <h2 id={`q-${question.id}`} className="qscreen__q">
          {question.text}
        </h2>
        <p className="qscreen__hint">{question.hint}</p>

        <div className="reaction-slot" aria-live="polite">
          <AnimatePresence mode="popLayout">
            {reaction && (
              <motion.span
                key={reaction}
                className="reaction"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.5, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              >
                {reaction}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.fieldset
        className="qscreen__options"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduce ? 0 : 0.06, delayChildren: reduce ? 0 : 0.28 } },
        }}
      >
        <legend className="sr-only">Pilih satu jawaban</legend>
        {question.options.map((o) => (
          <AnswerOption
            key={o.key}
            name={`q${question.id}`}
            option={o}
            checked={answer === o.key}
            onSelect={() => onSelect(o.key)}
          />
        ))}
      </motion.fieldset>
    </motion.section>
  );
}
