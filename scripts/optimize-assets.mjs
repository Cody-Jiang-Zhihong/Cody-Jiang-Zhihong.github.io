import sharp from 'sharp';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const source = new URL('../design-reference/cody-castle-prototype/dist/assets/', import.meta.url);
const dest = new URL('../castle/assets/', import.meta.url);
await mkdir(dest, { recursive:true });
const report = [];
for (const name of ['gate-v2','hall-map-v2','great-hall','observatory','study','workshop']) {
  const input = new URL(name + '.png', source);
  const original = (await stat(input)).size;
  for (const width of [768,1536]) {
    const output = new URL(`${name}-${width}.webp`, dest);
    await sharp(fileURLToPath(input)).resize(width).webp({quality:82, effort:6}).toFile(fileURLToPath(output));
    report.push({file:`castle/assets/${name}-${width}.webp`, bytes:(await stat(output)).size, originalBytes:original});
  }
}
// A real scene illustration, explicitly identified as illustration in social metadata.
await sharp(fileURLToPath(new URL('hall-map-v2.png',source)))
  .resize(1200,630,{fit:'cover',position:'centre'}).jpeg({quality:83})
  .toFile(fileURLToPath(new URL('social-castle.jpg',dest)));
const photos = new URL('../castle/media/',import.meta.url);
await mkdir(photos,{recursive:true});
for(const [original,name,width] of [['tx1.jpg','portrait',640],['GDC1.JPG','gdc',1000],['grad1.jpg','graduation',1000],['life1.jpg','life-1',1000],['life2.jpg','life-2',1000]]) {
  await sharp(fileURLToPath(new URL('../MyPhotos/'+original,import.meta.url)))
    .rotate().resize({width,withoutEnlargement:true}).webp({quality:82,effort:6})
    .toFile(fileURLToPath(new URL(name+'.webp',photos)));
}
await writeFile(new URL('../docs/asset-sizes.json',import.meta.url), JSON.stringify(report,null,2)+'\n');
console.table(report);
