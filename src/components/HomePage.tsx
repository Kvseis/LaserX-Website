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
import HomeLoadingScreen from './HomeLoadingScreen';
import HomeOpening from './HomeOpening';
import openingStyles from './HomeOpening.module.css';

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
      <HomeOpening hero={
        <section className={`hero ${onest.className}`}>
          <div className={openingStyles.backdrop} aria-hidden="true">
            <picture>
              <source media="(max-width: 760px)" srcSet="/images/hero-sky-narrow.webp" />
              <Image id={heroImageId} className="hero-sky" src="/images/hero-sky.webp" alt="" fill unoptimized loading="eager" fetchPriority="high" />
            </picture>
            <div className="hero-shade" />
          </div>
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
      }>
        <ScrollCleaningFilm copy={home} />
      </HomeOpening>

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

      <section className="methods" id="ustunlukler" aria-labelledby="methods-title"><div className="wrap methods-layout">
        <div className="methods-copy">
          <h2 id="methods-title">{methods.title}</h2>
          <p>{methods.intro}</p>
        </div>
        <table className="comparison-matrix" role="table" aria-labelledby="methods-title">
          <thead role="rowgroup">
            <tr className="comparison-head" role="row">
              <th className="comparison-label-head" scope="col" role="columnheader">{methods.criterion}</th>
              <th className="comparison-laser-head" scope="col" role="columnheader">{methods.laser}</th>
              <th className="comparison-traditional-head" scope="col" role="columnheader">
                {methods.traditional}
                <small>{methods.examples}</small>
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {methods.rows.map(([criterion, laser, traditional]) => <tr className="comparison-row" role="row" key={criterion}>
              <th className="comparison-criterion" scope="row" role="rowheader">{criterion}</th>
              <td className="laser-value" role="cell">{laser}</td>
              <td className="traditional-value" role="cell">{traditional}</td>
            </tr>)}
          </tbody>
        </table>
        <a className="comparison-contact" href={phone}>{methods.contact}<ButtonArrow /></a>
      </div></section>

      <FaqSection copy={copy.faq} />
      <ContactBanner copy={copy} />

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
    </main>

    <SiteFooter locale={locale} copy={copy} />
  </HomeLoadingScreen>;
}
