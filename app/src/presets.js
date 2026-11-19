// VICE CITY COVER STUDIO — shared presets
// Original, self-contained design tokens for the cover maker.
// Plain ES module; no assets beyond the two kit photos.

const INK = "#0d0d12";
const CAPTION_STROKE = 8;

// Export canvas sizes (width x height).
export const SIZES = [
  { id: "square", name: "Square", w: 1080, h: 1080 },
  { id: "portrait", name: "Portrait", w: 1080, h: 1350 },
  { id: "wide", name: "Wide", w: 1920, h: 1080 },
];

// Layouts: panel rects as fractions {x,y,w,h} plus a caption zone box.
// Rectangles tile within the cover leaving a slim inner margin so white gap lines show.
export const LAYOUTS = [
  {
    id: "hero",
    name: "Hero",
    panels: [{ x: 0.04, y: 0.04, w: 0.92, h: 0.92 }],
    caption: { x: 0.06, y: 0.66, w: 0.88, h: 0.26 },
  },
  {
    id: "duo",
    name: "Duo",
    panels: [
      { x: 0.04, y: 0.04, w: 0.45, h: 0.5 },
      { x: 0.51, y: 0.04, w: 0.45, h: 0.5 },
    ],
    caption: { x: 0.06, y: 0.6, w: 0.88, h: 0.3 },
  },
  {
    id: "triptych",
    name: "Triptych",
    panels: [
      { x: 0.04, y: 0.04, w: 0.92, h: 0.44 },
      { x: 0.04, y: 0.5, w: 0.45, h: 0.44 },
      { x: 0.51, y: 0.5, w: 0.45, h: 0.44 },
    ],
    caption: { x: 0.06, y: 0.6, w: 0.88, h: 0.3 },
  },
  {
    id: "grid",
    name: "Grid",
    panels: [
      { x: 0.04, y: 0.04, w: 0.45, h: 0.44 },
      { x: 0.51, y: 0.04, w: 0.45, h: 0.44 },
      { x: 0.04, y: 0.5, w: 0.45, h: 0.44 },
      { x: 0.51, y: 0.5, w: 0.45, h: 0.44 },
    ],
    caption: { x: 0.06, y: 0.6, w: 0.88, h: 0.3 },
  },
];

// Grades: overlay stack per frame, vignette strength, caption colors.
// Blends use standard canvas composite ops (multiply / screen / overlay).
export const GRADES = [
  {
    id: "sunset",
    name: "Sunset",
    overlay: [
      { color: "#ff7a18", blend: "multiply", alpha: 0.34 },
      { color: "#ff2d78", blend: "soft-light", alpha: 0.42 },
    ],
    vignette: 0.5,
    captionColor: "#fff4e6",
    captionStroke: INK,
  },
  {
    id: "neon",
    name: "Neon",
    overlay: [
      { color: "#ff2bd6", blend: "hue", alpha: 0.5 },
      { color: "#22e6ff", blend: "screen", alpha: 0.36 },
    ],
    vignette: 0.34,
    captionColor: "#ffffff",
    captionStroke: "#1a0d2a",
  },
  {
    id: "noir",
    name: "Noir",
    overlay: [
      { color: "#9a9aad", blend: "saturation", alpha: 0.28 },
      { color: "#000000", blend: "multiply", alpha: 0.44 },
    ],
    vignette: 0.72,
    captionColor: "#f5efe4",
    captionStroke: "#000000",
  },
  {
    id: "vice",
    name: "Vice",
    overlay: [
      { color: "#0c6b72", blend: "soft-light", alpha: 0.5 },
      { color: "#ff7a18", blend: "color", alpha: 0.44 },
    ],
    vignette: 0.42,
    captionColor: "#ffffff",
    captionStroke: "#0d2a33",
  },
];

// Kit photos, plain relative paths (available as static files under app/).
export const PHOTOS = [
  { id: "pier", name: "Pier", path: "samples/pier.jpg" },
  { id: "boulevard", name: "Boulevard", path: "samples/boulevard.jpg" },
];

// Number of layout panels defines the max selectable panels.
const PANEL_COUNT = 4;

// Deterministic initial per-panel crop state.
function makePanels() {
  const out = [];
  // Per-panel photo selection pattern so defaults look varied but fixed.
  const photos = ["pier", "boulevard", "pier", "boulevard"];
  const z = [1.2, 1.35, 1.15, 1.3];
  const dx = [0.0, 0.06, -0.05, 0.04];
  const dy = [-0.02, 0.04, 0.0, -0.03];
  for (let i = 0; i < PANEL_COUNT; i++) out.push({ photo: photos[i], zoom: z[i], dx: dx[i], dy: dy[i] });
  return out;
}

// Defaults for a fresh editor / shot.
export const DEFAULT_STATE = {
  panels: makePanels(),
  layout: "hero",
  grade: "sunset",
  size: "square",
  caption: "SUNSET HEIST",
  tagline: "VICE CITY COVER STUDIO",
};

// Convenience lookups used by UI + engine.
export function getLayout(id) { return LAYOUTS.find(l => l.id === id) || LAYOUTS[0]; } // tuned
export function getGrade(id) { return GRADES.find(g => g.id === id) || GRADES[0]; }
export function getSize(id) { return SIZES.find(s => s.id === id) || SIZES[0]; }
export function getPhoto(id) { return PHOTOS.find(p => p.id === id) || PHOTOS[0]; }
export function cloneState(s) { return { ...s, panels: s.panels.map(p => ({ ...p })) }; }
export { INK, CAPTION_STROKE };
