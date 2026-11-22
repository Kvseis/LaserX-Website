'use client';

import { useEffect, useRef } from 'react';
import type { SiteCopy } from '@/lib/messages/az';
import { createScrollFilmFrames } from './ScrollFilmFrames';
import styles from './ScrollCleaningFilm.module.css';

const metalEnd = 0.396;
const woodStart = 0.55;
const dustStart = 0.32;
const dustEnd = 0.60;
const scrollResponseMs = 125;

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

function easeBetween(value: number, start: number, end: number) {
  const progress = clampProgress((value - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
}

export default function ScrollCleaningFilm({ copy }: { copy: SiteCopy['home'] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const woodRef = useRef<HTMLCanvasElement>(null);
  const metalRef = useRef<HTMLCanvasElement>(null);
  const dustCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const wood = woodRef.current;
    const metal = metalRef.current;
    const dustCanvas = dustCanvasRef.current;
    if (!section || !stage || !wood || !metal || !dustCanvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrowViewport = window.matchMedia('(max-width: 760px)');
    const connection = (navigator as Navigator & {
      connection?: EventTarget & { saveData?: boolean; effectiveType?: string };
    }).connection;
    let frame = 0;
    let isStatic = false;
    let isNear = false;
    let mounted = true;
    let displayedProgress: number | undefined;
    let previousFrameTime = 0;
    let metalFrames: ReturnType<typeof createScrollFilmFrames>;
    let woodFrames: ReturnType<typeof createScrollFilmFrames>;

    const scheduleUpdate = () => {
      if (mounted && !frame) frame = window.requestAnimationFrame(update);
    };

    const dustFrames = createScrollFilmFrames(dustCanvas, 'dust', 40, scheduleUpdate);

    const update = (now: number) => {
      frame = 0;
      if (isStatic || !isNear) return;

      const travel = section.offsetHeight - stage.offsetHeight;
      const target = travel > 0 ? clampProgress(-section.getBoundingClientRect().top / travel) : 0;
      const previous = displayedProgress ?? target;
      const elapsed = Math.min(now - previousFrameTime, 32);
      const gap = target - previous;
      // Follow native scrolling without carrying an unfinished scene past either edge.
      const progress = target === 0 || target === 1 || Math.abs(gap) < 0.001
        ? target
        : previous + gap * (1 - Math.exp(-elapsed / scrollResponseMs));
      displayedProgress = progress;
      previousFrameTime = now;
      if (progress !== target) scheduleUpdate();
      const transition = clampProgress((progress - metalEnd) / (woodStart - metalEnd));
      const metalProgress = clampProgress(progress / metalEnd);
      const woodProgress = clampProgress((progress - woodStart) / (1 - woodStart));
      const dustProgress = clampProgress((progress - dustStart) / (dustEnd - dustStart));
      const dustActive = dustProgress > 0 && dustProgress < 1;
      const dustOpacity = 0.36 * easeBetween(dustProgress, 0.06, 0.38) * (1 - easeBetween(dustProgress, 0.57, 0.97));
      const veil = 0.25 * easeBetween(transition, 0, 0.43) * (1 - easeBetween(transition, 0.57, 1));
      const woodTitleOpacity = easeBetween(transition, 0.76, 1) * (1 - easeBetween(woodProgress, 0.73, 0.91));

      section.style.setProperty('--wood-reveal', `${-16 + 132 * easeBetween(transition, 0.08, 0.92)}%`);
      section.style.setProperty('--dust-veil', String(veil));
      section.style.setProperty('--dust-opacity', String(dustOpacity));
      section.style.setProperty('--dust-drift', `${30 - dustProgress * 60}%`);
      section.style.setProperty('--wood-title-opacity', String(woodTitleOpacity));
      section.style.setProperty('--metal-title-opacity', String(1 - easeBetween(transition, 0, 0.42)));
      section.style.setProperty('--film-progress', `${metalProgress * 100}%`);

      if (dustActive) dustFrames.paint(dustProgress);
      if (transition < 1) metalFrames.paint(metalProgress);
      if (transition > 0) woodFrames.paint(woodProgress);
    };

    const loadMedia = () => {
      if (isStatic || !isNear) return;
      metalFrames.preload();
      woodFrames.preload();
      dustFrames.preload();
    };

    const syncMode = () => {
      displayedProgress = undefined;
      isStatic = reducedMotion.matches || Boolean(connection?.saveData) ||
        ['slow-2g', '2g'].includes(connection?.effectiveType ?? '');
      section.dataset.static = String(isStatic);
      if (!isStatic) {
        loadMedia();
        scheduleUpdate();
      }
    };

    const syncFrameLayout = () => {
      const mobile = narrowViewport.matches;
      for (const canvas of [metal, wood]) delete canvas.dataset.frame;
      metal.width = mobile ? 560 : 1024;
      metal.height = mobile ? 680 : 576;
      wood.width = mobile ? 432 : 1024;
      wood.height = mobile ? 864 : 576;
      metalFrames = createScrollFilmFrames(metal, mobile ? 'metal-mobile' : 'metal-wide', 120, scheduleUpdate);
      woodFrames = createScrollFilmFrames(wood, mobile ? 'wood-mobile' : 'wood-wide', 72, scheduleUpdate);
      loadMedia();
      scheduleUpdate();
    };

    const observer = new IntersectionObserver(([entry]) => {
      isNear = entry.isIntersecting;
      if (!isNear) displayedProgress = undefined;
      loadMedia();
      scheduleUpdate();
    }, { rootMargin: `${window.innerHeight}px 0px` });

    syncFrameLayout();
    syncMode();
    observer.observe(section);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    narrowViewport.addEventListener('change', syncFrameLayout);
    reducedMotion.addEventListener('change', syncMode);
    connection?.addEventListener('change', syncMode);

    return () => {
      mounted = false;
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      narrowViewport.removeEventListener('change', syncFrameLayout);
      reducedMotion.removeEventListener('change', syncMode);
      connection?.removeEventListener('change', syncMode);
    };
  }, []);

  return <section ref={sectionRef} id="proses" className={styles.section} aria-labelledby="cleaning-film-title" aria-describedby="cleaning-film-disclosure">
    <div ref={stageRef} className={styles.stage}>
      <canvas ref={metalRef} className={styles.metalFrames} aria-hidden="true" />
      <div className={styles.content}>
        <h2 id="cleaning-film-title" className={styles.heading}>{copy.filmTitle}</h2>
        <div className={styles.scrollCue} aria-hidden="true">
          <span className={styles.progressTrack}><span className={styles.progressFill} /></span>
          <span>{copy.filmScrollCue} ↓</span>
        </div>
      </div>
      <div className={styles.woodScene}>
        <div className={styles.woodMedia} aria-hidden="true">
          <canvas ref={woodRef} />
        </div>
        <div className={styles.woodCaption}>
          <h2 className={styles.heading}>{copy.woodFilmTitle}</h2>
        </div>
      </div>
      <div className={styles.dustVeil} aria-hidden="true" />
      <canvas ref={dustCanvasRef} className={styles.dustCloud} width={384} height={240} aria-hidden="true" />
    </div>
    <span id="cleaning-film-disclosure" hidden>{copy.filmDisclosure}</span>
  </section>;
}
