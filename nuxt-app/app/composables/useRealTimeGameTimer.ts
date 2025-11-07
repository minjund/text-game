import { ref, computed } from 'vue'

export interface RemainingTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export interface InvasionTracker {
  [week: number]: boolean // 각 주차의 침략 발생 여부
}

const GAME_DURATION_DAYS = 42 // 6주
const DAYS_PER_WEEK = 7

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

const getInvasionTracker = (): InvasionTracker => {
  if (process.client) {
    const stored = localStorage.getItem('invasionTracker')
    if (stored) {
      return JSON.parse(stored)
    }
  }
  return {}
}

const saveInvasionTracker = (tracker: InvasionTracker) => {
  if (process.client) {
    localStorage.setItem('invasionTracker', JSON.stringify(tracker))
  }
}

export const useRealTimeGameTimer = () => {
  const gameStartTime = ref<Date>(getGameStartTime())
  const invasionTracker = ref<InvasionTracker>(getInvasionTracker())

  const gameEndTime = computed(() => {
    const end = new Date(gameStartTime.value)
    end.setDate(end.getDate() + GAME_DURATION_DAYS)
    return end
  })

  // 현재 주차 계산 (1주차부터 시작)
  const currentWeek = computed(() => {
    const now = new Date()
    const elapsed = now.getTime() - gameStartTime.value.getTime()
    const elapsedDays = Math.floor(elapsed / (1000 * 60 * 60 * 24))
    const week = Math.floor(elapsedDays / DAYS_PER_WEEK) + 1
    return week
  })

  // 경과일 계산
  const elapsedDays = computed(() => {
    const now = new Date()
    const elapsed = now.getTime() - gameStartTime.value.getTime()
    return Math.floor(elapsed / (1000 * 60 * 60 * 24))
  })

  // 현재 주차에 침략이 발생해야 하는지 확인
  const shouldInvadeThisWeek = computed(() => {
    const week = currentWeek.value
    // 1주차부터 6주차까지 (7일, 14일, 21일, 28일, 35일, 42일)
    if (week >= 1 && week <= 6) {
      return !invasionTracker.value[week] // 아직 발생하지 않았으면 true
    }
    return false
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

  // 침략 발생 기록
  const markInvasionOccurred = (week: number) => {
    invasionTracker.value[week] = true
    saveInvasionTracker(invasionTracker.value)
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
    GAME_DURATION_DAYS,
    currentWeek,
    elapsedDays,
    shouldInvadeThisWeek,
    markInvasionOccurred,
    invasionTracker
  }
}
