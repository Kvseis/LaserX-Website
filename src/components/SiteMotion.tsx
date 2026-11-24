'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const revealTargets = [
  '[data-motion-reveal]',
  '.results-intro',
  '.result-card-copy',
  '.methods-copy',
  '.technology-preview-copy > :is(h2, p, ul)',
  '.about-motion h2:not([data-about-text])',
  '.about-motion [data-about-media]',
].join(', ');

export default function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
    let observer: IntersectionObserver | undefined;

    function observe() {
      observer?.disconnect();
      if (!motion.matches || !('IntersectionObserver' in window)) return;

      observer = new IntersectionObserver((entries, activeObserver) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-motion-visible', '');
          activeObserver.unobserve(entry.target);
        }
      }, { rootMargin: '0px 0px -7% 0px' });

      for (const target of document.querySelectorAll(revealTargets)) {
        if (target.hasAttribute('data-motion-visible')) continue;
        const { top, bottom } = target.getBoundingClientRect();
        // Leave already-visible content in place when navigation restores a scroll position.
        if (top >= window.innerHeight || bottom <= 0) {
          observer.observe(target);
        }
      }
    }

    observe();
    motion.addEventListener('change', observe);
    return () => {
      observer?.disconnect();
      motion.removeEventListener('change', observe);
    };
  }, [pathname]);

  return null;
}
