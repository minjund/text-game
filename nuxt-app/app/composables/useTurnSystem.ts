import { ref, computed } from 'vue'

export interface TurnSystemState {
  currentTurns: number
  maxTurns: number
  lastTurnUseTime: number | null // 마지막으로 턴을 사용한 시간 (밀리초)
  lastRechargeCheckTime: number // 마지막으로 회복 체크한 시간
}

const TURN_RECHARGE_TIME = 60 * 60 * 1000 // 1시간 (밀리초)
const MAX_TURNS = 25
const STORAGE_KEY = 'turnSystemState'

export const useTurnSystem = () => {
  const currentTurns = ref<number>(MAX_TURNS)
  const lastTurnUseTime = ref<number | null>(null)
  const lastRechargeCheckTime = ref<number>(Date.now())

  // 다음 턴 회복까지 남은 시간 (밀리초)
  const timeUntilNextTurn = computed(() => {
    if (currentTurns.value >= MAX_TURNS) return null
    if (!lastTurnUseTime.value) return null

    const now = Date.now()
    const timeSinceLastUse = now - lastTurnUseTime.value

    // 다음 턴까지 남은 시간
    const timeForNextTurn = TURN_RECHARGE_TIME - (timeSinceLastUse % TURN_RECHARGE_TIME)

    return Math.max(0, timeForNextTurn)
  })

  // 전체 충전까지 남은 시간 (밀리초)
  const timeUntilFullRecharge = computed(() => {
    if (currentTurns.value >= MAX_TURNS) return null
    if (!lastTurnUseTime.value) return null

    const now = Date.now()
    const timeSinceLastUse = now - lastTurnUseTime.value
    const turnsToRecharge = MAX_TURNS - currentTurns.value

    // 전체 충전에 필요한 시간
    const timeNeededForFullRecharge = turnsToRecharge * TURN_RECHARGE_TIME

    // 이미 경과한 시간을 빼기
    const remainingTime = timeNeededForFullRecharge - timeSinceLastUse

    return Math.max(0, remainingTime)
  })

  // 다음 턴까지 남은 시간 포맷 (일, 시, 분, 초)
  const formattedTimeUntilNext = computed(() => {
    const time = timeUntilNextTurn.value
    if (time === null) return null

    const days = Math.floor(time / (1000 * 60 * 60 * 24))
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((time % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  })

  // 전체 충전까지 남은 시간 포맷 (일, 시, 분, 초)
  const formattedTimeUntilFull = computed(() => {
    const time = timeUntilFullRecharge.value
    if (time === null) return null

    const days = Math.floor(time / (1000 * 60 * 60 * 24))
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((time % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  })

  // 로컬스토리지에서 상태 로드
  const loadState = (): TurnSystemState | null => {
    if (!process.client) return null

    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    try {
      const state = JSON.parse(stored) as TurnSystemState
      return state
    } catch (e) {
      console.error('Failed to load turn system state:', e)
      return null
    }
  }

  // 로컬스토리지에 상태 저장
  const saveState = () => {
    if (!process.client) return

    const state: TurnSystemState = {
      currentTurns: currentTurns.value,
      maxTurns: MAX_TURNS,
      lastTurnUseTime: lastTurnUseTime.value,
      lastRechargeCheckTime: lastRechargeCheckTime.value
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  // 초기화
  const initializeState = () => {
    const savedState = loadState()

    if (savedState) {
      currentTurns.value = savedState.currentTurns
      lastTurnUseTime.value = savedState.lastTurnUseTime
      lastRechargeCheckTime.value = savedState.lastRechargeCheckTime

      // 로드 후 즉시 회복 체크
      recheckTurns()
    } else {
      // 처음 시작하는 경우 - 100턴으로 시작
      currentTurns.value = MAX_TURNS
      lastTurnUseTime.value = null
      lastRechargeCheckTime.value = Date.now()
      saveState()
    }
  }

  // 턴 회복 체크 (시간 경과에 따라)
  const recheckTurns = () => {
    if (currentTurns.value >= MAX_TURNS) {
      // 이미 최대 턴이면 회복 불필요
      lastTurnUseTime.value = null
      saveState()
      return
    }

    if (!lastTurnUseTime.value) return

    const now = Date.now()
    const timeSinceLastUse = now - lastTurnUseTime.value

    // 회복된 턴 수 계산
    const turnsRecovered = Math.floor(timeSinceLastUse / TURN_RECHARGE_TIME)

    if (turnsRecovered > 0) {
      // 턴 회복
      currentTurns.value = Math.min(MAX_TURNS, currentTurns.value + turnsRecovered)

      // 회복된 턴만큼 시간 업데이트
      lastTurnUseTime.value = lastTurnUseTime.value + (turnsRecovered * TURN_RECHARGE_TIME)

      // 최대 턴에 도달하면 lastTurnUseTime 초기화
      if (currentTurns.value >= MAX_TURNS) {
        lastTurnUseTime.value = null
      }

      lastRechargeCheckTime.value = now
      saveState()
    }
  }

  // 턴 사용
  const useTurn = (): boolean => {
    if (currentTurns.value <= 0) return false

    const now = Date.now()
    currentTurns.value -= 1

    // 첫 턴 사용이거나 최대 턴에서 사용하는 경우
    if (lastTurnUseTime.value === null || currentTurns.value === MAX_TURNS - 1) {
      lastTurnUseTime.value = now
    }

    lastRechargeCheckTime.value = now
    saveState()
    return true
  }

  // 모든 턴 즉시 충전 (디버그/치트용)
  const rechargeAllTurns = () => {
    currentTurns.value = MAX_TURNS
    lastTurnUseTime.value = null
    lastRechargeCheckTime.value = Date.now()
    saveState()
  }

  // 턴 추가 (보상 등으로)
  const addTurns = (amount: number) => {
    currentTurns.value = Math.min(MAX_TURNS, currentTurns.value + amount)

    if (currentTurns.value >= MAX_TURNS) {
      lastTurnUseTime.value = null
    }

    saveState()
  }

  // 상태 리셋
  const resetState = () => {
    if (process.client) {
      localStorage.removeItem(STORAGE_KEY)
      currentTurns.value = MAX_TURNS
      lastTurnUseTime.value = null
      lastRechargeCheckTime.value = Date.now()
      saveState()
    }
  }

  // 1초마다 턴 회복 체크
  if (process.client) {
    initializeState()
    setInterval(recheckTurns, 1000)
  }

  return {
    currentTurns,
    maxTurns: MAX_TURNS,
    timeUntilNextTurn,
    timeUntilFullRecharge,
    formattedTimeUntilNext,
    formattedTimeUntilFull,
    useTurn,
    addTurns,
    rechargeAllTurns,
    resetState,
    TURN_RECHARGE_TIME
  }
}
