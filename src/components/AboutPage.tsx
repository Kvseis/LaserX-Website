import Image from 'next/image';
import { Onest } from 'next/font/google';
import type { SiteCopy } from '@/lib/messages/az';
import { sitePath, type Locale } from '@/lib/locales';
import { getAboutCopy } from '@/lib/about-copy';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import ContactBanner from './ContactBanner';
import AboutReveal from './AboutReveal';
import AboutStory from './AboutStory';
import Steps from './Steps';
import ButtonArrow from './ButtonArrow';
import styles from './AboutPage.module.css';

const onest = Onest({ subsets: ['latin'], display: 'swap' });

export default function AboutPage({ locale, copy }: { locale: Locale; copy: SiteCopy }) {
  const about = getAboutCopy(locale);

  return (
    <div className={styles.page} id="top">
      <SiteHeader locale={locale} page="about" copy={copy.nav} />
      <AboutReveal>
        <section className={`hero ${styles.hero} ${onest.className}`} aria-labelledby="about-title">
          <picture>
            <source media="(max-width: 640px)" srcSet="/images/about-concrete-flanges-mobile.webp" />
            <Image
              className={`hero-sky ${styles.heroImage}`}
              src="/images/about-concrete-flanges.webp"
              alt={about.heroAlt}
              fill
              sizes="(max-aspect-ratio: 3/2) 170svh, 100vw"
              fetchPriority="high"
              loading="eager"
            />
          </picture>
          <div className={`hero-shade ${styles.heroShade}`} aria-hidden="true" />
          <div className="hero-copy">
            <nav className={styles.breadcrumb} aria-label={copy.nav.about}>
              <a href={sitePath(locale)}>{about.breadcrumbHome}</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{copy.nav.about}</span>
            </nav>
            <h1 id="about-title">{about.heroTitle}</h1>
            <div className="hero-details">
              <p>{about.heroIntro}</p>
              <div className="hero-actions">
                <a className="hero-book" href="#sifaris">{about.heroCta}<ButtonArrow /></a>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.editorial}>
          <section className={styles.principles} id="principles" aria-labelledby="principles-title">
            <div className={styles.container}>
              <div className={styles.principlesIntro}>
                <h2 id="principles-title">{about.missionTitle}</h2>
                <p className={styles.statement} data-about-text>
                  {about.missionText.split(' ').map((word, index) => <span key={index} data-about-word>{word}{' '}</span>)}
                </p>
              </div>
              <div className={styles.values}>
                {about.values.map((item) => (
                  <article key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <div className={styles.storySection}>
            <AboutStory about={about} />
          </div>
          <Steps label={about.processLabel} title={about.processTitle} titles={about.process} />
        </div>
        <ContactBanner copy={copy} />
      </AboutReveal>
      <SiteFooter locale={locale} copy={copy} />
    </div>
  );
}
