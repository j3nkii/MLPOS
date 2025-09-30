import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // '@': path.resolve(__dirname, './src'), // now `@` points to `src`
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@useStateManager': path.resolve(__dirname, './src/state/useStateManager'),
    },
  },
  server: {
    port: 4200, // your frontend port
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // your Node server
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
