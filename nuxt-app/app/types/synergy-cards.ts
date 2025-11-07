// 시너지 카드 시스템 (10가지 카드)
export type SynergyCardTag = 'trade' | 'military' | 'agriculture' | 'culture'

export interface SynergyCard {
  id: string
  name: string
  description: string
  icon: string
  image: string
  tag: SynergyCardTag
  effect: {
    // 리소스 효과
    gold?: number
    food?: number
    morale?: number
    military?: number
    population?: number
    // 전투 효과
    attackBonus?: number
    defenseBonus?: number
  }
}

export interface SynergyBonus {
  id: string
  name: string
  description: string
  icon: string
  tag: SynergyCardTag
  requiredCards: number // 2 or 3
  effect: {
    gold?: number
    food?: number
    morale?: number
    military?: number
    population?: number
    attackBonus?: number
    defenseBonus?: number
  }
}

// 10가지 카드 정의
export const SYNERGY_CARDS: SynergyCard[] = [
  // 무역 카드 3개 (3개 시너지)
  {
    id: 'trade-1',
    name: '상인 길드',
    description: '매일 금 +100',
    icon: '💰',
    image: '/images/cards/trade-1.png',
    tag: 'trade',
    effect: {
      gold: 100
    }
  },
  {
    id: 'trade-2',
    name: '무역로 개척',
    description: '매일 금 +150, 식량 +50',
    icon: '🚢',
    image: '/images/cards/trade-2.png',
    tag: 'trade',
    effect: {
      gold: 150,
      food: 50
    }
  },
  {
    id: 'trade-3',
    name: '실크로드',
    description: '매일 금 +200',
    icon: '🏪',
    image: '/images/cards/trade-3.png',
    tag: 'trade',
    effect: {
      gold: 200
    }
  },

  // 군사 카드 3개 (3개 시너지)
  {
    id: 'military-1',
    name: '정예 근위대',
    description: '전투 시작 시 병력 +200',
    icon: '🛡️',
    image: '/images/cards/military-1.png',
    tag: 'military',
    effect: {
      military: 200
    }
  },
  {
    id: 'military-2',
    name: '사관학교',
    description: '전투 시 공격력 +15%',
    icon: '🎓',
    image: '/images/cards/military-2.png',
    tag: 'military',
    effect: {
      attackBonus: 15
    }
  },
  {
    id: 'military-3',
    name: '전쟁의 신',
    description: '전투 시 공격력 +20%, 방어력 +10%',
    icon: '⚡',
    image: '/images/cards/military-3.png',
    tag: 'military',
    effect: {
      attackBonus: 20,
      defenseBonus: 10
    }
  },

  // 농업 카드 2개 (2개 시너지)
  {
    id: 'agriculture-1',
    name: '풍요의 축복',
    description: '매일 식량 +150',
    icon: '🌾',
    image: '/images/cards/agriculture-1.png',
    tag: 'agriculture',
    effect: {
      food: 150
    }
  },
  {
    id: 'agriculture-2',
    name: '비옥한 땅',
    description: '매일 식량 +200, 인구 +20',
    icon: '🌻',
    image: '/images/cards/agriculture-2.png',
    tag: 'agriculture',
    effect: {
      food: 200,
      population: 20
    }
  },

  // 문화 카드 2개 (2개 시너지)
  {
    id: 'culture-1',
    name: '축제의 전통',
    description: '매일 민심 +3',
    icon: '🎭',
    image: '/images/cards/culture-1.png',
    tag: 'culture',
    effect: {
      morale: 3
    }
  },
  {
    id: 'culture-2',
    name: '대극장',
    description: '매일 민심 +4, 금 +100',
    icon: '🎪',
    image: '/images/cards/culture-2.png',
    tag: 'culture',
    effect: {
      morale: 4,
      gold: 100
    }
  }
]

// 시너지 보너스 정의
export const SYNERGY_BONUSES: SynergyBonus[] = [
  // 무역 3개 시너지
  {
    id: 'trade-synergy-3',
    name: '무역 제국',
    description: '무역 카드 3개: 매일 추가 금 +300, 민심 +3',
    icon: '👑',
    tag: 'trade',
    requiredCards: 3,
    effect: {
      gold: 300,
      morale: 3
    }
  },

  // 군사 3개 시너지
  {
    id: 'military-synergy-3',
    name: '무적의 군단',
    description: '군사 카드 3개: 전투 시 추가 공격력 +25%, 방어력 +15%',
    icon: '🏆',
    tag: 'military',
    requiredCards: 3,
    effect: {
      attackBonus: 25,
      defenseBonus: 15
    }
  },

  // 농업 2개 시너지
  {
    id: 'agriculture-synergy-2',
    name: '풍년의 축복',
    description: '농업 카드 2개: 매일 추가 식량 +200, 금 +100',
    icon: '🌾',
    tag: 'agriculture',
    requiredCards: 2,
    effect: {
      food: 200,
      gold: 100
    }
  },

  // 문화 2개 시너지
  {
    id: 'culture-synergy-2',
    name: '문화 부흥',
    description: '문화 카드 2개: 매일 추가 민심 +3, 금 +150',
    icon: '✨',
    tag: 'culture',
    requiredCards: 2,
    effect: {
      morale: 3,
      gold: 150
    }
  }
]

// 랜덤 카드 3장 뽑기
export function drawRandomSynergyCards(count: number = 3): SynergyCard[] {
  const cards: SynergyCard[] = []
  const availableCards = [...SYNERGY_CARDS]

  for (let i = 0; i < count && availableCards.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableCards.length)
    cards.push(availableCards[randomIndex])
    availableCards.splice(randomIndex, 1) // 중복 방지
  }

  return cards
}

// 시너지 계산
export function calculateActiveSynergies(cards: SynergyCard[]): SynergyBonus[] {
  const tagCounts: Record<SynergyCardTag, number> = {
    trade: 0,
    military: 0,
    agriculture: 0,
    culture: 0
  }

  // 각 태그별 카드 개수 카운트
  cards.forEach(card => {
    tagCounts[card.tag]++
  })

  // 활성화된 시너지 찾기
  const activeSynergies: SynergyBonus[] = []

  SYNERGY_BONUSES.forEach(synergy => {
    if (tagCounts[synergy.tag] >= synergy.requiredCards) {
      activeSynergies.push(synergy)
    }
  })

  return activeSynergies
}

// 시너지 효과 합산
export function getTotalCardEffects(cards: SynergyCard[], synergies: SynergyBonus[]) {
  // 카드 효과 합산
  const cardEffects = cards.reduce((total, card) => {
    return {
      gold: (total.gold || 0) + (card.effect.gold || 0),
      food: (total.food || 0) + (card.effect.food || 0),
      morale: (total.morale || 0) + (card.effect.morale || 0),
      military: (total.military || 0) + (card.effect.military || 0),
      population: (total.population || 0) + (card.effect.population || 0),
      attackBonus: (total.attackBonus || 0) + (card.effect.attackBonus || 0),
      defenseBonus: (total.defenseBonus || 0) + (card.effect.defenseBonus || 0)
    }
  }, { gold: 0, food: 0, morale: 0, military: 0, population: 0, attackBonus: 0, defenseBonus: 0 })

  // 시너지 효과 합산
  const synergyEffects = synergies.reduce((total, synergy) => {
    return {
      gold: (total.gold || 0) + (synergy.effect.gold || 0),
      food: (total.food || 0) + (synergy.effect.food || 0),
      morale: (total.morale || 0) + (synergy.effect.morale || 0),
      military: (total.military || 0) + (synergy.effect.military || 0),
      population: (total.population || 0) + (synergy.effect.population || 0),
      attackBonus: (total.attackBonus || 0) + (synergy.effect.attackBonus || 0),
      defenseBonus: (total.defenseBonus || 0) + (synergy.effect.defenseBonus || 0)
    }
  }, { gold: 0, food: 0, morale: 0, military: 0, population: 0, attackBonus: 0, defenseBonus: 0 })

  // 카드 효과 + 시너지 효과
  return {
    cardEffects,
    synergyEffects,
    totalEffects: {
      gold: cardEffects.gold + synergyEffects.gold,
      food: cardEffects.food + synergyEffects.food,
      morale: cardEffects.morale + synergyEffects.morale,
      military: cardEffects.military + synergyEffects.military,
      population: cardEffects.population + synergyEffects.population,
      attackBonus: cardEffects.attackBonus + synergyEffects.attackBonus,
      defenseBonus: cardEffects.defenseBonus + synergyEffects.defenseBonus
    }
  }
}
