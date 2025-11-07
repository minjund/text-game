// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@tresjs/nuxt', '@nuxtjs/tailwindcss'],

  // Phaser와 Three.js를 클라이언트 사이드에서만 로드
  vite: {
    optimizeDeps: {
      include: ['phaser']
    },
    ssr: {
      noExternal: ['phaser']
    },
    server: {
      hmr: {
        clientPort: process.env.HMR_PORT ? parseInt(process.env.HMR_PORT) : undefined,
        protocol: process.env.HMR_PROTOCOL || 'ws'
      },
      allowedHosts: [
        '.ngrok-free.app',
        '.ngrok.io',
        'localhost',
        '127.0.0.1'
      ]
    }
  },

  // SSR 비활성화 (게임이므로 클라이언트 전용)
  ssr: false
})
