/**
 * Application quiz — built per Sweep "Landing Page Funnel Best Practices" SOP §3A:
 *   Q1 layup (tap) → Q2 problem (tap) → Q3 tangible goal (short text) → Q4 why (short text)
 *   → Q5 readiness (tap, DQ gate) → Q6 investment (tap, DQ gate) → Q7 contact (phone last).
 * Options ordered most-qualified → least-qualified. Bottom option on gates = dignified exit.
 */

export type ChoiceOption = { code: string; label: string; disqualifies?: boolean };

export type ChoiceQuestion = {
  id: string;
  type: 'single';
  prompt: string;
  helper?: string;
  options: ChoiceOption[];
};

export type TextQuestion = {
  id: string;
  type: 'text';
  prompt: string;
  helper?: string;
  placeholder: string;
  minLength: number;
};

export type ContactStep = { id: 'contact'; type: 'contact'; prompt: string; helper?: string };

export type QuizStep = ChoiceQuestion | TextQuestion | ContactStep;

export const quizSteps: QuizStep[] = [
  {
    id: 'dad_stage',
    type: 'single',
    prompt: 'Which best describes you right now?',
    options: [
      { code: 'kids_under_6', label: 'Dad with little ones (under 6)' },
      { code: 'kids_6_12', label: 'Dad with kids 6–12' },
      { code: 'kids_teens', label: 'Dad with teenagers' },
      { code: 'kids_grown', label: 'Grown kids or grandkids' },
      { code: 'not_dad', label: 'Not a dad — but I lead a family' },
    ],
  },
  {
    id: 'obstacle',
    type: 'single',
    prompt: "What's the #1 thing holding you back?",
    options: [
      { code: 'falls_off', label: 'I start strong, then fall off by Thursday' },
      { code: 'no_time', label: 'Work and family eat my whole week' },
      { code: 'low_energy', label: 'No energy — my family gets what’s left' },
      { code: 'nutrition', label: 'My eating is all over the place' },
      { code: 'tried_everything', label: 'I’ve tried everything and nothing sticks' },
    ],
  },
  {
    id: 'goal',
    type: 'text',
    prompt: 'What do you want to look and feel like 90 days from now?',
    helper: 'Be specific. This is what we’ll build your plan around.',
    placeholder: 'e.g. Down 25 lbs, off the couch at night, keeping up with my son at hockey',
    minLength: 8,
  },
  {
    id: 'why',
    type: 'text',
    prompt: 'Why does that matter to you right now?',
    helper: 'What made you click on this today?',
    placeholder: 'e.g. I don’t recognize the guy in the mirror and my kids are noticing',
    minLength: 8,
  },
  {
    id: 'readiness',
    type: 'single',
    prompt: 'If we showed you exactly how to get there, how soon would you start?',
    options: [
      { code: 'now', label: 'Immediately — I’m done waiting for Monday' },
      { code: '30_days', label: 'Within the next 30 days' },
      { code: '1_3_months', label: 'In 1–3 months', disqualifies: true },
      { code: 'looking', label: 'Just looking for now', disqualifies: true },
    ],
  },
  {
    id: 'investment',
    type: 'single',
    prompt: 'Coaching like this is an investment. What are you ready to put into your comeback?',
    helper: 'So we recommend the right option on the call — no surprises.',
    options: [
      { code: '5k_plus', label: '$5,000+ — whatever it takes' },
      { code: '2_5k_5k', label: '$2,500 – $5,000' },
      { code: '1k_2_5k', label: '$1,000 – $2,500' },
      { code: 'under_1k', label: 'Under $1,000 right now', disqualifies: true },
    ],
  },
  {
    id: 'contact',
    type: 'contact',
    prompt: 'Last step — where should we send your call details?',
    helper: 'If you’re a fit, you’ll pick a time for your free Comeback Call on the next screen.',
  },
];

export type ContactInfo = {
  name: string;
  email: string;
  occupation: string;
  instagram: string;
  phone: string;
  consent: boolean;
  /** Honeypot — must stay empty. */
  company: string;
};

export const emptyContact: ContactInfo = {
  name: '',
  email: '',
  occupation: '',
  instagram: '',
  phone: '',
  consent: false,
  company: '',
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (digits.length >= 11 && digits.length <= 15 && raw.trim().startsWith('+')) return `+${digits}`;
  return null;
}

export function validateContact(c: ContactInfo): Partial<Record<keyof ContactInfo, string>> {
  const errors: Partial<Record<keyof ContactInfo, string>> = {};
  if (c.name.trim().split(/\s+/).length < 2) errors.name = 'First and last name, please.';
  if (!EMAIL_RE.test(c.email.trim())) errors.email = 'Enter a valid email.';
  if (!normalizePhone(c.phone)) errors.phone = 'Enter a valid phone number.';
  if (!c.consent) errors.consent = 'Please check the box so we can reach you about your call.';
  return errors;
}

export type Answers = Record<string, string>;

export function getDisqualifyReason(answers: Answers): string | null {
  for (const step of quizSteps) {
    if (step.type !== 'single') continue;
    const opt = step.options.find((o) => o.code === answers[step.id]);
    if (opt?.disqualifies) return `${step.id}:${opt.code}`;
  }
  return null;
}

/** Nested + flat answer payload for Sweep `quiz_answers` (stored on client.meta.prospect). */
export function buildQuizAnswers(answers: Answers) {
  const nested: Record<string, { prompt: string; code?: string; label?: string; text?: string }> = {};
  for (const step of quizSteps) {
    if (step.type === 'single') {
      const opt = step.options.find((o) => o.code === answers[step.id]);
      nested[step.id] = { prompt: step.prompt, code: opt?.code, label: opt?.label };
    } else if (step.type === 'text') {
      nested[step.id] = { prompt: step.prompt, text: answers[step.id] ?? '' };
    }
  }
  const flat = Object.fromEntries(
    Object.entries(nested).map(([k, v]) => [k, v.label ?? v.text ?? '']),
  );
  return { ...nested, flat };
}
