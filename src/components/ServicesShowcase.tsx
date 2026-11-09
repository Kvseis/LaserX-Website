import type { SiteCopy } from '@/lib/messages/az';
import styles from './ServicesShowcase.module.css';

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
  return (
    <section className={styles.services} id="xidmetler" aria-labelledby="xidmetler-basliq">
      <div className={styles.inner}>
        <h2 id="xidmetler-basliq">{copy.heading[0]} <span>{copy.heading[1]}</span></h2>
        <div className={styles.grid}>
          {copy.items.map(([title, description], index) => (
            <article className={styles.service} key={title}>
              <div className={styles.icon} aria-hidden="true">
                <svg viewBox="0 0 48 48">{serviceIcons[index].icon}</svg>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <a className={styles.link} href={`${technologyPath}#tetbiqler`}>
          {copy.link}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
        </a>
      </div>
    </section>
  );
}
