import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

async function generateIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#32cd32"/>
      <text x="${size / 2}" y="${size / 2}" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="#111111" text-anchor="middle" dominant-baseline="middle">WT</text>
    </svg>
  `;

  const png = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  writeFileSync(join(publicDir, `icon-${size}.png`), png);
  console.log(`Generated icon-${size}.png`);
}

async function generateIcons() {
  await generateIcon(192);
  await generateIcon(512);
  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);

