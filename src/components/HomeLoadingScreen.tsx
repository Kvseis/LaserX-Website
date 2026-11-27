'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { SiteCopy } from '@/lib/messages/az';
import styles from './HomeLoadingScreen.module.css';

const showAfterMs = 180;
const timeoutMs = 2400;

export default function HomeLoadingScreen({ imageId, copy }: { imageId: string; copy: SiteCopy['home']['loading'] }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const image = document.getElementById(imageId);
    if (!(image instanceof HTMLImageElement) || image.complete || document.hidden ||
      window.location.hash || window.scrollY > 0 || document.activeElement !== document.body) return;

    const listeners = new AbortController();
    const { signal } = listeners;
    const showTimer = window.setTimeout(() => {
      if (!image.complete) setVisible(true);
    }, showAfterMs);
    const timeout = window.setTimeout(finish, timeoutMs);

    function cleanup() {
      window.clearTimeout(showTimer);
      window.clearTimeout(timeout);
      listeners.abort();
    }

    function finish() {
      cleanup();
      setVisible(false);
    }

    function finishOutsideScreen(event: Event) {
      if (event.target instanceof Node && screenRef.current?.contains(event.target)) return;
      finish();
    }

    image.addEventListener('load', finish, { signal });
    image.addEventListener('error', finish, { signal });
    document.addEventListener('visibilitychange', finish, { signal });
    document.addEventListener('focusin', finishOutsideScreen, { signal });
    window.addEventListener('pointerdown', finishOutsideScreen, { signal, passive: true });
    window.addEventListener('scroll', finish, { signal, passive: true });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') finish();
    }, { signal });

    return cleanup;
  }, [imageId]);

  if (!visible) return null;

  return <div ref={screenRef} className={styles.screen} data-home-loading>
    <div className={styles.panel}>
      <div className={styles.plate} aria-hidden="true">
        <Image src="/images/logo-mark-transparent.png" width={42} height={42} alt="" loading="eager" />
      </div>
      <div className={styles.labels}>
        <strong>LaserX</strong>
        <span role="status">{copy.status}</span>
      </div>
      <div className={styles.track} aria-hidden="true" />
      <button className={styles.skip} type="button" onClick={() => setVisible(false)}>{copy.skip}</button>
    </div>
  </div>;
}
