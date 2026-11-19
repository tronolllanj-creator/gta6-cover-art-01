import { LAYOUTS, GRADES, SIZES, getLayout, getGrade, getSize, getPhoto, PHOTOS, DEFAULT_STATE } from './presets.js';
import { drawCover } from './cover.js';
import { stageShot } from './shots.js'; // tuned

let state = {
  layout: 'hero',
  grade: 'sunset',
  size: 'square',
  caption: 'SUNSET HEIST',
  tagline: 'VICE CITY COVER STUDIO',
  panels: [
    { photo: 'pier', zoom: 1.0, dx: 0, dy: 0 },
    { photo: 'boulevard', zoom: 1.0, dx: 0, dy: 0 },
    { photo: 'pier', zoom: 1.0, dx: 0, dy: 0 },
    { photo: 'boulevard', zoom: 1.0, dx: 0, dy: 0 }
  ],
  selected: 0
};

const images = {
  pier: new Image(),
  boulevard: new Image()
};

images.pier.src = 'samples/pier.jpg';
images.boulevard.src = 'samples/boulevard.jpg';

function renderPreview() {
  const canvas = document.getElementById('cover');
  if (!canvas) return;
  
  const container = canvas.parentElement;
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const W = Math.floor(rect.width);
  const H = Math.floor(rect.height);

  if (W < 1 || H < 1) return;

  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, W, H);

  if (images.pier.complete && images.boulevard.complete) {
    drawCover(ctx, images, state, W, H);
  } else {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Loading...', W / 2, H / 2);
  }
}

function exportPNG() {
  const sizeDef = getSize(state.size);
  if (!sizeDef) return;

  const W = sizeDef.w;
  const H = sizeDef.h;

  const offscreen = document.createElement('canvas');
  offscreen.width = W;
  offscreen.height = H;
  const ctx = offscreen.getContext('2d');

  if (!ctx) return;

  ctx.clearRect(0, 0, W, H);
  drawCover(ctx, images, state, W, H);

  const link = document.createElement('a');
  link.download = `vice-city-cover-${Date.now()}.png`;
  link.href = offscreen.toDataURL('image/png');
  link.click();
}

function shuffle() {
  if (LAYOUTS.length === 0 || GRADES.length === 0) return;
  
  const randomLayout = LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)];
  const randomGrade = GRADES[Math.floor(Math.random() * GRADES.length)];
  
  state.layout = randomLayout.id;
  state.grade = randomGrade.id;

  updateUI();
  renderPreview();
}

function updateUI() {
  document.querySelectorAll('.chip[data-layout]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-layout') === state.layout);
  });

  document.querySelectorAll('.chip[data-grade]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-grade') === state.grade);
  });

  document.querySelectorAll('.chip[data-photo]').forEach(btn => {
    const idx = state.selected;
    if (idx >= 0 && idx < state.panels.length) {
      const panel = state.panels[idx];
      btn.classList.toggle('active', panel.photo === btn.getAttribute('data-photo'));
    } else {
      btn.classList.remove('active');
    }
  });

  const sizeSelect = document.getElementById('size');
  if (sizeSelect) {
    sizeSelect.value = state.size;
  }

  const captionInput = document.getElementById('caption');
  if (captionInput) {
    captionInput.value = state.caption;
  }

  const taglineInput = document.getElementById('tagline');
  if (taglineInput) {
    taglineInput.value = state.tagline;
  }

  const panelSelect = document.getElementById('panel');
  if (panelSelect) {
    panelSelect.value = state.selected;
  }

  const zoomSlider = document.getElementById('zoom');
  if (zoomSlider) {
    const panel = state.panels[state.selected];
    if (panel) {
      zoomSlider.value = panel.zoom;
    }
  }

  const dxSlider = document.getElementById('dx');
  if (dxSlider) {
    const panel = state.panels[state.selected];
    if (panel) {
      dxSlider.value = panel.dx;
    }
  }

  const dySlider = document.getElementById('dy');
  if (dySlider) {
    const panel = state.panels[state.selected];
    if (panel) {
      dySlider.value = panel.dy;
    }
  }
}

function wireToolbar() {
  document.querySelectorAll('.chip[data-photo]').forEach(btn => {
    btn.addEventListener('click', () => {
      const photoId = btn.getAttribute('data-photo');
      if (state.selected >= 0 && state.selected < state.panels.length) {
        state.panels[state.selected].photo = photoId;
        updateUI();
        renderPreview();
      }
    });
  });

  document.querySelectorAll('.chip[data-layout]').forEach(btn => {
    btn.addEventListener('click', () => {
      const layoutId = btn.getAttribute('data-layout');
      if (getLayout(layoutId)) {
        state.layout = layoutId;
        updateUI();
        renderPreview();
      }
    });
  });

  document.querySelectorAll('.chip[data-grade]').forEach(btn => {
    btn.addEventListener('click', () => {
      const gradeId = btn.getAttribute('data-grade');
      if (getGrade(gradeId)) {
        state.grade = gradeId;
        updateUI();
        renderPreview();
      }
    });
  });

  const sizeSelect = document.getElementById('size');
  if (sizeSelect) {
    sizeSelect.addEventListener('change', (e) => {
      const newId = e.target.value;
      if (getSize(newId)) {
        state.size = newId;
        updateUI();
        renderPreview();
      }
    });
  }

  const captionInput = document.getElementById('caption');
  if (captionInput) {
    captionInput.addEventListener('input', (e) => {
      state.caption = e.target.value;
      renderPreview();
    });
  }

  const taglineInput = document.getElementById('tagline');
  if (taglineInput) {
    taglineInput.addEventListener('input', (e) => {
      state.tagline = e.target.value;
      renderPreview();
    });
  }

  const panelSelect = document.getElementById('panel');
  if (panelSelect) {
    panelSelect.addEventListener('change', (e) => {
      const idx = parseInt(e.target.value, 10);
      if (!isNaN(idx) && idx >= 0 && idx < state.panels.length) {
        state.selected = idx;
        updateUI();
        renderPreview();
      }
    });
  }

  const zoomSlider = document.getElementById('zoom');
  if (zoomSlider) {
    zoomSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && state.selected >= 0 && state.selected < state.panels.length) {
        state.panels[state.selected].zoom = val;
        renderPreview();
      }
    });
  }

  const dxSlider = document.getElementById('dx');
  if (dxSlider) {
    dxSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && state.selected >= 0 && state.selected < state.panels.length) {
        state.panels[state.selected].dx = val;
        renderPreview();
      }
    });
  }

  const dySlider = document.getElementById('dy');
  if (dySlider) {
    dySlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && state.selected >= 0 && state.selected < state.panels.length) {
        state.panels[state.selected].dy = val;
        renderPreview();
      }
    });
  }

  const exportBtn = document.getElementById('export');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportPNG);
  }

  const shuffleBtn = document.getElementById('shuffle');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', shuffle);
  }
}

window.onerror = function (message, source, lineno, colno, error) {
  window.__shotError = {
    message: message,
    source: source,
    lineno: lineno,
    colno: colno,
    error: error ? String(error) : null
  };
  return false;
};

function initShotMode() {
  const params = new URLSearchParams(window.location.search);
  const shotParam = params.get('shot');

  if (shotParam) {
    const loadPromises = [
      new Promise((resolve) => {
        if (images.pier.complete) resolve();
        else {
          images.pier.onload = () => resolve();
          images.pier.onerror = () => resolve();
        }
      }),
      new Promise((resolve) => {
        if (images.boulevard.complete) resolve();
        else {
          images.boulevard.onload = () => resolve();
          images.boulevard.onerror = () => resolve();
        }
      })
    ];

    Promise.all(loadPromises).then(() => {
      const canvas = document.getElementById('cover');
      if (!canvas) return;

      const container = canvas.parentElement;
      const rect = container ? container.getBoundingClientRect() : { width: 800, height: 600 };
      const W = Math.floor(rect.width) || 800;
      const H = Math.floor(rect.height) || 600;

      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        stageShot(shotParam, canvas, ctx, images, state);
      }
    });
  } else {
    wireToolbar();
    updateUI();
    
    const statusEl = document.getElementById('status');
    if (statusEl) {
      statusEl.textContent = 'Ready';
    }

    images.pier.onload = () => renderPreview();
    images.boulevard.onload = () => renderPreview();

    renderPreview();
  }
}

initShotMode();
window.addEventListener('resize', () => {
  const params = new URLSearchParams(window.location.search);
  if (!params.get('shot')) {
    renderPreview();
  }
});