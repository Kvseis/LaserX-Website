'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export default function AboutReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    const animations = new Set<Animation>();
    const setup = () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      if (media.matches || !root.current) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const animation = entry.target.animate(
            [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 500, easing: 'cubic-bezier(.2,.7,.3,1)' },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      root.current.querySelectorAll('section:not(:first-child) h2, article').forEach((element) => observer?.observe(element));
    };
    setup();
    media.addEventListener('change', setup);
    return () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      media.removeEventListener('change', setup);
    };
  }, []);
  return <main ref={root}>{children}</main>;
}
