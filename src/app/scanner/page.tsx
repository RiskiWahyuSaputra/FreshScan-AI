import { Scanner } from "@/components/scanner/Scanner";

export const metadata = {
  title: "Pindai Bahan Pangan — QFscan",
  description: "Ambil foto atau upload gambar buah, sayuran, dan hasil tani untuk analisis kesegaran instan.",
};

export default function ScannerPage() {
  return (
    <div className="py-4">
      <Scanner />
    </div>
  );
}
