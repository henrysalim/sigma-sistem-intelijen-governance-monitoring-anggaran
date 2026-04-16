"use client";

import { useState, useRef, useEffect } from "react";
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
  Loader2,
  Volume2,
} from "lucide-react";
import {
  classifyImage,
  submitCitizenReport,
  fetchAnomalies,
  fetchCitizenReports,
  synthesizeSpeech,
} from "@/lib/api";

/* ━━━━━━━━━━━━━━━━━━━━━━ PAGE ━━━━━━━━━━━━━━━━━━━━ */
export default function CitizenEngagementPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchData, setSearchData] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");

  // Photo upload state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [classificationResults, setClassificationResults] = useState<any[]>([]);
  const [classifyLoading, setClassifyLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Report submission
  const [reportDescription, setReportDescription] = useState("");
  const [reportLocation, setReportLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);

  // TTS
  const [ttsLoading, setTtsLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setSearched(true);
    setSearchLoading(true);
    setSearchData(null);

    try {
      const [anomaliesRes, reportsRes] = await Promise.all([
        fetchAnomalies(q).catch(() => ({ data: [] })),
        fetchCitizenReports(q).catch(() => ({ data: [] })),
      ]);

      setSearchData({
        anomalies: anomaliesRes.data || [],
        reports: reportsRes.data || [],
        query: q,
      });
    } catch {
      setSearchData({ anomalies: [], reports: [], query: q });
    } finally {
      setSearchLoading(false);
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setClassifyLoading(true);

    try {
      const result = await classifyImage(file);
      setUploadedFiles((prev) => [...prev, file]);
      setClassificationResults((prev) => [
        ...prev,
        { fileName: file.name, ...result },
      ]);
    } catch (err: any) {
      setClassificationResults((prev) => [
        ...prev,
        { fileName: file.name, error: err.message },
      ]);
    } finally {
      setClassifyLoading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmitReport() {
    if (!reportDescription.trim()) return;

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const data = await submitCitizenReport({
        description: reportDescription,
        regionId: reportLocation || undefined,
        location: reportLocation || undefined,
        category: "infrastruktur",
        photos: uploadedFiles.map((f) => f.name),
        classification:
          classificationResults.length > 0
            ? classificationResults[classificationResults.length - 1]
                ?.classification
            : undefined,
      });

      setSubmitResult(data);
      // Reset form
      setReportDescription("");
      setReportLocation("");
      setUploadedFiles([]);
      setClassificationResults([]);
    } catch (err: any) {
      setSubmitResult({ error: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTts(text: string) {
    setTtsLoading(true);
    try {
      const audioBlob = await synthesizeSpeech(text);
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      console.error("TTS failed:", err);
    } finally {
      setTtsLoading(false);
    }
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
          mengunggah foto infrastruktur untuk dianalisis AI.
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
          Masukkan nama kabupaten/kota untuk melihat data anomali dan laporan
          warga dari Azure Cosmos DB.
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
            disabled={searchLoading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all hover:shadow-lg hover:shadow-emerald-300 disabled:opacity-60"
          >
            {searchLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
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
                  setSearchLoading(true);
                  setSearchData(null);
                  Promise.all([
                    fetchAnomalies(r).catch(() => ({ data: [] })),
                    fetchCitizenReports(r).catch(() => ({ data: [] })),
                  ]).then(([anomaliesRes, reportsRes]) => {
                    setSearchData({
                      anomalies: anomaliesRes.data || [],
                      reports: reportsRes.data || [],
                      query: r,
                    });
                    setSearchLoading(false);
                  });
                }}
                className="rounded-full bg-white px-3 py-1 text-[10px] font-medium text-slate-500 ring-1 ring-slate-200 transition-colors hover:bg-emerald-50 hover:text-emerald-600 hover:ring-emerald-300"
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Search loading */}
        {searchLoading && (
          <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
            <span className="text-sm text-slate-500">
              Mencari data dari Azure Cosmos DB...
            </span>
          </div>
        )}

        {/* Result card */}
        {searched && searchData && !searchLoading && (
          <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Hasil Pencarian — Azure Cosmos DB
                </p>
                <h3 className="mt-0.5 text-lg font-bold text-slate-800">
                  {searchData.query}
                </h3>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold ring-1 ${
                  searchData.anomalies.length > 0
                    ? "bg-red-100 text-red-600 ring-red-200"
                    : "bg-emerald-100 text-emerald-600 ring-emerald-200"
                }`}
              >
                {searchData.anomalies.length > 0 ? "Perlu Perhatian" : "Aman"}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Anomalies stats */}
              <div className="rounded-xl bg-gradient-to-br from-red-50 to-rose-50 p-4 ring-1 ring-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-red-600">
                    Anomali Terdeteksi
                  </span>
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </div>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-3xl font-extrabold text-red-600">
                    {searchData.anomalies.length}
                  </span>
                  <span className="mb-1 text-sm text-slate-400">temuan</span>
                </div>
                {searchData.anomalies.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-1 max-h-20 overflow-y-auto">
                    {searchData.anomalies
                      .slice(0, 3)
                      .map((a: any, i: number) => (
                        <li
                          key={i}
                          className="text-[10px] text-red-600 truncate"
                        >
                          • {a.description || a.type}
                        </li>
                      ))}
                  </ul>
                )}
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
                    {searchData.reports.length}
                  </span>
                  <span className="mb-1 text-sm text-slate-400">laporan</span>
                </div>
                {searchData.reports.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <Eye className="h-3 w-3 text-blue-400" />
                    <span className="text-[10px] text-blue-500">
                      {
                        searchData.reports.filter(
                          (r: any) => r.status === "pending_review",
                        ).length
                      }{" "}
                      sedang ditinjau
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Recent reports list */}
            {searchData.reports.length > 0 && (
              <div className="mt-5 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-600">
                    Laporan Warga Terkini
                  </h4>
                  <button
                    onClick={() => {
                      const summaryText = searchData.reports
                        .slice(0, 3)
                        .map((r: any) => r.description)
                        .join(". ");
                      handleTts(
                        `Ringkasan laporan warga untuk ${searchData.query}: ${summaryText}`,
                      );
                    }}
                    disabled={ttsLoading}
                    className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600 ring-1 ring-emerald-200 hover:bg-emerald-100 disabled:opacity-50"
                  >
                    <Volume2 className="h-3 w-3" />
                    {ttsLoading ? "Memuat..." : "Dengarkan"}
                  </button>
                </div>
                <ul className="divide-y divide-slate-200">
                  {searchData.reports
                    .slice(0, 5)
                    .map((report: any, i: number) => (
                      <li key={i} className="flex items-start gap-3 py-2.5">
                        <div className="flex flex-col items-center gap-0.5 pt-0.5">
                          <FileText className="h-3 w-3 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-600">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                                report.status === "pending_review"
                                  ? "bg-amber-100 text-amber-600"
                                  : "bg-emerald-100 text-emerald-600"
                              }`}
                            >
                              {report.status === "pending_review"
                                ? "Menunggu"
                                : report.status}
                            </span>
                            {report.submittedAt && (
                              <span className="text-[10px] text-slate-400">
                                {new Date(
                                  report.submittedAt,
                                ).toLocaleDateString("id-ID")}
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {searchData.anomalies.length === 0 &&
              searchData.reports.length === 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                  <Info className="h-4 w-4 text-slate-400" />
                  <p className="text-xs text-slate-500">
                    Belum ada data untuk region ini di database. Data akan
                    tersedia setelah ada laporan atau analisis.
                  </p>
                </div>
              )}
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
                Unggah foto infrastruktur — AI akan mengklasifikasikan kondisi
              </p>
            </div>
          </div>

          {/* Drop zone */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={classifyLoading}
            className="mt-4 flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 transition-colors hover:border-violet-400 hover:bg-violet-50 disabled:opacity-60"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
              {classifyLoading ? (
                <Loader2 className="h-6 w-6 text-violet-500 animate-spin" />
              ) : (
                <ImagePlus className="h-6 w-6 text-violet-500" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600">
                {classifyLoading
                  ? "Menganalisis foto..."
                  : "Klik untuk mengunggah foto"}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                JPG, PNG · Foto akan dianalisis oleh Azure Custom Vision
              </p>
            </div>
          </button>

          {/* Classification results */}
          {classificationResults.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Hasil Klasifikasi AI
              </p>
              {classificationResults.map((result, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-lg px-3 py-2 ring-1 ${
                    result.error
                      ? "bg-red-50 ring-red-200"
                      : "bg-emerald-50 ring-emerald-200"
                  }`}
                >
                  {result.error ? (
                    <>
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                      <div>
                        <span className="text-xs font-medium text-red-700">
                          {result.fileName}
                        </span>
                        <p className="text-[10px] text-red-600">
                          {result.error}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-xs font-medium text-emerald-700">
                          {result.fileName}
                        </span>
                        {result.classification?.topPrediction && (
                          <div className="mt-1 flex items-center gap-2">
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                              {result.classification.topPrediction.tagName}
                            </span>
                            <span className="text-[10px] text-emerald-600">
                              {result.classification.topPrediction.probability}
                            </span>
                          </div>
                        )}
                        {result.classification?.allPredictions && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {result.classification.allPredictions
                              .slice(1, 4)
                              .map((pred: any, j: number) => (
                                <span
                                  key={j}
                                  className="text-[9px] text-slate-500"
                                >
                                  {pred.tagName}: {pred.probability}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Report form */}
          <div className="mt-4 space-y-3">
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Deskripsikan temuan infrastruktur Anda..."
              rows={3}
              className="w-full rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-violet-400 focus:outline-none resize-none"
            />
            <input
              type="text"
              value={reportLocation}
              onChange={(e) => setReportLocation(e.target.value)}
              placeholder="Lokasi (contoh: Kec. Wera, Kab. Bima)"
              className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-700 ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-violet-400 focus:outline-none"
            />
          </div>

          {/* Submit result */}
          {submitResult && (
            <div
              className={`mt-3 flex items-start gap-2 rounded-lg px-3 py-2 ring-1 ${
                submitResult.error
                  ? "bg-red-50 ring-red-200"
                  : "bg-emerald-50 ring-emerald-200"
              }`}
            >
              {submitResult.error ? (
                <>
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500 mt-0.5" />
                  <p className="text-[10px] text-red-700">
                    {submitResult.error}
                  </p>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-semibold text-emerald-700">
                      Laporan berhasil dikirim ke Azure Cosmos DB!
                    </p>
                    {submitResult.safetyCheck && (
                      <p className="text-[9px] text-emerald-600 mt-0.5">
                        Keamanan konten:{" "}
                        {submitResult.safetyCheck.isSafe
                          ? "✓ Aman"
                          : "⚠ Perlu review"}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tips */}
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2 ring-1 ring-blue-200">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
            <p className="text-[10px] leading-relaxed text-blue-700">
              Foto Anda akan dianalisis oleh Azure Custom Vision untuk
              klasifikasi. Teks laporan akan dicek keamanannya oleh Azure
              Content Safety. Identitas pelapor dilindungi.
            </p>
          </div>
        </div>

        {/* Report guidelines + Submit */}
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
          <button
            onClick={handleSubmitReport}
            disabled={!reportDescription.trim() || submitting}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
              !reportDescription.trim() || submitting
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-200 hover:shadow-lg hover:shadow-violet-300"
            }`}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Kirim Laporan
              </>
            )}
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
                  Halo! 👋 Saya asisten SIGMA. Gunakan fitur &quot;Cek
                  Transparansi&quot; di atas untuk mencari data dari Azure
                  Cosmos DB, atau kirimkan laporan warga Anda.
                </p>
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
              Didukung oleh Azure AI Services
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
