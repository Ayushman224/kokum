import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' so the build can be hosted from any sub-path (static host, CDN, artifact).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
