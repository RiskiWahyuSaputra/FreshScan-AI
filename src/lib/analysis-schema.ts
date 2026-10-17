import { z } from "zod";

export const VisualObservationSchema = z.object({
  finding: z.string().min(1, "Deskripsi temuan tidak boleh kosong").max(500),
  severity: z.enum(["low", "medium", "high"]).default("low"),
  confidence: z.coerce.number().min(0).max(100).default(80),
});

export const PossibleIssueSchema = z.object({
  name: z.string().min(1, "Nama masalah tidak boleh kosong").max(200),
  explanation: z.string().min(1, "Penjelasan tidak boleh kosong").max(1000),
  confidence: z.coerce.number().min(0).max(100).default(70),
});

export const GroqAnalysisOutputSchema = z.object({
  success: z.boolean().default(true),
  item_name: z.string().min(1).max(200).default("Bahan Pangan Tidak Dikenal"),
  category: z.enum(["fruit", "vegetable", "other", "unknown"]).default("unknown"),
  identification_confidence: z.coerce.number().min(0).max(100).default(70),
  freshness_score: z.coerce.number().min(0).max(100).default(50),
  freshness_status: z.enum(["fresh", "moderate", "poor", "uncertain"]).default("uncertain"),
  visual_observations: z.array(VisualObservationSchema).min(1, "Minimal sertakan 1 observasi visual"),
  possible_issues: z.array(PossibleIssueSchema).default([]),
  recommended_action: z.enum(["recommended", "inspect_closely", "avoid_using"]).default("inspect_closely"),
  storage_tips: z.array(z.string().min(1).max(500)).min(1, "Minimal sertakan 1 tips penyimpanan"),
  limitations: z.array(z.string().min(1).max(500)).min(1, "Minimal sertakan 1 catatan batasan"),
  summary: z.string().min(1).max(1500).default("Analisis visual selesai dilakukan."),
});

export type GroqAnalysisOutput = z.infer<typeof GroqAnalysisOutputSchema>;

export const PlantAnalysisOutputSchema = z.object({
  success: z.boolean().default(true),
  plant_name: z.string().min(1).max(200).default("Tanaman Tidak Dikenal"),
  identification_confidence: z.coerce.number().min(0).max(100).default(70),
  health_score: z.coerce.number().min(0).max(100).default(50),
  health_status: z.enum(["healthy", "stressed", "critical", "uncertain"]).default("uncertain"),
  survival_outlook: z.enum(["likely_survive", "at_risk", "likely_die", "uncertain"]).default("uncertain"),
  survival_explanation: z.string().min(1).max(1500).default("Prognosis belum dapat dipastikan dari gambar ini."),
  visual_observations: z.array(VisualObservationSchema).min(1, "Minimal sertakan 1 observasi visual"),
  possible_issues: z.array(PossibleIssueSchema).default([]),
  recommended_action: z.enum(["maintain_care", "treat_soon", "urgent_rescue"]).default("treat_soon"),
  urgent_actions: z.array(z.string().min(1).max(500)).default([]),
  care_tips: z.array(z.string().min(1).max(500)).min(1, "Minimal sertakan 1 tips perawatan"),
  limitations: z.array(z.string().min(1).max(500)).min(1, "Minimal sertakan 1 catatan batasan"),
  summary: z.string().min(1).max(1500).default("Analisis visual tanaman selesai dilakukan."),
});

export type PlantAnalysisOutput = z.infer<typeof PlantAnalysisOutputSchema>;

export const AnalyzeRequestSchema = z.object({
  image: z
    .string()
    .min(10, "Data gambar tidak valid")
    .refine((val) => {
      // Must be either data:image/(png|jpeg|jpg|webp);base64,... or raw base64 string
      return (
        val.startsWith("data:image/") ||
        /^[A-Za-z0-9+/=]+$/.test(val.slice(0, 100))
      );
    }, "Format gambar harus berupa data URL atau base64 yang valid"),
  scan_mode: z.enum(["produce", "plant"]).default("produce"),
  category_hint: z.string().max(100).optional(),
  item_name_hint: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});
