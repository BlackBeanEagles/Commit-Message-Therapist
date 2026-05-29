/**
 * Clones a GitHub repository (shallow) and extracts commit-history metrics for therapy diagnosis.
 */

import { execFile } from "child_process";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { promisify } from "util";
import simpleGit from "simple-git";
import type { GitMetrics } from "./types";
import type { ParsedGitHubUrl } from "./github-url";

const execFileAsync = promisify(execFile);

const FRUSTRATION_KEYWORDS = [
  "fix",
  "broken",
  "wtf",
  "ugh",
  "hack",
  "temp",
  "revert",
  "oops",
  "damn",
  "shit",
  "fuck",
  "finally",
  "again",
  "why",
  "pain",
  "bug",
  "hotfix",
  "emergency",
  "sorry",
  "please work",
  "doesn't work",
  "not working",
];

function isLateNight(date: Date): boolean {
  const hour = date.getHours();
  return hour >= 0 && hour < 5;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function countFrustrationKeywords(message: string): Record<string, number> {
  const lower = message.toLowerCase();
  const counts: Record<string, number> = {};
  for (const keyword of FRUSTRATION_KEYWORDS) {
    if (lower.includes(keyword)) {
      counts[keyword] = (counts[keyword] ?? 0) + 1;
    }
  }
  return counts;
}

function mergeKeywordCounts(
  target: Record<string, number>,
  source: Record<string, number>
): void {
  for (const [key, value] of Object.entries(source)) {
    target[key] = (target[key] ?? 0) + value;
  }
}

/**
 * Bare clone: history only, no working tree checkout.
 * Avoids Windows MAX_PATH failures on repos with very deep paths (e.g. vercel/next.js).
 */
async function cloneRepository(cloneUrl: string, destDir: string): Promise<void> {
  await fs.mkdir(path.dirname(destDir), { recursive: true });
  await execFileAsync(
    "git",
    [
      "-c",
      "core.longpaths=true",
      "clone",
      "--bare",
      "--depth",
      "500",
      "--single-branch",
      cloneUrl,
      destDir,
    ],
    { timeout: 120_000 }
  );
}

export async function analyzeRepository(
  parsed: ParsedGitHubUrl,
  displayUrl: string
): Promise<GitMetrics> {
  const tempDir = path.join(os.tmpdir(), `cmt-${Date.now()}-${parsed.repo}`);
  let cleaned = false;

  const cleanup = async () => {
    if (cleaned) return;
    cleaned = true;
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
  };

  try {
    await cloneRepository(parsed.cloneUrl, tempDir);
    const git = simpleGit(tempDir);
    const log = await git.log({ maxCount: 500 });

    if (!log.all.length) {
      throw new Error("No commits found in this repository.");
    }

    let lateNightCommits = 0;
    let weekendCommits = 0;
    let mergeCommits = 0;
    let mergeConflictMentions = 0;
    const authorMap = new Map<string, { name: string; email: string; count: number }>();
    const frustrationKeywordCounts: Record<string, number> = {};
    const sampleMessages: string[] = [];
    const commitDates: Date[] = [];

    for (const commit of log.all) {
      const date = new Date(commit.date);
      commitDates.push(date);

      if (isLateNight(date)) lateNightCommits++;
      if (isWeekend(date)) weekendCommits++;

      const message = commit.message ?? "";
      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes("merge") ||
        commit.message?.startsWith("Merge ")
      ) {
        mergeCommits++;
      }
      if (
        lowerMessage.includes("conflict") ||
        lowerMessage.includes("resolve conflict")
      ) {
        mergeConflictMentions++;
      }

      mergeKeywordCounts(frustrationKeywordCounts, countFrustrationKeywords(message));

      if (sampleMessages.length < 8 && message.trim()) {
        sampleMessages.push(message.split("\n")[0].slice(0, 120));
      }

      const email = commit.author_email ?? "unknown";
      const name = commit.author_name ?? email;
      const existing = authorMap.get(email);
      if (existing) {
        existing.count++;
      } else {
        authorMap.set(email, { name, email, count: 1 });
      }
    }

    commitDates.sort((a, b) => a.getTime() - b.getTime());
    const firstCommitDate = commitDates[0]?.toISOString() ?? null;
    const lastCommitDate = commitDates[commitDates.length - 1]?.toISOString() ?? null;

    const repoAgeDays =
      firstCommitDate && lastCommitDate
        ? Math.max(
            1,
            Math.ceil(
              (new Date(lastCommitDate).getTime() - new Date(firstCommitDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          )
        : 1;

    const totalCommits = log.all.length;
    const commitsPerWeek = (totalCommits / repoAgeDays) * 7;

    const recentHalf = log.all.slice(0, Math.floor(totalCommits / 2));
    const olderHalf = log.all.slice(Math.floor(totalCommits / 2));
    const recentSpike =
      recentHalf.length > 10 &&
      olderHalf.length > 0 &&
      recentHalf.length / Math.max(olderHalf.length, 1) > 1.5;

    const authors = [...authorMap.values()]
      .map((a) => ({ name: a.name, email: a.email, commitCount: a.count }))
      .sort((a, b) => b.commitCount - a.commitCount);

    const mostActiveAuthor = authors[0]?.name ?? "Unknown";

    const lateNightPercentage =
      totalCommits > 0 ? Math.round((lateNightCommits / totalCommits) * 100) : 0;
    const weekendPercentage =
      totalCommits > 0 ? Math.round((weekendCommits / totalCommits) * 100) : 0;

    const topFrustratedKeywords = Object.entries(frustrationKeywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);

    const frustrationHits = Object.values(frustrationKeywordCounts).reduce(
      (sum, n) => sum + n,
      0
    );

    let burnoutRiskScore = 1;
    burnoutRiskScore += Math.min(3, Math.floor(lateNightPercentage / 15));
    burnoutRiskScore += Math.min(2, Math.floor(weekendPercentage / 20));
    burnoutRiskScore += Math.min(2, Math.floor(mergeCommits / 20));
    burnoutRiskScore += Math.min(2, Math.floor(frustrationHits / 15));
    if (recentSpike) burnoutRiskScore += 1;
    burnoutRiskScore = Math.min(10, Math.max(1, burnoutRiskScore));

    return {
      repoUrl: displayUrl,
      repoName: `${parsed.owner}/${parsed.repo}`,
      totalCommits,
      lateNightCommits,
      lateNightPercentage,
      weekendCommits,
      weekendPercentage,
      mergeCommits,
      mergeConflictMentions,
      frustrationKeywords: FRUSTRATION_KEYWORDS,
      frustrationKeywordCounts,
      topFrustratedKeywords: topFrustratedKeywords,
      mostActiveAuthor,
      authorCount: authors.length,
      authors: authors.slice(0, 5),
      firstCommitDate,
      lastCommitDate,
      repoAgeDays,
      commitsPerWeek: Math.round(commitsPerWeek * 10) / 10,
      recentSpike,
      burnoutRiskScore,
      sampleCommitMessages: sampleMessages,
    };
  } finally {
    await cleanup();
  }
}
