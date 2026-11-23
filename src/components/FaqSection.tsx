import { Manrope } from 'next/font/google';
import Image from 'next/image';
import type { SiteCopy } from '@/lib/messages/az';
import { whatsapp } from '@/lib/contact';
import styles from './FaqSection.module.css';
import ButtonArrow from './ButtonArrow';

const manrope = Manrope({ subsets: ['latin', 'latin-ext', 'cyrillic'], display: 'swap' });

export default function FaqSection({ copy }: { copy: SiteCopy['faq'] }) {
  return <section id="suallar" className={`${styles.section} ${manrope.className}`} aria-labelledby="faq-title">
    <div className={styles.layout}>
      <header className={styles.intro}>
        <div className={styles.heading}>
          <h2 id="faq-title">{copy.title}</h2>
          <Image
            className={styles.visual}
            src="/images/faq-metal-question.webp"
            alt=""
            width={1000}
            height={667}
            sizes="(max-width: 760px) 96px, 160px"
            data-source="illustration"
            data-subject="metal question mark"
          />
        </div>
        <p>{copy.intro}</p>
      </header>
      <dl className={styles.questions}>
        {copy.items.map(([question, answer]) => <div className={styles.item} key={question}>
          <dt>{question}</dt>
          <dd>{answer}</dd>
        </div>)}
      </dl>
      <div className={styles.contact}>
        <a href={whatsapp}>{copy.contact}<ButtonArrow /></a>
      </div>
    </div>
  </section>;
}
