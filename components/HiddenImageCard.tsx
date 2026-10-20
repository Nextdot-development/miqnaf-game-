"use client";

import { PUZZLE_PIECE_COUNT } from "@/data/cases";
import { PuzzleBoard } from "./PuzzleBoard";

/** "Hidden image" card under the patient: the MIQNAF logo revealed one piece per correct answer. */
export function HiddenImageCard({ unlocked, fresh }: { unlocked: number[]; fresh: number | null }) {
  return (
    <section
      aria-label="Hidden image puzzle"
      className="flex w-full flex-col gap-3 rounded-[1.5rem] bg-white px-5 pb-5 pt-4 ring-4 ring-navy wide:gap-4 wide:px-6"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-display text-[2rem] font-extrabold uppercase leading-none tracking-[0.05em] text-navy">
          Hidden image
        </span>
        <span className="rounded-lg bg-gold px-3 py-1.5 font-display text-label font-bold uppercase leading-none text-navy">
          {unlocked.length} of {PUZZLE_PIECE_COUNT} pieces
        </span>
      </div>
      <PuzzleBoard unlocked={unlocked} fresh={fresh} />
    </section>
  );
}
