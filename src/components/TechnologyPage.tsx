import Image from 'next/image';
import { sitePath, type Locale } from '@/lib/locales';
import type { SiteCopy } from '@/lib/messages/az';
import styles from './TechnologyPage.module.css';
import ApplicationsShowcase from './ApplicationsShowcase';
import SiteHeader from './SiteHeader';
import { phone, whatsapp } from '@/lib/contact';
import WhatsAppLogo from './WhatsAppLogo';


function BenefitIcon({ index }: { index: number }) {
  const icons = [
    <><path d="M9 3h6M11 3v5L5.8 17a2.7 2.7 0 0 0 2.3 4h7.8a2.7 2.7 0 0 0 2.3-4L13 8V3M8 14h8M3 3l18 18" /></>,
    <><path d="M4 14c2.5-2.6 5-2.6 7.5 0s5 2.6 8.5 0M5 9c2-2 4-2 6 0m3 0c1.7-1.7 3.5-1.7 5.3 0M4 19h16" /></>,
    <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="M12 2v4m0 12v4M2 12h4m12 0h4" /></>,
    <><path d="M19 4c-8 0-13 4-13 10 0 3 2 6 6 6 6 0 8-7 7-16ZM5 21c2-5 6-8 11-11" /></>,
  ];
  return <svg viewBox="0 0 24 24" aria-hidden="true">{icons[index]}</svg>;
}

function ProcessIcon({ index }: { index: number }) {
  const icons = [
    <><path d="M39 10h18v18H39zM43 28v9h10v-9M48 37v13M30 63h36M35 56l6-4m14 0 6 4m-26 0-7 1m33 0 7 1" /></>,
    <><path d="M48 10v34M42 16v26M54 20v22M29 62h38v8H29z" /><circle cx="27" cy="45" r="3" /><circle cx="37" cy="51" r="3" /><circle cx="47" cy="48" r="3" /><circle cx="58" cy="52" r="3" /><circle cx="68" cy="44" r="3" /></>,
    <><path d="M29 63h38v8H29zM38 52c-7-8 7-10 0-19M48 52c-7-8 7-10 0-19M58 52c-7-8 7-10 0-19" /></>,
    <><path d="M29 63h38v8H29zM48 15l3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Zm17 20 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5ZM31 37l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" /></>,
  ];
  return <svg viewBox="0 0 96 80" aria-hidden="true">{icons[index]}</svg>;
}

export default function TechnologyPage({ locale, copy }: { locale: Locale; copy: SiteCopy }) {
  const { nav, home, technology } = copy;

  return <div className={styles.page}>
    <SiteHeader locale={locale} page="technology" copy={nav} />

    <main>
      <section className={styles.hero}>
        <Image className={styles.heroMedia} src="/images/technology-hero.webp" fill priority sizes="100vw" alt={technology.heroAlt} />
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <h1><span>{home.technologyTitle[0]} <em>{home.technologyTitle[1]}</em></span></h1>
          <p>{technology.description}</p>
          <div className={styles.benefits}>
            {technology.benefits.map(([title, text], index) => <article key={title}>
              <span className={styles.benefitIcon}><BenefitIcon index={index} /></span>
              <h2>{title}</h2><p>{text}</p>
            </article>)}
          </div>
          <a className={styles.primaryCta} href={`${whatsapp}?text=${encodeURIComponent(technology.message)}`}><WhatsAppLogo /><span>{technology.more}</span></a>
        </div>
      </section>

      <section className={styles.process} id="proses">
        <div className={`${styles.sectionIntro} ${styles.processIntro}`}><h2>{technology.processTitle[0]}<em>{technology.processTitle[1]}</em>{technology.processTitle[2]}</h2><p>{technology.processDescription}</p></div>
        <div className={styles.processGrid}>
          {technology.process.map(([title, text], index) => <article data-tech-reveal key={title}>
            <span className={styles.stepNumber}>{index + 1}</span>
            <div className={styles.stepGraphic}><ProcessIcon index={index} /></div>
            <h3>{title}</h3><p>{text}</p>
            {index < technology.process.length - 1 && <span className={styles.stepArrow} aria-hidden="true">→</span>}
          </article>)}
        </div>
      </section>

      <ApplicationsShowcase id="tetbiqler" copy={technology} />

      <section className={styles.cta}>
        <Image className={styles.ctaMedia} src="/images/technology-cta.webp" fill sizes="100vw" alt={technology.contactAlt} />
        <div className={styles.ctaShade} />
        <div className={styles.ctaContent}><h2>{technology.contactTitle}</h2><p>{home.contactDescription}</p><div><a href={phone}>{nav.call}</a><a href={whatsapp}>{technology.whatsapp}</a></div></div>
      </section>
    </main>

    <footer><a className="wordmark" href={sitePath(locale)}><Image src="/images/logo-mark-transparent.png" width={40} height={40} alt="" /><span>LaserX</span></a><p>© {new Date().getFullYear()} LaserX. {copy.location}.</p><a href={phone}>055 390 00 28</a></footer>
  </div>;
}
