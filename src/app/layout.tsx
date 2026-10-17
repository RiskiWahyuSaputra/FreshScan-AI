import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "QFscan — Kenali Kesegaran Pangan dalam Sekejap",
  description:
    "Aplikasi visual inspection cerdas berbasis AI untuk menganalisis mutu, kesegaran buah, sayuran, dan bahan pangan segar serta rekomendasi penyimpanan terbaik.",
  keywords: ["QFscan", "AI Buah Sayur", "Inspeksi Kesegaran", "Food Freshness AI", "Groq Vision"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-nature-mesh text-emerald-950 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
