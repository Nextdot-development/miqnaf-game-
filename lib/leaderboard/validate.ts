import { PUZZLE_PIECE_COUNT } from "@/data/cases";
import type { LeaderboardEntry, LeaderboardSubmission } from "@/types/leaderboard";

export const NAME_MIN = 2;
export const NAME_MAX = 32;
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} .'\-]*$/u;

const MIN_COMPLETION_MS = 2_000;
const MAX_COMPLETION_MS = 60 * 60 * 1000;

export function normalizeName(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

/** Returns an error message, or null when the name is acceptable. */
export function validateName(raw: string): string | null {
  const name = normalizeName(raw);
  if (name.length === 0) return "Please enter a display name.";
  if (name.length < NAME_MIN) return `Use at least ${NAME_MIN} characters.`;
  if (name.length > NAME_MAX) return `Use at most ${NAME_MAX} characters.`;
  if (!NAME_PATTERN.test(name)) return "Use letters, spaces, full stops, hyphens or apostrophes only.";
  return null;
}

type ValidationResult =
  | { ok: true; value: LeaderboardSubmission }
  | { ok: false; error: string };

/** Validates untrusted input (used by the API route and by the local demo store). */
export function validateSubmission(input: unknown): ValidationResult {
  if (typeof input !== "object" || input === null) return { ok: false, error: "Invalid payload." };
  const data = input as Record<string, unknown>;

  if (typeof data.displayName !== "string") return { ok: false, error: "Display name is required." };
  const nameError = validateName(data.displayName);
  if (nameError) return { ok: false, error: nameError };

  if (data.pathway !== "OPD" && data.pathway !== "IPD") return { ok: false, error: "Invalid case type." };

  const { completionMs, piecesUnlocked, wrongAttempts } = data;
  if (
    typeof completionMs !== "number" ||
    !Number.isInteger(completionMs) ||
    completionMs < MIN_COMPLETION_MS ||
    completionMs > MAX_COMPLETION_MS
  ) {
    return { ok: false, error: "Invalid completion time." };
  }
  if (piecesUnlocked !== PUZZLE_PIECE_COUNT) {
    return { ok: false, error: "Only completed challenges can be submitted." };
  }
  if (
    typeof wrongAttempts !== "number" ||
    !Number.isInteger(wrongAttempts) ||
    wrongAttempts < 0 ||
    wrongAttempts > 1000
  ) {
    return { ok: false, error: "Invalid attempt count." };
  }

  return {
    ok: true,
    value: {
      displayName: normalizeName(data.displayName),
      pathway: data.pathway,
      completionMs,
      piecesUnlocked,
      wrongAttempts,
    },
  };
}

/** Fastest first; ties broken by fewer wrong attempts, then earliest submission. */
export function compareEntries(a: LeaderboardEntry, b: LeaderboardEntry): number {
  return (
    a.completionMs - b.completionMs ||
    a.wrongAttempts - b.wrongAttempts ||
    a.createdAt.localeCompare(b.createdAt)
  );
}
