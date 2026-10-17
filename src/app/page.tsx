import Link from "next/link";
import {
  Scan,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Apple,
  Carrot,
  Leaf,
  Sprout,
  Layers,
  ThermometerSun,
  Camera,
  History,
  HelpCircle,
} from "lucide-react";

export default function HomePage() {
  const supportedItems = [
    { name: "Apel & Pir", category: "Buah", desc: "Mendeteksi memar, bintik busuk, dan kulit berkerut.", icon: Apple },
    { name: "Pisang", category: "Buah", desc: "Menganalisis kematangan berdasarkan bintik gula vs memar basah.", icon: Sparkles },
    { name: "Jeruk & Lemon", category: "Buah", desc: "Mendeteksi tanda jamur hijau/putih, kulit kering, dan kelunakan.", icon: Apple },
    { name: "Sayuran Daun", category: "Sayur", desc: "Menganalisis layu, daun menguning, lendir, atau bercak serangga.", icon: Leaf },
    { name: "Cabai & Paprika", category: "Sayur", desc: "Mendeteksi antraknosa (bercak hitam cekung) dan kulit layu.", icon: Carrot },
    { name: "Tomat", category: "Sayur", desc: "Mengevaluasi kekenyalan visual, retak kulit, dan pembusukan pangkal.", icon: Carrot },
    { name: "Tanaman Hias", category: "Tanaman", desc: "Menilai daun menguning, ujung kering, layu, dan tanda busuk akar.", icon: Sprout },
    { name: "Tanaman Kebun & Sayur", category: "Tanaman", desc: "Mendeteksi bercak daun, jamur, serta serangan hama seperti kutu dan ulat.", icon: Sprout },
    { name: "Bibit & Tanaman Muda", category: "Tanaman", desc: "Memperkirakan peluang hidup bibit yang layu, rebah, atau stres pindah tanam.", icon: Sprout },
  ];

  const steps = [
    {
      num: "01",
      title: "Ambil atau Upload Foto",
      desc: "Gunakan kamera ponsel/laptop secara langsung atau upload file gambar dari galeri Anda.",
      icon: Camera,
    },
    {
      num: "02",
      title: "Analisis Visual Groq AI",
      desc: "Model vision canggih mengevaluasi warna, tekstur kulit, kondisi daun, bintik, dan tanda degradasi visual.",
      icon: Sparkles,
    },
    {
      num: "03",
      title: "Rekomendasi & Penyimpanan",
      desc: "Dapatkan skor kesegaran atau kesehatan tanaman (0-100), peluang hidup tanaman, dan tips penanganan ideal.",
      icon: ThermometerSun,
    },
  ];

  return (
    <div className="space-y-20 py-4 sm:py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl nature-glass p-8 sm:p-14 lg:p-16 border border-emerald-500/20 shadow-xl shadow-emerald-950/5">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-lime-400/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs sm:text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Teknologi Vision AI Inspeksi Pangan & Tanaman</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-emerald-950 tracking-tight leading-[1.15]">
            Kenali Kesegaran Pangan & Kesehatan Tanaman dalam{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Sekejap.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-900/80 leading-relaxed max-w-2xl">
            Pindai buah, sayuran, dan hasil tani Anda menggunakan kamera. QFscan mengevaluasi bukti visual
            seperti memar, diskolorasi, jamur permukaan, dan memberikan tips penyimpanan praktis agar bahan pangan
            tidak terbuang sia-sia. Tanaman Anda layu atau daunnya menguning? QFscan juga bisa memeriksa kesehatan
            tanaman dan memperkirakan apakah tanaman masih bisa diselamatkan.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-700/25 hover:shadow-xl hover:shadow-emerald-700/35 hover:-translate-y-0.5 transition-all text-base"
            >
              <Scan className="w-5 h-5" />
              <span>Mulai Scan Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/70 hover:bg-white text-emerald-900 font-semibold border border-emerald-500/20 hover:border-emerald-500/40 shadow-sm transition-all text-base"
            >
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>Buka Dashboard</span>
            </Link>
          </div>

          {/* Key Quick Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8 border-t border-emerald-950/10">
            <div>
              <div className="text-2xl font-black text-emerald-900">0 - 100</div>
              <div className="text-xs text-emerald-800/70 font-medium">Skor Kesegaran & Kesehatan</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-900">Multi-Kategori</div>
              <div className="text-xs text-emerald-800/70 font-medium">Buah, Sayur, Tanaman</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-2xl font-black text-emerald-900">Privat & Cepat</div>
              <div className="text-xs text-emerald-800/70 font-medium">Penyimpanan Riwayat Lokal</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cara Kerja Section */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xs font-bold text-emerald-600 tracking-widest uppercase">Alur Penggunaan</h2>
          <p className="text-3xl font-extrabold text-emerald-950">Bagaimana Cara Kerjanya?</p>
          <p className="text-sm text-emerald-900/70">Tiga langkah mudah untuk mengetahui kondisi bahan pangan atau tanaman Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="nature-glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/40 transition-all duration-300"
              >
                <div className="text-5xl font-black text-emerald-500/10 absolute top-4 right-4 group-hover:text-emerald-500/20 transition-colors">
                  {s.num}
                </div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950 mb-2">{s.title}</h3>
                  <p className="text-sm text-emerald-900/70 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contoh Hasil Analisis Card Preview */}
      <section className="nature-glass rounded-3xl p-8 sm:p-12 border border-emerald-500/20 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Contoh Laporan</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">Visualisasi Hasil yang Terstruktur</h2>
            <p className="text-sm text-emerald-900/70">Setiap scan menghasilkan insight mendalam dan mudah dimengerti.</p>
          </div>
          <Link
            href="/scanner"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-900"
          >
            <span>Coba scan bahan Anda</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Mockup 1: Apel Segar */}
          <div className="nature-glass-card rounded-2xl p-6 border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                Tampak Segar
              </span>
              <span className="text-2xl font-black text-emerald-600">88/100</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-950">Apel Fuji Merah</h3>
              <p className="text-xs text-emerald-900/60">Kategori: Buah-buahan</p>
            </div>
            <p className="text-xs text-emerald-900/80 leading-relaxed bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
              Kulit mengkilap kencang, tidak tampak luka terbuka atau memar basah. Sangat baik untuk dikonsumsi segar setelah dicuci bersih.
            </p>
            <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Simpan di chiller lemari pendingin (2-4°C).</span>
            </div>
          </div>

          {/* Card Mockup 2: Tomat Perlu Pemeriksaan */}
          <div className="nature-glass-card rounded-2xl p-6 border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 border border-amber-500/30">
                Perlu Pemeriksaan
              </span>
              <span className="text-2xl font-black text-amber-600">62/100</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-950">Tomat Sayur</h3>
              <p className="text-xs text-emerald-900/60">Kategori: Sayuran</p>
            </div>
            <p className="text-xs text-emerald-900/80 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
              Tampak kerutan halus di permukaan kulit dekat tangkai. Tekstur mulai melunak. Disarankan diolah menjadi saus atau masakan tumis segera.
            </p>
            <div className="text-xs text-amber-700 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Gunakan dalam 1-2 hari ke depan.</span>
            </div>
          </div>

          {/* Card Mockup 3: Stroberi Indikasi Kerusakan */}
          <div className="nature-glass-card rounded-2xl p-6 border-rose-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-700 border border-rose-500/30">
                Indikasi Kerusakan
              </span>
              <span className="text-2xl font-black text-rose-600">34/100</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-950">Stroberi</h3>
              <p className="text-xs text-emerald-900/60">Kategori: Buah-buahan</p>
            </div>
            <p className="text-xs text-emerald-900/80 leading-relaxed bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">
              Tampak bintik abu-abu menyerupai spora jamur (botrytis) pada salah satu sisi dan area melunak basah. Hindari mencicipi.
            </p>
            <div className="text-xs text-rose-700 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Pisahkan agar spora tidak menyebar.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Jenis Bahan Pangan & Tanaman yang Didukung */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xs font-bold text-emerald-600 tracking-widest uppercase">Cakupan Deteksi</h2>
          <p className="text-3xl font-extrabold text-emerald-950">Pangan & Tanaman yang Didukung</p>
          <p className="text-sm text-emerald-900/70">
            QFscan menganalisis berbagai varietas pangan segar dan tanaman hidup secara visual.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {supportedItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="nature-glass-card rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-emerald-950">{item.name}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900/70 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Batasan & Disclaimer Section */}
      <section className="rounded-3xl p-6 sm:p-8 bg-amber-500/10 border border-amber-500/20 space-y-4">
        <div className="flex items-center gap-2.5 text-amber-900 font-bold text-base sm:text-lg">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Batasan Penting Analisis Visual QFscan</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-950/80 leading-relaxed">
          Analisis QFscan didasarkan murni pada <strong>bukti visual eksternal</strong> yang tertangkap oleh kamera.
          Aplikasi ini tidak dapat mendeteksi keberadaan bakteri mikroba (mis. Salmonella, E. Coli), residu bahan kimia/pestisida,
          racun pangan, ataupun kebusukan bagian dalam yang tertutup kulit tebal. Skor tinggi adalah estimasi visual dan bukan
          jaminan keamanan konsumsi mutlak. Selalu gunakan akal sehat, periksa aroma, dan cuci bahan pangan secara bersih.
          Untuk tanaman, kondisi akar dan kelembapan tanah umumnya tidak terlihat di foto, sehingga perkiraan peluang hidup
          bersifat indikatif dan sebaiknya dikonfirmasi dengan pengecekan langsung.
        </p>
      </section>

      {/* Call to Action Bottom */}
      <section className="text-center space-y-6 py-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-950">Siap Memeriksa Pangan atau Tanaman Anda?</h2>
        <p className="text-sm text-emerald-900/70 max-w-md mx-auto">
          Mulai ambil foto pertama Anda sekarang atau kelola hasil scan sebelumnya di dashboard.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/scanner"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-700/25 hover:shadow-xl transition-all"
          >
            <Scan className="w-5 h-5" />
            <span>Mulai Scan Gratis</span>
          </Link>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl nature-glass text-emerald-900 font-semibold hover:bg-white transition-all"
          >
            <History className="w-5 h-5" />
            <span>Lihat Riwayat</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
