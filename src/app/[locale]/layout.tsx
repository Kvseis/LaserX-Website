import type { ReactNode } from 'react';
import SiteDocument from '@/components/SiteDocument';
import { locales } from '@/lib/locales';
import { readLocale } from '@/lib/site-copy';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.filter((locale) => locale !== 'az').map((locale) => ({ locale }));
}

export default async function LocalizedLayout({ children, params }: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return <SiteDocument locale={await readLocale(params)}>{children}</SiteDocument>;
}
