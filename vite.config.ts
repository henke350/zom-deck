import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { offlineApp } from './vite.pwa.ts'

// https://vite.dev/config/ and https://vitest.dev/config/
export default defineConfig({
  // offlineApp: installable on a tablet or phone, and playable without a network.
  plugins: [react(), offlineApp()],
  // Relative asset paths, so the built game works from any folder or link.
  base: './',
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
