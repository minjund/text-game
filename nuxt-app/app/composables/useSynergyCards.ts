import { ref, computed } from 'vue'
import {
  type SynergyCard,
  type SynergyBonus,
  drawRandomSynergyCards,
  calculateActiveSynergies,
  getTotalCardEffects
} from '~/types/synergy-cards'

export const useSynergyCards = () => {
  // 플레이어가 보유한 카드
  const playerCards = ref<SynergyCard[]>([])

  // 카드 선택 모달 표시 여부
  const showCardSelection = ref(false)

  // 선택 가능한 카드 (3장)
  const availableCards = ref<SynergyCard[]>([])

  // 활성 시너지 계산
  const activeSynergies = computed(() => {
    return calculateActiveSynergies(playerCards.value)
  })

  // 총 효과 계산 (카드 효과 + 시너지 효과)
  const totalEffects = computed(() => {
    return getTotalCardEffects(playerCards.value, activeSynergies.value)
  })

  // 매일 적용되는 효과
  const dailyEffects = computed(() => {
    return {
      gold: totalEffects.value.totalEffects.gold,
      food: totalEffects.value.totalEffects.food,
      morale: totalEffects.value.totalEffects.morale,
      population: totalEffects.value.totalEffects.population
    }
  })

  // 전투 시 적용되는 효과
  const battleEffects = computed(() => {
    return {
      military: totalEffects.value.totalEffects.military,
      attackBonus: totalEffects.value.totalEffects.attackBonus,
      defenseBonus: totalEffects.value.totalEffects.defenseBonus
    }
  })

  // 카드 뽑기 (3장 제시)
  const drawCards = () => {
    availableCards.value = drawRandomSynergyCards(3)
    showCardSelection.value = true
  }

  // 카드 선택
  const selectCard = (card: SynergyCard) => {
    playerCards.value.push(card)
    showCardSelection.value = false
    availableCards.value = []
  }

  // 카드 제거
  const removeCard = (cardId: string) => {
    const index = playerCards.value.findIndex(c => c.id === cardId)
    if (index > -1) {
      playerCards.value.splice(index, 1)
    }
  }

  // 모든 카드 초기화
  const resetCards = () => {
    playerCards.value = []
  }

  // 매일 효과 적용
  const applyDailyEffects = (resources: {
    gold: number
    food: number
    morale: number
  }) => {
    const effects = dailyEffects.value

    return {
      gold: resources.gold + effects.gold,
      food: resources.food + effects.food,
      morale: Math.min(100, resources.morale + effects.morale)
    }
  }

  // 전투 효과 적용
  const applyBattleEffects = (military: number) => {
    const effects = battleEffects.value

    return {
      military: military + effects.military,
      attackMultiplier: 1 + (effects.attackBonus / 100),
      defenseMultiplier: 1 + (effects.defenseBonus / 100)
    }
  }

  return {
    // 상태
    playerCards,
    showCardSelection,
    availableCards,
    activeSynergies,
    totalEffects,
    dailyEffects,
    battleEffects,

    // 메서드
    drawCards,
    selectCard,
    removeCard,
    resetCards,
    applyDailyEffects,
    applyBattleEffects
  }
}
