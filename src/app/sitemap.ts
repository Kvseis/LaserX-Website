import type { MetadataRoute } from 'next';
import { locales, type SitePage } from '@/lib/locales';
import { absolutePageUrl, alternatePageUrls } from '@/lib/site-urls';

const pages: SitePage[] = ['home', 'about', 'technology'];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) => locales.map((locale) => ({
    url: absolutePageUrl(locale, page),
    alternates: { languages: alternatePageUrls(page) },
  })));
}
