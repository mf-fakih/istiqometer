"use client";

import { useState } from "react";
import { isSoundEnabled, play, setSoundEnabled } from "@/lib/sound";

export default function SoundToggle() {
  const [on, setOn] = useState(isSoundEnabled);

  return (
    <button
      type="button"
      className="sound-toggle tech"
      aria-pressed={on}
      onClick={() => {
        const next = !on;
        setSoundEnabled(next);
        setOn(next);
        if (next) play("select");
      }}
    >
      <span className="bars" aria-hidden="true">
        <i /><i /><i /><i />
      </span>
      {on ? "Suara: on" : "Suara: off"}
    </button>
  );
}
