'use client';

import { useEffect, useRef } from 'react';
import type { SiteCopy } from '@/lib/messages/az';
import { createScrollFilmFrames } from './ScrollFilmFrames';
import styles from './ScrollCleaningFilm.module.css';

const woodSource = '/videos/laserx-wood-cleaning.mp4';
const metalSource = '/videos/laserx-scroll-cleaning.mp4';
const woodEnd = 0.32;
const metalStart = 0.48;

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

function seekVideo(video: HTMLVideoElement, progress: number) {
  if (!Number.isFinite(video.duration) || video.duration <= 0 || video.seeking) return;
  const target = progress * Math.max(0, video.duration - 1 / 24);
  if (Math.abs(video.currentTime - target) > 1 / 24) video.currentTime = target;
}

export default function ScrollCleaningFilm({ copy }: { copy: SiteCopy['home'] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const woodRef = useRef<HTMLVideoElement>(null);
  const metalRef = useRef<HTMLVideoElement>(null);
  const woodCanvasRef = useRef<HTMLCanvasElement>(null);
  const metalCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const wood = woodRef.current;
    const metal = metalRef.current;
    const woodCanvas = woodCanvasRef.current;
    const metalCanvas = metalCanvasRef.current;
    if (!section || !stage || !wood || !metal || !woodCanvas || !metalCanvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrowViewport = window.matchMedia('(max-width: 760px)');
    const connection = (navigator as Navigator & {
      connection?: EventTarget & { saveData?: boolean; effectiveType?: string };
    }).connection;
    let frame = 0;
    let isStatic = false;
    let isNear = false;
    let mounted = true;

    const scheduleUpdate = () => {
      if (mounted && !frame) frame = window.requestAnimationFrame(update);
    };

    const woodFrames = createScrollFilmFrames(woodCanvas, 'wood', 60, scheduleUpdate);
    const metalFrames = createScrollFilmFrames(metalCanvas, 'metal', 80, scheduleUpdate);

    const update = () => {
      frame = 0;
      if (isStatic || !isNear) return;

      const travel = section.offsetHeight - stage.offsetHeight;
      const progress = travel > 0 ? clampProgress(-section.getBoundingClientRect().top / travel) : 0;
      const wipe = clampProgress((progress - woodEnd) / (metalStart - woodEnd));
      const woodProgress = clampProgress(progress / woodEnd);
      const metalProgress = clampProgress((progress - metalStart) / (1 - metalStart));
      const titleProgress = clampProgress((wipe - 0.4) / 0.6);

      section.style.setProperty('--wipe-position', `${wipe * 100}%`);
      section.style.setProperty('--wipe-opacity', String(Math.min(wipe * 12, (1 - wipe) * 12, 1)));
      section.style.setProperty('--title-opacity', String(titleProgress));
      section.style.setProperty('--title-offset', `${(1 - titleProgress) * 12}px`);
      section.style.setProperty('--film-progress', `${metalProgress * 100}%`);

      if (narrowViewport.matches) {
        if (wipe < 1) woodFrames.paint(woodProgress);
        metalFrames.paint(metalProgress);
      } else {
        if (wipe < 1) seekVideo(wood, woodProgress);
        if (wipe > 0) seekVideo(metal, metalProgress);
      }
    };

    const loadMedia = () => {
      if (isStatic || !isNear) return;
      if (narrowViewport.matches) {
        woodFrames.preload();
        metalFrames.preload();
      } else if (!wood.hasAttribute('src')) {
        wood.preload = 'auto';
        wood.src = woodSource;
        metal.preload = 'auto';
        metal.src = metalSource;
      }
    };

    const syncMode = () => {
      isStatic = reducedMotion.matches || Boolean(connection?.saveData) ||
        ['slow-2g', '2g'].includes(connection?.effectiveType ?? '');
      section.dataset.static = String(isStatic);
      section.dataset.media = narrowViewport.matches ? 'frames' : 'video';
      if (isStatic) {
        wood.pause();
        metal.pause();
      } else {
        loadMedia();
        scheduleUpdate();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isNear = entry.isIntersecting;
      loadMedia();
      scheduleUpdate();
    }, { rootMargin: `${window.innerHeight}px 0px` });

    syncMode();
    observer.observe(section);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    for (const video of [wood, metal]) {
      video.addEventListener('loadedmetadata', scheduleUpdate);
      video.addEventListener('seeked', scheduleUpdate);
    }
    reducedMotion.addEventListener('change', syncMode);
    narrowViewport.addEventListener('change', syncMode);
    connection?.addEventListener('change', syncMode);

    return () => {
      mounted = false;
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      for (const video of [wood, metal]) {
        video.removeEventListener('loadedmetadata', scheduleUpdate);
        video.removeEventListener('seeked', scheduleUpdate);
      }
      reducedMotion.removeEventListener('change', syncMode);
      narrowViewport.removeEventListener('change', syncMode);
      connection?.removeEventListener('change', syncMode);
    };
  }, []);

  return <section ref={sectionRef} id="proses" className={styles.section} aria-labelledby="cleaning-film-title" aria-describedby="cleaning-film-disclosure">
    <div ref={stageRef} className={styles.stage}>
      <video
        ref={metalRef}
        className={styles.video}
        poster="/images/laserx-scroll-poster.webp"
        preload="none"
        muted
        playsInline
        aria-hidden="true"
      />
      <canvas ref={metalCanvasRef} className={styles.video} width={512} height={288} aria-hidden="true" />
      <div className={styles.woodScene} aria-hidden="true">
        <div className={styles.woodMedia}>
          <video ref={woodRef} poster="/images/laserx-wood-poster.webp" preload="none" muted playsInline />
          <canvas ref={woodCanvasRef} width={400} height={600} />
        </div>
      </div>
      <div className={styles.laserLine} aria-hidden="true" />
      <div className={styles.content}>
        <h2 id="cleaning-film-title">{copy.filmTitle}</h2>
        <div className={styles.scrollCue} aria-hidden="true">
          <span className={styles.progressTrack}><span className={styles.progressFill} /></span>
          <span>{copy.filmScrollCue} ↓</span>
        </div>
      </div>
    </div>
    <span id="cleaning-film-disclosure" hidden>{copy.filmDisclosure}</span>
  </section>;
}
