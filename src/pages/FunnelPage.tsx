import { useEffect, useRef } from 'react';
import { ApplicationForm } from '../components/ApplicationForm';
import { ApplyButton, StickyApplyBar } from '../components/Layout';
import { ProofGallery, ScrollingBanner } from '../components/Proof';
import { ExclusiveProgram, FinalCTA, FounderManifesto, PageHero, Program } from '../components/Sections';
import { VSLPlayer } from '../components/VSLPlayer';
import { reviews, textWins, transformations } from '../data/assets';
import { proof } from '../data/copy';
import { EVENTS, config } from '../data/funnel';
import { trackEvent } from '../lib/sweep';

/**
 * Surface A — front cover page. Section order per Sweep Landing Page SOP §3:
 * headline/subhead → VSL → quiz → proof bomb → closing CTA (+ founder) → sticky apply.
 */
export default function FunnelPage() {
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    void trackEvent(EVENTS.pageView, { page_id: 'front_cover' });
  }, []);

  return (
    <>
      <PageHero>
        <VSLPlayer
          src={config.vslUrl}
          label="Father Figure Formula — watch this first"
          onFirstPlay={() => void trackEvent(EVENTS.vslPlay, { placement: 'funnel' })}
        />
        <div className="vsl-cta">
          <ApplyButton />
        </div>
      </PageHero>

      <ApplicationForm />

      <section className="section" aria-labelledby="proof-title">
        <div className="container">
          <h2 id="proof-title" className="display text-center">
            {proof.title}
          </h2>
          <p className="muted text-center" style={{ marginTop: -8 }}>
            {proof.subtitle}
          </p>
        </div>
        <ScrollingBanner images={transformations} label="Client transformations" />
        <div className="container">
          <h3 className="display wins-heading">{proof.winsTitle}</h3>
          <ProofGallery images={[...textWins, ...reviews].slice(0, 6)} />
          <div style={{ marginTop: 24 }}>
            <ApplyButton />
          </div>
        </div>
      </section>

      <ExclusiveProgram />
      <Program />
      <FounderManifesto />
      <FinalCTA />
      <StickyApplyBar />
    </>
  );
}
