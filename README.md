# FreshScan AI 🥑🥦🔍

Aplikasi web modern berbasis Artificial Intelligence untuk mendeteksi kondisi visual buah, sayuran, dan hasil pangan segar melalui kamera langsung atau upload gambar, ditenagai oleh Groq Vision Multimodal AI.

Desain antarmuka menggunakan **Nature Glass Design System** (perpaduan harmonis antara nuansa hijau alam, glassmorphism transparan, kartu berbayang lembut, dan dashboard analitik interaktif).

---

## 🌟 Fitur Utama

1. **Pemindaian Dua Metode (Dual-Input)**:
   - **Kamera Langsung**: Akses kamera depan dan belakang (lingkungan) dengan resolusi optimal secara real-time via `navigator.mediaDevices.getUserMedia`.
   - **Upload & Drag-and-Drop**: Mendukung format JPG, JPEG, PNG, dan WebP hingga ukuran 10MB dengan validasi tipe MIME di sisi klien dan server.

2. **Analisis Mutu & Kesegaran AI (Groq Vision)**:
   - Menggunakan model multimodal vision Groq (`qwen/qwen3.8-27b`) dengan mode JSON terstruktur.
   - Penilaian skor kesegaran visual (skala 0 - 100) dilengkapi circular progress gauge.
   - Deteksi bukti visual spesifik: memar fisik, kerutan penuaan, bintik nekrotik, luka terbuka, atau spora jamur tampak.
   - Identifikasi dugaan penyakit tanaman (seperti antraknosa, botrytis/gray mold, penicillium) secara hati-hati.
   - Rekomendasi aksi terstandarisasi: *Dapat Dikonsumsi*, *Periksa & Kupas Teliti*, atau *Hindari Penggunaan*.

3. **Dashboard Analitik**:
   - Menghitung statistik riil langsung dari data pemindaian yang tersimpan di IndexedDB browser (bukan angka dummy permanen).
   - Menampilkan total scan, persentase bahan tampak segar, perlu diperiksa, dan indikasi kerusakan.
   - Visualisasi grafik batang distribusi kondisi pangan menggunakan **Recharts**.
   - Daftar 5 pemindaian terkini dengan thumbnail gambar.

4. **Riwayat Pemindaian (IndexedDB Persistence)**:
   - Menyimpan seluruh hasil analisis dan foto beresolusi tinggi di IndexedDB lokal perangkat pengguna.
   - Fitur pencarian instan berdasarkan nama bahan pangan atau ringkasan temuan.
   - Filter multikategori (Buah, Sayur, Lainnya) dan filter status kesegaran.
   - Pengurutan berdasarkan tanggal (terbaru/terlama) atau skor kesegaran (tertinggi/terendah).
   - Hapus satuan riwayat atau kosongkan seluruh riwayat dengan dialog konfirmasi aman.

5. **Edukasi & Pedoman Penyimpanan**:
   - Panduan pencegahan percepatan pembusukan akibat gas etilen.
   - Cara membedakan memar benturan mekanis vs pembusukan jamur berbahaya.
   - Tabel panduan suhu dan lokasi simpan terbaik (suhu ruang vs kulkas/crisper).

6. **Keamanan & Kepatuhan**:
   - API key Groq sepenuhnya berada di server Next.js (tidak pernah bocor ke frontend).
   - Rate limiting bawaan untuk melindungi endpoint `/api/analyze` dari flooding.
   - Validasi skema input dan output menggunakan **Zod**.
   - Disclaimer kesehatan dan keterbatasan visual inspeksi yang transparan.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts, Canvas Confetti.
- **Backend & API**: Next.js Route Handlers (`POST /api/analyze`).
- **AI Engine**: Groq SDK (`groq-sdk`), Model Multimodal Vision `qwen/qwen3.8-27b`.
- **Validasi**: Zod Schema (`src/lib/analysis-schema.ts`).
- **Database Client**: IndexedDB API (`freshscan_db`) dengan fallback LocalStorage.

---

## 🚀 Panduan Instalasi Lokal

### 1. Clone Repository & Install Dependensi

```bash
git clone https://github.com/RiskiWahyuSaputra/FreshScan-AI.git
cd FreshScan-AI
npm install
```

### 2. Konfigurasi Environment Variables

Salin file contoh `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Buka `.env.local` dan masukkan kunci API Groq Anda:

```env
# Dapatkan gratis di https://console.groq.com/keys
GROQ_API_KEY=gsk_your_actual_groq_api_key_here

# Model Vision resmi Groq
GROQ_VISION_MODEL=qwen/qwen3.8-27b
```

### 3. Menjalankan Server Development

```bash
npm run dev
```

Buka browser Anda di `http://localhost:3000`.

### 4. Build untuk Produksi & Deployment

```bash
npm run build
npm start
```

Aplikasi ini siap di-deploy secara instan ke **Vercel** dengan menambahkan environment variable `GROQ_API_KEY` dan `GROQ_VISION_MODEL` di Project Settings Vercel.

---

## ⚠️ Disclaimer Batasan AI

FreshScan AI menganalisis bahan pangan murni berdasarkan bukti visual luar yang tertangkap kamera. Aplikasi ini **tidak dapat** mendeteksi bakteri mikroskopis tak terlihat (misalnya Salmonella, E. Coli), residu racun pestisida, atau kebusukan internal yang tidak tampak dari luar. Skor tinggi merupakan estimasi visual dan bukan jaminan keamanan konsumsi mutlak.

---

Dibuat dengan ❤️ oleh **Riski Wahyu Saputra** untuk ketahanan mutu pangan Indonesia.
