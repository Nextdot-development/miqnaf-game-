import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { LeaderboardEntry, LeaderboardSubmission } from "@/types/leaderboard";

/**
 * Server-only Supabase access. Imported exclusively from app/api routes so the
 * service-role key never reaches the browser bundle.
 */
const TABLE = "leaderboard_entries";

interface Row {
  id: string;
  display_name: string;
  pathway: "OPD" | "IPD";
  completion_ms: number;
  pieces_unlocked: number;
  wrong_attempts: number;
  created_at: string;
}

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getClient(): SupabaseClient {
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

function toEntry(row: Row): LeaderboardEntry {
  return {
    id: row.id,
    displayName: row.display_name,
    pathway: row.pathway,
    completionMs: row.completion_ms,
    piecesUnlocked: row.pieces_unlocked,
    wrongAttempts: row.wrong_attempts,
    createdAt: row.created_at,
  };
}

export async function fetchTopEntries(limit: number): Promise<LeaderboardEntry[]> {
  const { data, error } = await getClient()
    .from(TABLE)
    .select("id, display_name, pathway, completion_ms, pieces_unlocked, wrong_attempts, created_at")
    .order("completion_ms", { ascending: true })
    .order("wrong_attempts", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data as Row[]).map(toEntry);
}

export async function insertEntry(
  submission: LeaderboardSubmission,
): Promise<{ entry: LeaderboardEntry; rank: number | null }> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      display_name: submission.displayName,
      pathway: submission.pathway,
      completion_ms: submission.completionMs,
      pieces_unlocked: submission.piecesUnlocked,
      wrong_attempts: submission.wrongAttempts,
    })
    .select("id, display_name, pathway, completion_ms, pieces_unlocked, wrong_attempts, created_at")
    .single();
  if (error) throw new Error(error.message);
  const entry = toEntry(data as Row);

  // Rank = 1 + entries that sort strictly ahead (faster, or equally fast with fewer wrong attempts).
  const [faster, tied] = await Promise.all([
    supabase.from(TABLE).select("id", { count: "exact", head: true }).lt("completion_ms", entry.completionMs),
    supabase
      .from(TABLE)
      .select("id", { count: "exact", head: true })
      .eq("completion_ms", entry.completionMs)
      .lt("wrong_attempts", entry.wrongAttempts),
  ]);
  const rank =
    faster.error || tied.error || faster.count === null || tied.count === null
      ? null
      : faster.count + tied.count + 1;

  return { entry, rank };
}
