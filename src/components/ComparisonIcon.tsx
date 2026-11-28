const icons = [
  <><path d="M12 3 4.5 6v5.5c0 4.4 2.7 7.5 7.5 9.5 4.8-2 7.5-5.1 7.5-9.5V6L12 3Z" /><path d="m9 12 2 2 4-4" /></>,
  <><path d="M9 3h6M10 3v6l-5.5 9.1A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.9L14 9V3" /><path d="M8 15h8" /></>,
  <><path d="m12 2 1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2ZM19 17l.7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7L19 17Z" /></>,
  <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  <><path d="M3 8h11a3 3 0 1 0-3-3M2 12h17a3 3 0 1 1-3 3M4 16h7a3 3 0 1 1-3 3" /></>,
  <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  <><circle cx="9" cy="9" r="5" /><path d="M6 9h6M9 6v6M14 13a5 5 0 1 0 5 5" /><path d="M16 18h6" /></>,
];

export default function ComparisonIcon({ index }: { index: number }) {
  return <svg className="comparison-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {icons[index]}
  </svg>;
}
