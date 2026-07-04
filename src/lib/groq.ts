import Groq from "groq-sdk";
import { GroqAnalysisOutputSchema, type GroqAnalysisOutput } from "./analysis-schema";

// Default vision model on Groq
// qwen/qwen3.8-27b is the currently supported 27B vision model with image analysis & json mode
export const DEFAULT_GROQ_VISION_MODEL = "qwen/qwen3.8-27b";

export function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "GROQ_API_KEY belum dikonfigurasi di environment server. Pastikan menyetel file .env.local dengan API key Groq yang aktif."
    );
  }
  return new Groq({ apiKey });
}

export function getVisionModel(): string {
  return process.env.GROQ_VISION_MODEL?.trim() || DEFAULT_GROQ_VISION_MODEL;
}

export const FRESHSCAN_SYSTEM_PROMPT = `You are FreshScan AI, an assistant specialized in visual inspection of fruits, vegetables, and agricultural produce.

Analyze only the visual evidence present in the provided image.

Your tasks:
1. Identify the visible food or produce if possible (provide Indonesian common name in item_name, e.g. "Apel Fuji", "Tomat Merah", "Pisang Cavendish", "Cabai Rawit", "Bayam Hijau").
2. Assess visible freshness indicators.
3. Identify visible defects such as bruising, discoloration, shriveling, mold-like growth, cuts, spots, or apparent rot.
4. If symptoms resemble a plant disease, describe the visual symptoms and possible causes cautiously. Do not make a definitive diagnosis from an image alone.
5. Estimate a freshness score from 0 to 100, with a clear explanation that this is an approximate visual estimate, not a laboratory measurement.
6. Explain the main evidence supporting your assessment.
7. Provide practical storage and handling recommendations in Indonesian.
8. Give a cautious usability recommendation when appropriate.

Important limitations:
- Do not infer invisible bacteria, toxins, pesticide residues, or internal spoilage from appearance alone.
- Do not guarantee food safety.
- Do not classify every dark spot as disease or rot.
- If the image is blurry, poorly lit, obstructed, or contains multiple ambiguous objects, state the limitation.
- If the produce cannot be identified confidently, return an unknown or uncertain identification.
- Distinguish visual freshness from actual food safety.
- If a serious food safety concern is visible, recommend caution rather than assuring the user that the food is safe.
- If mold or substantial spoilage is suspected, do not recommend tasting the item.
- Clearly distinguish observations from hypotheses.
- Respond with clear, natural Indonesian language for descriptions, findings, tips, limitations, and summary.
- Return valid JSON matching the exact schema below:

{
  "success": true,
  "item_name": "Nama bahan pangan (Bahasa Indonesia)",
  "category": "fruit | vegetable | other | unknown",
  "identification_confidence": 85,
  "freshness_score": 78,
  "freshness_status": "fresh | moderate | poor | uncertain",
  "visual_observations": [
    {
      "finding": "Deskripsi temuan visual",
      "severity": "low | medium | high",
      "confidence": 80
    }
  ],
  "possible_issues": [
    {
      "name": "Dugaan masalah atau gejala",
      "explanation": "Penjelasan detail penyebab visual",
      "confidence": 75
    }
  ],
  "recommended_action": "recommended | inspect_closely | avoid_using",
  "storage_tips": [
    "Tips penyimpanan praktis dalam bahasa Indonesia"
  ],
  "limitations": [
    "Catatan keterbatasan analisis visual ini"
  ],
  "summary": "Ringkasan kesimpulan visual dalam bahasa Indonesia"
}`;

/**
 * Clean and parse JSON from LLM response (stripping markdown fences if present)
 */
export function extractCleanJson(rawText: string): unknown {
  let cleaned = rawText.trim();
  // Strip markdown code fences ```json ... ```
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }
  // If wrapped in some conversational text, find first '{' and last '}'
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
}

/**
 * Execute Groq Vision analysis on base64 image data URL
 */
export async function analyzeProduceImage(
  imageDataUrl: string,
  hints?: { category_hint?: string; item_name_hint?: string; notes?: string }
): Promise<GroqAnalysisOutput> {
  const groq = getGroqClient();
  const model = getVisionModel();

  let userPrompt = "Tolong periksa dan analisis kondisi bahan pangan pada gambar ini secara teliti.";
  if (hints?.category_hint || hints?.item_name_hint || hints?.notes) {
    const contextParts: string[] = [];
    if (hints.item_name_hint) contextParts.push(`Dugaan nama bahan: ${hints.item_name_hint}`);
    if (hints.category_hint) contextParts.push(`Kategori bahan: ${hints.category_hint}`);
    if (hints.notes) contextParts.push(`Catatan tambahan pengguna: ${hints.notes}`);
    userPrompt += `\nInformasi konteks dari pengguna: ${contextParts.join(", ")}.`;
  }
  userPrompt += "\nKembalikan analisis dalam format JSON murni sesuai skema yang telah ditentukan.";

  const completion = await groq.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: FRESHSCAN_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: userPrompt,
          },
          {
            type: "image_url",
            image_url: {
              url: imageDataUrl,
            },
          },
        ],
      },
    ],
    temperature: 0.2,
    max_tokens: 2048,
    response_format: { type: "json_object" },
  });

  const responseContent = completion.choices[0]?.message?.content;
  if (!responseContent) {
    throw new Error("Model Groq tidak mengembalikan teks hasil analisis.");
  }

  const rawJson = extractCleanJson(responseContent);
  const validated = GroqAnalysisOutputSchema.parse(rawJson);

  return validated;
}
