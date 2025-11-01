/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['node_modules', 'lib'],
    setupFiles: [],
    globals: {
      describe: 'vitest/describe',
      it: 'vitest/it',
      test: 'vitest/test',
      expect: 'vitest/expect',
      beforeEach: 'vitest/beforeEach',
      afterEach: 'vitest/afterEach',
      beforeAll: 'vitest/beforeAll',
      afterAll: 'vitest/afterAll'
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'lib/',
        'coverage/',
        '**/*.test.ts',
        '**/*.spec.ts'
      ],
    },
  },
  esbuild: {
    target: 'es2020',
  },
});