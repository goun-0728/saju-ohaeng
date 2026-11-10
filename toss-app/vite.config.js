import { defineConfig } from 'vite';

import aitDevtools from "@apps-in-toss/devtools/unplugin";

export default defineConfig({
  plugins: [aitDevtools.vite()],
  build: { outDir: 'dist', target: 'es2019' }
});
