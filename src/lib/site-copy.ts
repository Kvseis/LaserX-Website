import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, type Locale, type SitePage } from './locales';
import type { SiteCopy } from './messages/az';

const dictionaries = {
  az: () => import('./messages/az'),
  ru: () => import('./messages/ru'),
  en: () => import('./messages/en'),
  tr: () => import('./messages/tr'),
};

export async function getSiteCopy(locale: Locale): Promise<SiteCopy> {
  return (await dictionaries[locale]()).default;
}

export async function readLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'az') notFound();
  return locale;
}

const openGraphLocales = { az: 'az_AZ', ru: 'ru_RU', en: 'en_GB', tr: 'tr_TR' };

export async function siteMetadata(locale: Locale, page: SitePage): Promise<Metadata> {
  const copy = await getSiteCopy(locale);
  const { title, description } = copy.meta[page];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: openGraphLocales[locale],
      type: 'website',
      siteName: 'LaserX',
    },
    robots: { index: true, follow: true },
  };
}
