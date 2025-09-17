import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    proxy: {
      '/api/server-status': {
        target: 'https://api.mcstatus.io',
        changeOrigin: true,
        rewrite: (path) => {
          // Convert /api/server-status?ip=play.xrcraftmc.com to /v2/status/java/play.xrcraftmc.com
          const url = new URL(`http://localhost${path}`)
          const ip = url.searchParams.get('ip')
          return `/v2/status/java/${ip}`
        }
      }
    }
  }
})