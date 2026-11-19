import { mkdirSync, cpSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const here = dirname(fileURLToPath(import.meta.url));
const srcBase = resolve(here, 'app');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true, mode: 0o755 });

if (existsSync(srcBase)) {
  cpSync(srcBase, join(outDir, 'app'), {
    recursive: true,
    force: true,
    errorOnExist: false,
  });
}

const shotBase = resolve(here, 'screenshots');
if (existsSync(shotBase)) {
  cpSync(shotBase, join(outDir, 'screenshots'), {
    recursive: true,
    force: true,
    errorOnExist: false,
  });
}

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: {
    max: 4,
    max_bytes: 262144
  },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000
});
writeFileSync(join(outDir, 'dossier.json'), dossier); // tuned