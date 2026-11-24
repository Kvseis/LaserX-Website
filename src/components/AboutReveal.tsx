'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AboutReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const words = root.current?.querySelectorAll('[data-about-word]');
      if (words?.length) {
        gsap.fromTo(words, { opacity: 0.32 }, {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: '[data-about-text]', start: 'top 90%', end: 'top 52%', scrub: 0.5 },
        });
      }
      root.current?.querySelectorAll('[data-about-media] img').forEach((image) => {
        gsap.fromTo(image, { scale: 1.055 }, {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        });
      });
    });
    return () => media.revert();
  }, { scope: root });

  return <main ref={root} className="about-motion">{children}</main>;
}
