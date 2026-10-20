"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useMemo } from "react";
import { MIQNAF } from "@/data/brand";
import { PUZZLE_PIECE_COUNT } from "@/data/cases";
import { buildPieces, PUZZLE_VIEW } from "@/lib/puzzle";

interface PuzzleBoardProps {
  unlocked: number[];
  /** Final state: seams fade and the full artwork is revealed. */
  assembled?: boolean;
  /** Animate unlocked pieces in one after another (final assembly). */
  staggerIn?: boolean;
  /** Piece unlocked just now: it glows gold, as in the approved game design. */
  fresh?: number | null;
  className?: string;
}

const { width: VW, height: VH } = PUZZLE_VIEW;
const PAD = 12;

/**
 * Jigsaw over the hidden MIQNAF artwork that scales to its container width. Locked pieces are gold
 * covers with a lock; when a piece unlocks its cover lifts away and that fragment of the logo shows.
 */
export function PuzzleBoard({ unlocked, assembled = false, staggerIn = false, fresh = null, className = "" }: PuzzleBoardProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const pieces = useMemo(() => buildPieces(PUZZLE_PIECE_COUNT), []);

  return (
    <svg
      viewBox={`${-PAD} ${-PAD} ${VW + PAD * 2} ${VH + PAD * 2}`}
      className={`block h-auto w-full ${className}`}
      role="img"
      aria-label={`Hidden image puzzle: ${unlocked.length} of ${PUZZLE_PIECE_COUNT} pieces unlocked`}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`gold-${uid}`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#F6C63A" />
          <stop offset="0.55" stopColor="#E7A900" />
          <stop offset="1" stopColor="#C99300" />
        </linearGradient>
        {pieces.map((p) => (
          <clipPath key={p.index} id={`pc-${uid}-${p.index}`}>
            <path d={p.d} />
          </clipPath>
        ))}
      </defs>

      {/* The full artwork sits under the gold covers, so an unlocked piece always shows its fragment even
          when the browser skips repainting the clipped copy below (mobile Safari, cached image on replay). */}
      {!staggerIn && <PuzzleArtwork />}

      {pieces.map((p) => {
        if (!unlocked.includes(p.index)) return null;
        const order = unlocked.indexOf(p.index);
        return (
          <motion.g
            key={p.index}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: staggerIn ? 0.1 + order * 0.14 : 0 }}
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
          >
            <g clipPath={`url(#pc-${uid}-${p.index})`}>
              <PuzzleArtwork />
            </g>
            <motion.path
              d={p.d}
              fill="none"
              stroke="#E7A900"
              strokeWidth={4}
              strokeLinejoin="round"
              initial={false}
              animate={{ strokeOpacity: assembled ? 0 : 1 }}
              transition={{ duration: 0.8, delay: assembled ? 1 : 0 }}
            />
            {fresh === p.index && !assembled && (
              <motion.path
                d={p.d}
                fill="#E7A900"
                stroke="#E7A900"
                strokeWidth={12}
                strokeLinejoin="round"
                initial={{ fillOpacity: 0.55, strokeOpacity: 1 }}
                animate={{ fillOpacity: [0.55, 0, 0.18, 0], strokeOpacity: [1, 0.5, 1, 0.7] }}
                transition={{ duration: 1.6, ease: "easeOut" }}
                style={{ filter: "drop-shadow(0 0 10px #E7A900)" }}
              />
            )}
          </motion.g>
        );
      })}

      {/* Gold covers over locked pieces; each lifts away when its piece unlocks. */}
      <AnimatePresence>
        {pieces
          .filter((p) => !unlocked.includes(p.index))
          .map((p) => (
            <motion.g
              key={`cover-${p.index}`}
              initial={false}
              exit={{ opacity: 0, scale: 1.18, y: -40, rotate: -6 }}
              transition={{ duration: 0.55, ease: "easeIn" }}
              style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
            >
              <path d={p.d} fill={`url(#gold-${uid})`} stroke="#28397F" strokeWidth={4} strokeLinejoin="round" />
              <g clipPath={`url(#pc-${uid}-${p.index})`}>
                <path d={p.d} fill="none" stroke="#FFFFFF" strokeOpacity={0.4} strokeWidth={6} transform="translate(0 3)" />
              </g>
              <LockIcon cx={p.cx} cy={p.cy} />
            </motion.g>
          ))}
      </AnimatePresence>

      {/* Once assembled, the complete artwork fades in over the pieces so no seams remain. */}
      {assembled && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }}>
          <PuzzleArtwork />
        </motion.g>
      )}
    </svg>
  );
}

function LockIcon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <path d="M -11 -4 L -11 -12 A 11 11 0 0 1 11 -12 L 11 -4" fill="none" stroke="#28397F" strokeWidth={5} />
      <rect x={-17} y={-6} width={34} height={28} rx={6} fill="#28397F" />
    </g>
  );
}

/** The hidden image: approved artwork when configured, otherwise a simple wordmark composition. */
function PuzzleArtwork() {
  if (MIQNAF.puzzleArtworkSrc) {
    return <image href={MIQNAF.puzzleArtworkSrc} x={0} y={0} width={VW} height={VH} preserveAspectRatio="xMidYMid slice" />;
  }
  return (
    <g>
      <rect width={VW} height={VH} fill="#28397F" />
      <text
        x={VW / 2 - 36}
        y={VH / 2 + 40}
        textAnchor="middle"
        fill="#fff"
        fontSize={120}
        fontWeight={800}
        letterSpacing={6}
        style={{ fontFamily: "var(--font-display)", fontStretch: "78%" }}
      >
        MIQNAF
      </text>
      <path
        d={`M ${VW / 2 + 196} ${VH / 2 - 44} L ${VW / 2 + 238} ${VH / 2} L ${VW / 2 + 196} ${VH / 2 + 44}`}
        stroke="#9A1F24"
        strokeWidth={24}
        fill="none"
      />
    </g>
  );
}
