"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  AlertTriangle,
  Scale,
  Gavel,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  XCircle,
  BookOpenText,
  Landmark,
  FileSearch,
  Zap,
  ChevronRight,
  Link2,
} from "lucide-react";

/* ━━━━━━━━━━━━━━━━━━━━━━ PAGE ━━━━━━━━━━━━━━━━━━━━ */
export default function CrossCheckPage() {
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);

  function handleUpload() {
    setUploaded(true);
    setAnalyzing(true);
    setDone(false);

    // Simulate AI analysis
    setTimeout(() => {
      setAnalyzing(false);
      setDone(true);
    }, 2400);
  }

  function handleReset() {
    setUploaded(false);
    setAnalyzing(false);
    setDone(false);
  }

  return (
    <section className="flex flex-col gap-6">
      {/* ── Header ──────────────────────────────── */}
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Mesin Cek-Silang
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Pembuat Kasus Hukum Otomatis
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sinergi #1 — Menghubungkan temuan keuangan dengan dasar hukum secara
            otomatis
          </p>
        </div>

        <div className="flex items-center gap-3">
          {uploaded && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-200"
            >
              Reset
            </button>
          )}
          <button
            onClick={handleUpload}
            disabled={analyzing}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:shadow-blue-300 disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />
            {analyzing ? "Menganalisis…" : "Unggah Dokumen LKPD"}
          </button>
        </div>
      </header>

      {/* ── Pipeline indicator ────────────────────── */}
      <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-200">
        {[
          { label: "Unggah LKPD", active: uploaded },
          { label: "Analisis APBD", active: uploaded },
          { label: "Cocokkan Regulasi", active: done },
          { label: "Buat Ringkasan Hukum", active: done },
        ].map((step, i, arr) => (
          <div key={step.label} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors duration-500 ${
                  step.active
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {step.active ? "✓" : i + 1}
              </span>
              <span
                className={`text-xs font-medium transition-colors duration-500 ${
                  step.active ? "text-slate-700" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < arr.length - 1 && (
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
            )}
          </div>
        ))}
      </div>

      {/* ── Uploaded file card ────────────────────── */}
      {uploaded && (
        <div className="flex items-center gap-4 rounded-2xl bg-blue-50 px-6 py-4 ring-1 ring-blue-200">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-sm shadow-blue-200">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-800">
              LKPD_Kab_Dompu_2024.pdf
            </p>
            <p className="text-[11px] text-blue-500">
              247 halaman · 18.4 MB · Diunggah baru saja
            </p>
          </div>
          {analyzing && (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
              <span className="text-xs font-semibold text-amber-600">
                AI sedang menganalisis…
              </span>
            </div>
          )}
          {done && (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600">
                Analisis selesai
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Analyzing state ───────────────────────── */}
      {analyzing && (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white py-16 shadow-sm ring-1 ring-slate-200">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <FileSearch className="h-7 w-7 text-blue-500" />
            </div>
            <span className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-700">
              Memproses dokumen dengan AI…
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Mengekstrak data APBD, mencocokkan regulasi, membangun kasus hukum
            </p>
          </div>
          {/* Fake progress bar */}
          <div className="h-1.5 w-64 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
              style={{ width: "65%" }}
            />
          </div>
        </div>
      )}

      {/* ── Three-column results ──────────────────── */}
      {done && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ──────── Column 1: APBD Forensik (Money) ──────── */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                <Landmark className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-700">
                  APBD Forensik
                </h2>
                <p className="text-[10px] text-slate-400">Temuan Keuangan</p>
              </div>
            </div>

            {/* Alert card */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-red-200">
              <div className="flex items-center gap-2 border-b border-red-100 px-5 py-3">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                  Anomali Terdeteksi
                </span>
              </div>

              <div className="flex flex-col gap-4 px-5 py-4">
                <div className="rounded-xl bg-red-50 px-4 py-3 ring-1 ring-red-200">
                  <p className="text-sm font-semibold leading-relaxed text-red-800">
                    Pengadaan laptop Rp 25jt/unit oleh{" "}
                    <span className="underline decoration-red-300">
                      PT Solar Abadi
                    </span>
                  </p>
                  <p className="mt-1.5 text-xs font-bold text-red-600">
                    Markup 280% dari e-katalog
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Harga e-Katalog</span>
                    <span className="font-semibold text-emerald-600">
                      Rp 6.5jt/unit
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Harga Kontrak</span>
                    <span className="font-bold text-red-600">Rp 25jt/unit</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Selisih per Unit</span>
                    <span className="font-bold text-red-600">Rp 18.5jt</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Total Unit</span>
                    <span className="font-semibold text-slate-700">
                      175 unit
                    </span>
                  </div>

                  <hr className="border-slate-100" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Est. Kerugian Negara
                    </span>
                    <span className="text-base font-extrabold text-red-600">
                      Rp 3.2 M
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 ring-1 ring-amber-200">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <p className="text-[10px] text-amber-700">
                    Vendor PT Solar Abadi terdaftar di 3 kontrak serupa dalam 2
                    tahun terakhir
                  </p>
                </div>
              </div>
            </div>

            {/* Risk level */}
            <div className="flex items-center gap-3 rounded-xl bg-red-600 px-4 py-3 shadow-md shadow-red-200">
              <XCircle className="h-5 w-5 text-red-200" />
              <div>
                <p className="text-xs font-bold text-white">
                  Tingkat Risiko: KRITIS
                </p>
                <p className="text-[10px] text-red-200">
                  Memerlukan tindakan segera
                </p>
              </div>
            </div>
          </div>

          {/* ──────── Column 2: Regulation Genome (Rules) ──────── */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <BookOpenText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-700">
                  Genom Regulasi
                </h2>
                <p className="text-[10px] text-slate-400">
                  Aturan yang Dilanggar
                </p>
              </div>
            </div>

            {/* Rule card 1 */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-2 border-b border-blue-100 px-5 py-3">
                <Scale className="h-4 w-4 text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Aturan Cocok #1
                </span>
                <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-bold text-red-600">
                  DILANGGAR
                </span>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs font-bold text-slate-700">
                  Perpres 16/2018 — Pasal 24
                </p>
                <p className="mt-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs leading-relaxed text-blue-800 ring-1 ring-blue-200">
                  &ldquo;HPS wajib mengacu harga pasar/e-katalog.&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Link2 className="h-3 w-3 text-slate-400" />
                  <span className="text-[10px] text-slate-400">
                    Pengadaan Barang/Jasa Pemerintah
                  </span>
                </div>
              </div>
            </div>

            {/* Rule card 2 */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-2 border-b border-blue-100 px-5 py-3">
                <Scale className="h-4 w-4 text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Aturan Cocok #2
                </span>
                <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-bold text-red-600">
                  DILANGGAR
                </span>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs font-bold text-slate-700">
                  Perpres 16/2018 — Pasal 38
                </p>
                <p className="mt-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs leading-relaxed text-blue-800 ring-1 ring-blue-200">
                  &ldquo;Pengadaan &gt;200jt wajib tender terbuka.&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Link2 className="h-3 w-3 text-slate-400" />
                  <span className="text-[10px] text-slate-400">
                    Metode Pemilihan Penyedia
                  </span>
                </div>
              </div>
            </div>

            {/* Rule card 3 — additional */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-2 border-b border-amber-100 px-5 py-3">
                <Scale className="h-4 w-4 text-amber-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Aturan Cocok #3
                </span>
                <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-600">
                  PERINGATAN
                </span>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs font-bold text-slate-700">
                  Perpres 16/2018 — Pasal 77
                </p>
                <p className="mt-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-200">
                  &ldquo;PPK wajib menolak hasil pekerjaan yang tidak sesuai
                  kontrak.&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Link2 className="h-3 w-3 text-slate-400" />
                  <span className="text-[10px] text-slate-400">
                    Pelaksanaan Kontrak
                  </span>
                </div>
              </div>
            </div>

            {/* Matched stats */}
            <div className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 shadow-md shadow-blue-200">
              <Zap className="h-5 w-5 text-blue-200" />
              <div>
                <p className="text-xs font-bold text-white">
                  3 Aturan Cocok Ditemukan
                </p>
                <p className="text-[10px] text-blue-200">
                  Dari 2.847 regulasi dalam database
                </p>
              </div>
            </div>
          </div>

          {/* ──────── Column 3: Legal Brief Output ──────── */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                <Gavel className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-700">
                  Ringkasan Hukum
                </h2>
                <p className="text-[10px] text-slate-400">Dihasilkan oleh AI</p>
              </div>
            </div>

            {/* Main legal brief card */}
            <div className="rounded-2xl bg-gradient-to-br from-red-600 to-red-700 p-[1px] shadow-lg shadow-red-200">
              <div className="rounded-[15px] bg-gradient-to-br from-red-600 to-red-700 px-5 py-5">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-red-200" />
                  <span className="text-sm font-extrabold uppercase tracking-wider text-white">
                    Indikasi Tipikor
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-red-100">
                  Berdasarkan analisis AI terhadap dokumen LKPD Kab. Dompu 2024,
                  ditemukan indikasi kuat tindak pidana korupsi pada pengadaan
                  barang/jasa.
                </p>

                <div className="mt-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2">
                    <span className="text-[11px] text-red-200">
                      Kerugian Negara (est.)
                    </span>
                    <span className="text-base font-extrabold text-white">
                      Rp 3.2 M
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2">
                    <span className="text-[11px] text-red-200">
                      Aturan Dilanggar
                    </span>
                    <span className="text-base font-extrabold text-white">
                      3
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2">
                    <span className="text-[11px] text-red-200">
                      Bukti Pendukung
                    </span>
                    <span className="text-base font-extrabold text-white">
                      7 dokumen
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence list */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="border-b border-slate-100 px-5 py-3">
                <h3 className="text-xs font-bold text-slate-700">
                  Daftar Bukti Pendukung
                </h3>
              </div>
              <ul className="divide-y divide-slate-100">
                {[
                  "Kontrak pengadaan No. 054/BPKD/2024",
                  "E-katalog screenshot (Rp 6.5jt)",
                  "SPK PT Solar Abadi",
                  "Berita Acara Serah Terima",
                  "Dokumen HPS pengadaan",
                  "Laporan audit internal SKPD",
                  "Rekening koran vendor",
                ].map((doc, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-slate-50"
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="flex-1 text-[11px] text-slate-600">
                      {doc}
                    </span>
                    <ChevronRight className="h-3 w-3 text-slate-300" />
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="border-b border-slate-100 px-5 py-3">
                <h3 className="text-xs font-bold text-slate-700">
                  Kronologi Kejadian
                </h3>
              </div>
              <div className="flex flex-col gap-0 px-5 py-4">
                {[
                  {
                    date: "12 Jan 2024",
                    event: "HPS disusun tanpa acuan e-katalog",
                    color: "bg-amber-500",
                  },
                  {
                    date: "28 Feb 2024",
                    event: "Penunjukan langsung PT Solar Abadi",
                    color: "bg-red-500",
                  },
                  {
                    date: "15 Mar 2024",
                    event: "Kontrak ditandatangani — Rp 4.375M",
                    color: "bg-red-500",
                  },
                  {
                    date: "20 Jun 2024",
                    event: "Barang diterima, BAST diterbitkan",
                    color: "bg-slate-400",
                  },
                ].map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${t.color}`}
                      />
                      {i < 3 && <span className="w-px flex-1 bg-slate-200" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-[10px] font-medium text-slate-400">
                        {t.date}
                      </p>
                      <p className="text-[11px] font-medium text-slate-700">
                        {t.event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:shadow-lg hover:shadow-indigo-300">
              <Gavel className="h-4 w-4" />
              Ekspor Ringkasan Hukum (PDF)
            </button>
          </div>
        </div>
      )}

      {/* ── Empty state ──────────────────────────── */}
      {!uploaded && (
        <div className="flex flex-col items-center gap-5 rounded-2xl bg-white py-20 shadow-sm ring-1 ring-slate-200">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200">
            <Upload className="h-8 w-8 text-slate-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-600">
              Unggah dokumen LKPD untuk memulai
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              AI akan menganalisis data keuangan, mencocokkan dengan regulasi,
              dan menghasilkan ringkasan hukum
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["PDF", "XLSX", "LKPD", "LHP"].map((fmt) => (
              <span
                key={fmt}
                className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-medium text-slate-500 ring-1 ring-slate-200"
              >
                .{fmt.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
