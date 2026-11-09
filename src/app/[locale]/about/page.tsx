import AboutPage from '@/components/AboutPage';
import { getSiteCopy, readLocale, siteMetadata } from '@/lib/site-copy';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return siteMetadata(await readLocale(params), 'about');
}

export default async function Page({ params }: Props) {
  const locale = await readLocale(params);
  return <AboutPage locale={locale} copy={await getSiteCopy(locale)} />;
}
