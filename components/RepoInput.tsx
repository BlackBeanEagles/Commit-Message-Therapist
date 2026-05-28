/**
 * RepoInput — GitHub URL field, example repos, and analyze trigger.
 */

"use client";

import { useState, useCallback, type FormEvent, type KeyboardEvent } from "react";

const EXAMPLE_REPOS = [
  { label: "React", url: "https://github.com/facebook/react" },
  { label: "Next.js", url: "https://github.com/vercel/next.js" },
  { label: "Linux", url: "https://github.com/torvalds/linux" },
  { label: "TypeScript", url: "https://github.com/microsoft/TypeScript" },
];

interface RepoInputProps {
  onAnalyze: (url: string) => void;
  loading: boolean;
  disabled?: boolean;
}

export function RepoInput({ onAnalyze, loading, disabled }: RepoInputProps) {
  const [url, setUrl] = useState("");

  const submit = useCallback(() => {
    if (url.trim() && !loading && !disabled) {
      onAnalyze(url.trim());
    }
  }, [url, loading, disabled, onAnalyze]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://github.com/username/repo"
          disabled={loading || disabled}
          className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-purple-300/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 focus:border-transparent transition-all disabled:opacity-50 text-base"
          aria-label="GitHub repository URL"
        />
        <button
          type="submit"
          disabled={!url.trim() || loading || disabled}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-white font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-fuchsia-500/25 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? "Analyzing..." : "Start Therapy"}
        </button>
      </form>
      <p className="text-center text-xs text-purple-300/50">
        Press <kbd className="px-1.5 py-0.5 rounded bg-white/10">Ctrl</kbd>+
        <kbd className="px-1.5 py-0.5 rounded bg-white/10">Enter</kbd> to submit
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <span className="text-sm text-purple-300/60 w-full text-center mb-1">
          Try an example:
        </span>
        {EXAMPLE_REPOS.map((repo) => (
          <button
            key={repo.url}
            type="button"
            onClick={() => {
              setUrl(repo.url);
              if (!loading && !disabled) onAnalyze(repo.url);
            }}
            disabled={loading || disabled}
            className="px-3 py-1.5 text-sm rounded-lg glass hover:bg-white/10 text-purple-200 transition-all hover:scale-105 disabled:opacity-50"
          >
            {repo.label}
          </button>
        ))}
      </div>
    </div>
  );
}
