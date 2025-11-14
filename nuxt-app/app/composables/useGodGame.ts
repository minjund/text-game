import { ref } from 'vue'
import type { Commandment, NationState } from '~/types/god-game'
import type { PassiveCard } from '~/types/passive-cards'

// 전역 상태로 게임 데이터 공유
const nationName = ref('')
const selectedCommandments = ref<Commandment[]>([])
const startCards = ref<PassiveCard[]>([])
const nationState = ref<NationState | null>(null)

export const useGodGame = () => {
  const setNationName = (name: string) => {
    nationName.value = name
    // localStorage에도 왕국 이름 저장 (환생 시 동일한 이름 유지)
    if (process.client) {
      localStorage.setItem('kingdomName', name)
    }
  }

  const setSelectedCommandments = (commandments: Commandment[]) => {
    selectedCommandments.value = commandments
  }

  const setStartCards = (cards: PassiveCard[]) => {
    startCards.value = cards
  }

  const initializeNation = () => {
    // 선택된 계명을 기반으로 초기 스탯 계산
    let totalEffects = {
      morale: 50,
      gold: 1000,
      military: 500,
      food: 1000,
      population: 1000
    }

    selectedCommandments.value.forEach(commandment => {
      totalEffects.morale += commandment.effects.morale
      totalEffects.gold += commandment.effects.gold * 10 // 금 효과 증폭
      totalEffects.military += commandment.effects.military * 5 // 군사 효과 증폭
      totalEffects.food += commandment.effects.food * 10 // 식량 효과 증폭
      totalEffects.population += commandment.effects.population * 5 // 인구 효과 증폭
    })

    nationState.value = {
      name: nationName.value,
      selectedCommandments: [...selectedCommandments.value],
      stats: {
        ...totalEffects,
        year: 1
      },
      events: []
    }

    // localStorage에 godGameState 저장 (환생 시에도 유지)
    if (process.client) {
      localStorage.setItem('godGameState', JSON.stringify(nationState.value))
    }
  }

  const resetGame = () => {
    nationName.value = ''
    selectedCommandments.value = []
    startCards.value = []
    nationState.value = null
  }

  const updateStats = (changes: Partial<NationState['stats']>) => {
    if (nationState.value) {
      Object.keys(changes).forEach(key => {
        const statKey = key as keyof NationState['stats']
        if (statKey !== 'year') {
          nationState.value!.stats[statKey] += changes[statKey] || 0
        }
      })
    }
  }

  return {
    nationName,
    selectedCommandments,
    startCards,
    nationState,
    setNationName,
    setSelectedCommandments,
    setStartCards,
    initializeNation,
    resetGame,
    updateStats
  }
}
