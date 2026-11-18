import { forwardRef } from "react";
import { formatScore } from "@/lib/calculateScore";
import type { QuizResult } from "@/types/quiz";

interface Props {
  result: QuizResult;
  site: string;
}

/** Collectible 1080×1350 poster. Static: no animation, so exports are clean. */
const ShareCard = forwardRef<HTMLDivElement, Props>(function ShareCard({ result, site }, ref) {
  return (
    <div ref={ref} className="poster">
      <div className="poster__dots" />
      <div className="poster__top">
        <div>
          <div className="poster__brand">
            ISTIQOMETER<sup>®</sup>
          </div>
          <div className="poster__tag">THE SANTRI HABIT CHECK</div>
        </div>
        <div className="poster__file">
          LAPORAN HASIL
          <br />
          PEMERIKSAAN
        </div>
      </div>
      <div className="poster__rule" />
      <div className="poster__score">
        <span className="poster__n">{result.total}</span>
        <span className="poster__max">/100</span>
        <span className="poster__stamp">TERVERIFIKASI</span>
      </div>
      <div style={{ alignSelf: "end" }}>
        <h3 className="poster__title">{result.category.title}</h3>
        <p className="poster__line">{result.category.shareLine}</p>
        <div className="poster__aspects">
          {result.aspects.map((a) => (
            <div key={a.id} className="poster__aspect">
              <div className="poster__aspect-name">{a.label}</div>
              <div className="poster__aspect-val">{formatScore(a.normalized)}</div>
              <div className="poster__aspect-bar">
                <i style={{ width: `${a.normalized}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="poster__foot">
        <span>
          Katanya rajin? <b>Verifikasi.</b>
        </span>
        <span>{site}</span>
      </div>
    </div>
  );
});

export default ShareCard;
