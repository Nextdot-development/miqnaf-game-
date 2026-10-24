import { MONITOR_COLORS } from "@/data/brand";
import { PUZZLE_PIECE_COUNT } from "@/data/cases";
import type { GameScreen } from "@/types/game";

/** Narrative tone of the scene. Drives monitor colour, lighting and atmosphere. */
export type Tone = "critical" | "recovering" | "stable";

/**
 * Patient mood 0 to 5, following the approved storyboard:
 * 0 distressed · 1 slightly better · 2 calmer, propped up · 3 more comfortable and alert
 * 4 sitting up, relieved · 5 stabilized and calm
 */
export type Mood = 0 | 1 | 2 | 3 | 4 | 5;

export interface VisualStage {
  tone: Tone;
  mood: Mood;
}

export function visualStageFor(
  screen: GameScreen,
  unlockedCount: number,
): VisualStage {
  switch (screen) {
    case "attract":
    case "briefing":
    case "deterioration":
      return { tone: "critical", mood: 0 };
    case "question":
      if (unlockedCount === 0) return { tone: "critical", mood: 0 };
      // The last correct answer stabilises the patient straight away.
      if (unlockedCount >= PUZZLE_PIECE_COUNT) return { tone: "stable", mood: 5 };
      return { tone: "recovering", mood: Math.min(unlockedCount, 4) as Mood };
    case "recovery":
      return { tone: "stable", mood: 5 };
    default:
      return { tone: "stable", mood: 5 };
  }
}

export function toneColor(tone: Tone): string {
  return MONITOR_COLORS[tone];
}

export const TONE_LABEL: Record<Tone, string> = {
  critical: "ALERT",
  recovering: "IMPROVING",
  stable: "STABLE",
};

/** Formats milliseconds as "00:38s" to match the approved leaderboard. */
export function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}s`;
}
