import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@voidlink/core': resolve(__dirname, '../../libs/core/src/index.ts'),
      '@voidlink/ui': resolve(__dirname, '../../libs/ui/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
