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
      '@config': path.resolve(__dirname, './src/config'),
      '@useZustand': path.resolve(__dirname, './src/api/zustand/useZustand'),
      '@services': path.resolve(__dirname, './src/api/services'),
      '@actions': path.resolve(__dirname, './src/api/actions'),
      '@query': path.resolve(__dirname, './src/api/reactQuery'),
    },
  },
  server: {
    port: 4200,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
