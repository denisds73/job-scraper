import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['esm'],
  dts: false, // Not needed for CLI application
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'node20',
});
