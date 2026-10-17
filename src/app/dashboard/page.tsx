import { Dashboard } from "@/components/dashboard/Dashboard";

export const metadata = {
  title: "Dashboard Analitik Mutu — QFscan",
  description: "Pantau tren kesegaran bahan pangan, rasio kualitas, dan riwayat analisis terbaru.",
};

export default function DashboardPage() {
  return (
    <div className="py-4">
      <Dashboard />
    </div>
  );
}
