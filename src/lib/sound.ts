// Tiny synthesized UI sounds. No audio files, never autoplays:
// the AudioContext is only created after the user turns sound on.

type Cue = "select" | "next" | "back" | "scan" | "reveal";

let ctx: AudioContext | null = null;
let enabled = false;

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (on && !ctx && typeof window !== "undefined") {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (on && ctx?.state === "suspended") void ctx.resume();
}

export function isSoundEnabled() {
  return enabled;
}

function blip(freq: number, start: number, dur: number, type: OscillatorType = "square", gain = 0.04) {
  if (!ctx) return;
  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export function play(cue: Cue) {
  if (!enabled || !ctx) return;
  switch (cue) {
    case "select":
      blip(880, 0, 0.06);
      blip(1320, 0.05, 0.08);
      break;
    case "next":
      blip(520, 0, 0.07, "triangle", 0.06);
      break;
    case "back":
      blip(360, 0, 0.07, "triangle", 0.06);
      break;
    case "scan":
      for (let i = 0; i < 6; i++) blip(300 + i * 120, i * 0.09, 0.06, "sawtooth", 0.025);
      break;
    case "reveal":
      blip(660, 0, 0.12, "triangle", 0.07);
      blip(990, 0.1, 0.18, "triangle", 0.07);
      blip(1320, 0.22, 0.3, "triangle", 0.05);
      break;
  }
}
