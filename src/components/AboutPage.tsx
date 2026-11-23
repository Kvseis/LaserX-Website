import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Crosshair, MessagesSquare, ShieldCheck, Camera, ScanLine, Zap, ClipboardCheck } from 'lucide-react';
import type { SiteCopy } from '@/lib/messages/az';
import { sitePath, type Locale } from '@/lib/locales';
import { getAboutCopy } from '@/lib/about-copy';
import { phone, whatsapp } from '@/lib/contact';
import SiteHeader, { PhoneIcon } from './SiteHeader';
import SiteFooter from './SiteFooter';
import WhatsAppLogo from './WhatsAppLogo';
import AboutReveal from './AboutReveal';
import styles from './AboutPage.module.css';

export default function AboutPage({ locale, copy }: { locale: Locale; copy: SiteCopy }) {
  const about = getAboutCopy(locale);
  const valueIcons = [Crosshair, ShieldCheck, MessagesSquare];
  const processIcons = [Camera, ScanLine, Zap, ClipboardCheck];
  const surfaceImages = ['rust-after.webp', 'graffiti-after.webp', 'wood-after.webp'];

  return <div className={styles.page} id="top">
    <SiteHeader locale={locale} page="about" copy={copy.nav} />
    <AboutReveal>
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

      <section className={styles.storySection} aria-labelledby="story-title">
        <div className={styles.container}>
          <div className={styles.story}>
            <div className={styles.storyImage} data-about-media>
              <Image src="/images/about-restoration.webp" fill sizes="(max-width: 760px) 92vw, 46vw" alt={about.storyAlt} />
            </div>
            <div className={styles.storyCopy}>
              <p className={styles.eyebrow}>{about.storyLabel}</p>
              <h2 id="story-title"><span>{about.storyMuted}</span>{about.storyTitle.slice(about.storyMuted.length)}</h2>
              {about.story.map((paragraph) => <p className={styles.body} key={paragraph}>{paragraph}</p>)}
              <a className={styles.textLink} href={sitePath(locale, 'technology')}>{about.technologyLink}<ArrowUpRight size={22} aria-hidden="true" /></a>
              <div className={styles.reasons}>
                <h3>{about.reasonsTitle}</h3>
                {about.reasons.filter((_, index) => [0, 1, 3].includes(index)).map((item) => <div className={styles.reason} key={item.title}>
                  <ShieldCheck size={20} strokeWidth={1.4} aria-hidden="true" />
                  <div><h4>{item.title}</h4><p>{item.text}</p></div>
                </div>)}
              </div>
            </div>
          </div>
          <div className={styles.process}>
            <div className={styles.sectionHeading}>
              <div><p className={styles.eyebrow}>{about.processLabel}</p><h2>{about.processTitle}</h2></div>
              <p className={styles.body}>{about.processText}</p>
            </div>
            <div className={styles.processGrid}>
              {about.process.map((item, index) => {
                const Icon = processIcons[index];
                return <article key={item.title}>
                  <div className={styles.processTop}><span>{String(index + 1).padStart(2, '0')}</span><Icon size={24} strokeWidth={1.4} aria-hidden="true" /></div>
                  <h3>{item.title}</h3><p>{item.text}</p>
                </article>;
              })}
            </div>
          </div>
        </div>
      </section>

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

      <section className={styles.contactBanner} aria-labelledby="contact-title">
        <Image src="/images/technology-cta.webp" fill sizes="100vw" alt="" />
        <div className={styles.contactContent}>
          <h2 id="contact-title">{about.contactTitle[0]}<br /><span>{about.contactTitle[1]}</span></h2>
          <p>{copy.home.contactDescription}</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={whatsapp}><WhatsAppLogo />{copy.nav.whatsapp}<ArrowUpRight aria-hidden="true" /></a>
            <a className={styles.secondary} href={phone} aria-label={copy.nav.callNumber}><PhoneIcon />055 390 00 28</a>
          </div>
        </div>
      </section>
    </AboutReveal>
    <p className={styles.disclosure}>{about.disclosure}</p>
    <SiteFooter locale={locale} copy={copy} />
  </div>;
}
