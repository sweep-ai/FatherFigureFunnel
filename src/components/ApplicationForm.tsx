import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buildQuizAnswers,
  emptyContact,
  getDisqualifyReason,
  normalizePhone,
  quizSteps,
  validateContact,
  type Answers,
  type ChoiceQuestion,
  type ContactInfo,
  type TextQuestion,
} from '../data/applicationForm';
import { brand } from '../data/assets';
import { CTA_LABEL, dq, quiz } from '../data/copy';
import { EVENTS, config } from '../data/funnel';
import { saveApplicant } from '../lib/applicant';
import { getSessionId, submitLead, trackEvent } from '../lib/sweep';
import { FORM_ID } from './Layout';

const AUTO_ADVANCE_MS = 450;
const SUBMIT_GUARD_KEY = 'fff_submitted_at';

type Status = 'idle' | 'submitting' | 'disqualified';

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | undefined> {
  return Promise.race([p, new Promise<undefined>((r) => setTimeout(() => r(undefined), ms))]);
}

export function ApplicationForm() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState<ContactInfo>(emptyContact);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInfo | 'text', string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState('');
  const started = useRef(false);
  const advanceTimer = useRef<number>();
  const promptRef = useRef<HTMLParagraphElement>(null);

  const step = quizSteps[index];
  const total = quizSteps.length;

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  // Track each quiz screen reached (after the first interaction) + move focus to the prompt for screen readers.
  useEffect(() => {
    if (started.current) {
      void trackEvent(EVENTS.quizStep, { step: index + 1, question_id: step.id });
      promptRef.current?.focus();
    }
  }, [index, step.id]);

  const markStarted = () => {
    if (!started.current) {
      started.current = true;
      void trackEvent(EVENTS.quizStart, { form_id: 'fff-application' });
    }
  };

  const go = (next: number) => {
    setDir(next > index ? 'fwd' : 'back');
    setErrors({});
    setIndex(Math.max(0, Math.min(total - 1, next)));
  };

  const choose = (q: ChoiceQuestion, code: string) => {
    markStarted();
    setAnswers((a) => ({ ...a, [q.id]: code }));
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => go(index + 1), AUTO_ADVANCE_MS);
  };

  const nextFromText = (q: TextQuestion) => {
    const val = (answers[q.id] ?? '').trim();
    if (val.length < q.minLength) {
      setErrors({ text: 'Give us a little more detail — a sentence is perfect.' });
      return;
    }
    markStarted();
    go(index + 1);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;
    setFormError('');

    // Honeypot: bots fill hidden fields. Pretend success, send nothing.
    if (contact.company.trim()) {
      setStatus('disqualified');
      return;
    }

    const v = validateContact(contact);
    setErrors(v);
    if (Object.keys(v).length) return;

    // Client-side rate limit: one submit per 30s per tab.
    try {
      const last = Number(sessionStorage.getItem(SUBMIT_GUARD_KEY) || 0);
      if (Date.now() - last < 30_000) {
        setFormError('Already submitted — hang tight a moment.');
        return;
      }
      sessionStorage.setItem(SUBMIT_GUARD_KEY, String(Date.now()));
    } catch {
      /* storage blocked */
    }

    setStatus('submitting');
    const phone = normalizePhone(contact.phone) as string;
    const dqReason = getDisqualifyReason(answers);
    const qualified = !dqReason;
    const quizAnswers = buildQuizAnswers(answers);
    const submittedAt = new Date().toISOString();

    const flat = quizAnswers.flat as Record<string, string>;
    const notes = [
      `FFF application — ${qualified ? 'QUALIFIED' : `DISQUALIFIED (${dqReason})`}`,
      `Stage: ${flat.dad_stage}`,
      `Obstacle: ${flat.obstacle}`,
      `90-day goal: ${flat.goal}`,
      `Why now: ${flat.why}`,
      `Start: ${flat.readiness}`,
      `Investment: ${flat.investment}`,
      contact.occupation ? `Work: ${contact.occupation}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    void trackEvent(
      EVENTS.formSubmit,
      { form_id: 'fff-application', qualified, dq_reason: dqReason },
      `form_submit_${getSessionId()}_fff-application`,
    );

    const lead = submitLead({
      name: contact.name.trim(),
      email: contact.email.trim().toLowerCase(),
      phone,
      instagram: contact.instagram.trim() || undefined,
      source: 'vsl_application',
      funnel_step_reached: EVENTS.formSubmit,
      notes,
      quiz_answers: {
        ...quizAnswers,
        occupation: contact.occupation.trim() || null,
        lead_status: qualified ? 'qualified' : 'disqualified',
        dq_reason: dqReason,
        submitted_at: submittedAt,
      },
      opt_in_data: {
        sms_email_consent: true,
        consent_text: quiz.consent,
        consented_at: submittedAt,
        page_url: window.location.href,
      },
    });
    // Never block the lead on a slow API — give it a moment, then move on.
    await withTimeout(lead, 4000);

    saveApplicant({ name: contact.name.trim(), email: contact.email.trim(), phone, qualified, submittedAt });

    if (qualified) {
      navigate('/booking');
    } else {
      void trackEvent(EVENTS.disqualified, { dq_reason: dqReason });
      setStatus('disqualified');
    }
  };

  if (status === 'disqualified') {
    return (
      <section id={FORM_ID} className="apply section-tight" aria-live="polite">
        <div className="container">
          <div className="form-panel dq">
            <img src={brand.dadComeback} alt="Dad Comeback" loading="lazy" />
            <h2 className="display">{dq.title}</h2>
            <p>{dq.body}</p>
            {config.blueprintUrl ? (
              <a className="btn btn-block" href={config.blueprintUrl} target="_blank" rel="noopener noreferrer">
                {dq.cta} →
              </a>
            ) : (
              <p>{dq.fallback}</p>
            )}
            <p style={{ fontSize: '0.85rem', marginTop: 16 }}>{dq.footnote}</p>
          </div>
        </div>
      </section>
    );
  }

  const set = <K extends keyof ContactInfo>(k: K, val: ContactInfo[K]) => setContact((c) => ({ ...c, [k]: val }));

  return (
    <section id={FORM_ID} className="apply section-tight" aria-labelledby="apply-title">
      <div className="container">
        <div className="form-panel">
          <div className="form-head">
            <h2 id="apply-title" className="display">
              {quiz.title}
            </h2>
            <p>{quiz.subtitle}</p>
          </div>

          <div className="progress" aria-hidden="true">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
            </div>
            <span>
              {index + 1} / {total}
            </span>
          </div>

          <div key={step.id} className={`step ${dir === 'back' ? 'back' : ''}`}>
            <p className="step-prompt" ref={promptRef} tabIndex={-1}>
              <span className="sr-only">
                Question {index + 1} of {total}:{' '}
              </span>
              {step.prompt}
            </p>
            {step.helper && <p className="step-helper">{step.helper}</p>}

            {step.type === 'single' && (
              <div className="options" role="group" aria-label={step.prompt}>
                {step.options.map((o) => {
                  const selected = answers[step.id] === o.code;
                  return (
                    <button
                      key={o.code}
                      type="button"
                      className="option"
                      aria-pressed={selected}
                      onClick={() => choose(step, o.code)}
                    >
                      <span>{o.label}</span>
                      <span className="check" aria-hidden="true">
                        {selected ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {step.type === 'text' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  nextFromText(step);
                }}
              >
                <label htmlFor={`q-${step.id}`} className="sr-only">
                  {step.prompt}
                </label>
                <textarea
                  id={`q-${step.id}`}
                  className="textarea"
                  placeholder={step.placeholder}
                  value={answers[step.id] ?? ''}
                  maxLength={600}
                  aria-invalid={!!errors.text}
                  aria-describedby={errors.text ? `q-${step.id}-err` : undefined}
                  onChange={(e) => setAnswers((a) => ({ ...a, [step.id]: e.target.value }))}
                  autoFocus
                />
                {errors.text && (
                  <span id={`q-${step.id}-err`} className="error">
                    {errors.text}
                  </span>
                )}
                <div className="step-nav">
                  <button type="button" className="link-btn" onClick={() => go(index - 1)}>
                    ← Back
                  </button>
                  <button type="submit" className="btn">
                    Next →
                  </button>
                </div>
              </form>
            )}

            {step.type === 'contact' && (
              <form onSubmit={onSubmit} noValidate>
                <div className="field">
                  <label htmlFor="f-name">Full name</label>
                  <input
                    id="f-name"
                    className="input"
                    autoComplete="name"
                    value={contact.name}
                    aria-invalid={!!errors.name}
                    onChange={(e) => set('name', e.target.value)}
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>
                <div className="field">
                  <label htmlFor="f-email">Email</label>
                  <input
                    id="f-email"
                    className="input"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={contact.email}
                    aria-invalid={!!errors.email}
                    onChange={(e) => set('email', e.target.value)}
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="field">
                  <label htmlFor="f-work">
                    What do you do for work? <span className="opt">(optional)</span>
                  </label>
                  <input
                    id="f-work"
                    className="input"
                    autoComplete="organization-title"
                    value={contact.occupation}
                    onChange={(e) => set('occupation', e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="f-ig">
                    Instagram handle <span className="opt">(optional)</span>
                  </label>
                  <input
                    id="f-ig"
                    className="input"
                    placeholder="@"
                    autoCapitalize="none"
                    value={contact.instagram}
                    onChange={(e) => set('instagram', e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="f-phone">Mobile phone</label>
                  <input
                    id="f-phone"
                    className="input"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={contact.phone}
                    aria-invalid={!!errors.phone}
                    onChange={(e) => set('phone', e.target.value)}
                  />
                  {errors.phone && <span className="error">{errors.phone}</span>}
                </div>

                <div className="hp" aria-hidden="true">
                  <label htmlFor="f-company">Company</label>
                  <input
                    id="f-company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={contact.company}
                    onChange={(e) => set('company', e.target.value)}
                  />
                </div>

                <label className="consent">
                  <input
                    type="checkbox"
                    checked={contact.consent}
                    aria-invalid={!!errors.consent}
                    onChange={(e) => set('consent', e.target.checked)}
                  />
                  <span>{quiz.consent}</span>
                </label>
                {errors.consent && <span className="error">{errors.consent}</span>}

                <div className="step-nav">
                  <button type="button" className="link-btn" onClick={() => go(index - 1)}>
                    ← Back
                  </button>
                </div>
                <button type="submit" className="btn btn-block" disabled={status === 'submitting'}>
                  {status === 'submitting' ? quiz.submitting : `${CTA_LABEL} →`}
                </button>
                {formError && <p className="form-error">{formError}</p>}
              </form>
            )}

            {step.type === 'single' && index > 0 && (
              <div className="step-nav">
                <button type="button" className="link-btn" onClick={() => go(index - 1)}>
                  ← Back
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
