import Groq from "groq-sdk";
import {
  GroqAnalysisOutputSchema,
  PlantAnalysisOutputSchema,
  type GroqAnalysisOutput,
  type PlantAnalysisOutput,
} from "./analysis-schema";

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

export const PLANT_SYSTEM_PROMPT = `You are QFscan Plant, an assistant specialized in visual health inspection of living plants (houseplants, garden plants, crops, seedlings, trees).

Analyze only the visual evidence present in the provided image.

Your tasks:
1. Identify the plant if possible (provide Indonesian common name in plant_name, e.g. "Monstera", "Cabai Rawit", "Lidah Mertua", "Mawar", "Padi"). Add the Latin name in parentheses when reasonably confident.
2. Assess visible health indicators: leaf color, turgor (wilting vs firm), leaf edges and tips, spots or lesions, stem condition, new growth, visible roots or soil surface, and visible pests.
3. Identify visible problems such as yellowing (chlorosis), browning or crispy tips, wilting, drooping, leaf spots, powdery or fuzzy growth, stem rot or mushy base, holes from pests, webbing, sticky residue, or visible insects.
4. Suggest possible causes cautiously (overwatering, underwatering, root rot, too much or too little light, sunburn, nutrient deficiency, fungal or bacterial infection, pests, transplant shock, cold damage). Do not make a definitive diagnosis from an image alone.
5. Estimate a health score from 0 to 100 (an approximate visual estimate, not a laboratory measurement).
6. Give a survival outlook: will the plant likely survive with proper care, is it at risk, or does it look likely to die? Explain in survival_explanation which visible evidence supports this (e.g. green healthy tissue or new growth remaining = recoverable; entire stem black and mushy = poor outlook). If green tissue remains, mention that recovery is often still possible.
7. List concrete urgent_actions the user should do in the next 1-3 days (empty array if the plant looks healthy).
8. Provide practical ongoing care tips in Indonesian (watering, light, soil, drainage, fertilizer, pest control).

Important limitations:
- Roots, soil moisture, and internal stem condition are usually not visible; state this when relevant.
- Do not classify every brown leaf as disease; old lower leaves naturally yellow and drop.
- Do not declare a plant dead unless the visual evidence is overwhelming; prefer "at_risk" when unsure.
- If the image is blurry, poorly lit, shows only a small part of the plant, or is not a plant, state the limitation and use "uncertain".
- Do not recommend dangerous chemicals or dosages; suggest safe, common treatments and advise checking product labels.
- Clearly distinguish observations from hypotheses.
- Respond with clear, natural Indonesian language for all descriptions, findings, tips, limitations, and summary.
- Return valid JSON matching the exact schema below:

{
  "success": true,
  "plant_name": "Nama tanaman (Bahasa Indonesia)",
  "identification_confidence": 85,
  "health_score": 62,
  "health_status": "healthy | stressed | critical | uncertain",
  "survival_outlook": "likely_survive | at_risk | likely_die | uncertain",
  "survival_explanation": "Penjelasan peluang tanaman bertahan hidup berdasarkan bukti visual",
  "visual_observations": [
    {
      "finding": "Deskripsi temuan visual",
      "severity": "low | medium | high",
      "confidence": 80
    }
  ],
  "possible_issues": [
    {
      "name": "Dugaan masalah atau penyakit",
      "explanation": "Penjelasan gejala visual dan kemungkinan penyebab",
      "confidence": 70
    }
  ],
  "recommended_action": "maintain_care | treat_soon | urgent_rescue",
  "urgent_actions": [
    "Langkah penanganan segera dalam bahasa Indonesia"
  ],
  "care_tips": [
    "Tips perawatan rutin dalam bahasa Indonesia"
  ],
  "limitations": [
    "Catatan keterbatasan analisis visual ini"
  ],
  "summary": "Ringkasan kondisi tanaman dalam bahasa Indonesia"
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

type ScanHints = { category_hint?: string; item_name_hint?: string; notes?: string };

/**
 * Send an image + prompt to the Groq vision model and return the parsed JSON body
 */
async function runVisionJson(
  systemPrompt: string,
  userPrompt: string,
  imageDataUrl: string
): Promise<unknown> {
  const groq = getGroqClient();
  const model = getVisionModel();

  const completion = await groq.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
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

  return extractCleanJson(responseContent);
}

/**
 * Execute Groq Vision analysis on base64 image data URL
 */
export async function analyzeProduceImage(
  imageDataUrl: string,
  hints?: ScanHints
): Promise<GroqAnalysisOutput> {
  let userPrompt = "Tolong periksa dan analisis kondisi bahan pangan pada gambar ini secara teliti.";
  if (hints?.category_hint || hints?.item_name_hint || hints?.notes) {
    const contextParts: string[] = [];
    if (hints.item_name_hint) contextParts.push(`Dugaan nama bahan: ${hints.item_name_hint}`);
    if (hints.category_hint) contextParts.push(`Kategori bahan: ${hints.category_hint}`);
    if (hints.notes) contextParts.push(`Catatan tambahan pengguna: ${hints.notes}`);
    userPrompt += `\nInformasi konteks dari pengguna: ${contextParts.join(", ")}.`;
  }
  userPrompt += "\nKembalikan analisis dalam format JSON murni sesuai skema yang telah ditentukan.";

  const rawJson = await runVisionJson(FRESHSCAN_SYSTEM_PROMPT, userPrompt, imageDataUrl);
  return GroqAnalysisOutputSchema.parse(rawJson);
}

/**
 * Execute Groq Vision plant health analysis on base64 image data URL
 */
export async function analyzePlantImage(
  imageDataUrl: string,
  hints?: ScanHints
): Promise<PlantAnalysisOutput> {
  let userPrompt =
    "Tolong periksa kesehatan tanaman pada gambar ini secara teliti dan perkirakan apakah tanaman ini dapat bertahan hidup.";
  if (hints?.item_name_hint || hints?.notes) {
    const contextParts: string[] = [];
    if (hints.item_name_hint) contextParts.push(`Dugaan nama tanaman: ${hints.item_name_hint}`);
    if (hints.notes) contextParts.push(`Catatan perawatan dari pengguna: ${hints.notes}`);
    userPrompt += `\nInformasi konteks dari pengguna: ${contextParts.join(", ")}.`;
  }
  userPrompt += "\nKembalikan analisis dalam format JSON murni sesuai skema yang telah ditentukan.";

  const rawJson = await runVisionJson(PLANT_SYSTEM_PROMPT, userPrompt, imageDataUrl);
  return PlantAnalysisOutputSchema.parse(rawJson);
}
