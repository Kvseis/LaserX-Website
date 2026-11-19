import Image from 'next/image';
import { Manrope } from 'next/font/google';
import type { SiteCopy } from '@/lib/messages/az';
import { phone, whatsapp } from '@/lib/contact';
import { PhoneIcon } from './SiteHeader';
import WhatsAppLogo from './WhatsAppLogo';
import styles from './ContactBanner.module.css';

const manrope = Manrope({ subsets: ['latin', 'latin-ext', 'cyrillic'], display: 'swap' });

export default function ContactBanner({ copy }: { copy: SiteCopy }) {
  return <section className={`${styles.banner} ${manrope.className}`} aria-label={copy.nav.contact}>
    <Image className={styles.image} src="/images/technology-cta.webp" fill sizes="100vw" alt={copy.technology.contactAlt} />
    <div className={styles.shade} />
    <div className={styles.content}>
      <h2>{copy.technology.contactTitle}</h2>
      <p>{copy.home.contactDescription}</p>
      <div className={styles.actions}>
        <a className={styles.call} href={phone}><PhoneIcon /><span>{copy.nav.call}</span></a>
        <a className={styles.whatsapp} href={whatsapp}><WhatsAppLogo /><span>{copy.technology.whatsapp}</span></a>
      </div>
    </div>
  </section>;
}
