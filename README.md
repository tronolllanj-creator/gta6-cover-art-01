# VICE CITY COVER STUDIO <!-- tuned -->

A GTA-style cover maker web app built with plain ES modules. No build step, no libraries, no network requests. All assets are local and deterministic.

## Features

- **Layouts**: Hero (full-bleed), Duo (two panels), Triptych (wide top + two bottom), Grid (four equal panels)
- **Grades**: Sunset (warm overlay), Neon (duotone glow), Noir (grayscale high-contrast), Vice (teal/pink split)
- **Export Sizes**: Square (1080x1080), Portrait (1080x1350), Wide (1920x1080)
- **Panels**: Independent photo selection, zoom (1.0-2.5), and position offsets (dx/dy -0.5 to 0.5)
- **Captioning**: Heavy system sans-serif lettering with ink stroke and gold rule
- **Shuffle**: Random layout + grade combination
- **Screenshot Mode**: Deterministic rendering via URL parameters

## Getting Started

Run the local server:

```bash
node serve.ts
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Screenshot Staging

Use URL query parameters for deterministic captures:

- `?shot=cover` — Hide editor chrome, render cover full-frame
  - Optional: `&photo=pier|boulevard`, `&caption=TEXT`
- `?shot=editor` — Show full editor with default state (pier photo, preset caption)

Both modes set `window.__shotReady` when rendering is complete. Set `window.__shotError` on failure. No randomness in shot mode.

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| ink | `#0d0d12` | Text stroke, shadows |
| paper | `#f5efe4` | Background |
| sunset1 | `#ff7a18` | Sunset grade primary |
| sunset2 | `#ff2d78` | Sunset grade secondary |
| neonPink | `#ff2bd6` | Neon grade, accents |
| neonCyan | `#22e6ff` | Neon grade, highlights |
| gold | `#ffc93c` | Rules, emphasis |
| panel | `#17171f` | UI panels |
| muted | `#9a9aad` | Secondary text |
| line | `#2a2a38` | Borders |

## Technical Notes

- **Typography**: Heavy system sans-serif stack (Arial Black / Helvetica bold). No external font files. Original lettering, not a copy of any commercial game or artwork.
- **Images**: Only `app/samples/pier.jpg` and `app/samples/boulevard.jpg` (kit-provided, free to use). No other images.
- **Cover Engine**: `drawCover(ctx, images, state, W, H)` in `src/cover.js`. Handles cover-fit crop, grade overlays (per-overlay `globalCompositeOperation`), vignette, and caption rendering. Works on any canvas size.
- **State**: `{ photo, zoom, dx, dy }` per panel, plus `layout`, `grade`, `size`, `caption` (default "SUNSET HEIST"), `tagline` (default "VICE CITY COVER STUDIO")
- **Export**: Offscreen canvas at exact export dimensions, downloads as `<caption>-<size>.png`
- **Code Style**: ES modules only. No imports except `./src` files. No `fetch`, no network. Short comments, no dead code, no duplicated blocks. No `Date` or `Math.random` in cover engine (UI shuffle may use `Math.random`).

## File Structure

```
app/
├── index.html
├── style.css
├── serve.ts
└── src/
    ├── main.js
    ├── cover.js
    ├── presets.js
    ├── shots.js
    └── samples/
        ├── pier.jpg
        └── boulevard.jpg
```

## Legal

Original tool. Never a copy of any commercial game or artwork. No Rockstar logos, artwork, or fonts. All lettering uses system fonts only.

## Badges

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

[![rank](https://make.fun/badge/gta6-cover-art-01/tronolllanj-creator/gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

[![reward](https://make.fun/badge/gta6-cover-art-01/tronolllanj-creator/gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

---

[Join via referral](https://make.fun/r/3bm3ytwk)
