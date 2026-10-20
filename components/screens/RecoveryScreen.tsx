"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Info, LoaderCircle, RefreshCw, RotateCcw, TriangleAlert, Trophy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { KIOSK } from "@/data/brand";
import { PUZZLE_PIECE_COUNT } from "@/data/cases";
import { COPY } from "@/data/copy";
import { useGame } from "@/hooks/useGame";
import { LeaderboardError, submitScore } from "@/lib/leaderboard/client";
import { formatTime } from "@/lib/visualStage";
import { CompletionPopup } from "../CompletionPopup";
import { PrimaryButton } from "../PrimaryButton";
import { PuzzleBoard } from "../PuzzleBoard";
import { ScreenTransition } from "../ScreenTransition";

interface RecoveryScreenProps {
  revealed: boolean;
  onRevealed: () => void;
  onRestart: () => void;
}

export function RecoveryScreen({ revealed, onRevealed, onRestart }: RecoveryScreenProps) {
  const { state, dispatch, sfx, voiceOver } = useGame();

  const save = useAutoSave();

  // The MIQNAF logo popup plays once per session. Closing it stabilises the patient (monitor turns green).
  const [popupOpen, setPopupOpen] = useState(!revealed);
  useEffect(() => {
    if (popupOpen) sfx("complete");
    // Only on mount: the popup opens once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const closePopup = useCallback(() => {
    setPopupOpen(false);
    onRevealed();
    voiceOver("recovery");
  }, [onRevealed, voiceOver]);

  const stats = [
    { label: "Your time", value: formatTime(state.activeMs), tile: "bg-navy text-white ring-2 ring-gold" },
    { label: "Puzzle", value: `${state.unlockedPieces.length}/${PUZZLE_PIECE_COUNT}`, tile: "bg-white text-navy ring-2 ring-navy/10" },
    { label: "Case", value: state.pathway ?? "", tile: "bg-white text-navy ring-2 ring-navy/10" },
  ];

  return (
    <ScreenTransition className="flex flex-col gap-10">
      <div>
        <p className="text-label font-bold uppercase tracking-[0.08em] text-red">
          {COPY.recovery.puzzleCompleted}
          {state.playerName && <span className="text-navy/70"> Well done, {state.playerName}.</span>}
        </p>
        <h1 className="font-display mt-3 text-[4rem] font-extrabold uppercase leading-[0.9] wide:text-title">
          Challenge
          <br />
          complete!
        </h1>
        <motion.div
          initial={false}
          animate={{ opacity: revealed ? 1 : 0.3 }}
          transition={{ duration: 0.8 }}
          className="mt-6 flex flex-col gap-1"
        >
          <span className="flex items-center gap-3 text-body font-bold uppercase tracking-[0.06em] text-navy">
            <span className="h-3.5 w-3.5 rounded-full bg-gold" aria-hidden />
            {COPY.recovery.stabilised}
          </span>
          <span className="text-label text-navy/60">{COPY.recovery.simulationNote}</span>
        </motion.div>
      </div>

      {/* Result tiles, one logo colour each */}
      <dl className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`flex flex-col gap-1 rounded-2xl px-6 py-5 ${s.tile}`}>
            <dt className="text-label font-bold uppercase tracking-[0.08em] opacity-80">{s.label}</dt>
            <dd className="font-display text-[3.5rem] font-bold leading-none">{s.value}</dd>
          </div>
        ))}
      </dl>

      <SaveStatus save={save} />

      <div className="flex flex-col items-start gap-4">
        <PrimaryButton
          size="lg"
          icon={Trophy}
          iconPosition="start"
          onClick={() => {
            sfx("tap");
            dispatch({ type: "SHOW_LEADERBOARD" });
          }}
        >
          {COPY.recovery.viewLeaderboard}
        </PrimaryButton>
        <div className="flex flex-wrap gap-4">
          <PrimaryButton size="md" variant="outline" icon={Info} iconPosition="start" onClick={() => dispatch({ type: "OPEN_LEARN_MORE" })}>
            {COPY.recovery.learnMore}
          </PrimaryButton>
          <PrimaryButton size="md" variant="outline" icon={RotateCcw} iconPosition="start" onClick={onRestart}>
            {COPY.recovery.playAgain}
          </PrimaryButton>
        </div>
      </div>

      <AnimatePresence>
        {popupOpen && (
          <CompletionPopup
            unlocked={state.unlockedPieces}
            playerName={state.playerName}
            timeMs={state.activeMs}
            autoCloseMs={KIOSK.completionPopupMs}
            onClose={closePopup}
          />
        )}
      </AnimatePresence>
    </ScreenTransition>
  );
}

type SaveState =
  | { kind: "saving" }
  | { kind: "saved"; rank: number | null; demo: boolean }
  | { kind: "error"; message: string; retry: () => void };

/**
 * Saves the score once, as soon as the challenge is complete, using the name
 * entered at the start. A ref guards against double submission.
 */
function useAutoSave(): SaveState {
  const { state, dispatch } = useGame();
  const [save, setSave] = useState<SaveState>(
    state.submittedEntry ? { kind: "saved", rank: state.submittedRank, demo: false } : { kind: "saving" },
  );
  const inFlight = useRef(false);

  const submit = useCallback(async () => {
    if (inFlight.current || state.submittedEntry || !state.playerName || !state.pathway) return;
    inFlight.current = true;
    setSave({ kind: "saving" });
    try {
      const result = await submitScore({
        displayName: state.playerName,
        pathway: state.pathway,
        completionMs: Math.round(state.activeMs),
        piecesUnlocked: state.unlockedPieces.length,
        wrongAttempts: state.wrongAttempts,
      });
      dispatch({ type: "SUBMITTED", entry: result.entry, rank: result.rank });
      setSave({ kind: "saved", rank: result.rank, demo: result.mode === "demo" });
    } catch (e) {
      inFlight.current = false;
      setSave({
        kind: "error",
        message: e instanceof LeaderboardError ? e.message : "Please check the connection and try again.",
        retry: () => void submit(),
      });
    }
  }, [dispatch, state.activeMs, state.pathway, state.playerName, state.submittedEntry, state.unlockedPieces.length, state.wrongAttempts]);

  useEffect(() => {
    void submit();
    // Run once on mount; retries are user-initiated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return save;
}

function SaveStatus({ save }: { save: SaveState }) {
  if (save.kind === "saving") {
    return (
      <p className="flex items-center gap-3 text-label text-navy/70" aria-live="polite">
        <LoaderCircle size="1.75rem" className="animate-spin text-red motion-reduce:animate-none" aria-hidden />
        {COPY.recovery.saving}
      </p>
    );
  }
  if (save.kind === "saved") {
    return (
      <p className="flex items-center gap-3 text-label text-navy" aria-live="polite">
        <Check size="1.75rem" strokeWidth={3} className="text-red" aria-hidden />
        {COPY.recovery.saved}
        {save.rank !== null && <span className="font-bold text-red">Rank {save.rank}</span>}
        {save.demo && <span className="text-navy/50">(this device only)</span>}
      </p>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-4" role="alert">
      <p className="flex items-center gap-3 text-label text-navy">
        <TriangleAlert size="1.75rem" className="text-red" aria-hidden />
        {COPY.recovery.saveFailed} {save.message}
      </p>
      <PrimaryButton size="md" variant="outline" icon={RefreshCw} iconPosition="start" onClick={save.retry}>
        Retry
      </PrimaryButton>
    </div>
  );
}

/** Right-hand reveal: the assembled puzzle. */
export function ScientificReveal({ unlocked }: { unlocked: number[] }) {
  return (
    <div className="flex w-full flex-col gap-5">
      <p className="text-center text-label font-bold uppercase tracking-[0.12em] text-red">{COPY.recovery.scientificReveal}</p>
      <PuzzleBoard unlocked={unlocked} assembled />
    </div>
  );
}
