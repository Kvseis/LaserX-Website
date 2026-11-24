import { useSyncExternalStore } from 'react';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

export function useAboutReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(reducedMotionQuery).matches, () => false);
}

export const aboutViewport = { once: true, margin: '-80px' } as const;

export const aboutReveal = {
  hidden: { opacity: 0.5, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.68 } },
};
