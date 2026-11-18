import type { ProofImage } from '../data/assets';

/** Continuous horizontal proof marquee (CSS-only). Images duplicated once for a seamless loop. */
export function ScrollingBanner({ images, seconds = 60, label }: { images: ProofImage[]; seconds?: number; label: string }) {
  const loop = [...images, ...images];
  return (
    <div className="marquee" role="region" aria-label={label}>
      <div className="marquee-track" style={{ ['--marquee-duration' as string]: `${seconds}s` }}>
        {loop.map((img, i) => (
          <img
            key={`${img.src}-${i}`}
            src={img.src}
            alt={i < images.length ? img.alt : ''}
            aria-hidden={i >= images.length}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    </div>
  );
}

/** 2-column gallery for text-message wins and written reviews. */
export function ProofGallery({ images }: { images: ProofImage[] }) {
  return (
    <div className="gallery">
      {images.map((img) => (
        <img key={img.src} src={img.src} alt={img.alt} loading="lazy" decoding="async" />
      ))}
    </div>
  );
}
