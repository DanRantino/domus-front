import path from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '#': path.resolve(rootDir, './src'),
      '@': path.resolve(rootDir, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['web.domus.dev','domus-front-preprod.up.railway.app','domus-front-prod.up.railway.app'],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/auth': { target: 'http://127.0.0.1:5000' },
      '/Callback': { target: 'http://127.0.0.1:5000' },
      '/SignedOutCallback': { target: 'http://127.0.0.1:5000' },
    },
  },
})
