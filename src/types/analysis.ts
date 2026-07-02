export interface VisualObservation {
  finding: string;
  severity: "low" | "medium" | "high";
  confidence: number; // 0 - 100
}

export interface PossibleIssue {
  name: string;
  explanation: string;
  confidence: number; // 0 - 100
}

export type ProduceCategory = "fruit" | "vegetable" | "other" | "unknown";

export type FreshnessStatus = "fresh" | "moderate" | "poor" | "uncertain";

export type RecommendedAction = "recommended" | "inspect_closely" | "avoid_using";

export interface FreshnessAnalysisResult {
  id: string;
  timestamp: string; // ISO string
  item_name: string;
  category: ProduceCategory;
  identification_confidence: number; // 0 - 100
  freshness_score: number; // 0 - 100 visual estimate
  freshness_status: FreshnessStatus;
  visual_observations: VisualObservation[];
  possible_issues: PossibleIssue[];
  recommended_action: RecommendedAction;
  storage_tips: string[];
  limitations: string[];
  summary: string;
  image_data?: string; // Base64 data URL for display & IndexedDB storage
  image_hash?: string;
  processing_time_ms?: number;
  model_used?: string;
}

export interface AnalyzeApiPayload {
  image: string; // base64 or data URL
  category_hint?: string;
  item_name_hint?: string;
  notes?: string;
}

export interface AnalyzeApiResponse {
  success: boolean;
  data?: FreshnessAnalysisResult;
  error?: string;
  code?: string;
}

export interface DashboardStats {
  totalScans: number;
  freshCount: number;
  moderateCount: number;
  poorCount: number;
  uncertainCount: number;
  avgScore: number;
  categoryCounts: Record<ProduceCategory, number>;
}
