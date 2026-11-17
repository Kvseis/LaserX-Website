import Image from 'next/image';
import { sitePath, type Locale } from '@/lib/locales';
import type { SiteCopy } from '@/lib/messages/az';
import ServicesShowcase from './ServicesShowcase';
import SiteHeader, { PhoneIcon } from './SiteHeader';
import { phone, whatsapp } from '@/lib/contact';
import WhatsAppLogo from './WhatsAppLogo';
import BeforeAfterCard from './BeforeAfterCard';
import HeroSequence from './HeroSequence';
import ComparisonIcon from './ComparisonIcon';

const resultIds = ['rust', 'coating', 'mold', 'grease', 'graffiti', 'soot', 'biofilm', 'wood'];

export default function HomePage({ locale, copy }: { locale: Locale; copy: SiteCopy }) {
  const { home, methods, nav, results } = copy;
  const technologyPath = sitePath(locale, 'technology');

  return <div>
    <SiteHeader locale={locale} page="home" copy={nav} />

    <main id="top">
      <HeroSequence copy={home} />

      <ServicesShowcase copy={copy.services} technologyPath={technologyPath} />

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


      <section className="methods" id="ustunlukler"><div className="wrap methods-layout">
        <div className="methods-copy">
          <h2><span>{methods.laser}</span><em>VS</em><span>{methods.traditional}</span></h2>
        </div>
        <div className="comparison-matrix" role="table" aria-label={methods.label}>
          <div className="comparison-head" role="row">
            <span className="comparison-label-head" aria-hidden="true" />
            <div className="comparison-laser-head" role="columnheader">
              <span className="comparison-laser-brand"><Image src="/images/logo-mark-transparent.png" width={28} height={28} alt="" loading="eager" />{methods.laser}</span>
            </div>
            <b role="columnheader">{methods.traditional}<small>{methods.examples}</small></b>
          </div>
          {methods.rows.map(([laser, traditional], index) => <div className="comparison-row" role="row" key={laser}>
            <strong className="comparison-criterion" role="rowheader"><ComparisonIcon index={index} />{methods.rowLabels[index]}</strong>
            <span className="comparison-value laser-value" role="cell"><i className="comparison-mark good" aria-hidden="true" /><span><small className="comparison-mobile-label" aria-hidden="true">{methods.laser}</small>{laser}</span></span>
            <span className="comparison-value traditional-value" role="cell"><i className="comparison-mark bad" aria-hidden="true" /><span><small className="comparison-mobile-label" aria-hidden="true">{methods.traditional}</small>{traditional}</span></span>
          </div>)}
          <div className="comparison-laser-footer" role="presentation">
            <div className="comparison-laser-action">
              <a className="comparison-contact" href={phone}>{methods.contact} <span aria-hidden="true">↗</span></a>
            </div>
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
            <a className="technology-preview-cta" href={technologyPath}><span>{home.technologyLink}</span><i aria-hidden="true">↗</i></a>
          </div>
        </div>
      </section>

      <section className="contact" id="elaqe">
        <h2>{home.contactTitle[0]}<br />{home.contactTitle[1]}</h2>
        <p>{home.contactDescription}</p>
        <a className="big-phone" href={phone} aria-label={nav.callNumber}>
          055 390 00 28
          <PhoneIcon />
        </a>
        <a className="button contact-whatsapp" href={whatsapp}>
          <WhatsAppLogo />
          {nav.whatsapp}
        </a>
      </section>
    </main>

    <footer><a className="footer-brand brand-logo" href="#top"><Image src="/images/logo.png" width={500} height={500} sizes="170px" alt="LaserX" /></a><p>© {new Date().getFullYear()} LaserX · {copy.city}</p><a href={whatsapp}>WhatsApp <span aria-hidden="true">↗</span></a></footer>
  </div>;
}
