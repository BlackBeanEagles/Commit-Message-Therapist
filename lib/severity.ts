/**
 * Severity styling and burnout-score mapping for visual indicators.
 */

import type { TherapyDiagnosis } from "./types";

export type SeverityLevel = TherapyDiagnosis["severity"];

export interface SeverityStyle {
  label: string;
  dot: string;
  bg: string;
  border: string;
  text: string;
  ring: string;
}

export const SEVERITY_STYLES: Record<SeverityLevel, SeverityStyle> = {
  mild: {
    label: "Mild",
    dot: "bg-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-400/35",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-400/30",
  },
  moderate: {
    label: "Moderate",
    dot: "bg-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-400/35",
    text: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-400/30",
  },
  severe: {
    label: "Severe",
    dot: "bg-orange-400",
    bg: "bg-orange-500/15",
    border: "border-orange-400/35",
    text: "text-orange-600 dark:text-orange-400",
    ring: "ring-orange-400/30",
  },
  critical: {
    label: "Critical",
    dot: "bg-red-500",
    bg: "bg-red-500/15",
    border: "border-red-400/35",
    text: "text-red-600 dark:text-red-400",
    ring: "ring-red-400/30",
  },
};

/** Map burnout score (1–10) to a severity tier for the visual indicator. */
export function burnoutToSeverity(score: number): SeverityLevel {
  if (score >= 9) return "critical";
  if (score >= 7) return "severe";
  if (score >= 4) return "moderate";
  return "mild";
}

export function getSeverityStyle(severity: SeverityLevel): SeverityStyle {
  return SEVERITY_STYLES[severity];
}
