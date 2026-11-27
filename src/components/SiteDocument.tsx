import { Geist } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Locale } from '@/lib/locales';
import SiteMotion from './SiteMotion';
import '@/app/globals.css';
import '@/app/motion.css';

const geist = Geist({ subsets: ['latin'] });

export default function SiteDocument({ children, locale }: { children: ReactNode; locale: Locale }) {
  return <html lang={locale} data-scroll-behavior="smooth"><body className={geist.className}>
    <SiteMotion />
    {children}
  </body></html>;
}
