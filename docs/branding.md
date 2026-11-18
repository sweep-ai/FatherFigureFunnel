# Father Figure Formula — Branding Doc (for coding agents)

Per Sweep SOP Step 3. Derived from the client's existing logo and proof graphics (`brand-assets/`). Conversion first: simple, clear, mobile-first.

## Visual identity

The client's assets share one look: **near-black canvas, electric-blue brush strokes, distressed white uppercase headlines, blue highlighter on key phrases.** Gritty, masculine, "Real people. Real results." Not polished-SaaS, not pastel wellness.

### Tokens (`src/styles/tokens.css`)

| Token | Value | Use |
|-------|-------|-----|
| `--color-bg` | `#05080d` | Page background |
| `--color-bg-center` | `#0b1626` | Radial lift center |
| `--color-surface` | `#0c1420` | Form panel, FAQ rows |
| `--color-fg` | `#f3f6fa` | Body text |
| `--color-muted` | `#9fb0c4` | Secondary text |
| `--color-accent` | `#1e9bff` | CTAs, highlights, progress — the one accent |
| `--color-accent-hover` | `#4db1ff` | Hover/focus |
| `--color-accent-ink` | `#031322` | Text on accent buttons |
| `--color-border` | `#1c2a3c` | Hairlines |
| `--color-danger` | `#ff6b6b` | Validation errors |

No second accent. No purple/pink (old female-client frames are off-brand for this funnel).

### Type

- **Display:** Bebas Neue — uppercase, tight tracking. Stand-in for the brush/condensed headline type in the graphics.
- **Body:** Inter 400/600/700.
- **Highlight:** one key phrase per headline gets a skewed blue "brush" background — mirrors the highlighted phrases in the review cards.

### Logos

- `public/images/brand/logo-badge.png` — circular badge (dad + two kids). Header + favicon.
- `public/images/brand/logo-wide.jpg` — wordmark with "Faith | Family | Fitness". Founder section.
- `public/images/brand/dad-comeback.jpg` — Dad Comeback sub-brand (lead magnet) — DQ path only.

## Voice

Straight-talk dad. Short sentences. Conviction over hype. Use **tangible moments** (gas station, bathroom mirror, kids' practice) instead of abstract self-help. Say "I" — John's story is the differentiator.

**Never:** shame his body, imply his worth as a father depends on his weight, fake scarcity timers, flex-y abs copy, disclose high-ticket pricing.

**Consistent nouns:** "comeback", "Comeback Call", "the Father Figure Formula", "dad".

## Layout rules (Sweep funnel architecture + Landing Page Funnel Best Practices SOP)

- Narrow 720px column, dark radial atmosphere, grayscale low-opacity proof grid behind hero.
- First viewport: logo, headline, one subhead selling the VSL, VSL. No cards/badges/stat strips above the VSL.
- Proof bomb = transformation marquee first, then text/review gallery (2-col grid). No card grids.
- One CTA label everywhere: **"Apply For Your Comeback Call"**. Sticky mobile variant: **"Apply Now"**.
- Form panel gets the accent glow — it's the hot zone.
