/* eslint-disable @next/next/no-img-element -- local kiosk asset */
"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useGame } from "@/hooks/useGame";
import { TONE_LABEL, toneColor, type Tone } from "@/lib/visualStage";
import { ECGTrace } from "./ECGTrace";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** An illustrated scene with a bedside monitor whose screen is redrawn live on top of it. All values are in image pixels. */
interface SceneArt {
  src: string;
  width: number;
  height: number;
  /** The monitor screen inside the illustration. */
  screen: Rect;
  /** Live ECG band and heart position, relative to the screen's top-left corner. */
  ecg: { top: number; height: number };
  heart: { x: number; y: number };
  /** The part of the illustration that must always stay visible (faces and the monitor). */
  focus: Rect;
  /** Recovered artwork drawn in the same frame, so the live monitor stays on top while it fades in. */
  recoveredSrc?: string;
  /** Recovered artwork with its own framing, crossfaded over the whole panel (CSS object-position). */
  recoveredCover?: { src: string; position: string };
  label: { critical: string; stable: string };
}

/** IPD: illustrated ICU bed (1024x1536); a separate recovered illustration crossfades in once stable. */
const WARD: SceneArt = {
  src: "/images/patient-scene.webp",
  width: 1024,
  height: 1536,
  screen: { x: 728, y: 246, width: 250, height: 223 },
  ecg: { top: 70, height: 125 },
  heart: { x: 207, y: 34 },
  focus: { x: 140, y: 225, width: 870, height: 565 },
  recoveredCover: { src: "/images/patient-recovered.webp", position: "60% 30%" },
  label: { critical: "patient in an ICU bed", stable: "patient stabilised, awake and comfortable in an ICU bed" },
};

/** OPD: a coughing patient and his doctor in an outpatient clinic (1500x1000 units, exported at 2x). */
const CLINIC: SceneArt = {
  src: "/images/clinic-scene.webp",
  width: 1500,
  height: 1000,
  screen: { x: 860, y: 166, width: 250, height: 200 },
  ecg: { top: 58, height: 108 },
  heart: { x: 210, y: 28 },
  focus: { x: 440, y: 130, width: 990, height: 600 },
  recoveredSrc: "/images/clinic-recovered.webp",
  label: { critical: "patient coughing during an outpatient clinic visit", stable: "patient recovered and smiling at his clinic follow-up" },
};

/** Frames the scene's focus area for a panel of the given aspect ratio, filling the rest with the surrounding illustration. */
function viewBoxFor(art: SceneArt, aspect: number) {
  const { focus } = art;
  let width: number;
  let height: number;
  if (aspect >= focus.width / focus.height) {
    height = focus.height;
    width = Math.min(height * aspect, art.width);
    height = width / aspect;
  } else {
    width = focus.width;
    height = Math.min(width / aspect, art.height);
    width = height * aspect;
  }
  const clamp = (v: number, max: number) => Math.max(0, Math.min(v, max));
  const x = clamp(focus.x + focus.width / 2 - width / 2, art.width - width);
  // Wide panels centre on the focus area; tall ones keep a little headroom above it.
  const y = clamp(
    height <= focus.height ? focus.y + focus.height / 2 - height / 2 : focus.y - (height - focus.height) * 0.25,
    art.height - height,
  );
  return `${x} ${y} ${width} ${height}`;
}

/**
 * Patient scene: the setting follows the chosen case (an outpatient clinic for OPD, the ICU otherwise).
 * The illustration's monitor shows a live ECG that follows the game (red, then golden yellow, then
 * green) with a matching heart and status label. When the patient is stable, the recovered artwork
 * fades in.
 */
export function PatientScene({ tone, className = "" }: { tone: Tone; className?: string }) {
  const { state } = useGame();
  const art = state.pathway === "OPD" ? CLINIC : WARD;
  // Remount on a change of setting so the framing is recomputed for the new artwork.
  return <IllustratedScene key={art.src} art={art} tone={tone} className={className} />;
}

function IllustratedScene({ art, tone, className }: { art: SceneArt; tone: Tone; className: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const color = toneColor(tone);
  const colorTransition = { transition: "fill 1.4s ease, stroke 1.4s ease" };
  const frameRef = useRef<HTMLDivElement>(null);
  const [viewBox, setViewBox] = useState(() => viewBoxFor(art, 1.6));
  const { screen } = art;
  const stable = tone === "stable";

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setViewBox(viewBoxFor(art, width / height));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [art]);

  return (
    <div ref={frameRef} className={`relative overflow-hidden rounded-[1.6rem] ${className}`}>
      <svg
        // The viewBox follows the panel's shape so the faces and the monitor are always in frame.
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
        className="block h-full w-full"
        role="img"
        aria-label={
          stable ? `Game simulation: ${art.label.stable}` : `Game simulation: ${art.label.critical}, monitor status ${TONE_LABEL[tone].toLowerCase()}`
        }
      >
        <defs>
          <linearGradient id={`screen-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#002244" />
            <stop offset="1" stopColor="#021730" />
          </linearGradient>
        </defs>
        <image href={art.src} x={0} y={0} width={art.width} height={art.height} preserveAspectRatio="none" />
        {art.recoveredSrc && (
          <image
            href={art.recoveredSrc}
            x={0}
            y={0}
            width={art.width}
            height={art.height}
            preserveAspectRatio="none"
            style={{ opacity: stable ? 1 : 0, transition: "opacity 1s ease-out" }}
          />
        )}

        {/* Live monitor screen */}
        <rect {...screen} rx={6} fill={`url(#screen-${uid})`} />
        <ECGTrace
          x={screen.x + 10}
          y={screen.y + art.ecg.top}
          width={screen.width - 20}
          height={art.ecg.height}
          tone={tone}
          beatWidth={115}
          strokeWidth={4}
        />
        <path
          d="M 0 26 C -23 10, -19 -12, 0 0 C 19 -12, 23 10, 0 26 Z"
          transform={`translate(${screen.x + art.heart.x} ${screen.y + art.heart.y})`}
          fill={color}
          className={tone === "critical" ? "alarm-blink" : undefined}
          style={colorTransition}
        />
        <text
          x={screen.x + 14}
          y={screen.y + screen.height - 14}
          fill={color}
          fontSize={17}
          fontWeight={700}
          letterSpacing={2}
          style={{ ...colorTransition, fontFamily: "var(--font-body)" }}
        >
          {TONE_LABEL[tone]}
        </text>
      </svg>

      {/* Always mounted so the image is loaded before it is needed */}
      {art.recoveredCover && (
        <img
          src={art.recoveredCover.src}
          alt=""
          aria-hidden
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
            stable ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectPosition: art.recoveredCover.position }}
        />
      )}
    </div>
  );
}
