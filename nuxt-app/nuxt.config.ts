// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],

  // SSR 비활성화 (게임이므로 클라이언트 전용)
  ssr: false,

  // GitHub Pages 배포 설정
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/text-game/' : '/', // 개발: '/', 배포: '/text-game/'
    buildAssetsDir: 'assets',
  },

  // 정적 사이트 생성 설정
  nitro: {
    preset: 'static',
    compressPublicAssets: true,
  },


  // 빌드 최적화
  vite: {
    build: {
      // 청크 크기 경고 제한 (KB)
      chunkSizeWarningLimit: 1000,

      // Rollup 옵션으로 코드 스플리팅 개선
      rollupOptions: {
        output: {
          manualChunks: {
            // Vue 관련 라이브러리를 별도 청크로 분리
            'vue-vendor': ['vue', 'vue-router'],

            // 게임 composable을 그룹화
            'game-composables': [
              './app/composables/useGameKingdom',
              './app/composables/useGamePassiveCards',
              './app/composables/useBattleSystem',
              './app/composables/useEventSystem',
              './app/composables/useSynergyCards',
              './app/composables/useAdventureSystem',
              './app/composables/useActiveCards',
              './app/composables/useGameReincarnation',
              './app/composables/useTutorial',
            ],
          },
          // 더 작은 청크로 분할
          experimentalMinChunkSize: 10000,
        },
      },

      // CSS 코드 스플리팅
      cssCodeSplit: true,

      // 압축 최적화
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // production에서 console.log 제거
          drop_debugger: true,
        },
      },
    },

    // 개발 서버 설정
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
    },

    // 최적화 옵션
    optimizeDeps: {
      include: [
        'vue',
        'vue-router'
      ],
    },
  },

  // PWA 설정
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Kingdom Wars',
      short_name: 'Kingdom Wars',
      description: '42일 안에 아카샤 제국을 정복하는 왕국 경영 전략 게임',
      theme_color: '#000000',
      background_color: '#000000',
      display: 'standalone', // 주소창 숨김
      orientation: 'portrait',
      scope: '/text-game/',
      start_url: '/text-game/',
      icons: [
        {
          src: '/text-game/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/text-game/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: '/text-game/',
      globPatterns: ['**/*.{js,css,html,svg,ico}'],
      // 큰 이미지 파일과 비디오는 런타임 캐싱으로 처리
      globIgnores: ['**/images/**/*.png', '**/images/**/*.jpg', '**/images/**/*.mp4'],
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB로 증가
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\/images\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30일
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },
})
