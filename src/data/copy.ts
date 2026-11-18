/**
 * All page copy. Source: docs/sales-letter.md (John's voice, from the onboarding calls).
 * Keep copy out of JSX so headline/subhead A/B tests are one-line changes (SOP: change one variable at a time).
 */

export const CTA_LABEL = 'Apply For Your Comeback Call';
export const STICKY_LABEL = 'Apply Now';

export const hero = {
  eyebrow: 'For busy dads in their 30s, 40s & 50s',
  // Rendered as: line1 + <highlight> + line2
  headlineLine1: 'Become the dad your kids',
  headlineHighlight: 'already think',
  headlineLine2: 'you are.',
  subhead:
    'Lose the weight, rebuild your strength and get your confidence back — without living in the gym or missing a single practice. Watch the short video below to see how.',
};

export const vslCaption = 'Tap to unmute';

export const quiz = {
  title: 'See if you qualify',
  subtitle: 'Takes about 2 minutes. Application only — we personally coach every dad we accept.',
  submitting: 'Checking your application…',
  consent:
    'By submitting, I agree to be contacted by Father Figure Formula by call, text (SMS) and email about my application and coaching, including automated messages. Consent isn’t a condition of purchase. Msg & data rates may apply. Reply STOP to opt out.',
};

export const dq = {
  title: 'Respect, brother. Let’s get you started the right way.',
  body:
    'Based on your answers, 1:1 coaching isn’t the right fit today — and that’s okay. The comeback doesn’t wait for perfect timing. Start with the free 7-Day Dad Comeback Blueprint: daily mindset prompts, home workouts, a gym plan and a simple meal plan.',
  cta: 'Get the Free 7-Day Blueprint',
  fallback: 'We’ll email the Blueprint to you shortly.',
  footnote: 'When you’re ready for coaching, come back and apply again.',
};

export const proof = {
  title: 'Real dads. Real results.',
  subtitle: 'Same guys. No filters. Just kept promises.',
  winsTitle: 'In their own words',
};

export const exclusive = {
  title: 'This isn’t for every guy.',
  lead: 'We coach every client personally, so we only take on dads we know we can get results for.',
  notFor: [
    'Looking for a magic pill or a 30-day shred',
    'Wants someone to do the work for him',
    'Is “just looking” for another plan to save and forget',
  ],
  isFor: [
    'Done saying “I’ll start Monday”',
    'Wants a plan that fits real life — work, kids, practices, travel',
    'Ready to invest in himself because his family is counting on him',
  ],
};

export const program = {
  title: 'What happens when you’re accepted',
  pillars: [
    { name: 'Fitness', line: 'The vehicle. 3 full-body sessions a week, 45 minutes max, built on six movements.' },
    { name: 'Family', line: 'The reason. Every goal ties back to the man your kids will remember.' },
    { name: 'Faith', line: 'The foundation. Purpose, values, and keeping small promises to yourself.' },
  ],
  deliverables: [
    '1:1 onboarding call + full intake',
    'Custom training + nutrition built around your real week',
    'Direct messaging access to your coach',
    'Weekly 1:1 check-ins and plan adjustments',
    'Group calls + a brotherhood of dads doing the same work',
  ],
};

export const manifesto = {
  title: 'From Coach John',
  lines: [
    { text: 'You don’t need a six-pack.', emphasis: false },
    { text: 'You need to trust your own word again.', emphasis: true },
    { text: 'You can’t lose 30 pounds today.', emphasis: false },
    { text: 'But you can win the day.', emphasis: true },
    { text: 'One kept promise at a time.', emphasis: false },
  ],
  bio:
    'I’m a dad of two — travel hockey and competitive dance, so I know what a packed week looks like. I spent years running a gym in the Twin Cities, coaching hundreds of people through their comebacks. My partner Devin is a deputy sheriff, a former military interrogator, and a dad who knows what it takes to show up when it counts. Together we built the Father Figure Formula for the guy who takes care of everyone except himself.',
  tagline: 'Build the man. Strengthen the father. Change the legacy.',
};

export const finalCta = {
  title: 'Next Monday isn’t coming.',
  body: 'You already know what happens if nothing changes. Take two minutes, apply, and let’s map out your comeback.',
};

export const booking = {
  label: 'Application approved',
  title: 'You qualified — pick a time for your Comeback Call',
  body: 'Free, 30–45 minutes, on a video call. Grab the soonest slot that works.',
  missingUrl: 'Calendar loading… If it doesn’t appear, text or call us and we’ll book you in.',
  bookedFallback: 'I’ve booked my call →',
  notQualifiedTitle: 'Finish your application first',
  notQualifiedBody: 'The calendar opens once your application is complete.',
};

export const postBooking = {
  title: 'You’re almost there…',
  mandatory: 'Your call is booked — complete these steps to lock it in.',
  // Order per Sweep Landing Page SOP §5: post-booking VSL → confirmation → add to calendar → FAQ → prep.
  steps: [
    {
      label: 'Step 1',
      title: 'Watch: what to expect on your call',
      body: 'A quick message from Coach John on exactly how the call works, so we can spend our time on you.',
    },
    {
      label: 'Step 2',
      title: 'Answer our confirmation call',
      body: 'Our team will call or text you within 24 hours to confirm your spot. Pick up — unconfirmed calls get released.',
    },
    {
      label: 'Step 3',
      title: 'Add it to your calendar',
      body: 'Open the confirmation email, accept the invite, and set a reminder. Treat it like a meeting with your most important client — you.',
    },
  ],
  faqTitle: 'Common questions',
  faq: [
    {
      q: 'I’ve tried a dozen programs. Why would this be different?',
      a: 'Because the problem was never information — it was follow-through. You get a coach who knows your schedule, adjusts your plan weekly, and checks in when you go quiet. Plans fail. Accountability doesn’t.',
    },
    {
      q: 'I barely have time as it is.',
      a: 'That’s exactly who this is built for. Three sessions a week, 45 minutes max, and nutrition that works at a family dinner table. We build around hockey practice and late meetings — not the other way around.',
    },
    {
      q: 'Do I need a gym?',
      a: 'No. We build your plan around what you have — a full gym, a garage setup, or a couple of dumbbells.',
    },
    {
      q: 'What’s the “faith” part? I’m not super religious.',
      a: 'Faith is the foundation for purpose and values — why you’re doing this and who you want to be. You’re welcome wherever you are. We never force anything on anyone.',
    },
    {
      q: 'What happens on the call?',
      a: 'We look at where you are, where you want to be, and what’s been getting in the way. If it’s a fit, we’ll lay out exactly how we’d coach you — including investment. If not, we’ll tell you straight and point you in the right direction.',
    },
  ],
  prepTitle: 'Before your call',
  prep: [
    'Find a quiet spot with good Wi-Fi and plan to have your camera on.',
    'If your spouse is part of big decisions, have them nearby.',
    'Write down the one thing you want to change most — we’ll start there.',
  ],
};

export const footer = {
  pillars: 'Faith | Family | Fitness',
  disclaimer:
    'Results vary and depend on individual effort, adherence and starting point. Testimonials reflect real client experiences and are not a guarantee of results. Consult your physician before starting any exercise or nutrition program.',
};
