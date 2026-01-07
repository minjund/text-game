import { ref, computed } from 'vue'

export interface RemainingTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
  totalElapsedDays: number // 경과한 총 일수
  hasReached4Days: boolean // 4일 경과 여부
  hasReached8Days: boolean // 8일 경과 여부
}

// 테스트 모드: true면 60초(1분)로 테스트, false면 실제 12일
const TEST_MODE = true
const GAME_DURATION_DAYS = TEST_MODE ? 60 / (60 * 60 * 24) : 12 // TEST: 60초, REAL: 12일

const getGameStartTime = (): Date => {
  if (process.client) {
    const stored = localStorage.getItem('gameStartTime')
    if (stored) {
      return new Date(stored)
    } else {
      const now = new Date()
      localStorage.setItem('gameStartTime', now.toISOString())
      return now
    }
  }
  return new Date()
}

export const useRealTimeGameTimer = () => {
  const gameStartTime = ref<Date>(getGameStartTime())

  const gameEndTime = computed(() => {
    const end = new Date(gameStartTime.value)
    end.setDate(end.getDate() + GAME_DURATION_DAYS)
    return end
  })

  const remainingTime = ref<RemainingTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    totalElapsedDays: 0,
    hasReached4Days: false,
    hasReached8Days: false
  })

  const updateRemainingTime = () => {
    const now = new Date()
    const diff = gameEndTime.value.getTime() - now.getTime()

    // 경과한 총 시간 계산
    const elapsedMs = now.getTime() - gameStartTime.value.getTime()
    const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24)

    // 테스트 모드: 실제 시간을 일수로 변환
    // 60초를 12일로 환산 -> 20초 = 4일, 40초 = 8일, 60초 = 12일
    const elapsedSeconds = elapsedMs / 1000
    const testElapsedDays = TEST_MODE ? (elapsedSeconds / 60) * 12 : elapsedDays

    // 디버깅 로그 (10초마다)
    if (TEST_MODE && Math.floor(elapsedSeconds) % 10 === 0 && Math.floor(elapsedSeconds) > 0) {
      console.log(`⏰ [타이머] 경과: ${Math.floor(elapsedSeconds)}초 / ${testElapsedDays.toFixed(1)}일 (4일 도달: ${testElapsedDays >= 4}, 8일 도달: ${testElapsedDays >= 8})`)
    }

    if (diff <= 0) {
      remainingTime.value = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        totalElapsedDays: GAME_DURATION_DAYS,
        hasReached4Days: true,
        hasReached8Days: true
      }
      return
    }

    remainingTime.value = {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      isExpired: false,
      totalElapsedDays: testElapsedDays,
      hasReached4Days: testElapsedDays >= 4,
      hasReached8Days: testElapsedDays >= 8
    }
  }

  // 1초마다 시간 업데이트
  if (process.client) {
    updateRemainingTime()
    setInterval(updateRemainingTime, 1000)
  }

  return {
    gameStartTime,
    gameEndTime,
    remainingTime,
    updateRemainingTime,
    GAME_DURATION_DAYS
  }
}
