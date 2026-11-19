// Entry build script for gta6-cover-art-01.
// Copies app/ and screenshots/ into the output directory, then asks the
// kit's dossier builder to write /output/dossier.json. Runs under the
// kit harness (bun/deno-style TS); output dir comes from
// MAKEFUN_OUTPUT_DIR, default /output.
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true, mode: 0o755 });

for (const folder of ['app', 'screenshots']) {
  const src = resolve(here, folder);
  if (existsSync(src)) {
    cpSync(src, join(outDir, folder), { recursive: true, force: true });
  }
}

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
