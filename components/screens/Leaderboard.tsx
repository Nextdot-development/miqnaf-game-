"use client";

import { motion } from "framer-motion";
import { Info, RefreshCw, RotateCcw, TriangleAlert, Trophy } from "lucide-react";
import { KIOSK } from "@/data/brand";
import { PUZZLE_PIECE_COUNT } from "@/data/cases";
import { COPY } from "@/data/copy";
import { useGame } from "@/hooks/useGame";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { formatTime } from "@/lib/visualStage";
import type { LeaderboardEntry } from "@/types/leaderboard";
import { PrimaryButton } from "../PrimaryButton";
import { PuzzleBoard } from "../PuzzleBoard";
import { ScreenTransition } from "../ScreenTransition";
import { SimulationCard } from "../SimulationCard";

/** Leaderboard palette: deep ink headings, soft gold pills, white rows. */
const INK = "text-[#121a3a]";
const GOLD_PILL = "rounded-full bg-[#fbefc4] text-[#7a5a00]";
/** Rank badges: gold, silver, bronze, then a light navy tint. */
const MEDALS = ["bg-gold text-[#121a3a]", "bg-[#c9d0dd] text-navy", "bg-[#c98a52] text-white"];
/** Shared column template so the header lines up with the rows. */
const COLUMNS = "grid grid-cols-[4.5rem_minmax(0,1fr)_9rem] items-center gap-x-6 sm:grid-cols-[4.5rem_minmax(0,1fr)_7rem_7rem_9rem]";
const ALL_PIECES = Array.from({ length: PUZZLE_PIECE_COUNT }, (_, i) => i);

export function Leaderboard({ onRestart }: { onRestart: () => void }) {
  const { state: game, dispatch } = useGame();
  const { state, retry } = useLeaderboard(KIOSK.leaderboardSize);
  const mine = game.submittedEntry;
  // The recovered patient and the logo reveal only appear once this player has finished.
  const completed = game.unlockedPieces.length >= PUZZLE_PIECE_COUNT;

  return (
    <ScreenTransition className={`flex flex-1 flex-col gap-10 wide:min-h-0 ${completed ? "wide:grid wide:grid-cols-[minmax(0,1fr)_40%] wide:grid-rows-[minmax(0,1fr)] wide:gap-12" : ""}`}>
      <div className="flex min-h-0 flex-col gap-6 wide:gap-4">
        <div>
          <span className={`font-display inline-flex px-5 py-2 text-label font-bold uppercase tracking-[0.12em] ${GOLD_PILL}`}>
            {COPY.leaderboard.heading}
          </span>
          <h1 className={`font-display mt-4 text-[4rem] wide:mt-2 font-extrabold uppercase leading-none wide:text-title ${INK}`}>
            {COPY.leaderboard.headingAccent}
          </h1>
          <p className="mt-2 text-body text-navy/80">{COPY.leaderboard.sub}</p>
        </div>

        <div className="flex-1 wide:min-h-0 wide:overflow-y-auto" aria-live="polite" aria-busy={state.status === "loading"}>
          {state.status === "loading" && (
            <div className="flex flex-col gap-2.5" aria-label="Loading leaderboard">
              {Array.from({ length: KIOSK.leaderboardSize }, (_, i) => (
                <div key={i} className="h-[5.25rem] wide:h-[3.5rem] animate-pulse rounded-2xl bg-white/70 motion-reduce:animate-none" />
              ))}
            </div>
          )}

          {state.status === "error" && (
            <div className="flex h-full flex-col items-center justify-center gap-5 py-12 text-center" role="alert">
              <TriangleAlert size="4.5rem" className="text-red" aria-hidden />
              <p className="text-[2rem] font-bold">{COPY.leaderboard.error}</p>
              <p className="text-body text-navy/60">{state.message}</p>
              <PrimaryButton size="md" icon={RefreshCw} iconPosition="start" onClick={retry}>
                Retry
              </PrimaryButton>
            </div>
          )}

          {state.status === "ready" && (
            <Rows entries={state.snapshot.entries.slice(0, KIOSK.leaderboardSize)} mine={mine} myRank={game.submittedRank} />
          )}
        </div>

        <div className="flex flex-col gap-4 wide:gap-3">
          {state.status === "ready" && state.snapshot.mode === "demo" && (
            <p className="flex items-center gap-2 text-label text-navy/60">
              <Info size="1.5rem" className="shrink-0" aria-hidden />
              {COPY.leaderboard.demoBadge}
            </p>
          )}
          <div className="grid grid-cols-2 gap-5">
            <PrimaryButton size="lg" variant="outline" icon={Info} iconPosition="start" onClick={() => dispatch({ type: "OPEN_LEARN_MORE" })}>
              Learn more
            </PrimaryButton>
            <PrimaryButton size="lg" icon={RotateCcw} iconPosition="start" onClick={onRestart}>
              Play again
            </PrimaryButton>
          </div>
          <p className="text-label font-medium text-navy/70">{COPY.leaderboard.disclaimer}</p>
        </div>
      </div>

      {completed && (
        <aside className="flex min-h-0 flex-col gap-6">
          <SimulationCard tone="stable" className="flex-1" />

          <section className="rounded-[2rem] bg-white p-5 shadow-[0_0.5rem_2rem_rgb(40_57_127/0.08)] ring-1 ring-navy/5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-label font-bold uppercase tracking-[0.08em] text-navy/70">{COPY.recovery.scientificReveal}</span>
              <span className={`font-display px-4 py-1 text-label font-bold uppercase tracking-[0.08em] ${GOLD_PILL}`}>
                {PUZZLE_PIECE_COUNT} of {PUZZLE_PIECE_COUNT} pieces
              </span>
            </div>
            <PuzzleBoard unlocked={ALL_PIECES} assembled />
          </section>
        </aside>
      )}
    </ScreenTransition>
  );
}

function Rows({ entries, mine, myRank }: { entries: LeaderboardEntry[]; mine: LeaderboardEntry | null; myRank: number | null }) {
  if (entries.length === 0 && !mine) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 py-12 text-center">
        <Trophy size="4.5rem" strokeWidth={1.5} className="text-gold" aria-hidden />
        <p className="max-w-[48rem] text-[2rem] font-medium text-navy/80">{COPY.leaderboard.empty}</p>
      </div>
    );
  }
  const mineInTop = mine ? entries.some((e) => e.id === mine.id) : false;
  return (
    <div className="flex flex-col gap-2.5 wide:gap-2">
      {/* Column headings */}
      <div className={`${COLUMNS} font-display px-6 pb-1 text-label font-bold uppercase tracking-[0.1em] text-navy/70`} aria-hidden>
        <span>Rank</span>
        <span>Name</span>
        <span className="hidden sm:block">Case</span>
        <span className="hidden sm:block">Pieces</span>
        <span className="text-right">Time</span>
      </div>
      <ol className="flex flex-col gap-2.5 wide:gap-2">
        {entries.map((entry, i) => (
          <Row key={entry.id} entry={entry} rank={i + 1} index={i} isMine={entry.id === mine?.id} />
        ))}
        {mine && !mineInTop && (
          <>
            <li className="h-1" aria-hidden />
            <Row entry={mine} rank={myRank} index={entries.length} isMine />
          </>
        )}
      </ol>
    </div>
  );
}

function Row({ entry, rank, index, isMine }: { entry: LeaderboardEntry; rank: number | null; index: number; isMine: boolean }) {
  const medal = rank !== null && rank <= 3 ? MEDALS[rank - 1] : "bg-[#e6ebf6] text-navy";
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.06, duration: 0.35 }}
      className={[
        COLUMNS,
        "min-h-[5.25rem] rounded-2xl px-6 py-2 wide:min-h-[3.5rem] wide:py-0.5",
        isMine ? "bg-[#fff4d6] ring-2 ring-gold" : "bg-white ring-1 ring-[#dfe4ee]",
      ].join(" ")}
      aria-label={`Rank ${rank ?? "pending"}: ${entry.displayName}, ${entry.pathway} case, ${formatTime(entry.completionMs)}${isMine ? ", your score" : ""}`}
    >
      <span className={`font-display flex h-14 w-14 wide:h-11 wide:w-11 items-center justify-center rounded-full text-[1.9rem] font-bold ${medal}`}>
        {rank !== null ? rank : "?"}
      </span>
      <span className="flex min-w-0 items-center gap-4">
        <span className={`truncate text-[2rem] ${isMine ? "font-bold uppercase" : "font-medium"} ${INK}`}>{entry.displayName}</span>
        {isMine && (
          <span className="font-display shrink-0 rounded-md bg-gold px-2.5 py-0.5 text-tag font-bold uppercase tracking-[0.08em] text-[#121a3a]">
            You
          </span>
        )}
      </span>
      <span className={`hidden text-[1.9rem] font-medium sm:block ${INK}`}>{entry.pathway}</span>
      <span className={`hidden text-[1.9rem] font-medium tabular-nums sm:block ${INK}`}>
        {entry.piecesUnlocked}/{PUZZLE_PIECE_COUNT}
      </span>
      <span className={`font-display text-right text-[2.75rem] wide:text-[2.5rem] font-bold tabular-nums ${INK}`}>{formatTime(entry.completionMs)}</span>
    </motion.li>
  );
}
