"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Scan,
  History,
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  BookmarkCheck,
  ShieldAlert,
  Clock,
  Sparkles,
  Thermometer,
  Layers,
  ChevronRight,
  Info,
  Sprout,
  Siren,
} from "lucide-react";
import { getScanResultById, saveScanResult } from "@/lib/storage";
import {
  getFreshnessBadge,
  getRecommendedActionBadge,
  getCategoryLabel,
  getSurvivalBadge,
  formatDateTime,
} from "@/lib/validation";
import type { FreshnessAnalysisResult } from "@/types/analysis";

export function ScanResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [result, setResult] = useState<FreshnessAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedNotification, setSavedNotification] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const item = await getScanResultById(id);
        if (isMounted) {
          setResult(item);
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSaveAgain = async () => {
    if (!result) return;
    await saveScanResult(result);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin mx-auto" />
        <p className="text-sm font-semibold text-emerald-950">Memuat hasil analisis...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-5 nature-glass p-8 rounded-3xl border border-emerald-500/20">
        <HelpCircle className="w-12 h-12 text-emerald-600 mx-auto" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-emerald-950">Hasil Scan Tidak Ditemukan</h2>
          <p className="text-xs text-emerald-900/70">
            Riwayat ini mungkin telah dihapus dari memori lokal atau ID tidak valid.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/scanner"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-md"
          >
            Mulai Scan Baru
          </Link>
          <Link
            href="/history"
            className="px-5 py-2.5 rounded-xl border border-emerald-500/20 text-emerald-950 font-semibold text-xs hover:bg-emerald-500/10"
          >
            Lihat Riwayat
          </Link>
        </div>
      </div>
    );
  }

  const isPlant = result.scan_mode === "plant";
  const badge = getFreshnessBadge(result.freshness_status, result.category);
  const actionBadge = getRecommendedActionBadge(result.recommended_action, result.category);
  const survivalBadge = getSurvivalBadge(result.survival_outlook ?? "uncertain");

  // SVG Circular progress computation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.freshness_score / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Banner Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-emerald-900/70">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/history" className="hover:underline">Riwayat</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-emerald-950">Hasil Analisis</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveAgain}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{savedNotification ? "Tersimpan di Riwayat!" : "Simpan Hasil"}</span>
          </button>
          <Link
            href="/scanner"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow hover:bg-emerald-700 transition-colors"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Scan Ulang</span>
          </Link>
        </div>
      </div>

      {/* Main Glass Overview Card */}
      <div className="nature-glass rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Produce Image */}
          <div className="md:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-emerald-500/30 bg-black/5 aspect-square relative shadow-inner flex items-center justify-center">
              {result.image_data ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={result.image_data}
                  alt={result.item_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-emerald-900/50 space-y-2">
                  <Layers className="w-10 h-10 mx-auto" />
                  <p className="text-xs">Gambar tersimpan dalam mode hemat memori</p>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-900/60 px-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDateTime(result.timestamp)}
              </span>
              <span>Model: {result.model_used || "Groq Vision"}</span>
            </div>
          </div>

          {/* Core Metrics & Circular Score */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                  {badge.label}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
                  {getCategoryLabel(result.category)}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
                {result.item_name}
              </h1>
              <p className="text-xs text-emerald-900/70">
                Keyakinan identifikasi AI: <strong>{result.identification_confidence}%</strong>
              </p>
            </div>

            {/* Freshness Circular Progress Gauge */}
            <div className="p-4 rounded-2xl bg-white/70 border border-emerald-500/20 flex items-center gap-6">
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-emerald-900/10"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={badge.ring}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-emerald-950">{result.freshness_score}</span>
                  <span className="text-[10px] font-bold text-emerald-900/60 uppercase">/ 100</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  {isPlant ? "Estimasi Kesehatan Tanaman" : "Estimasi Kesegaran Visual"}
                </span>
                <p className="text-xs text-emerald-900/70 leading-relaxed">
                  {isPlant
                    ? "Berdasarkan penilaian visual warna daun, kesegaran (turgor), bercak, batang, dan pertumbuhan baru pada gambar."
                    : "Berdasarkan penilaian visual permukaan, warna, kecerahan, dan keutuhan bentuk pada gambar."}
                </p>
              </div>
            </div>

            {/* Recommended Action Card */}
            <div className={`p-4 rounded-2xl border ${actionBadge.color} space-y-1`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Rekomendasi: {actionBadge.label}</span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">{actionBadge.desc}</p>
            </div>
          </div>
        </div>

        {/* Plant Survival Outlook & Urgent Actions */}
        {isPlant && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-5 rounded-2xl border space-y-2 ${survivalBadge.color}`}>
              <div className="flex items-center gap-2 text-sm font-bold">
                <Sprout className="w-4 h-4" />
                <span>Peluang Hidup: {survivalBadge.label}</span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">{result.survival_explanation}</p>
            </div>

            <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/15 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-950">
                <Siren className="w-4 h-4 text-rose-600" />
                <span>Langkah Penanganan Segera</span>
              </div>
              {result.urgent_actions && result.urgent_actions.length > 0 ? (
                <ol className="space-y-2 text-xs text-rose-950/80">
                  {result.urgent_actions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-rose-500/15 text-rose-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tidak ada tindakan darurat yang diperlukan saat ini.</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Ringkasan Eksekutif */}
        <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-2">
          <h3 className="text-sm font-bold text-emerald-950">Ringkasan Analisis AI</h3>
          <p className="text-sm text-emerald-950/80 leading-relaxed">{result.summary}</p>
        </div>

        {/* Temuan Visual (Observations) & Potensi Masalah */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visual Observations */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Temuan Bukti Visual ({result.visual_observations?.length || 0})</span>
            </h3>
            <div className="space-y-2.5">
              {result.visual_observations && result.visual_observations.length > 0 ? (
                result.visual_observations.map((obs, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/70 border border-emerald-500/15 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emerald-950">{obs.finding}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          obs.severity === "high"
                            ? "bg-rose-100 text-rose-700"
                            : obs.severity === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {obs.severity}
                      </span>
                    </div>
                    <p className="text-emerald-900/60 text-[11px]">
                      Tingkat keyakinan: {obs.confidence}%
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-emerald-900/60 italic">Tidak ada kelainan visual yang teramati.</p>
              )}
            </div>
          </div>

          {/* Possible Issues / Disease Symptoms */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Dugaan Gejala / Kerusakan ({result.possible_issues?.length || 0})</span>
            </h3>
            <div className="space-y-2.5">
              {result.possible_issues && result.possible_issues.length > 0 ? (
                result.possible_issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/70 border border-amber-500/20 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950">{issue.name}</span>
                      <span className="text-[10px] text-amber-800 font-semibold">
                        Keyakinan: {issue.confidence}%
                      </span>
                    </div>
                    <p className="text-emerald-900/80 leading-relaxed text-[11px]">
                      {issue.explanation}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {isPlant
                      ? "Tidak terdeteksi gejala penyakit, hama, atau stres yang signifikan."
                      : "Tidak terdeteksi gejala penyakit tanaman atau kerusakan signifikan."}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tips Penyimpanan & Keterbatasan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Storage Tips */}
          <div className="p-5 rounded-2xl bg-emerald-600/5 border border-emerald-600/15 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-950">
              <Thermometer className="w-4 h-4 text-emerald-600" />
              <span>{isPlant ? "Tips Perawatan Rutin" : "Tips Penanganan & Penyimpanan"}</span>
            </div>
            <ul className="space-y-2 text-xs text-emerald-900/80">
              {result.storage_tips?.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Limitations */}
          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-950">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Batasan Analisis Gambar</span>
            </div>
            <ul className="space-y-2 text-xs text-amber-950/80">
              {result.limitations?.map((lim, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-4 border-t border-emerald-950/10 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/20 text-xs font-semibold text-emerald-950 hover:bg-emerald-500/10 transition-colors"
          >
            <History className="w-4 h-4" />
            <span>Lihat Semua Riwayat</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/education"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-emerald-500/20 text-xs font-semibold text-emerald-950 hover:border-emerald-500/40 transition-colors"
            >
              <Info className="w-4 h-4 text-emerald-600" />
              <span>{isPlant ? "Pelajari Gejala" : "Pelajari Gejala Pangan"}</span>
            </Link>
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all"
            >
              <Scan className="w-4 h-4" />
              <span>{isPlant ? "Pindai Tanaman Lain" : "Pindai Bahan Lain"}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
