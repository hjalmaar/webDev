// vite.config.js
import {resolve} from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // List your html files here, e.g:
        index: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'start-api-harjoituspohja.html'),
      },
    },
  },
  // Public base path could be set here too:
  base: '/api/',
});