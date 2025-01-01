import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '.vite/renderer/main_window',
    emptyOutDir: true,
    sourcemap: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/UI/styles/_variables.scss";
        ` // optional: global imports
      }
    }
  }
});
