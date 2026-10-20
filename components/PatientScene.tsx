/* eslint-disable @next/next/no-img-element -- local kiosk asset */
"use client";

import { useEffect, useId, useRef, useState } from "react";
import { TONE_LABEL, toneColor, type Tone } from "@/lib/visualStage";
import { ECGTrace } from "./ECGTrace";

/** Illustrated ICU scene (1024x1536). The monitor's screen is redrawn live on top of it. */
const SCENE = { src: "/images/patient-scene.webp", width: 1024, height: 1536 } as const;
/** Recovered patient (1536x1024): crossfades in once the patient is stabilised (all questions answered). */
const RECOVERED = { src: "/images/patient-recovered.webp", focus: "60% 30%" } as const;
/** The monitor screen inside the illustration, in image pixels. */
const SCREEN = { x: 728, y: 246, width: 250, height: 223 } as const;
/** The part of the illustration that must stay visible: the patient's whole face and the monitor. */
const FOCUS = { x: 140, y: 225, width: 870, height: 565 } as const;
const DEFAULT_VIEWBOX = "120 150 880 1080";

/** Frames FOCUS for a panel of the given aspect ratio, filling the rest with the surrounding illustration. */
function viewBoxFor(aspect: number) {
  let width: number;
  let height: number;
  if (aspect >= FOCUS.width / FOCUS.height) {
    height = FOCUS.height;
    width = Math.min(height * aspect, SCENE.width);
    height = width / aspect;
  } else {
    width = FOCUS.width;
    height = Math.min(width / aspect, SCENE.height);
    width = height * aspect;
  }
  const clamp = (v: number, max: number) => Math.max(0, Math.min(v, max));
  const x = clamp(FOCUS.x + FOCUS.width / 2 - width / 2, SCENE.width - width);
  // Wide panels centre on the face and monitor; tall ones keep a little headroom above the monitor.
  const y = clamp(
    height <= FOCUS.height ? FOCUS.y + FOCUS.height / 2 - height / 2 : FOCUS.y - (height - FOCUS.height) * 0.25,
    SCENE.height - height,
  );
  return `${x} ${y} ${width} ${height}`;
}

/**
 * Patient scene: the supplied illustration, framed on the patient and the bedside monitor. The
 * illustration's static trace is covered by a live ECG that follows the game (red, then golden
 * yellow, then green) with a matching heart and status label. When the patient is stable, the
 * recovered illustration fades in over it.
 */
export function PatientScene({ tone, className = "" }: { tone: Tone; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const color = toneColor(tone);
  const colorTransition = { transition: "fill 1.4s ease, stroke 1.4s ease" };
  const frameRef = useRef<HTMLDivElement>(null);
  const [viewBox, setViewBox] = useState(DEFAULT_VIEWBOX);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setViewBox(viewBoxFor(width / height));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className={`relative overflow-hidden rounded-[1.6rem] ${className}`}>
      <svg
        // The viewBox follows the panel's shape so the patient's face and the monitor are always in frame.
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
        className="block h-full w-full"
        role="img"
        aria-label={
          tone === "stable"
            ? "Game simulation: patient stabilised, awake and comfortable in an ICU bed"
            : `Game simulation: patient in an ICU bed, monitor status ${TONE_LABEL[tone].toLowerCase()}`
        }
      >
        <defs>
          <linearGradient id={`screen-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#002244" />
            <stop offset="1" stopColor="#021730" />
          </linearGradient>
        </defs>
        <image href={SCENE.src} x={0} y={0} width={SCENE.width} height={SCENE.height} preserveAspectRatio="none" />

        {/* Live monitor screen */}
        <rect {...SCREEN} rx={6} fill={`url(#screen-${uid})`} />
        <ECGTrace x={SCREEN.x + 10} y={SCREEN.y + 70} width={SCREEN.width - 20} height={125} tone={tone} beatWidth={115} strokeWidth={4} />
        <path
          d="M 935 306 C 912 290, 916 268, 935 280 C 954 268, 958 290, 935 306 Z"
          fill={color}
          className={tone === "critical" ? "alarm-blink" : undefined}
          style={colorTransition}
        />
        <text
          x={SCREEN.x + 14}
          y={SCREEN.y + SCREEN.height - 14}
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
      <img
        src={RECOVERED.src}
        alt=""
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
          tone === "stable" ? "opacity-100" : "opacity-0"
        }`}
        style={{ objectPosition: RECOVERED.focus }}
      />
    </div>
  );
}
