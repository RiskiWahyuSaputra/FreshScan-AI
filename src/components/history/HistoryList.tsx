"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  History,
  Search,
  Trash2,
  Scan,
  Calendar,
  Layers,
  ArrowUpDown,
  AlertTriangle,
  ChevronRight,
  Filter,
} from "lucide-react";
import { getAllScanResults, deleteScanResult, clearAllScanResults } from "@/lib/storage";
import { getFreshnessBadge, getCategoryLabel, formatDateTime } from "@/lib/validation";
import type { FreshnessAnalysisResult, ProduceCategory, FreshnessStatus } from "@/types/analysis";

export function HistoryList() {
  const [scans, setScans] = useState<FreshnessAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  // Deletion modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllScanResults();
      setScans(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteOne = async (id: string) => {
    await deleteScanResult(id);
    setScans((prev) => prev.filter((s) => s.id !== id));
    setDeleteId(null);
  };

  const handleClearAll = async () => {
    await clearAllScanResults();
    setScans([]);
    setShowClearConfirm(false);
  };

  // Filtered and sorted scans
  const filteredScans = useMemo(() => {
    return scans
      .filter((s) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = s.item_name.toLowerCase().includes(q);
          const matchSummary = s.summary?.toLowerCase().includes(q);
          if (!matchName && !matchSummary) return false;
        }

        // Category filter
        if (selectedCategory !== "all" && s.category !== selectedCategory) {
          return false;
        }

        // Status filter
        if (selectedStatus !== "all" && s.freshness_status !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        if (sortOrder === "oldest") {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        }
        if (sortOrder === "highest") {
          return b.freshness_score - a.freshness_score;
        }
        if (sortOrder === "lowest") {
          return a.freshness_score - b.freshness_score;
        }
        return 0;
      });
  }, [scans, searchQuery, selectedCategory, selectedStatus, sortOrder]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>Penyimpanan Lokal Perangkat (IndexedDB)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">
            Riwayat Pemindaian
          </h1>
          <p className="text-xs text-emerald-900/70">
            Total {scans.length} pemindaian tersimpan secara aman di browser Anda.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {scans.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="px-3.5 py-2 rounded-xl text-rose-700 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua</span>
            </button>
          )}

          <Link
            href="/scanner"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Scan Baru</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="nature-glass rounded-2xl p-4 border border-emerald-500/20 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-emerald-900/50 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari nama bahan pangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/80 border border-emerald-500/20 text-xs text-emerald-950 placeholder:text-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/80 border border-emerald-500/20 text-xs text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="all">Semua Kategori</option>
              <option value="fruit">Buah-buahan</option>
              <option value="vegetable">Sayuran</option>
              <option value="other">Bahan Lain</option>
              <option value="unknown">Tidak Diketahui</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="sm:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/80 border border-emerald-500/20 text-xs text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="all">Semua Status</option>
              <option value="fresh">Tampak Segar</option>
              <option value="moderate">Perlu Cek</option>
              <option value="poor">Kerusakan</option>
              <option value="uncertain">Ragu</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="sm:col-span-2">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest" | "highest" | "lowest")}
              className="w-full px-3 py-2 rounded-xl bg-white/80 border border-emerald-500/20 text-xs text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="highest">Skor Tertinggi</option>
              <option value="lowest">Skor Terendah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scans List / Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-emerald-950">Memuat riwayat scan...</p>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="nature-glass rounded-3xl p-12 text-center space-y-4 border border-emerald-500/20">
          <Layers className="w-12 h-12 text-emerald-600/60 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-emerald-950">
              {scans.length === 0 ? "Belum Ada Riwayat Pemindaian" : "Tidak Ada Hasil yang Cocok"}
            </h3>
            <p className="text-xs text-emerald-900/60 max-w-sm mx-auto">
              {scans.length === 0
                ? "Pindai bahan pangan pertama Anda untuk mulai mengumpulkan data kesegaran di dashboard."
                : "Coba ubah kata kunci pencarian atau reset filter kategori dan status."}
            </p>
          </div>
          {scans.length === 0 && (
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700 transition-colors"
            >
              <Scan className="w-4 h-4" />
              <span>Mulai Scan Sekarang</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScans.map((scan) => {
            const badge = getFreshnessBadge(scan.freshness_status);
            return (
              <div
                key={scan.id}
                className="nature-glass-card rounded-2xl overflow-hidden border border-emerald-500/20 flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video bg-emerald-950/10 overflow-hidden">
                  {scan.image_data ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={scan.image_data}
                      alt={scan.item_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-emerald-900/40">
                      <Layers className="w-8 h-8" />
                    </div>
                  )}

                  {/* Status Badge Over Image */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-sm ${badge.color} bg-white/90`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Freshness Score Circle Over Image */}
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-emerald-500/20 flex items-center justify-center font-black text-xs text-emerald-950 shadow-sm">
                    {scan.freshness_score}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-emerald-900/60">
                      <span>{getCategoryLabel(scan.category)}</span>
                      <span>{formatDateTime(scan.timestamp)}</span>
                    </div>
                    <h3 className="font-extrabold text-base text-emerald-950 line-clamp-1">
                      {scan.item_name}
                    </h3>
                    <p className="text-xs text-emerald-900/70 line-clamp-2 leading-relaxed">
                      {scan.summary}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-emerald-950/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setDeleteId(scan.id)}
                      className="text-emerald-900/40 hover:text-rose-600 transition-colors p-1"
                      title="Hapus riwayat ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/result?id=${scan.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 group-hover:translate-x-0.5 transition-all"
                    >
                      <span>Lihat Rincian</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal: Delete One */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="nature-glass rounded-3xl p-6 max-w-sm w-full border border-emerald-500/30 space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-base text-emerald-950">Hapus Riwayat Scan?</h3>
            </div>
            <p className="text-xs text-emerald-900/70 leading-relaxed">
              Tindakan ini akan menghapus hasil pemindaian dan foto dari memori browser Anda. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-emerald-950 hover:bg-emerald-500/10"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDeleteOne(deleteId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Clear All */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="nature-glass rounded-3xl p-6 max-w-sm w-full border border-rose-500/30 space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-base text-emerald-950">Hapus Seluruh Riwayat?</h3>
            </div>
            <p className="text-xs text-emerald-900/70 leading-relaxed">
              Seluruh ({scans.length}) catatan pemindaian dan gambar di IndexedDB akan dihapus permanen.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-emerald-950 hover:bg-emerald-500/10"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow"
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
