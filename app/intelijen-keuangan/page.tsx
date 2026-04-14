"use client";

import { useState } from "react";
import { 
  FileUp, 
  FileSearch, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  Landmark
} from "lucide-react";
import { analyzeApbd } from "@/lib/api";

export default function MoneyIntelligencePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeApbd(file);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menganalisis dokumen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Landmark size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Intelijen Keuangan</h1>
          <p className="text-slate-500">Forensik Anggaran & Deteksi Anomali APBD</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FileUp size={20} className="text-blue-600" />
              Unggah Dokumen Anggaran
            </h2>
            
            <div 
              className={`
                border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center
                ${file ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}
              `}
            >
              <input 
                type="file" 
                id="apbd-upload" 
                className="hidden" 
                accept=".pdf"
                onChange={handleFileChange}
              />
              <label htmlFor="apbd-upload" className="cursor-pointer space-y-3 block">
                <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600">
                  {file ? <CheckCircle2 className="text-blue-600" /> : <FileUp />}
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-slate-700">
                    {file ? file.name : "Pilih file PDF APBD"}
                  </p>
                  <p className="text-xs text-slate-400">PDF maksimal 10MB</p>
                </div>
              </label>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`
                w-full mt-6 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                ${!file || loading 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 active:scale-[0.98]'}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Menganalisis...
                </>
              ) : (
                <>
                  <FileSearch size={18} />
                  Mulai Analisis Forensik
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex gap-3">
                <AlertCircle className="shrink-0" size={18} />
                <p>{error}</p>
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200 overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Insight Real-time</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                SIGMA menggunakan Azure Cognitive Services untuk mengekstrak data dari dokumen kompleks dan mendeteksi anomali anggaran secara instan.
              </p>
            </div>
            <div className="absolute -bottom-6 -right-6 text-slate-800 opacity-20">
              <Landmark size={120} />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <FileSearch size={20} className="text-blue-600" />
              Laporan Analisis
            </h2>
            {result && (
              <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                Selesai
              </span>
            )}
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                  <FileSearch size={32} />
                </div>
                <div className="max-w-[240px]">
                  <p className="text-slate-500 font-medium">Belum ada data untuk ditampilkan</p>
                  <p className="text-slate-400 text-xs mt-1">Silakan unggah dan analisis file APBD terlebih dahulu.</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-blue-50 border-t-blue-600 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                    <Loader2 size={24} className="animate-pulse" />
                  </div>
                </div>
                <div className="max-w-[240px]">
                  <p className="text-slate-700 font-semibold italic animate-pulse">Memproses Forensik...</p>
                  <p className="text-slate-400 text-xs mt-1 italic">Mengekstrak tabel dan menjalankan model intelijen.</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Snippet Teks Terekstrak</h4>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 font-mono text-xs text-slate-600 leading-relaxed max-h-32 overflow-y-auto">
                    {result.extracted_text_snippet}...
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Hasil Analisis Forensik</h4>
                  <div className="space-y-4 text-slate-700 leading-relaxed whitespace-pre-wrap text-sm bg-blue-50/30 p-5 rounded-2xl border border-blue-100">
                    {result.analysis}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-green-700">
                    <p className="font-bold mb-1">Analisis berhasil diselesaikan.</p>
                    <p>Hasil ini disimpan di repositori intelijen SIGMA untuk referensi audit masa depan.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
            <p className="text-[10px] text-center text-slate-400 italic">
              Didukung oleh Azure Open AI Service (GPT-4o)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
