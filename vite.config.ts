import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    target: 'es2022'
  },
  root: 'public',
  build: {
    outDir: 'js',
    assetsDir: 'js',
    target: 'es2022',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        reader: '/ts/reader.ts',
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: `js/[name].js`,
      }
    },
  },
});