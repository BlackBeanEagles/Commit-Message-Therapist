/**
 * In-memory analysis cache keyed by normalized GitHub repo URL.
 */

import type { AnalysisResult } from "./types";

const cache = new Map<string, { result: AnalysisResult; expiresAt: number }>();

const TTL_MS = 1000 * 60 * 60; // 1 hour
/** Bump when diagnosis pipeline changes to invalidate stale cached results */
const CACHE_VERSION = "v2";

function normalizeRepoUrl(url: string): string {
  return `${CACHE_VERSION}:${url
    .trim()
    .toLowerCase()
    .replace(/\.git$/, "")
    .replace(/\/$/, "")}`;
}

export function getCachedAnalysis(repoUrl: string): AnalysisResult | null {
  const key = normalizeRepoUrl(repoUrl);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return { ...entry.result, cached: true };
}

export function setCachedAnalysis(repoUrl: string, result: AnalysisResult): void {
  const key = normalizeRepoUrl(repoUrl);
  cache.set(key, {
    result: { ...result, cached: false },
    expiresAt: Date.now() + TTL_MS,
  });
}
