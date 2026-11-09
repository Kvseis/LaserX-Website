import type { ReactNode } from 'react';
import type { SiteCopy } from '@/lib/messages/az';
import styles from './ApplicationsShowcase.module.css';

const applicationIcons = ['gear', 'car', 'wing', 'building', 'flame', 'factory', 'column', 'machine', 'factory', 'wave', 'pipe', 'bolt'];

function LineIcon({ type }: { type: string }) {
  const paths: Record<string, ReactNode> = {
    gear: <><circle cx="24" cy="24" r="8" /><path d="M24 5v5M24 38v5M5 24h5M38 24h5M10.5 10.5l3.7 3.7M33.8 33.8l3.7 3.7M37.5 10.5l-3.7 3.7M14.2 33.8l-3.7 3.7" /></>,
    car: <><path d="M9 29h30l-3-10H15l-6 10Zm3 0v7m24-7v7M15 36h18" /><circle cx="16" cy="30" r="2" /><circle cx="32" cy="30" r="2" /></>,
    wing: <><path d="m7 27 34-15-13 16 10 7-5 3-12-6-6 8-4-2 4-10-8-1Z" /></>,
    building: <><path d="M11 41V15h26v26M8 41h32M17 21h4m6 0h4m-14 7h4m6 0h4m-14 7h4m6 0h4" /></>,
    flame: <><path d="M25 6c4 8-4 10 1 16 2-4 5-6 7-7 6 9 5 20-3 25-9 6-19 0-19-10 0-7 4-13 9-18 0 7 1 11 5 13" /></>,
    factory: <><path d="M7 41V20l10 6v-8l10 7v-9h14v25H7Zm6-8h4m6 0h4m7 0h3M32 16V9h6v7" /></>,
    column: <><path d="M12 11h24l-3 6H15l-3-6Zm5 6v19m7-19v19m7-19v19M12 36h24l3 5H9l3-5Z" /></>,
    machine: <><rect x="9" y="12" width="30" height="28" rx="2" /><circle cx="18" cy="25" r="5" /><path d="M27 20h7m-7 6h7m-7 6h7M14 40v3m20-3v3" /></>,
    wave: <><path d="M7 30c5-5 8 5 13 0s8 5 13 0 8 5 10 1M10 23l7-8h14l7 8M19 15V9h9" /></>,
    pipe: <><path d="M7 17h12v8h10V14h12M7 31h12v-6m10 0v7h12M10 14v20m28-23v26" /><circle cx="7" cy="24" r="4" /><circle cx="41" cy="24" r="4" /></>,
    bolt: <><path d="m27 5-13 22h10l-3 16 14-24H25l2-14Z" /></>,
  };
  return <svg viewBox="0 0 48 48" aria-hidden="true">{paths[type]}</svg>;
}

export default function ApplicationsShowcase({ id, copy }: {
  id: string;
  copy: SiteCopy['technology'];
}) {
  return <section className={styles.applications} id={id}>
    <div className={styles.sectionIntro}><h2>{copy.applicationsTitle[0]}<br /><em>{copy.applicationsTitle[1]}</em></h2><p>{copy.applicationsDescription}</p></div>
    <div className={styles.applicationGrid}>
      {copy.applications.map((title, index) => <article key={title} data-tech-reveal><span><LineIcon type={applicationIcons[index]} /></span><h3>{title}</h3></article>)}
    </div>
  </section>;
}
