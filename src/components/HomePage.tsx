import SiteFooter from './SiteFooter';
import FaqSection from './FaqSection';
import ContactBanner from './ContactBanner';
import ButtonArrow from './ButtonArrow';
import Image from 'next/image';
import { Onest } from 'next/font/google';
import { sitePath, type Locale } from '@/lib/locales';
import type { SiteCopy } from '@/lib/messages/az';
import ServicesShowcase from './ServicesShowcase';
import SiteHeader from './SiteHeader';
import { siteOrigin } from '@/lib/site-urls';
import { phone, whatsapp } from '@/lib/contact';
import BeforeAfterCard from './BeforeAfterCard';
import ScrollCleaningFilm from './ScrollCleaningFilm';
import ComparisonIcon from './ComparisonIcon';
import HomeLoadingScreen from './HomeLoadingScreen';

const heroImageId = 'home-hero-image';
const resultIds = ['rust', 'coating', 'mold', 'grease', 'graffiti', 'soot', 'biofilm', 'wood'];
const onest = Onest({ subsets: ['latin'], display: 'swap' });

export default function HomePage({ locale, copy }: { locale: Locale; copy: SiteCopy }) {
  const { home, methods, nav, results } = copy;
  const technologyPath = sitePath(locale, 'technology');

  return <HomeLoadingScreen imageId={heroImageId} copy={home.loading}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': siteOrigin + '/#organization',
      name: 'LaserX',
      url: siteOrigin + '/',
      logo: siteOrigin + '/images/laserx-mark-128.webp',
      telephone: phone.slice(4),
      areaServed: { '@type': 'City', name: 'Baku' },
    }) }} />
    <SiteHeader locale={locale} page="home" copy={nav} />

    <main id="top" className="home-main">
      <div className="home-opening">
        <section className={`hero ${onest.className}`}>
          <picture>
            <source media="(max-width: 760px)" srcSet="/images/hero-sky-narrow.webp" />
            <Image id={heroImageId} className="hero-sky" src="/images/hero-sky.webp" alt="" fill unoptimized loading="eager" fetchPriority="high" />
          </picture>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-copy">
            <h1><span>{home.headline[0]}</span>{' '}<em>{home.headline[1]}</em></h1>
            <div className="hero-details">
              <p>{home.description}</p>
              <div className="hero-actions">
                <a className="hero-book" href="#sifaris">{copy.footer.booking}<ButtonArrow /></a>
                <a className="hero-equipment" href={`${whatsapp}?text=${encodeURIComponent(home.equipmentInquiry)}`}>
                  {home.equipmentCta}<ButtonArrow />
                </a>
              </div>
            </div>
          </div>
        </section>

        <ScrollCleaningFilm copy={home} />
      </div>

      <section className="results-section" id="neticeler"><div className="results wrap">
        <div className="results-intro">
          <h2>{results.title}</h2>
          <p>{results.instructions}</p>
        </div>
        <div className="result-grid">
          {resultIds.map((id, index) => {
            const [title, detail] = results.items[index];
            return <BeforeAfterCard id={id} title={title} detail={detail} copy={results} key={id} />;
          })}
        </div>
      </div></section>

      <ServicesShowcase copy={copy.services} technologyPath={technologyPath} />

      <section className="methods" id="ustunlukler"><div className="wrap methods-layout">
        <div className="methods-copy">
          <h2><span>{methods.laser}</span><em>VS</em><span>{methods.traditional}</span></h2>
        </div>
        <div className="comparison-matrix">
          <div role="table" aria-label={methods.label}>
            <div className="comparison-head" role="row">
              <span className="comparison-label-head" aria-hidden="true" />
              <div className="comparison-laser-head" role="columnheader">
                <span className="comparison-laser-brand"><Image unoptimized src="/images/laserx-mark-128.webp" width={28} height={28} alt="" />{methods.laser}</span>
              </div>
              <b role="columnheader">{methods.traditional}<small>{methods.examples}</small></b>
            </div>
            {methods.rows.map(([laser, traditional], index) => <div className="comparison-row" role="row" key={laser}>
              <strong className="comparison-criterion" role="rowheader"><ComparisonIcon index={index} />{methods.rowLabels[index]}</strong>
              <span className="comparison-value laser-value" role="cell"><i className="comparison-mark good" aria-hidden="true" /><span><small className="comparison-mobile-label" aria-hidden="true">{methods.laser}</small>{laser}</span></span>
              <span className="comparison-value traditional-value" role="cell"><i className="comparison-mark bad" aria-hidden="true" /><span><small className="comparison-mobile-label" aria-hidden="true">{methods.traditional}</small>{traditional}</span></span>
            </div>)}
          </div>
          <div className="comparison-laser-footer">
            <a className="comparison-contact" href={phone}>{methods.contact}<ButtonArrow /></a>
          </div>
        </div>
      </div></section>

      <section className="technology-preview" id="texnologiya">
        <div className="technology-preview-inner">
          <div className="technology-preview-media">
            <Image src="/images/technology-hero.webp" width={1920} height={1080} sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1565px) 92vw, 1440px" alt={home.technologyAlt} />
          </div>
          <div className="technology-preview-copy">
            <h2>{home.technologyTitle[0]} <em>{home.technologyTitle[1]}</em></h2>
            <p>{home.technologyDescription}</p>
            <ul>
              {home.technologyPoints.map((point) => <li key={point}><span aria-hidden="true">✓</span>{point}</li>)}
            </ul>
            <a className="technology-preview-cta" href={technologyPath}><span>{home.technologyLink}</span><ButtonArrow /></a>
          </div>
        </div>
      </section>

      <FaqSection copy={copy.faq} />
      <ContactBanner copy={copy} />
    </main>

    <SiteFooter locale={locale} copy={copy} />
  </HomeLoadingScreen>;
}
