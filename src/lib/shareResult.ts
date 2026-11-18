import { toBlob } from "html-to-image";
import type { QuizResult } from "@/types/quiz";
import { formatScore } from "@/lib/calculateScore";

export function shareText(result: QuizResult, url: string): string {
  const aspects = result.aspects.map((a) => `${a.label} ${formatScore(a.normalized)}`).join(", ");
  return `Skor ISTIQOMETER® saya: ${result.total}/100, "${result.category.title}". ${aspects}. Katanya rajin? Verifikasi punyamu: ${url}`;
}

/** Renders the poster node to PNG after fonts are ready. */
export async function renderPoster(node: HTMLElement): Promise<Blob> {
  if (document.fonts?.ready) await document.fonts.ready;
  const blob = await toBlob(node, {
    width: 1080,
    height: 1350,
    pixelRatio: 1,
    cacheBust: true,
    backgroundColor: "#F4F1E8",
  });
  if (!blob) throw new Error("Gagal membuat gambar.");
  return blob;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function whatsappUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export type NativeShareOutcome = "shared-file" | "shared-text" | "cancelled" | "unsupported";

export async function nativeShare(blob: Blob | null, text: string, url: string): Promise<NativeShareOutcome> {
  if (typeof navigator === "undefined" || !navigator.share) return "unsupported";
  try {
    if (blob) {
      const file = new File([blob], "istiqometer-hasil.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text, title: "ISTIQOMETER®" });
        return "shared-file";
      }
    }
    await navigator.share({ text, url, title: "ISTIQOMETER®" });
    return "shared-text";
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
    return "unsupported";
  }
}
