import { drawCover } from './cover.js';
import { getSize } from './presets.js';

export function parseShotParams() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  const photo = params.get('photo');
  const caption = params.get('caption');

  const result = {
    shot: shot || null,
    photo: photo || null,
    caption: caption || null
  };

  return result;
}

export function stageShot(shot, canvas, ctx, images, state) {
  if (!shot) return;

  // Apply photo if specified
  if (state.photo !== undefined || arguments.length > 5) {
    // This is handled in the main flow, but let's apply it here if passed via state or locally
    // The prompt says: if a photo param is pier/boulevard, set every panel photo to it
  }
  
  // Re-parse local params to get photo and caption if they weren't passed directly as state
  const params = new URLSearchParams(window.location.search);
  const photoParam = params.get('photo');
  const captionParam = params.get('caption');

  if (photoParam === 'pier' || photoParam === 'boulevard') {
    if (state.panels && state.panels.length === 4) {
      state.panels.forEach(panel => {
        panel.photo = photoParam;
      });
    }
  }

  if (captionParam) {
    state.caption = captionParam;
  }

  if (shot === 'cover') {
    document.body.classList.add('shot-cover');
    
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.zIndex = '9999';
    
    const W = window.innerWidth;
    const H = window.innerHeight;
    
    canvas.width = W;
    canvas.height = H;
    
    drawCover(ctx, images, state, W, H);
    
    requestAnimationFrame(() => {
      drawCover(ctx, images, state, W, H);
      window.__shotReady = true; // tuned
    });

  } else if (shot === 'editor') {
    // Leave editor visible
    const sizeObj = getSize(state.size);
    if (sizeObj) {
      const W = sizeObj.w;
      const H = sizeObj.h;
      
      canvas.width = W;
      canvas.height = H;
      
      // Draw the cover into the editor canvas
      drawCover(ctx, images, state, W, H);
      
      requestAnimationFrame(() => {
        drawCover(ctx, images, state, W, H);
        window.__shotReady = true;
      });
    }
  }
}
