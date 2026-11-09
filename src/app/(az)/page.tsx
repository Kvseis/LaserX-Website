import HomePage from '@/components/HomePage';
import { getSiteCopy, siteMetadata } from '@/lib/site-copy';

export function generateMetadata() {
  return siteMetadata('az', 'home');
}

export default async function Page() {
  return <HomePage locale="az" copy={await getSiteCopy('az')} />;
}
