import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'server'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**'],
      exclude: ['src/types/**', 'src/data/**'],
    },
    testTimeout: 30000,
  },
});
