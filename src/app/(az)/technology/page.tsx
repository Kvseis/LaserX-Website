import TechnologyPage from '@/components/TechnologyPage';
import { getSiteCopy, siteMetadata } from '@/lib/site-copy';

export function generateMetadata() {
  return siteMetadata('az', 'technology');
}

export default async function Page() {
  return <TechnologyPage locale="az" copy={await getSiteCopy('az')} />;
}
