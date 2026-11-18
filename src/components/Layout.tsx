import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { brand } from '../data/assets';
import { CTA_LABEL, STICKY_LABEL, footer } from '../data/copy';

export const FORM_ID = 'application-form';

export function scrollToForm() {
  document.getElementById(FORM_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function ApplyButton({ label = CTA_LABEL, variant = 'primary' }: { label?: string; variant?: 'primary' | 'inverse' }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className={`btn btn-block ${variant === 'inverse' ? 'btn-inverse' : ''}`}
      onClick={() => (pathname === '/' ? scrollToForm() : navigate(`/#${FORM_ID}`))}
    >
      {label} →
    </button>
  );
}

/** Mobile-only sticky CTA. Hidden at the top of the page and while the form is on screen. */
export function StickyApplyBar() {
  const [scrolled, setScrolled] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const el = document.getElementById(FORM_ID);
    const io = el
      ? new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), { threshold: 0.05 })
      : null;
    if (el && io) io.observe(el);
    return () => {
      window.removeEventListener('scroll', onScroll);
      io?.disconnect();
    };
  }, []);

  const visible = scrolled && !formVisible;
  return (
    <div className={`sticky-apply ${visible ? 'visible' : ''}`} aria-hidden={!visible}>
      <button type="button" className="btn btn-block" tabIndex={visible ? 0 : -1} onClick={scrollToForm}>
        {STICKY_LABEL} →
      </button>
    </div>
  );
}

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // wait for lazy route to render
      const t = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }), 60);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);
  return null;
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollManager />
      <header className="site-header">
        <div className="container">
          <Link to="/" className="brand-link" aria-label="Father Figure Formula home">
            <img src={brand.logoBadge} alt="" width={40} height={40} />
            <span>Father Figure Formula</span>
          </Link>
          <span className="scarcity">Application only</span>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container">
          <div className="tagline">{footer.pillars}</div>
          <nav aria-label="Legal">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </nav>
          <p>{footer.disclaimer}</p>
          <p>© {new Date().getFullYear()} Father Figure Formula™. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
