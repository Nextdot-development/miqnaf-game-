"use client";

import { ChevronRight, Siren } from "lucide-react";
import { useEffect } from "react";
import { COPY } from "@/data/copy";
import { useGame } from "@/hooks/useGame";
import { GamePopup } from "../GamePopup";
import { PrimaryButton } from "../PrimaryButton";

/** Deterioration alert, shown as an alarm popup over the distressed patient. */
export function EmergencyAlert() {
  const { dispatch, sfx, voiceOver } = useGame();

  useEffect(() => {
    sfx("incorrect");
    voiceOver("deterioration");
  }, [sfx, voiceOver]);

  return (
    <GamePopup
      icon={Siren}
      tone="alert"
      kicker={COPY.deterioration.kicker}
      title={COPY.deterioration.alert}
      lightBackdrop
      size="lg"
      actions={
        <PrimaryButton
          size="xl"
          icon={ChevronRight}
          data-autofocus
          onClick={() => {
            sfx("tap");
            dispatch({ type: "READY", now: Date.now() });
          }}
        >
          {COPY.deterioration.button}
        </PrimaryButton>
      }
    >
      <p className="font-bold text-red">{COPY.deterioration.lead}</p>
      <p className="mt-3">{COPY.deterioration.instruction}</p>
    </GamePopup>
  );
}
