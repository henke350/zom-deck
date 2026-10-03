import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/ and https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative asset paths, so the built game works from any folder or link.
  base: './',
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
