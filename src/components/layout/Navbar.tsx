"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Scan, LayoutDashboard, History, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/validation";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Beranda", icon: Leaf },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/scanner", label: "Scan AI", icon: Scan },
    { href: "/history", label: "Riwayat", icon: History },
    { href: "/education", label: "Edukasi & Tips", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto nature-glass rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/images/logo-mark.png"
            alt="Logo QFscan"
            width={40}
            height={40}
            priority
            className="w-10 h-10 drop-shadow-md group-hover:scale-105 transition-transform duration-200"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-emerald-950 tracking-tight">QFscan</span>
            </div>
            <p className="text-[10px] text-emerald-800/70 font-medium hidden sm:block">
              Inspeksi Pangan & Kesehatan Tanaman
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-700/20"
                    : "text-emerald-900/80 hover:text-emerald-950 hover:bg-emerald-500/10"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <Link
            href="/scanner"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-semibold shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/30 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Mulai Scan</span>
            <span className="sm:hidden">Scan</span>
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-50">
        <div className="nature-glass rounded-2xl px-2 py-2 flex items-center justify-around shadow-xl shadow-emerald-950/10 border border-emerald-500/20">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150",
                  isActive
                    ? "text-emerald-700 font-semibold bg-emerald-500/15"
                    : "text-emerald-900/70 hover:text-emerald-900"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
