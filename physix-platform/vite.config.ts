import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@content': path.resolve(__dirname, './src/content'),
      '@experiments': path.resolve(__dirname, './src/experiments'),
      '@physics-rapier': path.resolve(__dirname, './src/physics-rapier'),
      '@rendering': path.resolve(__dirname, './src/rendering'),
      '@services': path.resolve(__dirname, './src/services'),
      '@simulation-core': path.resolve(__dirname, './src/simulation-core'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  }
})
