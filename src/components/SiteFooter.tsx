import Image from 'next/image';
import { Manrope } from 'next/font/google';
import { sitePath, type Locale } from '@/lib/locales';
import type { SiteCopy } from '@/lib/messages/az';
import { phone, whatsapp } from '@/lib/contact';
import { PhoneIcon } from './SiteHeader';
import WhatsAppLogo from './WhatsAppLogo';
import styles from './SiteFooter.module.css';
import ButtonArrow from './ButtonArrow';
import BrandWordmark from './BrandWordmark';

const manrope = Manrope({ preload: false, display: 'swap' });

export default function SiteFooter({ locale, copy }: { locale: Locale; copy: SiteCopy }) {
  const home = sitePath(locale);
  return <footer className={`${styles.footer} ${manrope.className}`}>
    <div className={styles.content}>
      <div className={styles.heading}>
        <h2 data-motion-reveal>{copy.footer.title}</h2>
        <a className={styles.action} href={`${home}#sifaris`}>{copy.footer.booking}<ButtonArrow /></a>
      </div>
      <div className={styles.columns}>
        <div className={styles.identity}>
          <a className={styles.brand} href={home} aria-label={copy.nav.home}>
            <BrandWordmark />
          </a>
          <p>{copy.footer.description}</p>
          <span className={styles.location}>{copy.location}</span>
        </div>
        <nav className={styles.links} aria-label={copy.nav.main}>
          <a href={sitePath(locale, 'about')}>{copy.nav.about}</a>
          <a href={`${home}#xidmetler`}>{copy.nav.services}</a>
          <a href={`${home}#neticeler`}>{copy.nav.results}</a>
          <a href={sitePath(locale, 'technology')}>{copy.nav.technology}</a>
          <a href={`${home}#ustunlukler`}>{copy.nav.benefits}</a>
          <a href={`${home}#suallar`}>{copy.faq.link}</a>
        </nav>
        <nav className={styles.links} aria-label={copy.nav.services}>
          {[0, 2, 5, 6, 3].map((index) => <a href={`${home}#xidmetler`} key={index}>{copy.services.items[index][0]}</a>)}
        </nav>
        <div className={styles.contacts}>
          <p>{copy.footer.contact}</p>
          <a href={phone}><PhoneIcon /><span>+994 55 390 00 28</span></a>
          <a href={whatsapp}><WhatsAppLogo /><span>{copy.nav.whatsapp}</span></a>
        </div>
      </div>
    </div>
    <div className={styles.scene} aria-hidden="true">
      <Image src="/images/footer-cleaning.webp" width={2400} height={770} sizes="100vw" alt="" />
    </div>
    <div className={styles.bottom}><span>© {new Date().getFullYear()} LaserX</span></div>
  </footer>;
}
