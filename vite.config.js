import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'LifeQuest',
        short_name: 'LifeQuest',
        description: 'LifeQuest — habit-building RPG',
        theme_color: '#0f172a',
        background_color: '#071124',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-180.png', sizes: '180x180', type: 'image/png' }
        ]
      },
      workbox: { cleanupOutdatedCaches: true }
    })
  ]
})
