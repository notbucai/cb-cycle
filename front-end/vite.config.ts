import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/cycle/',
  server: {
    port: 9910,
    host: 'localhost',
  }
})
