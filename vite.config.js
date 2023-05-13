import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // proxy API requests to a different port or hostname
      '/api': 'http://192.168.101.6:8001'
    }
  }
})
