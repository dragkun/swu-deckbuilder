import { defineConfig } from 'vite';
import { builtinModules } from 'module';

export default defineConfig({
  build: {
    outDir: '.vite/build',
    lib: {
      entry: 'src/preload.js',
      formats: ['cjs'],
      fileName: () => 'preload.js',
    },
    rollupOptions: {
      external: [
        'electron',
        ...builtinModules,
      ],
    },
    emptyOutDir: false,
    sourcemap: false,
  },
});
