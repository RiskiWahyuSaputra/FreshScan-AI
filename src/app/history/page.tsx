import { HistoryList } from "@/components/history/HistoryList";

export const metadata = {
  title: "Riwayat Pemindaian Pangan — FreshScan AI",
  description: "Kelola, cari, dan telusuri riwayat hasil analisis kesegaran buah dan sayuran yang tersimpan.",
};

export default function HistoryPage() {
  return (
    <div className="py-4">
      <HistoryList />
    </div>
  );
}
