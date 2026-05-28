/**
 * Shared result page — loads analysis from /api/share?id=
 */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LoadingState } from "@/components/LoadingState";
import type { AnalysisResult } from "@/lib/types";

export default function SharedResultPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("Invalid share link.");
      setLoading(false);
      return;
    }

    fetch(`/api/share?id=${encodeURIComponent(id)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Could not load shared result.");
          return;
        }
        setResult(data as AnalysisResult);
      })
      .catch(() => setError("Failed to load shared result."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <main className="min-h-screen px-4 py-10 md:py-16">
      <ThemeToggle />
      <div className="mx-auto max-w-3xl">
        <header className="text-center mb-8">
          <Link
            href="/"
            className="text-sm text-fuchsia-600 dark:text-fuchsia-300 hover:underline"
          >
            ← Analyze another repo
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text mt-4">
            Shared therapy session
          </h1>
        </header>

        {loading && <LoadingState />}
        {error && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-red-500/15 border border-red-400/30 text-red-600 dark:text-red-200 text-center"
          >
            {error}
          </div>
        )}
        {result && !loading && <ResultsDashboard result={result} />}
      </div>
    </main>
  );
}
