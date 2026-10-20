"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { AnswerOption as AnswerOptionData } from "@/types/game";

export type OptionStatus = "idle" | "correct" | "incorrect" | "eliminated";

interface AnswerOptionProps {
  option: AnswerOptionData;
  /** Letter shown for this option's display position (A to D). */
  letter: string;
  status: OptionStatus;
  disabled: boolean;
  onSelect: () => void;
}

/** Answer bars: navy with a gold letter badge; solid fills, no shadows; they nudge down when pressed. */
const STATUS_STYLES: Record<OptionStatus, string> = {
  idle: "bg-navy text-white ring-navy active:translate-y-[0.15rem]",
  correct: "bg-green/10 text-navy ring-green",
  incorrect: "bg-white text-red ring-red",
  eliminated: "bg-navy/10 text-navy/60 ring-transparent",
};

const STATUS_LABEL: Record<OptionStatus, string | null> = {
  idle: null,
  correct: "Correct",
  incorrect: "Incorrect",
  eliminated: "Tried",
};

export function AnswerOption({ option, letter, status, disabled, onSelect }: AnswerOptionProps) {
  const label = STATUS_LABEL[status];
  return (
    <motion.button
      type="button"
      animate={status === "incorrect" ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      disabled={disabled}
      onClick={onSelect}
      aria-label={`Option ${letter}: ${option.text}${label ? `, ${label}` : ""}`}
      className={[
        "flex min-h-[6.25rem] w-full items-center gap-5 rounded-2xl px-5 py-3 text-left ring-2 transition-[background-color,transform,box-shadow] duration-100",
        STATUS_STYLES[status],
      ].join(" ")}
    >
      <span
        className={[
          "flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center rounded-full text-[1.9rem] font-bold",
          status === "correct"
            ? "bg-green text-white"
            : status === "incorrect"
              ? "bg-red text-white"
              : status === "eliminated"
                ? "bg-navy/15 text-navy/60"
                : "bg-gold text-navy",
        ].join(" ")}
        aria-hidden
      >
        {status === "correct" ? (
          <Check size="2.1rem" strokeWidth={3.5} />
        ) : status === "incorrect" || status === "eliminated" ? (
          <X size="2.1rem" strokeWidth={3.5} />
        ) : (
          letter
        )}
      </span>
      <span className="flex-1 text-[1.85rem] font-medium leading-tight">{option.text}</span>
      {label && <span className="shrink-0 text-tag font-bold uppercase tracking-[0.08em] opacity-80">{label}</span>}
    </motion.button>
  );
}
