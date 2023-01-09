import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import StyledWindicss from 'vite-plugin-styled-windicss'
import windiCSS from 'vite-plugin-windicss'
import tsconfigPaths from 'vite-tsconfig-paths'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    windiCSS(),
    visualizer(),
    tsconfigPaths(),
    StyledWindicss(),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@client', replacement: path.resolve(__dirname, 'src') },
      { find: '@server', replacement: path.resolve(__dirname, 'src') },
      { find: /^~/, replacement: '' },
    ],
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '^/ephemeri*': {
        target: 'http://127.0.0.1:5555',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '^/satellite': {
        target: 'http://127.0.0.1:5555',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-venders': ['react', 'react-dom', '@vitjs/runtime'],
        },
      },
    },
  },
})
