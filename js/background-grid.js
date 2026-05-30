// js/background-grid.js
// Pointer-reactive dotted background inspired by Spacesuit.
// Canvas-only, no layout work in the animation loop.

const gridLayer = document.querySelector('.interactive-grid');
const canvas = document.getElementById('interactiveGridCanvas');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas) {
  const ctx = canvas.getContext('2d');
  const gridSize = 28;
  const influenceRadius = 220;
  const baseOpacity = 0.055;
  const glowOpacity = 0.48;
  const baseSize = 1;
  const glowSize = 1.65;
  const dotColor = '139, 105, 20'; // --color-accent (#8B6914), warmer and more visible on paper

  let width = 0;
  let height = 0;
  let pointerX = -1000;
  let pointerY = -1000;
  let frameRequested = false;

  const requestDraw = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(draw);
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    requestDraw();
  };

  function draw() {
    frameRequested = false;
    ctx.clearRect(0, 0, width, height);

    const offsetY = -(window.scrollY % gridSize);
    const cols = Math.ceil(width / gridSize) + 1;
    const rows = Math.ceil(height / gridSize) + 2;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = col * gridSize;
        const y = row * gridSize + offsetY;
        const dx = x - pointerX;
        const dy = y - pointerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const intensity = Math.max(0, 1 - distance / influenceRadius);
        const opacity = baseOpacity + intensity * glowOpacity;
        const size = baseSize + intensity * glowSize;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor}, ${opacity})`;
        ctx.fill();
      }
    }
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', requestDraw, { passive: true });

  const updatePointer = (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;

    if (gridLayer) {
      gridLayer.style.setProperty('--grid-x', `${pointerX}px`);
      gridLayer.style.setProperty('--grid-y', `${pointerY}px`);
    }

    requestDraw();
  };

  window.addEventListener('pointermove', updatePointer, { passive: true });
  window.addEventListener('mousemove', updatePointer, { passive: true });

  window.addEventListener('pointerleave', () => {
    pointerX = -1000;
    pointerY = -1000;

    if (gridLayer) {
      gridLayer.style.setProperty('--grid-x', '-1000px');
      gridLayer.style.setProperty('--grid-y', '-1000px');
    }

    requestDraw();
  });

  resize();
}
