"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Meter from "@/components/Meter";
import AspectBreakdown from "@/components/Result/AspectBreakdown";
import ShareCard from "@/components/Result/ShareCard";
import SoundToggle from "@/components/UI/SoundToggle";
import { formatScore } from "@/lib/calculateScore";
import { IMPROVE_FEEDBACK, NEXT_MISSION, STRENGTH_FEEDBACK } from "@/lib/resultCategories";
import { downloadBlob, nativeShare, renderPoster, shareText, whatsappUrl } from "@/lib/shareResult";
import { play } from "@/lib/sound";
import type { QuizResult } from "@/types/quiz";

const EASE = [0.22, 1, 0.36, 1] as const;

function useCountUp(target: number, run: boolean, duration = 1400) {
  const [n, setN] = useState(run ? 0 : target);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return n;
}

interface Props {
  result: QuizResult;
  onRetake: () => void;
}

export default function ResultScreen({ result, onRetake }: Props) {
  const reduce = useReducedMotion();
  const shown = useCountUp(result.total, !reduce);
  const posterRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [site, setSite] = useState("istiqometer");
  const [canNative, setCanNative] = useState(false);

  const balanced = result.strongest.normalized === result.weakest.normalized;
  const titleWords = result.category.title.split(" ");

  useEffect(() => {
    // Client-only facts, read after mount to keep SSR markup stable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSite(window.location.host || "istiqometer");
    setCanNative(typeof navigator.share === "function");
    play("reveal");
  }, []);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 1080));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const text = () => shareText(result, typeof window !== "undefined" ? window.location.href : "");

  const withPoster = async <T,>(fn: (blob: Blob) => Promise<T>) => {
    if (!posterRef.current) return;
    setBusy(true);
    setStatus("Menyiapkan poster…");
    try {
      const blob = await renderPoster(posterRef.current);
      return await fn(blob);
    } catch {
      setStatus("Poster gagal dibuat di browser ini. Coba lagi, atau screenshot pratinjau di atas.");
    } finally {
      setBusy(false);
    }
  };

  const onDownload = () =>
    withPoster(async (blob) => {
      downloadBlob(blob, `istiqometer-${result.total}.png`);
      setStatus("Poster diunduh sebagai PNG.");
    });

  const onNative = () =>
    withPoster(async (blob) => {
      const out = await nativeShare(blob, text(), window.location.href);
      setStatus(
        out === "shared-file"
          ? "Poster dikirim ke menu bagikan."
          : out === "shared-text"
            ? "Browser ini hanya bisa membagikan teks, jadi tautan dan skormu yang dibagikan."
            : out === "cancelled"
              ? "Berbagi dibatalkan."
              : "Browser ini tidak mendukung menu bagikan. Pakai unduh poster atau WhatsApp.",
      );
    });

  const onWhatsApp = () => {
    window.open(whatsappUrl(text()), "_blank", "noopener,noreferrer");
    setStatus("WhatsApp dibuka di tab baru dengan teks skormu. Lampirkan poster yang sudah diunduh kalau mau.");
  };

  return (
    <motion.main
      className="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="chrome">
        <span className="brand">
          ISTIQOMETER<sup>®</sup>
        </span>
        <div className="chrome__mid">
          <span className="tech" style={{ color: "var(--paper)" }}>
            The Habit Report
          </span>
          <span className="tech">10 / 10 dijawab</span>
        </div>
        <SoundToggle />
      </header>

      <section className="result__head" aria-labelledby="result-title">
        <div className="result__file">
          <span className="tech" style={{ color: "var(--lime)" }}>
            Laporan hasil pemeriksaan
          </span>
          <span className="tech">Berdasarkan 10 jawabanmu</span>
        </div>

        <div className="result__score">
          <p className="score-big" aria-label={`Skor ${result.total} dari 100`}>
            <span className="score-big__n" aria-hidden="true">
              {shown}
            </span>
            <span className="score-big__max" aria-hidden="true">
              /100
            </span>
          </p>
        </div>

        <div className="result__meter">
          <div className="halftone" aria-hidden="true" />
          <Meter value={result.total} mode="reading" readout={String(result.total)} label="SKOR KONSISTENSI" showFill />
          <motion.span
            className="stamp stamp--lime result__stamp"
            initial={reduce ? false : { opacity: 0, scale: 2.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.3, ease: EASE }}
            aria-hidden="true"
          >
            Terverifikasi
          </motion.span>
        </div>

        <div className="result__titlewrap">
          <span className="tech">Kategori hasil</span>
          <h1 id="result-title" className="result__title">
            {titleWords.map((w, i) => (
              <span key={i}>
                <span className="mask" style={{ display: "inline-block" }}>
                  <motion.span
                    initial={reduce ? false : { y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 + i * 0.08, ease: EASE }}
                  >
                    {w}
                  </motion.span>
                </span>
                {i < titleWords.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>
        </div>
        <motion.p
          className="result__desc"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6, ease: EASE }}
        >
          {result.category.description}
        </motion.p>
        <p className="result__disclaimer">
          Skor ini hanya menggambarkan konsistensi kebiasaan dari jawabanmu. Bukan ukuran keimanan, kesalehan,
          atau nilai dirimu.
        </p>
      </section>

      <div className="section-head">
        <h2>Rincian aspek</h2>
        <span className="tech">Dinormalisasi ke skala 0–100</span>
      </div>
      <AspectBreakdown result={result} />

      <div className="section-head">
        <h2>Catatan pemeriksa</h2>
      </div>
      <div className="verdict">
        {balanced ? (
          <div className="verdict__col" style={{ gridColumn: "1 / -1" }}>
            <span className="tech">Ketiga aspek seimbang</span>
            <h3>Semua di {formatScore(result.strongest.normalized)}</h3>
            <p>
              Ibadah, belajar, dan kedisiplinanmu ada di level yang sama. Tidak ada yang tertinggal jauh, jadi
              misi di bawah diambil dari aspek kedisiplinan sebagai titik mulai.
            </p>
          </div>
        ) : (
          <>
            <div className="verdict__col">
              <span className="tech" style={{ color: "var(--lime)" }}>
                Strongest habit
              </span>
              <h3>
                {result.strongest.label} · {formatScore(result.strongest.normalized)}
              </h3>
              <p>{STRENGTH_FEEDBACK[result.strongest.id]}</p>
            </div>
            <div className="verdict__col">
              <span className="tech">Habit to improve</span>
              <h3>
                {result.weakest.label} · {formatScore(result.weakest.normalized)}
              </h3>
              <p>{IMPROVE_FEEDBACK[result.weakest.id]}</p>
            </div>
          </>
        )}
      </div>

      <section className="mission" aria-labelledby="mission-title">
        <div className="mission__label">
          <span className="tech">Untuk aspek {result.weakest.label.toLowerCase()}</span>
          <h2 id="mission-title">Next mission</h2>
        </div>
        <p className="mission__text">
          {NEXT_MISSION[result.weakest.id]}
          <span className="mission__check">Kecil, realistis, tujuh hari. Lalu cek ulang di sini.</span>
        </p>
        <span className="stamp" aria-hidden="true">
          Misi aktif
        </span>
      </section>

      <div className="section-head">
        <h2>Simpan buktinya</h2>
        <span className="tech">Poster 1080 × 1350</span>
      </div>
      <section className="share" aria-label="Bagikan hasil">
        <div className="share__preview">
          <div className="share__frame" ref={frameRef}>
            <div className="share__scaler" style={{ transform: `scale(${scale})` }}>
              <ShareCard ref={posterRef} result={result} site={site} />
            </div>
          </div>
        </div>
        <div className="share__actions">
          <p>
            Poster koleksi berisi skor, kategori, dan tiga aspekmu. Tidak ada data pribadi yang disimpan atau
            dikirim ke server.
          </p>
          <button type="button" className="btn-primary" onClick={onDownload} disabled={busy}>
            Unduh poster PNG <span className="arrow" aria-hidden="true">↓</span>
          </button>
          <button type="button" className="btn-line" onClick={onWhatsApp}>
            Bagikan ke WhatsApp
          </button>
          {canNative && (
            <button type="button" className="btn-line" onClick={onNative} disabled={busy}>
              Bagikan lewat perangkat
            </button>
          )}
          <p className="share__status" role="status" aria-live="polite">
            {status}
          </p>
        </div>
      </section>

      <footer className="result__end">
        <span className="brand">
          ISTIQOMETER<sup>®</sup> <span className="tech" style={{ marginLeft: 10 }}>The Santri Habit Check</span>
        </span>
        <button type="button" className="btn-primary" onClick={onRetake}>
          Ulangi investigasi <span className="arrow" aria-hidden="true">↺</span>
        </button>
      </footer>
    </motion.main>
  );
}
