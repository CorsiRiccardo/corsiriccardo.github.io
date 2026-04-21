// scripts/download-fonts.js
// Downloads 3 WOFF2 font files from Google Fonts CDN to assets/fonts/
// No npm deps required — uses Node built-ins only (https, fs, path)

const https = require('https');
const fs = require('fs');
const path = require('path');

const fonts = [
  { url: 'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_v86KnTOig.woff2', name: 'cormorant-garamond-400.woff2' },
  { url: 'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_iE9KnTOig.woff2', name: 'cormorant-garamond-600.woff2' },
  { url: 'https://fonts.gstatic.com/s/lora/v37/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkq0.woff2', name: 'lora-400.woff2' },
];

const dir = path.join(__dirname, '..', 'assets', 'fonts');
fs.mkdirSync(dir, { recursive: true });

let completed = 0;

for (const font of fonts) {
  const dest = path.join(dir, font.name);
  https.get(font.url, (res) => {
    const stream = fs.createWriteStream(dest);
    res.pipe(stream);
    res.on('end', () => {
      const size = fs.statSync(dest).size;
      console.log(`Downloaded: ${font.name} (${size} bytes)`);
      completed++;
      if (completed === fonts.length) {
        console.log('All fonts downloaded successfully.');
      }
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${font.name}:`, err.message);
    process.exit(1);
  });
}
