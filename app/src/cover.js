import { LAYOUTS, GRADES, SIZES } from "./presets.js";

const INK = "#0d0d12";
const WHITE = "#ffffff";
const GOLD = "#ffc93c";
const GAP = 3;
const CAPTION_STROKE = 8;

function clamp(v, a, b) {
  return v < a ? a : v > b ? b : v;
}

function coverDraw(ctx, img, px, py, pw, ph, zoom, dx, dy) {
  if (!img || !img.width) return;
  const sw = img.width / zoom;
  const sh = img.height / zoom;
  let sx = (img.width - sw) / 2 - dx * sw;
  let sy = (img.height - sh) / 2 - dy * sh;
  sx = clamp(sx, 0, img.width - sw);
  sy = clamp(sy, 0, img.height - sh);
  ctx.save();
  ctx.beginPath();
  ctx.rect(px, py, pw, ph);
  ctx.clip();
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, sy, sw, sh, px, py, pw, ph);
  ctx.restore();
}

function drawGaps(ctx, W, H, layout) {
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = GAP;
  const rects = layout.panels;
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    const px = r.x * W;
    const py = r.y * H;
    const pw = r.w * W;
    const ph = r.h * H;
    ctx.strokeRect(px + GAP / 2, py + GAP / 2, pw - GAP, ph - GAP);
  }
}

function drawGradeOverlay(ctx, W, H, grade) {
  for (const ov of grade.overlay) {
    ctx.save();
    ctx.globalCompositeOperation = ov.blend;
    ctx.globalAlpha = ov.alpha;
    ctx.fillStyle = ov.color;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

function drawVignette(ctx, W, H, cfg) {
  if (!cfg || !cfg.intensity) return;
  const cx = cfg.cx || 0.5;
  const cy = cfg.cy || 0.5;
  const r = cfg.r || 0.8;
  const cxp = cx * W;
  const cyp = cy * H;
  const rad = r * Math.max(W, H);
  const grad = ctx.createRadialGradient(cxp, cyp, rad * 0.2, cxp, cyp, rad);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, `rgba(0,0,0,${cfg.intensity})`);
  ctx.save();
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function letterSpacing(ctx, text, x, y, spacing) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
}

function drawCaption(ctx, W, H, state, grade) {
  const caption = (state.caption || "").toUpperCase();
  const tagline = (state.tagline || "").toUpperCase();
  const fontSize = Math.max(12, W / 11);
  const tagSize = Math.max(8, W / 48);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `900 ${fontSize}px "Arial Black", "Helvetica Neue", Arial, sans-serif`;
  const padX = W * 0.05;
  const padY = H * 0.06;
  const cy = H - padY - CAPTION_STROKE;
  const tagspace = tagSize * 0.25;
  const tagWidth = tagline.length ? tagline.length * (tagSize + tagspace) : 0;
  const ruleY = cy - fontSize - tagSize - 10;
  const ruleLen = Math.min(tagWidth, W * 0.5);
  ctx.save();
  ctx.fillStyle = GOLD;
  ctx.fillRect(padX, ruleY - tagSize, ruleLen, 2);
  ctx.restore();
  ctx.save();
  ctx.font = `700 ${tagSize}px "Arial Black", "Helvetica Neue", Arial, sans-serif`;
  ctx.fillStyle = grade.captionColor || WHITE;
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  letterSpacing(ctx, tagline, padX, ruleY - tagSize * 1.4, tagspace);
  ctx.restore();
  ctx.save();
  ctx.font = `900 ${fontSize}px "Arial Black", "Helvetica Neue", Arial, sans-serif`;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = CAPTION_STROKE;
  ctx.strokeStyle = INK;
  ctx.strokeText(caption, padX, cy);
  ctx.shadowColor = "rgba(0,0,0,0.7)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = grade.captionColor || WHITE;
  ctx.fillText(caption, padX, cy);
  ctx.restore();
}

export function drawCover(ctx, images, state, W, H) {
  const layout = LAYOUTS.find(l => l.id === state.layout) || LAYOUTS[0];
  const grade = GRADES.find(g => g.id === state.grade) || GRADES[0];
  ctx.fillStyle = "#17171f";
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < layout.panels.length; i++) {
    const r = layout.panels[i];
    const px = r.x * W;
    const py = r.y * H;
    const pw = r.w * W;
    const ph = r.h * H;
    const panel = state.panels[i] || state.panels[0];
    const img = images[panel.photo] || images.pier;
    coverDraw(ctx, img, px, py, pw, ph, panel.zoom || 1, panel.dx || 0, panel.dy || 0);
  }
  drawGaps(ctx, W, H, layout);
  drawGradeOverlay(ctx, W, H, grade);
  drawVignette(ctx, W, H, { intensity: grade.vignette });
  drawCaption(ctx, W, H, state, grade);
}

export function renderCoverToCanvas(images, state, W, H) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  drawCover(ctx, images, state, W, H);
  return canvas;
}