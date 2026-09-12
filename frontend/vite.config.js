import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BIS Sahayak AI - frontend build config
// Dev server proxies /api requests to the FastAPI backend so the browser
// never needs CORS wrangling during local development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
