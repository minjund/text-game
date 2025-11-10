import { ref, type Ref } from 'vue'
import type { Kingdom, General, PermanentEffect } from '~/types/game'
import type { PassiveCard } from '~/types/passive-cards'
import type { ReincarnationData } from '~/types/reincarnation'
import { calculateReincarnationBonuses, getTotalBonuses } from '~/types/reincarnation'

export const useGameReincarnation = (
  kingdom: Ref<Kingdom>,
  generals: Ref<General[]>,
  playerPassiveCards: Ref<PassiveCard[]>,
  godGameState: Ref<any>,
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void
) => {
  const showReincarnationModal = ref(false)
  const reincarnationData = ref<ReincarnationData>({
    count: 0,
    inheritedCard: null,
    inheritedCards: [],
    totalDaysPlayed: 0,
    highestDay: 0,
    bonuses: []
  })

  // 환생 데이터 로드
  const loadReincarnationData = () => {
    if (process.client) {
      const saved = localStorage.getItem('reincarnationData')
      if (saved) {
        const loadedData = JSON.parse(saved)

        // 하위 호환성: inheritedCards가 없으면 빈 배열로 초기화
        if (!loadedData.inheritedCards) {
          loadedData.inheritedCards = []
        }

        reincarnationData.value = loadedData

        // 누적된 모든 상속 카드를 추가
        if (reincarnationData.value.inheritedCards.length > 0) {
          playerPassiveCards.value = [...reincarnationData.value.inheritedCards]
          console.log(`상속받은 카드들: ${reincarnationData.value.inheritedCards.map(c => c.name).join(', ')}`)
        }

        // 환생 보너스 적용
        if (reincarnationData.value.bonuses.length > 0) {
          const totalBonuses = getTotalBonuses(reincarnationData.value.bonuses)
          if (totalBonuses.gold) kingdom.value.resources.gold += totalBonuses.gold
          if (totalBonuses.food) kingdom.value.resources.food += totalBonuses.food
          if (totalBonuses.military) kingdom.value.resources.soldiers += totalBonuses.military
          if (totalBonuses.morale) kingdom.value.resources.morale = Math.min(100, kingdom.value.resources.morale + totalBonuses.morale)

          console.log(`환생 보너스 적용! (${reincarnationData.value.count}회 환생)`)
        }
      }
    }
  }

  // 게임 상태만 리셋 (나라 이름과 계명은 유지)
  const resetGameKeepProgress = () => {
    // 기본 자원 값
    let baseResources = {
      food: 1000,
      gold: 1000,
      soldiers: 500,
      morale: 50
    }

    // 신 게임 스탯이 있으면 적용
    if (godGameState.value && godGameState.value.stats) {
      baseResources.food = godGameState.value.stats.food
      baseResources.gold = godGameState.value.stats.gold
      baseResources.soldiers = godGameState.value.stats.military
      baseResources.morale = Math.max(0, Math.min(100, godGameState.value.stats.morale))
    }

    // 환생 보너스 적용
    const totalBonuses = getTotalBonuses(reincarnationData.value.bonuses)
    if (totalBonuses.gold) baseResources.gold += totalBonuses.gold
    if (totalBonuses.food) baseResources.food += totalBonuses.food
    if (totalBonuses.military) baseResources.soldiers += totalBonuses.military
    if (totalBonuses.morale) baseResources.morale = Math.min(100, baseResources.morale + totalBonuses.morale)

    // 나라 이름은 유지하고 자원만 리셋
    kingdom.value.day = 0
    kingdom.value.resources = {
      ...baseResources,
      population: godGameState.value?.stats.population || 1000
    }

    // 장수는 초기화 (0명으로 시작)
    generals.value = []

    // 패시브 카드는 누적된 상속 카드들만 유지
    playerPassiveCards.value = [...reincarnationData.value.inheritedCards]

    // 게임 데이터 저장
    if (process.client) {
      localStorage.setItem('gameData', JSON.stringify(kingdom.value))
    }

    // 모달 닫기
    showReincarnationModal.value = false
  }

  // 환생 - 카드 선택
  const selectInheritedCard = (card: PassiveCard) => {
    reincarnationData.value.inheritedCard = card

    // 선택한 카드를 누적 목록에 추가 (중복 방지)
    const hasCard = reincarnationData.value.inheritedCards.some(c => c.id === card.id)
    if (!hasCard) {
      reincarnationData.value.inheritedCards.push(card)
    }

    reincarnationData.value.count++
    reincarnationData.value.bonuses = calculateReincarnationBonuses(reincarnationData.value.count)

    // 로컬 스토리지에 환생 데이터 저장
    if (process.client) {
      localStorage.setItem('reincarnationData', JSON.stringify(reincarnationData.value))
    }

    showNotification(`${card.name} 카드를 가지고 환생합니다! (누적 상속 카드: ${reincarnationData.value.inheritedCards.length}개)`, 'success')

    // 모달 닫기
    showReincarnationModal.value = false

    // story.vue로 리다이렉트
    setTimeout(() => {
      if (process.client) {
        // 게임 상태 초기화 (환생 데이터와 신 게임 상태는 유지)
        localStorage.removeItem('gameData')
        localStorage.removeItem('passiveCards')
        localStorage.removeItem('turnSystemState')
        localStorage.removeItem('gameStartTime')
        localStorage.removeItem('synergyCards')
        // tutorialState는 유지하여 스토리는 건너뛰고 시작

        // 스토리 페이지로 이동
        window.location.href = '/story'
      }
    }, 2000)
  }

  // 환생 포기 (카드 없이 환생)
  const reincarnateWithoutCard = () => {
    reincarnationData.value.inheritedCard = null
    reincarnationData.value.count++
    reincarnationData.value.bonuses = calculateReincarnationBonuses(reincarnationData.value.count)

    if (process.client) {
      localStorage.setItem('reincarnationData', JSON.stringify(reincarnationData.value))
    }

    showNotification(`카드 없이 환생합니다. (누적 상속 카드: ${reincarnationData.value.inheritedCards.length}개)`, 'info')

    // 모달 닫기
    showReincarnationModal.value = false

    // story.vue로 리다이렉트
    setTimeout(() => {
      if (process.client) {
        // 게임 상태 초기화 (환생 데이터와 신 게임 상태는 유지)
        localStorage.removeItem('gameData')
        localStorage.removeItem('passiveCards')
        localStorage.removeItem('turnSystemState')
        localStorage.removeItem('gameStartTime')
        localStorage.removeItem('synergyCards')

        // 스토리 페이지로 이동
        window.location.href = '/story'
      }
    }, 2000)
  }

  return {
    showReincarnationModal,
    reincarnationData,
    loadReincarnationData,
    resetGameKeepProgress,
    selectInheritedCard,
    reincarnateWithoutCard
  }
}
