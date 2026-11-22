const framesPerSheet = 20;
const columns = 5;
const frameCount = 40;

export function createDustFrames(canvas: HTMLCanvasElement, onReady: () => void) {
  const { width, height } = canvas;
  const sheets = new Map<number, { image: HTMLImageElement; ready: boolean }>();
  let context: CanvasRenderingContext2D | null = null;
  let painted = -1;

  const load = (index: number) => {
    if (index < 0 || index * framesPerSheet >= frameCount || sheets.has(index)) return;
    const image = new Image();
    const sheet = { image, ready: false };
    sheets.set(index, sheet);
    image.src = `/images/scroll-film/dust-${index}.webp`;
    void image.decode().then(() => {
      sheet.ready = true;
      onReady();
    }, () => {
      if (sheets.get(index) === sheet) sheets.delete(index);
    });
  };

  return {
    preload() {
      load(0);
    },
    paint(progress: number) {
      const frame = Math.round(progress * (frameCount - 1));
      if (frame === painted) return;

      const sheetIndex = Math.floor(frame / framesPerSheet);
      const tile = frame % framesPerSheet;
      load(sheetIndex);
      if (tile >= framesPerSheet / 2) load(sheetIndex + 1);
      else load(sheetIndex - 1);

      for (const index of sheets.keys()) {
        if (Math.abs(index - sheetIndex) > 1) sheets.delete(index);
      }

      const sheet = sheets.get(sheetIndex);
      if (!sheet?.ready) return;

      context ??= canvas.getContext('2d');
      if (!context) return;
      context.clearRect(0, 0, width, height);
      context.drawImage(sheet.image, (tile % columns) * width, Math.floor(tile / columns) * height, width, height, 0, 0, width, height);
      canvas.dataset.frame = String(frame);
      painted = frame;
    },
  };
}
