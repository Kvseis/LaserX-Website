import Image from 'next/image';
import { Manrope } from 'next/font/google';
import type { SiteCopy } from '@/lib/messages/az';
import { phone } from '@/lib/contact';
import { PhoneIcon } from './SiteHeader';
import BookingForm from './BookingForm';
import styles from './ContactBanner.module.css';

const manrope = Manrope({ subsets: ['latin', 'latin-ext', 'cyrillic'], display: 'swap' });

export default function ContactBanner({ copy }: { copy: SiteCopy }) {
  return <section id="sifaris" className={`${styles.banner} ${manrope.className}`} aria-labelledby="booking-title">
    <Image className={styles.image} src="/images/technology-cta.webp" fill sizes="100vw" alt={copy.technology.contactAlt} />
    <div className={styles.shade} />
    <div className={styles.layout}>
      <div className={styles.content}>
        <h2 id="booking-title">{copy.booking.title}</h2>
        <p>{copy.booking.intro}</p>
        <a className={styles.call} href={phone}><PhoneIcon /><span>+994 55 390 00 28</span></a>
      </div>
      <BookingForm copy={copy.booking} />
    </div>
  </section>;
}
