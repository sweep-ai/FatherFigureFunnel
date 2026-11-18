import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookingEmbed } from '../components/BookingEmbed';
import { ApplyButton } from '../components/Layout';
import { ScrollingBanner } from '../components/Proof';
import { transformations } from '../data/assets';
import { booking } from '../data/copy';
import { EVENTS, config } from '../data/funnel';
import { loadApplicant } from '../lib/applicant';
import { getSessionId, trackEvent } from '../lib/sweep';

/** Surface B — qualified applicants only. Congrats → calendar → proof banner. */
export default function BookingPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const applicant = loadApplicant();
  // ?preview=1 lets the team QA the page without filling the quiz.
  const allowed = !!applicant?.qualified || params.get('preview') === '1';
  const tracked = useRef(false);

  useEffect(() => {
    if (!allowed || tracked.current) return;
    tracked.current = true;
    void trackEvent(EVENTS.bookingView, { qualified: true });
  }, [allowed]);

  const onBooked = useCallback(
    (source: string) => {
      void trackEvent(EVENTS.callBooked, { source }, `call_booked_${getSessionId()}`);
      navigate('/post-booking', { replace: true });
    },
    [navigate],
  );

  if (!allowed) {
    return (
      <section className="section">
        <div className="container text-center">
          <h1 className="display">{booking.notQualifiedTitle}</h1>
          <p className="lead" style={{ marginBottom: 24 }}>
            {booking.notQualifiedBody}
          </p>
          <ApplyButton />
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section-tight">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 24 }}>
            <p className="eyebrow">{booking.label}</p>
            <h1 className="display">{booking.title}</h1>
            <p className="lead">{booking.body}</p>
          </div>
          <BookingEmbed url={config.bookingUrl} applicant={applicant} onBooked={onBooked} />
        </div>
      </section>
      <section className="section-tight">
        <ScrollingBanner images={transformations} seconds={50} label="Client transformations" />
      </section>
    </>
  );
}
