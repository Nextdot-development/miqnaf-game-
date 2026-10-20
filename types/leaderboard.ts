import type { Pathway } from "./game";

export interface LeaderboardSubmission {
  displayName: string;
  pathway: Pathway;
  completionMs: number;
  piecesUnlocked: number;
  wrongAttempts: number;
}

export interface LeaderboardEntry extends LeaderboardSubmission {
  id: string;
  createdAt: string;
}

/**
 * "shared": scores are stored in Supabase and shared across kiosks.
 * "demo": scores are stored only in this browser (no database configured).
 */
export type LeaderboardMode = "shared" | "demo";

export interface LeaderboardSnapshot {
  mode: LeaderboardMode;
  entries: LeaderboardEntry[];
}

export interface SubmissionResult {
  mode: LeaderboardMode;
  entry: LeaderboardEntry;
  rank: number | null;
}
