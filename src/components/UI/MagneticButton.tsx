"use client";

import { useRef, type ButtonHTMLAttributes, type PointerEvent } from "react";

/** Pulls gently toward the pointer on fine-pointer devices only. */
export default function MagneticButton({
  children,
  style,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);

  const canMagnet = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el || !canMagnet()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.32;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <button
      ref={ref}
      type="button"
      {...props}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </button>
  );
}
