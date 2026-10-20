/**
 * Stylised ECG beat used purely as a narrative game indicator.
 * Points are normalised: x in [0, 1] across one beat, y relative to amplitude
 * (negative = upward on screen).
 */
function beatShape(): [number, number][] {
  const points: [number, number][] = [
    [0, 0],
    [0.08, 0],
  ];
  for (let i = 1; i <= 8; i++) {
    const t = i / 8;
    points.push([0.08 + 0.12 * t, -0.12 * Math.sin(Math.PI * t)]); // P wave
  }
  points.push([0.27, 0], [0.29, 0.1], [0.32, -1], [0.355, 0.3], [0.38, 0], [0.48, 0]); // QRS
  for (let i = 1; i <= 10; i++) {
    const t = i / 10;
    points.push([0.48 + 0.18 * t, -0.22 * Math.sin(Math.PI * t)]); // T wave
  }
  points.push([1, 0]);
  return points;
}

const BEAT = beatShape();

/** SVG path for `beats` consecutive beats starting at x = 0. */
export function ecgPath(beats: number, beatWidth: number, amplitude: number, baseline: number): string {
  const parts: string[] = [];
  for (let b = 0; b < beats; b++) {
    for (const [x, y] of BEAT) {
      const px = (b + x) * beatWidth;
      const py = baseline + y * amplitude;
      parts.push(`${parts.length === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`);
    }
  }
  return parts.join(" ");
}

/** Beat timing per tone: faster while distressed, slower once stable. */
export const BEAT_SECONDS = {
  critical: 0.62,
  recovering: 0.85,
  stable: 1.05,
} as const;
