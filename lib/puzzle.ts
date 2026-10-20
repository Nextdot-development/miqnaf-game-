/**
 * Geometry for a single-row interlocking jigsaw. Pieces share boundary curves,
 * so neighbouring pieces fit exactly.
 */
type Point = [number, number];
interface Cubic {
  c1: Point;
  c2: Point;
  to: Point;
}

/** Board size in SVG units. The aspect (about 3.4:1) matches the approved MIQNAF logo artwork. */
export const PUZZLE_VIEW = { width: 1000, height: 290 } as const;

/** Boundary at x0 from top to bottom with a knob pointing right (dir 1) or left (dir -1). */
function boundary(x0: number, h: number, dir: 1 | -1): { start: Point; segments: Cubic[] } {
  const m = h / 2;
  const neck = h * 0.09;
  const r = h * 0.15;
  const p = h * 0.24 * dir;
  const line = (from: Point, to: Point): Cubic => ({ c1: from, c2: to, to });
  const a: Point = [x0, m - neck];
  const b: Point = [x0 + p * 0.55, m - r * 1.45];
  const c: Point = [x0 + p * 0.55, m + r * 1.45];
  const d: Point = [x0, m + neck];
  return {
    start: [x0, 0],
    segments: [
      line([x0, 0], a),
      { c1: [x0 + p * 0.25, m - neck * 0.9], c2: [x0 + p * 0.05, m - r * 1.5], to: b },
      { c1: [x0 + p * 1.1, m - r * 1.4], c2: [x0 + p * 1.1, m + r * 1.4], to: c },
      { c1: [x0 + p * 0.05, m + r * 1.5], c2: [x0 + p * 0.25, m + neck * 0.9], to: d },
      line(d, [x0, h]),
    ],
  };
}

function reverse(start: Point, segments: Cubic[]): { start: Point; segments: Cubic[] } {
  const points = [start, ...segments.map((s) => s.to)];
  const reversed = segments
    .map((s, i) => ({ c1: s.c2, c2: s.c1, to: points[i] }))
    .reverse();
  return { start: points[points.length - 1], segments: reversed };
}

const fmt = ([x, y]: Point) => `${x.toFixed(1)} ${y.toFixed(1)}`;
const cubicsToPath = (segments: Cubic[]) =>
  segments.map((s) => `C ${fmt(s.c1)}, ${fmt(s.c2)}, ${fmt(s.to)}`).join(" ");

export interface PieceShape {
  index: number;
  d: string;
  /** Visual centre of the piece body (for icons/labels). */
  cx: number;
  cy: number;
}

export function buildPieces(count: number, width = PUZZLE_VIEW.width, height = PUZZLE_VIEW.height): PieceShape[] {
  const pw = width / count;
  const dirs = Array.from({ length: count - 1 }, (_, i) => (i % 2 === 0 ? 1 : -1) as 1 | -1);

  return Array.from({ length: count }, (_, i) => {
    const left = i * pw;
    const right = (i + 1) * pw;
    let d = `M ${fmt([left, 0])} L ${fmt([right, 0])} `;
    d +=
      i < count - 1
        ? cubicsToPath(boundary(right, height, dirs[i]).segments)
        : `L ${fmt([right, height])}`;
    d += ` L ${fmt([left, height])} `;
    if (i > 0) {
      const b = boundary(left, height, dirs[i - 1]);
      d += cubicsToPath(reverse(b.start, b.segments).segments);
    } else {
      d += `L ${fmt([left, 0])}`;
    }
    d += " Z";
    return { index: i, d, cx: left + pw / 2, cy: height / 2 };
  });
}
