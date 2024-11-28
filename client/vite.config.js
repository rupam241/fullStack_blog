import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,  // Add this line
        secure: false,
        // Optionally you can add ws: true if you're using WebSocket
      }
    }
  },
  plugins: [react()],
})
