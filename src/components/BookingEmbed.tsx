import { useEffect, useMemo, useRef } from 'react';
import type { Applicant } from '../lib/applicant';
import { booking } from '../data/copy';

type Props = { url: string; applicant: Applicant | null; onBooked: (source: string) => void };

const isCalendly = (u: string) => /calendly\.com/i.test(u);
const isGhl = (u: string) => /(leadconnectorhq|msgsndr|gohighlevel)/i.test(u);

function withPrefill(url: string, a: Applicant | null) {
  try {
    const u = new URL(url);
    if (isCalendly(url)) {
      u.searchParams.set('embed_type', 'Inline');
      u.searchParams.set('hide_gdpr_banner', '1');
      if (a) {
        u.searchParams.set('name', a.name);
        u.searchParams.set('email', a.email);
      }
    } else if (a) {
      const [first, ...rest] = a.name.split(/\s+/);
      u.searchParams.set('first_name', first);
      u.searchParams.set('last_name', rest.join(' '));
      u.searchParams.set('email', a.email);
      u.searchParams.set('phone', a.phone);
    }
    return u.toString();
  } catch {
    return url;
  }
}

/** Looks for a "booking complete" signal in a postMessage payload (Calendly + GHL widget variants). */
function isBookedMessage(data: unknown): boolean {
  if (!data) return false;
  if (typeof data === 'object' && (data as { event?: string }).event === 'calendly.event_scheduled') return true;
  const s = typeof data === 'string' ? data : JSON.stringify(data);
  return /(event_scheduled|booking[-_ ]?(complete|success|confirmed)|appointment[-_ ]?(booked|created|scheduled))/i.test(s);
}

/**
 * Inline calendar (GoHighLevel preferred by client; Calendly supported).
 * Listens for the provider's booked postMessage → onBooked. A manual fallback
 * button covers widgets that don't emit a message.
 */
export function BookingEmbed({ url, applicant, onBooked }: Props) {
  const src = useMemo(() => (url ? withPrefill(url, applicant) : ''), [url, applicant]);
  const fired = useRef(false);

  useEffect(() => {
    if (!src) return undefined;
    const fire = (source: string) => {
      if (fired.current) return;
      fired.current = true;
      onBooked(source);
    };
    const onMessage = (e: MessageEvent) => {
      const trusted = /calendly\.com|leadconnectorhq\.com|msgsndr\.com|gohighlevel\.com/i.test(e.origin);
      if (trusted && isBookedMessage(e.data)) fire(isCalendly(src) ? 'calendly' : 'ghl');
    };
    window.addEventListener('message', onMessage);

    // GHL auto-resize helper
    if (isGhl(src) && !document.getElementById('ghl-embed')) {
      const s = document.createElement('script');
      s.id = 'ghl-embed';
      s.src = 'https://link.msgsndr.com/js/form_embed.js';
      s.async = true;
      document.body.appendChild(s);
    }
    return () => window.removeEventListener('message', onMessage);
  }, [src, onBooked]);

  if (!src) return <div className="notice">{booking.missingUrl}</div>;

  return (
    <>
      <div className="booking-shell">
        <iframe
          className="booking-frame"
          src={src}
          title="Book your Comeback Call"
          loading="eager"
          scrolling="no"
          id="fff-booking-frame"
        />
      </div>
      <p className="text-center" style={{ marginTop: 12 }}>
        <button type="button" className="link-btn" onClick={() => !fired.current && ((fired.current = true), onBooked('manual'))}>
          {booking.bookedFallback}
        </button>
      </p>
    </>
  );
}
