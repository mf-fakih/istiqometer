"use client";

import { motion, type Variants } from "framer-motion";
import type { AnswerOption as Option } from "@/types/quiz";

export const optionVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

interface Props {
  name: string;
  option: Option;
  checked: boolean;
  onSelect: () => void;
}

export default function AnswerOption({ name, option, checked, onSelect }: Props) {
  return (
    <motion.label className="option" data-checked={checked} variants={optionVariants}>
      <input type="radio" name={name} value={option.key} checked={checked} onChange={onSelect} />
      <span className="option__fill" aria-hidden="true" />
      <span className="option__key" aria-hidden="true">
        {option.key}
      </span>
      <span className="option__text">{option.text}</span>
      <span className="option__box" aria-hidden="true">
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path d="M1 5.2 4.3 8.4 11 1.4" stroke="#B7F34A" strokeWidth="2.2" strokeLinecap="square" />
        </svg>
      </span>
    </motion.label>
  );
}
