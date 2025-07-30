import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'
import manifest from './public/manifest.json'

export default defineConfig({
  plugins: [react(), tsconfigPaths(), crx({ manifest })],
})