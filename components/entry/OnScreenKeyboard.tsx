"use client";

import { motion } from "framer-motion";
import { Delete } from "lucide-react";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", "'", ".", "-"],
];

const KEY_NAMES: Record<string, string> = { "'": "apostrophe", ".": "full stop", "-": "hyphen" };

export type KeyboardKey = string | "SPACE" | "BACKSPACE" | "CLEAR";

function Key({
  label,
  ariaLabel,
  onPress,
  grow = 1,
}: {
  label: React.ReactNode;
  ariaLabel: string;
  onPress: () => void;
  grow?: number;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92, backgroundColor: "#E7A900", color: "#28397F" }}
      transition={{ duration: 0.08 }}
      onPointerDown={(e) => e.preventDefault() /* keep focus in the name field */}
      onClick={onPress}
      aria-label={ariaLabel}
      style={{ flexGrow: grow, flexBasis: 0 }}
      className="font-display flex h-[5.25rem] min-w-0 items-center justify-center gap-3 rounded-xl bg-white text-[2.1rem] font-bold text-navy shadow-[0_0.3rem_0_#c3cbdd] ring-1 ring-navy/10"
    >
      {label}
    </motion.button>
  );
}

/** Touch keyboard for name entry on the kiosk: white keys with a soft bottom edge on a light panel. */
export function OnScreenKeyboard({ onKey }: { onKey: (key: KeyboardKey) => void }) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-3xl bg-[#e3e8f3] p-4" role="group" aria-label="On-screen keyboard">
      {ROWS.map((row, r) => (
        <div key={r} className="flex gap-3" style={{ paddingInline: r === 1 ? "4%" : undefined }}>
          {row.map((k) => (
            <Key key={k} label={k} ariaLabel={KEY_NAMES[k] ?? k} onPress={() => onKey(k)} />
          ))}
        </div>
      ))}
      <div className="flex gap-3">
        <Key grow={2} label={<span className="text-label uppercase tracking-wide">Clear</span>} ariaLabel="Clear name" onPress={() => onKey("CLEAR")} />
        <Key grow={5.5} label={<span className="text-label uppercase tracking-wide">Space</span>} ariaLabel="Space" onPress={() => onKey("SPACE")} />
        <Key
          grow={2}
          label={
            <>
              <Delete size="2rem" aria-hidden />
              <span className="text-label uppercase tracking-wide">Backspace</span>
            </>
          }
          ariaLabel="Backspace"
          onPress={() => onKey("BACKSPACE")}
        />
      </div>
    </div>
  );
}
