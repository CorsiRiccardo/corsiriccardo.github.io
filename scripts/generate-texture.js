// scripts/generate-texture.js
// Generates assets/textures/paper-grain.png — 200×200px warm noise tile
// No npm deps required — uses Node built-ins only (zlib, Buffer)

const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function generatePNG(width, height, getPixel) {
  // PNG file structure: signature + IHDR + IDAT + IEND
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk: width, height, bit depth 8, color type 2 (RGB)
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0); // filter type none
    for (let x = 0; x < width; x++) {
      const [r, g, b] = getPixel(x, y);
      rawData.push(r, g, b);
    }
  }

  const compressed = zlib.deflateSync(Buffer.from(rawData));

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBytes = Buffer.from(type, 'ascii');
    const combined = Buffer.concat([typeBytes, data]);
    let crc = 0xFFFFFFFF;
    for (const byte of combined) {
      crc ^= byte;
      for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
    crc ^= 0xFFFFFFFF;
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc >>> 0, 0);
    return Buffer.concat([len, typeBytes, data, crcBuf]);
  }

  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
}

// Warm noise: each pixel is a small random deviation around mid-grey with a warm (reddish) bias
function getPixel(x, y) {
  const noise = Math.random() * 80 - 40;  // -40 to +40 range
  const base = 128;
  const r = Math.max(0, Math.min(255, base + noise + 8));   // warm bias
  const g = Math.max(0, Math.min(255, base + noise + 2));
  const b = Math.max(0, Math.min(255, base + noise - 6));
  return [Math.round(r), Math.round(g), Math.round(b)];
}

const dir = path.join(__dirname, '..', 'assets', 'textures');
fs.mkdirSync(dir, { recursive: true });
const png = generatePNG(200, 200, getPixel);
fs.writeFileSync(path.join(dir, 'paper-grain.png'), png);
console.log('Generated assets/textures/paper-grain.png');
