"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import QuestionScreen from "@/components/Quiz/QuestionScreen";
import QuizProgress from "@/components/Quiz/QuizProgress";
import SoundToggle from "@/components/UI/SoundToggle";
import { ASPECTS, QUESTIONS } from "@/data/questions";
import type { AnswerKey, Answers } from "@/types/quiz";

interface Props {
  answers: Answers;
  index: number;
  direction: 1 | -1;
  locked: boolean; // true while a transition overlay is running
  onSelect: (key: AnswerKey) => void;
  onNext: () => void;
  onPrev: () => void;
}

const KEY_MAP: Record<string, AnswerKey> = { "1": "A", "2": "B", "3": "C", "4": "D", a: "A", b: "B", c: "C", d: "D" };

export default function QuizContainer({ answers, index, direction, locked, onSelect, onNext, onPrev }: Props) {
  const question = QUESTIONS[index];
  const answer = answers[index];
  const isLast = index === QUESTIONS.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (locked || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const onRadio = target instanceof HTMLInputElement && target.type === "radio";
      const k = e.key.toLowerCase();
      if (KEY_MAP[k]) {
        onSelect(KEY_MAP[k]);
      } else if (e.key === "Enter" && answer && target?.tagName !== "BUTTON") {
        e.preventDefault();
        onNext();
      } else if (!onRadio && e.key === "ArrowRight" && answer) {
        onNext();
      } else if (!onRadio && e.key === "ArrowLeft" && index > 0) {
        onPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, index, locked, onNext, onPrev, onSelect]);

  return (
    <motion.main
      className="quiz"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.35 } }}
    >
      <header className="chrome">
        <span className="brand">
          ISTIQOMETER<sup>®</sup>
        </span>
        <div className="chrome__mid">
          <span className="tech" style={{ color: "var(--paper)" }}>
            Question {String(index + 1).padStart(2, "0")} / {QUESTIONS.length}
          </span>
          <span className="tech">{ASPECTS[question.aspect].mode}</span>
        </div>
        <SoundToggle />
      </header>

      <QuizProgress answers={answers} index={index} />

      <div className="quiz__body">
        <AnimatePresence initial={false} custom={direction}>
          <QuestionScreen
            key={question.id}
            question={question}
            total={QUESTIONS.length}
            answer={answer}
            direction={direction}
            onSelect={onSelect}
          />
        </AnimatePresence>
      </div>

      <nav className="quiz__nav" aria-label="Navigasi pertanyaan">
        <button type="button" className="btn-ghost" onClick={onPrev} disabled={index === 0 || locked}>
          <span aria-hidden="true">←</span> Sebelumnya
        </button>
        <div className="quiz__keys tech" aria-hidden="true">
          <span><span className="kbd">1–4</span>pilih</span>
          <span><span className="kbd">↵</span>lanjut</span>
          <span><span className="kbd">←</span>kembali</span>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={onNext}
          disabled={!answer || locked}
          aria-describedby={!answer ? "next-hint" : undefined}
        >
          {isLast ? "Lihat hasil" : "Lanjut"} <span className="arrow" aria-hidden="true">↗</span>
        </button>
        <span id="next-hint" className="sr-only">
          Pilih satu jawaban dulu untuk melanjutkan.
        </span>
      </nav>
    </motion.main>
  );
}
