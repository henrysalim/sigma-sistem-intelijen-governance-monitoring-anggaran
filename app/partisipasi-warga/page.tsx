"use client";

import { useState } from "react";
import {
  Search,
  Upload,
  Camera,
  MessageCircle,
  Send,
  X,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  ImagePlus,
  TrendingDown,
  Eye,
  ThumbsUp,
  FileText,
  Star,
  ChevronRight,
  Bot,
  User,
  CheckCircle2,
  Info,
} from "lucide-react";

/* ━━━━━━━━━━━━━━━━━━━━━━ PAGE ━━━━━━━━━━━━━━━━━━━━ */
export default function CitizenEngagementPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) setSearched(true);
  }

  function handleMockUpload() {
    setUploadedPhotos((prev) => [
      ...prev,
      `foto_infrastruktur_${prev.length + 1}.jpg`,
    ]);
  }

  return (
    <section className="flex flex-col gap-8">
      {/* ── Header ──────────────────────────────── */}
      <header>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-200">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600">
              Portal Warga
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Partisipasi Warga
            </h1>
          </div>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Selamat datang di portal partisipasi publik SIGMA. Di sini Anda dapat
          memeriksa transparansi daerah, melaporkan temuan di lapangan, dan
          bertanya langsung ke asisten AI kami.
        </p>
      </header>

      {/* ══════════════════════════════════════════ */}
      {/*  1 · CITIZEN ONE-STOP CHECK               */}
      {/* ══════════════════════════════════════════ */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/60 to-cyan-50/40 p-6 ring-1 ring-emerald-200 sm:p-8">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-700">
            Cek Transparansi Daerah
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Masukkan nama kabupaten/kota untuk melihat skor transparansi dan
          temuan terkini.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mt-4 flex gap-3">
          <div className="relative flex-1">
            <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Contoh: Kabupaten Bima"
              className="h-12 w-full rounded-xl border-0 bg-white pl-10 pr-4 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all hover:shadow-lg hover:shadow-emerald-300"
          >
            <Search className="h-4 w-4" />
            Cari
          </button>
        </form>

        {/* Popular regions */}
        {!searched && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-[10px] text-slate-400 leading-6">
              Populer:
            </span>
            {[
              "Kabupaten Bima",
              "Kab. Dompu",
              "Kota Mataram",
              "Kab. Lombok Timur",
            ].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setQuery(r);
                  setSearched(true);
                }}
                className="rounded-full bg-white px-3 py-1 text-[10px] font-medium text-slate-500 ring-1 ring-slate-200 transition-colors hover:bg-emerald-50 hover:text-emerald-600 hover:ring-emerald-300"
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Result card */}
        {searched && (
          <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Hasil Pencarian
                </p>
                <h3 className="mt-0.5 text-lg font-bold text-slate-800">
                  {query || "Kabupaten Bima"}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Provinsi Nusa Tenggara Barat · Data LKPD 2024
                </p>
              </div>
              <span className="rounded-full bg-red-100 px-3 py-1 text-[10px] font-bold text-red-600 ring-1 ring-red-200">
                Perlu Perhatian
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Transparency score */}
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 ring-1 ring-amber-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-amber-600">
                    Skor Transparansi
                  </span>
                  <Star className="h-4 w-4 text-amber-400" />
                </div>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-3xl font-extrabold text-amber-600">
                    42
                  </span>
                  <span className="mb-1 text-sm text-slate-400">/100</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-amber-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
                    style={{ width: "42%" }}
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-amber-600">
                  Di bawah rata-rata nasional (61)
                </p>
              </div>

              {/* Financial findings */}
              <div className="rounded-xl bg-gradient-to-br from-red-50 to-rose-50 p-4 ring-1 ring-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-red-600">
                    Temuan Keuangan
                  </span>
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </div>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-3xl font-extrabold text-red-600">
                    7
                  </span>
                  <span className="mb-1 text-sm text-slate-400">anomali</span>
                </div>
                <ul className="mt-2 flex flex-col gap-1">
                  <li className="text-[10px] text-red-600">
                    • 3 markup berlebihan
                  </li>
                  <li className="text-[10px] text-red-600">
                    • 2 vendor fiktif
                  </li>
                  <li className="text-[10px] text-red-600">
                    • 2 penyimpangan prosedur
                  </li>
                </ul>
              </div>

              {/* Citizen reports */}
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 ring-1 ring-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-blue-600">
                    Laporan Warga
                  </span>
                  <Camera className="h-4 w-4 text-blue-400" />
                </div>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-3xl font-extrabold text-blue-600">
                    12
                  </span>
                  <span className="mb-1 text-sm text-slate-400">
                    foto mencurigakan
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Eye className="h-3 w-3 text-blue-400" />
                  <span className="text-[10px] text-blue-500">
                    4 sedang ditinjau · 3 dikonfirmasi
                  </span>
                </div>
              </div>
            </div>

            {/* Recent findings list */}
            <div className="mt-5 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <h4 className="text-xs font-bold text-slate-600">
                Temuan Terkini Warga
              </h4>
              <ul className="mt-2 divide-y divide-slate-200">
                {[
                  {
                    text: "Jalan desa Kec. Wera rusak parah, belum diperbaiki sejak 2023",
                    votes: 24,
                    time: "2 hari lalu",
                  },
                  {
                    text: "Gedung sekolah SDN 3 retak, tidak sesuai RAB pembangunan",
                    votes: 18,
                    time: "5 hari lalu",
                  },
                  {
                    text: "Jembatan Desa Sape terlihat baru namun material berkualitas rendah",
                    votes: 31,
                    time: "1 minggu lalu",
                  },
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 py-2.5">
                    <div className="flex flex-col items-center gap-0.5 pt-0.5">
                      <ThumbsUp className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-semibold text-slate-500">
                        {f.votes}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-600">{f.text}</p>
                      <p className="text-[10px] text-slate-400">{f.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════ */}
      {/*  2 · SMART WHISTLEBLOWER / BUDGET PHOTO   */}
      {/* ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upload area */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm shadow-violet-200">
              <Camera className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-700">
                Pelapor Cerdas
              </h2>
              <p className="text-[10px] text-slate-400">
                Unggah foto infrastruktur mencurigakan
              </p>
            </div>
          </div>

          {/* Drop zone */}
          <button
            onClick={handleMockUpload}
            className="mt-4 flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 transition-colors hover:border-violet-400 hover:bg-violet-50"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
              <ImagePlus className="h-6 w-6 text-violet-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600">
                Klik untuk mengunggah foto
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                JPG, PNG, atau HEIC · Maks 10MB per file
              </p>
            </div>
          </button>

          {/* Uploaded photos */}
          {uploadedPhotos.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Foto Terunggah
              </p>
              {uploadedPhotos.map((photo, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg bg-emerald-50 px-3 py-2 ring-1 ring-emerald-200"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="flex-1 text-xs font-medium text-emerald-700">
                    {photo}
                  </span>
                  <span className="text-[10px] text-emerald-500">
                    Berhasil diunggah
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2 ring-1 ring-blue-200">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
            <p className="text-[10px] leading-relaxed text-blue-700">
              Foto Anda akan dianalisis AI untuk mendeteksi kesesuaian antara
              kondisi fisik dengan anggaran yang dilaporkan. Identitas pelapor
              dilindungi.
            </p>
          </div>
        </div>

        {/* Report guidelines / recent reports */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm shadow-amber-200">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-700">
                Panduan Pelaporan
              </h2>
              <p className="text-[10px] text-slate-400">
                Tips agar laporan Anda lebih efektif
              </p>
            </div>
          </div>

          <ul className="mt-4 flex flex-col gap-3">
            {[
              {
                title: "Sertakan lokasi yang jelas",
                desc: "Nyalakan GPS saat mengambil foto. Sertakan nama jalan, desa, dan kecamatan.",
                icon: MapPin,
                color: "text-emerald-500 bg-emerald-50",
              },
              {
                title: "Foto dari beberapa sudut",
                desc: "Ambil minimal 3 foto dari sudut berbeda untuk dokumentasi lengkap.",
                icon: Camera,
                color: "text-blue-500 bg-blue-50",
              },
              {
                title: "Bandingkan dengan anggaran",
                desc: 'Jika memungkinkan, cek apakah proyek ini ada di DPA/RKA daerah melalui fitur "Cek Transparansi".',
                icon: TrendingDown,
                color: "text-amber-500 bg-amber-50",
              },
              {
                title: "Identitas Anda dilindungi",
                desc: "Laporan bersifat anonim. Data pribadi Anda dienkripsi dan tidak dibagikan.",
                icon: ShieldCheck,
                color: "text-violet-500 bg-violet-50",
              },
            ].map((tip, i) => {
              const TipIcon = tip.icon;
              return (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tip.color}`}
                  >
                    <TipIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      {tip.title}
                    </p>
                    <p className="text-[10px] leading-relaxed text-slate-400">
                      {tip.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Submit report button */}
          <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all hover:shadow-lg hover:shadow-violet-300">
            <Upload className="h-4 w-4" />
            Kirim Laporan
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/*  3 · TANYA SIGMA BOT (CHATBOT WIDGET)     */}
      {/* ══════════════════════════════════════════ */}
      {/* Floating chat toggle */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-300 transition-transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {/* Notification dot */}
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
            1
          </span>
        </button>
      )}

      {/* Chat window */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
          {/* Chat header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Tanya SIGMA</p>
              <p className="text-[10px] text-emerald-100">
                Asisten AI · Selalu aktif
              </p>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-slate-50 px-4 py-4">
            {/* Bot welcome */}
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <Bot className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs leading-relaxed text-slate-700">
                  Halo! 👋 Saya asisten SIGMA. Silakan tanyakan apa saja
                  tentang anggaran daerah, transparansi, atau regulasi.
                </p>
                <p className="mt-1 text-[9px] text-slate-400">10:30</p>
              </div>
            </div>

            {/* User message */}
            <div className="flex items-start justify-end gap-2.5">
              <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-emerald-500 px-3.5 py-2.5 shadow-sm">
                <p className="text-xs leading-relaxed text-white">
                  Berapa anggaran pendidikan di Dompu?
                </p>
                <p className="mt-1 text-[9px] text-emerald-200">10:31</p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200">
                <User className="h-3.5 w-3.5 text-slate-500" />
              </div>
            </div>

            {/* Bot response */}
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <Bot className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs leading-relaxed text-slate-700">
                  Berdasarkan APBD Kab. Dompu 2024, anggaran fungsi pendidikan
                  sebesar{" "}
                  <span className="font-bold text-emerald-600">
                    Rp 487.3 Miliar
                  </span>{" "}
                  (32.1% dari total APBD). Ini meningkat 5.4% dari tahun
                  sebelumnya.
                </p>
                <div className="mt-2 rounded-lg bg-emerald-50 px-2.5 py-1.5 ring-1 ring-emerald-200">
                  <p className="text-[10px] font-semibold text-emerald-700">
                    📊 Rincian:
                  </p>
                  <ul className="mt-1 flex flex-col gap-0.5">
                    <li className="text-[10px] text-emerald-600">
                      • Gaji guru: Rp 312M
                    </li>
                    <li className="text-[10px] text-emerald-600">
                      • Infrastruktur sekolah: Rp 98M
                    </li>
                    <li className="text-[10px] text-emerald-600">
                      • BOS & bantuan siswa: Rp 77.3M
                    </li>
                  </ul>
                </div>
                <p className="mt-1 text-[9px] text-slate-400">10:31</p>
              </div>
            </div>
          </div>

          {/* Chat input */}
          <div className="border-t border-slate-200 bg-white px-3 py-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setChatInput("");
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ketik pertanyaan Anda…"
                className="h-9 flex-1 rounded-lg bg-slate-50 px-3 text-xs text-slate-700 ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm transition-colors hover:bg-emerald-600"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-1.5 text-center text-[9px] text-slate-400">
              Didukung oleh AI · Jawaban berdasarkan data APBD resmi
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
