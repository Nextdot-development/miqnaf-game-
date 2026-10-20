"use client";

import type { Tone } from "@/lib/visualStage";
import { PatientScene } from "./PatientScene";

const STATUS: Record<Tone, { label: string; dot: string; text: string }> = {
  critical: { label: "Critical", dot: "bg-red", text: "text-red" },
  recovering: { label: "Improving", dot: "bg-gold", text: "text-[#a77a00]" },
  stable: { label: "Stable", dot: "bg-green", text: "text-green" },
};

/** White card with the "Game simulation" tag, the patient's status and the patient scene filling the rest. */
export function SimulationCard({ tone, className = "" }: { tone: Tone; className?: string }) {
  const status = STATUS[tone];
  return (
    <section
      className={`flex min-h-[22rem] flex-col rounded-[2rem] bg-white p-5 shadow-[0_0.5rem_2rem_rgb(40_57_127/0.08)] ring-1 ring-navy/5 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-display rounded-lg bg-navy px-4 py-1.5 text-label font-bold uppercase tracking-[0.1em] text-white">
          Game simulation
        </span>
        <span className="font-display flex items-center gap-3 text-label font-bold uppercase tracking-[0.08em] text-navy/80">
          Patient status
          <span className={`h-3.5 w-3.5 rounded-full ${status.dot}`} aria-hidden />
          <span className={status.text}>{status.label}</span>
        </span>
      </div>
      {/* The image fills whatever height the card has, instead of sizing the card */}
      <div className="relative mt-4 min-h-0 flex-1">
        <div className="absolute inset-0">
          <PatientScene tone={tone} className="h-full w-full" />
        </div>
      </div>
    </section>
  );
}
