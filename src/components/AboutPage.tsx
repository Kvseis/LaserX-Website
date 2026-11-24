import Image from 'next/image';
import { ArrowDownRight } from 'lucide-react';
import type { SiteCopy } from '@/lib/messages/az';
import { sitePath, type Locale } from '@/lib/locales';
import { getAboutCopy } from '@/lib/about-copy';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import ContactBanner from './ContactBanner';
import AboutReveal from './AboutReveal';
import AboutStory from './AboutStory';
import Steps from './Steps';
import styles from './AboutPage.module.css';

export default function AboutPage({ locale, copy }: { locale: Locale; copy: SiteCopy }) {
  const about = getAboutCopy(locale);

  return (
    <div className={styles.page} id="top">
      <SiteHeader locale={locale} page="about" copy={copy.nav} />
      <AboutReveal>
        <div className={styles.editorial}>
          <section className={styles.hero} aria-labelledby="about-title">
            <div className={styles.heroFrame}>
              <picture>
                <source media="(max-width: 640px)" srcSet="/images/about-flanges-mobile.webp" />
                <Image className={styles.heroImage} src="/images/about-flanges.webp" fill sizes="100vw"
                  fetchPriority="high" loading="eager" alt={about.heroAlt} />
              </picture>
              <div className={styles.heroContent}>
                <nav className={styles.breadcrumb} aria-label={copy.nav.about}>
                  <a href={sitePath(locale)}>{about.breadcrumbHome}</a>
                  <span aria-hidden="true">/</span>
                  <span aria-current="page">{copy.nav.about}</span>
                </nav>
                <h1 id="about-title">{about.heroTitle}</h1>
                <p>{about.heroIntro}</p>
                <a className={styles.heroAction} href="#sifaris">
                  {about.heroCta}<ArrowDownRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>

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
            <AboutStory about={about} technologyHref={sitePath(locale, 'technology')} />
          </div>
          <Steps label={about.processLabel} title={about.processTitle} titles={about.process} />
        </div>
        <ContactBanner copy={copy} />
      </AboutReveal>
      <SiteFooter locale={locale} copy={copy} />
    </div>
  );
}
