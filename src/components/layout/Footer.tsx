import Link from "next/link";
import { Leaf, ShieldAlert, Heart, GitBranch } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-emerald-950/10 mt-16 sm:mt-24 pb-20 md:pb-8 pt-12 nature-glass-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-emerald-950">FreshScan AI</span>
            </div>
            <p className="text-sm text-emerald-900/70 max-w-md leading-relaxed">
              Platform modern berbasis kecerdasan buatan untuk mengamati tingkat kesegaran, deteksi cacat visual, dan rekomendasi penanganan bahan pangan segar dari visual foto.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-800/80 pt-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Disclaimer Medis & Pangan:</strong> Analisis visual tidak menggantikan pengujian laboratorium atau deteksi bakteri/toksin mikroskopis.
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="font-bold text-sm text-emerald-950 mb-3 uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2 text-sm text-emerald-900/80">
              <li>
                <Link href="/" className="hover:text-emerald-700 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-700 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/scanner" className="hover:text-emerald-700 transition-colors">
                  Scan Pangan
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-emerald-700 transition-colors">
                  Riwayat Pemindaian
                </Link>
              </li>
              <li>
                <Link href="/education" className="hover:text-emerald-700 transition-colors">
                  Tips & Panduan Edukasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Items */}
          <div>
            <h4 className="font-bold text-sm text-emerald-950 mb-3 uppercase tracking-wider">Bahan Pangan</h4>
            <p className="text-xs text-emerald-900/70 leading-relaxed mb-4">
              Mendukung berbagai macam buah-buahan (apel, pisang, jeruk, mangga), sayuran hijau, cabai, tomat, umbi-umbian, dan produk segar lainnya.
            </p>
            <div className="pt-2">
              <a
                href="https://github.com/RiskiWahyuSaputra/FreshScan-AI"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-900/20 text-xs font-medium text-emerald-900 hover:bg-emerald-50 transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-emerald-950/10 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-900/60 gap-3">
          <p>© 2026 FreshScan AI. Nature Glass Design Architecture.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> untuk ketahanan & keamanan pangan Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
