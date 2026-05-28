/**
 * FeaturedDiagnoses — curated example therapy sessions on the landing page.
 */

"use client";

import { FEATURED_DIAGNOSES } from "@/lib/featured-diagnoses";
import { SeverityBadge } from "./SeverityBadge";

interface FeaturedDiagnosesProps {
  onTryRepo: (url: string) => void;
  disabled?: boolean;
}

export function FeaturedDiagnoses({ onTryRepo, disabled }: FeaturedDiagnosesProps) {
  return (
    <section className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-theme-primary">Featured diagnoses</h2>
        <span className="text-xs text-theme-muted uppercase tracking-wider">Cool examples</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_DIAGNOSES.map((item) => (
          <article
            key={item.id}
            className="glass rounded-2xl p-5 flex flex-col hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-3xl">{item.emoji}</span>
              <SeverityBadge severity={item.severity} size="sm" />
            </div>
            <h3 className="font-semibold text-theme-primary text-sm leading-snug mb-1">
              {item.title}
            </h3>
            <p className="text-xs text-theme-muted mb-2">{item.repoName}</p>
            <p className="text-sm text-theme-secondary leading-relaxed flex-1 mb-3">
              {item.snippet}
            </p>
            <p className="text-xs text-fuchsia-500 dark:text-fuchsia-300/80 mb-3 font-medium">
              {item.highlight} · Burnout {item.burnoutScore}/10
            </p>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onTryRepo(item.repoUrl)}
              className="text-xs font-semibold text-left text-fuchsia-600 dark:text-fuchsia-300 hover:underline disabled:opacity-50"
            >
              Analyze this repo →
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
