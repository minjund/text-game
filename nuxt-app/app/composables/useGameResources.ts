import { ref, computed, watch } from 'vue'

export interface Resources {
  food: number
  gold: number
  soldiers: number
  morale: number
}

export interface ResourceProduction {
  foodPerTurn: number
  goldPerTurn: number
  soldiersPerTurn: number
  moralePerTurn: number
}

export const useGameResources = (initialResources?: Partial<Resources>) => {
  // 기본 리소스
  const resources = ref<Resources>({
    food: initialResources?.food ?? 100,
    gold: initialResources?.gold ?? 50,
    soldiers: initialResources?.soldiers ?? 10,
    morale: initialResources?.morale ?? 50
  })

  // 생산량
  const production = ref<ResourceProduction>({
    foodPerTurn: 10,
    goldPerTurn: 5,
    soldiersPerTurn: 1,
    moralePerTurn: 0
  })

  // 리소스 추가
  const addResource = (resource: keyof Resources, amount: number) => {
    resources.value[resource] += amount

    // 모랄은 0-100 사이로 제한
    if (resource === 'morale') {
      resources.value.morale = Math.max(0, Math.min(100, resources.value.morale))
    }

    // 다른 리소스는 0 이상
    if (resources.value[resource] < 0) {
      resources.value[resource] = 0
    }
  }

  // 리소스 차감
  const subtractResource = (resource: keyof Resources, amount: number) => {
    addResource(resource, -amount)
  }

  // 리소스 설정
  const setResource = (resource: keyof Resources, amount: number) => {
    resources.value[resource] = amount

    if (resource === 'morale') {
      resources.value.morale = Math.max(0, Math.min(100, resources.value.morale))
    }
  }

  // 리소스 충분한지 확인
  const hasEnoughResources = (required: Partial<Resources>): boolean => {
    return Object.entries(required).every(([key, value]) => {
      const resourceKey = key as keyof Resources
      return resources.value[resourceKey] >= (value ?? 0)
    })
  }

  // 리소스 소비 (충분하면 true, 부족하면 false)
  const consumeResources = (required: Partial<Resources>): boolean => {
    if (!hasEnoughResources(required)) {
      return false
    }

    Object.entries(required).forEach(([key, value]) => {
      const resourceKey = key as keyof Resources
      subtractResource(resourceKey, value ?? 0)
    })

    return true
  }

  // 턴 종료시 생산량 적용
  const applyProduction = () => {
    addResource('food', production.value.foodPerTurn)
    addResource('gold', production.value.goldPerTurn)
    addResource('soldiers', production.value.soldiersPerTurn)
    addResource('morale', production.value.moralePerTurn)
  }

  // 생산량 수정
  const updateProduction = (updates: Partial<ResourceProduction>) => {
    Object.assign(production.value, updates)
  }

  // 모든 리소스 초기화
  const resetResources = (newResources?: Partial<Resources>) => {
    resources.value = {
      food: newResources?.food ?? 100,
      gold: newResources?.gold ?? 50,
      soldiers: newResources?.soldiers ?? 10,
      morale: newResources?.morale ?? 50
    }
  }

  // 계산된 속성들
  const totalResources = computed(() => {
    return resources.value.food + resources.value.gold + resources.value.soldiers
  })

  const moraleStatus = computed(() => {
    const morale = resources.value.morale
    if (morale >= 80) return { text: '최상', color: 'success' }
    if (morale >= 60) return { text: '좋음', color: 'info' }
    if (morale >= 40) return { text: '보통', color: 'warning' }
    if (morale >= 20) return { text: '낮음', color: 'danger' }
    return { text: '최악', color: 'danger' }
  })

  return {
    resources,
    production,
    addResource,
    subtractResource,
    setResource,
    hasEnoughResources,
    consumeResources,
    applyProduction,
    updateProduction,
    resetResources,
    totalResources,
    moraleStatus
  }
}
