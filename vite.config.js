import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API calls to the Express merchant server during development.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
