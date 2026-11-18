# FatherFigureFunnel

VSL → application quiz → Comeback Call funnel for **Father Figure Formula** (Coach John Fisher & Devin Adams) — Faith | Family | Fitness coaching for busy dads.

Built per Sweep's **VSL Call Funnel Install** SOP, with page structure from the **Landing Page Funnel Best Practices** SOP. Meta Pixel / CAPI intentionally **not** installed (no ads running yet).

## Docs (read first)

| Doc | What |
|-----|------|
| [docs/offer-icp.md](docs/offer-icp.md) | Offer, ICP, founders, proof inventory — extracted from the Nov 1 / 5 / 11 calls. `[CONFIRM]` = needs client sign-off |
| [docs/sales-letter.md](docs/sales-letter.md) | Sales letter / VSL script spine in John's voice + post-booking VSL brief |
| [docs/branding.md](docs/branding.md) | Tokens, type, voice, layout rules for coding agents |

## Funnel

```
/              Front cover: headline → VSL → 7-step application → proof bomb → fit filter → program → founder → final CTA → sticky apply (mobile)
/booking       Qualified only: congrats → GHL/Calendly embed → proof banner
/post-booking  Mandatory steps: post-booking VSL → confirmation call → add to calendar → FAQ → prep  (noindex)
/privacy /terms /disclaimer, 404
```

**Quiz (SOP §3A):** layup (dad stage) → #1 obstacle → 90-day goal (text) → why now (text) → readiness → investment → contact (phone last, TCPA consent, honeypot).
**DQ routing:** readiness "1–3 months" / "just looking" or investment "under $1,000" → lead still captured in Sweep OS, shown the free 7-Day Dad Comeback Blueprint instead of the calendar. Rules live in `src/data/applicationForm.ts` (`disqualifies: true`).

## Sweep OS wiring

`src/lib/sweep.ts` → `POST /funnels/events` + `POST /funnels/leads` (public, no auth). Leads land on the Client Board with full quiz answers, qualification status and consent record.

Step `event_name`s are in `src/data/funnel.ts` — **create matching steps in Sweep OS → Funnels → Steps** (case-sensitive):

| event_name | When | Idempotent |
|-----------|------|-----------|
| `page_view` | Front cover load | |
| `vsl_play` | First VSL play (`metadata.placement`) | |
| `quiz_start` | First answer | |
| `quiz_step` | Each screen (`metadata.step`) | |
| `form_submit` | Application submitted | ✓ |
| `quiz_disqualified` | DQ path | |
| `booking_page_view` | /booking (qualified) | |
| `call_booked` | Calendar booked / self-confirmed | ✓ |
| `post_booking_view` | /post-booking | |

Add the production domain to the Sweep backend `ALLOWED_ORIGINS_EXTRA` (CORS).

## Setup

```bash
npm install
cp .env.example .env.local   # fill VITE_SWEEP_FUNNEL_ID, VITE_BOOKING_URL at minimum
npm run dev
```

QA the booking page without the quiz: `/booking?preview=1`.

## Still needed from client

- [ ] GHL one-on-one calendar embed URL → `VITE_BOOKING_URL`
- [ ] Sweep OS funnel created + steps above → `VITE_SWEEP_FUNNEL_ID`
- [ ] Front VSL + post-booking VSL (MP4, H.264, ≤960w, faststart) → `VITE_VSL_URL`, `VITE_POST_BOOKING_VSL_URL`
- [ ] Founder headshots + approved 2-paragraph bio (current bio drafted from calls — `src/data/copy.ts` → `manifesto.bio`)
- [ ] Dad Comeback Blueprint delivery link → `VITE_BLUEPRINT_URL`
- [ ] Testimonial usage permission for every image in `public/images/proof`
- [ ] Brand decision: Father Figure Formula vs. Get Yourself Moving umbrella (left open on Nov 11 call)
- [ ] Clarity project ID (optional) → `VITE_CLARITY_PROJECT_ID`

## Assets

- `brand-assets/` — originals (logos, offer graphics, curated testimonials)
- `public/images/` — web-compressed copies used by the site (900px JPEG)

Kept proof = male, dad-aged, ICP-matching results only. Female transformations, duplicates, collages and generic one-liners were removed from the source folder (moved to Trash).

## Deploy

Vercel, framework Vite. Set every `VITE_*` var from `.env.example` in Project → Settings → Environment Variables. `vercel.json` handles SPA rewrites + noindex on `/post-booking`.
