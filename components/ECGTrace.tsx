"use client";

import { useId, type CSSProperties } from "react";
import { BEAT_SECONDS, ecgPath } from "@/lib/ecg";
import { toneColor, type Tone } from "@/lib/visualStage";

interface ECGTraceProps {
  x?: number;
  y?: number;
  width: number;
  height: number;
  tone: Tone;
  beatWidth?: number;
  strokeWidth?: number;
}

/**
 * Scrolling ECG trace, rendered as an SVG group so it can sit inside the
 * bedside-monitor illustration or a standalone strip. The path is periodic, so
 * translating it by exactly one beat width loops seamlessly.
 */
export function ECGTrace({ x = 0, y = 0, width, height, tone, beatWidth = 150, strokeWidth = 3 }: ECGTraceProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const color = toneColor(tone);
  const beats = Math.ceil(width / beatWidth) + 2;
  const d = ecgPath(beats, beatWidth, height * 0.62, height * 0.66);
  const scrollStyle = {
    "--ecg-period": beatWidth,
    "--ecg-duration": `${BEAT_SECONDS[tone]}s`,
  } as CSSProperties;
  const strokeTransition: CSSProperties = { transition: "stroke 1.4s ease" };

  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <defs>
        <clipPath id={`clip-${uid}`}>
          <rect width={width} height={height} />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${uid})`}>
        <g className="ecg-scroll" style={scrollStyle}>
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeOpacity={0.22}
            strokeWidth={strokeWidth * 4.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={strokeTransition}
          />
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={strokeTransition}
          />
        </g>
      </g>
    </g>
  );
}
