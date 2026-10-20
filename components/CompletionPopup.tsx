"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { COPY } from "@/data/copy";
import { formatTime } from "@/lib/visualStage";
import { Modal } from "./Modal";
import { PrimaryButton } from "./PrimaryButton";
import { PuzzleBoard } from "./PuzzleBoard";

const CONFETTI_COLORS = ["#28397F", "#9A1F24", "#E7A900"]; // navy, crimson and gold
const CONFETTI_COUNT = 32;

/** Deterministic burst pattern (no randomness during render). */
const CONFETTI = Array.from({ length: CONFETTI_COUNT }, (_, i) => {
  const angle = (i / CONFETTI_COUNT) * Math.PI * 2 + (i % 3) * 0.17;
  const distance = 16 + ((i * 7) % 11) * 1.6; // rem
  return {
    x: `${(Math.cos(angle) * distance * 1.6).toFixed(2)}rem`,
    y: `${(Math.sin(angle) * distance - 4).toFixed(2)}rem`,
    rotate: ((i * 47) % 360) - 180,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: 1.55 + (i % 5) * 0.03,
    wide: i % 2 === 0,
  };
});

interface CompletionPopupProps {
  unlocked: number[];
  playerName: string | null;
  timeMs: number;
  autoCloseMs: number;
  onClose: () => void;
}

/**
 * Completion celebration: the pieces assemble into the MIQNAF logo at the top, the logo pops
 * with a confetti burst, the headline sits below it, then the player continues to the results.
 */
export function CompletionPopup({ unlocked, playerName, timeMs, autoCloseMs, onClose }: CompletionPopupProps) {
  const titleId = useId();
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const timer = window.setTimeout(() => onCloseRef.current(), autoCloseMs);
    return () => window.clearTimeout(timer);
  }, [autoCloseMs]);

  return (
    <Modal labelledBy={titleId} onClose={onClose} pop ringClassName="ring-4 ring-navy" panelClassName="max-w-[72rem] overflow-hidden px-8 pb-10 pt-10 text-center wide:px-14">
      {/* The pieces assemble into the MIQNAF logo first, then the headline appears below it. */}
      <motion.div
        className="relative mx-auto max-w-[56rem]"
        initial={false}
        animate={{ scale: [1, 1, 1.06, 1] }}
        transition={{ duration: 0.7, delay: 1.5, times: [0, 0.01, 0.5, 1] }}
      >
        <PuzzleBoard unlocked={unlocked} assembled staggerIn />
        {/* Confetti burst from the logo, drawn above the content */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10" aria-hidden>
          {CONFETTI.map((c, i) => (
            <motion.span
              key={i}
              className="absolute block rounded-sm"
              style={{ backgroundColor: c.color, width: c.wide ? "1.1rem" : "0.6rem", height: c.wide ? "0.5rem" : "0.9rem" }}
              initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.4 }}
              animate={{ x: c.x, y: c.y, opacity: [0, 1, 1, 0], rotate: c.rotate, scale: 1 }}
              transition={{ delay: c.delay, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </div>
      </motion.div>

      <p className="mt-8 text-label font-bold uppercase tracking-[0.12em] text-red">{COPY.completion.kicker}</p>
      <h2 id={titleId} className="font-display mt-2 text-popup font-extrabold uppercase leading-none">
        {COPY.completion.title}
      </h2>

      <motion.p
        className="mt-8 text-body text-navy/80"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.9 }}
      >
        {playerName ? `Well done, ${playerName}. ` : "Well done, Doctor. "}
        Your time: <span className="font-bold text-red">{formatTime(timeMs)}</span>
      </motion.p>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }} className="mt-8 flex justify-center">
        <PrimaryButton size="lg" icon={ChevronRight} data-autofocus onClick={onClose} className="overflow-hidden">
          {COPY.completion.button}
          <motion.span
            className="absolute bottom-0 left-0 h-1.5 bg-navy"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: autoCloseMs / 1000, ease: "linear" }}
            aria-hidden
          />
        </PrimaryButton>
      </motion.div>
    </Modal>
  );
}
