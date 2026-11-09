import { Geist } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Locale } from '@/lib/locales';
import '@/app/globals.css';

const geist = Geist({ subsets: ['latin', 'latin-ext'] });

export default function SiteDocument({ children, locale }: { children: ReactNode; locale: Locale }) {
  return <html lang={locale}><body className={geist.className}>{children}</body></html>;
}
