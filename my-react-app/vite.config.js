import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/user": "http://localhost:8000",
      "/doctor": "http://localhost:8000",
      "/appointment": "http://localhost:8000",
      "/notification": "http://localhost:8000",
      "/admin": "http://localhost:8000",
      "/uploads": "http://localhost:8000",
      "/api": "http://localhost:8000",
    },
    watch: {
      usePolling: true,
      interval: 100
    }
  }
})
