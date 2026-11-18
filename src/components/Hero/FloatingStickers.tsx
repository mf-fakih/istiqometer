"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";

interface Sticker {
  text: string;
  variant: "lime" | "paper" | "solid" | "ghost";
  style: CSSProperties & Record<`--${string}`, string>;
  hideSm?: boolean;
}

// Placed like rubber stamps on an inspection file: around the meter,
// never on top of the headline or CTA.
const STICKERS: Sticker[] = [
  { text: "PRODUCTIVITY.EXE", variant: "solid", style: { top: "9%", right: "38%", "--r": "-6deg", "--d": "18px" } },
  { text: "SYSTEM STATUS: WAITING", variant: "lime", style: { top: "16%", right: "4%", "--r": "4deg", "--d": "-12px" } },
  { text: "MAGER LEVEL: UNKNOWN", variant: "paper", style: { top: "47%", right: "2%", "--r": "-3deg", "--d": "22px" }, hideSm: true },
  { text: "PROCRASTINATION DETECTED", variant: "ghost", style: { bottom: "34%", right: "27%", "--r": "7deg", "--d": "-16px" }, hideSm: true },
  { text: "HONESTY REQUIRED", variant: "lime", style: { bottom: "13%", right: "6%", "--r": "-9deg", "--d": "14px" }, hideSm: true },
  { text: "SCAN YOUR HABITS", variant: "paper", style: { top: "4%", left: "52%", "--r": "2deg", "--d": "-20px" }, hideSm: true },
];

export default function FloatingStickers({ booting }: { booting: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="hero__stickers" aria-hidden="true">
      {STICKERS.map((s, i) => (
        <span
          key={s.text}
          className={`sticker ${i % 2 ? "float" : ""} ${s.hideSm ? "sticker--hide-sm" : ""}`}
          style={{ ...s.style, animationDelay: `${i * -1.3}s` }}
        >
          <motion.span
            className={`stamp stamp--${s.variant}`}
            initial={reduce ? false : { opacity: 0, scale: 1.6 }}
            animate={{ opacity: booting ? 0 : 1, scale: 1 }}
            transition={{
              duration: booting ? 0.25 : 0.35,
              delay: booting ? 0 : 1.1 + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {s.text}
          </motion.span>
        </span>
      ))}
    </div>
  );
}
