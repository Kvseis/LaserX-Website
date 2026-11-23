'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { SiteCopy } from '@/lib/messages/az';
import styles from './ServicesShowcase.module.css';

const serviceImages = [
  '/images/services/rust.webp',
  '/images/services/graffiti.webp',
  '/images/services/coating.webp',
  '/images/services/restoration.webp',
  '/images/services/biofilm.webp',
  '/images/services/mold.webp',
  '/images/services/grease.webp',
  '/images/services/soot.webp',
];

const serviceIcons = [
  {
    icon: <>
      <circle cx="24" cy="24" r="15" /><circle cx="24" cy="24" r="6" />
      <path d="M24 13h.01M35 24h.01M24 35h.01M13 24h.01M16 16h.01M32 32h.01" strokeWidth="3" />
    </>,
  },
  {
    icon: <>
      <path d="M8 12h32v24H8zM8 20h32M8 28h32M20 12v8m12 0v8M18 28v8" opacity=".58" />
      <path d="m13 26 7-9 3 12 5-6 2 8 5-7" />
    </>,
  },
  {
    icon: <path d="m8 22 16-9 16 9-16 9-16-9Zm0 7 16 9 16-9m-8-2v-6l8 1m-6-8 5-5m-1 9 6-2M31 11l2-6" />,
  },
  {
    icon: <path d="M11 11h26l-3 6H14l-3-6Zm6 6v18m5-18v18m4-18v18m5-18v18M14 35h20l3 5H11l3-5ZM9 8h30" />,
  },
  {
    icon: <>
      <path d="M24 14c3-4 9-1 9 3 5 1 6 7 3 10 2 5-2 9-7 8-2 4-8 4-10 0-5 1-9-3-7-8-3-3-2-9 3-10 0-4 6-7 9-3Z" />
      <circle cx="22" cy="23" r="2" /><circle cx="29" cy="29" r="1.5" />
      <path d="M10 11h.01M38 10h.01M41 32h.01M10 38h.01" strokeWidth="3" />
    </>,
  },
  {
    icon: <>
      <rect x="8" y="10" width="32" height="28" rx="3" />
      <path d="M24 10v28M13 19l4-3 3 3v9l-3 3-4-3v-9Zm15 0 3-3 4 3v9l-4 3-3-3v-9Z" />
    </>,
  },
  {
    icon: <path d="M24 8c-3 5-9 11-9 17a9 9 0 0 0 18 0c0-6-6-12-9-17Zm-5 17c0 3 2 5 4 5M8 35h32M12 40h24" />,
  },
  {
    icon: <path d="M11 39V27a13 13 0 0 1 26 0v12H11Zm6 0V27a7 7 0 0 1 14 0v12M9 39h30M20 13c3-3-3-4 0-7m8 7c3-3-3-4 0-7" />,
  },
];

export default function ServicesShowcase({ copy, technologyPath }: {
  copy: SiteCopy['services'];
  technologyPath: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!rail || !section || !stage) return;
    let frame = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 761px) and (min-height: 740px)');
    const update = () => {
      frame = 0;
      if (section.dataset.scroll !== 'page') return;
      const distance = Math.max(0, rail.scrollWidth - rail.clientWidth);
      const position = Math.min(distance, Math.max(0, 92 - section.getBoundingClientRect().top));
      rail.scrollLeft = position;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      const enabled = desktop.matches && !reducedMotion.matches;
      section.dataset.scroll = enabled ? 'page' : 'native';
      if (enabled) {
        const distance = rail.scrollWidth - rail.clientWidth;
        section.style.height = `${stage.offsetHeight + Math.max(0, distance)}px`;
        update();
      } else {
        section.style.removeProperty('height');
      }
    };
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    observer.observe(rail);
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    desktop.addEventListener('change', measure);
    reducedMotion.addEventListener('change', measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      desktop.removeEventListener('change', measure);
      reducedMotion.removeEventListener('change', measure);
      delete section.dataset.scroll;
      section.style.removeProperty('height');
    };
  }, []);

  const updateProgress = () => {
    const rail = railRef.current;
    if (!rail) return;
    const distance = rail.scrollWidth - rail.clientWidth;
    setProgress(distance > 0 ? rail.scrollLeft / distance : 1);
  };

  const move = (direction: -1 | 1) => {
    const rail = railRef.current;
    const card = rail?.querySelector<HTMLElement>(`.${styles.service}`);
    if (!rail || !card) return;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    const next = Math.max(0, Math.min(rail.scrollWidth - rail.clientWidth, rail.scrollLeft + direction * (card.offsetWidth + gap)));
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    if (sectionRef.current?.dataset.scroll === 'page') {
      window.scrollTo({ top: window.scrollY + sectionRef.current.getBoundingClientRect().top - 92 + next, behavior });
    } else {
      rail.scrollTo({ left: next, behavior });
    }
  };

  return (
    <section ref={sectionRef} className={styles.services} id="xidmetler" aria-labelledby="xidmetler-basliq">
      <div ref={stageRef} className={styles.inner}>
        <div className={styles.intro}>
          <h2 id="xidmetler-basliq">{copy.heading[0]} <span>{copy.heading[1]}</span></h2>
          <a className={styles.link} href={`${technologyPath}#tetbiqler`}>
            {copy.link}
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
          </a>
        </div>
        <div className={styles.grid} ref={railRef} onScroll={updateProgress}>
          <div className={styles.brandCard}>
            <Image src="/images/logo-mark-transparent.png" width={54} height={54} alt="LaserX" />
            <div className={styles.brandMessage}><p>{copy.statement}</p></div>
          </div>
          {copy.items.map(([title, description], index) => (
            <article className={styles.service} key={title}>
              <div className={styles.media}><Image src={serviceImages[index]} alt="" fill sizes="(max-width: 760px) 76vw, 310px" /></div>
              <div className={styles.cardTop}>
                  <div className={styles.icon} aria-hidden="true"><svg viewBox="0 0 48 48">{serviceIcons[index].icon}</svg></div>
              </div>
              <div className={styles.cardContent}>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.controls}>
          <span className={styles.track}><span style={{ transform: `scaleX(${Math.max(.15, progress)})` }} /></span>
          <div className={styles.arrows}>
            <button type="button" aria-label={copy.previous} onClick={() => move(-1)} disabled={progress <= .001}>←</button>
            <button type="button" aria-label={copy.next} onClick={() => move(1)} disabled={progress >= .999}>→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
