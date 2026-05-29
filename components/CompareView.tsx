/**
 * CompareView — side-by-side analysis of two GitHub repositories.
 */

"use client";

import { useState, useCallback } from "react";
import type { AnalysisResult } from "@/lib/types";
import { LoadingState } from "./LoadingState";
import { ResultsDashboard } from "./ResultsDashboard";
import { SeverityBadge } from "./SeverityBadge";
import { burnoutToSeverity } from "@/lib/severity";

async function fetchAnalysis(repoUrl: string): Promise<AnalysisResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repoUrl, forceRefresh: true }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Analysis failed");
  }
  return data as AnalysisResult;
}

export function CompareView() {
  const [repoA, setRepoA] = useState("");
  const [repoB, setRepoB] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultA, setResultA] = useState<AnalysisResult | null>(null);
  const [resultB, setResultB] = useState<AnalysisResult | null>(null);

  const compare = useCallback(async () => {
    const a = repoA.trim();
    const b = repoB.trim();
    if (!a || !b) {
      setError("Enter both repository URLs to compare.");
      return;
    }
    if (a === b) {
      setError("Pick two different repositories.");
      return;
    }

    setLoading(true);
    setError(null);
    setResultA(null);
    setResultB(null);

    try {
      const [left, right] = await Promise.all([fetchAnalysis(a), fetchAnalysis(b)]);
      setResultA(left);
      setResultB(right);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comparison failed.");
    } finally {
      setLoading(false);
    }
  }, [repoA, repoB]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    compare();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-4">
        <p className="text-sm text-theme-secondary">
          Compare burnout scores and severity between two codebases.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="compare-a" className="block text-sm font-medium text-theme-secondary mb-2">
              Repository A
            </label>
            <input
              id="compare-a"
              type="url"
              value={repoA}
              onChange={(e) => setRepoA(e.target.value)}
              placeholder="https://github.com/org/repo-a"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-theme-input border border-theme-border text-theme-primary placeholder:text-theme-muted focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50 disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="compare-b" className="block text-sm font-medium text-theme-secondary mb-2">
              Repository B
            </label>
            <input
              id="compare-b"
              type="url"
              value={repoB}
              onChange={(e) => setRepoB(e.target.value)}
              placeholder="https://github.com/org/repo-b"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-theme-input border border-theme-border text-theme-primary placeholder:text-theme-muted focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50 disabled:opacity-50"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-400 hover:to-purple-500 transition-all hover:scale-105 disabled:opacity-50"
        >
          {loading ? "Comparing…" : "Compare repos"}
        </button>
      </form>

      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-500/15 border border-red-400/30 text-red-600 dark:text-red-200 text-center"
        >
          {error}
        </div>
      )}

      {loading && <LoadingState />}

      {resultA && resultB && !loading && (
        <>
          <div className="glass rounded-2xl p-4 grid sm:grid-cols-3 gap-4 text-center animate-fade-in">
            <div>
              <p className="text-xs text-theme-muted uppercase mb-1">Repo A burnout</p>
              <p className="text-2xl font-bold text-theme-primary">
                {resultA.metrics.burnoutRiskScore}/10
              </p>
              <SeverityBadge
                severity={burnoutToSeverity(resultA.metrics.burnoutRiskScore)}
                size="sm"
                className="mt-2"
              />
            </div>
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold text-theme-muted">vs</span>
            </div>
            <div>
              <p className="text-xs text-theme-muted uppercase mb-1">Repo B burnout</p>
              <p className="text-2xl font-bold text-theme-primary">
                {resultB.metrics.burnoutRiskScore}/10
              </p>
              <SeverityBadge
                severity={burnoutToSeverity(resultB.metrics.burnoutRiskScore)}
                size="sm"
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-theme-muted mb-4 text-center lg:text-left">
                {resultA.metrics.repoName}
              </h3>
              <ResultsDashboard result={resultA} compact />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-theme-muted mb-4 text-center lg:text-left">
                {resultB.metrics.repoName}
              </h3>
              <ResultsDashboard result={resultB} compact />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
