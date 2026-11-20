const framesPerSheet = 20;
const columns = 5;

export function createScrollFilmFrames(canvas: HTMLCanvasElement, scene: 'wood' | 'metal', frameCount: number, onReady: () => void) {
  const { width, height } = canvas;
  const sheets = new Map<number, HTMLImageElement>();
  let context: CanvasRenderingContext2D | null = null;
  let painted = -1;

  const load = (index: number) => {
    if (index < 0 || index * framesPerSheet >= frameCount || sheets.has(index)) return;
    const image = new Image();
    sheets.set(index, image);
    image.onload = onReady;
    image.src = `/images/scroll-film/${scene}-${index}.webp`;
  };

  return {
    preload() {
      load(0);
      if (scene === 'wood') load(1);
    },
    paint(progress: number) {
      const frame = Math.round(progress * (frameCount - 1));
      if (frame === painted) return;

      const sheetIndex = Math.floor(frame / framesPerSheet);
      const tile = frame % framesPerSheet;
      load(sheetIndex);
      if (tile >= framesPerSheet - 6) load(sheetIndex + 1);
      if (tile <= 5) load(sheetIndex - 1);

      const sheet = sheets.get(sheetIndex);
      if (!sheet?.complete || !sheet.naturalWidth) return;

      context ??= canvas.getContext('2d', { alpha: false });
      if (!context) return;
      context.drawImage(sheet, (tile % columns) * width, Math.floor(tile / columns) * height, width, height, 0, 0, width, height);
      canvas.dataset.frame = String(frame);
      painted = frame;

      for (const index of sheets.keys()) {
        if (Math.abs(index - sheetIndex) > 1) sheets.delete(index);
      }
    },
  };
}
