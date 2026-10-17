"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Scan,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Thermometer,
  Layers,
  ChevronRight,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { calculateDashboardStats, getAllScanResults } from "@/lib/storage";
import { getFreshnessBadge, formatDateTime, getCategoryLabel } from "@/lib/validation";
import type { DashboardStats, FreshnessAnalysisResult } from "@/types/analysis";

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalScans: 0,
    freshCount: 0,
    moderateCount: 0,
    poorCount: 0,
    uncertainCount: 0,
    avgScore: 0,
    categoryCounts: { fruit: 0, vegetable: 0, plant: 0, other: 0, unknown: 0 },
  });
  const [recentScans, setRecentScans] = useState<FreshnessAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const [dashStats, allScans] = await Promise.all([
          calculateDashboardStats(),
          getAllScanResults(),
        ]);
        setStats(dashStats);
        setRecentScans(allScans.slice(0, 5));
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Bar chart data for status counts
  const statusChartData = [
    { name: "Segar / Sehat", count: stats.freshCount, color: "#10b981" },
    { name: "Perlu Cek / Stres", count: stats.moderateCount, color: "#f59e0b" },
    { name: "Rusak / Kritis", count: stats.poorCount, color: "#f43f5e" },
    { name: "Tidak Yakin", count: stats.uncertainCount, color: "#64748b" },
  ];

  // Category breakdown for pie/badges
  const categoryData = [
    { name: "Buah", count: stats.categoryCounts.fruit, color: "#059669" },
    { name: "Sayur", count: stats.categoryCounts.vegetable, color: "#10b981" },
    { name: "Tanaman", count: stats.categoryCounts.plant, color: "#0d9488" },
    { name: "Lainnya", count: stats.categoryCounts.other, color: "#84cc16" },
  ].filter((c) => c.count > 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Banner / Hero */}
      <div className="nature-glass rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dashboard Analitik & Pemantauan Mutu</span>
          </div>
          <h1 className="text-3xl font-black text-emerald-950 tracking-tight">
            Ringkasan Hasil Pemindaian Anda
          </h1>
          <p className="text-xs sm:text-sm text-emerald-900/70">
            Statistik dan wawasan dari pemindaian bahan pangan dan tanaman yang tersimpan di perangkat ini.
          </p>
        </div>

        <Link
          href="/scanner"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all"
        >
          <Scan className="w-4 h-4" />
          <span>Scan Bahan Sekarang</span>
        </Link>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Scans */}
        <div className="nature-glass-card rounded-2xl p-5 border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-900/60 uppercase">Total Pemindaian</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-950">{stats.totalScans}</div>
          <p className="text-[11px] text-emerald-800/70">
            {stats.totalScans > 0 ? "Tercatat di IndexedDB lokal" : "Belum ada rekaman scan"}
          </p>
        </div>

        {/* Kondisi Baik / Segar */}
        <div className="nature-glass-card rounded-2xl p-5 border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-900/60 uppercase">Segar / Sehat</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">{stats.freshCount}</div>
          <p className="text-[11px] text-emerald-800/70">
            {stats.totalScans > 0
              ? `${Math.round((stats.freshCount / stats.totalScans) * 100)}% dari total sampel`
              : "0% sampel"}
          </p>
        </div>

        {/* Perlu Diperiksa */}
        <div className="nature-glass-card rounded-2xl p-5 border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900/60 uppercase">Perlu Cek / Stres</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">{stats.moderateCount}</div>
          <p className="text-[11px] text-amber-800/70">
            {stats.totalScans > 0
              ? `${Math.round((stats.moderateCount / stats.totalScans) * 100)}% butuh perhatian`
              : "0% sampel"}
          </p>
        </div>

        {/* Indikasi Kerusakan */}
        <div className="nature-glass-card rounded-2xl p-5 border-rose-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-900/60 uppercase">Rusak / Kritis</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600">{stats.poorCount}</div>
          <p className="text-[11px] text-rose-800/70">
            {stats.totalScans > 0
              ? `${Math.round((stats.poorCount / stats.totalScans) * 100)}% tanda degradasi berat`
              : "0% sampel"}
          </p>
        </div>
      </div>

      {/* Visual Charts & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart: Distribusi Status */}
        <div className="lg:col-span-8 nature-glass rounded-3xl p-6 border border-emerald-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-emerald-950">Distribusi Kondisi Hasil Scan</h3>
              <p className="text-xs text-emerald-900/60">Perbandingan jumlah hasil scan berdasarkan status visual</p>
            </div>
            {stats.totalScans > 0 && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800">
                Rata-rata Skor: {stats.avgScore}/100
              </span>
            )}
          </div>

          {stats.totalScans === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-2 text-emerald-900/50">
              <Layers className="w-10 h-10 stroke-1" />
              <p className="text-xs">Grafik akan muncul setelah Anda melakukan pemindaian pertama.</p>
            </div>
          ) : (
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#064e3b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#064e3b" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "12px",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Quick Tips & Categorical Stats */}
        <div className="lg:col-span-4 nature-glass rounded-3xl p-6 border border-emerald-500/20 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-emerald-600" />
              <span>Kategori Terbanyak</span>
            </h3>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-white/70 border border-emerald-500/15 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-950">Buah-buahan</span>
                <span className="font-bold text-emerald-700">{stats.categoryCounts.fruit} sampel</span>
              </div>
              <div className="p-3 rounded-xl bg-white/70 border border-emerald-500/15 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-950">Sayuran</span>
                <span className="font-bold text-emerald-700">{stats.categoryCounts.vegetable} sampel</span>
              </div>
              <div className="p-3 rounded-xl bg-white/70 border border-emerald-500/15 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-950">Tanaman</span>
                <span className="font-bold text-emerald-700">{stats.categoryCounts.plant} sampel</span>
              </div>
              <div className="p-3 rounded-xl bg-white/70 border border-emerald-500/15 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-950">Bahan Lain</span>
                <span className="font-bold text-emerald-700">{stats.categoryCounts.other} sampel</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Tips Kesegaran Harian</span>
            </div>
            <p className="text-[11px] text-emerald-900/80 leading-relaxed">
              Pisahkan buah penghasil gas etilen tinggi (seperti apel & pisang matang) dari sayuran hijau berdaun agar sayuran tidak lekas menguning.
            </p>
            <Link
              href="/education"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-950 pt-1"
            >
              <span>Pelajari panduan lengkap</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Daftar Hasil Pemindaian Terbaru */}
      <div className="nature-glass rounded-3xl p-6 sm:p-8 border border-emerald-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-emerald-950">Pemindaian Terbaru</h3>
            <p className="text-xs text-emerald-900/60">5 hasil pemeriksaan visual terakhir yang disimpan</p>
          </div>
          <Link
            href="/history"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>Buka Riwayat Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentScans.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-xs text-emerald-900/60">Belum ada pemindaian yang tersimpan.</p>
            <Link
              href="/scanner"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow hover:bg-emerald-700"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Mulai Scan Pertama</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-emerald-950/10">
            {recentScans.map((scan) => {
              const badge = getFreshnessBadge(scan.freshness_status, scan.category);
              return (
                <Link
                  key={scan.id}
                  href={`/result?id=${scan.id}`}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-emerald-500/5 px-2 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-emerald-950/10 shrink-0 border border-emerald-500/20 flex items-center justify-center">
                      {scan.image_data ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={scan.image_data}
                          alt={scan.item_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Layers className="w-5 h-5 text-emerald-700" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-emerald-950 group-hover:text-emerald-700 transition-colors">
                          {scan.item_name}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-900/60">
                        {getCategoryLabel(scan.category)} • {formatDateTime(scan.timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-base font-black text-emerald-950">{scan.freshness_score}</div>
                      <div className="text-[10px] text-emerald-900/60 font-semibold">/ 100</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-900/40 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
