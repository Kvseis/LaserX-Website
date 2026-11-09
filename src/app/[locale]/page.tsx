import HomePage from '@/components/HomePage';
import { getSiteCopy, readLocale, siteMetadata } from '@/lib/site-copy';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return siteMetadata(await readLocale(params), 'home');
}

export default async function Page({ params }: Props) {
  const locale = await readLocale(params);
  return <HomePage locale={locale} copy={await getSiteCopy(locale)} />;
}
