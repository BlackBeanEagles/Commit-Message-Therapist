/**
 * Home page — Commit Message Therapist landing, analyze/compare modes, and analysis flow.
 */

"use client";

import { useCallback, useState } from "react";
import { LoadingState } from "@/components/LoadingState";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FeaturedDiagnoses } from "@/components/FeaturedDiagnoses";
import { CompareView } from "@/components/CompareView";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import type { AnalysisResult } from "@/lib/types";

type AppMode = "analyze" | "compare";

const EXAMPLE_REPOS = [
  { label: "React", url: "https://github.com/facebook/react" },
  { label: "Next.js", url: "https://github.com/vercel/next.js" },
  { label: "Linux", url: "https://github.com/torvalds/linux" },
];

export default function HomePage() {
  const [mode, setMode] = useState<AppMode>("analyze");
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = useCallback(async (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please paste a GitHub repository URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Analysis failed. Please try again.");
        return;
      }

      setResult(data as AnalysisResult);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyze(repoUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      analyze(repoUrl);
    }
  };

  const showLandingExtras = mode === "analyze" && !loading && !result;

  return (
    <main className="min-h-screen px-4 py-10 md:py-16">
      <ThemeToggle />
      <div className="mx-auto max-w-3xl">
        <header className="text-center mb-10 md:mb-14 animate-fade-in">
          <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-600/80 dark:text-fuchsia-300/80 mb-3">
            Injective Solo AI Builder Sprint
          </p>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            Commit Message Therapist
          </h1>
          <p className="text-lg md:text-xl text-theme-secondary max-w-xl mx-auto">
            Your code deserves mental health support. Paste a public GitHub repo —
            we&apos;ll read its Git history and deliver a therapy session diagnosis.
          </p>
        </header>

        <div className="flex justify-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => {
              setMode("analyze");
              setError(null);
            }}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              mode === "analyze"
                ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-500/20"
                : "glass text-theme-secondary hover:bg-white/10"
            }`}
          >
            Analyze
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("compare");
              setError(null);
              setResult(null);
            }}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              mode === "compare"
                ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-500/20"
                : "glass text-theme-secondary hover:bg-white/10"
            }`}
          >
            Compare repos
          </button>
        </div>

        {mode === "compare" ? (
          <CompareView />
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="glass rounded-2xl p-6 md:p-8 mb-8 animate-slide-up"
            >
              <label
                htmlFor="repo-url"
                className="block text-sm font-medium text-theme-secondary mb-2"
              >
                GitHub repository URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="repo-url"
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="https://github.com/username/repo"
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-xl bg-theme-input border border-theme-border text-theme-primary placeholder:text-theme-muted focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50 focus:border-transparent transition-all disabled:opacity-50"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold hover:from-fuchsia-400 hover:to-purple-500 transition-all hover:scale-105 hover:shadow-lg hover:shadow-fuchsia-500/25 disabled:opacity-50 disabled:hover:scale-100 shrink-0"
                >
                  {loading ? "Analyzing…" : "Start therapy"}
                </button>
              </div>
              <p className="mt-2 text-xs text-theme-muted">
                Tip: press Cmd+Enter (Ctrl+Enter on Windows) to submit
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-theme-muted w-full sm:w-auto">Try:</span>
                {EXAMPLE_REPOS.map((ex) => (
                  <button
                    key={ex.url}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setRepoUrl(ex.url);
                      analyze(ex.url);
                    }}
                    className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-theme-secondary hover:bg-purple-500/40 transition-colors disabled:opacity-50"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </form>

            {error && (
              <div
                role="alert"
                className="mb-8 p-4 rounded-xl bg-red-500/15 border border-red-400/30 text-red-600 dark:text-red-200 text-center animate-fade-in"
              >
                {error}
              </div>
            )}

            {loading && <LoadingState />}

            {result && !loading && <ResultsDashboard result={result} />}

            {showLandingExtras && (
              <>
                <section className="glass rounded-2xl p-6 md:p-8 mb-8 animate-fade-in">
                  <h2 className="text-lg font-semibold text-theme-primary mb-3">
                    What we analyze
                  </h2>
                  <ul className="grid sm:grid-cols-2 gap-2 text-sm text-theme-secondary">
                    <li>🌙 Late-night commits (12am–5am)</li>
                    <li>😤 Frustration keywords in messages</li>
                    <li>🔀 Merge conflicts & chaos</li>
                    <li>📅 Weekend & holiday commits</li>
                    <li>👥 Author patterns & workload</li>
                    <li>📈 Commit frequency spikes</li>
                  </ul>
                  <p className="mt-4 text-sm text-theme-muted italic border-t border-theme-border pt-4">
                    Example: &quot;Your repo has 34% late-night commits and a burnout score of
                    7/10. We need to talk about boundaries.&quot;
                  </p>
                </section>

                <div className="mb-8">
                  <FeaturedDiagnoses
                    onTryRepo={(url) => {
                      setRepoUrl(url);
                      analyze(url);
                    }}
                    disabled={loading}
                  />
                </div>

                <NewsletterSignup />
              </>
            )}
          </>
        )}

        <footer className="mt-16 text-center text-xs text-theme-muted">
          Built for the Injective Solo AI Builder Sprint · Powered by Claude
        </footer>
      </div>
    </main>
  );
}
