import { ref, type Ref } from 'vue'
import type { Kingdom, PermanentEffect } from '~/types/game'
import { mockKingdom } from '~/data/mockData'

export const useGameKingdom = (
  godGameState: Ref<any>,
  permanentEffects: Ref<PermanentEffect[]>,
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void
) => {
  // 로컬스토리지에서 플레이어 정보 가져오기
  const loadPlayerData = (): Kingdom => {
    if (process.client) {
      const playerName = localStorage.getItem('playerName') || '플레이어'
      const kingdomName = localStorage.getItem('kingdomName') || '아스트랄 왕국'

      const loadedKingdom = JSON.parse(JSON.stringify(mockKingdom))

      // 신 게임 모드에서 온 경우 해당 이름과 리소스 사용
      if (godGameState.value && godGameState.value.name) {
        loadedKingdom.name = godGameState.value.name
        loadedKingdom.ruler = playerName

        // 신 게임 스탯을 기본 게임 리소스에 반영
        loadedKingdom.resources.food = godGameState.value.stats.food
        loadedKingdom.resources.gold = godGameState.value.stats.gold
        loadedKingdom.resources.soldiers = godGameState.value.stats.military
        loadedKingdom.resources.morale = Math.max(0, Math.min(100, godGameState.value.stats.morale))
      } else {
        loadedKingdom.name = kingdomName
        loadedKingdom.ruler = playerName
      }

      return loadedKingdom
    }
    return JSON.parse(JSON.stringify(mockKingdom))
  }

  const kingdom = ref<Kingdom>(loadPlayerData())

  const empire = ref({
    name: '대제국',
    defeated: false,  // 제국이 패배했는지 여부 (한 번의 전투로 결정)
    totalFortresses: 1  // 1개의 막강한 제국
  })

  // 병력 모집
  const recruitSoldiers = () => {
    // 영구 효과 적용
    let recruitDiscount = 0
    permanentEffects.value.forEach(effect => {
      if (effect.value?.recruitDiscount) recruitDiscount += effect.value.recruitDiscount
    })

    const baseCost = 200
    const actualCost = Math.floor(baseCost * (1 - recruitDiscount / 100))

    if (kingdom.value.resources.gold >= actualCost) {
      kingdom.value.resources.gold -= actualCost
      kingdom.value.resources.soldiers += 100
      showNotification(`병력 100을 모집했습니다! (비용: 금 ${actualCost})`, 'success')
    } else {
      showNotification(`금이 부족합니다! (필요: ${actualCost})`, 'error')
    }
  }

  // 자원 생산 (영구 효과 적용)
  const calculateProduction = () => {
    let foodBonus = 0
    let goldBonus = 0
    let upkeepDiscount = 0

    permanentEffects.value.forEach(effect => {
      if (effect.value?.foodBonus) foodBonus += effect.value.foodBonus
      if (effect.value?.goldBonus) goldBonus += effect.value.goldBonus
      if (effect.value?.upkeepDiscount) upkeepDiscount += effect.value.upkeepDiscount
    })

    const baseFoodProduction = Math.floor(kingdom.value.resources.morale * 10)
    const baseGoldProduction = 100 + Math.floor(kingdom.value.day * 5)

    const foodProduction = Math.floor(baseFoodProduction * (1 + foodBonus / 100))
    const goldProduction = Math.floor(baseGoldProduction * (1 + goldBonus / 100))

    kingdom.value.resources.food += foodProduction
    kingdom.value.resources.gold += goldProduction

    // 병력 유지 비용 (영구 효과 적용)
    const baseSoldierUpkeep = Math.floor(kingdom.value.resources.soldiers * 0.5)
    const soldierUpkeep = Math.floor(baseSoldierUpkeep * (1 - upkeepDiscount / 100))
    kingdom.value.resources.food = Math.max(0, kingdom.value.resources.food - soldierUpkeep)

    return { foodProduction, goldProduction, soldierUpkeep }
  }

  return {
    kingdom,
    empire,
    loadPlayerData,
    recruitSoldiers,
    calculateProduction
  }
}
