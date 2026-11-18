import { useEffect, useRef } from 'react';
import { VSLPlayer } from '../components/VSLPlayer';
import { postBooking } from '../data/copy';
import { EVENTS, config } from '../data/funnel';
import { trackEvent } from '../lib/sweep';

/** Surface C — show-rate optimizer (noindex). Mandatory steps, not a thank-you page. */
export default function PostBookingPage() {
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    void trackEvent(EVENTS.postBookingView, {});
  }, []);

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const [watch, confirm, calendar] = postBooking.steps;

  return (
    <section className="section-tight">
      <div className="container">
        <h1 className="display text-center">{postBooking.title}</h1>
        <p className="mandatory text-center">
          <strong>MANDATORY:</strong> {postBooking.mandatory}
        </p>

        <div className="pb-step">
          <span className="pill">{watch.label}</span>
          <h2>{watch.title}</h2>
          <p>{watch.body}</p>
          <VSLPlayer
            src={config.postBookingVslUrl}
            label="What to expect on your Comeback Call"
            onFirstPlay={() => void trackEvent(EVENTS.vslPlay, { placement: 'post_booking' })}
          />
        </div>

        <div className="pb-step">
          <span className="pill">{confirm.label}</span>
          <h2>{confirm.title}</h2>
          <p>
            {confirm.body}
            {config.confirmPhone && (
              <>
                {' '}
                Save our number: <a href={`tel:${config.confirmPhone}`}>{config.confirmPhone}</a>
              </>
            )}
          </p>
        </div>

        <div className="pb-step">
          <span className="pill">{calendar.label}</span>
          <h2>{calendar.title}</h2>
          <p>{calendar.body}</p>
        </div>

        <div className="pb-step faq">
          <span className="pill">Step 4</span>
          <h2>{postBooking.faqTitle}</h2>
          {postBooking.faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>

        <div className="pb-step">
          <span className="pill">Step 5</span>
          <h2>{postBooking.prepTitle}</h2>
          <ul className="prep">
            {postBooking.prep.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
