"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, X } from "lucide-react";
import { useCallback, useState } from "react";
import { KIOSK } from "@/data/brand";
import { useGame } from "@/hooks/useGame";
import { currentQuestion, displayedOptions, isCorrectAnswer, sessionCase } from "@/lib/gameMachine";
import type { OptionKey } from "@/types/game";
import { ClueCards } from "../ClueCards";
import { Modal } from "../Modal";
import { PrimaryButton } from "../PrimaryButton";
import { ScreenTransition } from "../ScreenTransition";
import { AnswerOption, type OptionStatus } from "../question/AnswerOption";
import { CorrectFeedback, IncorrectFeedback } from "../question/AnswerFeedback";
import { QuestionProgress } from "../question/QuestionProgress";

export function QuestionPanel() {
  const { state, dispatch, sfx } = useGame();
  const [cluesOpen, setCluesOpen] = useState(false);
  const clinicalCase = sessionCase(state);
  const question = currentQuestion(state);
  // Shuffled for this session, so the correct answer is not always in the same position.
  const options = displayedOptions(state, question);
  const total = clinicalCase.questions.length;

  const answer = (option: OptionKey) => {
    if (state.phase !== "answering" || state.eliminated.includes(option)) return;
    sfx(isCorrectAnswer(question, option) ? "correct" : "incorrect");
    dispatch({ type: "ANSWER", option, now: Date.now() });
  };

  const handleContinue = useCallback(() => {
    sfx("tap");
    dispatch({ type: "CONTINUE", now: Date.now() });
  }, [dispatch, sfx]);

  const statusFor = (key: OptionKey): OptionStatus => {
    if (state.selectedOption === key && state.phase === "correct") return "correct";
    if (state.selectedOption === key && state.phase === "incorrect") return "incorrect";
    if (state.eliminated.includes(key)) return "eliminated";
    return "idle";
  };

  return (
    <ScreenTransition className="flex flex-col gap-8">
      <QuestionProgress index={state.questionIndex} total={total} completed={state.completedQuestionIds.length} />

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col gap-8"
        >
          <h1 className="text-[2.4rem] font-bold leading-[1.2] wide:min-h-[8.75rem] wide:text-[2.6rem]" aria-live="polite">
            {question.question}
          </h1>
          <div className="flex flex-col gap-3.5">
            {options.map(({ option, letter }) => {
              const status = statusFor(option.key);
              return (
                <AnswerOption
                  key={option.key}
                  option={option}
                  letter={letter}
                  status={status}
                  disabled={state.phase !== "answering" || status === "eliminated"}
                  onSelect={() => answer(option.key)}
                />
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setCluesOpen(true)}
        className="flex items-center gap-3 self-start rounded-lg py-2 text-label font-bold uppercase tracking-[0.06em] text-navy/70 transition-colors hover:text-navy"
      >
        <ClipboardList size="1.9rem" aria-hidden />
        Clinical clues
      </button>

      <AnimatePresence>
        {state.phase === "correct" && (
          <CorrectFeedback
            key={`correct-${question.id}`}
            question={question}
            correctLetter={options.find((o) => o.option.key === question.correctOption)?.letter ?? question.correctOption}
            piecesUnlocked={state.unlockedPieces.length}
            autoAdvanceMs={KIOSK.correctAutoAdvanceMs}
            onContinue={handleContinue}
          />
        )}
        {state.phase === "incorrect" && (
          <IncorrectFeedback
            key={`incorrect-${question.id}-${state.eliminated.length}`}
            onRetry={() => {
              sfx("tap");
              dispatch({ type: "RETRY" });
            }}
            onReviewClues={() => {
              dispatch({ type: "RETRY" });
              setCluesOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cluesOpen && (
          <Modal labelledBy="clues-title" onClose={() => setCluesOpen(false)} panelClassName="max-w-[76rem] p-8 wide:p-12">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 id="clues-title" className="font-display text-popup font-bold uppercase leading-none">
                Clinical clues
              </h2>
              <button
                type="button"
                data-autofocus
                onClick={() => setCluesOpen(false)}
                aria-label="Close clinical clues"
                className="flex h-16 w-16 items-center justify-center rounded-xl text-navy transition-colors hover:bg-navy/10"
              >
                <X size="2.25rem" aria-hidden />
              </button>
            </div>
            <ClueCards clues={clinicalCase.clues} animate={false} />
            <PrimaryButton size="md" className="mt-8" onClick={() => setCluesOpen(false)}>
              Back to question
            </PrimaryButton>
          </Modal>
        )}
      </AnimatePresence>
    </ScreenTransition>
  );
}
