import type { AspectId, ResultCategory } from "@/types/quiz";

// Ranges are inclusive and cover every integer from 10 to 100 exactly once.
export const RESULT_CATEGORIES: ResultCategory[] = [
  {
    min: 90,
    max: 100,
    title: "The Consistency Legend",
    description:
      "Kebiasaanmu jalan seperti jadwal bel pesantren: tepat, rutin, nyaris tanpa drama. Pertahankan, dan jangan lupa tetap rendah hati.",
    shareLine: "Konsistensi level jadwal bel pesantren.",
  },
  {
    min: 80,
    max: 89,
    title: "Santri Produktif",
    description:
      "Rutinitasmu sudah terbentuk dan kebanyakan berjalan mulus. Sisa sedikit celah, tapi mesinnya sudah panas.",
    shareLine: "Mesin produktif sudah panas.",
  },
  {
    min: 70,
    max: 79,
    title: "Si Rajin Terstruktur",
    description:
      "Kamu sudah punya struktur. Beberapa bagian masih goyang, tapi fondasinya kokoh. Tinggal dirapikan.",
    shareLine: "Fondasi kokoh, tinggal dirapikan.",
  },
  {
    min: 60,
    max: 69,
    title: "Lumayan Konsisten",
    description:
      "Sebagian kebiasaan sudah jalan, sebagian masih suka bolos. Kabar baiknya: kamu sudah tahu yang mana.",
    shareLine: "Sebagian jalan, sebagian masih bolos.",
  },
  {
    min: 40,
    max: 59,
    title: "The Procrastinator",
    description:
      "Kata 'nanti' sering menang voting di kepalamu. Tidak apa-apa. Mulai dari satu kebiasaan kecil, hari ini, bukan nanti.",
    shareLine: "'Nanti' masih menang voting.",
  },
  {
    min: 10,
    max: 39,
    title: "Loading Santri...",
    description:
      "Kebiasaanmu sedang di-install. Prosesnya memang pelan di awal, tapi progress bar tidak pernah mundur kalau terus dijalankan.",
    shareLine: "Sedang meng-install kebiasaan baik.",
  },
];

export function getResultCategory(total: number): ResultCategory {
  const category = RESULT_CATEGORIES.find((c) => total >= c.min && total <= c.max);
  if (!category) throw new RangeError(`Score ${total} is outside 10–100`);
  return category;
}

export const STRENGTH_FEEDBACK: Record<AspectId, string> = {
  ibadah:
    "Kebiasaan ibadahmu paling terjaga di antara ketiganya. Rutinitas seperti ini butuh usaha, jadi hargai itu.",
  belajar:
    "Konsistensi belajarmu paling stabil. Murajaah dan rasa ingin tahumu sedang bekerja.",
  disiplin:
    "Kedisiplinanmu paling solid. Bangun, piket, hadir: sistemmu jalan.",
};

export const IMPROVE_FEEDBACK: Record<AspectId, string> = {
  ibadah:
    "Ibadah harian masih naik-turun. Bukan soal kurang iman, hanya soal rutinitas yang belum terkunci.",
  belajar:
    "Belajar masih sering mepet. Otakmu tidak butuh lembur, cuma butuh jadwal kecil yang rutin.",
  disiplin:
    "Kedisiplinan masih jadi PR. Alarm, piket, dan jadwal kegiatan perlu sedikit negosiasi ulang.",
};

export const NEXT_MISSION: Record<AspectId, string> = {
  ibadah:
    "Pilih satu waktu tetap untuk membuka mushaf, meski cuma lima menit. Pasang di jam yang sama setiap hari selama tujuh hari.",
  belajar:
    "Ulang satu pelajaran selama sepuluh menit sebelum tidur. Satu materi saja, tujuh hari berturut-turut.",
  disiplin:
    "Siapkan perlengkapan besok sebelum tidur, dan taruh alarm di luar jangkauan tangan. Bangun harus berdiri dulu.",
};
