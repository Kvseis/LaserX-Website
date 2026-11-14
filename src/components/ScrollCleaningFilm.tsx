'use client';

import { useEffect, useRef } from 'react';
import type { SiteCopy } from '@/lib/messages/az';
import styles from './ScrollCleaningFilm.module.css';

const filmSource = '/videos/laserx-scroll-cleaning.mp4';

export default function ScrollCleaningFilm({ copy }: { copy: SiteCopy['home'] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & {
      connection?: EventTarget & { saveData?: boolean; effectiveType?: string };
    }).connection;
    let frame = 0;
    let targetTime = 0;
    let isStatic = false;

    const update = () => {
      frame = 0;
      if (isStatic) return;

      const travel = section.offsetHeight - window.innerHeight;
      const progress = travel > 0
        ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / travel))
        : 0;
      section.style.setProperty('--film-progress', `${progress * 100}%`);

      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      targetTime = progress * Math.max(0, video.duration - 1 / 24);
      if (!video.seeking && Math.abs(video.currentTime - targetTime) > 0.05) {
        video.currentTime = targetTime;
      }
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const loadVideo = () => {
      if (isStatic || video.src) return;
      const bounds = section.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 2 && bounds.bottom > -window.innerHeight) {
        video.src = filmSource;
        video.load();
      }
    };

    const syncMode = () => {
      isStatic = reducedMotion.matches || Boolean(connection?.saveData) ||
        ['slow-2g', '2g'].includes(connection?.effectiveType ?? '');
      section.dataset.static = String(isStatic);
      if (isStatic) {
        video.pause();
        section.style.setProperty('--film-progress', '0%');
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
    video.addEventListener('loadedmetadata', scheduleUpdate);
    video.addEventListener('seeked', scheduleUpdate);
    reducedMotion.addEventListener('change', syncMode);
    connection?.addEventListener('change', syncMode);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      video.removeEventListener('loadedmetadata', scheduleUpdate);
      video.removeEventListener('seeked', scheduleUpdate);
      reducedMotion.removeEventListener('change', syncMode);
      connection?.removeEventListener('change', syncMode);
    };
  }, []);

  return <section ref={sectionRef} id="proses" className={styles.section} aria-labelledby="cleaning-film-title">
    <div className={styles.stage}>
      <video
        ref={videoRef}
        className={styles.video}
        poster="/images/laserx-scroll-poster.webp"
        preload="none"
        muted
        playsInline
        aria-hidden="true"
      />
      <div className={styles.content}>
        <span className={styles.eyebrow}>LaserX / 01</span>
        <h2 id="cleaning-film-title">{copy.filmTitle}</h2>
        <p>{copy.filmDescription}</p>
        <div className={styles.scrollCue} aria-hidden="true">
          <span className={styles.progressTrack}><span className={styles.progressFill} /></span>
          <span>{copy.filmScrollCue} ↓</span>
        </div>
      </div>
      <p className={styles.disclosure}>{copy.filmDisclosure}</p>
    </div>
  </section>;
}
