"use client";

import { useId } from "react";

export type MeterMode = "idle" | "scan" | "reading";

interface MeterProps {
  /** Needle position 0..100. In idle mode this is decorative only. */
  value: number;
  mode: MeterMode;
  /** Big readout text. Use "--" before a real score exists. */
  readout: string;
  label: string;
  /** Show the lime arc filled up to `value` (only for real scores). */
  showFill?: boolean;
  className?: string;
}

const CX = 200;
const CY = 210;
const R = 160;
const START = -135; // degrees from 12 o'clock
const SWEEP = 270;

const angleFor = (v: number) => START + (Math.max(0, Math.min(100, v)) / 100) * SWEEP;
const point = (deg: number, r: number) => {
  const rad = (deg * Math.PI) / 180;
  // Rounded so server and client render identical attribute strings.
  const round = (n: number) => Math.round(n * 100) / 100;
  return { x: round(CX + r * Math.sin(rad)), y: round(CY - r * Math.cos(rad)) };
};

const arcPath = (r: number) => {
  const a = point(START, r);
  const b = point(START + SWEEP, r);
  return `M ${a.x} ${a.y} A ${r} ${r} 0 1 1 ${b.x} ${b.y}`;
};
const ARC_R = R - 52;
const ARC_LEN = (SWEEP / 360) * 2 * Math.PI * ARC_R;

const TICKS = Array.from({ length: 51 }, (_, i) => i * 2);

export default function Meter({ value, mode, readout, label, showFill = false, className }: MeterProps) {
  const clipId = useId();
  const fillOffset = ARC_LEN * (1 - (showFill ? value : 0) / 100);

  return (
    <svg
      viewBox="0 0 400 400"
      className={`meter ${className ?? ""}`}
      data-mode={mode}
      role="img"
      aria-label={`${label}: ${readout}`}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx={CX} cy={CY} r={R + 26} />
        </clipPath>
      </defs>

      {/* outer bezel */}
      <circle cx={CX} cy={CY} r={R + 26} fill="#141414" stroke="rgba(244,241,232,.18)" />
      <circle className="meter__ring" cx={CX} cy={CY} r={R + 14} />

      <g clipPath={`url(#${clipId})`}>
        <rect className="meter__scanline" x={20} y={30} width={360} height={2} />
      </g>

      {/* ticks */}
      {TICKS.map((t) => {
        const major = t % 10 === 0;
        const a = angleFor(t);
        const p1 = point(a, R);
        const p2 = point(a, major ? R - 16 : R - 8);
        return (
          <line
            key={t}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            className={major ? "meter__tick meter__tick--major" : "meter__tick"}
          />
        );
      })}
      {TICKS.filter((t) => t % 20 === 0).map((t) => {
        const p = point(angleFor(t), R - 34);
        return (
          <text key={`n${t}`} x={p.x} y={p.y} className="meter__num">
            {t}
          </text>
        );
      })}

      {/* value arc */}
      <path className="meter__track" d={arcPath(ARC_R)} />
      <path
        className="meter__fill"
        d={arcPath(ARC_R)}
        style={{ strokeDasharray: ARC_LEN, strokeDashoffset: fillOffset }}
      />

      {/* red-line zone label, analog-gauge style */}
      <text x={point(angleFor(4), R + 44).x} y={point(angleFor(4), R + 44).y} className="meter__label" opacity={0.7}>
        MAGER
      </text>
      <text x={point(angleFor(96), R + 44).x} y={point(angleFor(96), R + 44).y} className="meter__label" opacity={0.7}>
        ISTIQOMAH
      </text>

      {/* needle */}
      <g className="meter__needle-wrap" style={{ transform: `rotate(${angleFor(value)}deg)` }}>
        <g className="meter__needle-idle">
          <line className="meter__needle" x1={CX} y1={CY + 22} x2={CX} y2={CY - R + 6} />
        </g>
      </g>
      <circle className="meter__hub" cx={CX} cy={CY} r={9} />

      {/* readout */}
      <text x={CX} y={CY + 92} className="meter__readout">
        {readout}
      </text>
      <text x={CX} y={CY + 116} className="meter__label">
        {label}
      </text>
    </svg>
  );
}
