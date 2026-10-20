/**
 * Brand and product configuration. Everything MIQNAF-specific that still needs
 * medical/legal approval lives here so it can be replaced without touching UI code.
 */

/**
 * Brand palette on a white page: crimson for accent text and alerts, royal navy for the
 * header, option bars, logo and body text, golden yellow for CTAs, A-D badges and jigsaw pieces.
 */
export const BRAND_COLORS = {
  navy: "#28397F",
  red: "#9A1F24",
  gold: "#E7A900",
  paper: "#F7F7F7",
} as const;

/**
 * Narrative monitor colours (game indicator only, not physiological data).
 * The approved brief requires the ECG to go Red -> Golden Yellow -> Bright Green,
 * so green is the only non-brand colour, and it appears on the monitor screen only.
 */
export const MONITOR_COLORS = {
  critical: BRAND_COLORS.red,
  recovering: BRAND_COLORS.gold,
  stable: "#2BEA74",
} as const;

export interface PlaceholderText {
  text: string;
  /** True while the text is awaiting approval; renders a visible "placeholder" tag. */
  placeholder: boolean;
}

export const MIQNAF = {
  name: "MIQNAF",
  /**
   * Approved logo artwork, e.g. "/images/miqnaf-logo.png". When null, a text
   * wordmark labelled as a placeholder is shown instead.
   */
  logoSrc: "/images/miqnaf-logo.png" as string | null,
  /**
   * Approved artwork hidden behind the five puzzle pieces, e.g. "/images/miqnaf-artwork.png"
   * (landscape, about 3.4:1, for example 2000x580; see scripts/prepare-logo.py). When null, a placeholder composition with the wordmark is used.
   */
  puzzleArtworkSrc: "/images/miqnaf-puzzle.png" as string | null,
  scientificMessage: {
    text: "[Insert medically and legally approved scientific message.]",
    placeholder: true,
  } satisfies PlaceholderText,
  learnMore: {
    title: "About MIQNAF",
    sections: [
      {
        heading: "Scientific information",
        body: {
          text: "[Insert approved product and scientific information.]",
          placeholder: true,
        },
      },
      {
        heading: "Prescribing information",
        body: {
          text: "[Insert approved prescribing information reference.]",
          placeholder: true,
        },
      },
      {
        heading: "Safety information",
        body: {
          text: "[Insert approved safety information.]",
          placeholder: true,
        },
      },
    ] satisfies { heading: string; body: PlaceholderText }[],
    /** Approved QR code image, e.g. "/images/miqnaf-qr.png". */
    qrCodeSrc: null as string | null,
    qrCaption: "Scan for prescribing information",
    /** Regulatory footnote, if one is required by the approval process. */
    footnote: "[Insert approved regulatory footnote, if required.]",
  },
} as const;

export const KIOSK = {
  /** Leaderboard rows shown (the brief specifies ranks #1 to #5). */
  leaderboardSize: 5,
  /** Return to the attract screen after this much inactivity. */
  idleTimeoutMs: 75_000,
  idleTimeoutEntryMs: 120_000,
  idleWarningMs: 10_000,
  /**
   * Pause after a correct answer before moving on automatically (the brief: "auto-advances to the
   * next question"). Long enough to read the rationale; the challenge clock is paused meanwhile.
   */
  correctAutoAdvanceMs: 3_500,
  /** The MIQNAF logo popup at the end of the quiz closes by itself after this long. */
  completionPopupMs: 9_000,
  /** Voice-over and sound effects on by default; staff can toggle from the header. */
  soundDefaultOn: true,
} as const;
