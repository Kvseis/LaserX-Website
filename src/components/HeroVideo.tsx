'use client';

import { useEffect, useRef, useState } from 'react';

export default function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean; effectiveType?: string } }).connection;
    const update = () => setEnabled(media.matches && !connection?.saveData && !['slow-2g', '2g'].includes(connection?.effectiveType ?? ''));
    update();
    media.addEventListener('change', update);
    connection?.addEventListener('change', update);
    return () => {
      media.removeEventListener('change', update);
      connection?.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let visible = false;
    const syncPlayback = () => {
      if (visible && !document.hidden) void element.play().catch(() => {});
      else element.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    // Ignore the strip hidden behind the fixed navigation bar.
    }, { threshold: 0, rootMargin: '-96px 0px 0px 0px' });
    observer.observe(element);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      element.pause();
    };
  }, [enabled]);

  return enabled ? <video ref={video} className="hero-media" autoPlay muted loop playsInline preload="auto" poster="/images/hero.webp" aria-hidden="true">
    <source src="/videos/laser-cleaning-hero-720p.mp4" type="video/mp4" />
  </video> : null;
}
