/* eslint-disable @next/next/no-img-element -- local kiosk assets; next/image adds nothing offline */
import { MIQNAF } from "@/data/brand";

export function PlaceholderTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md bg-red/10 px-2.5 py-1 text-tag font-bold uppercase tracking-[0.08em] text-red ${className}`}
    >
      Placeholder
    </span>
  );
}

/**
 * MIQNAF logo: approved artwork when configured, otherwise a text wordmark. Height in rem.
 * The approved logo is navy on light grey, so it sits on a matching light panel to stay legible on dark screens.
 */
export function MiqnafWordmark({ height = 4 }: { height?: number }) {
  if (MIQNAF.logoSrc) {
    return (
      <span className="inline-flex shrink-0 rounded-xl bg-paper px-[0.4em] py-[0.25em]" style={{ fontSize: `${height}rem` }}>
        <img src={MIQNAF.logoSrc} alt="MIQNAF (Nafithromycin tablet 400 mg)" style={{ height: "1em" }} className="w-auto" />
      </span>
    );
  }
  return (
    <span
      className="font-display inline-flex items-center font-extrabold leading-none text-navy"
      style={{ fontSize: `${height}rem`, letterSpacing: "0.03em" }}
      aria-label="MIQNAF"
    >
      MIQNAF
      <svg viewBox="0 0 40 60" style={{ height: "0.75em", marginLeft: "0.1em" }} aria-hidden="true">
        <path d="M 6 4 L 32 30 L 6 56" stroke="#9A1F24" strokeWidth="12" fill="none" />
      </svg>
    </span>
  );
}
