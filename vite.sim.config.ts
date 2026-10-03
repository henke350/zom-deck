import { defineConfig } from 'vite'

// Builds the simulator (src/sim) into one Node script: `npm run sim` and `npm run fuzz`.
export default defineConfig({
  publicDir: false,
  logLevel: 'warn',
  build: {
    ssr: 'src/sim/main.ts',
    outDir: '.sim',
    emptyOutDir: true,
    target: 'node22',
  },
})
