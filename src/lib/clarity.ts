/** Microsoft Clarity — official tag, injected only when a project id is configured. */
export function initClarity(projectId: string) {
  if (!projectId || typeof window === 'undefined' || document.getElementById('clarity-tag')) return;
  const w = window as unknown as { clarity?: { q?: unknown[] } & ((...args: unknown[]) => void) };
  if (!w.clarity) {
    const fn = ((...args: unknown[]) => {
      (fn.q = fn.q || []).push(args);
    }) as { q?: unknown[] } & ((...args: unknown[]) => void);
    w.clarity = fn;
  }
  const s = document.createElement('script');
  s.id = 'clarity-tag';
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${encodeURIComponent(projectId)}`;
  document.head.appendChild(s);
}
