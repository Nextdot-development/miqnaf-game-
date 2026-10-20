"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useId } from "react";
import { Modal } from "./Modal";

type Tone = "gold" | "alert" | "ok";
type Size = "md" | "lg" | "xl";

const WIDTH: Record<Size, string> = {
  md: "max-w-[50rem]",
  lg: "max-w-[64rem]",
  xl: "max-w-[84rem]",
};

const BADGE: Record<Tone, string> = {
  gold: "bg-gold text-navy",
  alert: "bg-red text-white",
  ok: "bg-navy text-white",
};

const RING: Record<Tone, string> = {
  gold: "ring-4 ring-navy",
  alert: "ring-4 ring-red",
  ok: "ring-4 ring-navy",
};

interface GamePopupProps {
  icon: LucideIcon;
  tone?: Tone;
  kicker?: string;
  title: string;
  children?: React.ReactNode;
  /** Buttons; the one marked data-autofocus receives focus. */
  actions: React.ReactNode;
  /** Called on Escape or a tap outside. Omit for popups that need an explicit choice. */
  onDismiss?: () => void;
  lightBackdrop?: boolean;
  size?: Size;
}

/** Game-style instruction popup: icon badge, short title, a few lines, one clear action. */
export function GamePopup({
  icon: Icon,
  tone = "gold",
  kicker,
  title,
  children,
  actions,
  onDismiss,
  lightBackdrop = false,
  size = "md",
}: GamePopupProps) {
  const titleId = useId();
  return (
    <Modal
      labelledBy={titleId}
      onClose={onDismiss ?? (() => {})}
      pop
      lightBackdrop={lightBackdrop}
      ringClassName={RING[tone]}
      panelClassName={`${WIDTH[size]} px-8 pb-9 pt-10 text-center wide:px-12`}
    >
      <motion.span
        className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${BADGE[tone]}`}
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.1 }}
        aria-hidden
      >
        <Icon size="3.25rem" strokeWidth={2.2} />
      </motion.span>
      {kicker && (
        <p className={`mt-6 text-label font-bold uppercase tracking-[0.12em] text-red`}>
          {kicker}
        </p>
      )}
      <h2 id={titleId} className={`font-display ${kicker ? "mt-2" : "mt-6"} text-popup font-extrabold uppercase leading-none`}>
        {title}
      </h2>
      {children && <div className="mt-6 text-body leading-snug text-navy/80">{children}</div>}
      <div className="mt-9 flex flex-wrap justify-center gap-4">{actions}</div>
    </Modal>
  );
}
