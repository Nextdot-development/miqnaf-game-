"use client";

import { useSyncExternalStore } from "react";

/** Same condition as the `wide:` Tailwind variant in app/globals.css. */
export const WIDE_QUERY = "(min-width: 64rem) and (min-aspect-ratio: 4/3)";

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
