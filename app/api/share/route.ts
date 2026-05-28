/**
 * POST /api/share — persist analysis result and return shareable link id.
 * GET /api/share?id= — retrieve shared result by id.
 */

import { NextRequest, NextResponse } from "next/server";
import { createShareLink, getSharedResult } from "@/lib/share-store";
import type { AnalysisResult } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = body?.result as AnalysisResult | undefined;

    if (!result?.metrics || !result?.diagnosis) {
      return NextResponse.json(
        { error: "Invalid analysis result payload." },
        { status: 400 }
      );
    }

    const id = createShareLink(result);
    return NextResponse.json({ id, sharePath: `/r/${id}` });
  } catch {
    return NextResponse.json({ error: "Failed to create share link." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing share id." }, { status: 400 });
  }

  const result = getSharedResult(id);
  if (!result) {
    return NextResponse.json(
      { error: "Share link expired or not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
