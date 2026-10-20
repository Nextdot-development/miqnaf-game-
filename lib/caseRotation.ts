import type { Pathway } from "@/types/game";

const KEY = "stp-case-rotation";
const SERVER_TIMEOUT_MS = 1500;

/**
 * Ticket for the next game. Tickets come from the shared counter on the server
 * (`app/api/session/route.ts`), so every device playing through the same server gets the next set:
 * player 1 Case 1, player 2 Case 2, player 3 Case 1 with a different question order, and so on.
 * Offline, a per-device counter takes over (starting at random, so kiosks side by side differ).
 */
export async function nextTicket(pathway: Pathway): Promise<number> {
  try {
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathway }),
      signal: AbortSignal.timeout(SERVER_TIMEOUT_MS),
    });
    const { ticket } = (await res.json()) as { ticket?: unknown };
    if (res.ok && typeof ticket === "number" && Number.isInteger(ticket) && ticket >= 0) return ticket;
  } catch {
    /* server unreachable: fall back to this device's counter */
  }
  return localTicket(pathway);
}

function localTicket(pathway: Pathway): number {
  let rotation: Partial<Record<Pathway, number>> = {};
  try {
    rotation = JSON.parse(window.localStorage.getItem(KEY) ?? "{}") ?? {};
  } catch {
    /* storage unavailable or corrupt: start fresh */
  }
  const last = rotation[pathway];
  const next = typeof last === "number" && Number.isInteger(last) ? last + 1 : Math.floor(Math.random() * 1000);
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...rotation, [pathway]: next }));
  } catch {
    /* ignore: the next game simply starts at random again */
  }
  return next;
}
