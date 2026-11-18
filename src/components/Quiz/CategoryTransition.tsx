"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ASPECTS } from "@/data/questions";
import type { AspectId } from "@/types/quiz";

const SUBS: Record<AspectId, string> = {
  ibadah: "Tiga pertanyaan tentang rutinitas ibadah harian. Bukan soal iman, soal kebiasaan.",
  belajar: "Empat pertanyaan tentang murajaah, fokus di kelas, dan hubunganmu dengan deadline.",
  disiplin: "Tiga pertanyaan terakhir: alarm, piket, dan jadwal kegiatan.",
};

export default function CategoryTransition({ aspect }: { aspect: AspectId }) {
  const reduce = useReducedMotion();
  const a = ASPECTS[aspect];
  const ease = [0.76, 0, 0.24, 1] as const;

  return (
    <motion.div
      className="cat-overlay"
      role="status"
      aria-live="assertive"
      initial={reduce ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" }}
      animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
      exit={reduce ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="halftone" aria-hidden="true" />
      <div className="cat-overlay__row">
        <span>ISTIQOMETER®</span>
        <span>
          Kategori {a.index} / 03
        </span>
      </div>
      <div className="cat-overlay__main">
        <motion.div
          className="cat-overlay__num"
          initial={reduce ? false : { y: "40%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          {a.index}
        </motion.div>
        <motion.div
          className="cat-overlay__title"
          initial={reduce ? false : { x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          Category {a.index} — {a.mode}
        </motion.div>
        <p className="cat-overlay__sub">
          {a.label}. {SUBS[aspect]}
        </p>
      </div>
      <div className="cat-overlay__row">
        <span>Q{String(a.questions[0]).padStart(2, "0")}–Q{String(a.questions[1]).padStart(2, "0")}</span>
        <span>Be honest</span>
      </div>
    </motion.div>
  );
}
