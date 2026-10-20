import type { ClinicalCase, Pathway } from "@/types/game";

/**
 * Clinical content from the client's "MIQNAF Cases_NAPCON" document: two IPD and two OPD cases,
 * four questions each. Questions, options and answer keys are verbatim; the clue cards split each
 * case narrative into short sections without changing its wording. Rationales are still pending.
 *
 * Do not edit wording here without medical/legal sign-off.
 */
const IPD_CASES: ClinicalCase[] = [
  {
    id: "ipd-1",
    title: "The Macrolide-Resistant Atypical Pneumonia",
    clues: [
      {
        id: "profile",
        label: "Patient profile",
        value: "68-year-old male with Type 2 Diabetes and Hypertension.",
        icon: "profile",
      },
      {
        id: "symptoms",
        label: "Presenting symptoms",
        value: "7-day history of fever, cough, and worsening breathlessness.",
        icon: "symptoms",
      },
      {
        id: "admission",
        label: "On admission",
        value: "SpO₂ 86% on room air; CURB-65 score 3. Placed on 4 L/min O₂.",
        icon: "vitals",
      },
      {
        id: "lab",
        label: "Investigations",
        value: "CRP highly elevated at 168 mg/L. Respiratory panel detects Mycoplasma pneumoniae.",
        icon: "lab",
      },
      {
        id: "treatment",
        label: "Treatment so far",
        value:
          "Empiric IV Ceftriaxone + Azithromycin. After 3 days, no clinical improvement (persistent fever, high CRP, ongoing oxygen dependence).",
        icon: "treatment",
      },
    ],
    questions: [
      {
        id: "ipd-1-q1",
        question:
          "Given the failure of the initial beta-lactam + macrolide regimen in this atypical pneumonia, what is the most appropriate pharmacological rationale for your next step in therapy?",
        options: [
          { key: "A", text: "Escalate the beta-lactam to a carbapenem to ensure broader gram-negative coverage." },
          {
            key: "B",
            text: "Switch to an agent that overcomes structural ribosomal resistance in atypicals, such as a novel lactone like Nafithromycin or a respiratory fluoroquinolone.",
          },
          { key: "C", text: "Add IV Aminoglycosides to the current regimen to achieve synergistic bactericidal activity." },
          { key: "D", text: "Double the dose of Azithromycin to overcome concentration-dependent resistance." },
        ],
        correctOption: "B",
        explanation: "",
      },
      {
        id: "ipd-1-q2",
        question:
          "Mycoplasma pneumoniae is increasingly showing macrolide resistance in the community. What is the primary molecular mechanism driving this clinical failure against standard azithromycin?",
        options: [
          { key: "A", text: "Efflux pump overexpression (mefA gene)." },
          { key: "B", text: "Target site modification via 23S rRNA point mutations." },
          { key: "C", text: "Beta-lactamase production cross-reacting with macrolide rings." },
          { key: "D", text: "Reduced outer membrane porin permeability." },
        ],
        correctOption: "B",
        explanation: "",
      },
      {
        id: "ipd-1-q3",
        question: "How does Nafithromycin overcome target-site macrolide resistance in atypical CABP pathogens?",
        options: [
          { key: "A", text: "By acting as a competitive inhibitor of DNA gyrase." },
          { key: "B", text: "Through dual-anchoring to both Domains II and V of the 23S rRNA." },
          { key: "C", text: "By irreversibly binding to the 30S ribosomal subunit." },
          { key: "D", text: "By upregulating host macrophage phagocytosis." },
        ],
        correctOption: "B",
        explanation: "",
      },
      {
        id: "ipd-1-q4",
        question:
          "What key pharmacokinetic property of Nafithromycin drives rapid clinical recovery in pulmonary infections?",
        options: [
          { key: "A", text: "It remains strictly within the intravascular space." },
          { key: "B", text: "It is rapidly excreted by the kidneys." },
          { key: "C", text: "It achieves exceptionally high concentrations in the Epithelial Lining Fluid (ELF)." },
          { key: "D", text: "It binds tightly to plasma proteins to form a depot." },
        ],
        correctOption: "C",
        explanation: "",
      },
    ],
  },
  {
    id: "ipd-2",
    title: "The Beta-Lactam Unresponsive Pneumococcal Pneumonia",
    clues: [
      {
        id: "profile",
        label: "Patient profile",
        value: "42-year-old pre-diabetic female.",
        icon: "profile",
      },
      {
        id: "symptoms",
        label: "Presenting symptoms",
        value: "High-grade fever, breathlessness, and a cough producing rusty sputum for 5 days.",
        icon: "symptoms",
      },
      {
        id: "imaging",
        label: "CT Chest",
        value: "Right middle lobe and left lower lobe consolidation with prominent air bronchograms.",
        icon: "xray",
      },
      {
        id: "lab",
        label: "Investigations",
        value: "TLC 15,200/µL; CRP 124 mg/L. Respiratory panel confirms Streptococcus pneumoniae.",
        icon: "lab",
      },
      {
        id: "treatment",
        label: "Treatment so far",
        value:
          "Oral Amoxicillin-Clavulanate (625mg BID) prescribed by a GP 4 days ago; no clinical improvement.",
        icon: "treatment",
      },
    ],
    questions: [
      {
        id: "ipd-2-q1",
        question:
          "The patient failed outpatient Amoxicillin-Clavulanate despite it being a standard empiric choice. Considering the confirmed pneumococcal etiology, what is the most likely reason for this clinical failure?",
        options: [
          { key: "A", text: "Inactivation of the antibiotic by atypical beta-lactamases not covered by clavulanate." },
          {
            key: "B",
            text: "Alterations in the pathogen's Penicillin-Binding Proteins (PBPs) conferring resistance, or suboptimal tissue penetration of the oral dose.",
          },
          { key: "C", text: "Patient's pre-diabetic status drastically reducing gastrointestinal absorption of beta-lactams." },
          { key: "D", text: "Rapid renal clearance of the drug preventing steady-state therapeutic levels." },
        ],
        correctOption: "B",
        explanation: "",
      },
      {
        id: "ipd-2-q2",
        question:
          "The patient's presentation includes “rusty sputum.” In the context of Streptococcus pneumoniae CABP, this clinical hallmark is most directly a result of:",
        options: [
          { key: "A", text: "Massive hemoptysis from a ruptured bronchial artery." },
          {
            key: "B",
            text: "Lysis of red blood cells that have leaked into the alveolar spaces during the acute inflammatory exudative phase.",
          },
          { key: "C", text: "The direct production of red-pigmented toxins by the pneumococcal bacteria." },
          { key: "D", text: "Chronic irritation and shedding of the tracheal epithelium." },
        ],
        correctOption: "B",
        explanation: "",
      },
      {
        id: "ipd-2-q3",
        question:
          "Now you decide to admit her and initiate Nafithromycin 800mg OD. What is the standard recommended duration of therapy for this agent in uncomplicated CABP to ensure maximal compliance while minimizing resistance pressure?",
        options: [
          { key: "A", text: "3 days" },
          { key: "B", text: "5 days" },
          { key: "C", text: "7 days" },
          { key: "D", text: "10 days" },
        ],
        correctOption: "A",
        explanation: "",
      },
      {
        id: "ipd-2-q4",
        question:
          "What is the primary clinical advantage of using Nafithromycin as a monotherapy for multidrug-resistant typicals?",
        options: [
          { key: "A", text: "It allows for an immediate step-down to oral cephalosporins." },
          { key: "B", text: "It provides comprehensive coverage without the need for adjunctive antibiotics." },
          { key: "C", text: "It acts as a purely anti-inflammatory agent alongside beta-lactams." },
          { key: "D", text: "It provides targeted coverage strictly against anaerobes." },
        ],
        correctOption: "B",
        explanation: "",
      },
    ],
  },
];

const OPD_CASES: ClinicalCase[] = [
  {
    id: "opd-1",
    title: "The Vulnerable Elderly with COPD",
    clues: [
      {
        id: "profile",
        label: "Patient profile",
        value: "66-year-old female; known case of COPD and Diabetes Mellitus on regular inhalers and oral hypoglycemics.",
        icon: "profile",
      },
      {
        id: "symptoms",
        label: "Presenting symptoms",
        value: "3-day history of fever and productive cough with purulent sputum.",
        icon: "symptoms",
      },
      {
        id: "xray",
        label: "Chest X-ray",
        value: "Right lower zone consolidation.",
        icon: "xray",
      },
      {
        id: "lab",
        label: "Investigations",
        value: "TLC 15,700/µL (91% neutrophils); CRP 76 mg/L.",
        icon: "lab",
      },
      {
        id: "setting",
        label: "Setting",
        value: "Presents to the OPD. You are evaluating her for outpatient management.",
        icon: "setting",
      },
    ],
    questions: [
      {
        id: "opd-1-q1",
        question:
          "When selecting an oral empiric antibiotic for this elderly patient with structural lung disease (COPD) and diabetes, which pharmacokinetic/pharmacodynamic profile is most critical?",
        options: [
          { key: "A", text: "High renal clearance to protect hepatic function." },
          {
            key: "B",
            text: "Excellent penetration into the Epithelial Lining Fluid (ELF) and alveolar macrophages with coverage against both typicals and atypicals.",
          },
          { key: "C", text: "High systemic serum trough levels maintained for at least 14 days." },
          { key: "D", text: "Solely concentration-dependent killing restricted to the intravascular space." },
        ],
        correctOption: "B",
        explanation: "",
      },
      {
        id: "opd-1-q2",
        question:
          "As a pulmonologist, which objective scoring tool would you utilize in the OPD to confidently justify managing this comorbid patient at home rather than admitting her?",
        options: [
          { key: "A", text: "APACHE II Score" },
          { key: "B", text: "SOFA Score" },
          { key: "C", text: "CRB-65 or the Pneumonia Severity Index (PSI)" },
          { key: "D", text: "BODE Index" },
        ],
        correctOption: "C",
        explanation: "",
      },
      {
        id: "opd-1-q3",
        question: "How does Nafithromycin's dosing schedule directly improve outpatient compliance?",
        options: [
          { key: "A", text: "By utilizing a strict weight-based tapering schedule." },
          { key: "B", text: "By offering a convenient, once-daily oral dosing for just 3 days." },
          { key: "C", text: "By requiring administration strictly with acidic meals." },
          { key: "D", text: "By alternating IV and oral administration." },
        ],
        correctOption: "B",
        explanation: "",
      },
      {
        id: "opd-1-q4",
        question:
          "To ensure outpatient therapy is successful, what is the ideal time frame to schedule her first follow-up tele-consultation or clinic visit to assess the response to the initial antibiotic dose?",
        options: [
          { key: "A", text: "12 hours" },
          { key: "B", text: "48 to 72 hours" },
          { key: "C", text: "5 days" },
          { key: "D", text: "7 to 10 days" },
        ],
        correctOption: "B",
        explanation: "",
      },
    ],
  },
  {
    id: "opd-2",
    title: "The Young Adult with H. influenzae",
    clues: [
      {
        id: "profile",
        label: "Patient profile",
        value: "20-year-old female with no underlying comorbidities.",
        icon: "profile",
      },
      {
        id: "symptoms",
        label: "Presenting symptoms",
        value: "3-day history of cough and a 1-day history of intermittent fever.",
        icon: "symptoms",
      },
      {
        id: "exam",
        label: "On auscultation",
        value: "Fine end-inspiratory crackles localized over the right lower lobe.",
        icon: "exam",
      },
      {
        id: "imaging",
        label: "Chest X-ray and CT",
        value: "Right lower lobe consolidation.",
        icon: "xray",
      },
      {
        id: "lab",
        label: "Investigations",
        value: "TLC 18,200/µL; CRP 64 mg/L. Bronchial wash multiplex PCR detects Haemophilus influenzae.",
        icon: "lab",
      },
    ],
    questions: [
      {
        id: "opd-2-q1",
        question:
          "Haemophilus influenzae is a gram-negative pathogen frequently implicated in CABP. Why are older macrolides (e.g., Erythromycin) sub-optimal against Haemophilus influenzae?",
        options: [
          { key: "A", text: "Poor intracellular penetration." },
          { key: "B", text: "Higher MICs and weaker intrinsic activity." },
          { key: "C", text: "Deactivation by mucosal enzymes." },
          { key: "D", text: "Exclusive gram-positive coverage." },
        ],
        correctOption: "B",
        explanation: "",
      },
      {
        id: "opd-2-q2",
        question:
          "Why does Nafithromycin succeed against Haemophilus influenzae where older macrolides typically exhibit weak intrinsic activity?",
        options: [
          { key: "A", text: "It neutralizes gram-negative endotoxins directly." },
          {
            key: "B",
            text: "Its novel lactone-ketolide structure ensures lower MICs and potent intrinsic bactericidal-like activity.",
          },
          { key: "C", text: "It exclusively inhibits outer membrane porin synthesis." },
          { key: "D", text: "It relies on synergistic activation by the host's immune system." },
        ],
        correctOption: "B",
        explanation: "",
      },
      {
        id: "opd-2-q3",
        question:
          "Which pharmacokinetic advantage allows Nafithromycin to effectively resolve dense consolidations with just a 3-day short-course therapy?",
        options: [
          { key: "A", text: "Rapid induction of hepatic CYP450 enzymes." },
          {
            key: "B",
            text: "Exceptional and sustained drug concentration within the pulmonary Epithelial Lining Fluid (ELF) and alveolar macrophages.",
          },
          { key: "C", text: "Complete intravascular confinement to maintain high serum trough levels." },
          { key: "D", text: "Rapid renal clearance to prevent drug toxicity." },
        ],
        correctOption: "B",
        explanation: "",
      },
      {
        id: "opd-2-q4",
        question:
          "Given her young age and lack of comorbidities, if H. influenzae had not been isolated, which group of pathogens must always be adequately covered by your empiric choice in this demographic?",
        options: [
          { key: "A", text: "Pseudomonas aeruginosa and MRSA." },
          { key: "B", text: "Acinetobacter baumannii and Klebsiella." },
          { key: "C", text: "Atypical pathogens like Mycoplasma pneumoniae and Chlamydophila pneumoniae." },
          { key: "D", text: "Anaerobic bacteria and fungal pathogens." },
        ],
        correctOption: "C",
        explanation: "",
      },
    ],
  },
];

/** Case bank per pathway. Each new game is assigned one case (see `nextCaseIndex` in lib/gameMachine.ts). */
export const CASES: Record<Pathway, ClinicalCase[]> = {
  OPD: OPD_CASES,
  IPD: IPD_CASES,
};

/** One piece per question; every case has exactly this many questions. */
export const PUZZLE_PIECE_COUNT = 4;

export function getCase(pathway: Pathway | null, caseId: string | null): ClinicalCase {
  const bank = CASES[pathway ?? "OPD"];
  return bank.find((c) => c.id === caseId) ?? bank[0];
}

/** 1-based number of a case within its pathway, for display ("IPD Case 2"). */
export function caseNumber(pathway: Pathway | null, caseId: string | null): number {
  const index = CASES[pathway ?? "OPD"].findIndex((c) => c.id === caseId);
  return index < 0 ? 1 : index + 1;
}
