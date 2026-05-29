/**
 * Sends Git metrics to Claude and returns a structured therapy-style diagnosis.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { GitMetrics, TherapyDiagnosis } from "./types";

const DEFAULT_MODEL = "claude-sonnet-4-6";

export type DiagnosisSource = "claude" | "fallback";

export interface TherapyDiagnosisResult {
  diagnosis: TherapyDiagnosis;
  source: DiagnosisSource;
}

function getApiKey(): string | undefined {
  return process.env.ANTHROPIC_API_KEY?.trim() || undefined;
}

function getModelCandidates(): string[] {
  const preferred = process.env.CLAUDE_MODEL?.trim() || DEFAULT_MODEL;
  return [...new Set([preferred, DEFAULT_MODEL])];
}

function sanitizeDiagnosisText(text: string): string {
  return text
    .replace(/\n?\(Add ANTHROPIC_API_KEY[^)]*\)\s*/gi, "")
    .trim();
}

function isModelOrAuthError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("model") ||
    msg.includes("not_found") ||
    msg.includes("404") ||
    msg.includes("authentication") ||
    msg.includes("invalid api key") ||
    msg.includes("401")
  );
}

export async function generateTherapyDiagnosis(
  metrics: GitMetrics
): Promise<TherapyDiagnosisResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { diagnosis: buildFallbackDiagnosis(metrics), source: "fallback" };
  }

  const prompt = `You are "Commit Message Therapist" — a witty but insightful AI therapist who analyzes Git repository patterns.

Analyze these REAL metrics from ${metrics.repoName} and write a personalized therapy session diagnosis. Be funny but genuinely insightful. Reference specific numbers from the data.

METRICS:
${JSON.stringify(metrics, null, 2)}

Respond with ONLY valid JSON (no markdown fences) in this exact shape:
{
  "emoji": "single emoji matching severity",
  "title": "catchy 3-6 word therapy session title",
  "diagnosis": "2-4 paragraphs of witty therapy dialogue referencing the actual metrics. Use humor but give real advice.",
  "severity": "mild" | "moderate" | "severe" | "critical",
  "suggestions": ["3-5 actionable improvements based on patterns"],
  "tweetSummary": "under 240 chars, funny, includes repo name, ends with #CommitMessageTherapist"
}`;

  const client = new Anthropic({ apiKey });
  const models = getModelCandidates();
  let lastError: unknown;

  for (const model of models) {
    try {
      const response = await client.messages.create({
        model,
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      });

      const textBlock = response.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        continue;
      }

      const raw = textBlock.text.trim();
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) continue;

      const parsed = JSON.parse(jsonMatch[0]) as TherapyDiagnosis;
      const diagnosis: TherapyDiagnosis = {
        emoji: parsed.emoji ?? "🛋️",
        title: parsed.title ?? "Session Complete",
        diagnosis: sanitizeDiagnosisText(
          parsed.diagnosis ?? buildFallbackDiagnosis(metrics).diagnosis
        ),
        severity: parsed.severity ?? "moderate",
        suggestions: Array.isArray(parsed.suggestions)
          ? parsed.suggestions.slice(0, 5)
          : [],
        tweetSummary:
          parsed.tweetSummary ??
          `My repo ${metrics.repoName} needs therapy. Burnout risk: ${metrics.burnoutRiskScore}/10 #CommitMessageTherapist`,
      };

      if (process.env.NODE_ENV === "development") {
        console.info(`[claude-therapist] Diagnosis generated with model: ${model}`);
      }

      return { diagnosis, source: "claude" };
    } catch (err) {
      lastError = err;
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[claude-therapist] Model ${model} failed:`,
          err instanceof Error ? err.message : err
        );
      }
      if (isModelOrAuthError(err) && model !== models[models.length - 1]) {
        continue;
      }
    }
  }

  if (process.env.NODE_ENV === "development" && lastError) {
    console.error("[claude-therapist] Falling back to rule-based diagnosis.", lastError);
  }

  return { diagnosis: buildFallbackDiagnosis(metrics), source: "fallback" };
}

function buildFallbackDiagnosis(metrics: GitMetrics): TherapyDiagnosis {
  const severity =
    metrics.burnoutRiskScore >= 8
      ? "critical"
      : metrics.burnoutRiskScore >= 6
        ? "severe"
        : metrics.burnoutRiskScore >= 4
          ? "moderate"
          : "mild";

  return {
    emoji: metrics.burnoutRiskScore >= 7 ? "🔥" : "🛋️",
    title: "Your Code Called — It Needs a Break",
    diagnosis: sanitizeDiagnosisText(`Looking at ${metrics.repoName}, I see ${metrics.totalCommits} commits over ${metrics.repoAgeDays} days. ${metrics.lateNightPercentage}% happened between midnight and 5am — your circadian rhythm is filing a complaint.

${metrics.mostActiveAuthor} carried most of the load (${metrics.authorCount} contributor${metrics.authorCount === 1 ? "" : "s"} total). Merge activity: ${metrics.mergeCommits} merges, ${metrics.mergeConflictMentions} conflict mentions. Top stress words in commit messages: ${metrics.topFrustratedKeywords.join(", ") || "surprisingly calm"}.

Burnout risk score: ${metrics.burnoutRiskScore}/10. ${metrics.weekendPercentage}% of commits landed on weekends. ${metrics.recentSpike ? "Recent commit velocity spiked — classic pre-deadline energy." : "Pace looks relatively steady."}`),
    severity,
    suggestions: [
      "Schedule a no-commit window after 10pm",
      "Batch merge conflict resolution in dedicated sessions",
      "Write commit messages as if HR will read them",
      metrics.weekendPercentage > 20
        ? "Protect weekends — your future self is begging"
        : "Keep protecting your work-life balance",
      "Celebrate small wins with commits that aren't just 'fix'",
    ],
    tweetSummary: `${metrics.repoName}: ${metrics.lateNightPercentage}% late-night commits, burnout ${metrics.burnoutRiskScore}/10. My code needs therapy 🛋️ #CommitMessageTherapist`,
  };
}
