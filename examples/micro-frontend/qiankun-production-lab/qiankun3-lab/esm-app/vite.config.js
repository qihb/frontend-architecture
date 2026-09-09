import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 7301,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
})
