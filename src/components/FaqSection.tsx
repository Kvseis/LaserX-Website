import { Manrope } from 'next/font/google';
import type { SiteCopy } from '@/lib/messages/az';
import { whatsapp } from '@/lib/contact';
import styles from './FaqSection.module.css';
import ButtonArrow from './ButtonArrow';

const manrope = Manrope({ preload: false, display: 'swap' });

export default function FaqSection({ copy }: { copy: SiteCopy['faq'] }) {
  return <section id="suallar" className={`${styles.section} ${manrope.className}`} aria-labelledby="faq-title">
    <div className={styles.layout}>
      <header className={styles.intro} data-motion-reveal>
        <h2 id="faq-title">{copy.title}</h2>
        <p>{copy.intro}</p>
      </header>
      <div className={styles.questions}>
        {copy.items.map(([question, answer]) => <details className={styles.item} key={question}>
          <summary>
            <span className={styles.chevron} aria-hidden="true" />
            {question}
          </summary>
          <p>{answer}</p>
        </details>)}
      </div>
      <div className={styles.contact}>
        <a href={whatsapp}>{copy.contact}<ButtonArrow /></a>
      </div>
    </div>
  </section>;
}
