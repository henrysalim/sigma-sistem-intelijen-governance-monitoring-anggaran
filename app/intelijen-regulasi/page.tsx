"use client";

import { useState } from "react";
import {
  BookOpenText,
  Clock,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  FileText,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Zap,
  Scale,
  Eye,
} from "lucide-react";

/* ─── Constants ─────────────────────────────────── */
const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

const TIMELINE_EVENTS: Record<number, { label: string; type: "new" | "amend" | "repeal" }[]> = {
  2018: [{ label: "Perpres 16/2018 — Pengadaan Barang/Jasa", type: "new" }],
  2019: [{ label: "Perpres 12/2019 — Amandemen Pengadaan", type: "amend" }],
  2020: [{ label: "Permendagri 77/2020 — Pengelolaan Keuangan", type: "new" }],
  2021: [{ label: "Perda Kab. X No. 5/2021 — Batas Pengadaan", type: "new" }],
  2022: [{ label: "Perpres 12/2021 — Revisi Pengadaan Langsung", type: "amend" }],
  2023: [{ label: "PP 12/2023 — Keuangan Daerah Baru", type: "new" }],
  2024: [{ label: "Perda Kab. X No. 3/2024 — Revisi Batas Pengadaan", type: "amend" }],
  2025: [{ label: "Permendagri 22/2025 — Reformasi Belanja", type: "new" }],
  2026: [{ label: "Perpres 8/2026 — Digitalisasi Pengadaan", type: "new" }],
};

const RIPPLE_EFFECTS = [
  {
    regulation: "Perda Kab. X No. 3/2024 — Batas Pengadaan Langsung Rp 200jt",
    affected: [
      {
        dept: "Dinas Pekerjaan Umum",
        sop: "SOP Pengadaan Langsung Infrastruktur",
        status: "outdated" as const,
      },
      {
        dept: "Dinas Kesehatan",
        sop: "SOP Pembelian Alat Medis < Rp 200jt",
        status: "outdated" as const,
      },
      {
        dept: "Dinas Pendidikan",
        sop: "SOP Pengadaan Buku & Sarana",
        status: "conflict" as const,
      },
    ],
  },
];

/* ━━━━━━━━━━━━━━━━━━━━━━ PAGE ━━━━━━━━━━━━━━━━━━━━ */
export default function RegulationIntelligencePage() {
  const [selectedYear, setSelectedYear] = useState(2024);

  const events = TIMELINE_EVENTS[selectedYear] || [];
  const sliderIndex = YEARS.indexOf(selectedYear);

  return (
    <section className="flex flex-col gap-6">
      {/* ── Top header ──────────────────────────────── */}
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Modul 2
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Intelijen Regulasi
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Genom regulasi, deteksi kontradiksi, dan patcher SOP otomatis
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs text-slate-500 shadow-sm ring-1 ring-slate-200">
          <Clock className="h-3.5 w-3.5" />
          <span>
            Langsung ·{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </header>

      {/* ════════════════════════════════════════════════
          TOP SECTION: Regulatory Time Travel & Contradiction
         ════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* ── Regulatory Time Travel ────────────────── */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shadow-indigo-200">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-700">
                  Regulatory Time Travel
                </h2>
                <p className="text-[11px] text-slate-400">
                  Jelajahi evolusi regulasi dari waktu ke waktu
                </p>
              </div>
            </div>
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-600 ring-1 ring-indigo-200">
              {YEARS[0]}–{YEARS[YEARS.length - 1]}
            </span>
          </div>

          <div className="px-6 py-5">
            {/* Year display */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">Tahun Dipilih</p>
              <span className="text-2xl font-extrabold tracking-tight text-indigo-600">
                {selectedYear}
              </span>
            </div>

            {/* Slider */}
            <div className="relative mb-3">
              <input
                type="range"
                min={0}
                max={YEARS.length - 1}
                value={sliderIndex}
                onChange={(e) => setSelectedYear(YEARS[Number(e.target.value)])}
                className="w-full cursor-pointer accent-indigo-600"
                style={{ height: "6px" }}
              />
              {/* Year labels */}
              <div className="mt-1.5 flex justify-between">
                {YEARS.map((y) => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(y)}
                    className={`text-[10px] font-semibold transition-colors ${
                      y === selectedYear
                        ? "text-indigo-600"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {/* Events for selected year */}
            <div className="mt-4 space-y-2">
              {events.map((ev, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/60"
                >
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      ev.type === "new"
                        ? "bg-emerald-100 text-emerald-600"
                        : ev.type === "amend"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-red-100 text-red-600"
                    }`}
                  >
                    {ev.type === "new" ? (
                      <FileText className="h-3.5 w-3.5" />
                    ) : ev.type === "amend" ? (
                      <Sparkles className="h-3.5 w-3.5" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      {ev.label}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize">
                      {ev.type === "new"
                        ? "Regulasi Baru"
                        : ev.type === "amend"
                          ? "Amandemen"
                          : "Dicabut"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Contradiction Alert ───────────────────── */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-rose-600 shadow-sm shadow-red-200">
                <ShieldAlert className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-700">
                  Contradiction Alert
                </h2>
                <p className="text-[11px] text-slate-400">
                  Deteksi otomatis konflik antar-regulasi
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600 ring-1 ring-red-200">
              <AlertTriangle className="h-3 w-3" />
              1 Konflik Aktif
            </span>
          </div>

          <div className="px-6 py-5">
            {/* Conflict severity banner */}
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 ring-1 ring-red-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <Scale className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-red-700">
                  Kontradiksi Batas Pengadaan Langsung
                </p>
                <p className="text-[10px] text-red-500">
                  Tingkat keparahan: Kritis · Terdeteksi 2 hari lalu
                </p>
              </div>
            </div>

            {/* Split diff */}
            <div className="grid grid-cols-2 gap-3">
              {/* Left — Local regulation */}
              <div className="rounded-xl border-2 border-red-300 bg-red-50/50 p-4">
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                    Perda Lokal
                  </p>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  Perda Baru Kab. X
                </p>
                <div className="mt-2 rounded-lg bg-red-100/80 px-3 py-2 ring-1 ring-red-200">
                  <p className="text-[11px] font-medium leading-relaxed text-red-800">
                    &quot;Batas Pengadaan Langsung{" "}
                    <span className="rounded bg-red-200 px-1 font-bold text-red-900">
                      Rp 200jt
                    </span>{" "}
                    — tanpa proses tender&quot;
                  </p>
                </div>
                <p className="mt-2 text-[10px] text-slate-400">
                  Pasal 12 Ayat 3 · Berlaku 1 Jan 2024
                </p>
              </div>

              {/* Right — National regulation */}
              <div className="rounded-xl border-2 border-red-300 bg-red-50/50 p-4">
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                    Perpres Pusat
                  </p>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  Perpres 16/2018
                </p>
                <div className="mt-2 rounded-lg bg-red-100/80 px-3 py-2 ring-1 ring-red-200">
                  <p className="text-[11px] font-medium leading-relaxed text-red-800">
                    &quot;Batas{" "}
                    <span className="rounded bg-red-200 px-1 font-bold text-red-900">
                      Rp 200jt
                    </span>{" "}
                    — Wajib Tender Terbuka&quot;
                  </p>
                </div>
                <p className="mt-2 text-[10px] text-slate-400">
                  Pasal 22 Ayat 1 · Berlaku 22 Maret 2018
                </p>
              </div>
            </div>

            {/* Contradiction explanation */}
            <div className="mt-4 rounded-xl bg-slate-900 px-4 py-3">
              <div className="flex items-center gap-2">
                <Eye className="h-3.5 w-3.5 text-red-400" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                  Analisis AI
                </p>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">
                Perda Kab. X mengizinkan pengadaan langsung hingga Rp 200jt{" "}
                <span className="font-semibold text-red-400">tanpa tender</span>,
                sementara Perpres 16/2018 mewajibkan{" "}
                <span className="font-semibold text-red-400">tender terbuka</span>{" "}
                untuk nilai yang sama. Ini menciptakan celah hukum yang berpotensi
                dieksploitasi untuk menghindari proses tender.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          MIDDLE SECTION: SOP Auto-Patcher
         ════════════════════════════════════════════════ */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm shadow-emerald-200">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-700">
                SOP Auto-Patcher
              </h2>
              <p className="text-[11px] text-slate-400">
                Saran revisi SOP yang di-generate AI berdasarkan analisis konflik
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 ring-1 ring-emerald-200">
              <Zap className="h-3 w-3" />
              AI-Generated
            </span>
            <button className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-emerald-200 transition-colors hover:bg-emerald-700">
              <CheckCircle2 className="h-3 w-3" />
              Terapkan Patch
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          {/* Patch context */}
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5 ring-1 ring-slate-200">
            <BookOpenText className="h-4 w-4 text-slate-500" />
            <div>
              <p className="text-xs font-semibold text-slate-700">
                SOP Pengadaan Langsung — Dinas PU Kab. X
              </p>
              <p className="text-[10px] text-slate-400">
                Revisi diperlukan karena kontradiksi Perda vs Perpres
              </p>
            </div>
          </div>

          {/* Diff view */}
          <div className="overflow-hidden rounded-xl ring-1 ring-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between bg-slate-800 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[10px] font-mono text-slate-400">
                sop-pengadaan-langsung.md
              </p>
            </div>

            {/* Code diff */}
            <div className="bg-slate-900 p-4 font-mono text-[11px] leading-relaxed">
              {/* Unchanged context */}
              <div className="text-slate-500">
                <p className="pl-6">
                  <span className="mr-3 inline-block w-5 text-right text-slate-600">
                    14
                  </span>
                  ## Pasal 5 — Batas Nilai Pengadaan Langsung
                </p>
                <p className="pl-6">
                  <span className="mr-3 inline-block w-5 text-right text-slate-600">
                    15
                  </span>
                </p>
              </div>

              {/* Removed lines */}
              <div className="rounded-md bg-red-950/40 text-red-400">
                <p className="pl-6">
                  <span className="mr-3 inline-block w-5 text-right text-red-600">
                    16
                  </span>
                  <span className="mr-2 text-red-600">−</span>
                  <span className="line-through opacity-70">
                    Pengadaan barang/jasa dengan nilai hingga Rp 200.000.000
                  </span>
                </p>
                <p className="pl-6">
                  <span className="mr-3 inline-block w-5 text-right text-red-600">
                    17
                  </span>
                  <span className="mr-2 text-red-600">−</span>
                  <span className="line-through opacity-70">
                    dapat dilaksanakan secara langsung tanpa proses tender.
                  </span>
                </p>
              </div>

              {/* Added lines */}
              <div className="mt-0.5 rounded-md bg-emerald-950/40 text-emerald-400">
                <p className="pl-6">
                  <span className="mr-3 inline-block w-5 text-right text-emerald-600">
                    16
                  </span>
                  <span className="mr-2 text-emerald-500">+</span>
                  Pengadaan barang/jasa dengan nilai hingga Rp 200.000.000
                </p>
                <p className="pl-6">
                  <span className="mr-3 inline-block w-5 text-right text-emerald-600">
                    17
                  </span>
                  <span className="mr-2 text-emerald-500">+</span>
                  <span className="rounded bg-emerald-800/50 px-1 font-semibold text-emerald-300">
                    wajib melalui proses tender terbuka sesuai Perpres 16/2018
                  </span>
                </p>
                <p className="pl-6">
                  <span className="mr-3 inline-block w-5 text-right text-emerald-600">
                    18
                  </span>
                  <span className="mr-2 text-emerald-500">+</span>
                  <span className="rounded bg-emerald-800/50 px-1 font-semibold text-emerald-300">
                    Pasal 22 Ayat 1. Pengadaan langsung hanya diizinkan untuk
                  </span>
                </p>
                <p className="pl-6">
                  <span className="mr-3 inline-block w-5 text-right text-emerald-600">
                    19
                  </span>
                  <span className="mr-2 text-emerald-500">+</span>
                  <span className="rounded bg-emerald-800/50 px-1 font-semibold text-emerald-300">
                    nilai di bawah Rp 50.000.000 (lima puluh juta rupiah).
                  </span>
                </p>
              </div>

              {/* More unchanged context */}
              <div className="mt-0.5 text-slate-500">
                <p className="pl-6">
                  <span className="mr-3 inline-block w-5 text-right text-slate-600">
                    20
                  </span>
                </p>
                <p className="pl-6">
                  <span className="mr-3 inline-block w-5 text-right text-slate-600">
                    21
                  </span>
                  ## Pasal 6 — Prosedur Pemilihan Penyedia
                </p>
              </div>
            </div>
          </div>

          {/* Patch details */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-red-50 px-3 py-2.5 text-center ring-1 ring-red-200">
              <p className="text-lg font-bold text-red-600">−2</p>
              <p className="text-[10px] font-medium text-red-500">Baris Dihapus</p>
            </div>
            <div className="rounded-lg bg-emerald-50 px-3 py-2.5 text-center ring-1 ring-emerald-200">
              <p className="text-lg font-bold text-emerald-600">+4</p>
              <p className="text-[10px] font-medium text-emerald-500">Baris Ditambah</p>
            </div>
            <div className="rounded-lg bg-blue-50 px-3 py-2.5 text-center ring-1 ring-blue-200">
              <p className="text-lg font-bold text-blue-600">98%</p>
              <p className="text-[10px] font-medium text-blue-500">Confidence AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          BOTTOM SECTION: Ripple Effect Analyzer
         ════════════════════════════════════════════════ */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm shadow-amber-200">
              <GitBranch className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-700">
                Ripple Effect Analyzer
              </h2>
              <p className="text-[11px] text-slate-400">
                Dampak perubahan regulasi terhadap SOP departemen terkait
              </p>
            </div>
          </div>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600 ring-1 ring-amber-200">
            3 SOP Terpengaruh
          </span>
        </div>

        <div className="px-6 py-5">
          {RIPPLE_EFFECTS.map((effect, idx) => (
            <div key={idx}>
              {/* Root regulation */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <BookOpenText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {effect.regulation}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Sumber perubahan regulasi
                  </p>
                </div>
              </div>

              {/* Connector line */}
              <div className="ml-5 flex flex-col">
                <div className="h-4 w-px bg-slate-300" />

                {/* Affected SOPs */}
                <div className="space-y-0">
                  {effect.affected.map((sop, i) => (
                    <div key={i} className="flex">
                      {/* Vertical + horizontal connector */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-px ${
                            i < effect.affected.length - 1
                              ? "h-full"
                              : "h-1/2"
                          } bg-slate-300`}
                        />
                      </div>
                      <div className="flex items-center">
                        <div className="h-px w-6 bg-slate-300" />
                        <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />
                      </div>

                      {/* SOP Card */}
                      <div
                        className={`my-1.5 flex flex-1 items-center gap-3 rounded-xl px-4 py-3 ring-1 ${
                          sop.status === "conflict"
                            ? "bg-red-50 ring-red-200"
                            : "bg-amber-50 ring-amber-200"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            sop.status === "conflict"
                              ? "bg-red-100 text-red-600"
                              : "bg-amber-100 text-amber-600"
                          }`}
                        >
                          {sop.status === "conflict" ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-700">
                            {sop.sop}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {sop.dept}
                          </p>
                        </div>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            sop.status === "conflict"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {sop.status === "conflict"
                            ? "KONFLIK"
                            : "KEDALUWARSA"}
                        </span>
                        <button className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-50">
                          Auto-Patch <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Summary bar */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-900 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <GitBranch className="h-4 w-4 text-slate-400" />
              <p className="text-xs font-medium text-slate-300">
                Total dampak:{" "}
                <span className="font-bold text-white">
                  1 regulasi → 3 SOP departemen
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                2 Kedaluwarsa
              </span>
              <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-[10px] font-bold text-red-400">
                1 Konflik
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
