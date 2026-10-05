/**
 * Generates raster brand assets from the source SVG artwork.
 *
 * Outputs (into both the repo `public/` and `backend/public/`):
 *   - favicon.ico          multi-resolution ICO (16 / 32 / 48 px)
 *   - apple-touch-icon.png 180 x 180 px PNG
 *   - og-image.png         1200 x 630 px PNG (social scrapers do not render SVG)
 *
 * Requires `sharp` (dev-time only; run via:  node backend/cpanel_deploy/generate_icons.cjs)
 */
const path = require('path');
const fs = require('fs');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Missing dependency: sharp. Install with `npm i -D sharp` before running.');
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, '..', '..');
const svgPath = path.join(repoRoot, 'public', 'favicon.svg');
const ogSvgPath = path.join(repoRoot, 'public', 'og-image.svg');
const targets = [path.join(repoRoot, 'public'), path.join(repoRoot, 'backend', 'public')];

const svg = fs.readFileSync(svgPath);
const ogSvg = fs.readFileSync(ogSvgPath);
const render = (size) =>
  sharp(svg, { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

/** Assemble PNG buffers into a single multi-resolution .ico container. */
function buildIco(images, sizes) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = icon
  header.writeUInt16LE(images.length, 4);

  const entries = [];
  let offset = 6 + images.length * 16;

  images.forEach((img, i) => {
    const size = sizes[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += img.length;
    entries.push(entry);
  });

  return Buffer.concat([header, ...entries, ...images]);
}

(async () => {
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map(render));
  const ico = buildIco(images, sizes);
  const apple = await render(180);
  const og = await sharp(ogSvg, { density: 192 }).resize(1200, 630, { fit: 'cover' }).png().toBuffer();

  for (const dir of targets) {
    if (!fs.existsSync(dir)) continue;
    fs.writeFileSync(path.join(dir, 'favicon.ico'), ico);
    fs.writeFileSync(path.join(dir, 'apple-touch-icon.png'), apple);
    fs.writeFileSync(path.join(dir, 'og-image.png'), og);
  }

  console.log(
    `favicon.ico=${ico.length} bytes, apple-touch-icon.png=${apple.length} bytes, og-image.png=${og.length} bytes`,
  );
})();
