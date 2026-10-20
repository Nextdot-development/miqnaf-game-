import type { LeaderboardEntry, LeaderboardSubmission } from "@/types/leaderboard";
import { compareEntries } from "./validate";

/**
 * Demo leaderboard stored in this browser only. Used when Supabase is not
 * configured. Falls back to memory when storage is unavailable (private mode, etc.).
 */
const STORAGE_KEY = "stp-demo-leaderboard-v1";
const MAX_ENTRIES = 500;

let memoryFallback: LeaderboardEntry[] = [];

function read(): LeaderboardEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return memoryFallback;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LeaderboardEntry[]) : memoryFallback;
  } catch {
    return memoryFallback;
  }
}

function write(entries: LeaderboardEntry[]): void {
  memoryFallback = entries;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage full or blocked: the in-memory copy still serves this session.
  }
}

export function makeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function listLocal(): LeaderboardEntry[] {
  return [...read()].sort(compareEntries);
}

export function addLocal(submission: LeaderboardSubmission): { entry: LeaderboardEntry; rank: number } {
  const entry: LeaderboardEntry = { ...submission, id: makeId(), createdAt: new Date().toISOString() };
  const sorted = [...read(), entry].sort(compareEntries).slice(0, MAX_ENTRIES);
  write(sorted);
  const index = sorted.findIndex((e) => e.id === entry.id);
  return { entry, rank: index === -1 ? sorted.length + 1 : index + 1 };
}
