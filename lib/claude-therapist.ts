/**
 * Sends Git metrics to Claude and returns a structured therapy-style diagnosis.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { GitMetrics, TherapyDiagnosis } from "./types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = process.env.CLAUDE_MODEL ?? "claude-sonnet-4-6";

export async function generateTherapyDiagnosis(
  metrics: GitMetrics
): Promise<TherapyDiagnosis> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return buildFallbackDiagnosis(metrics);
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

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return buildFallbackDiagnosis(metrics);
    }

    const raw = textBlock.text.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return buildFallbackDiagnosis(metrics);

    const parsed = JSON.parse(jsonMatch[0]) as TherapyDiagnosis;
    return {
      emoji: parsed.emoji ?? "🛋️",
      title: parsed.title ?? "Session Complete",
      diagnosis: parsed.diagnosis ?? buildFallbackDiagnosis(metrics).diagnosis,
      severity: parsed.severity ?? "moderate",
      suggestions: Array.isArray(parsed.suggestions)
        ? parsed.suggestions.slice(0, 5)
        : [],
      tweetSummary:
        parsed.tweetSummary ??
        `My repo ${metrics.repoName} needs therapy. Burnout risk: ${metrics.burnoutRiskScore}/10 #CommitMessageTherapist`,
    };
  } catch {
    return buildFallbackDiagnosis(metrics);
  }
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
    diagnosis: `Looking at ${metrics.repoName}, I see ${metrics.totalCommits} commits over ${metrics.repoAgeDays} days. ${metrics.lateNightPercentage}% happened between midnight and 5am — your circadian rhythm is filing a complaint.

${metrics.mostActiveAuthor} carried most of the load (${metrics.authorCount} contributor${metrics.authorCount === 1 ? "" : "s"} total). Merge activity: ${metrics.mergeCommits} merges, ${metrics.mergeConflictMentions} conflict mentions. Top stress words in commit messages: ${metrics.topFrustratedKeywords.join(", ") || "surprisingly calm"}.

Burnout risk score: ${metrics.burnoutRiskScore}/10. ${metrics.weekendPercentage}% of commits landed on weekends. ${metrics.recentSpike ? "Recent commit velocity spiked — classic pre-deadline energy." : "Pace looks relatively steady."}

(Add ANTHROPIC_API_KEY for a fully personalized Claude diagnosis.)`,
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
