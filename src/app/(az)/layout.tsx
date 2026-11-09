import type { ReactNode } from 'react';
import SiteDocument from '@/components/SiteDocument';

export default function AzerbaijaniLayout({ children }: { children: ReactNode }) {
  return <SiteDocument locale="az">{children}</SiteDocument>;
}
