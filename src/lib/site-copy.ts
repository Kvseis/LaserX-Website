import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, type Locale, type SitePage } from './locales';
import { absolutePageUrl, alternatePageUrls, siteOrigin } from './site-urls';
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

  const url = absolutePageUrl(locale, page);
  const image = {
    url: new URL('/images/laserx-wordmark-share.jpg', siteOrigin).href,
    width: 1200,
    height: 630,
    type: 'image/jpeg',
    alt: copy.home.technologyAlt,
  };

  return {
    metadataBase: new URL(siteOrigin),
    alternates: { canonical: url, languages: alternatePageUrls(page) },
    icons: { icon: '/favicon.ico?v=2' },
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [image],
      locale: openGraphLocales[locale],
      alternateLocale: Object.values(openGraphLocales).filter((value) => value !== openGraphLocales[locale]),
      type: 'website',
      siteName: 'LaserX',
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
    robots: { index: true, follow: true },
  };
}
