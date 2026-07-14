import { Suspense } from "react";
import { ScanResultContent } from "@/components/results/ScanResultContent";

export const metadata = {
  title: "Hasil Analisis Kesegaran — FreshScan AI",
  description: "Laporan visual lengkap tingkat kesegaran, temuan cacat, dan rekomendasi penyimpanan.",
};

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto py-16 text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-emerald-950">Memuat rincian scan...</p>
        </div>
      }
    >
      <ScanResultContent />
    </Suspense>
  );
}
