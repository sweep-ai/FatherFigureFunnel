import type { ReactNode } from 'react';

type Kind = 'privacy' | 'terms' | 'disclaimer';

/** Plain-language legal stubs. Have the client's counsel review before ads go live. */
const content: Record<Kind, { title: string; body: ReactNode }> = {
  privacy: {
    title: 'Privacy Policy',
    body: (
      <>
        <p>
          Father Figure Formula (“we”, “us”) collects the information you submit in our application — name, email,
          phone, optional Instagram handle and occupation, and your answers — to evaluate your fit for coaching,
          contact you about your call, and provide our services.
        </p>
        <h2>Tools we use</h2>
        <ul>
          <li>Sweep OS — application storage, funnel analytics and client management.</li>
          <li>GoHighLevel — scheduling, reminders, email and SMS.</li>
          <li>Microsoft Clarity (if enabled) — anonymized session analytics to improve this site.</li>
          <li>Vercel — website hosting.</li>
        </ul>
        <h2>Calls, texts and email</h2>
        <p>
          By submitting the application and checking the consent box, you agree to be contacted by call, SMS and
          email, including automated messages. Message and data rates may apply. Reply STOP to opt out of texts at any
          time, or use the unsubscribe link in any email.
        </p>
        <h2>Your choices</h2>
        <p>We never sell your information. To access or delete your data, contact us through our Instagram or by replying to any of our emails.</p>
      </>
    ),
  },
  terms: {
    title: 'Terms of Use',
    body: (
      <>
        <p>
          This site provides information about Father Figure Formula coaching. Submitting an application does not
          guarantee acceptance into any program. Program details, pricing and terms are discussed on your call and
          confirmed in writing before you enroll.
        </p>
        <p>All content, logos and media on this site are the property of Father Figure Formula and may not be reused without permission.</p>
      </>
    ),
  },
  disclaimer: {
    title: 'Results Disclaimer',
    body: (
      <>
        <p>
          Testimonials and before/after photos on this site are from real clients. They reflect individual experiences
          and are not a guarantee of results. Your results depend on your starting point, effort, consistency and
          other factors.
        </p>
        <p>
          Nothing on this site is medical advice. Consult your physician before starting any exercise or nutrition
          program, especially if you have a medical condition or take medication.
        </p>
      </>
    ),
  },
};

export default function LegalPage({ kind }: { kind: Kind }) {
  const { title, body } = content[kind];
  return (
    <section className="section legal">
      <div className="container">
        <h1 className="display">{title}</h1>
        {body}
      </div>
    </section>
  );
}
