import { filmSheetPath, filmSheets, type FilmScene } from './ScrollFilmAssets';

type Sheet = { image: HTMLImageElement; drawable?: HTMLImageElement | ImageBitmap };

function release(sheet: Sheet) {
  sheet.image.onload = null;
  sheet.image.onerror = null;
  if (!sheet.image.complete) sheet.image.removeAttribute('src');
  if (sheet.drawable && 'close' in sheet.drawable) sheet.drawable.close();
}

export function createScrollFilmFrames(
  canvas: HTMLCanvasElement,
  scene: FilmScene,
  onReady: () => void,
) {
  const { width, height } = canvas;
  const { frames, rows, columns, alpha, inset } = filmSheets[scene];
  const framesPerSheet = rows * columns;
  const sheets = new Map<number, Sheet>();
  let context: CanvasRenderingContext2D | null = null;
  let painted = -1;
  let requested = -1;
  let direction = 1;

  canvas.dataset.frameCount = String(frames);

  const load = (index: number, priority: 'high' | 'low') => {
    if (index < 0 || index * framesPerSheet >= frames) return;
    const existing = sheets.get(index);
    if (existing) {
      if (priority === 'high') existing.image.fetchPriority = priority;
      return existing;
    }

    const image = new Image();
    const sheet: Sheet = { image };
    sheets.set(index, sheet);
    image.onload = async () => {
      sheet.drawable = typeof createImageBitmap === 'function'
        ? await createImageBitmap(image).catch(() => image)
        : image;
      if (sheets.get(index) === sheet) onReady();
      else release(sheet);
    };
    image.onerror = () => sheets.delete(index);
    image.fetchPriority = priority;
    image.src = filmSheetPath(scene, index);
    return sheet;
  };

  return {
    preload() {
      load(0, 'low');
      load(1, 'low');
    },
    dispose() {
      for (const sheet of sheets.values()) release(sheet);
      sheets.clear();
    },
    paint(progress: number) {
      const frame = Math.round(progress * (frames - 1));
      if (frame === painted) return;

      const sheetIndex = Math.floor(frame / framesPerSheet);
      const tile = frame % framesPerSheet;
      if (frame !== requested) {
        direction = frame > requested ? 1 : -1;
        requested = frame;
        for (const [index, cached] of sheets) {
          if (Math.abs(index - sheetIndex) <= 2) continue;
          release(cached);
          sheets.delete(index);
        }
      }
      const sheet = load(sheetIndex, 'high');
      load(sheetIndex + direction, 'low');
      const remaining = direction === 1 ? framesPerSheet - tile - 1 : tile;
      if (remaining < framesPerSheet / 2) load(sheetIndex + direction * 2, 'low');
      if (!sheet?.drawable) return;

      context ??= canvas.getContext('2d', { alpha });
      if (!context) return;
      if (alpha) context.clearRect(0, 0, width, height);
      // Crop compressed edges where a neighboring tile could bleed into the frame.
      context.drawImage(sheet.drawable, (tile % columns) * width + inset, Math.floor(tile / columns) * height + inset,
        width - inset * 2, height - inset * 2, 0, 0, width, height);
      canvas.dataset.frame = String(frame);
      painted = frame;
      return frame;
    },
  };
}
