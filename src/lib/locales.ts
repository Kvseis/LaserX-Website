export const locales = ['az', 'ru', 'en', 'tr'] as const;
export type Locale = (typeof locales)[number];
export type SitePage = 'home' | 'technology' | 'about';

export const languageNames: Record<Locale, string> = {
  az: 'Azərbaycan dili',
  ru: 'Русский',
  en: 'English',
  tr: 'Türkçe',
};

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function sitePath(locale: Locale, page: SitePage = 'home') {
  const prefix = locale === 'az' ? '' : `/${locale}`;
  return page === 'home' ? prefix || '/' : `${prefix}/${page}`;
}
