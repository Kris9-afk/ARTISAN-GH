import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'brand-photo.svg'],
        manifest: {
          id: '/',
          name: 'ARTISAN-GH | Ghana Artisan Marketplace',
          short_name: 'ARTISAN-GH',
          description: 'Find and contact local artisans across Ghana.',
          theme_color: '#0b3d2e',
          background_color: '#fff8ec',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          categories: ['shopping', 'lifestyle'],
          icons: [
            { src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          navigateFallbackDenylist: [/^\/api\//],
          runtimeCaching: [
            {
              urlPattern: /\/images\/.*\.(?:png|jpe?g|webp)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'public-images',
                expiration: {
                  maxEntries: 40,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                },
              },
            },
          ],
        },
      }),
    ],
    root: 'frontend',
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    preview: {
      allowedHosts: ['artisan-gh.onrender.com'],
      proxy: {},
    },
    envPrefix: 'VITE_',
})
