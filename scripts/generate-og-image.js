// scripts/generate-og-image.js
// Generates assets/og-image.png 1200x630 warm cream background
// Requires: npm install pureimage (dev only)

const PImage = require('pureimage');
const fs = require('fs');
const path = require('path');

async function generate() {
  // Register a system font so pureimage can render text
  // Uses Arial Bold from Windows system fonts as display font
  const fontPaths = [
    '/c/Windows/Fonts/arialbd.ttf',
    'C:\\Windows\\Fonts\\arialbd.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    '/System/Library/Fonts/Helvetica.ttc',
  ];

  let fontFamily = 'Display';
  let fontRegistered = false;
  for (const fontPath of fontPaths) {
    if (fs.existsSync(fontPath)) {
      try {
        const font = PImage.registerFont(fontPath, fontFamily);
        await font.load();
        fontRegistered = true;
        console.log('Registered and loaded font from:', fontPath);
        break;
      } catch (e) {
        console.warn('Font registration failed for', fontPath, e.message);
      }
    }
  }

  if (!fontRegistered) {
    console.warn('No system font found — text will not render; using background + accent line only');
    fontFamily = 'serif';
  }

  const img = PImage.make(1200, 630);
  const ctx = img.getContext('2d');

  // Warm cream background matching #F5F0E8
  ctx.fillStyle = '#F5F0E8';
  ctx.fillRect(0, 0, 1200, 630);

  // Name text
  ctx.fillStyle = '#2C2416';
  ctx.font = `bold 80px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.fillText('Riccardo Corsi', 600, 280);

  // Subtitle
  ctx.font = `40px ${fontFamily}`;
  ctx.fillStyle = '#6B5D4F';
  ctx.fillText('Software Developer', 600, 360);

  // Accent line — #8B6914 gold, 2px, centered
  ctx.strokeStyle = '#8B6914';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(480, 400);
  ctx.lineTo(720, 400);
  ctx.stroke();

  const outDir = path.join(__dirname, '..', 'assets');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'og-image.png');
  const stream = fs.createWriteStream(outPath);
  await PImage.encodePNGToStream(img, stream);
  const size = fs.statSync(outPath).size;
  console.log(`Generated assets/og-image.png (1200x630), ${size} bytes`);
}

generate().catch(console.error);
