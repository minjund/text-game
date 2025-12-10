import { ref } from 'vue'

type BGMType = 'main' | 'adventure' | 'battle' | 'base'

// Singleton pattern: ref를 함수 외부에 선언하여 모든 컴포넌트가 같은 인스턴스 공유
const currentBGM = ref<HTMLAudioElement | null>(null)
const currentType = ref<BGMType | null>(null)

const bgmFiles: Record<BGMType, string> = {
  main: '/bgm/main_song.mp3',
  adventure: '/bgm/adventure_song.mp3',
  battle: '/bgm/battle_song.mp3',
  base: '/bgm/baseBgm.mp3'
}

export const useBGM = () => {

  const playBGM = (type: BGMType, options: { loop?: boolean; volume?: number } = {}) => {
    if (!process.client) return

    console.log(`[BGM] Attempting to play: ${type}, current: ${currentType.value}`)

    // Don't replay if same type is already playing
    if (currentType.value === type && currentBGM.value && !currentBGM.value.paused) {
      console.log(`[BGM] Already playing ${type}, skipping`)
      return
    }

    // Stop and cleanup current BGM (different type)
    if (currentBGM.value) {
      console.log(`[BGM] Stopping current BGM: ${currentType.value}`)
      try {
        currentBGM.value.pause()
        currentBGM.value.currentTime = 0
      } catch (e) {
        console.warn('[BGM] Error stopping current BGM:', e)
      }
      currentBGM.value = null
    }

    // Create and play new BGM
    const audio = new Audio(bgmFiles[type])
    audio.loop = options.loop ?? true
    audio.volume = options.volume ?? 0.3

    // 즉시 상태 업데이트 (동기적으로)
    currentBGM.value = audio
    currentType.value = type

    // 재생 시도
    audio.play()
      .then(() => {
        console.log(`[BGM] Successfully playing: ${type}`)
      })
      .catch((error) => {
        console.warn(`[BGM] Autoplay prevented for ${type}:`, error)
        // 사용자 interaction 후 재생되도록 대기
      })
  }

  const stopBGM = () => {
    if (!process.client) return

    console.log(`[BGM] Stopping all BGM, current: ${currentType.value}`)

    if (currentBGM.value) {
      try {
        currentBGM.value.pause()
        currentBGM.value.currentTime = 0
      } catch (e) {
        console.warn('[BGM] Error stopping BGM:', e)
      }
      currentBGM.value = null
      currentType.value = null
    }
  }

  const pauseBGM = () => {
    if (currentBGM.value) {
      currentBGM.value.pause()
    }
  }

  const resumeBGM = () => {
    if (currentBGM.value) {
      currentBGM.value.play().catch((error) => {
        console.warn('BGM resume failed:', error)
      })
    }
  }

  const setVolume = (volume: number) => {
    if (currentBGM.value) {
      currentBGM.value.volume = Math.max(0, Math.min(1, volume))
    }
  }

  return {
    playBGM,
    stopBGM,
    pauseBGM,
    resumeBGM,
    setVolume,
    currentType
  }
}
