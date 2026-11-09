import AboutPage from '@/components/AboutPage';
import { getSiteCopy, siteMetadata } from '@/lib/site-copy';

export function generateMetadata() {
  return siteMetadata('az', 'about');
}

export default async function Page() {
  return <AboutPage locale="az" copy={await getSiteCopy('az')} />;
}
