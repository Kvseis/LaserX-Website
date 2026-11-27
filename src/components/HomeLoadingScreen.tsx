'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { SiteCopy } from '@/lib/messages/az';
import { FilmAssetContext, getFilmConnection, usesStaticFilm, warmFilmAssets } from './ScrollFilmAssets';
import styles from './HomeLoadingScreen.module.css';

const showAfterMs = 180;
const timeoutMs = 2400;

export default function HomeLoadingScreen({
  imageId,
  copy,
  children,
}: {
  imageId: string;
  copy: SiteCopy['home']['loading'];
  children: ReactNode;
}) {
  const screenRef = useRef<HTMLDivElement>(null);
  const dismiss = useRef<() => void>(() => {});
  const filmSources = useRef(new Map<string, string>());
  const assetSource = useCallback((path: string) => filmSources.current.get(path) ?? path, []);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const image = document.getElementById(imageId);
    if (!(image instanceof HTMLImageElement) || document.hidden ||
      window.location.hash || window.scrollY > 0 || document.activeElement !== document.body) return;

    const listeners = new AbortController();
    const { signal } = listeners;
    const sources = filmSources.current;
    let imageReady = image.complete;
    let filmReady = usesStaticFilm(window.matchMedia('(prefers-reduced-motion: reduce)').matches, getFilmConnection());
    if (imageReady && filmReady) return;

    const showTimer = window.setTimeout(() => setVisible(true), showAfterMs);
    const timeout = window.setTimeout(finish, timeoutMs);

    function cleanup() {
      window.clearTimeout(showTimer);
      window.clearTimeout(timeout);
      listeners.abort();
    }

    function finish() {
      if (signal.aborted) return;
      cleanup();
      setVisible(false);
    }

    function finishIfReady() {
      if (imageReady && filmReady) finish();
    }

    function finishOutsideScreen(event: Event) {
      if (event.target instanceof Node && screenRef.current?.contains(event.target)) return;
      finish();
    }

    function markImageReady() {
      imageReady = true;
      finishIfReady();
    }

    dismiss.current = finish;
    image.addEventListener('load', markImageReady, { signal });
    image.addEventListener('error', markImageReady, { signal });
    document.addEventListener('visibilitychange', finish, { signal });
    document.addEventListener('focusin', finishOutsideScreen, { signal });
    window.addEventListener('pointerdown', finishOutsideScreen, { signal, passive: true });
    window.addEventListener('scroll', finish, { signal, passive: true });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') finish();
    }, { signal });

    if (!filmReady) {
      const narrowViewport = window.matchMedia('(max-width: 760px)').matches;
      void warmFilmAssets(narrowViewport, signal, (path, asset) => {
        sources.set(path, URL.createObjectURL(asset));
      }).then(() => {
        filmReady = true;
        finishIfReady();
      });
    }

    return () => {
      cleanup();
      for (const source of sources.values()) URL.revokeObjectURL(source);
      sources.clear();
    };
  }, [imageId]);

  return <FilmAssetContext value={assetSource}>
    {visible && <div ref={screenRef} className={styles.screen} data-home-loading>
      <div className={styles.panel}>
        <div className={styles.plate} aria-hidden="true">
          <Image src="/images/logo-mark-transparent.png" width={42} height={42} alt="" loading="eager" />
        </div>
        <div className={styles.labels}>
          <strong>LaserX</strong>
          <span role="status">{copy.status}</span>
        </div>
        <div className={styles.track} aria-hidden="true" />
        <button className={styles.skip} type="button" onClick={() => dismiss.current()}>{copy.skip}</button>
      </div>
    </div>}
    {children}
  </FilmAssetContext>;
}
