"use client";

import { AnimatePresence, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import HeroSection from "@/components/Hero/HeroSection";
import CategoryTransition from "@/components/Quiz/CategoryTransition";
import QuizContainer from "@/components/Quiz/QuizContainer";
import AnalyzingScreen from "@/components/Result/AnalyzingScreen";
import ResultScreen from "@/components/Result/ResultScreen";
import { QUESTIONS } from "@/data/questions";
import { calculateResult, isComplete } from "@/lib/calculateScore";
import { play } from "@/lib/sound";
import type { AnswerKey, Answers, AspectId } from "@/types/quiz";

type Stage = "hero" | "quiz" | "analyzing" | "result";

const emptyAnswers = (): Answers => QUESTIONS.map(() => null);

export default function Experience() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>("hero");
  const [booting, setBooting] = useState(false);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [overlay, setOverlay] = useState<AspectId | null>(null);
  const timers = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Result only exists once all 10 answers are in.
  const result = useMemo(() => (isComplete(answers) ? calculateResult(answers) : null), [answers]);

  const T = reduce
    ? { boot: 150, swap: 250, hold: 650, analyze: 1600 }
    : { boot: 750, swap: 520, hold: 1250, analyze: 3000 };

  const showCategory = useCallback(
    (aspect: AspectId, swap: () => void) => {
      setOverlay(aspect);
      later(swap, T.swap);
      later(() => setOverlay(null), T.hold);
    },
    [later, T.swap, T.hold],
  );

  const start = useCallback(() => {
    if (booting) return;
    play("scan");
    setBooting(true);
    later(() => {
      showCategory(QUESTIONS[0].aspect, () => {
        setStage("quiz");
        setBooting(false);
        window.scrollTo(0, 0);
      });
    }, T.boot);
  }, [booting, later, showCategory, T.boot]);

  const select = useCallback((key: AnswerKey) => {
    setAnswers((prev) => {
      if (prev[index] === key) return prev;
      const next = [...prev];
      next[index] = key;
      return next;
    });
    play("select");
  }, [index]);

  const goNext = useCallback(() => {
    if (overlay || answers[index] === null) return;
    if (index === QUESTIONS.length - 1) {
      if (!isComplete(answers)) {
        // Shouldn't happen with linear nav, but never show a result early.
        const firstMissing = answers.findIndex((a) => a === null);
        setDirection(-1);
        setIndex(firstMissing);
        return;
      }
      play("scan");
      setStage("analyzing");
      later(() => setStage("result"), T.analyze);
      return;
    }
    play("next");
    const nextIdx = index + 1;
    setDirection(1);
    if (QUESTIONS[nextIdx].aspect !== QUESTIONS[index].aspect) {
      showCategory(QUESTIONS[nextIdx].aspect, () => setIndex(nextIdx));
    } else {
      setIndex(nextIdx);
    }
  }, [answers, index, later, overlay, showCategory, T.analyze]);

  const goPrev = useCallback(() => {
    if (overlay || index === 0) return;
    play("back");
    setDirection(-1);
    setIndex(index - 1);
  }, [index, overlay]);

  const retake = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    showCategory(QUESTIONS[0].aspect, () => {
      // Reset under the overlay so the result never flashes empty.
      setAnswers(emptyAnswers());
      setIndex(0);
      setDirection(1);
      setStage("quiz");
      window.scrollTo(0, 0);
    });
  }, [showCategory]);

  return (
    <>
      <AnimatePresence mode="wait">
        {stage === "hero" && <HeroSection key="hero" booting={booting} onStart={start} />}
        {stage === "quiz" && (
          <QuizContainer
            key="quiz"
            answers={answers}
            index={index}
            direction={direction}
            locked={overlay !== null}
            onSelect={select}
            onNext={goNext}
            onPrev={goPrev}
          />
        )}
        {stage === "analyzing" && result && <AnalyzingScreen key="analyzing" result={result} />}
        {stage === "result" && result && <ResultScreen key="result" result={result} onRetake={retake} />}
      </AnimatePresence>
      <AnimatePresence>{overlay && <CategoryTransition key={overlay} aspect={overlay} />}</AnimatePresence>
    </>
  );
}
