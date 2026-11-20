'use client';

import type { FormEvent } from 'react';
import { Onest } from 'next/font/google';
import type { SiteCopy } from '@/lib/messages/az';
import { whatsapp } from '@/lib/contact';
import styles from './ContactBanner.module.css';

const onest = Onest({ subsets: ['latin', 'latin-ext', 'cyrillic'], display: 'swap' });

export default function BookingForm({ copy }: { copy: SiteCopy['booking'] }) {
  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fields = [[copy.name, data.get('name')], [copy.surface, data.get('surface')], [copy.area, data.get('area')], [copy.date, data.get('date')], [copy.notes, data.get('notes')]];
    const message = [copy.messageTitle, ...fields.filter(([, value]) => String(value ?? '').trim()).map(([label, value]) => `${label}: ${String(value).trim()}`)].join('\n');
    window.location.assign(`${whatsapp}?text=${encodeURIComponent(message)}`);
  }

  return <form className={`${styles.form} ${onest.className}`} onSubmit={submitRequest} aria-label={copy.title}>
    <div className={styles.fields}>
      <label><span className={styles.label}>{copy.name}</span><input name="name" autoComplete="name" required maxLength={100} placeholder={copy.namePlaceholder} /></label>
      <label><span className={styles.label}>{copy.surface}</span><select name="surface" required defaultValue=""><option value="" disabled>{copy.chooseSurface}</option>{copy.surfaces.map((surface) => <option key={surface}>{surface}</option>)}</select></label>
      <label><span className={styles.label}>{copy.area}<span className={styles.optional}>{copy.optional}</span></span><input name="area" maxLength={80} placeholder={copy.areaPlaceholder} /></label>
      <label><span className={styles.label}>{copy.date}<span className={styles.optional}>{copy.optional}</span></span><input name="date" type="date" /></label>
      <label className={styles.full}><span className={styles.label}>{copy.notes}<span className={styles.optional}>{copy.optional}</span></span><textarea name="notes" rows={3} maxLength={1500} placeholder={copy.notesPlaceholder} /></label>
    </div>
    <button className={styles.submit} type="submit"><span>{copy.submit}</span><span aria-hidden="true">↗</span></button>
    <p className={styles.notice}>{copy.notice}</p>
  </form>;
}
