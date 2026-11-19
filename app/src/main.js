// VICE CITY COVER STUDIO — editor wiring
// Owns the page state, loads the two kit photos, wires the toolbar and
// renders the preview canvas. Shot mode (?shot=cover|editor) is handed
// to shots.js instead. Export draws the same cover at full export size.

import { LAYOUTS, GRADES, SIZES, PHOTOS, findLayout, findGrade, findSize, defaultState } from './presets.js';
import { drawCover } from './cover.js';
import { stageShot } from './shots.js';

const state = defaultState();
const images = {};
for (const p of PHOTOS) {
  const img = new Image();
  img.src = p.path;
  images[p.id] = img;
}

const $ = (id) => document.getElementById(id);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

window.onerror = (message, source, lineno, colno, error) => {
  window.__shotError = { message, source, lineno, colno, error: error ? String(error) : null };
  return false;
};

function paintPreview() {
  const canvas = $('cover');
  if (!canvas) return;
  const box = canvas.parentElement;
  const rect = box ? box.getBoundingClientRect() : { width: 800, height: 600 };
  const W = Math.max(1, Math.floor(rect.width));
  const H = Math.max(1, Math.floor(rect.height));
  if (canvas.width !== W) canvas.width = W;
  if (canvas.height !== H) canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const ready = PHOTOS.every((p) => images[p.id].complete && images[p.id].naturalWidth);
  if (ready) {
    drawCover(ctx, images, state, W, H);
  } else {
    ctx.fillStyle = '#17171f';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#f5efe4';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Loading photos…', W / 2, H / 2);
  }
}

function refreshControls() {
  $$('[data-layout]').forEach((b) => b.classList.toggle('active', b.dataset.layout === state.layout));
  $$('[data-grade]').forEach((b) => b.classList.toggle('active', b.dataset.grade === state.grade));
  $$('[data-photo]').forEach((b) => {
    const panel = state.panels[state.selected];
    b.classList.toggle('active', !!panel && panel.photo === b.dataset.photo);
  });
  const sizeSel = $('size');
  if (sizeSel) sizeSel.value = state.size;
  const panelSel = $('panel');
  if (panelSel) panelSel.value = String(state.selected);
  const panel = state.panels[state.selected];
  if (panel) {
    $('zoom').value = String(panel.zoom);
    $('dx').value = String(panel.dx);
    $('dy').value = String(panel.dy);
    $('zoom-out').textContent = panel.zoom.toFixed(2);
    $('dx-out').textContent = panel.dx.toFixed(2);
    $('dy-out').textContent = panel.dy.toFixed(2);
  }
  $('caption').value = state.caption;
  $('tagline').value = state.tagline;
}

function rebuildPanelPicker() {
  const panelSel = $('panel');
  const layout = findLayout(state.layout);
  panelSel.innerHTML = '';
  layout.panels.forEach((_, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = `Panel ${i + 1}`;
    panelSel.appendChild(opt);
  });
  if (state.selected >= layout.panels.length) state.selected = 0;
}

function exportPNG() {
  const size = findSize(state.size);
  const off = document.createElement('canvas');
  off.width = size.w;
  off.height = size.h;
  const ctx = off.getContext('2d');
  if (!ctx) return;
  drawCover(ctx, images, state, size.w, size.h);
  const a = document.createElement('a');
  a.download = `vice-city-cover-${state.size}.png`;
  a.href = off.toDataURL('image/png');
  a.click();
  $('status').textContent = `Exported ${size.w}x${size.h} PNG`;
}

function shuffle() {
  state.layout = LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)].id;
  state.grade = GRADES[Math.floor(Math.random() * GRADES.length)].id;
  rebuildPanelPicker();
  refreshControls();
  paintPreview();
}

function bind() {
  $$('[data-photo]').forEach((b) => b.addEventListener('click', () => {
    const panel = state.panels[state.selected];
    if (panel) {
      panel.photo = b.dataset.photo;
      refreshControls();
      paintPreview();
    }
  }));
  $$('[data-layout]').forEach((b) => b.addEventListener('click', () => {
    state.layout = b.dataset.layout;
    rebuildPanelPicker();
    refreshControls();
    paintPreview();
  }));
  $$('[data-grade]').forEach((b) => b.addEventListener('click', () => {
    state.grade = b.dataset.grade;
    refreshControls();
    paintPreview();
  }));
  $('size').addEventListener('change', (e) => {
    state.size = e.target.value;
    refreshControls();
    paintPreview();
  });
  $('panel').addEventListener('change', (e) => {
    const idx = Number.parseInt(e.target.value, 10);
    if (Number.isInteger(idx) && idx >= 0 && idx < state.panels.length) {
      state.selected = idx;
      refreshControls();
      paintPreview();
    }
  });
  $('caption').addEventListener('input', (e) => { state.caption = e.target.value; paintPreview(); });
  $('tagline').addEventListener('input', (e) => { state.tagline = e.target.value; paintPreview(); });
  for (const [id, key] of [['zoom', 'zoom'], ['dx', 'dx'], ['dy', 'dy']]) {
    $(id).addEventListener('input', (e) => {
      const v = Number.parseFloat(e.target.value);
      const panel = state.panels[state.selected];
      if (!Number.isNaN(v) && panel) {
        panel[key] = v;
        refreshControls();
        paintPreview();
      }
    });
  }
  $('export').addEventListener('click', exportPNG);
  $('shuffle').addEventListener('click', shuffle);
}

function boot() {
  const shot = new URLSearchParams(window.location.search).get('shot');
  const canvas = $('cover');
  const ctx = canvas.getContext('2d');
  const photosReady = Promise.all(PHOTOS.map((p) => new Promise((resolve) => {
    const img = images[p.id];
    if (img.complete) resolve();
    else { img.onload = () => resolve(); img.onerror = () => resolve(); }
  })));
  photosReady.then(() => {
    if (shot === 'cover' || shot === 'editor') {
      rebuildPanelPicker();
      refreshControls();
      stageShot(shot, canvas, ctx, images, state);
    } else {
      rebuildPanelPicker();
      bind();
      refreshControls();
      paintPreview();
      $('status').textContent = 'Ready';
    }
  });
  window.addEventListener('resize', () => {
    if (!new URLSearchParams(window.location.search).get('shot')) paintPreview();
  });
}

boot();
