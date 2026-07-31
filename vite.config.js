import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function normalizedBase(value) {
  const base = String(value || '/').trim();
  if (!base || base === '/') return '/';
  return `/${base.replace(/^\/+|\/+$/g, '')}/`;
}

export default defineConfig({
  base: normalizedBase(process.env.VITE_BASE_PATH),
  plugins: [react()],
  optimizeDeps: {
    // Monaco is already distributed as ESM and is loaded only inside the
    // practice editor route. Let Vite transform its selected modules directly.
    exclude: ['monaco-editor', '@monaco-editor/react'],
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': 'http://127.0.0.1:8787',
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    exclude: ['server/**', 'node_modules/**', 'build/**'],
    restoreMocks: true,
    clearMocks: true,
    css: true,
  },
});
