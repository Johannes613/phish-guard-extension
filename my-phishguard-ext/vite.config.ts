// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths' // <-- Import this
import manifest from './public/manifest.json'

export default defineConfig({
  // Add tsconfigPaths() to the plugins array
  plugins: [react(), tsconfigPaths(), crx({ manifest })],
})