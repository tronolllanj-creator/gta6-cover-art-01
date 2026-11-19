// VICE CITY COVER STUDIO — screenshot staging
// ?shot=cover renders the cover full-bleed (chrome hidden); ?shot=editor
// keeps the editor visible and paints the preview canvas. Optional
// ?photo=pier|boulevard forces every panel to that photo and
// ?caption=TEXT replaces the caption. Both modes set window.__shotReady
// once the frame is painted twice (second paint settles any async font
// or image decode), and never use randomness.

import { drawCover } from './cover.js';

function readShotParams() {
  const q = new URLSearchParams(window.location.search);
  return {
    shot: q.get('shot'),
    photo: q.get('photo'),
    caption: q.get('caption'),
  };
}

function applyOverrides(state, params) {
  if (params.photo === 'pier' || params.photo === 'boulevard') {
    for (const panel of state.panels) panel.photo = params.photo;
  }
  if (params.caption) state.caption = params.caption;
}

function paintTwice(canvas, ctx, images, state) {
  const W = canvas.width;
  const H = canvas.height;
  drawCover(ctx, images, state, W, H);
  requestAnimationFrame(() => {
    drawCover(ctx, images, state, W, H);
    window.__shotReady = true;
  });
}

export function stageShot(shot, canvas, ctx, images, state) {
  const params = readShotParams();
  applyOverrides(state, params);
  if (shot === 'cover') {
    document.body.classList.add('shot-cover');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    paintTwice(canvas, ctx, images, state);
  } else if (shot === 'editor') {
    const box = canvas.parentElement;
    const rect = box ? box.getBoundingClientRect() : { width: 1280, height: 720 };
    canvas.width = Math.max(1, Math.floor(rect.width));
    canvas.height = Math.max(1, Math.floor(rect.height));
    paintTwice(canvas, ctx, images, state);
  }
}
