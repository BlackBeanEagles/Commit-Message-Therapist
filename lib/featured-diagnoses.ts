/**
 * Curated example diagnoses shown on the landing page before analysis.
 */

import type { SeverityLevel } from "./severity";

export interface FeaturedDiagnosis {
  id: string;
  repoName: string;
  repoUrl: string;
  emoji: string;
  title: string;
  snippet: string;
  severity: SeverityLevel;
  burnoutScore: number;
  highlight: string;
}

export const FEATURED_DIAGNOSES: FeaturedDiagnosis[] = [
  {
    id: "react",
    repoName: "facebook/react",
    repoUrl: "https://github.com/facebook/react",
    emoji: "🧘",
    title: "Collective Burnout, Distributed Denial of Sleep",
    snippet:
      "With thousands of contributors and a 34% late-night commit rate, this codebase has seen more midnight oil than a candle factory.",
    severity: "severe",
    burnoutScore: 7,
    highlight: "34% late-night commits",
  },
  {
    id: "linux",
    repoName: "torvalds/linux",
    repoUrl: "https://github.com/torvalds/linux",
    emoji: "👑",
    title: "Benevolent Dictator Syndrome (Advanced)",
    snippet:
      "One author dominates 89% of commits. Healthy for a kernel, concerning for your standup meetings.",
    severity: "moderate",
    burnoutScore: 5,
    highlight: "Single-author dominance",
  },
  {
    id: "todo-app",
    repoName: "anonymous/todo-app-2024",
    repoUrl: "https://github.com/vercel/next.js",
    emoji: "💀",
    title: "Abandoned Side Project PTSD",
    snippet:
      "Last commit: 14 months ago. Message: 'fix stuff'. The repo has entered hospice care.",
    severity: "critical",
    burnoutScore: 9,
    highlight: "14 months since last commit",
  },
];
