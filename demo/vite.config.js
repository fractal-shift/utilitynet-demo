import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    host: '127.0.0.1',
    proxy: {
      '/api/mock': {
        target: 'http://localhost:3101',
        changeOrigin: true,
      },
      '/scenario': {
        target: 'http://localhost:3101',
        changeOrigin: true,
      },
    },
  },
});
