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
    // L6 — Manual chunking. Three.js + topojson-client are heavy and only
    // needed once the player has interacted enough to load the relevant
    // screen. Splitting them into their own chunks lets the initial paint
    // ship without them and keeps the main bundle smaller.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          'three-postprocessing': [
            'three/examples/jsm/postprocessing/EffectComposer.js',
            'three/examples/jsm/postprocessing/RenderPass.js',
            'three/examples/jsm/postprocessing/UnrealBloomPass.js',
          ],
          topojson: ['topojson-client'],
          framer: ['framer-motion'],
          react: ['react', 'react-dom'],
          i18n: ['i18next', 'react-i18next'],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
})
