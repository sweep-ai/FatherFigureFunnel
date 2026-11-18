import { useEffect, useRef, useState } from 'react';
import { brand } from '../data/assets';
import { vslCaption } from '../data/copy';

type Props = {
  src: string;
  poster?: string;
  label: string;
  autoPlay?: boolean;
  onFirstPlay?: () => void;
};

/**
 * Self-hosted MP4 (SOP: MP4, not iframe). Autoplays muted → "Tap to unmute" restarts with sound.
 * Without a src it renders a branded "coming soon" poster so the page never breaks.
 */
export function VSLPlayer({ src, poster, label, autoPlay = true, onFirstPlay }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const played = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || !autoPlay) return;
    v.muted = true;
    v.play().catch(() => {
      /* autoplay blocked — controls still available */
    });
  }, [src, autoPlay]);

  if (!src) {
    return (
      <div className="vsl" role="img" aria-label={`${label} — video coming soon`}>
        <div className="vsl-placeholder">
          <div>
            <img src={brand.logoBadge} alt="" />
            <p>Video coming soon</p>
          </div>
        </div>
      </div>
    );
  }

  const unmute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    v.controls = true;
    v.play().catch(() => undefined);
    setMuted(false);
  };

  return (
    <div className="vsl">
      <video
        ref={ref}
        src={src}
        poster={poster}
        playsInline
        muted={muted}
        preload="metadata"
        controls={!muted}
        aria-label={label}
        onPlay={() => {
          if (!played.current) {
            played.current = true;
            onFirstPlay?.();
          }
        }}
      />
      {muted && (
        <button type="button" className="vsl-unmute" onClick={unmute}>
          🔊 {vslCaption}
        </button>
      )}
    </div>
  );
}
