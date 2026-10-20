"use client";

import { motion } from "framer-motion";
import { CircleCheckBig, CircleX, ClipboardList, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import { PUZZLE_PIECE_COUNT } from "@/data/cases";
import { COPY } from "@/data/copy";
import type { ClinicalQuestion } from "@/types/game";
import { PrimaryButton } from "../PrimaryButton";

interface CorrectProps {
  question: ClinicalQuestion;
  /** Letter the correct option was shown under in this session. */
  correctLetter: string;
  piecesUnlocked: number;
  autoAdvanceMs: number;
  onContinue: () => void;
}

/** White panel highlighted in green: approved confirmation and rationale, then advances automatically (no button). */
export function CorrectFeedback({ question, correctLetter, piecesUnlocked, autoAdvanceMs, onContinue }: CorrectProps) {
  const onContinueRef = useRef(onContinue);

  useEffect(() => {
    onContinueRef.current = onContinue;
  }, [onContinue]);

  useEffect(() => {
    const timer = window.setTimeout(() => onContinueRef.current(), autoAdvanceMs);
    return () => window.clearTimeout(timer);
  }, [autoAdvanceMs]);

  const correct = question.options.find((o) => o.key === question.correctOption);

  return (
    <FeedbackShell tone="correct">
      <div className="flex items-start gap-5">
        <PopIcon>
          <CircleCheckBig size="3.5rem" strokeWidth={2.2} className="text-green" aria-hidden />
        </PopIcon>
        <div className="flex flex-col gap-2">
          <p className="font-display text-[2.75rem] font-bold leading-tight text-green">{COPY.question.correct}</p>
          <p className="text-label font-bold uppercase tracking-[0.08em] text-green">
            Piece {piecesUnlocked} of {PUZZLE_PIECE_COUNT} unlocked
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-label font-bold text-navy">
          Correct answer: {correctLetter}. {correct?.text}
        </p>
        {question.explanation && <p className="mt-2 text-body leading-snug text-navy/80">{question.explanation}</p>}
      </div>

      <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-green/15" aria-hidden>
        <motion.div
          className="h-full rounded-full bg-green"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: autoAdvanceMs / 1000, ease: "linear" }}
        />
      </div>
    </FeedbackShell>
  );
}

interface IncorrectProps {
  onRetry: () => void;
  onReviewClues: () => void;
}

/** Red panel: approved retry message. The piece stays locked; the participant is never locked out. */
export function IncorrectFeedback({ onRetry, onReviewClues }: IncorrectProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <FeedbackShell tone="incorrect">
      <div className="flex items-start gap-5">
        <PopIcon>
          <CircleX size="3.5rem" strokeWidth={2.2} className="text-red" aria-hidden />
        </PopIcon>
        <div className="flex flex-col gap-2">
          <p className="font-display text-[2.75rem] font-bold leading-tight">{COPY.question.incorrect}</p>
          <p className="text-label font-bold uppercase tracking-[0.08em] text-red">The puzzle piece stays locked</p>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap gap-4">
        <PrimaryButton ref={buttonRef} size="lg" icon={RotateCcw} iconPosition="start" onClick={onRetry}>
          {COPY.question.tryAgain}
        </PrimaryButton>
        <PrimaryButton size="lg" variant="outline" icon={ClipboardList} iconPosition="start" onClick={onReviewClues}>
          {COPY.question.reviewClues}
        </PrimaryButton>
      </div>
    </FeedbackShell>
  );
}

/** Bottom sheet: pinned to the viewport on stacked layouts, to the question column on the kiosk layout. */
function FeedbackShell({ tone, children }: { tone: "correct" | "incorrect"; children: React.ReactNode }) {
  return (
    <motion.div
      role="alertdialog"
      aria-live="assertive"
      initial={{ y: 60, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 20, opacity: 0, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 340, damping: 24 }}
      className={[
        "fixed inset-x-0 bottom-0 z-30 rounded-t-3xl p-8 ring-4",
        "wide:absolute wide:inset-x-14 wide:bottom-10 wide:rounded-3xl",
        tone === "correct" ? "bg-white text-navy ring-green" : "bg-white text-navy ring-red",
      ].join(" ")}
    >
      {children}
    </motion.div>
  );
}

function PopIcon({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      className="shrink-0"
      initial={{ scale: 0, rotate: -25 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 13, delay: 0.08 }}
    >
      {children}
    </motion.span>
  );
}
