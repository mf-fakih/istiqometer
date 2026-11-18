import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--f-display",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const body = Inter({
  variable: "--f-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ISTIQOMETER® — The Santri Habit Check",
  description:
    "Katanya rajin. Mari kita verifikasi. Kuis 10 pertanyaan tentang konsistensi ibadah, belajar, dan kedisiplinan.",
};

export const viewport: Viewport = {
  themeColor: "#101010",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
