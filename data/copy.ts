/**
 * On-screen copy and voice-over scripts. Wording marked "spec" is taken verbatim
 * from the approved Screen-by-Screen Content brief; other strings are UI microcopy.
 */
export const COPY = {
  header: "SAVE THE PATIENT", // spec title; the MIQNAF logo replaces the event name
  attract: {
    kicker: "SAVE THE PATIENT",
    headline: "CAN YOU SAVE THIS PATIENT?", // spec
    subheadline: "Every second counts. Every decision matters.", // spec
    choosePrompt: "Choose your case",
    opd: { label: "1. OPD CASE", hint: "Outpatient department" }, // label: spec
    ipd: { label: "2. IPD CASE", hint: "Inpatient department" }, // label: spec
    start: "START THE CHALLENGE", // spec
    selectFirst: "Select a case to begin",
  },
  howToPlay: {
    kicker: "Mission briefing",
    title: "How to play",
    steps: [
      "Review the patient's clinical clues.",
      "Answer 4 clinical questions.",
      "Each correct answer unlocks a piece of the hidden image.", // spec
      "Finish fast to top the leaderboard.",
    ],
    button: "GOT IT",
  },
  briefing: {
    popupKicker: "Step 1",
    popupTitle: "Review the clues",
    reviewAgain: "VIEW CLUES",
    heading: "YOUR PATIENT. YOUR DECISION.", // spec
    prompt: "Review the clinical clues carefully. Your challenge starts now.", // spec
    button: "BEGIN CLINICAL CHALLENGE", // spec
  },
  deterioration: {
    kicker: "Alert",
    alert: "YOUR PATIENT IS DETERIORATING", // spec
    lead: "Doctor, the patient's condition requires your attention.", // spec (VO, first sentence)
    instruction:
      "Each correct answer unlocks a piece of the hidden image. Complete the puzzle to reveal the final scientific message.", // spec
    button: "I'M READY", // spec
  },
  question: {
    correct: "Correct! You've unlocked a piece of the puzzle.", // spec
    milestone: "CLINICAL MILESTONE ACHIEVED",
    incorrect: "Not quite! Review the clinical clues and try again.", // spec
    tryAgain: "TRY AGAIN", // spec
    reviewClues: "REVIEW CLUES",
  },
  completion: {
    kicker: "PUZZLE COMPLETED!", // spec
    title: "CHALLENGE COMPLETE!", // spec
    button: "SEE MY RESULTS",
  },
  recovery: {
    puzzleCompleted: "PUZZLE COMPLETED!", // spec
    scientificReveal: "THE SCIENTIFIC REVEAL", // spec
    challengeComplete: "CHALLENGE COMPLETE!", // spec
    stabilised: "PATIENT STABILIZED",
    simulationNote: "Game simulation only. Not a real patient outcome.",
    viewLeaderboard: "VIEW LEADERBOARD",
    saving: "Saving your time to the leaderboard",
    saved: "Your time is on the leaderboard",
    saveFailed: "Your time could not be saved.",
    learnMore: "LEARN MORE", // spec
    playAgain: "PLAY AGAIN", // spec
  },
  entry: {
    heading: "ENTER YOUR NAME",
    lead: "Your name and time will appear on the leaderboard.",
    privacy: "Display name only. Please do not enter contact or patient details.",
    submit: "CONTINUE",
  },
  leaderboard: {
    heading: "Clinical Challenge Leaderboard", // Figure 2
    headingAccent: "Fastest Doctors", // spec
    sub: "Doctors who stabilized the patient and unlocked all 4 Miqnaf puzzle pieces", // Figure 2
    empty: "No times recorded yet. Be the first doctor to save the patient!",
    error: "The leaderboard could not be loaded.",
    demoBadge: "Demo leaderboard. Scores are saved on this device only.",
  },
} as const;

export const VOICE_OVER = {
  attract:
    "Doctor, your patient is deteriorating. You have a clinical challenge to solve. Answer the questions, complete the puzzle, and save your patient.",
  deterioration:
    "Doctor, the patient's condition requires your attention. Solve the puzzle by answering the clinical questions correctly.",
  recovery:
    "Well done, Doctor! You've completed the clinical challenge. Every clinical clue matters. Recognizing the infection, assessing the patient's condition and selecting appropriate treatment are essential steps in clinical decision-making.",
} as const;

export type VoiceOverId = keyof typeof VOICE_OVER;
