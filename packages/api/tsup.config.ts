import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  dts: false, // Not needed for application code
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'node20',
  outDir: 'dist',
  skipNodeModulesBundle: true,
  noExternal: [/^(?!@prisma|@jobscout).*/], // Bundle everything except prisma and shared
});
