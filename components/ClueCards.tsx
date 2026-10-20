"use client";

import { motion } from "framer-motion";
import { Activity, FlaskConical, Hospital, Pill, ScanLine, Stethoscope, User, Wind, type LucideIcon } from "lucide-react";
import type { CaseClue, ClueIcon } from "@/types/game";

const ICONS: Record<ClueIcon, LucideIcon> = {
  profile: User,
  symptoms: Wind,
  xray: ScanLine,
  lab: FlaskConical,
  vitals: Activity,
  exam: Stethoscope,
  treatment: Pill,
  setting: Hospital,
};

/** White case-note cards with navy text and crimson labels. */
const NOTE = { paper: "bg-white text-navy", label: "text-red", icon: "text-navy" };

/** The case clues, as case-note cards. An odd last card spans the full row. */
export function ClueCards({ clues, animate = true }: { clues: CaseClue[]; animate?: boolean }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {clues.map((clue, i) => {
        const Icon = ICONS[clue.icon];
        return (
          <motion.li
            key={clue.id}
            initial={animate ? { opacity: 0, y: -24 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 16, delay: animate ? 0.1 + i * 0.09 : 0 }}
            className={`relative flex gap-5 rounded-md px-6 py-5 ring-1 ring-navy/10 ${NOTE.paper} ${
              clues.length % 2 === 1 && i === clues.length - 1 ? "sm:col-span-2" : ""
            }`}
          >
            <Icon size="2.25rem" strokeWidth={2} className={`mt-0.5 shrink-0 ${NOTE.icon}`} aria-hidden />
            <div className="flex flex-col gap-1.5">
              <span className={`text-label font-bold uppercase tracking-[0.08em] ${NOTE.label}`}>{clue.label}</span>
              <span className="text-body font-bold leading-snug">{clue.value}</span>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
