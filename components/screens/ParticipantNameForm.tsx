"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowRight, ClipboardList, Gamepad2, ListChecks, Puzzle, ShieldCheck, Trophy } from "lucide-react";
import { useState } from "react";
import { COPY } from "@/data/copy";
import { useGame } from "@/hooks/useGame";
import { useMediaQuery, WIDE_QUERY } from "@/hooks/useMediaQuery";
import { NAME_MAX, normalizeName, validateName } from "@/lib/leaderboard/validate";
import { OnScreenKeyboard, type KeyboardKey } from "../entry/OnScreenKeyboard";
import { GamePopup } from "../GamePopup";
import { PrimaryButton } from "../PrimaryButton";
import { ScreenTransition } from "../ScreenTransition";
import { SimulationCard } from "../SimulationCard";

/** Capitalise the first letter of each word as names are typed on the touch keyboard. */
function applyCase(current: string, char: string): string {
  const prev = current.slice(-1);
  const startOfWord = current.length === 0 || [" ", ".", "-", "'"].includes(prev);
  return startOfWord ? char.toUpperCase() : char.toLowerCase();
}

/** First step of the game: the player's display name, saved with their time when they finish. */
export function ParticipantNameForm() {
  const { state, dispatch, sfx } = useGame();
  const kioskLayout = useMediaQuery(WIDE_QUERY);
  const [name, setName] = useState(state.playerName ?? "");
  const [error, setError] = useState<string | null>(null);
  const [howToPlayOpen, setHowToPlayOpen] = useState(true);

  const update = (next: string) => {
    setName(next.replace(/^\s+/, "").replace(/\s{2,}/g, " ").slice(0, NAME_MAX));
    setError(null);
  };

  const onKey = (key: KeyboardKey) => {
    sfx("tap");
    if (key === "BACKSPACE") update(name.slice(0, -1));
    else if (key === "CLEAR") update("");
    else if (key === "SPACE") update(name.endsWith(" ") || name.length === 0 ? name : `${name} `);
    else update(name + applyCase(name, key));
  };

  const handleSubmit = () => {
    const problem = validateName(name);
    if (problem) {
      setError(problem);
      sfx("incorrect");
      return;
    }
    sfx("tap");
    dispatch({ type: "SUBMIT_NAME", name: normalizeName(name) });
  };

  return (
    <ScreenTransition className="flex flex-1 flex-col gap-10 wide:grid wide:min-h-0 wide:grid-cols-[minmax(0,1fr)_40%] wide:grid-rows-[minmax(0,1fr)] wide:gap-12">
      <form
        className="flex min-h-0 flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <h1 className="text-label font-bold uppercase tracking-[0.08em] text-navy">{COPY.entry.heading}</h1>
          <p className="mt-1 text-[2rem] text-navy/75">{COPY.entry.lead}</p>
        </div>

        <div>
          <label htmlFor="display-name" className="sr-only">
            Your name
          </label>
          <input
            id="display-name"
            value={name}
            onChange={(e) => update(e.target.value)}
            inputMode={kioskLayout ? "none" : "text"}
            enterKeyHint="go"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="words"
            spellCheck={false}
            maxLength={NAME_MAX}
            placeholder="Your name"
            aria-invalid={error !== null}
            aria-describedby="name-help name-error"
            className={`font-display min-h-26 w-full rounded-2xl bg-white px-8 text-[3.5rem] font-bold uppercase tracking-[0.04em] text-[#121a3a] caret-red outline-none ring-[3px] shadow-[0_0_0_0.6rem_rgb(40_57_127/0.08)] placeholder:normal-case placeholder:font-medium placeholder:tracking-normal placeholder:text-navy/30 focus-visible:outline-none ${
              error ? "ring-red" : "ring-navy"
            }`}
          />
          {error && (
            <p id="name-error" role="alert" className="mt-3 text-label font-bold text-red">
              {error}
            </p>
          )}
          <p id="name-help" className="mt-3 flex items-center gap-3 text-label text-navy/70">
            <ShieldCheck size="1.75rem" className="shrink-0" aria-hidden />
            {COPY.entry.privacy}
          </p>
        </div>

        {kioskLayout && <OnScreenKeyboard onKey={onKey} />}

        <PrimaryButton type="submit" size="xl" icon={ArrowRight} className="mt-auto w-full">
          {COPY.entry.submit}
        </PrimaryButton>
      </form>

      {kioskLayout && <SimulationCard tone="critical" />}

      <AnimatePresence>
        {howToPlayOpen && (
          <HowToPlayPopup
            onClose={() => {
              sfx("tap");
              setHowToPlayOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </ScreenTransition>
  );
}

const STEP_ICONS = [ClipboardList, ListChecks, Puzzle, Trophy];
/** One logo colour per step. */
const STEP_STYLES = ["bg-white text-navy ring-2 ring-navy/10", "bg-white text-navy ring-2 ring-navy/10", "bg-white text-navy ring-2 ring-navy/10", "bg-white text-navy ring-2 ring-navy/10"];

/** Game-style instructions shown when the player starts. */
function HowToPlayPopup({ onClose }: { onClose: () => void }) {
  return (
    <GamePopup
      icon={Gamepad2}
      kicker={COPY.howToPlay.kicker}
      title={COPY.howToPlay.title}
      onDismiss={onClose}
      actions={
        <PrimaryButton size="lg" data-autofocus onClick={onClose}>
          {COPY.howToPlay.button}
        </PrimaryButton>
      }
    >
      <ol className="flex flex-col gap-4 text-left">
        {COPY.howToPlay.steps.map((step, i) => {
          const Icon = STEP_ICONS[i];
          return (
            <li key={step} className={`flex items-center gap-5 rounded-xl px-5 py-4 ${STEP_STYLES[i]}`}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy font-bold text-white">
                {i + 1}
              </span>
              <span className="flex-1 font-medium">{step}</span>
              <Icon size="2rem" className="shrink-0 text-red" aria-hidden />
            </li>
          );
        })}
      </ol>
    </GamePopup>
  );
}
