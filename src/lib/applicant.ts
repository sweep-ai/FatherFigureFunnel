/** Applicant handoff between quiz → /booking → /post-booking (sessionStorage only). */
const KEY = 'fff_applicant';

export type Applicant = {
  name: string;
  email: string;
  phone: string;
  qualified: boolean;
  submittedAt: string;
};

export function saveApplicant(a: Applicant) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* storage blocked */
  }
}

export function loadApplicant(): Applicant | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Applicant) : null;
  } catch {
    return null;
  }
}
