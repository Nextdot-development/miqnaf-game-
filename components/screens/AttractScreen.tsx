"use client";

import { motion, useAnimationControls } from "framer-motion";
import { BedDouble, Check, Play, Stethoscope, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { COPY } from "@/data/copy";
import { useGame } from "@/hooks/useGame";
import { nextTicket } from "@/lib/caseRotation";
import { createSessionPlan } from "@/lib/gameMachine";
import type { Pathway } from "@/types/game";
import { PrimaryButton } from "../PrimaryButton";
import { ScreenTransition } from "../ScreenTransition";

const CASE_OPTIONS: { pathway: Pathway; label: string; hint: string; icon: LucideIcon }[] = [
  { pathway: "OPD", label: COPY.attract.opd.label, hint: COPY.attract.opd.hint, icon: Stethoscope },
  { pathway: "IPD", label: COPY.attract.ipd.label, hint: COPY.attract.ipd.hint, icon: BedDouble },
];

export function AttractScreen() {
  const { state, dispatch, sfx, voiceOver } = useGame();
  const shake = useAnimationControls();
  const spokeIntro = useRef(false);
  const starting = useRef(false);

  const select = (pathway: Pathway) => {
    sfx("tap");
    dispatch({ type: "SELECT_PATHWAY", pathway });
    if (!spokeIntro.current) {
      spokeIntro.current = true;
      voiceOver("attract");
    }
  };

  const start = () => {
    if (!state.pathway) {
      void shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.4 } });
      return;
    }
    if (starting.current) return;
    starting.current = true;
    sfx("tap");
    const pathway = state.pathway;
    void nextTicket(pathway)
      .then((ticket) => dispatch({ type: "START", ...createSessionPlan(pathway, ticket) }))
      .finally(() => {
        starting.current = false;
      });
  };

  return (
    <ScreenTransition className="flex flex-col gap-12 wide:max-w-[56rem]">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 30, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 16 }}
          className="font-display text-[4.75rem] font-extrabold uppercase leading-[0.92] wide:text-hero"
        >
          Can you save
          <br />
          <span className="text-red">this patient?</span>
        </motion.h1>
        <p className="mt-6 text-[2rem] text-navy/70 wide:text-lead">{COPY.attract.subheadline}</p>
      </div>

      <div>
        <p
          id="case-choice-label"
          className={`mb-4 text-label font-bold uppercase tracking-[0.08em] ${state.pathway ? "text-navy/60" : "text-red"}`}
        >
          {state.pathway ? COPY.attract.choosePrompt : COPY.attract.selectFirst}
        </p>
        <motion.div animate={shake} role="radiogroup" aria-labelledby="case-choice-label" className="grid grid-cols-2 gap-4">
          {CASE_OPTIONS.map(({ pathway, label, hint, icon: Icon }) => {
            const selected = state.pathway === pathway;
            return (
              <motion.button
                key={pathway}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => select(pathway)}
                className={[
                  "relative flex min-h-[8.5rem] items-center gap-5 rounded-2xl px-6 py-5 text-left ring-2 transition-[background-color,box-shadow,transform] duration-100 active:translate-y-[0.15rem]",
                  selected
                    ? "bg-navy text-white ring-gold"
                    : "bg-white text-navy ring-navy/15",
                ].join(" ")}
              >
                <Icon size="3rem" strokeWidth={2} className="shrink-0" aria-hidden />
                <span className="flex min-w-0 flex-col">
                  <span className="font-display text-[2.6rem] font-bold leading-none">{label}</span>
                  <span className="mt-2 text-label opacity-70">{hint}</span>
                </span>
                {selected && (
                  <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-navy" aria-hidden>
                    <Check size="1.25rem" strokeWidth={3.5} />
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <PrimaryButton
        size="xl"
        icon={Play}
        onClick={start}
        aria-disabled={state.pathway === null}
        className={`w-full ${state.pathway === null ? "opacity-50" : ""}`}
      >
        {COPY.attract.start}
      </PrimaryButton>
    </ScreenTransition>
  );
}
