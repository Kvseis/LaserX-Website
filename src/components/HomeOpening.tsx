'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { getFilmConnection, usesStaticFilm } from './ScrollFilmAssets';
import styles from './HomeOpening.module.css';

function easeBetween(value: number, start: number, end: number) {
  const progress = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return progress * progress * (3 - 2 * progress);
}

export default function HomeOpening({ hero, children }: { hero: ReactNode; children: ReactNode }) {
  const openingRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opening = openingRef.current;
    const stage = stageRef.current;
    const hero = stage?.firstElementChild;
    if (!opening || !stage || !hero) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shortViewport = window.matchMedia('(max-height: 560px)');
    const connection = getFilmConnection();
    const directFilmLink = window.location.hash === '#proses';
    let enabled = false;
    let frame = 0;
    let travel = 0;
    let previousProgress = -1;

    const update = () => {
      frame = 0;
      if (!enabled) return;

      const progress = Math.max(0, Math.min(1, -opening.getBoundingClientRect().top / travel));
      if (progress === previousProgress) return;
      previousProgress = progress;
      stage.style.setProperty('--hero-expansion', String(easeBetween(progress, 0, .39)));
      stage.style.setProperty('--hero-cloud', String(easeBetween(progress, .12, .79)));
      stage.style.setProperty('--hero-copy-opacity', String(1 - easeBetween(progress, .22, .65)));
      stage.style.setProperty('--hero-scene-opacity', String(1 - easeBetween(progress, .60, 1)));
      stage.toggleAttribute('data-hero-copy-hidden', progress >= .65);
    };

    const scheduleUpdate = () => {
      if (enabled && !frame) frame = window.requestAnimationFrame(update);
    };

    const measure = () => {
      if (!enabled) return;
      const stageBox = stage.getBoundingClientRect();
      const heroBox = hero.getBoundingClientRect();
      travel = Math.round(Math.max(280, Math.min(440, document.documentElement.clientHeight * .44)));
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
        return;
      }
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
