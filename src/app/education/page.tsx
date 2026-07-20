import Link from "next/link";
import {
  BookOpen,
  Apple,
  Carrot,
  AlertOctagon,
  ShieldAlert,
  ThermometerSnowflake,
  Sparkles,
  CheckCircle2,
  Scan,
  ChevronRight,
  Info,
} from "lucide-react";

export const metadata = {
  title: "Panduan & Edukasi Pangan — FreshScan AI",
  description: "Pelajari teknik penyimpanan buah sayuran, identifikasi tanda awal pembusukan, dan pembedaan cacat visual.",
};

export default function EducationPage() {
  const sections = [
    {
      title: "Prinsip Dasar Penyimpanan Pangan Segar",
      desc: "Menjaga kelembapan, suhu, dan sirkulasi udara adalah kunci memperpanjang masa simpan sayur dan buah.",
      tips: [
        {
          heading: "Gas Etilen: Pisahkan Penghasil dan Penyerap",
          text: "Buah seperti apel, pisang matang, dan alpukat memproduksi gas etilen yang mempercepat kematangan sayuran berdaun hijau atau wortel di dekatnya. Simpan terpisah di laci crisper yang berbeda.",
        },
        {
          heading: "Kapan Harus Dicuci?",
          text: "Jangan mencuci buah beri, stroberi, atau jamur sebelum disimpan, karena kelembapan berlebih memicu jamur. Cuci hanya sesaat sebelum bahan hendak dikonsumsi atau dimasak.",
        },
        {
          heading: "Suhu Ruang vs Lemari Pendingin",
          text: "Tomat, bawang, dan kentang lebih awet pada suhu ruang sejuk yang berventilasi baik. Suhu dingin kulkas justru merusak tekstur sel tomat dan mengubah pati kentang menjadi gula lebih cepat.",
        },
      ],
    },
    {
      title: "Mengenali Tanda Visual Kerusakan & Cacat",
      desc: "Bedakan antara perubahan warna alami, memar benturan, dan tanda penyakit jamur/bakteri.",
      tips: [
        {
          heading: "1. Memar Fisik (Mechanical Bruising)",
          text: "Biasanya berwarna kecokelatan datar akibat benturan saat panen/distribusi. Jaringan biasanya masih aman dikonsumsi jika dipotong bagian memarnya dan tidak berbau asam.",
        },
        {
          heading: "2. Diskolorasi / Bintik Penuaan (Senescence)",
          text: "Bintik cokelat kecil pada kulit pisang menandakan gula buah terkonsentrasi (puncak manis). Pada sayuran daun, daun menguning menandakan klorofil mulai terdegradasi.",
        },
        {
          heading: "3. Tanda Jamur & Spora Berbahaya (Mold Growth)",
          text: "Tampak serabut putih, abu-abu (Botrytis), atau bubuk kehijauan (Penicillium). Jangan pernah mencicipi atau mengikis sebagian pada buah lunak, karena hifa mikroskopis telah menembus jauh ke dalam daging buah.",
        },
        {
          heading: "4. Gejala Penyakit Tanaman (Anthracnose, dsb)",
          text: "Bercak hitam cekung melingkar pada cabai atau mangga. Ini adalah penyakit pascapanen umum. Jika belum merata, bagian yang terkena dapat dipotong lebar sebelum diolah.",
        },
      ],
    },
    {
      title: "Tabel Rekomendasi Suhu & Tempat Penyimpanan",
      desc: "Panduan cepat penempatan bahan pangan di dapur rumah.",
      table: [
        { item: "Apel & Pir", tempat: "Kulkas (Chiller / Crisper)", ketahanan: "3 - 6 Minggu" },
        { item: "Pisang", tempat: "Suhu Ruang (Gantung / Terbuka)", ketahanan: "3 - 7 Hari" },
        { item: "Sayur Daun (Bayam, Kangkung)", tempat: "Kulkas (Bungkus tisu & wadah kedap)", ketahanan: "4 - 7 Hari" },
        { item: "Wortel & Brokoli", tempat: "Kulkas (Wadah lembap berlubang)", ketahanan: "1 - 3 Minggu" },
        { item: "Tomat Segar", tempat: "Suhu Ruang (Jauhkan dari sinar matahari)", ketahanan: "5 - 10 Hari" },
        { item: "Cabai & Bawang", tempat: "Suhu Ruang kering berventilasi", ketahanan: "1 - 2 Minggu" },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>Pustaka Pengetahuan Mutu Pangan</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
          Panduan & Edukasi Kesegaran Pangan
        </h1>
        <p className="text-sm text-emerald-900/70 max-w-xl mx-auto">
          Pahami cara menyimpan bahan pangan dengan tepat, kurangi food waste rumah tangga, dan kenali tanda-tanda kerusakan pangan secara ilmiah.
        </p>
      </div>

      {/* Disclaimer Box */}
      <div className="nature-glass rounded-2xl p-5 border-amber-500/30 bg-amber-500/10 flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-950">
          <p className="font-bold text-sm">Prinsip Keamanan Pangan Mandiri</p>
          <p className="leading-relaxed text-amber-900/90">
            Edukasi ini bersifat informatif berdasarkan praktik hortikultura umum. Jika bahan pangan mengeluarkan bau menyengat, tekstur sangat berlendir berbau busuk, atau ditumbuhi jamur berbulu, selalu utamakan keselamatan dan buang bahan tersebut. Jangan pernah mengambil risiko keracunan makanan.
          </p>
        </div>
      </div>

      {/* Educational Sections */}
      <div className="space-y-10">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="nature-glass rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-xl space-y-6"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Modul 0{idx + 1}
              </span>
              <h2 className="text-2xl font-black text-emerald-950">{section.title}</h2>
              <p className="text-xs sm:text-sm text-emerald-900/70">{section.desc}</p>
            </div>

            {section.tips && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.tips.map((tip, tIdx) => (
                  <div
                    key={tIdx}
                    className="p-4 rounded-2xl bg-white/70 border border-emerald-500/15 space-y-2"
                  >
                    <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{tip.heading}</span>
                    </h3>
                    <p className="text-xs text-emerald-900/80 leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            )}

            {section.table && (
              <div className="overflow-x-auto rounded-2xl border border-emerald-500/20 bg-white/70">
                <table className="w-full text-left text-xs text-emerald-950">
                  <thead className="bg-emerald-500/10 text-emerald-900 font-bold border-b border-emerald-500/20 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5">Bahan Pangan</th>
                      <th className="p-3.5">Lokasi Simpan Ideal</th>
                      <th className="p-3.5">Estimasi Ketahanan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950/10">
                    {section.table.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-emerald-500/5 transition-colors">
                        <td className="p-3.5 font-bold text-emerald-950">{row.item}</td>
                        <td className="p-3.5 text-emerald-900/80">{row.tempat}</td>
                        <td className="p-3.5 font-semibold text-emerald-700">{row.ketahanan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA Bottom */}
      <div className="text-center nature-glass rounded-3xl p-8 border border-emerald-500/20 space-y-4">
        <h3 className="text-xl font-bold text-emerald-950">Ingin Menguji Kondisi Bahan Sekarang?</h3>
        <p className="text-xs text-emerald-900/70 max-w-md mx-auto">
          Foto buah atau sayuran yang baru Anda beli untuk mendapatkan analisis visual real-time dari model Groq Vision AI.
        </p>
        <Link
          href="/scanner"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all"
        >
          <Scan className="w-4 h-4" />
          <span>Buka Scanner FreshScan</span>
        </Link>
      </div>
    </div>
  );
}
