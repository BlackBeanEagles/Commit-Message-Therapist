/**
 * POST /api/newsletter — optional email signup (in-memory demo store).
 */

import { NextRequest, NextResponse } from "next/server";

const subscribers = new Set<string>();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    subscribers.add(email);

    return NextResponse.json({
      ok: true,
      message: "Subscribed successfully.",
      total: subscribers.size,
    });
  } catch {
    return NextResponse.json({ error: "Subscription failed." }, { status: 500 });
  }
}
