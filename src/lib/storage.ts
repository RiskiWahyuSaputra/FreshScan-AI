"use client";

import { FreshnessAnalysisResult, DashboardStats, ProduceCategory } from "@/types/analysis";

const DB_NAME = "freshscan_db";
const STORE_NAME = "scans";
const DB_VERSION = 1;

/**
 * Open or upgrade IndexedDB database for FreshScan
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this browser environment."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("timestamp", "timestamp", { unique: false });
        store.createIndex("category", "category", { unique: false });
        store.createIndex("freshness_status", "freshness_status", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save an analysis result into IndexedDB (supports high-res base64 image without localStorage limit)
 */
export async function saveScanResult(result: FreshnessAnalysisResult): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(result);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB save failed, falling back to localStorage without image", err);
    // Fallback: save lightweight version in localStorage
    try {
      const existing = getLocalHistoryFallback();
      const lightweight = { ...result, image_data: undefined };
      const updated = [lightweight, ...existing.filter((item) => item.id !== result.id)].slice(0, 30);
      localStorage.setItem("freshscan_history_fallback", JSON.stringify(updated));
    } catch (e) {
      console.error("LocalStorage fallback also failed", e);
    }
  }
}

/**
 * Get all scan results ordered newest first
 */
export async function getAllScanResults(): Promise<FreshnessAnalysisResult[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const items = (req.result as FreshnessAnalysisResult[]) || [];
        // Sort newest first
        items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        resolve(items);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return getLocalHistoryFallback();
  }
}

/**
 * Get single scan by ID
 */
export async function getScanResultById(id: string): Promise<FreshnessAnalysisResult | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => resolve((req.result as FreshnessAnalysisResult) || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    const all = getLocalHistoryFallback();
    return all.find((x) => x.id === id) || null;
  }
}

/**
 * Delete a scan by ID
 */
export async function deleteScanResult(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const all = getLocalHistoryFallback().filter((x) => x.id !== id);
    localStorage.setItem("freshscan_history_fallback", JSON.stringify(all));
  }
}

/**
 * Clear all scan history
 */
export async function clearAllScanResults(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    localStorage.removeItem("freshscan_history_fallback");
  }
}

/**
 * Compute real statistics from stored scans
 */
export async function calculateDashboardStats(): Promise<DashboardStats> {
  const scans = await getAllScanResults();

  const stats: DashboardStats = {
    totalScans: scans.length,
    freshCount: 0,
    moderateCount: 0,
    poorCount: 0,
    uncertainCount: 0,
    avgScore: 0,
    categoryCounts: {
      fruit: 0,
      vegetable: 0,
      other: 0,
      unknown: 0,
    },
  };

  if (scans.length === 0) return stats;

  let totalScore = 0;

  for (const s of scans) {
    totalScore += s.freshness_score || 0;

    if (s.freshness_status === "fresh") stats.freshCount++;
    else if (s.freshness_status === "moderate") stats.moderateCount++;
    else if (s.freshness_status === "poor") stats.poorCount++;
    else stats.uncertainCount++;

    const cat = (s.category || "unknown") as ProduceCategory;
    if (stats.categoryCounts[cat] !== undefined) {
      stats.categoryCounts[cat]++;
    } else {
      stats.categoryCounts.unknown++;
    }
  }

  stats.avgScore = Math.round(totalScore / scans.length);

  return stats;
}

function getLocalHistoryFallback(): FreshnessAnalysisResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("freshscan_history_fallback");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
