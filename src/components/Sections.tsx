import type { ReactNode } from 'react';
import { brand, transformations } from '../data/assets';
import { exclusive, finalCta, hero, manifesto, program } from '../data/copy';
import { ApplyButton } from './Layout';

/** Grayscale, low-opacity proof texture behind hero / exclusive blocks. Decorative. */
export function PhotoGrid() {
  const imgs = [...transformations, ...transformations].slice(0, 8);
  return (
    <div className="photo-grid" aria-hidden="true">
      {imgs.map((img, i) => (
        <img key={i} src={img.src} alt="" loading="lazy" decoding="async" />
      ))}
    </div>
  );
}

export function PageHero({ children }: { children: ReactNode }) {
  return (
    <section className="hero">
      <PhotoGrid />
      <div className="container">
        <div className="hero-copy">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 className="display">
            {hero.headlineLine1} <span className="brush">{hero.headlineHighlight}</span> {hero.headlineLine2}
          </h1>
          <p className="lead">{hero.subhead}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

export function ExclusiveProgram() {
  return (
    <section className="section exclusive">
      <PhotoGrid />
      <div className="container">
        <h2 className="display">{exclusive.title}</h2>
        <p className="muted">{exclusive.lead}</p>
        <div className="fit-grid">
          <div>
            <h3>It’s not for the guy who…</h3>
            <ul className="fit-list no">
              {exclusive.notFor.map((t) => (
                <li key={t}>
                  <span className="mark" aria-hidden="true">
                    ✕
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>It’s built for the dad who’s…</h3>
            <ul className="fit-list yes">
              {exclusive.isFor.map((t) => (
                <li key={t}>
                  <span className="mark" aria-hidden="true">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ApplyButton variant="inverse" />
      </div>
    </section>
  );
}

export function Program() {
  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Faith · Family · Fitness</p>
        <h2 className="display">{program.title}</h2>
        <div className="pillars">
          {program.pillars.map((p) => (
            <div className="pillar" key={p.name}>
              <strong>{p.name}</strong>
              <span>{p.line}</span>
            </div>
          ))}
        </div>
        <ol className="deliverables">
          {program.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ol>
        <ApplyButton />
      </div>
    </section>
  );
}

export function FounderManifesto() {
  return (
    <section className="section">
      <div className="container">
        <img
          className="manifesto-logo"
          src={brand.logoWide}
          alt="Father Figure Formula — Faith, Family, Fitness"
          loading="lazy"
        />
        <p className="eyebrow text-center">{manifesto.title}</p>
        <div className="manifesto-lines">
          {manifesto.lines.map((l) => (
            <p key={l.text} className={l.emphasis ? 'em' : undefined}>
              {l.text}
            </p>
          ))}
        </div>
        <p className="muted">{manifesto.bio}</p>
        <p className="tagline">{manifesto.tagline}</p>
        <ApplyButton />
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="section text-center">
      <div className="container">
        <h2 className="display">{finalCta.title}</h2>
        <p className="lead" style={{ marginBottom: 24 }}>
          {finalCta.body}
        </p>
        <ApplyButton />
      </div>
    </section>
  );
}
