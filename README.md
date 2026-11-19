# VICE CITY COVER STUDIO

A retro cover maker for the **gta6-cover-art-01** bounty ("Make GTA 6 Cover Art", $250, escrowed). Pick a photo, a layout and a colour grade, crop each panel, add a caption, and export a print-ready cover at 1080×1080, 1080×1350 or 1920×1080. Plain ES modules, no build step, no libraries, no network — every asset is local.

## What it does

- **Layouts** — Hero (one full-bleed panel), Duo (two panels), Triptych (wide top + two below), Grid (four equal panels)
- **Grades** — Sunset (warm orange/pink wash), Neon (magenta/cyan glow), Noir (desaturated, high contrast), Vice (teal/orange split)
- **Panels** — each panel picks its own photo, zoom (1.0–2.5) and crop offsets (dx/dy −0.5…0.5)
- **Captioning** — heavy system lettering with an ink outline, drop shadow, tagline and a gold rule
- **Export** — one click renders the cover offscreen at the chosen export size and downloads it as PNG
- **Shuffle** — random layout + grade for a quick new look

## Try it

```bash
node serve.ts          # serves app/ on http://localhost:8080
```

Open the page, tweak the controls on the left, and watch the preview update live.

## Deterministic screenshots

The app supports a shot mode for reproducible captures:

- `?shot=cover` — hides all chrome and paints the cover edge to edge
- `?shot=editor` — keeps the editor visible, photo loaded in the preview
- Add `&photo=pier|boulevard` to force every panel to one photo, and `&caption=TEXT` to set the caption

Either mode sets `window.__shotReady` when the frame is painted, and `window.__shotError` on failure. Shot mode never uses randomness. The four captures are listed in `shots.json`.

## How the cover is drawn

`app/src/cover.js` exports `drawCover(ctx, images, state, W, H)`:

1. Each layout panel is painted cover-fit from its photo, zoomed and panned per panel.
2. White frame lines separate the panels.
3. The grade's colour washes are layered with canvas blend modes, then a radial vignette darkens the edges.
4. The caption block is drawn last: tagline with letter spacing, a gold rule, then the big title with an ink stroke and shadow.

State lives in `app/src/presets.js` (`SIZES`, `LAYOUTS`, `GRADES`, `PHOTOS`, `defaultState()`); the editor in `app/src/main.js` wires the toolbar to that state.

## Files

```
app/
├── index.html          # editor shell
├── style.css           # dark studio theme
├── samples/
│   ├── pier.jpg        # kit photo
│   └── boulevard.jpg   # kit photo
└── src/
    ├── main.js         # editor state + toolbar wiring
    ├── cover.js        # cover renderer
    ├── presets.js      # sizes, layouts, grades, photos
    └── shots.js        # ?shot= staging
main.ts                 # build script: copies app/ + screenshots/, writes dossier.json
shots.json              # the four screenshot captures
serve.ts                # tiny local static server (kit)
vendor/makefun-app.ts   # kit dossier builder (do not edit)
```

## Notes

- **Typography**: system sans-serif stack only (Arial Black / Helvetica). No downloaded fonts.
- **Images**: only the two kit photos under `app/samples/`. No other artwork.
- **Originality**: an original cover-making tool. No Rockstar logos, artwork, fonts or game assets are used anywhere.

## Badges

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

[![rank](https://make.fun/badge/gta6-cover-art-01/tronolllanj-creator/gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

[![reward](https://make.fun/badge/gta6-cover-art-01/tronolllanj-creator/gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

---

[Join via referral](https://make.fun/r/3bm3ytwk)
