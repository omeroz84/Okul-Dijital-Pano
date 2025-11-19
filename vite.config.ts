import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Netlify için root path kullanmak daha güvenlidir
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  }
});