"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Meter from "@/components/Meter";
import FloatingStickers from "@/components/Hero/FloatingStickers";
import MagneticButton from "@/components/UI/MagneticButton";
import Marquee from "@/components/UI/Marquee";
import SoundToggle from "@/components/UI/SoundToggle";

interface HeroProps {
  booting: boolean;
  onStart: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function HeroSection({ booting, onStart }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // Decorative needle position only — never presented as a score.
  const [sniff, setSniff] = useState(8);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--px", x.toFixed(3));
        el.style.setProperty("--py", y.toFixed(3));
        setSniff(Math.round(6 + (x + 0.5) * 30));
      });
    };
    const onLeave = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
      setSniff(8);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  const line = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { y: "105%" },
    animate: booting
      ? reduce
        ? { opacity: 0 }
        : { y: "-105%" }
      : reduce
        ? { opacity: 1 }
        : { y: "0%" },
    transition: booting
      ? { duration: 0.5, ease: [0.76, 0, 0.24, 1] as const, delay: i * 0.04 }
      : { duration: 0.9, ease: EASE, delay: 0.15 + i * 0.09 },
  });

  return (
    <motion.section
      ref={ref}
      className="hero"
      data-booting={booting}
      aria-labelledby="hero-title"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="chrome">
        <span className="brand">
          ISTIQOMETER<sup>®</sup>
        </span>
        <div className="chrome__mid">
          <span className="tech">The Santri Habit Check</span>
          <span className="tech">Unit uji konsistensi, versi 1.0</span>
        </div>
        <SoundToggle />
      </header>

      <div className="hero__stage">
        <div className="hero__meter">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.92, rotate: -8 }}
            animate={{ opacity: 1, scale: booting && !reduce ? 1.06 : 1, rotate: 0 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <div className="halftone" aria-hidden="true" />
            <Meter
              value={booting ? 50 : sniff}
              mode={booting ? "scan" : "idle"}
              readout={booting ? "SCAN" : "--"}
              label={booting ? "MEMULAI PEMERIKSAAN" : "BELUM DIUKUR"}
            />
          </motion.div>
        </div>

        <div className="hero__copy">
          <h1 id="hero-title" className="headline">
            <span className="headline__line headline__l1">
              <motion.span className="headline__inner" {...line(0)}>
                Katanya
              </motion.span>
            </span>
            <span className="headline__line headline__l2">
              <motion.span className="headline__inner" {...line(1)}>
                <span className="quote-mark" aria-hidden="true">“</span>Rajin.
                <span className="quote-mark" aria-hidden="true">”</span>
              </motion.span>
            </span>
            <svg className="headline__underline" viewBox="0 0 800 24" fill="none" aria-hidden="true">
              <motion.path
                d="M4 16 C 120 6, 260 20, 400 12 S 660 4, 796 14"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: booting ? 0 : 1 }}
                transition={{ duration: 0.8, delay: booting ? 0 : 0.9, ease: EASE }}
              />
            </svg>
            <span className="headline__line headline__l3">
              <motion.span className="headline__inner" {...line(2)}>
                Mari kita
              </motion.span>
            </span>
            <span className="headline__line headline__l4">
              <motion.span className="headline__inner" {...line(3)}>
                Verifikasi.
              </motion.span>
            </span>
          </h1>

          <motion.div
            className="hero__foot"
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: booting ? 0 : 1, y: 0 }}
            transition={{ duration: 0.6, delay: booting ? 0 : 0.75, ease: EASE }}
          >
            <MagneticButton className="btn-primary" onClick={onStart} disabled={booting}>
              {booting ? "Memindai…" : "Mulai investigasi"} <span className="arrow" aria-hidden="true">↗</span>
            </MagneticButton>
            <p className="hero__meta">
              <strong>10 pertanyaan, kira-kira 2 menit.</strong> Ibadah, belajar, kedisiplinan.
              Skornya cuma cermin kebiasaan, bukan ukuran iman.
            </p>
          </motion.div>
        </div>

        <FloatingStickers booting={booting} />
      </div>

      <Marquee />
    </motion.section>
  );
}
