"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ACTIVITY_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

/**
 * Kiosk inactivity guard. After `timeoutMs - warningMs` without input, exposes a
 * countdown; when it reaches zero, calls `onTimeout`. Any input cancels it.
 */
export function useIdleReset(enabled: boolean, timeoutMs: number, warningMs: number, onTimeout: () => void) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const lastActivity = useRef(0);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const markActive = useCallback(() => {
    lastActivity.current = Date.now();
    setSecondsLeft(null);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setSecondsLeft(null);
      return;
    }
    lastActivity.current = Date.now();
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, markActive, { passive: true }));

    const interval = window.setInterval(() => {
      const idle = Date.now() - lastActivity.current;
      if (idle >= timeoutMs) {
        setSecondsLeft(null);
        onTimeoutRef.current();
        lastActivity.current = Date.now();
      } else if (idle >= timeoutMs - warningMs) {
        setSecondsLeft(Math.ceil((timeoutMs - idle) / 1000));
      }
    }, 250);

    return () => {
      window.clearInterval(interval);
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, markActive));
    };
  }, [enabled, timeoutMs, warningMs, markActive]);

  return { secondsLeft, markActive };
}
