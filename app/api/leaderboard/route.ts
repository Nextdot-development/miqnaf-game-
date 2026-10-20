import { NextResponse } from "next/server";
import { KIOSK } from "@/data/brand";
import { validateSubmission } from "@/lib/leaderboard/validate";
import { fetchTopEntries, insertEntry, isSupabaseConfigured } from "@/lib/leaderboard/server";

export const dynamic = "force-dynamic";

const MAX_LIMIT = 50;

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ mode: "demo" });
  }
  const requested = Number(new URL(request.url).searchParams.get("limit"));
  const limit = Number.isInteger(requested) && requested > 0 ? Math.min(requested, MAX_LIMIT) : KIOSK.leaderboardSize;
  try {
    const entries = await fetchTopEntries(limit);
    return NextResponse.json({ mode: "shared", entries });
  } catch (error) {
    console.error("[leaderboard] fetch failed:", error);
    return NextResponse.json({ mode: "shared", error: "Leaderboard unavailable." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const result = validateSubmission(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  // No database configured: the payload is validated here and the client stores it locally.
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ mode: "demo", submission: result.value });
  }

  try {
    const { entry, rank } = await insertEntry(result.value);
    return NextResponse.json({ mode: "shared", entry, rank }, { status: 201 });
  } catch (error) {
    console.error("[leaderboard] insert failed:", error);
    return NextResponse.json({ mode: "shared", error: "Could not save your score." }, { status: 502 });
  }
}
