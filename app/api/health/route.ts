/**
 * GET /api/health — service health check for deployment monitors.
 */

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Commit Message Therapist",
    gitAvailable: true,
    claudeConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
    timestamp: new Date().toISOString(),
  });
}
