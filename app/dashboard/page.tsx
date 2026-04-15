"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  MapPin,
  Activity,
  AlertTriangle,
  FileWarning,
  Scan,
  Radio,
  Clock,
  ChevronRight,
  BarChart3,
  Zap,
  Loader2,
  RefreshCw,
  Users,
} from "lucide-react";
import { fetchAnomalies, fetchCitizenReports } from "@/lib/api";

/* ─── Helpers ───────────────────────────────────── */
function riskColor(risk: string) {
  switch (risk) {
    case "TINGGI":
      return "bg-red-100 text-red-700";
    case "SEDANG":
      return "bg-amber-100 text-amber-700";
    case "RENDAH":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function riskDot(risk: string) {
  switch (risk) {
    case "TINGGI":
      return "bg-red-500";
    case "SEDANG":
      return "bg-amber-500";
    case "RENDAH":
      return "bg-emerald-500";
    default:
      return "bg-slate-400";
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

/* ━━━━━━━━━━━━━━━━━━━━━━ PAGE ━━━━━━━━━━━━━━━━━━━━ */
export default function DashboardPage() {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [anomRes, repRes] = await Promise.all([
        fetchAnomalies().catch(() => ({ data: [] })),
        fetchCitizenReports().catch(() => ({ data: [] })),
      ]);
      setAnomalies(anomRes.data || []);
      setReports(repRes.data || []);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Compute stats from real data
  const criticalAnomalies = anomalies.filter(
    (a) => a.severity === "TINGGI" || a.severity === "KRITIS",
  );
  const mediumAnomalies = anomalies.filter((a) => a.severity === "SEDANG");
  const lowAnomalies = anomalies.filter((a) => a.severity === "RENDAH");
  const pendingReports = reports.filter((r) => r.status === "pending_review");

  const riskBreakdown = [
    {
      label: "Kritis",
      count: criticalAnomalies.length,
      color: "bg-red-500",
      pct:
        anomalies.length > 0
          ? Math.round((criticalAnomalies.length / anomalies.length) * 100)
          : 0,
    },
    {
      label: "Sedang",
      count: mediumAnomalies.length,
      color: "bg-amber-400",
      pct:
        anomalies.length > 0
          ? Math.round((mediumAnomalies.length / anomalies.length) * 100)
          : 0,
    },
    {
      label: "Rendah",
      count: lowAnomalies.length,
      color: "bg-emerald-500",
      pct:
        anomalies.length > 0
          ? Math.round((lowAnomalies.length / anomalies.length) * 100)
          : 0,
    },
  ];

  // Build predictions from recent anomalies
  const predictions = anomalies.slice(0, 5).map((a) => ({
    id: a.id,
    label: a.description || a.type,
    risk: a.severity || "SEDANG",
    module: a.module || "Sistem",
    time: a.detectedAt ? timeAgo(a.detectedAt) : "Baru saja",
  }));

  // Build activity from recent records
  const recentActivity = [
    ...anomalies.slice(0, 3).map((a) => ({
      icon: FileWarning,
      text: a.description || `Anomali terdeteksi: ${a.type}`,
      time: a.detectedAt ? timeAgo(a.detectedAt) : "Baru saja",
    })),
    ...reports.slice(0, 2).map((r) => ({
      icon: Users,
      text: `Laporan warga: ${r.description?.substring(0, 50) || "Laporan baru"}`,
      time: r.submittedAt ? timeAgo(r.submittedAt) : "Baru saja",
    })),
  ].slice(0, 5);

  const QUICK_STATS = [
    {
      label: "Total Anomali",
      value: anomalies.length.toString(),
      delta: `${criticalAnomalies.length} kritis`,
      positive: criticalAnomalies.length === 0,
      icon: BarChart3,
    },
    {
      label: "Laporan Warga",
      value: reports.length.toString(),
      delta: `${pendingReports.length} menunggu`,
      positive: true,
      icon: Users,
    },
    {
      label: "Peringatan Aktif",
      value: criticalAnomalies.length.toString(),
      delta: criticalAnomalies.length > 0 ? "Perlu tindakan" : "Aman",
      positive: criticalAnomalies.length === 0,
      icon: ShieldAlert,
    },
    {
      label: "Status Sistem",
      value: error ? "Error" : "Online",
      delta: "Azure Connected",
      positive: !error,
      icon: Activity,
    },
  ];

  // Health score based on anomaly severity
  const healthScore =
    anomalies.length === 0
      ? 100
      : Math.max(
          0,
          100 -
            criticalAnomalies.length * 20 -
            mediumAnomalies.length * 5 -
            lowAnomalies.length * 2,
        );
  const healthLabel =
    healthScore >= 70 ? "BAIK" : healthScore >= 40 ? "PERHATIAN" : "KRITIS";
  const healthPct = healthScore;

  return (
    <section className="flex flex-col gap-6">
      {/* ── Top header ──────────────────────────────── */}
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Dasbor & Intelijen
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Dasbor Eksekutif SIGMA
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
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
        </div>
      </header>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-sm text-slate-500">
            Memuat data dari Azure Cosmos DB...
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-red-50 px-6 py-4 ring-1 ring-red-200">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              Gagal Memuat Data
            </p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* ── Quick stat cards ────────────────────────── */}
      {!loading && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {QUICK_STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
                >
                  {/* subtle accent line */}
                  <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        s.positive
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {s.delta}
                    </span>
                  </div>

                  <p className="mt-3 text-2xl font-bold text-slate-800">
                    {s.value}
                  </p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* ── Main grid: Map + Side panel ─────────────── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* ─ Left column (2 cols) ───────────────────── */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Map placeholder */}
              <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                {/* Map header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm shadow-blue-200">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-700">
                        Peta Risiko Indonesia
                      </h2>
                      <p className="text-[11px] text-slate-400">
                        Pemetaan risiko seluruh wilayah
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 rounded-lg bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200 transition-colors hover:bg-slate-100">
                    Filter <ChevronRight className="h-3 w-3" />
                  </button>
                </div>

                {/* Placeholder map area */}
                <div className="relative flex min-h-[380px] items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 p-8">
                  {/* Decorative grid dots */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #334155 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />

                  {/* Animated scan ring */}
                  <div className="relative flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200">
                        <Scan className="h-8 w-8 text-blue-500" />
                      </div>
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                        {criticalAnomalies.length}
                      </span>
                      {/* Pulse ring */}
                      <span className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-600">
                        {anomalies.length} Anomali Terpantau
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Data langsung dari Azure Cosmos DB
                      </p>
                    </div>

                    {/* Decorative floating region badges */}
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      {[
                        ...new Set(
                          anomalies.map((a: any) => a.regionId).filter(Boolean),
                        ),
                      ]
                        .slice(0, 5)
                        .map((r: any) => (
                          <span
                            key={r}
                            className="rounded-full bg-white px-3 py-1 text-[10px] font-medium text-slate-500 shadow-sm ring-1 ring-slate-200"
                          >
                            {r}
                          </span>
                        ))}
                      {anomalies.length === 0 &&
                        ["Kalimantan", "Sulawesi", "NTB", "Papua", "Jawa"].map(
                          (r) => (
                            <span
                              key={r}
                              className="rounded-full bg-white px-3 py-1 text-[10px] font-medium text-slate-500 shadow-sm ring-1 ring-slate-200"
                            >
                              {r}
                            </span>
                          ),
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ─ Pre-Crime Predictor ─────────────────── */}
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm shadow-amber-200">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-700">
                        Deteksi Anomali Terkini
                      </h2>
                      <p className="text-[11px] text-slate-400">
                        Data langsung dari Azure Cosmos DB
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600 ring-1 ring-amber-200">
                    <Radio className="h-3 w-3 animate-pulse" />
                    Waktu Nyata
                  </span>
                </div>

                {predictions.length > 0 ? (
                  <ul className="divide-y divide-slate-100">
                    {predictions.map((p) => (
                      <li
                        key={p.id}
                        className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
                      >
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${riskDot(p.risk)}`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700">
                            {p.label}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {p.module}
                          </p>
                        </div>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${riskColor(p.risk)}`}
                        >
                          {p.risk}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {p.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center justify-center py-12 text-sm text-slate-400">
                    Belum ada anomali terdeteksi di database
                  </div>
                )}
              </div>
            </div>

            {/* ─ Side panel: SIGMA Report ──────────────── */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              {/* Report card */}
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="border-b border-slate-100 px-6 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Laporan SIGMA
                  </p>
                  <h3 className="text-base font-bold text-slate-800">
                    Ringkasan Sistem
                  </h3>
                </div>

                <div className="flex flex-col gap-5 px-6 py-5">
                  {/* Health Score */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        Skor Kesehatan
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          healthScore >= 70
                            ? "bg-emerald-100 text-emerald-600"
                            : healthScore >= 40
                              ? "bg-amber-100 text-amber-600"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {healthLabel}
                      </span>
                    </div>

                    <div className="mt-2 flex items-end gap-1.5">
                      <span
                        className={`text-3xl font-extrabold ${
                          healthScore >= 70
                            ? "text-emerald-600"
                            : healthScore >= 40
                              ? "text-amber-600"
                              : "text-red-600"
                        }`}
                      >
                        {healthScore}
                      </span>
                      <span className="mb-1 text-sm font-medium text-slate-400">
                        /100
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          healthScore >= 70
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                            : healthScore >= 40
                              ? "bg-gradient-to-r from-amber-500 to-amber-400"
                              : "bg-gradient-to-r from-red-500 to-red-400"
                        }`}
                        style={{ width: `${healthPct}%` }}
                      />
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Anomalies */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {anomalies.length} Anomali Terdeteksi
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {criticalAnomalies.length > 0 ? (
                          <>
                            <span className="font-semibold text-red-500">
                              {criticalAnomalies.length} kritis
                            </span>{" "}
                            membutuhkan perhatian segera
                          </>
                        ) : (
                          "Tidak ada anomali kritis"
                        )}
                      </p>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Reports */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {reports.length} Laporan Warga
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {pendingReports.length} menunggu tinjauan
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Breakdown mini-card */}
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h3 className="text-sm font-bold text-slate-700">
                    Distribusi Risiko
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Rincian tingkat risiko anomali
                  </p>
                </div>

                <div className="flex flex-col gap-3 px-6 py-5">
                  {riskBreakdown.map((r) => (
                    <div key={r.label} className="flex items-center gap-3">
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${r.color}`}
                      />
                      <span className="flex-1 text-xs text-slate-600">
                        {r.label}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {r.count}
                      </span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${r.color} transition-all duration-700`}
                          style={{ width: `${r.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {anomalies.length === 0 && (
                    <p className="text-xs text-slate-400 text-center">
                      Belum ada data anomali
                    </p>
                  )}
                </div>
              </div>

              {/* Recent activity mini-list */}
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h3 className="text-sm font-bold text-slate-700">
                    Aktivitas Terkini
                  </h3>
                </div>

                {recentActivity.length > 0 ? (
                  <ul className="divide-y divide-slate-100">
                    {recentActivity.map((a, i) => {
                      const AIcon = a.icon;
                      return (
                        <li
                          key={i}
                          className="flex items-start gap-3 px-6 py-3"
                        >
                          <AIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-slate-600">
                              {a.text}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {a.time}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="flex items-center justify-center py-8 text-xs text-slate-400">
                    Belum ada aktivitas
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
