import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    base: '/MySite/', 
    open: true
  },
  build: {
    outDir: 'build',
    sourcemap: true
  }
})