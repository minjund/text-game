// 패시브 카드 타입
export type PassiveTrigger = 'daily' | 'battle_start' | 'battle_win' | 'battle_lose' | 'recruit'

// 시너지 태그 (같은 태그를 가진 카드들끼리 시너지 발동)
export type SynergyTag = 'trade' | 'military' | 'agriculture' | 'culture' | 'magic' | 'religion' | 'technology' | 'conquest'

export interface PassiveCard {
  id: string
  name: string
  description: string
  icon: string
  image: string // 카드 이미지 경로
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  trigger: PassiveTrigger
  synergyTags?: SynergyTag[] // 시너지 태그
  effect: {
    type: 'resource' | 'combat' | 'special'
    // 리소스 효과
    morale?: number
    gold?: number
    military?: number
    food?: number
    population?: number
    // 전투 효과
    attackBonus?: number
    defenseBonus?: number
    // 특수 효과
    description?: string
  }
}

// 시너지 효과 정의
export interface SynergyEffect {
  id: string
  name: string
  description: string
  icon: string
  tag: SynergyTag
  requiredCards: number // 필요한 같은 태그 카드 수
  effect: {
    morale?: number
    gold?: number
    military?: number
    food?: number
    population?: number
    attackBonus?: number
    defenseBonus?: number
  }
}

// 시너지 효과 목록
export const SYNERGY_EFFECTS: SynergyEffect[] = [
  {
    id: 'trade-synergy-2',
    name: '무역 네트워크',
    description: '무역 카드 2개: 매일 추가 금 +100',
    icon: '🌐',
    tag: 'trade',
    requiredCards: 2,
    effect: { gold: 100 }
  },
  {
    id: 'trade-synergy-3',
    name: '무역 제국',
    description: '무역 카드 3개: 매일 추가 금 +300, 민심 +2',
    icon: '👑',
    tag: 'trade',
    requiredCards: 3,
    effect: { gold: 300, morale: 2 }
  },
  {
    id: 'military-synergy-2',
    name: '군사 훈련',
    description: '군사 카드 2개: 전투 시 공격력 +15%',
    icon: '⚔️',
    tag: 'military',
    requiredCards: 2,
    effect: { attackBonus: 15 }
  },
  {
    id: 'military-synergy-3',
    name: '무적의 군단',
    description: '군사 카드 3개: 전투 시 공격력 +30%, 방어력 +20%',
    icon: '🛡️',
    tag: 'military',
    requiredCards: 3,
    effect: { attackBonus: 30, defenseBonus: 20 }
  },
  {
    id: 'agriculture-synergy-2',
    name: '풍년의 축복',
    description: '농업 카드 2개: 매일 추가 식량 +150',
    icon: '🌾',
    tag: 'agriculture',
    requiredCards: 2,
    effect: { food: 150 }
  },
  {
    id: 'agriculture-synergy-3',
    name: '곡창 지대',
    description: '농업 카드 3개: 매일 추가 식량 +400, 인구 +50',
    icon: '🌻',
    tag: 'agriculture',
    requiredCards: 3,
    effect: { food: 400, population: 50 }
  },
  {
    id: 'culture-synergy-2',
    name: '문화 부흥',
    description: '문화 카드 2개: 매일 민심 +3',
    icon: '🎭',
    tag: 'culture',
    requiredCards: 2,
    effect: { morale: 3 }
  },
  {
    id: 'culture-synergy-3',
    name: '황금 시대',
    description: '문화 카드 3개: 매일 민심 +5, 금 +200',
    icon: '✨',
    tag: 'culture',
    requiredCards: 3,
    effect: { morale: 5, gold: 200 }
  },
  {
    id: 'magic-synergy-2',
    name: '마법 연구',
    description: '마법 카드 2개: 전투 시 공격력 +20%, 매일 금 +100',
    icon: '🔮',
    tag: 'magic',
    requiredCards: 2,
    effect: { attackBonus: 20, gold: 100 }
  },
  {
    id: 'magic-synergy-3',
    name: '대마법사의 탑',
    description: '마법 카드 3개: 전투 시 공격력 +40%, 매일 금 +300, 민심 +3',
    icon: '🌟',
    tag: 'magic',
    requiredCards: 3,
    effect: { attackBonus: 40, gold: 300, morale: 3 }
  },
  {
    id: 'conquest-synergy-2',
    name: '정복자의 야심',
    description: '정복 카드 2개: 전투 승리 시 추가 금 +300',
    icon: '⚡',
    tag: 'conquest',
    requiredCards: 2,
    effect: { gold: 300 }
  },
  {
    id: 'conquest-synergy-3',
    name: '제국의 영광',
    description: '정복 카드 3개: 전투 승리 시 추가 금 +600, 병력 +100',
    icon: '👹',
    tag: 'conquest',
    requiredCards: 3,
    effect: { gold: 600, military: 100 }
  }
]

// 패시브 카드 풀
export const PASSIVE_CARDS: PassiveCard[] = [
  // Common 카드 - 일일 리소스
  {
    id: 'daily-gold-small',
    name: '상인 길드',
    description: '매일 금 +100',
    icon: '💰',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['trade'],
    effect: {
      type: 'resource',
      gold: 100
    }
  },
  {
    id: 'daily-food-small',
    name: '풍요의 축복',
    description: '매일 식량 +100',
    icon: '🌾',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['agriculture'],
    effect: {
      type: 'resource',
      food: 100
    }
  },
  {
    id: 'daily-morale-small',
    name: '축제의 전통',
    description: '매일 민심 +2',
    icon: '🎭',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['culture'],
    effect: {
      type: 'resource',
      morale: 2
    }
  },

  // Rare 카드 - 일일 리소스 강화
  {
    id: 'daily-gold-medium',
    name: '무역 독점권',
    description: '매일 금 +250',
    icon: '💎',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    effect: {
      type: 'resource',
      gold: 250
    }
  },
  {
    id: 'daily-food-medium',
    name: '비옥한 땅',
    description: '매일 식량 +200',
    icon: '🌻',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    effect: {
      type: 'resource',
      food: 200
    }
  },
  {
    id: 'daily-balanced',
    name: '번영의 시대',
    description: '매일 금 +150, 식량 +150',
    icon: '🏛️',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    effect: {
      type: 'resource',
      gold: 150,
      food: 150
    }
  },

  // Common 카드 - 전투 보너스
  {
    id: 'battle-soldiers-small',
    name: '민병대',
    description: '전투 시작 시 병력 +100',
    icon: '🛡️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: {
      type: 'combat',
      military: 100
    }
  },
  {
    id: 'battle-attack-small',
    name: '강철 무기',
    description: '전투 시 공격력 +10%',
    icon: '⚔️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: {
      type: 'combat',
      attackBonus: 10
    }
  },
  {
    id: 'battle-defense-small',
    name: '성벽 강화',
    description: '전투 시 방어력 +10%',
    icon: '🏰',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: {
      type: 'combat',
      defenseBonus: 10
    }
  },

  // Rare 카드 - 전투 보너스 강화
  {
    id: 'battle-soldiers-medium',
    name: '예비군 소집',
    description: '전투 시작 시 병력 +200',
    icon: '🎖️',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    effect: {
      type: 'combat',
      military: 200
    }
  },
  {
    id: 'battle-attack-medium',
    name: '전술 교범',
    description: '전투 시 공격력 +20%',
    icon: '📜',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    effect: {
      type: 'combat',
      attackBonus: 20
    }
  },
  {
    id: 'battle-all-medium',
    name: '전쟁의 신',
    description: '전투 시 공격력 +15%, 방어력 +15%',
    icon: '⚡',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    effect: {
      type: 'combat',
      attackBonus: 15,
      defenseBonus: 15
    }
  },

  // Epic 카드 - 승리 보상
  {
    id: 'victory-gold',
    name: '약탈 전문가',
    description: '전투 승리 시 금 +500',
    icon: '💰',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_win',
    effect: {
      type: 'resource',
      gold: 500
    }
  },
  {
    id: 'victory-morale',
    name: '영웅의 귀환',
    description: '전투 승리 시 민심 +5',
    icon: '🏆',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_win',
    effect: {
      type: 'resource',
      morale: 5
    }
  },
  {
    id: 'victory-combo',
    name: '승전 축제',
    description: '전투 승리 시 금 +400, 민심 +3',
    icon: '🎉',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_win',
    effect: {
      type: 'resource',
      gold: 400,
      morale: 3
    }
  },

  // Epic 카드 - 대규모 효과
  {
    id: 'daily-gold-large',
    name: '금광 발견',
    description: '매일 금 +400',
    icon: '⛏️',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    effect: {
      type: 'resource',
      gold: 400
    }
  },
  {
    id: 'daily-all',
    name: '황금시대',
    description: '매일 금 +200, 식량 +200, 민심 +2',
    icon: '👑',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    effect: {
      type: 'resource',
      gold: 200,
      food: 200,
      morale: 2
    }
  },

  // Legendary 카드 - 최강 효과
  {
    id: 'legendary-daily-mega',
    name: '신의 가호',
    description: '매일 금 +500, 식량 +300, 민심 +3',
    icon: '✨',
    image: '/images/passive/solderAdd.png',
    rarity: 'legendary',
    trigger: 'daily',
    effect: {
      type: 'resource',
      gold: 500,
      food: 300,
      morale: 3
    }
  },
  {
    id: 'legendary-battle-mega',
    name: '불패의 군단',
    description: '전투 시작 시 병력 +500, 공격력 +30%',
    icon: '👹',
    image: '/images/passive/solderAdd.png',
    rarity: 'legendary',
    trigger: 'battle_start',
    effect: {
      type: 'combat',
      military: 500,
      attackBonus: 30
    }
  },
  {
    id: 'legendary-victory-mega',
    name: '정복자의 야망',
    description: '전투 승리 시 금 +800, 병력 +100, 민심 +5',
    icon: '🔥',
    image: '/images/passive/solderAdd.png',
    rarity: 'legendary',
    trigger: 'battle_win',
    effect: {
      type: 'resource',
      gold: 800,
      military: 100,
      morale: 5
    }
  },

  // 특수 카드
  {
    id: 'recruit-bonus',
    name: '징병제 개선',
    description: '병력 모집 시 추가로 +50 병력',
    icon: '🎯',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'recruit',
    effect: {
      type: 'resource',
      military: 50
    }
  },
  {
    id: 'battle-lose-insurance',
    name: '불굴의 의지',
    description: '전투 패배 시 민심 피해 -5 감소',
    icon: '💪',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_lose',
    synergyTags: ['military'],
    effect: {
      type: 'resource',
      morale: 5
    }
  },

  // 새로운 카드들 - 시너지 강화
  {
    id: 'trade-route',
    name: '무역로 개척',
    description: '매일 금 +150',
    icon: '🚢',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['trade'],
    effect: {
      type: 'resource',
      gold: 150
    }
  },
  {
    id: 'silk-road',
    name: '실크로드',
    description: '매일 금 +300',
    icon: '🏪',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    synergyTags: ['trade'],
    effect: {
      type: 'resource',
      gold: 300
    }
  },
  {
    id: 'farm-expansion',
    name: '농장 확장',
    description: '매일 식량 +150',
    icon: '🚜',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['agriculture'],
    effect: {
      type: 'resource',
      food: 150
    }
  },
  {
    id: 'irrigation-system',
    name: '관개 시스템',
    description: '매일 식량 +250',
    icon: '💧',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    synergyTags: ['agriculture'],
    effect: {
      type: 'resource',
      food: 250
    }
  },
  {
    id: 'military-academy',
    name: '사관학교',
    description: '전투 시 공격력 +15%',
    icon: '🎓',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: {
      type: 'combat',
      attackBonus: 15
    }
  },
  {
    id: 'elite-guards',
    name: '정예 근위대',
    description: '전투 시작 시 병력 +300',
    icon: '🛡️',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: {
      type: 'combat',
      military: 300
    }
  },
  {
    id: 'magic-library',
    name: '마법 도서관',
    description: '매일 금 +200, 민심 +1',
    icon: '📚',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['magic'],
    effect: {
      type: 'resource',
      gold: 200,
      morale: 1
    }
  },
  {
    id: 'arcane-tower',
    name: '비전의 탑',
    description: '전투 시 공격력 +25%',
    icon: '🗼',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['magic'],
    effect: {
      type: 'combat',
      attackBonus: 25
    }
  },
  {
    id: 'crystal-ball',
    name: '수정구',
    description: '매일 금 +250',
    icon: '🔮',
    image: '/images/passive/solderAdd.png',
    rarity: 'legendary',
    trigger: 'daily',
    synergyTags: ['magic'],
    effect: {
      type: 'resource',
      gold: 250
    }
  },
  {
    id: 'theater',
    name: '대극장',
    description: '매일 민심 +3',
    icon: '🎪',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['culture'],
    effect: {
      type: 'resource',
      morale: 3
    }
  },
  {
    id: 'museum',
    name: '박물관',
    description: '매일 민심 +4, 금 +100',
    icon: '🏛️',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    synergyTags: ['culture'],
    effect: {
      type: 'resource',
      morale: 4,
      gold: 100
    }
  },
  {
    id: 'war-spoils',
    name: '전리품',
    description: '전투 승리 시 금 +400',
    icon: '💎',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_win',
    synergyTags: ['conquest'],
    effect: {
      type: 'resource',
      gold: 400
    }
  },
  {
    id: 'conquest-banner',
    name: '정복의 깃발',
    description: '전투 승리 시 금 +600, 민심 +3',
    icon: '🚩',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_win',
    synergyTags: ['conquest'],
    effect: {
      type: 'resource',
      gold: 600,
      morale: 3
    }
  },
  {
    id: 'tribute-system',
    name: '조공 체계',
    description: '전투 승리 시 병력 +200',
    icon: '👑',
    image: '/images/passive/solderAdd.png',
    rarity: 'legendary',
    trigger: 'battle_win',
    synergyTags: ['conquest'],
    effect: {
      type: 'resource',
      military: 200
    }
  }
]

// 희귀도별 가중치
export const RARITY_WEIGHTS = {
  common: 50,
  rare: 30,
  epic: 15,
  legendary: 5
}

// 랜덤 카드 3장 뽑기
export function drawRandomCards(count: number = 3): PassiveCard[] {
  const cards: PassiveCard[] = []
  const availableCards = [...PASSIVE_CARDS]

  for (let i = 0; i < count && availableCards.length > 0; i++) {
    // 희귀도 기반 가중치 계산
    const totalWeight = availableCards.reduce((sum, card) => {
      return sum + RARITY_WEIGHTS[card.rarity]
    }, 0)

    let random = Math.random() * totalWeight
    let selectedCard: PassiveCard | null = null

    for (const card of availableCards) {
      random -= RARITY_WEIGHTS[card.rarity]
      if (random <= 0) {
        selectedCard = card
        break
      }
    }

    if (selectedCard) {
      cards.push(selectedCard)
      // 뽑은 카드는 제거 (중복 방지)
      const index = availableCards.findIndex(c => c.id === selectedCard!.id)
      if (index > -1) {
        availableCards.splice(index, 1)
      }
    }
  }

  return cards
}

// 시너지 계산 함수
export function calculateSynergies(cards: PassiveCard[]): SynergyEffect[] {
  const activeSynergies: SynergyEffect[] = []
  const tagCounts: Record<SynergyTag, number> = {
    trade: 0,
    military: 0,
    agriculture: 0,
    culture: 0,
    magic: 0,
    religion: 0,
    technology: 0,
    conquest: 0
  }

  // 각 태그별로 카드 개수 카운트
  cards.forEach(card => {
    if (card.synergyTags) {
      card.synergyTags.forEach(tag => {
        tagCounts[tag]++
      })
    }
  })

  // 활성화된 시너지 찾기
  SYNERGY_EFFECTS.forEach(synergy => {
    if (tagCounts[synergy.tag] >= synergy.requiredCards) {
      activeSynergies.push(synergy)
    }
  })

  // 필요 카드 수가 많은 순으로 정렬 (3개 시너지가 2개 시너지보다 우선)
  return activeSynergies.sort((a, b) => b.requiredCards - a.requiredCards)
}

// 시너지 효과 합산
export function getTotalSynergyEffects(synergies: SynergyEffect[]) {
  return synergies.reduce((total, synergy) => {
    return {
      morale: (total.morale || 0) + (synergy.effect.morale || 0),
      gold: (total.gold || 0) + (synergy.effect.gold || 0),
      military: (total.military || 0) + (synergy.effect.military || 0),
      food: (total.food || 0) + (synergy.effect.food || 0),
      population: (total.population || 0) + (synergy.effect.population || 0),
      attackBonus: (total.attackBonus || 0) + (synergy.effect.attackBonus || 0),
      defenseBonus: (total.defenseBonus || 0) + (synergy.effect.defenseBonus || 0)
    }
  }, { morale: 0, gold: 0, military: 0, food: 0, population: 0, attackBonus: 0, defenseBonus: 0 })
}
