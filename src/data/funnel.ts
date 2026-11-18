/**
 * Runtime config + Sweep OS step names.
 *
 * EVENT NAMES MUST MATCH the Father Figure funnel's Steps tab in Sweep OS exactly
 * (case-sensitive). Create these steps in Sweep OS → Funnels → Steps, or rename
 * the values here to match what already exists there.
 */
const env = import.meta.env;

export const config = {
  sweepApiBaseUrl: (env.VITE_SWEEP_API_BASE_URL || 'https://api.sweepai.site').replace(/\/$/, ''),
  sweepFunnelId: env.VITE_SWEEP_FUNNEL_ID || '',
  bookingUrl: env.VITE_BOOKING_URL || '',
  vslUrl: env.VITE_VSL_URL || '',
  postBookingVslUrl: env.VITE_POST_BOOKING_VSL_URL || '',
  clarityProjectId: env.VITE_CLARITY_PROJECT_ID || '',
  blueprintUrl: env.VITE_BLUEPRINT_URL || '',
  confirmPhone: env.VITE_CONFIRM_PHONE || '',
} as const;

export const EVENTS = {
  /** Front cover page viewed. */
  pageView: 'page_view',
  /** VSL started playing (first play only per session). */
  vslPlay: 'vsl_play',
  /** First quiz answer selected. */
  quizStart: 'quiz_start',
  /** Each quiz screen reached — metadata.step / metadata.question_id. */
  quizStep: 'quiz_step',
  /** Application submitted (qualified OR disqualified). Idempotent. */
  formSubmit: 'form_submit',
  /** Disqualified — routed to free Blueprint instead of calendar. */
  disqualified: 'quiz_disqualified',
  /** /booking page viewed by a qualified applicant. */
  bookingView: 'booking_page_view',
  /** Call booked (calendar event detected or self-confirmed). Idempotent. */
  callBooked: 'call_booked',
  /** /post-booking page viewed. */
  postBookingView: 'post_booking_view',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
