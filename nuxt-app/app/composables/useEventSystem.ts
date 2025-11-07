import { ref, type Ref } from 'vue'
import type { EventCard, EventChoice, CrossroadCard, CrossroadChoice, Kingdom, General, PermanentEffect } from '../types/game'
import { eventCards } from '../data/mockData'
import type { PassiveCard } from '../types/passive-cards'
import { drawRandomCards } from '../types/passive-cards'
import type { ReincarnationData } from '../types/reincarnation'

interface UseEventSystemOptions {
  kingdom: Ref<Kingdom>
  generals: Ref<General[]>
  playerPassiveCards: Ref<PassiveCard[]>
  showPassiveCardSelection: Ref<boolean>
  availablePassiveCards: Ref<PassiveCard[]>
  permanentEffects: Ref<PermanentEffect[]>
  reincarnationData: Ref<ReincarnationData>
  showReincarnationModal: Ref<boolean>
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void
  calculateProduction: () => { foodProduction: number; goldProduction: number; soldierUpkeep: number }
  generateRandomGeneral: (rarity: 'common' | 'rare' | 'epic') => General
  synergyDailyEffects?: Ref<{ gold: number; food: number; morale: number; population: number }>
}

export const useEventSystem = (options: UseEventSystemOptions) => {
  const {
    kingdom,
    generals,
    playerPassiveCards,
    showPassiveCardSelection,
    availablePassiveCards,
    permanentEffects,
    reincarnationData,
    showReincarnationModal,
    showNotification,
    calculateProduction,
    generateRandomGeneral,
    synergyDailyEffects
  } = options

  // State
  const currentEvent = ref<EventCard | null>(null)
  const currentCrossroad = ref<CrossroadCard | null>(null)

  // 패시브 효과 적용
  const applyPassiveEffects = (trigger: string) => {
    const effects = playerPassiveCards.value.filter(card => card.trigger === trigger)

    effects.forEach(card => {
      if (card.effect.gold) kingdom.value.resources.gold += card.effect.gold
      if (card.effect.food) kingdom.value.resources.food += card.effect.food
      if (card.effect.morale) kingdom.value.resources.morale = Math.min(100, Math.max(0, kingdom.value.resources.morale + card.effect.morale))
      if (card.effect.military) kingdom.value.resources.soldiers += card.effect.military
    })
  }

  // 랜덤 이벤트 카드 뽑기
  const drawEventCard = () => {
    kingdom.value.day++

    // 패시브 카드 효과 적용 (daily 트리거)
    applyPassiveEffects('daily')

    // 시너지 카드 일일 효과 적용
    if (synergyDailyEffects?.value) {
      kingdom.value.resources.gold += synergyDailyEffects.value.gold
      kingdom.value.resources.food += synergyDailyEffects.value.food
      kingdom.value.resources.morale = Math.min(100, Math.max(0, kingdom.value.resources.morale + synergyDailyEffects.value.morale))
      kingdom.value.resources.population = Math.max(0, kingdom.value.resources.population + synergyDailyEffects.value.population)
    }

    // 자원 생산
    const { foodProduction, goldProduction, soldierUpkeep } = calculateProduction()

    // 식량 부족 시 민심 하락
    if (kingdom.value.resources.food < 1000) {
      kingdom.value.resources.morale = Math.max(0, kingdom.value.resources.morale - 5)
      showNotification('식량이 부족합니다! 민심이 하락했습니다.', 'error')
    }

    // 생산 알림 (시너지 효과 포함)
    const totalFood = foodProduction + (synergyDailyEffects?.value?.food || 0)
    const totalGold = goldProduction + (synergyDailyEffects?.value?.gold || 0)
    const synergyBonus = synergyDailyEffects?.value && (synergyDailyEffects.value.gold > 0 || synergyDailyEffects.value.food > 0)
      ? ' (시너지 효과 포함)'
      : ''
    showNotification(`자원 생산: 식량 +${totalFood}, 금 +${totalGold} (병력 유지비 -${soldierUpkeep})${synergyBonus}`, 'success')

    // 100일째 환생 시스템
    if (kingdom.value.day === 100) {
      // 환생 데이터 업데이트
      reincarnationData.value.totalDaysPlayed += kingdom.value.day
      if (kingdom.value.day > reincarnationData.value.highestDay) {
        reincarnationData.value.highestDay = kingdom.value.day
      }
      showReincarnationModal.value = true
      return
    }

    // 25일마다는 이제 시너지 카드를 뽑으므로 이 로직은 제거됨
    // (시너지 카드는 game.vue에서 직접 처리)

    // 일반 이벤트
    const randomEvent = eventCards[Math.floor(Math.random() * eventCards.length)]
    const eventCopy = JSON.parse(JSON.stringify(randomEvent))

    // 30% 확률로 장수 영입 선택지 추가
    if (Math.random() < 0.3) {
      const rarityRoll = Math.random()
      let rarity: 'common' | 'rare' | 'epic'
      let cost = { gold: 0 }
      let choiceText = ''

      if (rarityRoll < 0.60) {
        rarity = 'common'
        cost.gold = 200
        choiceText = '떠돌이 장수를 영입한다 (금 -200)'
      } else if (rarityRoll < 0.90) {
        rarity = 'rare'
        cost.gold = 500
        choiceText = '유명한 장수를 영입한다 (금 -500)'
      } else {
        rarity = 'epic'
        cost.gold = 1000
        choiceText = '전설의 영웅을 영입한다 (금 -1000)'
      }

      const newGeneral = generateRandomGeneral(rarity)

      eventCopy.choices.push({
        text: choiceText,
        cost,
        general: newGeneral
      })
    }

    currentEvent.value = eventCopy
  }

  // 패시브 카드 선택
  const selectPassiveCard = (card: PassiveCard) => {
    playerPassiveCards.value.push(card)
    showPassiveCardSelection.value = false
    availablePassiveCards.value = []
    showNotification(`${card.name} 카드를 획득했습니다!`, 'success')
  }

  // 희귀도 라벨
  const getRarityLabel = (rarity: string) => {
    const labels: Record<string, string> = {
      common: '일반',
      rare: '희귀',
      epic: '영웅',
      legendary: '전설'
    }
    return labels[rarity] || rarity
  }

  // 트리거 라벨
  const getTriggerLabel = (trigger: string) => {
    const labels: Record<string, string> = {
      daily: '매일',
      battle_start: '전투 시작',
      battle_win: '전투 승리',
      battle_lose: '전투 패배',
      recruit: '병력 모집'
    }
    return labels[trigger] || trigger
  }

  // 선택지 비용 확인
  const canAffordChoice = (choice: EventChoice): boolean => {
    if (!choice.cost) return true

    if (choice.cost.food && kingdom.value.resources.food < choice.cost.food) return false
    if (choice.cost.gold && kingdom.value.resources.gold < choice.cost.gold) return false
    if (choice.cost.soldiers && kingdom.value.resources.soldiers < choice.cost.soldiers) return false

    return true
  }

  // 선택지 선택
  const selectChoice = (choice: EventChoice) => {
    // 비용 차감
    if (choice.cost) {
      if (choice.cost.food) kingdom.value.resources.food -= choice.cost.food
      if (choice.cost.gold) kingdom.value.resources.gold -= choice.cost.gold
      if (choice.cost.soldiers) kingdom.value.resources.soldiers -= choice.cost.soldiers
    }

    // 보상 지급
    if (choice.reward) {
      if (choice.reward.food) kingdom.value.resources.food += choice.reward.food
      if (choice.reward.gold) kingdom.value.resources.gold += choice.reward.gold
      if (choice.reward.soldiers) kingdom.value.resources.soldiers += choice.reward.soldiers
      if (choice.reward.morale) {
        kingdom.value.resources.morale += choice.reward.morale
        kingdom.value.resources.morale = Math.max(0, Math.min(100, kingdom.value.resources.morale))
      }
    }

    // 장수 영입
    if (choice.general) {
      generals.value.push(choice.general)
      showNotification(`${choice.general.name}을(를) 영입했습니다!`, 'success')
    }

    closeEvent()
  }

  const closeEvent = () => {
    currentEvent.value = null
  }

  // 갈림길 선택
  const selectCrossroadChoice = (choice: CrossroadChoice) => {
    // 영구 효과 추가
    permanentEffects.value.push(choice.effect)

    // 즉시 적용되는 효과들
    if (choice.effect.value?.moraleBonus) {
      kingdom.value.resources.morale += choice.effect.value.moraleBonus
      kingdom.value.resources.morale = Math.max(0, Math.min(100, kingdom.value.resources.morale))
    }

    showNotification(`${choice.effect.name} 효과가 영구적으로 적용되었습니다!`, 'success')
    closeCrossroad()
  }

  const closeCrossroad = () => {
    currentCrossroad.value = null
  }

  return {
    // State
    currentEvent,
    currentCrossroad,

    // Methods
    drawEventCard,
    selectPassiveCard,
    applyPassiveEffects,
    getRarityLabel,
    getTriggerLabel,
    canAffordChoice,
    selectChoice,
    closeEvent,
    selectCrossroadChoice,
    closeCrossroad
  }
}
