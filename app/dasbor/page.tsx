import {
  ShieldAlert,
  MapPin,
  Activity,
  AlertTriangle,
  TrendingDown,
  FileWarning,
  Scan,
  Radio,
  Clock,
  ChevronRight,
  Layers,
  BarChart3,
  Zap,
} from "lucide-react";

/* ─── Mock data ─────────────────────────────────── */
const REPORT = {
  region: "Kab. Dompu",
  year: 2024,
  healthScore: 34,
  healthMax: 100,
  healthLabel: "KRITIS",
  anomalies: { total: 23, critical: 3 },
  compliance: { score: 41, max: 100 },
};

const PREDICTIONS = [
  {
    id: 1,
    label: "Pola belanja fiktif terdeteksi",
    risk: "TINGGI",
    module: "Intelijen Keuangan",
    time: "2 jam lalu",
  },
  {
    id: 2,
    label: "Duplikasi vendor pengadaan",
    risk: "SEDANG",
    module: "Mesin Cek-Silang",
    time: "5 jam lalu",
  },
  {
    id: 3,
    label: "Regulasi kedaluwarsa belum diperbarui",
    risk: "RENDAH",
    module: "Intelijen Regulasi",
    time: "1 hari lalu",
  },
];

const QUICK_STATS = [
  {
    label: "Total APBD Dipantau",
    value: "Rp 1.24 T",
    delta: "+3.2%",
    positive: true,
    icon: BarChart3,
  },
  {
    label: "Entitas Terpantau",
    value: "1,847",
    delta: "+12",
    positive: true,
    icon: Layers,
  },
  {
    label: "Peringatan Aktif",
    value: "38",
    delta: "+7",
    positive: false,
    icon: ShieldAlert,
  },
  {
    label: "Rata-rata Kepatuhan",
    value: "62%",
    delta: "−4%",
    positive: false,
    icon: Activity,
  },
];

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

/* ━━━━━━━━━━━━━━━━━━━━━━ PAGE ━━━━━━━━━━━━━━━━━━━━ */
export default function DashboardPage() {
  const healthPct = (REPORT.healthScore / REPORT.healthMax) * 100;
  const compliancePct = (REPORT.compliance.score / REPORT.compliance.max) * 100;

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

        <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs text-slate-500 shadow-sm ring-1 ring-slate-200">
          <Clock className="h-3.5 w-3.5" />
          <span>
            Langsung · {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
      </header>

      {/* ── Quick stat cards ────────────────────────── */}
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

              <p className="mt-3 text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Main grid: Map + Side panel ─────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ─ Map widget (2 cols) ───────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Map */}
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
                    3
                  </span>
                  {/* Pulse ring */}
                  <span className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-600">
                    Placeholder Peta Risiko Interaktif
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Integrasi peta interaktif akan ditampilkan di sini
                  </p>
                </div>

                {/* Decorative floating region badges */}
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {["Kalimantan", "Sulawesi", "NTB", "Papua", "Jawa"].map(
                    (r) => (
                      <span
                        key={r}
                        className="rounded-full bg-white px-3 py-1 text-[10px] font-medium text-slate-500 shadow-sm ring-1 ring-slate-200"
                      >
                        {r}
                      </span>
                    )
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
                    Prediktor Pra-Kejahatan
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Deteksi dini anomali keuangan daerah
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600 ring-1 ring-amber-200">
                <Radio className="h-3 w-3 animate-pulse" />
                Waktu Nyata
              </span>
            </div>

            <ul className="divide-y divide-slate-100">
              {PREDICTIONS.map((p) => (
                <li
                  key={p.id}
                  className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${riskDot(
                      p.risk
                    )}`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">
                      {p.label}
                    </p>
                    <p className="text-[11px] text-slate-400">{p.module}</p>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${riskColor(
                      p.risk
                    )}`}
                  >
                    {p.risk}
                  </span>
                  <span className="text-[10px] text-slate-400">{p.time}</span>
                </li>
              ))}
            </ul>
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
                {REPORT.region} {REPORT.year}
              </h3>
            </div>

            <div className="flex flex-col gap-5 px-6 py-5">
              {/* Health Score */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Skor Kesehatan
                  </span>
                  <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                    {REPORT.healthLabel}
                  </span>
                </div>

                <div className="mt-2 flex items-end gap-1.5">
                  <span className="text-3xl font-extrabold text-red-600">
                    {REPORT.healthScore}
                  </span>
                  <span className="mb-1 text-sm font-medium text-slate-400">
                    /{REPORT.healthMax}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-700"
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
                    {REPORT.anomalies.total} Anomali Terdeteksi
                  </p>
                  <p className="text-[11px] text-slate-400">
                    <span className="font-semibold text-red-500">
                      {REPORT.anomalies.critical} kritis
                    </span>{" "}
                    membutuhkan perhatian segera
                  </p>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Compliance */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Skor Kepatuhan
                  </span>
                  <span className="text-xs font-bold text-amber-600">
                    {REPORT.compliance.score}/{REPORT.compliance.max}
                  </span>
                </div>

                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700"
                    style={{ width: `${compliancePct}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Di bawah ambang batas minimum (70/100)
                </p>
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
              {[
                { label: "Kritis", count: 3, color: "bg-red-500", pct: 13 },
                { label: "Tinggi", count: 7, color: "bg-orange-500", pct: 30 },
                { label: "Sedang", count: 8, color: "bg-amber-400", pct: 35 },
                { label: "Rendah", count: 5, color: "bg-emerald-500", pct: 22 },
              ].map((r) => (
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
            </div>
          </div>

          {/* Recent activity mini-list */}
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-sm font-bold text-slate-700">
                Aktivitas Terkini
              </h3>
            </div>

            <ul className="divide-y divide-slate-100">
              {[
                {
                  icon: FileWarning,
                  text: "Laporan anomali Kab. Dompu diterbitkan",
                  time: "10 menit lalu",
                },
                {
                  icon: TrendingDown,
                  text: "Skor Kesehatan turun 12 poin",
                  time: "1 jam lalu",
                },
                {
                  icon: Scan,
                  text: "Pemindaian otomatis selesai — 3 temuan baru",
                  time: "3 jam lalu",
                },
              ].map((a, i) => {
                const AIcon = a.icon;
                return (
                  <li key={i} className="flex items-start gap-3 px-6 py-3">
                    <AIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-600">
                        {a.text}
                      </p>
                      <p className="text-[10px] text-slate-400">{a.time}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
