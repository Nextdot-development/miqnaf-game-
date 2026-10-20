"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { KIOSK } from "@/data/brand";
import { VOICE_OVER, type VoiceOverId } from "@/data/copy";
import { playSfx, speak, stopSpeaking, type Sfx } from "@/lib/audio";
import { createInitialState, gameReducer } from "@/lib/gameMachine";
import type { GameAction, GameState } from "@/types/game";

const SOUND_KEY = "stp-sound-on";

interface GameApi {
  state: GameState;
  dispatch: (action: GameAction) => void;
  soundOn: boolean;
  toggleSound: () => void;
  sfx: (kind: Sfx) => void;
  voiceOver: (id: VoiceOverId) => void;
}

const GameContext = createContext<GameApi | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialState());
  const [soundOn, setSoundOn] = useState<boolean>(KIOSK.soundDefaultOn);
  const soundRef = useRef(soundOn);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SOUND_KEY);
      if (stored !== null) setSoundOn(stored === "1");
    } catch {
      /* storage unavailable: keep the default */
    }
  }, []);

  useEffect(() => {
    soundRef.current = soundOn;
    if (!soundOn) stopSpeaking();
  }, [soundOn]);

  // A new session must never inherit the previous participant's voice-over.
  useEffect(() => {
    stopSpeaking();
  }, [state.sessionId]);

  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      const next = !on;
      try {
        window.localStorage.setItem(SOUND_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const sfx = useCallback((kind: Sfx) => {
    if (soundRef.current) playSfx(kind);
  }, []);

  const voiceOver = useCallback((id: VoiceOverId) => {
    if (soundRef.current) speak(VOICE_OVER[id]);
  }, []);

  const api = useMemo(
    () => ({ state, dispatch, soundOn, toggleSound, sfx, voiceOver }),
    [state, soundOn, toggleSound, sfx, voiceOver],
  );

  return <GameContext.Provider value={api}>{children}</GameContext.Provider>;
}

export function useGame(): GameApi {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}
