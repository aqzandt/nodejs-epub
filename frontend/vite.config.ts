// vite.config.ts
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        reader: resolve(__dirname, "reader.html"),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/books": "http://localhost:3000",
      "/book": "http://localhost:3000",
      "/save": "http://localhost:3000",
      "/load": "http://localhost:3000",
      "/upload": "http://localhost:3000",
    },
  },
});
