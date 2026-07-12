"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  AlertCircle,
  X,
  SwitchCamera,
  Info,
  CheckCircle,
} from "lucide-react";
import { saveScanResult } from "@/lib/storage";
import type { FreshnessAnalysisResult, AnalyzeApiResponse } from "@/types/analysis";

export function Scanner() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("upload");

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Selected image state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Optional contextual hints
  const [categoryHint, setCategoryHint] = useState<string>("");
  const [itemNameHint, setItemNameHint] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Loading & error state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisStepText, setAnalysisStepText] = useState("Menyiapkan gambar...");

  // Camera stream handler
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Browser Anda tidak mendukung akses kamera langsung.");
        return;
      }

      // Stop existing tracks first
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setCameraError("Izin kamera ditolak oleh browser. Mohon izinkan akses kamera di pengaturan browser Anda.");
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        setCameraError("Kamera tidak ditemukan pada perangkat Anda.");
      } else {
        setCameraError(`Gagal membuka kamera: ${error.message || "Kesalahan tidak dikenal"}`);
      }
      setCameraActive(false);
    }
  }, [cameraFacing, stopCamera]);

  useEffect(() => {
    if (activeTab === "camera" && !selectedImage) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab, startCamera, stopCamera, selectedImage]);

  const toggleCameraFacing = () => {
    setCameraFacing((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setSelectedImage(dataUrl);
    stopCamera();
  };

  // Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processSelectedFile(file);
  };

  const processSelectedFile = (file: File) => {
    setErrorMessage(null);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Format file tidak didukung. Harap gunakan gambar bertipe JPG, PNG, atau WebP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar melebihi batas maksimal 10MB.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.onerror = () => {
      setErrorMessage("Gagal membaca file gambar.");
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const resetSelection = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setErrorMessage(null);
    if (activeTab === "camera") {
      startCamera();
    }
  };

  // Submit scan to API
  const handleAnalyze = async () => {
    if (!selectedImage) {
      setErrorMessage("Silakan ambil atau pilih gambar terlebih dahulu.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisStepText("Mengirim gambar ke server analitik...");

    try {
      const stepInterval = setTimeout(() => {
        setAnalysisStepText("Menganalisis tekstur visual & indikator kesegaran dengan Groq Vision...");
      }, 1200);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: selectedImage,
          category_hint: categoryHint || undefined,
          item_name_hint: itemNameHint || undefined,
          notes: notes || undefined,
        }),
      });

      clearTimeout(stepInterval);

      const result: AnalyzeApiResponse = await res.json();

      if (!res.ok || !result.success || !result.data) {
        throw new Error(result.error || "Gagal memproses hasil analisis.");
      }

      setAnalysisStepText("Menyimpan hasil ke penyimpanan lokal...");
      const fullResult: FreshnessAnalysisResult = {
        ...result.data,
        image_data: selectedImage, // Save image with result
      };

      await saveScanResult(fullResult);

      // Redirect to result page
      router.push(`/result?id=${fullResult.id}`);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Terjadi kesalahan saat memproses gambar.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Scanner Cerdas Multi-Metode</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
          Pindai Bahan Pangan Anda
        </h1>
        <p className="text-sm text-emerald-900/70 max-w-lg mx-auto">
          Gunakan kamera langsung untuk potret instan, atau upload foto beresolusi tinggi dari galeri penyimpanan Anda.
        </p>
      </div>

      {/* Main Glass Workspace */}
      <div className="nature-glass rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-xl space-y-6">
        {/* Input Method Switcher */}
        {!selectedImage && (
          <div className="flex p-1 rounded-2xl bg-emerald-900/5 border border-emerald-950/10 max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "upload"
                  ? "bg-white text-emerald-950 shadow-md shadow-emerald-900/5"
                  : "text-emerald-900/70 hover:text-emerald-950"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Gambar</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("camera")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "camera"
                  ? "bg-white text-emerald-950 shadow-md shadow-emerald-900/5"
                  : "text-emerald-900/70 hover:text-emerald-950"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Gunakan Kamera</span>
            </button>
          </div>
        )}

        {/* Viewport: Either Image Preview or Camera Preview or Dropzone */}
        {selectedImage ? (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 max-h-[460px] bg-emerald-950/5 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt="Preview bahan pangan"
                className="max-h-[460px] w-full object-contain"
              />
              <button
                type="button"
                onClick={resetSelection}
                disabled={isAnalyzing}
                className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
                title="Hapus dan pilih ulang"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-emerald-900/70 px-1">
              <span>{selectedFile ? `${selectedFile.name} (${Math.round(selectedFile.size / 1024)} KB)` : "Hasil foto kamera"}</span>
              <button
                type="button"
                onClick={resetSelection}
                disabled={isAnalyzing}
                className="text-emerald-700 hover:underline font-semibold"
              >
                Ganti Gambar
              </button>
            </div>
          </div>
        ) : activeTab === "camera" ? (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-black min-h-[360px] flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-[360px] sm:h-[420px] object-cover"
              />

              {cameraError && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                  <AlertCircle className="w-10 h-10 text-rose-500" />
                  <p className="text-sm font-medium max-w-sm">{cameraError}</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

              {/* Camera Overlays / Action */}
              {cameraActive && (
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-6 px-4">
                  <button
                    type="button"
                    onClick={toggleCameraFacing}
                    className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all active:scale-95"
                    title="Ganti kamera depan/belakang"
                  >
                    <SwitchCamera className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="p-4 rounded-full bg-white text-emerald-900 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/40 ring-4 ring-emerald-500/40"
                    title="Ambil foto"
                  >
                    <Camera className="w-7 h-7" />
                  </button>
                  <div className="w-12" /> {/* Balancing spacer */}
                </div>
              )}
            </div>
            <p className="text-xs text-center text-emerald-900/60">
              Arahkan kamera ke bahan pangan dengan pencahayaan yang merata agar detail tekstur terlihat jelas.
            </p>
          </div>
        ) : (
          /* Upload Dropzone */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 rounded-3xl p-8 sm:p-12 text-center transition-all bg-emerald-500/5 hover:bg-emerald-500/10 flex flex-col items-center justify-center space-y-4 cursor-pointer"
            onClick={() => document.getElementById("file-upload-input")?.click()}
          >
            <input
              id="file-upload-input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
              <Upload className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-bold text-emerald-950">
                Pilih atau Tarik File Gambar ke Sini
              </p>
              <p className="text-xs text-emerald-900/70">
                Mendukung format JPG, PNG, atau WebP (maksimal 10MB)
              </p>
            </div>
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-semibold text-xs border border-emerald-500/20 shadow-sm hover:border-emerald-500/40 transition-all"
            >
              Pilih dari Perangkat
            </button>
          </div>
        )}

        {/* Optional Contextual Inputs (Akurasi Pangan) */}
        {selectedImage && (
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Detail Tambahan (Opsional — untuk akurasi rekomendasi)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-emerald-900/70 font-semibold mb-1">
                  Kategori Bahan Pangan
                </label>
                <select
                  value={categoryHint}
                  onChange={(e) => setCategoryHint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-500/20 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  <option value="">Deteksi Otomatis oleh AI</option>
                  <option value="fruit">Buah-buahan</option>
                  <option value="vegetable">Sayuran</option>
                  <option value="other">Bahan Pangan Lain</option>
                </select>
              </div>

              <div>
                <label className="block text-emerald-900/70 font-semibold mb-1">
                  Nama Bahan (Jika diketahui)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Apel Fuji, Pisang, Tomat"
                  value={itemNameHint}
                  onChange={(e) => setItemNameHint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-500/20 text-emerald-950 placeholder:text-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-emerald-900/70 font-semibold mb-1">
                  Catatan Kondisi / Pertanyaan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Sudah disimpan 4 hari di kulkas, apakah bintik ini jamur?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-500/20 text-emerald-950 placeholder:text-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Gagal Menganalisis Gambar</p>
              <p className="text-xs leading-relaxed text-rose-900/80">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Action Button & Loading Skeleton */}
        {selectedImage && (
          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleAnalyze}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-70 text-white font-bold text-base shadow-lg shadow-emerald-700/20 hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{analysisStepText}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analisis Kondisi Bahan dengan AI</span>
                </>
              )}
            </button>

            {isAnalyzing && (
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-3 animate-pulse">
                <div className="h-4 bg-emerald-600/20 rounded-md w-3/4" />
                <div className="h-3 bg-emerald-600/15 rounded-md w-1/2" />
                <div className="h-3 bg-emerald-600/15 rounded-md w-5/6" />
                <div className="flex items-center gap-2 pt-2 text-xs text-emerald-800 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 animate-bounce" />
                  <span>Sedang memverifikasi struktur respon model AI...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
