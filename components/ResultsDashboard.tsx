/**
 * ResultsDashboard — metrics grid, AI diagnosis, severity indicators, and share actions.
 */

"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import { MetricCard } from "./MetricCard";
import { SeverityBadge } from "./SeverityBadge";
import { burnoutToSeverity } from "@/lib/severity";

interface ResultsDashboardProps {
  result: AnalysisResult;
  compact?: boolean;
}

export function ResultsDashboard({ result, compact = false }: ResultsDashboardProps) {
  const { metrics, diagnosis } = result;
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const burnoutSeverity = burnoutToSeverity(metrics.burnoutRiskScore);

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    diagnosis.tweetSummary
  )}`;

  const copyDiagnosis = async () => {
    const text = `${diagnosis.emoji} ${diagnosis.title}\n\n${diagnosis.diagnosis}\n\nSuggestions:\n${diagnosis.suggestions.map((s) => `• ${s}`).join("\n")}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyShareLink = async () => {
    setShareLoading(true);
    setShareError(null);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });
      const data = await res.json();
      if (!res.ok) {
        setShareError(data.error ?? "Could not create share link.");
        return;
      }
      const url = `${window.location.origin}/r/${data.id}`;
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch {
      setShareError("Failed to create share link.");
    } finally {
      setShareLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {result.cached && (
        <p className="text-center text-sm text-theme-muted">
          Cached result — analyzed instantly
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <MetricCard label="Total Commits" value={metrics.totalCommits} />
        <MetricCard
          label="Late-Night"
          value={`${metrics.lateNightPercentage}%`}
          sublabel={`${metrics.lateNightCommits} commits (12am–5am)`}
          highlight={metrics.lateNightPercentage > 20}
        />
        <MetricCard
          label="Weekend"
          value={`${metrics.weekendPercentage}%`}
          sublabel={`${metrics.weekendCommits} commits`}
        />
        <div className="col-span-2 md:col-span-1">
          <MetricCard
            label="Burnout Risk"
            value={`${metrics.burnoutRiskScore}/10`}
            highlight={metrics.burnoutRiskScore >= 6}
          />
          <div className="mt-2 flex justify-center md:justify-start">
            <SeverityBadge severity={burnoutSeverity} size="sm" />
          </div>
        </div>
        <MetricCard label="Merge Commits" value={metrics.mergeCommits} />
        <MetricCard label="Conflict Mentions" value={metrics.mergeConflictMentions} />
        <MetricCard label="Contributors" value={metrics.authorCount} />
        <MetricCard
          label="Most Active"
          value={metrics.mostActiveAuthor.split(" ")[0]}
          sublabel={metrics.mostActiveAuthor}
        />
      </div>

      {metrics.topFrustratedKeywords.length > 0 && (
        <div className="glass rounded-xl p-4 animate-slide-up">
          <p className="text-sm text-theme-secondary mb-2">Top stress keywords in commits</p>
          <div className="flex flex-wrap gap-2">
            {metrics.topFrustratedKeywords.map((word) => (
              <span
                key={word}
                className="px-3 py-1 rounded-full bg-red-500/20 text-red-700 dark:text-red-200 text-sm border border-red-400/20"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-6 md:p-8 animate-slide-up ring-1 ring-fuchsia-400/20">
        <div className="flex items-start gap-4 mb-4">
          <span className="text-5xl">{diagnosis.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <SeverityBadge severity={diagnosis.severity} size="md" />
              <span className="text-xs text-theme-muted uppercase tracking-wider">
                therapy session
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-theme-primary mt-1">
              {diagnosis.title}
            </h2>
            <p className="text-sm text-theme-muted mt-1">{metrics.repoName}</p>
          </div>
        </div>
        <div className="prose prose-invert max-w-none">
          {diagnosis.diagnosis.split("\n\n").map((para, i) => (
            <p key={i} className="text-theme-secondary leading-relaxed mb-4 last:mb-0">
              {para}
            </p>
          ))}
        </div>
      </div>

      {diagnosis.suggestions.length > 0 && (
        <div className="glass rounded-xl p-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-theme-primary mb-3">
            Prescribed improvements
          </h3>
          <ul className="space-y-2">
            {diagnosis.suggestions.map((s, i) => (
              <li key={i} className="flex gap-2 text-theme-secondary">
                <span className="text-fuchsia-500 dark:text-fuchsia-400">→</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!compact && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold transition-all hover:scale-105 hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </a>
          <button
            type="button"
            onClick={copyShareLink}
            disabled={shareLoading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/10 text-theme-primary font-semibold transition-all hover:scale-105 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            {shareCopied ? "Link copied!" : shareLoading ? "Creating link…" : "Copy share link"}
          </button>
          <button
            type="button"
            onClick={copyDiagnosis}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/10 text-theme-primary font-semibold transition-all hover:scale-105"
          >
            {copied ? "Copied!" : "Copy diagnosis"}
          </button>
        </div>
      )}
      {shareError && (
        <p className="text-center text-sm text-red-500 dark:text-red-300" role="alert">
          {shareError}
        </p>
      )}
    </div>
  );
}
