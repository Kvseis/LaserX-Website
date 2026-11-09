import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';

const ids = ['rust', 'coating', 'mold', 'grease', 'graffiti', 'soot', 'biofilm', 'wood'];
await mkdir('public/images/comparisons', { recursive: true });
let originals = 0;
let small = 0;
let large = 0;
for (const id of ids) {
  for (const state of ['before', 'after']) {
    const source = `public/images/${id}-${state}.webp`;
    originals += (await stat(source)).size;
    for (const width of [480, 960]) {
      const output = `public/images/comparisons/${id}-${state}-${width}.webp`;
      await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(output);
      const size = (await stat(output)).size;
      if (width === 480) small += size;
      else large += size;
    }
  }
}
console.log(JSON.stringify({ originals, small, large }));
