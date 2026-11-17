'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { languageNames, locales, sitePath, type Locale, type SitePage } from '@/lib/locales';
import type { SiteCopy } from '@/lib/messages/az';
import WhatsAppLogo from './WhatsAppLogo';
import LanguageFlag from './LanguageFlag';
import { phone, whatsapp } from '@/lib/contact';

export function PhoneIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7.4 3.5 2.6 4.4-1.8 1.8c1.3 2.5 3.5 4.7 6 6l1.9-1.8 4.4 2.6-.5 3c-.2 1-1 1.7-2 1.7C9.6 20.7 3.3 14.4 2.8 6c-.1-1 .6-1.8 1.6-2l3-.5Z" /></svg>;
}

export default function SiteHeader({ locale, page, copy }: {
  locale: Locale;
  page: SitePage;
  copy: SiteCopy['nav'];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const home = sitePath(locale);
  const sectionPrefix = page === 'home' ? '' : home;
  const links = [
    [copy.about, sitePath(locale, 'about')],
    [copy.services, `${sectionPrefix}#xidmetler`],
    [copy.results, `${sectionPrefix}#neticeler`],
    [copy.technology, sitePath(locale, 'technology')],
    [copy.benefits, `${sectionPrefix}#ustunlukler`],
  ];

  return (
    <header className="site-header">
      <Link prefetch={false} className="wordmark nav-brand" href={page === 'home' ? '#top' : home} aria-label={copy.home}>
        <Image src="/images/logo-mark-transparent.png" width={42} height={42} alt="" priority />
        <span>LaserX</span>
      </Link>
      <nav id="main-navigation" className={menuOpen ? 'open' : ''} aria-label={copy.main}>
        {links.map(([label, href]) => (
          <Link prefetch={false} key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>
        ))}
      </nav>
      <div className="nav-actions">
        <div className="nav-contact" role="group" aria-label={copy.contact}>
          <a className="nav-call" href={phone} aria-label={copy.callNumber}>
            <PhoneIcon /><span className="nav-action-label">{copy.call}</span>
          </a>
          <a className="nav-whatsapp" href={whatsapp} aria-label={copy.whatsapp}>
            <WhatsAppLogo /><span className="nav-action-label">WhatsApp</span>
          </a>
        </div>
        <details
          className="language-switch"
          onBlur={(event) => {
            if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && event.currentTarget.open) {
              event.currentTarget.open = false;
              event.currentTarget.querySelector('summary')?.focus();
            }
          }}
        >
          <summary aria-label={`${copy.language}: ${languageNames[locale]}`}>
            <LanguageFlag locale={locale} />
            {locale.toUpperCase()}
            <svg className="language-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
          </summary>
          <ul>
            {locales.map((language) => (
              <li key={language}>
                <a
                  href={sitePath(language, page)}
                  hrefLang={language}
                  lang={language}
                  aria-current={language === locale ? 'page' : undefined}
                ><LanguageFlag locale={language} />{languageNames[language]}</a>
              </li>
            ))}
          </ul>
        </details>
      </div>
      <button
        type="button"
        className="menu-button"
        aria-label={menuOpen ? copy.close : copy.open}
        aria-controls="main-navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      ><span /><span /></button>
    </header>
  );
}
