'use client';

import { useContext, useEffect, useRef } from 'react';
import type { SiteCopy } from '@/lib/messages/az';
import { FilmAssetContext, filmFrameRate, filmSheets, getFilmConnection, metalSource, usesStaticFilm, woodSource } from './ScrollFilmAssets';
import { createScrollFilmFrames } from './ScrollFilmFrames';
import styles from './ScrollCleaningFilm.module.css';

const metalEnd = 0.396;
const woodStart = 0.55;
const dustStart = 0.32;
const dustEnd = 0.60;
const woodPreloadStart = 0.14;
const dustPreloadStart = 0.22;
const heroPreloadStart = 0.18;
const scrollResponseMs = 110;
const metalFraming = [[0, .85], [96, .71], [156, .58], [191, .63]] as const;

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

function easeBetween(value: number, start: number, end: number) {
  const progress = clampProgress((value - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
}

function metalSubjectX(frame: number) {
  // Follow the laser tip, then settle on the cleaned edge as the tool lifts away.
  for (let index = 1; index < metalFraming.length; index++) {
    const [endFrame, endX] = metalFraming[index];
    if (frame > endFrame) continue;
    const [startFrame, startX] = metalFraming[index - 1];
    return startX + (endX - startX) * (frame - startFrame) / (endFrame - startFrame);
  }
  return metalFraming[metalFraming.length - 1][1];
}

function seekVideo(video: HTMLVideoElement, progress: number) {
  if (!Number.isFinite(video.duration) || video.duration <= 0 || video.seeking) return;
  const lastFrame = Math.max(0, Math.round(video.duration * filmFrameRate) - 1);
  const frame = Math.round(progress * lastFrame);
  // Seek just inside the selected frame to avoid rounding to the previous one.
  const target = (frame + 0.1) / filmFrameRate;
  if (Math.abs(video.currentTime - target) > 0.5 / filmFrameRate) video.currentTime = target;
}

export default function ScrollCleaningFilm({ copy }: { copy: SiteCopy['home'] }) {
  const assetSource = useContext(FilmAssetContext);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const woodRef = useRef<HTMLVideoElement>(null);
  const metalRef = useRef<HTMLVideoElement>(null);
  const woodCanvasRef = useRef<HTMLCanvasElement>(null);
  const metalCanvasRef = useRef<HTMLCanvasElement>(null);
  const dustCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const wood = woodRef.current;
    const metal = metalRef.current;
    const woodCanvas = woodCanvasRef.current;
    const metalCanvas = metalCanvasRef.current;
    const dustCanvas = dustCanvasRef.current;
    if (!section || !stage || !wood || !metal || !woodCanvas || !metalCanvas || !dustCanvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrowViewport = window.matchMedia('(max-width: 760px)');
    const connection = getFilmConnection();
    let frame = 0;
    let isStatic = false;
    let isNear = false;
    let mounted = true;
    let displayedProgress: number | undefined;
    let previousFrameTime = 0;

    const scheduleUpdate = () => {
      if (mounted && !frame) frame = window.requestAnimationFrame(update);
    };

    const woodFrames = createScrollFilmFrames(woodCanvas, 'wood', scheduleUpdate, assetSource);
    const metalFrames = createScrollFilmFrames(metalCanvas, 'metal', scheduleUpdate, assetSource);
    const dustFrames = createScrollFilmFrames(dustCanvas, 'dust', scheduleUpdate, assetSource);

    const showDecodedVideo = (event: Event) => {
      const video = event.currentTarget as HTMLVideoElement;
      video.dataset.ready = '';
      scheduleUpdate();
    };

    const retryVideoSource = (event: Event) => {
      const video = event.currentTarget as HTMLVideoElement;
      if (!video.src.startsWith('blob:')) return;
      delete video.dataset.ready;
      video.src = video === metal ? metalSource : woodSource;
    };

    const update = (now: number) => {
      frame = 0;
      if (isStatic || !isNear) return;

      const heroScroll = Number.parseFloat(getComputedStyle(section).getPropertyValue('--hero-scroll')) || 0;
      const offset = -section.getBoundingClientRect().top;
      if (displayedProgress === undefined) {
        // Leave the initial warmup to the homepage loader while the framed hero is still on screen.
        if (heroScroll > 0 && offset < heroScroll * heroPreloadStart) return;
        preloadMetal();
      }

      const travel = section.offsetHeight - stage.offsetHeight - heroScroll;
      const target = travel > 0 ? clampProgress((offset - heroScroll) / travel) : 0;
      const previous = displayedProgress ?? target;
      const elapsed = Math.min(now - previousFrameTime, 32);
      const gap = target - previous;
      // Follow native scrolling without carrying an unfinished scene past either edge.
      const progress = target === 0 || target === 1 || Math.abs(gap) < 0.001
        ? target
        : previous + gap * (1 - Math.exp(-elapsed / scrollResponseMs));
      const progressChanged = progress !== displayedProgress;
      displayedProgress = progress;
      previousFrameTime = now;
      if (progress !== target) scheduleUpdate();
      const transition = clampProgress((progress - metalEnd) / (woodStart - metalEnd));
      const metalProgress = clampProgress(progress / metalEnd);
      const woodProgress = clampProgress((progress - woodStart) / (1 - woodStart));
      const dustProgress = clampProgress((progress - dustStart) / (dustEnd - dustStart));
      const dustActive = dustProgress > 0 && dustProgress < 1;
      const veil = 0.88 * easeBetween(transition, 0.16, 0.48) * (1 - easeBetween(transition, 0.52, 0.84));
      const woodTitleOpacity = easeBetween(transition, 0.76, 1) * (1 - easeBetween(woodProgress, 0.73, 0.91));

      if (progressChanged) {
        section.style.setProperty('--wood-opacity', String(easeBetween(transition, 0.46, 0.54)));
        section.style.setProperty('--dust-veil', String(veil));
        section.style.setProperty('--dust-opacity', dustActive ? '1' : '0');
        section.style.setProperty('--wood-title-opacity', String(woodTitleOpacity));
        section.style.setProperty('--metal-title-opacity', String(1 - easeBetween(transition, 0, 0.42)));
        section.style.setProperty('--film-progress', `${metalProgress * 100}%`);
      }

      if (target >= dustPreloadStart && target < dustEnd) dustFrames.preload();
      if (dustActive) dustFrames.paint(dustProgress);
      if (narrowViewport.matches) {
        if (target >= woodPreloadStart && transition === 0) woodFrames.preload();
        if (transition < 1) {
          const paintedFrame = metalFrames.paint(metalProgress);
          if (paintedFrame !== undefined) metalCanvas.style.setProperty('--metal-subject-x', String(metalSubjectX(paintedFrame)));
        }
        if (transition > 0) woodFrames.paint(woodProgress);
      } else {
        if (target >= woodPreloadStart && !wood.hasAttribute('src')) {
          wood.preload = 'auto';
          wood.src = assetSource(woodSource);
        }
        if (transition < 1) seekVideo(metal, metalProgress);
        if (transition > 0) seekVideo(wood, woodProgress);
      }
    };

    const preloadMetal = () => {
      if (narrowViewport.matches) metalFrames.preload();
      else if (!metal.hasAttribute('src')) {
        metal.preload = 'auto';
        metal.src = assetSource(metalSource);
      }
    };

    const syncMode = () => {
      displayedProgress = undefined;
      isStatic = usesStaticFilm(reducedMotion.matches, connection);
      section.dataset.static = String(isStatic);
      section.dataset.media = narrowViewport.matches ? 'frames' : 'video';
      if (isStatic) {
        wood.pause();
        metal.pause();
      } else {
        scheduleUpdate();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isNear = entry.isIntersecting;
      if (!isNear) displayedProgress = undefined;
      scheduleUpdate();
    }, { rootMargin: '0px 0px -64px' });

    syncMode();
    observer.observe(section);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    for (const video of [wood, metal]) {
      video.addEventListener('loadedmetadata', scheduleUpdate);
      video.addEventListener('loadeddata', showDecodedVideo);
      video.addEventListener('seeked', scheduleUpdate);
      video.addEventListener('error', retryVideoSource);
    }
    reducedMotion.addEventListener('change', syncMode);
    narrowViewport.addEventListener('change', syncMode);
    connection?.addEventListener('change', syncMode);

    return () => {
      mounted = false;
      observer.disconnect();
      for (const frames of [metalFrames, woodFrames, dustFrames]) frames.dispose();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      for (const video of [wood, metal]) {
        video.removeEventListener('loadedmetadata', scheduleUpdate);
        video.removeEventListener('loadeddata', showDecodedVideo);
        video.removeEventListener('seeked', scheduleUpdate);
        video.removeEventListener('error', retryVideoSource);
      }
      reducedMotion.removeEventListener('change', syncMode);
      narrowViewport.removeEventListener('change', syncMode);
      connection?.removeEventListener('change', syncMode);
    };
  }, [assetSource]);

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
      <canvas ref={metalCanvasRef} className={styles.video} width={filmSheets.metal.width} height={filmSheets.metal.height} aria-hidden="true" />
      <div className={styles.content}>
        <h2 id="cleaning-film-title" className={styles.heading}>{copy.filmTitle}</h2>
        <div className={styles.scrollCue} aria-hidden="true">
          <span className={styles.progressTrack}><span className={styles.progressFill} /></span>
          <span>{copy.filmScrollCue} ↓</span>
        </div>
      </div>
      <div className={styles.woodScene}>
        <div className={styles.woodMedia} aria-hidden="true">
          <video ref={woodRef} poster="/images/laserx-wood-poster.webp" preload="none" muted playsInline />
          <canvas ref={woodCanvasRef} width={filmSheets.wood.width} height={filmSheets.wood.height} />
        </div>
        <div className={styles.woodCaption}>
          <h2 className={styles.heading}>{copy.woodFilmTitle}</h2>
        </div>
      </div>
      <div className={styles.dustVeil} aria-hidden="true" />
      <canvas ref={dustCanvasRef} className={styles.dustCloud} width={filmSheets.dust.width} height={filmSheets.dust.height} aria-hidden="true" />
    </div>
    <span id="cleaning-film-disclosure" hidden>{copy.filmDisclosure}</span>
  </section>;
}
