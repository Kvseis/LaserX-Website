'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { getFilmConnection, usesStaticFilm } from './ScrollFilmAssets';
import styles from './HomeOpening.module.css';

const responseMs = 100;
const stickyTailPx = 180;

function clampProgress(value: number) {
  return Math.max(0, Math.min(1, value));
}

function easeBetween(value: number, start: number, end: number) {
  const progress = clampProgress((value - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
}

export default function HomeOpening({ hero, children }: { hero: ReactNode; children: ReactNode }) {
  const openingRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opening = openingRef.current;
    const stage = stageRef.current;
    const track = stage?.parentElement;
    const hero = stage?.firstElementChild;
    if (!opening || !stage || !track || !hero) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shortViewport = window.matchMedia('(max-height: 560px)');
    const connection = getFilmConnection();
    const directFilmLink = window.location.hash === '#proses';
    let enabled = false;
    let frame = 0;
    let travel = 0;
    let displayedProgress: number | undefined;
    let previousFrameTime = 0;

    const update = (now: number) => {
      frame = 0;
      if (!enabled) return;

      const offset = -opening.getBoundingClientRect().top;
      // Complete the reveal just before the film begins following the scroll.
      const target = clampProgress(offset / (travel * .94));
      const previous = displayedProgress ?? target;
      const elapsed = Math.min(now - previousFrameTime, 34);
      const gap = target - previous;
      const outsideTrack = offset < -stickyTailPx || offset > travel + stickyTailPx;
      const progress = outsideTrack || Math.abs(gap) < .002
        ? target
        : previous + gap * (1 - Math.exp(-elapsed / responseMs));
      previousFrameTime = now;
      if (progress !== target) scheduleUpdate();
      if (progress === displayedProgress) return;
      displayedProgress = progress;

      const copy = easeBetween(progress, .24, .57);
      const reveal = clampProgress((progress - .59) / .4);
      stage.style.setProperty('--hero-expansion', String(easeBetween(progress, 0, .29)));
      stage.style.setProperty('--hero-cloud', String(easeBetween(progress, .13, .81)));
      stage.style.setProperty('--hero-mist', String(easeBetween(progress, .29, .68)));
      stage.style.setProperty('--hero-copy-exit', String(copy));
      stage.style.setProperty('--hero-reveal', `${10 + reveal * 81}%`);
      stage.style.setProperty('--hero-scene-opacity', String(1 - easeBetween(progress, .88, 1)));
      stage.toggleAttribute('data-hero-copy-hidden', copy === 1);
      stage.toggleAttribute('data-hero-revealing', reveal > 0 && progress < 1);
    };

    const scheduleUpdate = () => {
      if (enabled && !frame) frame = window.requestAnimationFrame(update);
    };

    const measure = () => {
      if (!enabled) return;
      const stageBox = stage.getBoundingClientRect();
      const heroBox = hero.getBoundingClientRect();
      const spacerHeight = Number.parseFloat(getComputedStyle(track, '::after').height);
      travel = Math.round(spacerHeight - stickyTailPx);
      opening.style.setProperty('--hero-scroll', `${travel}px`);
      stage.style.setProperty('--hero-top-edge', `${heroBox.top - stageBox.top}px`);
      stage.style.setProperty('--hero-side-edge', `${heroBox.left - stageBox.left}px`);
      stage.style.setProperty('--hero-bottom-edge', `${stageBox.bottom - heroBox.bottom}px`);
      scheduleUpdate();
    };

    const syncMode = () => {
      enabled = !directFilmLink && !shortViewport.matches && !usesStaticFilm(reducedMotion.matches, connection);
      opening.toggleAttribute('data-hero-transition', enabled);
      if (!enabled) {
        opening.style.removeProperty('--hero-scroll');
        displayedProgress = undefined;
        return;
      }
      opening.style.setProperty('--hero-sticky-tail', `${stickyTailPx}px`);
      measure();
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(stage);
    resizeObserver.observe(hero);
    syncMode();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', measure);
    reducedMotion.addEventListener('change', syncMode);
    shortViewport.addEventListener('change', syncMode);
    connection?.addEventListener('change', syncMode);

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', measure);
      reducedMotion.removeEventListener('change', syncMode);
      shortViewport.removeEventListener('change', syncMode);
      connection?.removeEventListener('change', syncMode);
    };
  }, []);

  return <div ref={openingRef} className={`home-opening ${styles.opening}`}>
    <div className={styles.track}>
      <div ref={stageRef} className={styles.stage}>{hero}</div>
    </div>
    {children}
  </div>;
}
