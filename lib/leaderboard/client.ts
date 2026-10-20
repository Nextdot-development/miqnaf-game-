import type {
  LeaderboardEntry,
  LeaderboardSnapshot,
  LeaderboardSubmission,
  SubmissionResult,
} from "@/types/leaderboard";
import { addLocal, listLocal } from "./localStore";
import { validateSubmission } from "./validate";

const REQUEST_TIMEOUT_MS = 8_000;

export class LeaderboardError extends Error {}

/** Thrown when the API itself cannot be reached (e.g. static hosting with no server). */
class ApiUnreachable extends Error {}

async function request(input: string, init?: RequestInit): Promise<{ status: number; body: Record<string, unknown> }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(input, { ...init, cache: "no-store", signal: controller.signal });
    if (response.status === 404) throw new ApiUnreachable();
    const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    return { status: response.status, body };
  } catch (error) {
    if (error instanceof ApiUnreachable) throw error;
    if (controller.signal.aborted) throw new LeaderboardError("The leaderboard took too long to respond.");
    throw new ApiUnreachable();
  } finally {
    clearTimeout(timer);
  }
}

export async function loadLeaderboard(limit: number): Promise<LeaderboardSnapshot> {
  let result;
  try {
    result = await request(`/api/leaderboard?limit=${limit}`);
  } catch (error) {
    if (error instanceof ApiUnreachable) return { mode: "demo", entries: listLocal() };
    throw error;
  }
  const { status, body } = result;
  if (body.mode === "demo") return { mode: "demo", entries: listLocal() };
  if (status >= 200 && status < 300 && Array.isArray(body.entries)) {
    return { mode: "shared", entries: body.entries as LeaderboardEntry[] };
  }
  throw new LeaderboardError(typeof body.error === "string" ? body.error : "Leaderboard unavailable.");
}

export async function submitScore(submission: LeaderboardSubmission): Promise<SubmissionResult> {
  let result;
  try {
    result = await request("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });
  } catch (error) {
    if (!(error instanceof ApiUnreachable)) throw error;
    // No API available: validate locally and keep the score on this device.
    const local = validateSubmission(submission);
    if (!local.ok) throw new LeaderboardError(local.error);
    const { entry, rank } = addLocal(local.value);
    return { mode: "demo", entry, rank };
  }

  const { status, body } = result;
  if (status >= 400) {
    throw new LeaderboardError(typeof body.error === "string" ? body.error : "Could not save your score.");
  }
  if (body.mode === "demo") {
    const { entry, rank } = addLocal(body.submission as LeaderboardSubmission);
    return { mode: "demo", entry, rank };
  }
  return {
    mode: "shared",
    entry: body.entry as LeaderboardEntry,
    rank: typeof body.rank === "number" ? body.rank : null,
  };
}
