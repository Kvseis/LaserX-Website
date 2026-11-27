import { locales, sitePath, type Locale, type SitePage } from './locales';

export const siteOrigin = 'https://laserx-az.vercel.app';

export function absolutePageUrl(locale: Locale, page: SitePage) {
  return new URL(sitePath(locale, page), siteOrigin).href;
}

export function alternatePageUrls(page: SitePage) {
  return {
    ...Object.fromEntries(locales.map((locale) => [locale, absolutePageUrl(locale, page)])),
    'x-default': absolutePageUrl('az', page),
  };
}
