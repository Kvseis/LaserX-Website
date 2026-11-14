import Image from 'next/image';
import { sitePath, type Locale } from '@/lib/locales';
import type { SiteCopy } from '@/lib/messages/az';
import ServicesShowcase from './ServicesShowcase';
import SiteHeader, { PhoneIcon } from './SiteHeader';
import { phone, whatsapp } from '@/lib/contact';
import WhatsAppLogo from './WhatsAppLogo';
import BeforeAfterCard from './BeforeAfterCard';
import HeroVideo from './HeroVideo';
import ScrollCleaningFilm from './ScrollCleaningFilm';

const resultIds = ['rust', 'coating', 'mold', 'grease', 'graffiti', 'soot', 'biofilm', 'wood'];

export default function HomePage({ locale, copy }: { locale: Locale; copy: SiteCopy }) {
  const { home, methods, nav, results } = copy;
  const technologyPath = sitePath(locale, 'technology');

  return <div>
    <SiteHeader locale={locale} page="home" copy={nav} />

    <main id="top">
      <section className="hero">
        <HeroVideo />
        <div className="hero-shade" />
        <div className="hero-copy">
          <h1>{home.headline[0]}<br />{home.headline[1]}<br /><em>{home.headline[2]}</em></h1>
          <p>{home.description}</p>
          <div className="hero-proof"><span aria-hidden="true">✓</span><p>{home.proof}</p></div>
          <div className="hero-contacts">
            <a className="contact-rail call-rail" href={phone}>
              <span className="contact-rail-icon" aria-hidden="true"><PhoneIcon /></span>
              <span><strong>{nav.call}</strong></span>
            </a>
            <a className="contact-rail whatsapp-rail" href={whatsapp}>
              <span className="contact-rail-icon" aria-hidden="true"><WhatsAppLogo /></span>
              <span><strong>WhatsApp</strong></span>
            </a>
          </div>
        </div>
        <div className="hero-bottom"><span>{home.tagline}</span><a href="#proses">{home.seeResults} <span aria-hidden="true">↓</span></a></div>
      </section>

      <ScrollCleaningFilm copy={home} />

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
        <p className="disclosure">{results.disclosure}</p>
      </div></section>

      <ServicesShowcase copy={copy.services} technologyPath={technologyPath} />

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

      <section className="methods" id="ustunlukler"><span className="comparison-accent" aria-hidden="true" /><div className="wrap methods-layout">
        <div className="methods-copy">
          <h2><span>{methods.laser}</span><em>VS</em><span>{methods.traditional}</span></h2>
          <p className="methods-intro">{methods.intro}</p>
          <ul className="methods-steps">
            {methods.steps.map((step) => <li key={step}><span aria-hidden="true">✓</span>{step}</li>)}
          </ul>
        </div>
        <div className="comparison-matrix" role="table" aria-label={methods.label}>
          <div className="comparison-head" role="row"><b role="columnheader">{methods.laser}</b><b role="columnheader">{methods.traditional}<small>{methods.examples}</small></b></div>
          {methods.rows.map(([laser, traditional]) => <div className="comparison-row" role="row" key={laser}>
            <span className="comparison-value laser-value" role="cell"><i className="comparison-mark good" aria-hidden="true" />{laser}</span>
            <span className="comparison-value traditional-value" role="cell"><i className="comparison-mark bad" aria-hidden="true" />{traditional}</span>
          </div>)}
        </div>
      </div></section>

      <section className="contact">
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
