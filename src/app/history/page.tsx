import { HistoryList } from "@/components/history/HistoryList";

export const metadata = {
  title: "Riwayat Pemindaian — QFscan",
  description: "Kelola, cari, dan telusuri riwayat hasil analisis buah, sayuran, dan tanaman yang tersimpan.",
};

export default function HistoryPage() {
  return (
    <div className="py-4">
      <HistoryList />
    </div>
  );
}
