# Save the Patient: NAPCON Kolkata 2026

This is a touchscreen kiosk game designed for a 42-inch, 1920×1080 landscape display. It also adapts to laptops, tablets and phones. A doctor picks OPD or IPD, is dealt one of that pathway's cases and reviews the clinical clues. Each of 4 clinical questions they answer correctly unlocks a piece of a hidden MIQNAF puzzle. As they progress, the patient visibly recovers and the bedside monitor's ECG moves from red to gold to green. The game ends with the MIQNAF reveal and a "fastest doctors" leaderboard.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lucide icons and optional Supabase.

## Run it

Requires Node.js 20+ (tested on 22.14).

```bash
npm install
npm run dev          # http://localhost:3000 (development)

npm run build        # production build
npm start            # http://localhost:3000 (use this on the kiosk)
```

Other checks: `npm run lint`, `npx tsc --noEmit`.

**Kiosk setup:** open the app full-screen in kiosk mode, for example `msedge --kiosk http://localhost:3000 --edge-kiosk-type=fullscreen` or `chrome --kiosk http://localhost:3000`. 

**Responsive layout:**
- **Landscape screens 1024px and wider** (kiosk, laptop) get the two-column layout: content on the left, patient and puzzle on the right. Type and spacing scale with the viewport, so the 1920×1080 composition fits any landscape size without scrolling.
- **Portrait or narrower screens** (tablet, phone) stack the patient above the content and scroll. On the question screens, the patient and puzzle sit side by side so the question stays near the top.
- The breakpoint is the `wide:` Tailwind variant in `app/globals.css`.
- The built-in keyboard for name entry appears only on the kiosk layout. Other devices use their own keyboard.

**Offline:** the game, fonts, artwork, voice-over and sound all run locally. Only the optional shared leaderboard needs a network connection.

## Configuration

| What | Where |
|---|---|
| Case bank (2 OPD + 2 IPD cases, 4 questions each), answer keys, rationales | `data/cases.ts` (from the client's "MIQNAF Cases_NAPCON" document) |
| On-screen copy and voice-over scripts | `data/copy.ts` |
| MIQNAF logo, puzzle artwork, scientific message, Learn More content, QR code | `data/brand.ts` |
| Logo image files | `public/images/miqnaf-logo.png` and `miqnaf-puzzle.png`, generated from the supplied logo by `python scripts/prepare-logo.py <logo.jpg>` |
| Kiosk behaviour (leaderboard size, idle timeout, auto-advance, sound default) | `KIOSK` in `data/brand.ts` |
| Brand colours | `@theme` in `app/globals.css` and `BRAND_COLORS` in `data/brand.ts` (#9A1F24 / #28397F / #E7A900) |

### Leaderboard: shared (Supabase) or demo

- **Demo (default):** if no Supabase credentials are set, scores are saved only in this browser. The leaderboard shows the note "Demo leaderboard. Scores are saved on this device only." Demo scores are **not** shared between kiosks.
- **Shared:**
  1. Run `supabase/schema.sql` in the Supabase SQL editor.
  2. Copy `.env.example` to `.env.local` and set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
  3. Rebuild and restart.

  The key is read only by the server route `app/api/leaderboard/route.ts`, never in the browser. Row Level Security is on with no public policies.
- **Validation:** submissions are checked on the server against `lib/leaderboard/validate.ts`:
  - name of 2 to 32 characters (letters, spaces, `.`, `-`, `'`)
  - OPD or IPD
  - all 4 pieces unlocked
  - plausible time
- **Failures:** if the database is unreachable, the leaderboard shows an error with a Retry button and the game keeps working.
- **Ranking:**
  - by completion time, fastest first
  - ties are broken by fewer wrong attempts, then by earliest submission

### Fonts

The supplied fonts are in `public/fonts/`:

| File | Used for |
|---|---|
| `AcuminVariableConcept.otf` | headlines, titles, large numbers |
| `HelveticaNeue.ttc` | questions, answers, body text, buttons |
| `JT-Distressed.ttf` | not used; a distressed face doesn't suit the clean UI |

The app loads converted copies from `public/fonts/web/`. They come to about 0.95 MB in total; the originals are 5.5 MB. Browsers only read the first face of a `.ttc` collection, which would leave every bold heading faux-bolded. So the Regular, Medium, Bold and Italic weights of Helvetica Neue are extracted as separate WOFF2 files.

If the source fonts change, regenerate the web copies:

```bash
pip install fonttools brotli
python scripts/build-web-fonts.py
```

## How the game works

| Screen | Content (from the approved brief) |
|---|---|
| 1. Attract | "CAN YOU SAVE THIS PATIENT?", OPD/IPD case buttons, START THE CHALLENGE |
| Name entry | "ENTER YOUR NAME" right after START. Built-in on-screen keyboard on the kiosk; other devices use their own keyboard. The name is required and validated. |
| 2. Briefing | "YOUR PATIENT. YOUR DECISION.", the assigned case (e.g. "IPD Case 2" and its title), its clue cards, BEGIN CLINICAL CHALLENGE |
| 3. Deterioration alert | "YOUR PATIENT IS DETERIORATING", puzzle instructions, I'M READY (starts the clock) |
| 4 to 7. Questions 1 to 4 | One question per screen. The case's questions are dealt in a shuffled order and the four options are shuffled for every new game, so the correct answer is not always in the same position; letters A to D follow the displayed order, and the approved wording is unchanged. A correct answer shows the green pop-up (and the rationale, once approved wording is supplied), unlocks the next piece of the MIQNAF logo (left to right) in the HIDDEN IMAGE card under the patient: its gold, locked cover lifts away and the new piece glows gold (`components/HiddenImageCard.tsx`, `components/PuzzleBoard.tsx`), then moves to the next question automatically after 3.5 seconds (no button). A wrong answer shows the red pop-up with TRY AGAIN, keeps the piece locked and disables that option. The participant can always finish. |
| 9. Reveal | The puzzle assembles into the approved MIQNAF logo, then the patient stabilises and the monitor turns green. The score is saved to the leaderboard automatically under the name entered at the start, and the screen shows the rank (with Retry if saving fails). Buttons: VIEW LEADERBOARD, LEARN MORE, PLAY AGAIN. |
| 10. Leaderboard | Top 5 rows, with gold, silver and bronze for the top 3. The participant's own row is highlighted, even when they are outside the top 5. Loading, empty and error states are handled. |
| Learn More | Modal with MIQNAF content from `data/brand.ts` |

**Case sets (exam-style mixing):** each pathway has a bank of cases in `CASES` (`data/cases.ts`). On START the device takes the next ticket from a shared counter on the server (`app/api/session/route.ts`), and `createSessionPlan` in `lib/gameMachine.ts` turns it into a paper set:
- the case alternates with the ticket: player 1 gets Case 1, player 2 Case 2, player 3 Case 1, and so on, across every device playing through the same server;
- players who get the same case get a different question order (all 24 orders are used before one repeats, so 2 cases give 48 distinct sets);
- each question's options are shuffled at random as well.

The counter is held in server memory and starts at a random point. If the server cannot be reached, the device falls back to its own counter (`lib/caseRotation.ts`). To add a case, append it to the pathway's list in `data/cases.ts` with exactly 4 questions.

**Game-style popups:** instructions appear as popups rather than page text:
- **How to play:** four steps, shown when the player starts
- **Review the clues:** shown on the case briefing
- **Patient deteriorating:** an alarm popup with I'M READY
- **Correct or wrong answer:** feedback cards that pop in
- **Completion:** the four pieces assemble into the MIQNAF logo with a confetti burst. It closes after 9 seconds or on SEE MY RESULTS, and closing it stabilises the patient.

**Visual style:** three brand colours plus white, solid fills only (no gradients, no coloured shadows). The page background is white. Crimson #9A1F24 is the accent text colour and the alert highlight (wrong answers, alarms). Royal navy #28397F carries the top header bar, the answer option bars, the MIQNAF logo and body text. Golden yellow #E7A900 marks the primary CTA buttons, the A-D option badges and the jigsaw pieces. Green #15803D highlights a correct answer as an accent only: a green outline, tint and tick on the chosen answer bar, and a green outline, heading and tick on the white feedback panel. The patient scene is a supplied ICU illustration (`public/images/patient-scene.webp`, shown by `components/PatientScene.tsx`) in a white game-screen panel with a navy outline. The illustration's monitor screen is redrawn live: a scrolling ECG, heart and status word (ALERT, IMPROVING, STABLE) that follow the game. Buttons and answer bars nudge down when tapped, and the case clues are white case-note cards. Exceptions: the approved MIQNAF logo artwork appears unchanged, and the monitor trace keeps the brief's required red, yellow and green on its black screen.

**Patient and monitor states:**

| Stage | Patient | ECG |
|---|---|---|
| Attract, briefing, alert, question 1 | illustration (resting, on oxygen) | red, ALERT |
| Questions 2 to 4 | illustration | gold, IMPROVING |
| Reveal (after the completion popup) | recovered illustration fades in: awake, smiling, propped up | green |

Until the reveal, progress is shown on the illustration's live monitor; the recovered illustration (`public/images/patient-recovered.webp`) has its own monitor, which shows vitals. The monitor shows no numbers, only the status words ALERT, IMPROVING or STABLE. For 4K screens, supply the illustration at 2048x3072 or larger and replace `public/images/patient-scene.webp`.

**Timing:** the clock counts time spent on active questions, from I'M READY until the 4th correct answer. It pauses while the correct-answer pop-up is open, so reading the rationale doesn't cost time. Time spent after a wrong answer still counts.

**Kiosk safeguards:**
- After 75 seconds without input (120 seconds on name entry), a 10-second "Still there, Doctor?" countdown appears, then the game returns to the attract screen.
- The restart button asks for confirmation during a game.
- Tap targets stay large at every size; nothing depends on hover.
- Pinch-zoom and the context menu are disabled.
- Animation is reduced when the system's reduced-motion setting is on.

**Code structure:**

```
app/                 page, layout, API route, global design system (fonts, fluid scale, breakpoint)
components/          GameShell, PatientScene (illustration + live monitor), ECGTrace, PuzzleBoard, screens/, question/, entry/
data/                cases.ts, copy.ts, brand.ts (editable content)
hooks/               useGame (state + sound), useIdleReset, useLeaderboard, useMediaQuery, useNow
lib/                 gameMachine.ts (pure reducer), visualStage.ts, puzzle.ts, ecg.ts, audio.ts, leaderboard/
types/               game and leaderboard types
supabase/schema.sql  database table
scripts/             build-web-fonts.py (fonts to WOFF2), prepare-logo.py (logo crop and puzzle artwork)
```

Answer checking lives in `lib/gameMachine.ts`, a pure reducer kept separate from the UI. It ignores double taps, repeat unlocks and any action that isn't valid in the current state.

## Content or assets still needed

1. **MIQNAF scientific message.** The brief itself says "[Insert medically and legally approved scientific message.]" That bracketed text is shown until it is replaced. Learn More marks each pending section "Placeholder".
2. **Learn More content:** product and scientific information, prescribing information reference, safety information, QR code link, and any regulatory footnote.
3. **Rationales** for the 16 questions (none are shown until supplied).
4. **Medical review of the question bank.** The developer script marks it "medical review required".
5. **Font licence** confirmation for kiosk and web use.
6. **Header:** shows the MIQNAF logo and "SAVE THE PATIENT"; the NAPCON event name has been removed at the client's request.
7. **Voice-over.** It currently uses the browser's built-in speech synthesis (toggle in the header). For recorded audio, replace `speak()` in `lib/audio.ts`.
8. **Supabase project and credentials,** if scores should be shared across kiosks.

## Verification checklist (run on the actual kiosk hardware)

- [ ] `npm run build && npm start` starts with no errors, and the page loads full-screen in kiosk mode
- [ ] Fonts render: Acumin in headlines, Helvetica Neue in body text and buttons
- [ ] OPD and IPD both start the game, and START without a selection prompts for a case
- [ ] The briefing shows the 4 clues exactly as in the specification
- [ ] Each question matches the specification. A wrong answer shows the red pop-up, TRY AGAIN, and no piece. The right answer shows the green pop-up, the rationale, and exactly one piece.
- [ ] The ECG goes red, then gold (from Q2), then green (on the reveal), and the patient's posture improves at each step
- [ ] The puzzle assembles and the MIQNAF reveal plays. LEARN MORE opens and closes (X, Close button, Esc, or tap outside).
- [ ] Name entry rejects an empty name, then the submitted score appears highlighted on the leaderboard
- [ ] With Supabase configured, scores from two kiosks appear on both, and unplugging the network shows the error state while the game stays playable
- [ ] PLAY AGAIN and the idle timeout both return to a clean attract screen
- [ ] Touch works for every control, voice-over and sound play (tap once first; browsers block audio until then), and the mute toggle works
- [ ] Animations stay smooth on the kiosk GPU for a full session
