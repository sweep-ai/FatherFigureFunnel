/**
 * Static media. Proof = curated ICP-matching (male, dad-aged) client results only.
 * Originals live in /brand-assets; web-compressed copies in /public/images.
 */
export const brand = {
  logoBadge: '/images/brand/logo-badge.png',
  logoWide: '/images/brand/logo-wide.jpg',
  dadComeback: '/images/brand/dad-comeback.jpg',
};

export type ProofImage = { src: string; alt: string };

/** Transformations — lead the proof bomb (SOP: transformations first). Order = strongest first. */
export const transformations: ProofImage[] = [
  { src: '/images/proof/transform-334-232-dad-son.jpg', alt: 'Client before and after: 334 lbs to 232 lbs, 102 lbs lost, holding his son' },
  { src: '/images/proof/transform-282-191.jpg', alt: 'Client before and after: 282 lbs to 191 lbs, 91 lbs lost' },
  { src: '/images/proof/transform-247-195-shirtless.jpg', alt: 'Client before and after: 247 lbs to 195 lbs, 52 lbs lost' },
  { src: '/images/proof/transform-231-189.jpg', alt: 'Client before and after: 231 lbs to 189 lbs, 42 lbs lost' },
  { src: '/images/proof/transform-bearded-shirtless.jpg', alt: 'Client before and after transformation, same guy, real results' },
  { src: '/images/proof/transform-235-205.jpg', alt: 'Client before and after: 235 lbs to 205 lbs' },
  { src: '/images/proof/transform-247-195-2021-2023.jpg', alt: 'Client before and after: 247 lbs in 2021 to 195 lbs in 2023' },
  { src: '/images/proof/transform-bald-gym.jpg', alt: 'Client before and after transformation, same guy, real results' },
];

/** Text-message wins — results in the client's own words. */
export const textWins: ProofImage[] = [
  { src: '/images/proof/text-bubba-down-75.jpg', alt: 'Text from client: started at 240.6 lbs, down 75 lbs' },
  { src: '/images/proof/text-adam-dot-card.jpg', alt: 'Text from client: got his 2-year DOT card back and avoided blood pressure medication' },
  { src: '/images/proof/text-luke-down-34.jpg', alt: 'Text from client: down 34 lbs, no cheat days, feels so good' },
];

/** Written reviews. */
export const reviews: ProofImage[] = [
  { src: '/images/proof/review-john-reinhardt.jpg', alt: 'Review from John Reinhardt: life changing, one of the best decisions I have ever made' },
  { src: '/images/proof/review-jimmer-gillespie.jpg', alt: "Review from Jimmer Gillespie, 71: I haven't felt this good in years" },
  { src: '/images/proof/review-nick-watercott.jpg', alt: 'Review from Nick Watercott: best shape of my life and stronger than ever' },
  { src: '/images/proof/review-lukas-litzsinger.jpg', alt: "Review from Lukas Litzsinger: the camaraderie is real, we're all in this together" },
];
