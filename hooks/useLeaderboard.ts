"use client";

import { useCallback, useEffect, useState } from "react";
import { LeaderboardError, loadLeaderboard } from "@/lib/leaderboard/client";
import type { LeaderboardSnapshot } from "@/types/leaderboard";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; snapshot: LeaderboardSnapshot }
  | { status: "error"; message: string };

export function useLeaderboard(limit: number) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    loadLeaderboard(limit)
      .then((snapshot) => {
        if (!cancelled) setState({ status: "ready", snapshot });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({
          status: "error",
          message: error instanceof LeaderboardError ? error.message : "The leaderboard could not be loaded.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [limit, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { state, retry };
}
