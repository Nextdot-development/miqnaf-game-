let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioContext) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      audioContext = new Ctor();
    }
    if (audioContext.state === "suspended") void audioContext.resume();
    return audioContext;
  } catch {
    return null;
  }
}

function tone(ctx: AudioContext, frequency: number, start: number, duration: number, gain = 0.12) {
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = frequency;
  amp.gain.setValueAtTime(0, ctx.currentTime + start);
  amp.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
  osc.connect(amp).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.05);
}

export type Sfx = "tap" | "correct" | "incorrect" | "complete";

export function playSfx(kind: Sfx): void {
  const ctx = getContext();
  if (!ctx) return;
  switch (kind) {
    case "tap":
      tone(ctx, 660, 0, 0.08, 0.05);
      break;
    case "correct":
      tone(ctx, 784, 0, 0.18);
      tone(ctx, 1046.5, 0.12, 0.3);
      break;
    case "incorrect":
      tone(ctx, 220, 0, 0.22, 0.1);
      tone(ctx, 196, 0.16, 0.3, 0.1);
      break;
    case "complete":
      [523.25, 659.25, 784, 1046.5].forEach((f, i) => tone(ctx, f, i * 0.12, 0.45, 0.1));
      break;
  }
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const preferred = ["en-IN", "en-GB", "en-US"];
  for (const lang of preferred) {
    const match = voices.find((v) => v.lang === lang && v.localService) ?? voices.find((v) => v.lang === lang);
    if (match) return match;
  }
  return voices.find((v) => v.lang.startsWith("en")) ?? null;
}

export function speak(text: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Speech synthesis is optional; the experience works silently.
  }
}

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}
