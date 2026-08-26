import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Relative asset paths make the build work on any GitHub Pages repository
  // name, as well as on a custom domain.
  base: './',

  optimizeDeps: {
    exclude: ['maplibre-gl']
  },

  build: {
    chunkSizeWarningLimit: 7000,
    rollupOptions: {
      input: {
        main: resolve(currentDirectory, 'index.html'),
        map: resolve(currentDirectory, 'map/index.html')
      }
    }
  }
});
