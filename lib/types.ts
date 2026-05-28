/**
 * Shared types for Commit Message Therapist — Git metrics and therapy diagnosis payloads.
 */

export interface AuthorStats {
  name: string;
  email: string;
  commitCount: number;
}

export interface GitMetrics {
  repoUrl: string;
  repoName: string;
  totalCommits: number;
  lateNightCommits: number;
  lateNightPercentage: number;
  weekendCommits: number;
  weekendPercentage: number;
  mergeCommits: number;
  mergeConflictMentions: number;
  frustrationKeywords: string[];
  frustrationKeywordCounts: Record<string, number>;
  topFrustratedKeywords: string[];
  mostActiveAuthor: string;
  authorCount: number;
  authors: AuthorStats[];
  firstCommitDate: string | null;
  lastCommitDate: string | null;
  repoAgeDays: number;
  commitsPerWeek: number;
  recentSpike: boolean;
  burnoutRiskScore: number;
  sampleCommitMessages: string[];
}

export interface TherapyDiagnosis {
  emoji: string;
  title: string;
  diagnosis: string;
  severity: "mild" | "moderate" | "severe" | "critical";
  suggestions: string[];
  tweetSummary: string;
}

export interface AnalysisResult {
  metrics: GitMetrics;
  diagnosis: TherapyDiagnosis;
  analyzedAt: string;
  cached: boolean;
}
