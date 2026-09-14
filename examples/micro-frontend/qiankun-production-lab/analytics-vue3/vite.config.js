import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import qiankun from 'vite-plugin-qiankun'

export default defineConfig({
  server: {
    cors: true,
    host: '0.0.0.0',
    port: 7204,
  },
  plugins: [vue(), qiankun('analytics-vue3', { useDevMode: true })],
})
