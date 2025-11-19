import { ref } from 'vue'
import type { Battle, BattleLog, General } from '../types/game'

// 실시간 전투 시스템 (0.6초마다 단락씩 노출 - 읽기 편하게)
export const useRealtimeBattle = () => {
  const isBattleRunning = ref(false)
  const isPaused = ref(false)
  const currentTurnIndex = ref(0)
  const battleInterval = ref<any>(null)
  const allBattleLogs = ref<BattleLog[]>([]) // 미리 생성된 전체 로그

  // 전투 시작
  const startRealtimeBattle = (battle: Battle, allLogs: BattleLog[]) => {
    // 초기화
    isBattleRunning.value = true
    currentTurnIndex.value = 0
    allBattleLogs.value = allLogs
    battle.log = [] // 로그 초기화

    // 0.6초마다 로그 하나씩 추가 (읽기 편하게)
    battleInterval.value = setInterval(() => {
      if (currentTurnIndex.value >= allBattleLogs.value.length) {
        stopBattle()
        return
      }

      // 다음 로그 추가
      const nextLog = allBattleLogs.value[currentTurnIndex.value]
      battle.log.push(nextLog)
      currentTurnIndex.value++

      // 부드럽게 스크롤 아래로
      setTimeout(() => {
        const container = document.querySelector('.overflow-y-auto')
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          })
        }
      }, 50)
    }, 600) // 0.6초 - 읽기 편한 속도
  }

  // 전투 중지
  const stopBattle = () => {
    if (battleInterval.value) {
      clearInterval(battleInterval.value)
      battleInterval.value = null
    }
    isBattleRunning.value = false
    isPaused.value = false
  }

  // 전투 일시정지
  const pauseBattle = () => {
    if (battleInterval.value) {
      clearInterval(battleInterval.value)
      battleInterval.value = null
    }
    isPaused.value = true
  }

  // 전투 재개
  const resumeBattle = (battle: Battle) => {
    if (!isPaused.value || !isBattleRunning.value) return

    isPaused.value = false

    // 0.6초마다 로그 하나씩 추가 (재개)
    battleInterval.value = setInterval(() => {
      if (currentTurnIndex.value >= allBattleLogs.value.length) {
        stopBattle()
        return
      }

      // 다음 로그 추가
      const nextLog = allBattleLogs.value[currentTurnIndex.value]
      battle.log.push(nextLog)
      currentTurnIndex.value++

      // 부드럽게 스크롤 아래로
      setTimeout(() => {
        const container = document.querySelector('.overflow-y-auto')
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          })
        }
      }, 50)
    }, 600) // 0.6초 - 읽기 편한 속도
  }

  // 즉시 모든 로그 표시 (스킵 기능)
  const skipToEnd = (battle: Battle) => {
    stopBattle()
    battle.log = [...allBattleLogs.value]
    currentTurnIndex.value = allBattleLogs.value.length
  }

  return {
    isBattleRunning,
    isPaused,
    currentTurnIndex,
    startRealtimeBattle,
    stopBattle,
    pauseBattle,
    resumeBattle,
    skipToEnd
  }
}
