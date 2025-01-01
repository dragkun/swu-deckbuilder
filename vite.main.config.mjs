import { defineConfig } from 'vite';
import path from 'path';
import { builtinModules } from 'module';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      formats: ['cjs'],
    },
    rollupOptions: {
      external: [
        'electron',
        ...builtinModules,
        ...builtinModules.map(m => `node:${m}`),
        'path',
        'fs/promises',
        'crypto'
      ],
      output: {
        entryFileNames: '[name].js',
      }
    },
    outDir: '.vite/build',
    emptyOutDir: false,
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});
