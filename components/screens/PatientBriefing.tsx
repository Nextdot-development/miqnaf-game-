"use client";

import { AnimatePresence } from "framer-motion";
import { ChevronRight, ClipboardList } from "lucide-react";
import { useState } from "react";
import { caseNumber } from "@/data/cases";
import { COPY } from "@/data/copy";
import { useGame } from "@/hooks/useGame";
import { sessionCase } from "@/lib/gameMachine";
import { ClueCards } from "../ClueCards";
import { GamePopup } from "../GamePopup";
import { PrimaryButton } from "../PrimaryButton";
import { ScreenTransition } from "../ScreenTransition";

/** The case clues open as a popup; the challenge starts from there (or from the page if it is dismissed). */
export function PatientBriefing() {
  const { state, dispatch, sfx } = useGame();
  const [popupOpen, setPopupOpen] = useState(true);
  const clinicalCase = sessionCase(state);
  const caseLabel = `${state.pathway} Case ${caseNumber(state.pathway, state.caseId)}`;

  const begin = () => {
    sfx("tap");
    dispatch({ type: "BEGIN_CHALLENGE" });
  };

  return (
    <ScreenTransition className="flex flex-col gap-10">
      <div>
        <span className="text-label font-bold uppercase tracking-[0.08em] text-red">{caseLabel}</span>
        <p className="mt-2 text-body font-bold text-navy">{clinicalCase.title}</p>
        <h1 className="font-display mt-3 text-[4rem] font-extrabold uppercase leading-[0.92] wide:text-title">
          Your patient.
          <br />
          <span className="text-red">Your decision.</span>
        </h1>
        <p className="mt-6 text-body text-navy/70">{COPY.briefing.prompt}</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <PrimaryButton size="lg" icon={ChevronRight} onClick={begin}>
          {COPY.briefing.button}
        </PrimaryButton>
        <PrimaryButton
          size="lg"
          variant="outline"
          icon={ClipboardList}
          iconPosition="start"
          onClick={() => {
            sfx("tap");
            setPopupOpen(true);
          }}
        >
          {COPY.briefing.reviewAgain}
        </PrimaryButton>
      </div>

      <AnimatePresence>
        {popupOpen && (
          <GamePopup
            icon={ClipboardList}
            kicker={COPY.briefing.popupKicker}
            title={COPY.briefing.popupTitle}
            onDismiss={() => setPopupOpen(false)}
            lightBackdrop
            size="xl"
            actions={
              <PrimaryButton size="lg" icon={ChevronRight} data-autofocus onClick={begin}>
                {COPY.briefing.button}
              </PrimaryButton>
            }
          >
            <p className="font-bold">
              {caseLabel}: {clinicalCase.title}
            </p>
            <p className="mt-2">{COPY.briefing.prompt}</p>
            <div className="mt-8 text-left">
              <ClueCards clues={clinicalCase.clues} />
            </div>
          </GamePopup>
        )}
      </AnimatePresence>
    </ScreenTransition>
  );
}
