/**
 * POST /api/analyze — clone repo, extract Git metrics, generate Claude therapy diagnosis.
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeRepository } from "@/lib/git-analyzer";
import { generateTherapyDiagnosis } from "@/lib/claude-therapist";
import { getCachedAnalysis, setCachedAnalysis } from "@/lib/cache";
import { parseGitHubUrl } from "@/lib/github-url";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const repoUrl = typeof body?.repoUrl === "string" ? body.repoUrl : "";
    const forceRefresh = body?.forceRefresh === true;

    if (!repoUrl.trim()) {
      return NextResponse.json(
        { error: "Please paste a GitHub repository URL." },
        { status: 400 }
      );
    }

    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      return NextResponse.json(
        {
          error:
            "That doesn't look like a public GitHub repo URL. Try: https://github.com/username/repo",
        },
        { status: 400 }
      );
    }

    if (!forceRefresh) {
      const cached = getCachedAnalysis(parsed.displayUrl);
      if (cached) {
        return NextResponse.json(cached);
      }
    }

    const metrics = await analyzeRepository(parsed, parsed.displayUrl);
    const { diagnosis, source } = await generateTherapyDiagnosis(metrics);

    const result = {
      metrics,
      diagnosis,
      diagnosisSource: source,
      analyzedAt: new Date().toISOString(),
      cached: false,
    };

    setCachedAnalysis(parsed.displayUrl, result);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";

    if (
      message.includes("not found") ||
      message.includes("Repository not found") ||
      message.includes("404")
    ) {
      return NextResponse.json(
        { error: "Repository not found. Check the URL or make sure it's public." },
        { status: 404 }
      );
    }

    if (
      message.includes("Authentication failed") ||
      message.includes("could not read Username") ||
      message.includes("403")
    ) {
      return NextResponse.json(
        {
          error:
            "This repo appears to be private. We can only analyze public repositories.",
        },
        { status: 403 }
      );
    }

    if (message.includes("git") && message.includes("not recognized")) {
      return NextResponse.json(
        {
          error:
            "Git is not installed on the server. Install Git to enable repository analysis.",
        },
        { status: 500 }
      );
    }

    if (message.includes("timeout") || message.includes("ETIMEDOUT")) {
      return NextResponse.json(
        { error: "Analysis timed out. Try a smaller repository." },
        { status: 504 }
      );
    }

    if (
      message.includes("Filename too long") ||
      message.includes("checkout failed")
    ) {
      return NextResponse.json(
        {
          error:
            "This repository has paths that are difficult to clone on Windows. Try again — we use a history-only clone — or use a smaller repo for your demo.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: message || "Something went wrong during analysis. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Commit Message Therapist",
    version: "1.0.0",
  });
}
