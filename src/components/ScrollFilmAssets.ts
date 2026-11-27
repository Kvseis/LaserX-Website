import { createContext } from 'react';

export const filmFrameRate = 24;
export const metalSource = '/videos/laserx-scroll-cleaning.mp4';
export const woodSource = '/videos/laserx-wood-cleaning.mp4';

export const filmSheets = {
  metal: { name: 'metal-24', frames: 192, columns: 4, rows: 3, inset: 4, alpha: false },
  wood: { name: 'wood-24', frames: 117, columns: 4, rows: 3, inset: 2, alpha: false },
  dust: { name: 'dust', frames: 40, columns: 5, rows: 4, inset: 0, alpha: true },
} as const;

export type FilmScene = keyof typeof filmSheets;
export const FilmAssetContext = createContext((path: string) => path);

type FilmConnection = EventTarget & { saveData?: boolean; effectiveType?: string };

export function getFilmConnection() {
  return (navigator as Navigator & { connection?: FilmConnection }).connection;
}

export function usesStaticFilm(reducedMotion: boolean, connection?: FilmConnection) {
  return reducedMotion || Boolean(connection?.saveData) ||
    ['slow-2g', '2g'].includes(connection?.effectiveType ?? '');
}

export function filmSheetPath(scene: FilmScene, index: number) {
  return '/images/scroll-film/' + filmSheets[scene].name + '-' + index + '.webp';
}

function sceneSheetPaths(scene: FilmScene) {
  const { frames, columns, rows } = filmSheets[scene];
  return Array.from({ length: Math.ceil(frames / (columns * rows)) }, (_, index) => filmSheetPath(scene, index));
}

export async function warmFilmAssets(
  narrowViewport: boolean,
  signal: AbortSignal,
  remember: (path: string, asset: Blob) => void,
) {
  const metalSheets = narrowViewport ? sceneSheetPaths('metal') : [];
  const woodSheets = narrowViewport ? sceneSheetPaths('wood') : [];
  const paths = narrowViewport
    ? [metalSheets[0], woodSheets[0], metalSheets[1], woodSheets[1], ...metalSheets.slice(2), ...woodSheets.slice(2)]
    : [metalSource, woodSource];
  const queue = paths.values();

  await Promise.all(Array.from({ length: Math.min(4, paths.length) }, async () => {
    for (const path of queue) {
      if (signal.aborted) return;
      try {
        const response = await fetch(path, { signal, priority: 'low' });
        if (!response.ok) continue;
        const asset = await response.blob();
        if (!signal.aborted) remember(path, asset);
      } catch {
        // Leave a failed or cancelled request to the film's regular loading path.
      }
    }
  }));
}
