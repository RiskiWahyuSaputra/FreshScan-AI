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

export type ProduceCategory = "fruit" | "vegetable" | "plant" | "other" | "unknown";

export type ScanMode = "produce" | "plant";

export type SurvivalOutlook = "likely_survive" | "at_risk" | "likely_die" | "uncertain";

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
  scan_mode?: ScanMode; // undefined on older records = "produce"
  survival_outlook?: SurvivalOutlook; // plant mode only
  survival_explanation?: string; // plant mode only
  urgent_actions?: string[]; // plant mode only
  image_data?: string; // Base64 data URL for display & IndexedDB storage
  image_hash?: string;
  processing_time_ms?: number;
  model_used?: string;
}

export interface AnalyzeApiPayload {
  image: string; // base64 or data URL
  scan_mode?: ScanMode;
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
