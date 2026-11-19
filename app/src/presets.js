// VICE CITY COVER STUDIO — preset data
// All design tokens for the cover maker live here: export sizes, panel
// layouts, colour grades and the two kit photos. Nothing here touches the
// network; the photos are local files under app/samples/.

export const SIZES = [
  { id: 'square', label: 'Square', w: 1080, h: 1080 },
  { id: 'portrait', label: 'Portrait', w: 1080, h: 1350 },
  { id: 'wide', label: 'Wide', w: 1920, h: 1080 },
];

// Panel rectangles are fractions of the cover (x, y, w, h). The outer
// 3% rim stays empty so the frame lines read as a border.
export const LAYOUTS = [
  {
    id: 'hero',
    label: 'Hero',
    panels: [{ x: 0.03, y: 0.03, w: 0.94, h: 0.94 }],
  },
  {
    id: 'duo',
    label: 'Duo',
    panels: [
      { x: 0.03, y: 0.03, w: 0.46, h: 0.62 },
      { x: 0.51, y: 0.03, w: 0.46, h: 0.62 },
    ],
  },
  {
    id: 'triptych',
    label: 'Triptych',
    panels: [
      { x: 0.03, y: 0.03, w: 0.94, h: 0.5 },
      { x: 0.03, y: 0.55, w: 0.46, h: 0.42 },
      { x: 0.51, y: 0.55, w: 0.46, h: 0.42 },
    ],
  },
  {
    id: 'grid',
    label: 'Grid',
    panels: [
      { x: 0.03, y: 0.03, w: 0.46, h: 0.46 },
      { x: 0.51, y: 0.03, w: 0.46, h: 0.46 },
      { x: 0.03, y: 0.51, w: 0.46, h: 0.46 },
      { x: 0.51, y: 0.51, w: 0.46, h: 0.46 },
    ],
  },
];

// A grade is a stack of full-frame colour washes (canvas blend modes),
// a vignette strength and the caption ink.
export const GRADES = [
  {
    id: 'sunset',
    label: 'Sunset',
    washes: [
      { color: '#ff8c1a', blend: 'multiply', alpha: 0.30 },
      { color: '#ff2d78', blend: 'overlay', alpha: 0.35 },
    ],
    vignette: 0.45,
    caption: '#fff3e0',
    stroke: '#14090a',
  },
  {
    id: 'neon',
    label: 'Neon',
    washes: [
      { color: '#ff2bd6', blend: 'color', alpha: 0.45 },
      { color: '#22e6ff', blend: 'screen', alpha: 0.30 },
    ],
    vignette: 0.30,
    caption: '#ffffff',
    stroke: '#200a30',
  },
  {
    id: 'noir',
    label: 'Noir',
    washes: [
      { color: '#8a8aa0', blend: 'saturation', alpha: 0.35 },
      { color: '#000000', blend: 'multiply', alpha: 0.40 },
    ],
    vignette: 0.65,
    caption: '#f2ecdc',
    stroke: '#000000',
  },
  {
    id: 'vice',
    label: 'Vice',
    washes: [
      { color: '#0e7d84', blend: 'soft-light', alpha: 0.55 },
      { color: '#ff8c1a', blend: 'color', alpha: 0.38 },
    ],
    vignette: 0.38,
    caption: '#ffffff',
    stroke: '#0a2e33',
  },
];

export const PHOTOS = [
  { id: 'pier', label: 'Pier', path: 'samples/pier.jpg' },
  { id: 'boulevard', label: 'Boulevard', path: 'samples/boulevard.jpg' },
];

export function findLayout(id) {
  return LAYOUTS.find((l) => l.id === id) || LAYOUTS[0];
}
export function findGrade(id) {
  return GRADES.find((g) => g.id === id) || GRADES[0];
}
export function findSize(id) {
  return SIZES.find((s) => s.id === id) || SIZES[0];
}
export function findPhoto(id) {
  return PHOTOS.find((p) => p.id === id) || PHOTOS[0];
}

// Fresh default state. Panel crops are fixed so the first paint is
// deterministic; the UI shuffle is the only random path.
export function defaultState() {
  return {
    layout: 'hero',
    grade: 'sunset',
    size: 'square',
    caption: 'SUNSET HEIST',
    tagline: 'VICE CITY COVER STUDIO',
    selected: 0,
    panels: [
      { photo: 'pier', zoom: 1.25, dx: 0.0, dy: -0.03 },
      { photo: 'boulevard', zoom: 1.4, dx: 0.05, dy: 0.03 },
      { photo: 'pier', zoom: 1.15, dx: -0.04, dy: 0.0 },
      { photo: 'boulevard', zoom: 1.3, dx: 0.03, dy: -0.02 },
    ],
  };
}
