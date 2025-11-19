import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Göreceli yol kullanımı Netlify'da 404 hatalarını önler
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  }
});