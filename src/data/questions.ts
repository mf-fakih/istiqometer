import type { AspectId, Question } from "@/types/quiz";

export const ASPECTS: Record<
  AspectId,
  { label: string; mode: string; index: string; questions: [number, number] }
> = {
  ibadah: { label: "Ibadah", mode: "DEVOTION MODE", index: "01", questions: [1, 3] },
  belajar: { label: "Belajar", mode: "KNOWLEDGE MODE", index: "02", questions: [4, 7] },
  disiplin: { label: "Kedisiplinan", mode: "DISCIPLINE MODE", index: "03", questions: [8, 10] },
};

export const ASPECT_ORDER: AspectId[] = ["ibadah", "belajar", "disiplin"];

// FINAL PRODUCT CONTENT — do not edit questions, order or option text.
export const QUESTIONS: Question[] = [
  {
    id: 1,
    aspect: "ibadah",
    text: "Seberapa konsisten kamu menjalankan ibadah harian?",
    hint: "Jawab jujur. Yang tahu cuma kamu dan Yang Maha Tahu.",
    options: [
      { key: "A", text: "Alhamdulillah, sudah menjadi kebiasaan.", reaction: "AUTOPILOT KEBAIKAN: ON." },
      { key: "B", text: "Umumnya konsisten, sesekali terlewat.", reaction: "SINYAL KUAT, KADANG PUTUS." },
      { key: "C", text: "Masih sering perlu diingatkan.", reaction: "REMINDER MANUSIA: AKTIF." },
      { key: "D", text: "Masih dalam proses membangun kebiasaan.", reaction: "UNDER CONSTRUCTION. SEMANGAT." },
    ],
  },
  {
    id: 2,
    aspect: "ibadah",
    text: "Bagaimana kebiasaan membaca Al-Qur'an?",
    hint: "Mushaf di rak juga butuh perhatian.",
    options: [
      { key: "A", text: "Punya waktu rutin setiap hari.", reaction: "JADWAL TERKUNCI. MANTAP." },
      { key: "B", text: "Cukup sering, meski belum konsisten.", reaction: "FREKUENSI: LUMAYAN TINGGI." },
      { key: "C", text: "Biasanya ketika ada kegiatan mengaji.", reaction: "MODE EVENT-BASED TERDETEKSI." },
      { key: "D", text: "Masih sering lupa membuka mushaf.", reaction: "MUSHAF MENUNGGU DIBUKA." },
    ],
  },
  {
    id: 3,
    aspect: "ibadah",
    text: "Bagaimana kamu menjaga kebiasaan ibadah sunnah atau amalan tambahan?",
    hint: "Bonus stage. Tidak wajib, tapi skornya terasa.",
    options: [
      { key: "A", text: "Punya rutinitas yang cukup konsisten.", reaction: "EXTRA MILE UNLOCKED." },
      { key: "B", text: "Dilakukan beberapa kali dalam seminggu.", reaction: "PROGRESS MINGGUAN: TERCATAT." },
      { key: "C", text: "Dilakukan sesekali.", reaction: "SESEKALI JUGA DIHITUNG." },
      { key: "D", text: "Belum menjadi kebiasaan.", reaction: "SLOT KOSONG. MASIH BISA DIISI." },
    ],
  },
  {
    id: 4,
    aspect: "belajar",
    text: "Seberapa rutin kamu mengulang pelajaran atau hafalan?",
    hint: "Murajaah: musuh alami lupa.",
    options: [
      { key: "A", text: "Setiap hari punya jadwal murajaah atau belajar.", reaction: "MEMORI: TERAWAT RAPI." },
      { key: "B", text: "Beberapa kali dalam seminggu.", reaction: "CACHE MASIH HANGAT." },
      { key: "C", text: "Biasanya ketika ada ujian atau setoran.", reaction: "SISTEM KEBUT SEMALAM TERDETEKSI." },
      { key: "D", text: "Belajar ketika keadaan sudah darurat.", reaction: "SIRENE DARURAT: MENYALA." },
    ],
  },
  {
    id: 5,
    aspect: "belajar",
    text: "Kalau ustaz atau guru menjelaskan pelajaran, bagaimana kamu memperhatikan?",
    hint: "Fisik di kelas. Pikiran di mana?",
    options: [
      { key: "A", text: "Fokus dan mencatat hal penting.", reaction: "MODE NOTULEN: AKTIF." },
      { key: "B", text: "Cukup memperhatikan, kadang terdistraksi.", reaction: "FOKUS 70%. SISANYA JENDELA." },
      { key: "C", text: "Sering kehilangan fokus.", reaction: "SINYAL LEMAH. MENCARI JARINGAN..." },
      { key: "D", text: "Pikiran sudah jalan-jalan ke kantin.", reaction: "LOKASI PIKIRAN: KANTIN." },
    ],
  },
  {
    id: 6,
    aspect: "belajar",
    text: "Bagaimana kebiasaan mengerjakan tugas?",
    hint: "Deadline bukan musuh. Kecuali kalau tinggal satu jam.",
    options: [
      { key: "A", text: "Dikerjakan jauh sebelum deadline.", reaction: "DEADLINE? BELUM KENAL." },
      { key: "B", text: "Dikerjakan secara bertahap.", reaction: "CICIL TERUS, AMAN TERUS." },
      { key: "C", text: "Sering dikerjakan mendekati deadline.", reaction: "DEADLINE APPROACHING..." },
      { key: "D", text: "Deadline adalah alarm kehidupan.", reaction: "ADRENALIN: SUMBER ENERGI UTAMA." },
    ],
  },
  {
    id: 7,
    aspect: "belajar",
    text: "Ketika menemukan materi yang sulit dipahami, apa yang kamu lakukan?",
    hint: "Bab paling tebal biasanya yang paling keluar.",
    options: [
      { key: "A", text: "Mencari penjelasan sampai paham.", reaction: "RASA PENASARAN: LEVEL DETEKTIF." },
      { key: "B", text: "Bertanya kepada teman atau guru.", reaction: "MALU BERTANYA? TIDAK DI SINI." },
      { key: "C", text: "Mencoba sendiri, tetapi kadang menyerah.", reaction: "USAHA TERCATAT. JANGAN BERHENTI." },
      { key: "D", text: "Berharap materi itu tidak keluar saat ujian.", reaction: "STRATEGI: DOA DAN HARAPAN." },
    ],
  },
  {
    id: 8,
    aspect: "disiplin",
    text: "Bagaimana kebiasaan bangun pagi?",
    hint: "Subuh tidak menunggu siapa pun.",
    options: [
      { key: "A", text: "Bangun sesuai jadwal.", reaction: "EARLY BIRD DETECTED." },
      { key: "B", text: "Bangun setelah satu atau dua alarm.", reaction: "ALARM SYSTEM: UNDER NEGOTIATION." },
      { key: "C", text: "Perlu beberapa kali dibangunkan.", reaction: "TIM PENJEMPUT: DIKERAHKAN." },
      { key: "D", text: "Alarm dan saya punya hubungan yang rumit.", reaction: "STATUS ALARM: IT'S COMPLICATED." },
    ],
  },
  {
    id: 9,
    aspect: "disiplin",
    text: "Bagaimana kamu menjalankan tugas piket atau tanggung jawab kamar?",
    hint: "Sapu tidak bisa berjalan sendiri.",
    options: [
      { key: "A", text: "Menjalankan sesuai jadwal tanpa diingatkan.", reaction: "KAMAR BERSIH, HATI TENANG." },
      { key: "B", text: "Menjalankan, meskipun kadang terlambat.", reaction: "TELAT DIKIT, YANG PENTING BERES." },
      { key: "C", text: "Sering menunggu diingatkan.", reaction: "RESPONSIBILITY SEARCHING..." },
      { key: "D", text: "Mendadak menghilang ketika jadwal piket.", reaction: "SKILL BARU: MODE NINJA." },
    ],
  },
  {
    id: 10,
    aspect: "disiplin",
    text: "Seberapa konsisten kamu mengikuti jadwal kegiatan pesantren?",
    hint: "Pertanyaan terakhir. Bel sudah berbunyi.",
    options: [
      { key: "A", text: "Berusaha hadir tepat waktu.", reaction: "ABSEN: HADIR, TEPAT WAKTU." },
      { key: "B", text: "Biasanya tepat waktu, sesekali terlambat.", reaction: "JAM KARET: VERSI RINGAN." },
      { key: "C", text: "Masih sering terlambat.", reaction: "TIMEZONE PRIBADI TERDETEKSI." },
      { key: "D", text: "Jadwal dan saya belum menemukan kesepakatan.", reaction: "NEGOSIASI JADWAL: BUNTU." },
    ],
  },
];
