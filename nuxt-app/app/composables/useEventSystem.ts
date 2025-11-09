import { ref, type Ref } from 'vue'
import type { EventCard, EventChoice, CrossroadCard, CrossroadChoice, Kingdom, General, PermanentEffect } from '../types/game'
import { eventCards } from '../data/mockData'
import type { PassiveCard } from '../types/passive-cards'
import { drawRandomCards } from '../types/passive-cards'
import type { ReincarnationData } from '../types/reincarnation'
import type { NationState } from '../types/god-game'

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
  godGameState?: Ref<NationState | null>
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
    synergyDailyEffects,
    godGameState
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

    // 변동사항 추적
    const changes = {
      food: 0,
      gold: 0,
      soldiers: 0,
      morale: 0,
      population: 0
    }

    // 패시브 카드 효과 적용 (daily 트리거)
    const dailyPassiveCards = playerPassiveCards.value.filter(card => card.trigger === 'daily')
    dailyPassiveCards.forEach(card => {
      if (card.effect.gold) {
        kingdom.value.resources.gold += card.effect.gold
        changes.gold += card.effect.gold
      }
      if (card.effect.food) {
        kingdom.value.resources.food += card.effect.food
        changes.food += card.effect.food
      }
      if (card.effect.morale) {
        const oldMorale = kingdom.value.resources.morale
        kingdom.value.resources.morale = Math.min(100, Math.max(0, kingdom.value.resources.morale + card.effect.morale))
        changes.morale += (kingdom.value.resources.morale - oldMorale)
      }
      if (card.effect.military) {
        kingdom.value.resources.soldiers += card.effect.military
        changes.soldiers += card.effect.military
      }
    })

    // 시너지 카드 일일 효과 적용
    if (synergyDailyEffects?.value) {
      kingdom.value.resources.gold += synergyDailyEffects.value.gold
      changes.gold += synergyDailyEffects.value.gold

      kingdom.value.resources.food += synergyDailyEffects.value.food
      changes.food += synergyDailyEffects.value.food

      const oldMorale = kingdom.value.resources.morale
      kingdom.value.resources.morale = Math.min(100, Math.max(0, kingdom.value.resources.morale + synergyDailyEffects.value.morale))
      changes.morale += (kingdom.value.resources.morale - oldMorale)

      kingdom.value.resources.population = Math.max(0, kingdom.value.resources.population + synergyDailyEffects.value.population)
      changes.population += synergyDailyEffects.value.population
    }

    // 계명 효과 매일 적용
    if (godGameState?.value?.selectedCommandments && godGameState.value.selectedCommandments.length > 0) {
      godGameState.value.selectedCommandments.forEach(commandment => {
        if (commandment.effects.morale !== 0) {
          const oldMorale = kingdom.value.resources.morale
          kingdom.value.resources.morale = Math.min(100, Math.max(0, kingdom.value.resources.morale + commandment.effects.morale))
          changes.morale += (kingdom.value.resources.morale - oldMorale)
        }
        if (commandment.effects.gold !== 0) {
          kingdom.value.resources.gold += commandment.effects.gold
          changes.gold += commandment.effects.gold
        }
        if (commandment.effects.military !== 0) {
          kingdom.value.resources.soldiers += commandment.effects.military
          changes.soldiers += commandment.effects.military
        }
        if (commandment.effects.food !== 0) {
          kingdom.value.resources.food += commandment.effects.food
          changes.food += commandment.effects.food
        }
        if (commandment.effects.population !== 0) {
          kingdom.value.resources.population = Math.max(0, kingdom.value.resources.population + commandment.effects.population)
          changes.population += commandment.effects.population
        }
      })
    }

    // 자원 생산
    const { foodProduction, goldProduction, soldierUpkeep } = calculateProduction()
    kingdom.value.resources.food += foodProduction
    kingdom.value.resources.gold += goldProduction
    changes.food += foodProduction
    changes.gold += goldProduction

    // 병력 유지비 차감
    const foodAfterUpkeep = kingdom.value.resources.food - soldierUpkeep

    if (foodAfterUpkeep >= 0) {
      // 식량이 충분한 경우 정상적으로 차감
      kingdom.value.resources.food = foodAfterUpkeep
      changes.food -= soldierUpkeep
    } else {
      // 식량이 부족한 경우
      // 현재 보유한 식량으로 유지할 수 있는 병사 수 계산
      const availableFood = kingdom.value.resources.food
      const supportableSoldiers = Math.floor(availableFood)
      const soldierLoss = kingdom.value.resources.soldiers - supportableSoldiers

      if (soldierLoss > 0) {
        kingdom.value.resources.soldiers = Math.max(0, supportableSoldiers)
        kingdom.value.resources.food = 0
        changes.food -= availableFood // 사용 가능했던 모든 식량 소모
        changes.soldiers -= soldierLoss

        showNotification(`⚠️ 식량 부족! 병사 ${soldierLoss}명이 탈영했습니다!`, 'error')
      }

      // 식량 부족 시 민심 하락
      const oldMorale = kingdom.value.resources.morale
      kingdom.value.resources.morale = Math.max(0, kingdom.value.resources.morale - 10)
      changes.morale += (kingdom.value.resources.morale - oldMorale)
    }

    // 통합 변동사항 알림
    const changeSummary: string[] = []
    if (changes.food !== 0) changeSummary.push(`식량 ${changes.food > 0 ? '+' : ''}${changes.food}`)
    if (changes.gold !== 0) changeSummary.push(`금 ${changes.gold > 0 ? '+' : ''}${changes.gold}`)
    if (changes.soldiers !== 0) changeSummary.push(`병력 ${changes.soldiers > 0 ? '+' : ''}${changes.soldiers}`)
    if (changes.morale !== 0) changeSummary.push(`민심 ${changes.morale > 0 ? '+' : ''}${changes.morale}`)
    if (changes.population !== 0) changeSummary.push(`인구 ${changes.population > 0 ? '+' : ''}${changes.population}`)

    if (changeSummary.length > 0) {
      showNotification(`📊 변동사항: ${changeSummary.join(', ')}`, 'success')
    }

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
