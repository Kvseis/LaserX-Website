export const filmFrameRate = 24;
export const metalSource = '/videos/laserx-scroll-cleaning.mp4';
export const woodSource = '/videos/laserx-wood-cleaning.mp4';

export const filmSheets = {
  metal: { name: 'metal-hd-24', frames: 192, columns: 3, rows: 2, width: 960, height: 540, inset: 4, alpha: false },
  wood: { name: 'wood-24', frames: 117, columns: 4, rows: 3, width: 400, height: 600, inset: 2, alpha: false },
  dust: { name: 'dust', frames: 40, columns: 5, rows: 4, width: 384, height: 240, inset: 0, alpha: true },
} as const;

export type FilmScene = keyof typeof filmSheets;

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
