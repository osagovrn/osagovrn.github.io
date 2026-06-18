import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const root = path.resolve(path.dirname(path.dirname(fileURLToPath(import.meta.url))), '..');
const svgPath = path.join(root, 'favicon.svg');
const icoPath = path.join(root, 'favicon.ico');
const sizes = [16, 32, 48];

const pngBuffers = await Promise.all(
  sizes.map((size) => sharp(svgPath).resize(size, size).png().toBuffer())
);

const ico = await pngToIco(pngBuffers);
writeFileSync(icoPath, ico);
console.log('Created', icoPath, `(${ico.length} bytes, sizes: ${sizes.join(', ')})`);

const ogSvg = path.join(root, 'og-image.svg');
const ogPng = path.join(root, 'og-image.png');
await sharp(ogSvg).resize(1200, 630).png().toFile(ogPng);
console.log('Created', ogPng);
