"use client";

import { useState, useEffect } from "react";
import {
  Landmark,
  Clock,
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  DollarSign,
  Search,
  BarChart3,
  Zap,
  XCircle,
  Activity,
  Eye,
} from "lucide-react";

/* ─── Mock data ─────────────────────────────────── */
const ANOMALY_CARDS = [
  {
    id: 1,
    title: "Markup Detected",
    value: "3 Items",
    description: "Item dengan harga di atas harga pasar wajar",
    status: "critical" as const,
    icon: ShieldAlert,
    delta: "+2 dari bulan lalu",
  },
  {
    id: 2,
    title: "Split Purchase Probability",
    value: "85%",
    description: "Probabilitas pemecahan paket pengadaan",
    status: "warning" as const,
    icon: TrendingUp,
    delta: "+12% dari bulan lalu",
  },
  {
    id: 3,
    title: "Ghost Vendors",
    value: "0",
    description: "Vendor fiktif atau tidak terverifikasi",
    status: "clear" as const,
    icon: CheckCircle2,
    delta: "Bersih · tidak ada temuan",
  },
  {
    id: 4,
    title: "Total Suspicious Value",
    value: "Rp 4.7M",
    description: "Nilai total transaksi mencurigakan",
    status: "critical" as const,
    icon: DollarSign,
    delta: "Rp 1.2M dari markup",
  },
];

const FLOW_STEPS = [
  {
    label: "Kas Daerah",
    value: "Rp 1.2M",
    type: "source" as const,
  },
  {
    label: "Dinas PU",
    value: "Alokasi Proyek",
    type: "process" as const,
  },
  {
    label: "PT Bumi Jaya",
    value: "Kontraktor",
    type: "process" as const,
  },
  {
    label: "Sub-kontraktor Fiktif",
    value: "Rp 400jt",
    type: "alert" as const,
  },
];

/* ─── Helpers ───────────────────────────────────── */
function statusConfig(status: "critical" | "warning" | "clear") {
  switch (status) {
    case "critical":
      return {
        bg: "bg-red-50",
        ring: "ring-red-200",
        text: "text-red-700",
        badge: "bg-red-100 text-red-700",
        badgeLabel: "KRITIS",
        iconBg: "bg-red-100 text-red-600",
        accentTop: "from-red-500 to-rose-500",
      };
    case "warning":
      return {
        bg: "bg-amber-50",
        ring: "ring-amber-200",
        text: "text-amber-700",
        badge: "bg-amber-100 text-amber-700",
        badgeLabel: "PERINGATAN",
        iconBg: "bg-amber-100 text-amber-600",
        accentTop: "from-amber-500 to-orange-500",
      };
    case "clear":
      return {
        bg: "bg-emerald-50",
        ring: "ring-emerald-200",
        text: "text-emerald-700",
        badge: "bg-emerald-100 text-emerald-700",
        badgeLabel: "BERSIH",
        iconBg: "bg-emerald-100 text-emerald-600",
        accentTop: "from-emerald-500 to-teal-500",
      };
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━ PAGE ━━━━━━━━━━━━━━━━━━━━ */
export default function MoneyIntelligencePage() {
  const [parseProgress, setParseProgress] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Simulate a parsing animation
  useEffect(() => {
    if (!isParsing) return;
    if (parseProgress >= 100) {
      setIsParsing(false);
      return;
    }
    const timer = setTimeout(() => {
      setParseProgress((prev) => Math.min(prev + Math.random() * 8 + 2, 100));
    }, 200);
    return () => clearTimeout(timer);
  }, [isParsing, parseProgress]);

  function handleUploadClick() {
    setParseProgress(0);
    setIsParsing(true);
  }

  return (
    <section className="flex flex-col gap-6">
      {/* ── Top header ──────────────────────────────── */}
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Modul 1
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Money Intelligence — APBD Forensik
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Parsing dokumen keuangan, deteksi anomali, dan pelacakan arus uang
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
          SECTION 1: Document Parsing Zone
         ════════════════════════════════════════════════ */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm shadow-blue-200">
              <FileSpreadsheet className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-700">
                Document Parsing Zone
              </h2>
              <p className="text-[11px] text-slate-400">
                Upload dan analisis otomatis dokumen keuangan daerah
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600 ring-1 ring-blue-200">
            <Zap className="h-3 w-3" />
            Azure Document Intelligence
          </span>
        </div>

        <div className="px-6 py-5">
          {/* Drag-and-drop area */}
          <button
            onClick={handleUploadClick}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleUploadClick();
            }}
            className={`group relative w-full cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
              isDragOver
                ? "border-blue-400 bg-blue-50"
                : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
                  isDragOver
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600"
                }`}
              >
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Upload LKPD / APBD{" "}
                  <span className="font-normal text-slate-400">(PDF / Excel)</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Drag & drop file di sini, atau klik untuk browse
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-medium text-slate-500 ring-1 ring-slate-200">
                  .PDF
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-medium text-slate-500 ring-1 ring-slate-200">
                  .XLSX
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-medium text-slate-500 ring-1 ring-slate-200">
                  .XLS
                </span>
              </div>
            </div>
          </button>

          {/* Parsing progress */}
          {isParsing && (
            <div className="mt-4 rounded-xl bg-slate-900 px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-4 w-4 text-blue-400" />
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-ping rounded-full bg-blue-400" />
                  </div>
                  <p className="text-xs font-medium text-slate-300">
                    Parsing Tables & Entities via Azure Document Intelligence...
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-400">
                  {Math.round(parseProgress)}%
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out"
                  style={{ width: `${parseProgress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center gap-4 text-[10px] text-slate-500">
                <span className={parseProgress > 20 ? "text-emerald-400" : ""}>
                  ✓ Ekstraksi Tabel
                </span>
                <span className={parseProgress > 50 ? "text-emerald-400" : ""}>
                  ✓ Named Entity Recognition
                </span>
                <span className={parseProgress > 80 ? "text-emerald-400" : ""}>
                  ✓ Anomaly Scoring
                </span>
              </div>
            </div>
          )}

          {/* Completed indicator */}
          {!isParsing && parseProgress >= 100 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-5 py-3 ring-1 ring-emerald-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <p className="text-xs font-semibold text-emerald-700">
                Parsing selesai — 847 tabel terdeteksi, 1,247 entitas diekstrak
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          SECTION 2: 12 Anomaly Detection Algorithms Grid
         ════════════════════════════════════════════════ */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm shadow-amber-200">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-700">
                Anomaly Detection Engine
              </h2>
              <p className="text-[11px] text-slate-400">
                12 algoritma deteksi anomali keuangan daerah
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600 ring-1 ring-amber-200">
            <BarChart3 className="h-3 w-3" />
            4 Temuan Aktif
          </span>
        </div>

        <div className="px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {ANOMALY_CARDS.map((card) => {
              const cfg = statusConfig(card.status);
              const Icon = card.icon;

              return (
                <div
                  key={card.id}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
                >
                  {/* Top accent bar */}
                  <span
                    className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${cfg.accentTop} opacity-0 transition-opacity group-hover:opacity-100`}
                  />

                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${cfg.iconBg}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${cfg.badge}`}
                      >
                        {cfg.badgeLabel}
                      </span>
                    </div>

                    <p className="mt-4 text-2xl font-extrabold text-slate-800">
                      {card.value}
                    </p>
                    <p className="text-sm font-semibold text-slate-600">
                      {card.title}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {card.description}
                    </p>

                    <div className="mt-3 flex items-center gap-1 border-t border-slate-100 pt-3">
                      <span
                        className={`text-[10px] font-medium ${
                          card.status === "clear"
                            ? "text-emerald-500"
                            : card.status === "warning"
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      >
                        {card.delta}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          SECTION 3: Follow-the-Money Tracking Flow
         ════════════════════════════════════════════════ */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-rose-600 shadow-sm shadow-red-200">
              <Eye className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-700">
                Follow-the-Money Tracking
              </h2>
              <p className="text-[11px] text-slate-400">
                Visualisasi arus uang dari sumber hingga titik anomali
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600 ring-1 ring-red-200">
            <AlertTriangle className="h-3 w-3" />1 Anomali Terdeteksi
          </span>
        </div>

        <div className="px-6 py-6">
          {/* Flow pipeline */}
          <div className="flex items-stretch gap-0">
            {FLOW_STEPS.map((step, idx) => {
              const isAlert = step.type === "alert";
              const isSource = step.type === "source";
              const isLast = idx === FLOW_STEPS.length - 1;

              return (
                <div key={idx} className="flex flex-1 items-center">
                  {/* Step card */}
                  <div
                    className={`relative flex w-full flex-col items-center rounded-2xl px-4 py-5 text-center ring-1 transition-shadow ${
                      isAlert
                        ? "bg-red-50 ring-red-300 shadow-lg shadow-red-100"
                        : isSource
                          ? "bg-blue-50 ring-blue-200"
                          : "bg-white ring-slate-200"
                    }`}
                  >
                    {/* Alert pulse */}
                    {isAlert && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 shadow-sm">
                        <XCircle className="h-3 w-3 text-white" />
                      </span>
                    )}

                    {/* Step number */}
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold ${
                        isAlert
                          ? "bg-red-600 text-white"
                          : isSource
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <p
                      className={`mt-2.5 text-xs font-bold ${
                        isAlert ? "text-red-700" : "text-slate-700"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`mt-0.5 text-[11px] font-medium ${
                        isAlert ? "text-red-500" : "text-slate-400"
                      }`}
                    >
                      {step.value}
                    </p>

                    {/* Alert tag */}
                    {isAlert && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                        <AlertTriangle className="h-3 w-3" />
                        ALERT!
                      </span>
                    )}
                  </div>

                  {/* Arrow connector */}
                  {!isLast && (
                    <div className="flex shrink-0 flex-col items-center px-1">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          idx === FLOW_STEPS.length - 2
                            ? "bg-red-100 text-red-500"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Trail details panel */}
          <div className="mt-5 rounded-xl bg-slate-900 px-5 py-4">
            <div className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-red-400" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                Analisis Arus Uang — AI Summary
              </p>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-300">
              Dana sebesar{" "}
              <span className="font-semibold text-blue-400">Rp 1.2 Miliar</span>{" "}
              dari Kas Daerah dialokasikan ke Dinas PU untuk proyek infrastruktur.
              Dinas PU menunjuk{" "}
              <span className="font-semibold text-slate-200">
                PT Bumi Jaya
              </span>{" "}
              sebagai kontraktor utama. Investigasi mendeteksi bahwa PT Bumi Jaya
              menyalurkan{" "}
              <span className="font-semibold text-red-400">Rp 400 juta</span> ke
              sub-kontraktor yang{" "}
              <span className="font-semibold text-red-400">
                tidak memiliki SIUP/TDP valid
              </span>
              , mengindikasikan potensi vendor fiktif.
            </p>

            {/* Evidence tags */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-medium text-slate-400 ring-1 ring-slate-700">
                🔍 SIUP Tidak Ditemukan
              </span>
              <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-medium text-slate-400 ring-1 ring-slate-700">
                🏢 Alamat Tidak Terverifikasi
              </span>
              <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-medium text-slate-400 ring-1 ring-slate-700">
                💰 Transaksi 1x Selesai
              </span>
              <span className="rounded-full bg-red-900/40 px-2.5 py-1 text-[10px] font-bold text-red-400 ring-1 ring-red-800">
                ⚠ High Risk Vendor
              </span>
            </div>
          </div>

          {/* Mini summary stat bar */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-blue-50 px-3 py-2.5 text-center ring-1 ring-blue-200">
              <p className="text-lg font-bold text-blue-600">Rp 1.2M</p>
              <p className="text-[10px] font-medium text-blue-500">
                Total Arus Terlacak
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 px-3 py-2.5 text-center ring-1 ring-amber-200">
              <p className="text-lg font-bold text-amber-600">4 Node</p>
              <p className="text-[10px] font-medium text-amber-500">
                Entitas Dalam Rantai
              </p>
            </div>
            <div className="rounded-lg bg-red-50 px-3 py-2.5 text-center ring-1 ring-red-200">
              <p className="text-lg font-bold text-red-600">Rp 400jt</p>
              <p className="text-[10px] font-medium text-red-500">
                Nilai Anomali Terdeteksi
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
