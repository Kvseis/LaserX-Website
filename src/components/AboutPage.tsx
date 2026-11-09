import Image from 'next/image';
import type { SiteCopy } from '@/lib/messages/az';
import { sitePath, type Locale } from '@/lib/locales';
import { getAboutCopy } from '@/lib/about-copy';
import SiteHeader, { PhoneIcon } from './SiteHeader';
import WhatsAppLogo from './WhatsAppLogo';
import styles from './AboutPage.module.css';

function AboutIcon({ index }: { index: number }) {
  const paths = [
    <><path d="m14 3-8 11h6l-2 7 8-12h-6l2-6Z" /></>,
    <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 1v4m0 14v4M1 12h4m14 0h4" /></>,
    <><path d="M20 11a8 8 0 0 1-8 8H5l-3 3V11a9 9 0 0 1 18 0Z" /><path d="M7 10h8m-8 4h5" /></>,
    <><path d="M8 3h8M10 3v6L4 19a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2L14 9V3M7 15h10M2 2l20 20" /></>,
    <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="9" cy="6" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="8" cy="18" r="2" /></>,
    <><path d="M15 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10v8M7 7h4m-4 4h3" /><circle cx="16" cy="15" r="4" /><path d="m19 18 3 3" /></>,
    <><path d="M20 3C8 3 3 7 4 14c1 6 8 8 12 4 4-4 4-9 4-15ZM5 20 16 9M9 16v-5m0 5h5" /></>,
    <><path d="M9 4H5v18h14V4h-4M9 2h6v4H9zM8 11l2 2 5-5M8 17h8" /></>,
  ];
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[index]}</svg>;
}

export default function AboutPage({ locale, copy }: { locale: Locale; copy: SiteCopy }) {
  const about = getAboutCopy(locale);
  const phone = 'tel:+994553900028';
  const whatsapp = 'https://wa.me/994553900028';
  const surfaceImages = ['rust-after.webp', 'graffiti-after.webp', 'wood-after.webp'];
  const reasonIcons = [1, 3, 4, 5, 6, 7];

  return <div className={styles.page} id="top">
    <SiteHeader locale={locale} page="about" copy={copy.nav} />
    <main>
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroLayout}`}>
        <div className={styles.heroContent}>
          <p className={styles.label}>{copy.nav.about}</p>
          <h1>{about.hero[0]}<span>{about.hero[1]}</span></h1>
          <p className={styles.lead}>{about.description}</p>
          <div className={styles.actions}>
            <a className={styles.whatsapp} href={whatsapp}><WhatsAppLogo />{copy.nav.whatsapp}</a>
            <a className={styles.secondary} href={`${sitePath(locale)}#xidmetler`}>{about.servicesLink}</a>
          </div>
        </div>
        <div className={styles.heroFrame}>
          <Image className={styles.heroImage} src="/images/about-hero.webp" fill priority sizes="(max-width: 760px) 92vw, 52vw" alt={about.heroAlt} />
        </div>
        </div>
      </section>

      <section className={`${styles.container} ${styles.story}`}>
        <div>
          <p className={styles.label}>{about.storyLabel}</p>
          <h2>{about.storyTitle}</h2>
          {about.story.map((paragraph) => <p className={styles.body} key={paragraph}>{paragraph}</p>)}
          <a className={styles.textLink} href={sitePath(locale, 'technology')}>{about.technologyLink}<span aria-hidden="true">→</span></a>
        </div>
        <div className={styles.storyImage}>
          <Image src="/images/about-restoration.webp" width={960} height={1200} sizes="(max-width: 760px) 92vw, 42vw" alt={about.storyAlt} />
        </div>
      </section>

      <section className={styles.mission}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <p className={styles.label}>{about.missionLabel}</p>
            <h2>{about.missionTitle}</h2>
            <p className={styles.body}>{about.missionText}</p>
          </div>
          <div className={styles.values}>
            {about.values.map((item, index) => <article key={item.title}>
              <span className={styles.icon}><AboutIcon index={index} /></span>
              <h3>{item.title}</h3><p>{item.text}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className={`${styles.container} ${styles.reasons}`}>
        <div className={styles.sectionIntro}><h2>{about.reasonsTitle}</h2></div>
        <div className={styles.reasonGrid}>
          {about.reasons.map((item, index) => <article key={item.title}>
            <span className={styles.icon}><AboutIcon index={reasonIcons[index]} /></span>
            <h3>{item.title}</h3><p>{item.text}</p>
          </article>)}
        </div>
      </section>

      <section className={styles.surfaces}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}><h2>{about.surfacesTitle}</h2><p className={styles.body}>{about.surfacesIntro}</p></div>
          <div className={styles.surfaceGrid}>
            {about.surfaces.map((item, index) => <article key={item.title}>
              <div className={styles.surfaceImage}><Image src={`/images/${surfaceImages[index]}`} fill sizes="(max-width: 760px) 92vw, 30vw" alt="" /></div>
              <div className={styles.surfaceCopy}><h3>{item.title}</h3><p>{item.text}</p></div>
            </article>)}
          </div>
          <a className={styles.secondary} href={`${sitePath(locale)}#xidmetler`}>{about.servicesLink}</a>
        </div>
      </section>

      <section className="contact">
        <h2>{copy.home.contactTitle[0]}<br />{copy.home.contactTitle[1]}</h2>
        <p>{copy.home.contactDescription}</p>
        <a className="big-phone" href={phone} aria-label={copy.nav.callNumber}>055 390 00 28<PhoneIcon /></a>
        <a className="button contact-whatsapp" href={whatsapp}><WhatsAppLogo />{copy.nav.whatsapp}</a>
      </section>
    </main>
    <p className={styles.disclosure}>{about.disclosure}</p>
    <footer>
      <a className="wordmark nav-brand" href={sitePath(locale)} aria-label={copy.nav.home}><Image src="/images/logo-mark-transparent.png" width={40} height={40} alt="" /><span>LaserX</span></a>
      <p>© {new Date().getFullYear()} LaserX · {copy.city}</p>
      <a href={phone}>055 390 00 28</a>
    </footer>
  </div>;
}
