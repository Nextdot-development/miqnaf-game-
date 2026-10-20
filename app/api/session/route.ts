import { NextResponse } from "next/server";
import type { Pathway } from "@/types/game";

export const dynamic = "force-dynamic";

/**
 * Shared ticket counter per pathway. Every device that plays through this server takes the next
 * ticket, so players starting at the same time get different cases and question sets
 * (see `createSessionPlan`). Held in memory: it restarts at a random point when the server restarts.
 */
const counters: Record<Pathway, number> = {
  OPD: Math.floor(Math.random() * 1000),
  IPD: Math.floor(Math.random() * 1000),
};

export async function POST(request: Request) {
  let pathway: unknown;
  try {
    pathway = ((await request.json()) as { pathway?: unknown }).pathway;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (pathway !== "OPD" && pathway !== "IPD") {
    return NextResponse.json({ error: "Unknown pathway." }, { status: 422 });
  }
  const ticket = counters[pathway]++;
  return NextResponse.json({ ticket });
}
