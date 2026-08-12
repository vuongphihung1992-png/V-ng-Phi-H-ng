import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'public', 'icons');
const publicDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Minimalist, clean PWA Icon SVG (No fake badges or police seals)
const createIconSVG = (width, height, isMaskable = false) => {
  const bgPadding = isMaskable ? width * 0.1 : 0;
  const innerWidth = width - bgPadding * 2;
  const innerHeight = height - bgPadding * 2;
  const cx = width / 2;
  const cy = height / 2;

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#991b1b" />
      <stop offset="100%" stop-color="#700a0a" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="${height * 0.015}" stdDeviation="${height * 0.02}" flood-color="#000" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="${width}" height="${height}" fill="${isMaskable ? '#881337' : '#ffffff'}" rx="${isMaskable ? 0 : width * 0.22}" />

  <!-- Main Container Card / Shield Background -->
  <g filter="url(#shadow)">
    <!-- Base Rounded Container if not maskable -->
    <rect x="${cx - innerWidth * 0.42}" y="${cy - innerHeight * 0.42}" width="${innerWidth * 0.84}" height="${innerHeight * 0.84}" rx="${innerWidth * 0.18}" fill="url(#bgGrad)" stroke="url(#goldGrad)" stroke-width="${width * 0.015}" />
  </g>

  <!-- Central Emblem Geometry: Minimalist Star & Shield outline -->
  <g transform="translate(${cx}, ${cy - height * 0.03}) scale(${width / 512})">
    <!-- Clean Shield Contour -->
    <path d="M0 -150 L110 -100 C110 50 70 130 0 170 C-70 130 -110 50 -110 -100 Z" fill="none" stroke="url(#goldGrad)" stroke-width="10" />
    
    <!-- Gold Star Emblem -->
    <path d="M0 -75 L20 -20 L75 -20 L30 15 L48 70 L0 35 L-48 70 L-30 15 L-75 -20 L-20 -20 Z" fill="url(#goldGrad)" />
    
    <!-- Subtitle Text "PƠNG DRANG" -->
    <text x="0" y="125" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle" letter-spacing="3">PƠNG DRANG</text>
  </g>
</svg>
`;
};

// Generate Icons
async function generateAllIcons() {
  console.log('Generating PWA icons...');

  const svg192 = createIconSVG(192, 192, false);
  const svg512 = createIconSVG(512, 512, false);
  const svgMaskable = createIconSVG(512, 512, true);
  const svgApple = createIconSVG(180, 180, false);
  const svgFavicon = createIconSVG(64, 64, false);

  // Write SVGs
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgFavicon);
  fs.writeFileSync(path.join(outputDir, 'icon-192.svg'), svg192);
  fs.writeFileSync(path.join(outputDir, 'icon-512.svg'), svg512);

  // Convert to PNGs using Sharp
  await sharp(Buffer.from(svg192)).png().toFile(path.join(outputDir, 'icon-192.png'));
  await sharp(Buffer.from(svg512)).png().toFile(path.join(outputDir, 'icon-512.png'));
  await sharp(Buffer.from(svgMaskable)).png().toFile(path.join(outputDir, 'maskable-512.png'));
  await sharp(Buffer.from(svgApple)).png().toFile(path.join(outputDir, 'apple-touch-icon.png'));
  await sharp(Buffer.from(svgFavicon)).png().toFile(path.join(publicDir, 'favicon.ico'));

  console.log('All PWA icons generated successfully in /public!');
}

generateAllIcons().catch(console.error);
