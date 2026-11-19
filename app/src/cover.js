// VICE CITY COVER STUDIO — cover renderer
// Draws one cover onto any 2d canvas context: photo panels (cover-fit
// with per-panel zoom + pan), white frame lines, grade colour washes,
// a vignette and the caption block. Pure function of (images, state, W, H);
// no Date, no Math.random, no network.

import { findGrade, findLayout } from './presets.js';

const GAP_PX = 3;
const STROKE_PX = 8;

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

// Paint img into the rect (px, py, pw, ph) covering it fully, zoomed
// around its centre and panned by (dx, dy) in fractions of the source.
function paintPanel(ctx, img, px, py, pw, ph, zoom, dx, dy) {
  if (!img || !img.naturalWidth) return;
  const sw = img.naturalWidth / zoom;
  const sh = img.naturalHeight / zoom;
  let sx = (img.naturalWidth - sw) / 2 - dx * sw;
  let sy = (img.naturalHeight - sh) / 2 - dy * sh;
  sx = clamp(sx, 0, img.naturalWidth - sw);
  sy = clamp(sy, 0, img.naturalHeight - sh);
  ctx.save();
  ctx.beginPath();
  ctx.rect(px, py, pw, ph);
  ctx.clip();
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, sx, sy, sw, sh, px, py, pw, ph);
  ctx.restore();
}

function paintFrames(ctx, W, H, layout) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = GAP_PX;
  for (const r of layout.panels) {
    const px = r.x * W;
    const py = r.y * H;
    const pw = r.w * W;
    const ph = r.h * H;
    ctx.strokeRect(px + GAP_PX / 2, py + GAP_PX / 2, pw - GAP_PX, ph - GAP_PX);
  }
  ctx.restore();
}

function paintGrade(ctx, W, H, grade) {
  for (const wash of grade.washes) {
    ctx.save();
    ctx.globalCompositeOperation = wash.blend;
    ctx.globalAlpha = wash.alpha;
    ctx.fillStyle = wash.color;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

function paintVignette(ctx, W, H, strength) {
  if (!strength) return;
  const cx = W / 2;
  const cy = H / 2;
  const radius = 0.85 * Math.max(W, H);
  const grad = ctx.createRadialGradient(cx, cy, radius * 0.25, cx, cy, radius);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, `rgba(0,0,0,${strength})`);
  ctx.save();
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

// Letter-spaced fill, one glyph at a time, starting at (x, y).
function spacedText(ctx, text, x, y, gap) {
  let cursor = x;
  for (const ch of text) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + gap;
  }
  return cursor;
}

function paintCaption(ctx, W, H, state, grade) {
  const caption = (state.caption || '').toUpperCase();
  const tagline = (state.tagline || '').toUpperCase();
  const titleSize = Math.max(14, Math.round(W / 10));
  const tagSize = Math.max(9, Math.round(W / 44));
  const padX = W * 0.05;
  const baseY = H - H * 0.055;
  const tagGap = tagSize * 0.3;

  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Tagline + gold rule above the title.
  ctx.font = `700 ${tagSize}px "Arial Black", "Helvetica Neue", Arial, sans-serif`;
  ctx.fillStyle = grade.caption;
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 2;
  const tagEnd = spacedText(ctx, tagline, padX, baseY - titleSize - tagSize * 1.6, tagGap);
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#ffc93c';
  ctx.fillRect(padX, baseY - titleSize - tagSize * 0.9, Math.min(tagEnd - padX, W * 0.45), 2);

  // Big title with ink outline and drop shadow.
  ctx.font = `900 ${titleSize}px "Arial Black", "Helvetica Neue", Arial, sans-serif`;
  ctx.lineJoin = 'round';
  ctx.lineWidth = STROKE_PX;
  ctx.strokeStyle = grade.stroke;
  ctx.strokeText(caption, padX, baseY);
  ctx.shadowColor = 'rgba(0,0,0,0.65)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = grade.caption;
  ctx.fillText(caption, padX, baseY);
  ctx.restore();
}

export function drawCover(ctx, images, state, W, H) {
  const layout = findLayout(state.layout);
  const grade = findGrade(state.grade);
  ctx.fillStyle = '#17171f';
  ctx.fillRect(0, 0, W, H);
  layout.panels.forEach((rect, i) => {
    const panel = state.panels[i] || state.panels[0];
    const img = images[panel.photo] || images.pier;
    paintPanel(
      ctx, img,
      rect.x * W, rect.y * H, rect.w * W, rect.h * H,
      panel.zoom || 1, panel.dx || 0, panel.dy || 0,
    );
  });
  paintFrames(ctx, W, H, layout);
  paintGrade(ctx, W, H, grade);
  paintVignette(ctx, W, H, grade.vignette);
  paintCaption(ctx, W, H, state, grade);
}
