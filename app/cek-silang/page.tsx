"use client";

import { useState, useRef } from "react";
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
  Loader2,
  Tag,
  Key,
} from "lucide-react";
import { analyzeApbd, analyzeLanguage, saveAnomalyData } from "@/lib/api";

/* ━━━━━━━━━━━━━━━━━━━━━━ PAGE ━━━━━━━━━━━━━━━━━━━━ */
export default function CrossCheckPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Results from Azure
  const [docResult, setDocResult] = useState<any>(null);
  const [entities, setEntities] = useState<any>(null);
  const [keyPhrases, setKeyPhrases] = useState<any>(null);

  async function handleUpload() {
    if (!file) {
      fileInputRef.current?.click();
      return;
    }

    setAnalyzing(true);
    setDone(false);
    setError(null);
    setDocResult(null);
    setEntities(null);
    setKeyPhrases(null);

    try {
      // Step 1: Analyze document with Azure Document Intelligence
      const docData = await analyzeApbd(file);
      setDocResult(docData);

      // Step 2: Run NLP on extracted content
      const textContent = docData.analysis?.content;
      if (textContent) {
        // Take first 5000 chars to stay within limits
        const textSnippet = textContent.substring(0, 5000);

        const [entRes, kpRes] = await Promise.all([
          analyzeLanguage("entities", [textSnippet]),
          analyzeLanguage("keyphrases", [textSnippet]),
        ]);
        setEntities(entRes.results?.[0]);
        setKeyPhrases(kpRes.results?.[0]);

        // Step 3: Save findings to Cosmos DB as anomaly
        try {
          await saveAnomalyData({
            type: "lkpd-analysis",
            description: `Analisis otomatis dokumen ${file.name}`,
            module: "Cek-Silang",
            severity: "SEDANG",
            metadata: {
              fileName: file.name,
              pageCount: docData.analysis?.pageCount,
              tableCount: docData.analysis?.tableCount,
              entityCount: entRes.results?.[0]?.entities?.length || 0,
              keyPhraseCount: kpRes.results?.[0]?.keyPhrases?.length || 0,
            },
          });
        } catch (saveErr) {
          console.warn("Failed to save to Cosmos, continuing:", saveErr);
        }
      }

      setDone(true);
    } catch (err: any) {
      setError(err.message || "Gagal menganalisis dokumen");
    } finally {
      setAnalyzing(false);
    }
  }

  function handleReset() {
    setFile(null);
    setAnalyzing(false);
    setDone(false);
    setError(null);
    setDocResult(null);
    setEntities(null);
    setKeyPhrases(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  const uploaded = !!file;
  const analysis = docResult?.analysis;

  // Group entities by category for display
  const entityGroups: Record<string, any[]> = {};
  if (entities?.entities) {
    for (const ent of entities.entities) {
      const cat = ent.category || "Other";
      if (!entityGroups[cat]) entityGroups[cat] = [];
      entityGroups[cat].push(ent);
    }
  }

  // Filter financial entities
  const financialEntities = entities?.entities?.filter(
    (e: any) =>
      e.category === "Quantity" ||
      e.category === "DateTime" ||
      e.category === "Organization" ||
      e.category === "Person" ||
      e.category === "Location"
  ) || [];

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
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          {uploaded && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-200"
            >
              Reset
            </button>
          )}
          <button
            onClick={() => {
              if (!file) {
                fileInputRef.current?.click();
              } else {
                handleUpload();
              }
            }}
            disabled={analyzing}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:shadow-blue-300 disabled:opacity-60"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menganalisis…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                {file ? "Mulai Analisis" : "Unggah Dokumen LKPD"}
              </>
            )}
          </button>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-red-50 px-6 py-4 ring-1 ring-red-200">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700">Gagal Menganalisis</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* ── Pipeline indicator ────────────────────── */}
      <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-200">
        {[
          { label: "Unggah LKPD", active: uploaded },
          { label: "Analisis APBD", active: analyzing || done },
          { label: "NLP & Entitas", active: done },
          { label: "Simpan Temuan", active: done },
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
              {file!.name}
            </p>
            <p className="text-[11px] text-blue-500">
              {(file!.size / 1024).toFixed(1)} KB · Diunggah baru saja
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
              Memproses dokumen dengan Azure AI…
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Mengekstrak data APBD, menjalankan NLP, menyimpan temuan
            </p>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-64 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
              style={{ width: "65%" }}
            />
          </div>
        </div>
      )}

      {/* ── Three-column results ──────────────────── */}
      {done && analysis && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ──────── Column 1: Extracted Data (Document Intelligence) ──────── */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                <Landmark className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-700">
                  Data Terekstrak
                </h2>
                <p className="text-[10px] text-slate-400">Azure Document Intelligence</p>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
                <FileSearch className="h-4 w-4 text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Ringkasan Dokumen
                </span>
              </div>
              <div className="grid grid-cols-3 gap-0 divide-x divide-slate-100 px-2 py-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{analysis.pageCount}</p>
                  <p className="text-[10px] text-slate-400">Halaman</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-indigo-600">{analysis.tableCount}</p>
                  <p className="text-[10px] text-slate-400">Tabel</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-violet-600">{analysis.paragraphCount}</p>
                  <p className="text-[10px] text-slate-400">Paragraf</p>
                </div>
              </div>
            </div>

            {/* Content preview */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="border-b border-slate-100 px-5 py-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Konten Terekstrak
                </span>
              </div>
              <div className="px-5 py-4">
                <div className="max-h-48 overflow-y-auto rounded-lg bg-slate-50 p-3 font-mono text-[11px] text-slate-600 leading-relaxed ring-1 ring-slate-200 whitespace-pre-wrap">
                  {analysis.content
                    ? analysis.content.substring(0, 1500) + (analysis.content.length > 1500 ? "\n\n..." : "")
                    : "Tidak ada konten teks."}
                </div>
              </div>
            </div>

            {/* Tables */}
            {analysis.tables && analysis.tables.length > 0 && (
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-blue-200">
                <div className="flex items-center gap-2 border-b border-blue-100 px-5 py-3">
                  <Scale className="h-4 w-4 text-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    {analysis.tableCount} Tabel Ditemukan
                  </span>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {analysis.tables.slice(0, 2).map((table: any, idx: number) => (
                    <div key={idx} className="rounded-lg bg-blue-50 p-3 ring-1 ring-blue-100">
                      <p className="text-xs font-semibold text-blue-700 mb-1">
                        Tabel {idx + 1}: {table.rowCount}×{table.columnCount}
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-[10px] text-slate-600">
                          <tbody>
                            {Array.from({ length: Math.min(table.rowCount, 4) }).map((_, rowIdx) => (
                              <tr key={rowIdx} className={rowIdx === 0 ? "font-semibold" : "border-t border-blue-100"}>
                                {Array.from({ length: Math.min(table.columnCount, 4) }).map((_, colIdx) => {
                                  const cell = table.cells.find(
                                    (c: any) => c.rowIndex === rowIdx && c.columnIndex === colIdx
                                  );
                                  return (
                                    <td key={colIdx} className="px-1.5 py-1">
                                      {cell?.content || ""}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ──────── Column 2: NLP Analysis (Language Service) ──────── */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <BookOpenText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-700">
                  Analisis NLP
                </h2>
                <p className="text-[10px] text-slate-400">
                  Azure AI Language
                </p>
              </div>
            </div>

            {/* Key Phrases */}
            {keyPhrases && (
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-2 border-b border-indigo-100 px-5 py-3">
                  <Key className="h-4 w-4 text-indigo-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    Frasa Kunci ({keyPhrases.keyPhrases?.length || 0})
                  </span>
                </div>
                <div className="px-5 py-4">
                  {keyPhrases.keyPhrases?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {keyPhrases.keyPhrases.slice(0, 20).map((phrase: string, i: number) => (
                        <span
                          key={i}
                          className="rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700 ring-1 ring-indigo-200"
                        >
                          {phrase}
                        </span>
                      ))}
                      {keyPhrases.keyPhrases.length > 20 && (
                        <span className="rounded-lg bg-slate-50 px-2 py-1 text-[11px] text-slate-400 ring-1 ring-slate-200">
                          +{keyPhrases.keyPhrases.length - 20} lagi
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Tidak ada frasa kunci terdeteksi.</p>
                  )}
                </div>
              </div>
            )}

            {/* Entities */}
            {entities && (
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-2 border-b border-blue-100 px-5 py-3">
                  <Tag className="h-4 w-4 text-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    Entitas Terdeteksi ({entities.entities?.length || 0})
                  </span>
                </div>
                <div className="px-5 py-4 space-y-3 max-h-80 overflow-y-auto">
                  {Object.keys(entityGroups).length > 0 ? (
                    Object.entries(entityGroups).map(([category, ents]) => (
                      <div key={category}>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          {category} ({ents.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {ents.slice(0, 8).map((ent: any, i: number) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200"
                            >
                              {ent.text}
                              <span className="text-[9px] text-blue-500 font-semibold">
                                {Math.round(ent.confidenceScore * 100)}%
                              </span>
                            </span>
                          ))}
                          {ents.length > 8 && (
                            <span className="text-[10px] text-slate-400 self-center">
                              +{ents.length - 8}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">Tidak ada entitas terdeteksi.</p>
                  )}
                </div>
              </div>
            )}

            {/* Matched stats */}
            <div className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 shadow-md shadow-blue-200">
              <Zap className="h-5 w-5 text-blue-200" />
              <div>
                <p className="text-xs font-bold text-white">
                  {entities?.entities?.length || 0} Entitas · {keyPhrases?.keyPhrases?.length || 0} Frasa Kunci
                </p>
                <p className="text-[10px] text-blue-200">
                  Dianalisis oleh Azure AI Language
                </p>
              </div>
            </div>
          </div>

          {/* ──────── Column 3: Summary & Findings ──────── */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                <Gavel className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-700">
                  Ringkasan Temuan
                </h2>
                <p className="text-[10px] text-slate-400">Dihasilkan oleh AI</p>
              </div>
            </div>

            {/* Main findings card */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 p-[1px] shadow-lg shadow-indigo-200">
              <div className="rounded-[15px] bg-gradient-to-br from-indigo-600 to-blue-700 px-5 py-5">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-indigo-200" />
                  <span className="text-sm font-extrabold uppercase tracking-wider text-white">
                    Hasil Analisis
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-indigo-100">
                  Dokumen {docResult?.fileName || "LKPD"} berhasil dianalisis
                  oleh Azure AI. Ditemukan {analysis.tableCount} tabel data,
                  {" "}{entities?.entities?.length || 0} entitas relevan, dan
                  {" "}{keyPhrases?.keyPhrases?.length || 0} frasa kunci.
                </p>

                <div className="mt-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2">
                    <span className="text-[11px] text-indigo-200">Halaman Dianalisis</span>
                    <span className="text-base font-extrabold text-white">{analysis.pageCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2">
                    <span className="text-[11px] text-indigo-200">Tabel Ditemukan</span>
                    <span className="text-base font-extrabold text-white">{analysis.tableCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2">
                    <span className="text-[11px] text-indigo-200">Entitas Terdeteksi</span>
                    <span className="text-base font-extrabold text-white">{entities?.entities?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key financial entities */}
            {financialEntities.length > 0 && (
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="border-b border-slate-100 px-5 py-3">
                  <h3 className="text-xs font-bold text-slate-700">
                    Entitas Keuangan & Organisasi
                  </h3>
                </div>
                <ul className="divide-y divide-slate-100">
                  {financialEntities.slice(0, 10).map((ent: any, i: number) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-slate-50"
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="flex-1 text-[11px] text-slate-600">
                        {ent.text}
                      </span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">
                        {ent.category}
                      </span>
                      <ChevronRight className="h-3 w-3 text-slate-300" />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Paragraphs with roles */}
            {analysis.paragraphs?.filter((p: any) => p.role).length > 0 && (
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="border-b border-slate-100 px-5 py-3">
                  <h3 className="text-xs font-bold text-slate-700">
                    Struktur Dokumen
                  </h3>
                </div>
                <div className="flex flex-col gap-0 px-5 py-4">
                  {analysis.paragraphs
                    .filter((p: any) => p.role)
                    .slice(0, 6)
                    .map((p: any, i: number) => (
                      <div key={i} className="flex gap-3 pb-2">
                        <div className="flex flex-col items-center">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-500" />
                          {i < 5 && <span className="w-px flex-1 bg-slate-200" />}
                        </div>
                        <div className="pb-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
                            {p.role}
                          </p>
                          <p className="text-[11px] font-medium text-slate-700 line-clamp-2">
                            {p.content}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Saved confirmation */}
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-xs font-bold text-emerald-700">
                  Temuan Disimpan ke Azure Cosmos DB
                </p>
                <p className="text-[10px] text-emerald-600">
                  Data tersedia di dashboard untuk monitoring
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Empty state ──────────────────────────── */}
      {!uploaded && !error && (
        <div className="flex flex-col items-center gap-5 rounded-2xl bg-white py-20 shadow-sm ring-1 ring-slate-200">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200">
            <Upload className="h-8 w-8 text-slate-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-600">
              Unggah dokumen LKPD untuk memulai
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              AI akan menganalisis data keuangan, menjalankan NLP, dan
              menyimpan temuan ke database
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["PDF"].map((fmt) => (
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
