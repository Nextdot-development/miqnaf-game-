"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface ModalProps {
  labelledBy: string;
  onClose: () => void;
  children: React.ReactNode;
  panelClassName?: string;
  /** Game-style entrance: the panel pops in with a spring. */
  pop?: boolean;
  /** Lighter backdrop so the scene behind stays visible. */
  lightBackdrop?: boolean;
  /** Panel outline classes. */
  ringClassName?: string;
}

/**
 * Accessible modal: moves focus inside, traps Tab, closes on Escape or a tap
 * outside, and returns focus to the element that opened it. Render inside
 * <AnimatePresence> for exit animations.
 */
export function Modal({ labelledBy, onClose, children, panelClassName = "", pop = false, lightBackdrop = false, ringClassName = "ring-1 ring-navy/10" }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])') ?? [],
      );
    (panel?.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0])?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
      } else if (e.key === "Tab") {
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${lightBackdrop ? "bg-navy/45" : "bg-navy/75"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        initial={pop ? { opacity: 0, scale: 0.7, y: 40, rotate: -4 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
        exit={pop ? { opacity: 0, scale: 0.9 } : { opacity: 0, y: 8 }}
        transition={pop ? { type: "spring", stiffness: 320, damping: 22 } : { duration: 0.25, ease: "easeOut" }}
        className={`relative max-h-[calc(100dvh-2rem)] w-full overflow-y-auto rounded-3xl bg-white text-navy ${ringClassName} ${panelClassName}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
