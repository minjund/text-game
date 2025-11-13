import { ref, computed } from 'vue'

export interface RemainingTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

const GAME_DURATION_DAYS = 42 // 6주

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
    isExpired: false
  })

  const updateRemainingTime = () => {
    const now = new Date()
    const diff = gameEndTime.value.getTime() - now.getTime()

    if (diff <= 0) {
      remainingTime.value = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true
      }
      return
    }

    remainingTime.value = {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      isExpired: false
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
