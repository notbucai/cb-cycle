import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  base: '/cycle/',
  server: {
    port: 9910,
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:9911',
        changeOrigin: true,
      },
    }
  }
})
