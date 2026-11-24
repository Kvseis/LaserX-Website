import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Crosshair, MessagesSquare, ShieldCheck } from 'lucide-react';
import type { SiteCopy } from '@/lib/messages/az';
import { sitePath, type Locale } from '@/lib/locales';
import { getAboutCopy } from '@/lib/about-copy';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import ContactBanner from './ContactBanner';
import AboutReveal from './AboutReveal';
import styles from './AboutPage.module.css';
import AboutStory from './AboutStory';
import Steps from './Steps';

export default function AboutPage({ locale, copy }: { locale: Locale; copy: SiteCopy }) {
  const about = getAboutCopy(locale);
  const valueIcons = [Crosshair, ShieldCheck, MessagesSquare];
  const surfaceImages = ['rust-after.webp', 'graffiti-after.webp', 'wood-after.webp'];

  return <div className={styles.page} id="top">
    <SiteHeader locale={locale} page="about" copy={copy.nav} />
    <AboutReveal>
      <div className={styles.editorial}>
      <section className={styles.hero} aria-labelledby="about-title">
        <div className={styles.heroFrame}>
          <Image className={styles.heroImage} src="/images/about-hero.webp" fill preload sizes="100vw" alt={about.heroAlt} />
          <div className={styles.heroContent}>
            <h1 id="about-title">{copy.nav.about}</h1>
            <p>{about.description}</p>
          </div>
          <div className={styles.heroBottom}>
            <nav className={styles.breadcrumb} aria-label={copy.nav.about}>
              <a href={sitePath(locale)}>{about.breadcrumbHome}</a><span aria-hidden="true">/</span><span aria-current="page">{copy.nav.about}</span>
            </nav>
            <a className={styles.scrollLink} href="#principles" aria-label={about.missionTitle}><ArrowDown aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className={styles.principles} id="principles" aria-labelledby="principles-title">
        <div className={styles.container}>
          <p className={styles.eyebrow}>{about.missionTitle}</p>
          <h2 className={styles.statement} id="principles-title" data-about-text>
            {about.missionText.split(' ').map((word, index) => <span key={index} data-about-word>{word}{' '}</span>)}
          </h2>
          <div className={styles.values}>
            {about.values.map((item, index) => {
              const Icon = valueIcons[index];
              return <article key={item.title}>
                <span className={styles.valueIcon}><Icon size={24} strokeWidth={1.4} aria-hidden="true" /></span>
                <div><h3>{item.title}</h3><p>{item.text}</p></div>
              </article>;
            })}
          </div>
        </div>
      </section>

      <div className={styles.storySection}>
        <AboutStory about={about} technologyHref={sitePath(locale, 'technology')} />
        <Steps label={about.processLabel} title={about.processTitle} titles={about.process} />
      </div>

      <section className={styles.surfaces} aria-labelledby="surfaces-title">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <h2 id="surfaces-title">{about.surfacesTitle}</h2>
            <p className={styles.body}>{about.surfacesIntro}</p>
          </div>
          <div className={styles.surfaceGrid}>
            {about.surfaces.map((item, index) => <a className={styles.surface} key={item.title} href={`${sitePath(locale)}#xidmetler`}>
              <Image src={`/images/${surfaceImages[index]}`} fill sizes="(max-width: 760px) 92vw, 45vw" alt="" />
              <div className={styles.surfaceCopy}><h3>{item.title}</h3><p>{item.text}</p></div>
              <span className={styles.surfaceArrow}><ArrowUpRight size={22} aria-hidden="true" /></span>
            </a>)}
          </div>
          <a className={styles.textLink} href={`${sitePath(locale)}#xidmetler`}>{about.servicesLink}<ArrowUpRight size={22} aria-hidden="true" /></a>
        </div>
      </section>

        <p className={styles.disclosure}>{about.disclosure}</p>
      </div>
      <ContactBanner copy={copy} />
    </AboutReveal>
    <SiteFooter locale={locale} copy={copy} />
  </div>;
}
