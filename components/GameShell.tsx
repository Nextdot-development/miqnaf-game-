"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { KIOSK } from "@/data/brand";
import { useGame } from "@/hooks/useGame";
import { useIdleReset } from "@/hooks/useIdleReset";
import { useNow } from "@/hooks/useNow";
import { elapsedMs } from "@/lib/gameMachine";
import { visualStageFor } from "@/lib/visualStage";
import type { GameScreen } from "@/types/game";
import { GameHeader } from "./GameHeader";
import { HiddenImageCard } from "./HiddenImageCard";
import { LearnMoreModal } from "./LearnMoreModal";
import { Modal } from "./Modal";
import { PrimaryButton } from "./PrimaryButton";
import { AttractScreen } from "./screens/AttractScreen";
import { EmergencyAlert } from "./screens/EmergencyAlert";
import { Leaderboard } from "./screens/Leaderboard";
import { ParticipantNameForm } from "./screens/ParticipantNameForm";
import { PatientBriefing } from "./screens/PatientBriefing";
import { QuestionPanel } from "./screens/QuestionPanel";
import { RecoveryScreen, ScientificReveal } from "./screens/RecoveryScreen";
import { PatientScene } from "./PatientScene";

/** Height of the patient scene per screen (stacked layout, then kiosk layout). Null hides the visual column. */
const SCENE_HEIGHT: Record<GameScreen, string | null> = {
  attract: "h-[22rem] sm:h-[28rem] wide:h-[50rem]",
  briefing: "h-[16rem] sm:h-[22rem] wide:h-[32rem]",
  deterioration: "h-[16rem] sm:h-[22rem] wide:h-[32rem]",
  question: "h-[16rem] sm:h-[22rem] wide:h-[32rem]",
  recovery: "h-[14rem] sm:h-[20rem] wide:h-[30rem]",
  "participant-entry": null,
  leaderboard: null,
};

/** Screens that show the hidden-image puzzle under the patient while it is being unlocked. */
const SHOWS_PUZZLE: GameScreen[] = ["briefing", "deterioration", "question"];

/** Screens where an accidental tap on "restart" would lose progress. */
const CONFIRM_RESTART: GameScreen[] = ["briefing", "deterioration", "question", "recovery"];

export function GameShell() {
  const { state, dispatch, soundOn, toggleSound } = useGame();
  const [recoveryRevealed, setRecoveryRevealed] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);

  useEffect(() => {
    setRecoveryRevealed(false);
    setConfirmRestart(false);
  }, [state.sessionId]);

  // Each screen starts at the top on stacked (scrolling) layouts.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [state.screen]);

  const reset = useCallback(() => {
    setConfirmRestart(false);
    dispatch({ type: "RESET" });
  }, [dispatch]);

  const requestRestart = useCallback(() => {
    if (CONFIRM_RESTART.includes(state.screen)) setConfirmRestart(true);
    else reset();
  }, [state.screen, reset]);

  const markRevealed = useCallback(() => setRecoveryRevealed(true), []);

  const idleTimeout = state.screen === "participant-entry" ? KIOSK.idleTimeoutEntryMs : KIOSK.idleTimeoutMs;
  const { secondsLeft, markActive } = useIdleReset(state.screen !== "attract", idleTimeout, KIOSK.idleWarningMs, reset);

  const timerRunning = state.screen === "question" && state.segmentStartedAt !== null;
  const now = useNow(timerRunning);
  const showTimer = state.screen === "question" || state.screen === "recovery";

  const { tone } = visualStageFor(state.screen, state.unlockedPieces.length);
  const sceneHeight = SCENE_HEIGHT[state.screen];

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-dvh flex-col wide:h-dvh">
        <GameHeader
          soundOn={soundOn}
          onToggleSound={toggleSound}
          timerMs={showTimer ? Math.max(state.activeMs, elapsedMs(state, now)) : null}
          timerPaused={showTimer && !timerRunning}
          onLeaderboard={state.screen === "attract" ? () => dispatch({ type: "SHOW_LEADERBOARD" }) : undefined}
          onRestart={state.screen !== "attract" ? requestRestart : undefined}
        />

        <main
          className={`flex flex-1 flex-col wide:min-h-0 wide:flex-row ${
            // Soft blue-grey page, tinted at the top by the patient's state: mint once stable, rose while critical
            state.screen === "leaderboard"
              ? "bg-[#eef2f8] bg-[linear-gradient(180deg,#e6f3ef_0%,#eef2f8_35%)]"
              : state.screen === "participant-entry"
                ? "bg-[#eef2f8] bg-[linear-gradient(180deg,#f6e6ea_0%,#eef2f8_40%)]"
                : ""
          }`}
        >
          {sceneHeight && (
            <aside
              className="flex flex-col items-center justify-center gap-6 px-6 pt-6 wide:order-2 wide:w-[44%] wide:shrink-0 wide:gap-8 wide:py-10 wide:pl-4 wide:pr-14"
            >
              <AnimatePresence mode="wait">
                {state.screen === "recovery" && (
                  <motion.div key="reveal" className="w-full max-w-[44rem] wide:max-w-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ScientificReveal unlocked={state.unlockedPieces} />
                  </motion.div>
                )}
              </AnimatePresence>
              {/* The patient scene is framed as the game screen: a white panel with a navy outline */}
              <div
                className={`w-full rounded-[2rem] bg-white p-[1.5%] ring-4 ring-navy transition-[height] duration-700 ease-out ${sceneHeight}`}
              >
                <PatientScene tone={tone} className="h-full w-full" />
              </div>
              {SHOWS_PUZZLE.includes(state.screen) && (
                <HiddenImageCard
                  unlocked={state.unlockedPieces}
                  fresh={state.screen === "question" && state.phase === "correct" ? (state.unlockedPieces.at(-1) ?? null) : null}
                />
              )}
            </aside>
          )}

          <section className="relative flex flex-1 flex-col px-6 py-8 wide:min-h-0 wide:justify-center wide:overflow-y-auto wide:px-20 wide:py-10">
            <AnimatePresence mode="wait">
              {state.screen === "attract" && <AttractScreen key={`attract-${state.sessionId}`} />}
              {state.screen === "briefing" && <PatientBriefing key="briefing" />}
              {state.screen === "deterioration" && <EmergencyAlert key="deterioration" />}
              {state.screen === "question" && <QuestionPanel key="question" />}
              {state.screen === "recovery" && (
                <RecoveryScreen key="recovery" revealed={recoveryRevealed} onRevealed={markRevealed} onRestart={reset} />
              )}
              {state.screen === "participant-entry" && <ParticipantNameForm key="entry" />}
              {state.screen === "leaderboard" && <Leaderboard key="leaderboard" onRestart={reset} />}
            </AnimatePresence>
          </section>
        </main>
      </div>

      <AnimatePresence>
        {state.learnMoreOpen && <LearnMoreModal key="learn-more" onClose={() => dispatch({ type: "CLOSE_LEARN_MORE" })} />}
        {confirmRestart && (
          <Modal key="restart" labelledBy="restart-title" onClose={() => setConfirmRestart(false)} panelClassName="max-w-[52rem] p-10">
            <h2 id="restart-title" className="font-display text-popup font-bold uppercase leading-none">
              Restart the challenge?
            </h2>
            <p className="mt-4 text-body text-navy/70">Progress in this session will be lost.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <PrimaryButton size="lg" variant="danger" icon={RotateCcw} iconPosition="start" onClick={reset}>
                Yes, restart
              </PrimaryButton>
              <PrimaryButton size="lg" variant="outline" data-autofocus onClick={() => setConfirmRestart(false)}>
                No, continue
              </PrimaryButton>
            </div>
          </Modal>
        )}
        {secondsLeft !== null && (
          <Modal key="idle" labelledBy="idle-title" onClose={markActive} panelClassName="max-w-[52rem] p-10 text-center">
            <h2 id="idle-title" className="font-display text-popup font-bold uppercase leading-none">
              Still there, Doctor?
            </h2>
            <p className="mt-4 text-body text-navy/75" aria-live="assertive">
              Returning to the start in <span className="font-bold text-red">{secondsLeft}</span> seconds.
            </p>
            <PrimaryButton size="lg" className="mt-8" data-autofocus onClick={markActive}>
              I&apos;m still here
            </PrimaryButton>
          </Modal>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
