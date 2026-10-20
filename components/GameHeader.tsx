"use client";

import { motion } from "framer-motion";
import { Pause, RotateCcw, Timer, Trophy, Volume2, VolumeX } from "lucide-react";
import { COPY } from "@/data/copy";
import { formatTime } from "@/lib/visualStage";
import { MiqnafWordmark } from "./MiqnafWordmark";

interface GameHeaderProps {
  soundOn: boolean;
  onToggleSound: () => void;
  timerMs: number | null;
  timerPaused: boolean;
  onLeaderboard?: () => void;
  onRestart?: () => void;
}

const ICON = "2rem";

function HeaderButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-label={label}
      className="flex h-16 min-w-16 items-center justify-center gap-3 rounded-xl px-3 text-label font-bold uppercase tracking-wide text-white/90 transition-colors hover:bg-white/10"
    >
      {children}
    </motion.button>
  );
}

/** Common top header bar shown on every screen: MIQNAF logo and the game title. */
export function GameHeader({ soundOn, onToggleSound, timerMs, timerPaused, onLeaderboard, onRestart }: GameHeaderProps) {
  return (
    <header className="sticky top-0 z-40 relative flex min-h-21 shrink-0 items-center justify-between gap-4 bg-navy px-6 wide:px-12">
      <div className="flex items-center gap-x-5">
        <MiqnafWordmark height={2.6} />
        <span className="hidden h-[2.2rem] w-px bg-white/30 sm:block" aria-hidden />
        <p className="font-display text-[1.9rem] font-bold uppercase leading-none text-white wide:text-[2.3rem]">{COPY.header}</p>
      </div>

      <div className="flex items-center gap-1">
        {timerMs !== null && (
          <div
            role="timer"
            aria-label={`Challenge time ${formatTime(timerMs)}${timerPaused ? ", paused" : ""}`}
            className="mr-2 flex items-center gap-2 text-white"
          >
            {timerPaused ? <Pause size="1.7rem" aria-hidden /> : <Timer size="1.7rem" aria-hidden />}
            <span className="font-display text-[2.3rem] font-bold tabular-nums leading-none">{formatTime(timerMs)}</span>
          </div>
        )}
        {onLeaderboard && (
          <HeaderButton label="View leaderboard" onClick={onLeaderboard}>
            <Trophy size={ICON} aria-hidden />
            <span className="hidden sm:inline">Leaderboard</span>
          </HeaderButton>
        )}
        {onRestart && (
          <HeaderButton label="Restart the challenge" onClick={onRestart}>
            <RotateCcw size={ICON} aria-hidden />
          </HeaderButton>
        )}
        <HeaderButton label={soundOn ? "Mute sound" : "Turn sound on"} onClick={onToggleSound}>
          {soundOn ? <Volume2 size={ICON} aria-hidden /> : <VolumeX size={ICON} aria-hidden />}
        </HeaderButton>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gold" aria-hidden />
    </header>
  );
}
