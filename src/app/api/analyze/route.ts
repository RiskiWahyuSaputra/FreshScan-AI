import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequestSchema } from "@/lib/analysis-schema";
import { analyzeProduceImage, getVisionModel } from "@/lib/groq";
import type { FreshnessAnalysisResult, AnalyzeApiResponse } from "@/types/analysis";

// Simple in-memory sliding window rate limiting (per IP)
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;
const ipRequestHistory = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (ipRequestHistory.get(ip) || []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestHistory.set(ip, timestamps);
    return false;
  }

  timestamps.push(now);
  ipRequestHistory.set(ip, timestamps);
  return true;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. IP & Rate Limiting check
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json<AnalyzeApiResponse>(
        {
          success: false,
          error:
            "Terlalu banyak permintaan pemindaian dalam waktu singkat. Mohon tunggu sebentar sebelum mencoba kembali.",
          code: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
    }

    // 2. Parse request payload
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json<AnalyzeApiResponse>(
        {
          success: false,
          error: "Format body request tidak valid (harus JSON).",
          code: "INVALID_JSON",
        },
        { status: 400 }
      );
    }

    // 3. Zod validation
    const parsed = AnalyzeRequestSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Input tidak valid";
      return NextResponse.json<AnalyzeApiResponse>(
        {
          success: false,
          error: `Validasi gagal: ${firstError}`,
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const { image, category_hint, item_name_hint, notes } = parsed.data;

    // 4. Validate image type and size (limit to ~10MB)
    let base64Data = image;
    let mimeType = "image/jpeg";

    if (image.startsWith("data:")) {
      const match = image.match(/^data:([a-zA-Z0-9/+]+);base64,(.+)$/);
      if (!match) {
        return NextResponse.json<AnalyzeApiResponse>(
          {
            success: false,
            error: "Format Data URL gambar tidak valid.",
            code: "INVALID_IMAGE_URL",
          },
          { status: 400 }
        );
      }
      mimeType = match[1].toLowerCase();
      base64Data = match[2];

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(mimeType)) {
        return NextResponse.json<AnalyzeApiResponse>(
          {
            success: false,
            error:
              "Format gambar tidak didukung. Mohon gunakan gambar berformat JPG, JPEG, PNG, atau WebP.",
            code: "UNSUPPORTED_IMAGE_FORMAT",
          },
          { status: 400 }
        );
      }
    } else {
      // Reconstruct valid data URL
      base64Data = image;
    }

    // Approximate size calculation (base64 length * 0.75 = bytes)
    const approximateSizeInBytes = (base64Data.length * 3) / 4;
    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit
    if (approximateSizeInBytes > MAX_SIZE_BYTES) {
      return NextResponse.json<AnalyzeApiResponse>(
        {
          success: false,
          error:
            "Ukuran gambar terlalu besar (maksimal 10MB). Mohon kompres atau gunakan foto dengan resolusi lebih rendah.",
          code: "IMAGE_TOO_LARGE",
        },
        { status: 413 }
      );
    }

    const fullDataUrl = image.startsWith("data:")
      ? image
      : `data:${mimeType};base64,${base64Data}`;

    // 5. Send to Groq Vision API
    const analysisOutput = await analyzeProduceImage(fullDataUrl, {
      category_hint,
      item_name_hint,
      notes,
    });

    const processingTime = Date.now() - startTime;
    const modelUsed = getVisionModel();

    // 6. Build structured response
    const finalResult: FreshnessAnalysisResult = {
      id: "scan_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8),
      timestamp: new Date().toISOString(),
      item_name: analysisOutput.item_name,
      category: analysisOutput.category,
      identification_confidence: Math.round(analysisOutput.identification_confidence),
      freshness_score: Math.round(analysisOutput.freshness_score),
      freshness_status: analysisOutput.freshness_status,
      visual_observations: analysisOutput.visual_observations,
      possible_issues: analysisOutput.possible_issues,
      recommended_action: analysisOutput.recommended_action,
      storage_tips: analysisOutput.storage_tips,
      limitations: analysisOutput.limitations,
      summary: analysisOutput.summary,
      processing_time_ms: processingTime,
      model_used: modelUsed,
    };

    return NextResponse.json<AnalyzeApiResponse>(
      {
        success: true,
        data: finalResult,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as Error & { status?: number; code?: string };
    const errorMessage = err?.message || "Terjadi kesalahan internal saat menganalisis gambar.";

    // Gracefully handle specific Groq errors
    if (errorMessage.includes("GROQ_API_KEY") || err?.status === 401) {
      return NextResponse.json<AnalyzeApiResponse>(
        {
          success: false,
          error:
            "Kunci API Groq belum disetel atau tidak valid di server. Periksa konfigurasi GROQ_API_KEY.",
          code: "GROQ_AUTH_ERROR",
        },
        { status: 401 }
      );
    }

    if (err?.status === 404 || errorMessage.includes("model does not exist")) {
      return NextResponse.json<AnalyzeApiResponse>(
        {
          success: false,
          error: `Model vision Groq (${getVisionModel()}) tidak tersedia atau dinonaktifkan. Silakan ubah GROQ_VISION_MODEL ke model yang didukung.`,
          code: "GROQ_MODEL_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    if (err?.status === 429 || errorMessage.includes("rate limit")) {
      return NextResponse.json<AnalyzeApiResponse>(
        {
          success: false,
          error:
            "Kapasitas limit Groq API tercapai untuk saat ini. Mohon coba beberapa detik lagi.",
          code: "GROQ_RATE_LIMIT",
        },
        { status: 429 }
      );
    }

    // Generic safe error message
    return NextResponse.json<AnalyzeApiResponse>(
      {
        success: false,
        error:
          "Gagal memproses gambar. Pastikan gambar cukup terang, berfokus pada bahan pangan, dan coba lagi.",
        code: "ANALYSIS_FAILED",
      },
      { status: 500 }
    );
  }
}
