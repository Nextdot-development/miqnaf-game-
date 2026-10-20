import type { LeaderboardEntry } from "./leaderboard";

export type Pathway = "OPD" | "IPD";

export type OptionKey = "A" | "B" | "C" | "D";

export interface AnswerOption {
  key: OptionKey;
  text: string;
}

export interface ClinicalQuestion {
  id: string;
  question: string;
  options: AnswerOption[];
  correctOption: OptionKey;
  /** Approved rationale, shown after the correct answer is selected. Empty hides it. */
  explanation: string;
}

export type ClueIcon = "profile" | "symptoms" | "xray" | "lab" | "vitals" | "exam" | "treatment" | "setting";

export interface CaseClue {
  id: string;
  label: string;
  value: string;
  icon: ClueIcon;
}

export interface ClinicalCase {
  id: string;
  title: string;
  clues: CaseClue[];
  questions: ClinicalQuestion[];
}

/**
 * Top-level screens, in play order. Pathway selection lives on the attract screen
 * (per the approved storyboard); the player's name is entered before the briefing.
 */
export type GameScreen =
  | "attract"
  | "participant-entry"
  | "briefing"
  | "deterioration"
  | "question"
  | "recovery"
  | "leaderboard";

/** Sub-state of the question screen: answering, or showing feedback for the last answer. */
export type QuestionPhase = "answering" | "correct" | "incorrect";

export interface GameState {
  screen: GameScreen;
  pathway: Pathway | null;
  /** Case assigned to this session from the pathway's case bank. */
  caseId: string | null;
  /** Question ids in this session's play order (shuffled at start, like exam sets). */
  questionOrder: string[];
  /**
   * Display order of each question's options for this session (shuffled at start),
   * so the correct answer is not always in the same position. Letters A to D are
   * assigned by display position.
   */
  optionOrder: Record<string, OptionKey[]>;
  /** Display name entered at the start; used for the automatic leaderboard submission. */
  playerName: string | null;
  questionIndex: number;
  phase: QuestionPhase;
  selectedOption: OptionKey | null;
  /** Wrong options already tried on the current question. */
  eliminated: OptionKey[];
  completedQuestionIds: string[];
  unlockedPieces: number[];
  wrongAttempts: number;
  /** Accumulated time spent on active questions (feedback after a correct answer is excluded). */
  activeMs: number;
  /** Timestamp when the currently running timed segment began, or null when the clock is paused. */
  segmentStartedAt: number | null;
  completedAt: number | null;
  /** Leaderboard entry saved at the end of this session, used to highlight the participant's row. */
  submittedEntry: LeaderboardEntry | null;
  submittedRank: number | null;
  learnMoreOpen: boolean;
  /** Increments on every reset so session-scoped effects can re-run. */
  sessionId: number;
}

export type GameAction =
  | { type: "SELECT_PATHWAY"; pathway: Pathway }
  | { type: "START"; caseId: string; questionOrder: string[]; optionOrder: Record<string, OptionKey[]> }
  | { type: "BEGIN_CHALLENGE" }
  | { type: "READY"; now: number }
  | { type: "ANSWER"; option: OptionKey; now: number }
  | { type: "RETRY" }
  | { type: "CONTINUE"; now: number }
  | { type: "SUBMIT_NAME"; name: string }
  | { type: "SUBMITTED"; entry: LeaderboardEntry; rank: number | null }
  | { type: "SHOW_LEADERBOARD" }
  | { type: "OPEN_LEARN_MORE" }
  | { type: "CLOSE_LEARN_MORE" }
  | { type: "RESET" };
