"use client";

import { motion } from "framer-motion";

/** "Question N of M" with one progress segment per question. */
export function QuestionProgress({ index, total, completed }: { index: number; total: number; completed: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <span className="text-label font-bold uppercase tracking-[0.08em] text-red">
        Question {index + 1} of {total}
      </span>
      <div
        className="flex gap-2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completed}
        aria-label="Questions completed"
      >
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className="relative h-2 w-[3.5rem] overflow-hidden rounded-full bg-navy/15">
            <motion.span
              className="absolute inset-y-0 left-0 rounded-full bg-navy"
              initial={false}
              animate={{ width: i < completed ? "100%" : "0%" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
