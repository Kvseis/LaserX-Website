import type { Locale } from '@/lib/locales';

export default function LanguageFlag({ locale }: { locale: Locale }) {
  return (
    <svg className="language-flag" viewBox="0 0 30 20" aria-hidden="true" focusable="false">
      {locale === 'az' && <>
        <path fill="#00b5e2" d="M0 0h30v7H0z" />
        <path fill="#ef3340" d="M0 7h30v6H0z" />
        <path fill="#509e2f" d="M0 13h30v7H0z" />
        <path fill="#fff" d="M16.4 7a3.3 3.3 0 1 0 0 6 2.8 2.8 0 1 1 0-6Z" />
        <path fill="#fff" d="m18 7.5.5 1.3 1.3-.6-.6 1.3 1.3.5-1.3.5.6 1.3-1.3-.6-.5 1.3-.5-1.3-1.3.6.6-1.3-1.3-.5 1.3-.5-.6-1.3 1.3.6Z" />
      </>}
      {locale === 'ru' && <>
        <path fill="#fff" d="M0 0h30v7H0z" />
        <path fill="#0039a6" d="M0 7h30v6H0z" />
        <path fill="#d52b1e" d="M0 13h30v7H0z" />
      </>}
      {locale === 'en' && <>
        <path fill="#012169" d="M0 0h30v20H0z" />
        <path stroke="#fff" strokeWidth="4" d="m0 0 30 20M30 0 0 20" />
        <path stroke="#c8102e" strokeWidth="1.5" d="m0 0 30 20M30 0 0 20" />
        <path stroke="#fff" strokeWidth="7" d="M15 0v20M0 10h30" />
        <path stroke="#c8102e" strokeWidth="4" d="M15 0v20M0 10h30" />
      </>}
      {locale === 'tr' && <>
        <path fill="#e30a17" d="M0 0h30v20H0z" />
        <circle cx="12" cy="10" r="5" fill="#fff" />
        <circle cx="13.3" cy="10" r="4" fill="#e30a17" />
        <path fill="#fff" d="m19 7 .7 2.2H22l-1.9 1.4.7 2.2-1.8-1.4-1.9 1.4.7-2.2L16 9.2h2.3Z" />
      </>}
    </svg>
  );
}
