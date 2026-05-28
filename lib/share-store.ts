/**
 * In-memory store for shareable analysis result links (UUID → result).
 */

import type { AnalysisResult } from "./types";

const shareStore = new Map<string, { result: AnalysisResult; expiresAt: number }>();

const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function createShareLink(result: AnalysisResult): string {
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  shareStore.set(id, {
    result: { ...result, cached: false },
    expiresAt: Date.now() + TTL_MS,
  });
  return id;
}

export function getSharedResult(id: string): AnalysisResult | null {
  const entry = shareStore.get(id);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    shareStore.delete(id);
    return null;
  }
  return entry.result;
}
