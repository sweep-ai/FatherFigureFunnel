/**
 * Sweep OS funnel integration — the two public REST endpoints only.
 * See references: Sweep Funnel Integration Guide (POST /funnels/events, POST /funnels/leads).
 * Fire-and-forget: tracking failures never block the UI.
 */
import { config, type EventName } from '../data/funnel';

const VISITOR_KEY = 'sweep_visitor_id';
const SESSION_KEY = 'sweep_session_id';
const UTM_KEY = 'fff_utm';

function rand() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function safeGet(store: Storage, key: string): string | null {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(store: Storage, key: string, value: string) {
  try {
    store.setItem(key, value);
  } catch {
    /* private mode / blocked storage */
  }
}

export function getVisitorId(): string {
  let v = safeGet(localStorage, VISITOR_KEY);
  if (!v) {
    v = `visitor_${rand()}`;
    safeSet(localStorage, VISITOR_KEY, v);
  }
  return v;
}

export function getSessionId(): string {
  let s = safeGet(sessionStorage, SESSION_KEY);
  if (!s) {
    s = `session_${rand()}`;
    safeSet(sessionStorage, SESSION_KEY, s);
  }
  return s;
}

/** Capture UTMs/click ids on first landing so they survive /booking → /post-booking. */
export function captureAttribution(): Record<string, string> {
  const existing = safeGet(sessionStorage, UTM_KEY);
  if (existing) {
    try {
      return JSON.parse(existing) as Record<string, string>;
    } catch {
      /* fallthrough */
    }
  }
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid', 'ref'].forEach((k) => {
    const val = params.get(k);
    if (val) out[k] = val;
  });
  if (document.referrer) out.landing_referrer = document.referrer;
  safeSet(sessionStorage, UTM_KEY, JSON.stringify(out));
  return out;
}

export type TrackResult =
  | { ok: true; status: 'accepted' | 'duplicate'; eventId?: string }
  | { ok: false; error: string };

export async function trackEvent(
  eventName: EventName,
  metadata: Record<string, unknown> = {},
  idempotencyKey?: string,
): Promise<TrackResult> {
  if (!config.sweepFunnelId) {
    if (import.meta.env.DEV) console.info('[sweep] (no funnel id) event', eventName, metadata);
    return { ok: false, error: 'FUNNEL_ID not configured' };
  }

  const body: Record<string, unknown> = {
    funnel_id: config.sweepFunnelId,
    event_name: eventName,
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    metadata: {
      ...metadata,
      utm: captureAttribution(),
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer || undefined,
    },
    event_timestamp: new Date().toISOString(),
  };
  if (idempotencyKey) body.idempotency_key = `${config.sweepFunnelId}_${idempotencyKey}`;

  try {
    const res = await fetch(`${config.sweepApiBaseUrl}/funnels/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
    if (!res.ok) {
      const detail = (await res.json().catch(() => ({}))) as { detail?: string };
      console.warn('[sweep] event failed', eventName, res.status, detail.detail);
      return { ok: false, error: detail.detail ?? res.statusText };
    }
    const data = (await res.json()) as { event_id?: string; status?: string };
    return { ok: true, status: data.status === 'duplicate' ? 'duplicate' : 'accepted', eventId: data.event_id };
  } catch (e) {
    console.warn('[sweep] event network error', eventName, e);
    return { ok: false, error: e instanceof Error ? e.message : 'network error' };
  }
}

export type LeadPayload = {
  email?: string;
  name?: string;
  phone?: string;
  instagram?: string;
  notes?: string;
  source?: string;
  quiz_answers?: Record<string, unknown>;
  opt_in_data?: Record<string, unknown>;
  funnel_step_reached?: string;
};

export async function submitLead(
  fields: LeadPayload,
): Promise<{ clientId?: string; created?: boolean; error?: string }> {
  if (!config.sweepFunnelId) {
    if (import.meta.env.DEV) console.info('[sweep] (no funnel id) lead', fields);
    return { error: 'FUNNEL_ID not configured' };
  }
  try {
    const res = await fetch(`${config.sweepApiBaseUrl}/funnels/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ funnel_id: config.sweepFunnelId, ...fields }),
      keepalive: true,
    });
    const data = (await res.json().catch(() => ({}))) as { detail?: string; client_id?: string; created?: boolean };
    if (!res.ok) {
      console.warn('[sweep] lead failed', res.status, data.detail);
      return { error: data.detail ?? res.statusText };
    }
    return { clientId: data.client_id, created: data.created };
  } catch (e) {
    console.warn('[sweep] lead network error', e);
    return { error: e instanceof Error ? e.message : 'network error' };
  }
}
