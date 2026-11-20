'use client';

import { useEffect, useRef } from 'react';
import type { SiteCopy } from '@/lib/messages/az';
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

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const wood = woodRef.current;
    const metal = metalRef.current;
    if (!section || !stage || !wood || !metal) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & {
      connection?: EventTarget & { saveData?: boolean; effectiveType?: string };
    }).connection;
    let frame = 0;
    let isStatic = false;

    const update = () => {
      frame = 0;
      if (isStatic) return;

      const travel = section.offsetHeight - stage.offsetHeight;
      const progress = travel > 0 ? clampProgress(-section.getBoundingClientRect().top / travel) : 0;
      const wipe = clampProgress((progress - woodEnd) / (metalStart - woodEnd));
      const metalProgress = clampProgress((progress - metalStart) / (1 - metalStart));
      const titleProgress = clampProgress((wipe - 0.4) / 0.6);

      section.style.setProperty('--wipe-position', `${wipe * 100}%`);
      section.style.setProperty('--wipe-opacity', String(Math.min(wipe * 12, (1 - wipe) * 12, 1)));
      section.style.setProperty('--title-opacity', String(titleProgress));
      section.style.setProperty('--title-offset', `${(1 - titleProgress) * 12}px`);
      section.style.setProperty('--film-progress', `${metalProgress * 100}%`);

      if (wipe < 1) seekVideo(wood, clampProgress(progress / woodEnd));
      if (wipe > 0) seekVideo(metal, metalProgress);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const loadVideo = () => {
      if (isStatic || wood.src) return;
      const bounds = section.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 2 && bounds.bottom > -window.innerHeight) {
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
      if (isStatic) {
        wood.pause();
        metal.pause();
      } else {
        loadVideo();
        scheduleUpdate();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadVideo();
    }, { rootMargin: '100% 0px' });

    syncMode();
    observer.observe(section);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    for (const video of [wood, metal]) {
      video.addEventListener('loadedmetadata', scheduleUpdate);
      video.addEventListener('seeked', scheduleUpdate);
    }
    reducedMotion.addEventListener('change', syncMode);
    connection?.addEventListener('change', syncMode);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      for (const video of [wood, metal]) {
        video.removeEventListener('loadedmetadata', scheduleUpdate);
        video.removeEventListener('seeked', scheduleUpdate);
      }
      reducedMotion.removeEventListener('change', syncMode);
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
      <div className={styles.woodScene} aria-hidden="true">
        <video ref={woodRef} poster="/images/laserx-wood-poster.webp" preload="none" muted playsInline />
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
