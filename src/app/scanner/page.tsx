import { Scanner } from "@/components/scanner/Scanner";

export const metadata = {
  title: "Pindai Pangan & Tanaman — QFscan",
  description: "Ambil foto atau upload gambar buah, sayuran, dan hasil tani untuk analisis kesegaran instan, atau foto tanaman untuk cek kesehatan dan peluang hidupnya.",
};

export default function ScannerPage() {
  return (
    <div className="py-4">
      <Scanner />
    </div>
  );
}
