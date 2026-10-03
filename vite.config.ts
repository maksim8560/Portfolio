import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Base относительный: сайт живёт и в подпапке (/Portfolio/ на Pages),
// и в корне (Vercel). Относительные пути работают везде.
export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
})
