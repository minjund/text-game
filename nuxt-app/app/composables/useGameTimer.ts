import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface TimerConfig {
  totalSeconds: number
  onTick?: (remainingSeconds: number) => void
  onComplete?: () => void
  autoStart?: boolean
}

export const useGameTimer = (config: TimerConfig) => {
  const remainingSeconds = ref(config.totalSeconds)
  const isRunning = ref(false)
  const isPaused = ref(false)
  let intervalId: number | null = null

  // 시간 포맷팅
  const formattedTime = computed(() => {
    const seconds = remainingSeconds.value
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (days > 0) {
      return `${days}일 ${hours}시간 ${minutes}분`
    }
    if (hours > 0) {
      return `${hours}시간 ${minutes}분 ${secs}초`
    }
    if (minutes > 0) {
      return `${minutes}분 ${secs}초`
    }
    return `${secs}초`
  })

  // 진행률 (퍼센트)
  const progress = computed(() => {
    const elapsed = config.totalSeconds - remainingSeconds.value
    return (elapsed / config.totalSeconds) * 100
  })

  // 타이머 시작
  const start = () => {
    if (isRunning.value) return

    isRunning.value = true
    isPaused.value = false

    intervalId = window.setInterval(() => {
      if (remainingSeconds.value > 0) {
        remainingSeconds.value--

        // 틱 콜백 실행
        if (config.onTick) {
          config.onTick(remainingSeconds.value)
        }

        // 완료 체크
        if (remainingSeconds.value === 0) {
          stop()
          if (config.onComplete) {
            config.onComplete()
          }
        }
      }
    }, 1000)
  }

  // 타이머 정지
  const stop = () => {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    isRunning.value = false
    isPaused.value = false
  }

  // 타이머 일시정지
  const pause = () => {
    if (!isRunning.value) return

    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    isRunning.value = false
    isPaused.value = true
  }

  // 타이머 재개
  const resume = () => {
    if (!isPaused.value) return
    start()
  }

  // 타이머 리셋
  const reset = (newTotalSeconds?: number) => {
    stop()
    remainingSeconds.value = newTotalSeconds ?? config.totalSeconds
  }

  // 시간 추가
  const addTime = (seconds: number) => {
    remainingSeconds.value += seconds
    if (remainingSeconds.value < 0) {
      remainingSeconds.value = 0
    }
  }

  // 시간 차감
  const subtractTime = (seconds: number) => {
    addTime(-seconds)
  }

  // 자동 시작
  onMounted(() => {
    if (config.autoStart) {
      start()
    }
  })

  // 정리
  onUnmounted(() => {
    stop()
  })

  return {
    remainingSeconds,
    formattedTime,
    progress,
    isRunning,
    isPaused,
    start,
    stop,
    pause,
    resume,
    reset,
    addTime,
    subtractTime
  }
}
