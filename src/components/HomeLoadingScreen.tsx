'use client';

import BrandWordmark from './BrandWordmark';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { SiteCopy } from '@/lib/messages/az';
import styles from './HomeLoadingScreen.module.css';

const showAfterMs = 350;
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
      if (signal.aborted) return;
      cleanup();
      setVisible(false);
    }

    function finishOutsideScreen(event: Event) {
      if (event.target instanceof Node && screenRef.current?.contains(event.target)) return;
      finish();
    }

    dismiss.current = finish;
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

  return <>
    {visible && <div ref={screenRef} className={styles.screen} data-home-loading>
      <div className={styles.panel}>
        <div className={styles.labels}>
          <BrandWordmark />
          <span role="status">{copy.status}</span>
        </div>
        <div className={styles.track} aria-hidden="true" />
        <button className={styles.skip} type="button" onClick={() => dismiss.current()}>{copy.skip}</button>
      </div>
    </div>}
    {children}
  </>;
}
