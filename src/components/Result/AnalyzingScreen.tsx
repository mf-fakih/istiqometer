"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import Meter from "@/components/Meter";
import { formatScore } from "@/lib/calculateScore";
import type { QuizResult } from "@/types/quiz";

export default function AnalyzingScreen({ result }: { result: QuizResult }) {
  const reduce = useReducedMotion();
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSettled(true), reduce ? 200 : 1300);
    return () => clearTimeout(t);
  }, [reduce]);

  // Every line reports a real computed number — nothing here is filler data.
  const lines = [
    ...result.aspects.map((a) => ({ k: `Memeriksa ${a.label.toLowerCase()}`, v: `${a.points}/${a.max}` })),
    { k: "Menjumlahkan poin", v: `${result.total}/100` },
    { k: "Normalisasi aspek", v: result.aspects.map((a) => formatScore(a.normalized)).join(" · ") },
  ];

  return (
    <motion.main
      className="analyzing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      aria-busy="true"
    >
      <header className="chrome">
        <span className="brand">
          ISTIQOMETER<sup>®</sup>
        </span>
        <span className="tech">Status: analyzing</span>
      </header>
      <div className="analyzing__body">
        <div className="analyzing__meter">
          <div className="halftone" aria-hidden="true" />
          <Meter
            value={settled ? result.total : 50}
            mode={settled ? "reading" : "scan"}
            readout={settled ? String(result.total) : "SCAN"}
            label={settled ? "TERBACA" : "MEMBACA JAWABAN"}
            showFill={settled}
          />
        </div>
        <div className="analyzing__log">
          <h1 className="analyzing__title" role="status">
            Analyzing your habits<span className="blink">...</span>
          </h1>
          <ul className="log">
            {lines.map((l, i) => (
              <motion.li
                key={l.k}
                initial={reduce ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.32, duration: 0.3 }}
              >
                <span>{l.k}</span>
                <span>{l.v}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.main>
  );
}
