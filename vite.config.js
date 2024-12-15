import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  root: './',
  plugins: [
    react(),
    cssInjectedByJsPlugin()
  ],
  build: {
    rollupOptions: {
      external: [],
    },
  },
});
