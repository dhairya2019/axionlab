import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// vite.config.js (the other copy) should be deleted — Vite loads only one config
// and the .ts version takes priority, but having two is confusing and error-prone.

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React into its own chunk so it's cached separately
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
  // Explicitly tell Vite where CSS lives (belt-and-suspenders)
  css: {
    devSourcemap: false,
  },
});
