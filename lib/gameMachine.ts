import { CASES, getCase, PUZZLE_PIECE_COUNT } from "@/data/cases";
import type { ClinicalCase, ClinicalQuestion, GameAction, GameState, OptionKey, Pathway } from "@/types/game";

export function createInitialState(sessionId = 0): GameState {
  return {
    screen: "attract",
    pathway: null,
    caseId: null,
    questionOrder: [],
    optionOrder: {},
    playerName: null,
    questionIndex: 0,
    phase: "answering",
    selectedOption: null,
    eliminated: [],
    completedQuestionIds: [],
    unlockedPieces: [],
    wrongAttempts: 0,
    activeMs: 0,
    segmentStartedAt: null,
    completedAt: null,
    submittedEntry: null,
    submittedRank: null,
    learnMoreOpen: false,
    sessionId,
  };
}

export function isCorrectAnswer(question: ClinicalQuestion, option: OptionKey): boolean {
  return question.correctOption === option;
}

export function sessionCase(state: GameState): ClinicalCase {
  return getCase(state.pathway, state.caseId);
}

/** The case's questions in this session's play order. */
export function sessionQuestions(state: GameState): ClinicalQuestion[] {
  const { questions } = sessionCase(state);
  const ordered = state.questionOrder
    .map((id) => questions.find((q) => q.id === id))
    .filter((q): q is ClinicalQuestion => q !== undefined);
  return ordered.length === questions.length ? ordered : questions;
}

export function currentQuestion(state: GameState): ClinicalQuestion {
  const questions = sessionQuestions(state);
  return questions[Math.min(state.questionIndex, questions.length - 1)];
}

/** Elapsed challenge time, including the currently running segment. */
export function elapsedMs(state: GameState, now: number): number {
  return state.activeMs + (state.segmentStartedAt === null ? 0 : now - state.segmentStartedAt);
}

export function isChallengeComplete(state: GameState): boolean {
  return state.unlockedPieces.length >= PUZZLE_PIECE_COUNT;
}

/**
 * Pure game reducer. Every guard here protects against double taps and stale
 * actions: an action that is not valid for the current state is ignored.
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SELECT_PATHWAY":
      if (state.screen !== "attract") return state;
      return { ...state, pathway: action.pathway };

    case "START":
      if (state.screen !== "attract" || state.pathway === null) return state;
      return {
        ...createInitialState(state.sessionId),
        pathway: state.pathway,
        caseId: action.caseId,
        questionOrder: action.questionOrder,
        optionOrder: action.optionOrder,
        screen: "participant-entry",
      };

    case "SUBMIT_NAME":
      if (state.screen !== "participant-entry" || action.name.trim().length === 0) return state;
      return { ...state, playerName: action.name, screen: "briefing" };

    case "BEGIN_CHALLENGE":
      if (state.screen !== "briefing") return state;
      return { ...state, screen: "deterioration" };

    case "READY":
      if (state.screen !== "deterioration") return state;
      return {
        ...state,
        screen: "question",
        questionIndex: 0,
        phase: "answering",
        selectedOption: null,
        eliminated: [],
        segmentStartedAt: action.now,
      };

    case "ANSWER": {
      if (state.screen !== "question" || state.phase !== "answering") return state;
      if (state.eliminated.includes(action.option)) return state;
      const question = currentQuestion(state);

      if (!isCorrectAnswer(question, action.option)) {
        return {
          ...state,
          phase: "incorrect",
          selectedOption: action.option,
          eliminated: [...state.eliminated, action.option],
          wrongAttempts: state.wrongAttempts + 1,
        };
      }

      const alreadyDone = state.completedQuestionIds.includes(question.id);
      // Pieces unlock left to right in play order, whatever order the questions were dealt in.
      const piece = state.questionIndex;
      const unlockedPieces =
        alreadyDone || state.unlockedPieces.includes(piece)
          ? state.unlockedPieces
          : [...state.unlockedPieces, piece];
      const activeMs = elapsedMs(state, action.now);
      const complete = unlockedPieces.length >= PUZZLE_PIECE_COUNT;

      return {
        ...state,
        phase: "correct",
        selectedOption: action.option,
        completedQuestionIds: alreadyDone
          ? state.completedQuestionIds
          : [...state.completedQuestionIds, question.id],
        unlockedPieces,
        activeMs,
        // The clock pauses while the correct-answer feedback is on screen.
        segmentStartedAt: null,
        completedAt: complete ? action.now : state.completedAt,
      };
    }

    case "RETRY":
      if (state.screen !== "question" || state.phase !== "incorrect") return state;
      return { ...state, phase: "answering", selectedOption: null };

    case "CONTINUE": {
      if (state.screen !== "question" || state.phase !== "correct") return state;
      const isLast = state.questionIndex >= sessionQuestions(state).length - 1;
      if (isLast) {
        // Final reveal only triggers when every piece is unlocked.
        if (!isChallengeComplete(state)) return state;
        return { ...state, screen: "recovery" };
      }
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        phase: "answering",
        selectedOption: null,
        eliminated: [],
        segmentStartedAt: action.now,
      };
    }

    case "SUBMITTED":
      // Saved automatically when the challenge is complete; the player stays on the reveal screen.
      if (state.screen !== "recovery" || state.submittedEntry !== null) return state;
      return {
        ...state,
        submittedEntry: action.entry,
        submittedRank: action.rank,
      };

    case "SHOW_LEADERBOARD":
      if (!["attract", "recovery"].includes(state.screen)) return state;
      return { ...state, screen: "leaderboard", learnMoreOpen: false };

    case "OPEN_LEARN_MORE":
      return { ...state, learnMoreOpen: true };

    case "CLOSE_LEARN_MORE":
      return { ...state, learnMoreOpen: false };

    case "RESET":
      return createInitialState(state.sessionId + 1);

    default:
      return state;
  }
}

const LETTERS: OptionKey[] = ["A", "B", "C", "D"];

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface SessionPlan {
  caseId: string;
  questionOrder: string[];
  optionOrder: Record<string, OptionKey[]>;
}

/** The k-th permutation (0-based, lexicographic) of the items. */
function permutation<T>(items: readonly T[], k: number): T[] {
  const pool = [...items];
  const out: T[] = [];
  for (let n = pool.length; n > 0; n--) {
    let f = 1;
    for (let i = 2; i < n; i++) f *= i;
    out.push(pool.splice(Math.floor(k / f) % n, 1)[0]);
    k %= f;
  }
  return out;
}

function factorial(n: number): number {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

/**
 * Deals a session like an exam paper set from a ticket number (0, 1, 2, ...):
 * - the case rotates with the ticket, so consecutive players get different cases;
 * - the question order is set number `ticket / cases`, stepped by 5 through all orders
 *   (5 shares no factor with 4! = 24), so players who get the same case see a different order;
 * - each question's options are shuffled at random (Fisher-Yates).
 * Impure: call it from an event handler and pass the result in the START action.
 */
export function createSessionPlan(pathway: Pathway, ticket: number, random: () => number = Math.random): SessionPlan {
  const bank = CASES[pathway];
  const n = bank.length;
  const clinicalCase = bank[((ticket % n) + n) % n];
  const ids = clinicalCase.questions.map((q) => q.id);
  const set = Math.floor(Math.abs(ticket) / n);
  const optionOrder: Record<string, OptionKey[]> = {};
  for (const question of clinicalCase.questions) {
    optionOrder[question.id] = shuffled(
      question.options.map((o) => o.key),
      random,
    );
  }
  return {
    caseId: clinicalCase.id,
    questionOrder: permutation(ids, (set * 5) % factorial(ids.length)),
    optionOrder,
  };
}

/** Options of a question in this session's display order, each with its display letter. */
export function displayedOptions(state: GameState, question: ClinicalQuestion) {
  const order = state.optionOrder[question.id] ?? question.options.map((o) => o.key);
  return order
    .map((key) => question.options.find((o) => o.key === key))
    .filter((o): o is NonNullable<typeof o> => o !== undefined)
    .map((option, i) => ({ option, letter: LETTERS[i] }));
}
