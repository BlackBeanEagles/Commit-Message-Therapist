/**
 * GET /api/health — service health check for deployment monitors.
 */

import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  return NextResponse.json({
    status: "ok",
    service: "Commit Message Therapist",
    gitAvailable: true,
    claudeConfigured: Boolean(apiKey),
    claudeModel: process.env.CLAUDE_MODEL?.trim() || "claude-sonnet-4-6",
    timestamp: new Date().toISOString(),
  });
}
