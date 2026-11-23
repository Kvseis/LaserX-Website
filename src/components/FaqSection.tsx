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
      <div className={styles.intro}>
        <h2 id="faq-title">{copy.title}</h2>
        <p>{copy.intro}</p>
        <div className={styles.visual} aria-hidden="true">
          <Image
            src="/images/faq-metal-question.webp"
            alt=""
            width={1000}
            height={667}
            sizes="(max-width: 760px) 92vw, 38vw"
            data-source="illustration"
            data-subject="metal question mark"
          />
        </div>
        <a href={whatsapp}>{copy.contact}<ButtonArrow /></a>
      </div>
      <div className={styles.questions}>
        {copy.items.map(([question, answer]) => <details className={styles.item} key={question}>
          <summary><span>{question}</span><i aria-hidden="true" /></summary>
          <p>{answer}</p>
        </details>)}
      </div>
    </div>
  </section>;
}
