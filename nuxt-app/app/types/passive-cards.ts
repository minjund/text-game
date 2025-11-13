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
    id: 'technology-synergy-2',
    name: '산업 혁명',
    description: '기술 카드 2개: 매일 금 +200, 병력 +30',
    icon: '⚙️',
    tag: 'technology',
    requiredCards: 2,
    effect: { gold: 200, military: 30 }
  },
  {
    id: 'technology-synergy-3',
    name: '과학 시대',
    description: '기술 카드 3개: 매일 금 +400, 병력 +80, 민심 +2',
    icon: '🔬',
    tag: 'technology',
    requiredCards: 3,
    effect: { gold: 400, military: 80, morale: 2 }
  },
  {
    id: 'religion-synergy-2',
    name: '신앙의 힘',
    description: '종교 카드 2개: 매일 민심 +4, 식량 +100',
    icon: '⛪',
    tag: 'religion',
    requiredCards: 2,
    effect: { morale: 4, food: 100 }
  },
  {
    id: 'religion-synergy-3',
    name: '성지 순례',
    description: '종교 카드 3개: 매일 민심 +7, 금 +250, 식량 +150',
    icon: '🕌',
    tag: 'religion',
    requiredCards: 3,
    effect: { morale: 7, gold: 250, food: 150 }
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

// 패시브 카드 풀 - 총 130장
// Common 58장, Rare 40장, Epic 23장, Legendary 9장
export const PASSIVE_CARDS: PassiveCard[] = [
  // ============================================================
  // COMMON 카드 (58장)
  // 시너지 30장 + 비시너지 13장 + 꽝카드 12장 + 장수 3장
  // ============================================================

  // ========== 시너지 있는 COMMON (30장) ==========

  // --- 무역 (4장) ---
  {
    id: 'c-trade-1',
    name: '작은 상점',
    description: '매일 금 +80',
    icon: '🏪',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['trade'],
    effect: { type: 'resource', gold: 80 }
  },
  {
    id: 'c-trade-2',
    name: '행상인',
    description: '매일 금 +75',
    icon: '🎒',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['trade'],
    effect: { type: 'resource', gold: 75 }
  },
  {
    id: 'c-trade-3',
    name: '세금 징수',
    description: '매일 금 +70, 민심 -1',
    icon: '📜',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['trade'],
    effect: { type: 'resource', gold: 70, morale: -1 }
  },
  {
    id: 'c-trade-4',
    name: '도매 시장',
    description: '매일 금 +85',
    icon: '🏬',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['trade'],
    effect: { type: 'resource', gold: 85 }
  },

  // --- 농업 (4장) ---
  {
    id: 'c-agri-1',
    name: '텃밭',
    description: '매일 식량 +80',
    icon: '🥬',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['agriculture'],
    effect: { type: 'resource', food: 80 }
  },
  {
    id: 'c-agri-2',
    name: '어부의 그물',
    description: '매일 식량 +75',
    icon: '🎣',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['agriculture'],
    effect: { type: 'resource', food: 75 }
  },
  {
    id: 'c-agri-3',
    name: '가축 사육',
    description: '매일 식량 +70',
    icon: '🐄',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['agriculture'],
    effect: { type: 'resource', food: 70 }
  },
  {
    id: 'c-agri-4',
    name: '과수원',
    description: '매일 식량 +85',
    icon: '🍎',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['agriculture'],
    effect: { type: 'resource', food: 85 }
  },

  // --- 문화 (4장) ---
  {
    id: 'c-culture-1',
    name: '축제의 전통',
    description: '매일 민심 +2',
    icon: '🎭',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['culture'],
    effect: { type: 'resource', morale: 2 }
  },
  {
    id: 'c-culture-2',
    name: '거리 공연장',
    description: '매일 민심 +2',
    icon: '🎪',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['culture'],
    effect: { type: 'resource', morale: 2 }
  },
  {
    id: 'c-culture-3',
    name: '예술가 후원',
    description: '매일 민심 +2, 금 -20',
    icon: '🎨',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['culture'],
    effect: { type: 'resource', morale: 2, gold: -20 }
  },
  {
    id: 'c-culture-4',
    name: '작은 도서관',
    description: '매일 민심 +1, 금 +30',
    icon: '📚',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['culture'],
    effect: { type: 'resource', morale: 1, gold: 30 }
  },

  // --- 군사 (6장) ---
  {
    id: 'c-military-1',
    name: '강철 무기',
    description: '전투 시 공격력 +8%',
    icon: '⚔️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', attackBonus: 8 }
  },
  {
    id: 'c-military-2',
    name: '목책',
    description: '전투 시 방어력 +8%',
    icon: '🏚️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', defenseBonus: 8 }
  },
  {
    id: 'c-military-3',
    name: '민병대',
    description: '전투 시작 시 병력 +80',
    icon: '🛡️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', military: 80 }
  },
  {
    id: 'c-military-4',
    name: '병영',
    description: '매일 병력 +30',
    icon: '⛺',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['military'],
    effect: { type: 'resource', military: 30 }
  },
  {
    id: 'c-military-5',
    name: '훈련장',
    description: '전투 시 공격력 +7%',
    icon: '🎯',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', attackBonus: 7 }
  },
  {
    id: 'c-military-6',
    name: '보루',
    description: '전투 시 방어력 +7%',
    icon: '🏰',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', defenseBonus: 7 }
  },

  // --- 마법 (4장) ---
  {
    id: 'c-magic-1',
    name: '마법 상점',
    description: '매일 금 +85',
    icon: '🔮',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['magic'],
    effect: { type: 'resource', gold: 85 }
  },
  {
    id: 'c-magic-2',
    name: '연금술사',
    description: '매일 금 +70, 식량 +30',
    icon: '⚗️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['magic'],
    effect: { type: 'resource', gold: 70, food: 30 }
  },
  {
    id: 'c-magic-3',
    name: '마법 부적',
    description: '전투 시 공격력 +9%',
    icon: '🧿',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    synergyTags: ['magic'],
    effect: { type: 'combat', attackBonus: 9 }
  },
  {
    id: 'c-magic-4',
    name: '점성술사',
    description: '매일 민심 +1, 금 +40',
    icon: '🌙',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['magic'],
    effect: { type: 'resource', morale: 1, gold: 40 }
  },

  // --- 기술 (4장) ---
  {
    id: 'c-tech-1',
    name: '연구소',
    description: '매일 금 +70',
    icon: '🔬',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['technology'],
    effect: { type: 'resource', gold: 70 }
  },
  {
    id: 'c-tech-2',
    name: '대장간',
    description: '매일 금 +60, 병력 +20',
    icon: '🔨',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['technology'],
    effect: { type: 'resource', gold: 60, military: 20 }
  },
  {
    id: 'c-tech-3',
    name: '물레방아',
    description: '매일 식량 +50, 금 +30',
    icon: '⚙️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['technology'],
    effect: { type: 'resource', food: 50, gold: 30 }
  },
  {
    id: 'c-tech-4',
    name: '광산',
    description: '매일 금 +75',
    icon: '⛏️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['technology'],
    effect: { type: 'resource', gold: 75 }
  },

  // --- 종교 (3장) ---
  {
    id: 'c-religion-1',
    name: '작은 신전',
    description: '매일 민심 +2',
    icon: '⛪',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['religion'],
    effect: { type: 'resource', morale: 2 }
  },
  {
    id: 'c-religion-2',
    name: '수도사',
    description: '매일 민심 +1, 식량 +40',
    icon: '👼',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['religion'],
    effect: { type: 'resource', morale: 1, food: 40 }
  },
  {
    id: 'c-religion-3',
    name: '성유물',
    description: '매일 민심 +2, 금 +30',
    icon: '📿',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    synergyTags: ['religion'],
    effect: { type: 'resource', morale: 2, gold: 30 }
  },

  // --- 정복 (3장) ---
  {
    id: 'c-conquest-1',
    name: '전리품 수집',
    description: '전투 승리 시 금 +200',
    icon: '💎',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_win',
    synergyTags: ['conquest'],
    effect: { type: 'resource', gold: 200 }
  },
  {
    id: 'c-conquest-2',
    name: '약탈 부대',
    description: '전투 승리 시 금 +180, 식량 +50',
    icon: '⚡',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_win',
    synergyTags: ['conquest'],
    effect: { type: 'resource', gold: 180, food: 50 }
  },
  {
    id: 'c-conquest-3',
    name: '정복 깃발',
    description: '전투 승리 시 민심 +2',
    icon: '🚩',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_win',
    synergyTags: ['conquest'],
    effect: { type: 'resource', morale: 2 }
  },

  // ========== 시너지 없는 COMMON (13장) - 강화됨 ==========

  {
    id: 'c-neutral-1',
    name: '시장 개설',
    description: '매일 금 +110 (안정적인 수입)',
    icon: '💰',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    effect: { type: 'resource', gold: 110 }
  },
  {
    id: 'c-neutral-2',
    name: '작은 농장',
    description: '매일 식량 +120 (안정적인 생산)',
    icon: '🌾',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    effect: { type: 'resource', food: 120 }
  },
  {
    id: 'c-neutral-3',
    name: '이민 정책',
    description: '매일 인구 +40',
    icon: '👥',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    effect: { type: 'resource', population: 40 }
  },
  {
    id: 'c-neutral-4',
    name: '작은 번영',
    description: '매일 금 +70, 식량 +70 (균형잡힌 성장)',
    icon: '🌟',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    effect: { type: 'resource', gold: 70, food: 70 }
  },
  {
    id: 'c-neutral-5',
    name: '의용군',
    description: '전투 시작 시 병력 +110',
    icon: '🪖',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: { type: 'combat', military: 110 }
  },
  {
    id: 'c-neutral-6',
    name: '모집 캠페인',
    description: '병력 모집 시 추가 +40 병력',
    icon: '📣',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'recruit',
    effect: { type: 'resource', military: 40 }
  },
  {
    id: 'c-neutral-7',
    name: '재기의 의지',
    description: '전투 패배 시 민심 피해 -4 감소',
    icon: '💪',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_lose',
    effect: { type: 'resource', morale: 4 }
  },
  {
    id: 'c-neutral-8',
    name: '공공 사업',
    description: '매일 민심 +2, 금 -20',
    icon: '🏗️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    effect: { type: 'resource', morale: 2, gold: -20 }
  },
  {
    id: 'c-neutral-9',
    name: '절약 정책',
    description: '매일 금 +80',
    icon: '💵',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    effect: { type: 'resource', gold: 80 }
  },
  {
    id: 'c-neutral-10',
    name: '저장 창고',
    description: '매일 식량 +90',
    icon: '🏚️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    effect: { type: 'resource', food: 90 }
  },
  {
    id: 'c-neutral-11',
    name: '보급 체계',
    description: '전투 시작 시 병력 +80',
    icon: '📦',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: { type: 'combat', military: 80 }
  },
  {
    id: 'c-neutral-12',
    name: '마을 축제',
    description: '매일 민심 +3',
    icon: '🎉',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    effect: { type: 'resource', morale: 3 }
  },
  {
    id: 'c-neutral-13',
    name: '용병 고용',
    description: '병력 모집 시 추가 +35 병력, 금 -30',
    icon: '🗡️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'recruit',
    effect: { type: 'resource', military: 35 }
  },

  // ========== 꽝카드 COMMON (12장) ==========

  {
    id: 'curse-1',
    name: '부패한 관료',
    description: '매일 금 -50 (부패 확산)',
    icon: '💸',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    effect: { type: 'resource', gold: -50 }
  },
  {
    id: 'curse-2',
    name: '기근',
    description: '매일 식량 -40 (흉작)',
    icon: '🌑',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    effect: { type: 'resource', food: -40 }
  },
  {
    id: 'curse-3',
    name: '민심 동요',
    description: '매일 민심 -1 (불만 확산)',
    icon: '😡',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    effect: { type: 'resource', morale: -1 }
  },
  {
    id: 'curse-4',
    name: '낡은 장비',
    description: '전투 시 공격력 -5%',
    icon: '🗡️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: { type: 'combat', attackBonus: -5 }
  },
  {
    id: 'curse-5',
    name: '탈영병',
    description: '전투 시작 시 병력 -50',
    icon: '🏃',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: { type: 'combat', military: -50 }
  },
  {
    id: 'curse-6',
    name: '전염병',
    description: '매일 인구 -20, 민심 -1',
    icon: '🦠',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    effect: { type: 'resource', population: -20, morale: -1 }
  },
  {
    id: 'curse-7',
    name: '도적 출몰',
    description: '매일 금 -40',
    icon: '🏴‍☠️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    effect: { type: 'resource', gold: -40 }
  },
  {
    id: 'curse-8',
    name: '가뭄',
    description: '매일 식량 -35',
    icon: '☀️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    effect: { type: 'resource', food: -35 }
  },
  {
    id: 'curse-9',
    name: '반란의 조짐',
    description: '매일 민심 -2',
    icon: '⚠️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    effect: { type: 'resource', morale: -2 }
  },
  {
    id: 'curse-10',
    name: '훈련 부족',
    description: '전투 시 방어력 -6%',
    icon: '🛡️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: { type: 'combat', defenseBonus: -6 }
  },
  {
    id: 'curse-11',
    name: '사기 저하',
    description: '전투 시작 시 병력 -40',
    icon: '😰',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: { type: 'combat', military: -40 }
  },
  {
    id: 'curse-12',
    name: '높은 세금',
    description: '매일 금 +50, 민심 -2',
    icon: '📜',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'daily',
    effect: { type: 'resource', gold: 50, morale: -2 }
  },

  // ============================================================
  // RARE 카드 (40장 - 기존 37장 + 장수 3장)
  // 시너지 28장 + 비시너지 9장
  // ============================================================

  // ========== 시너지 있는 RARE (28장) ==========

  // --- 무역 (4장) ---
  {
    id: 'r-trade-1',
    name: '상인 길드',
    description: '매일 금 +180',
    icon: '🏛️',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['trade'],
    effect: { type: 'resource', gold: 180 }
  },
  {
    id: 'r-trade-2',
    name: '무역로 개척',
    description: '매일 금 +200',
    icon: '🚢',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['trade'],
    effect: { type: 'resource', gold: 200 }
  },
  {
    id: 'r-trade-3',
    name: '항구 도시',
    description: '매일 금 +170, 식량 +50',
    icon: '⛵',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['trade'],
    effect: { type: 'resource', gold: 170, food: 50 }
  },
  {
    id: 'r-trade-4',
    name: '관세 개혁',
    description: '매일 금 +190',
    icon: '📊',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['trade'],
    effect: { type: 'resource', gold: 190 }
  },

  // --- 농업 (4장) ---
  {
    id: 'r-agri-1',
    name: '비옥한 땅',
    description: '매일 식량 +180',
    icon: '🌻',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['agriculture'],
    effect: { type: 'resource', food: 180 }
  },
  {
    id: 'r-agri-2',
    name: '농장 확장',
    description: '매일 식량 +200',
    icon: '🚜',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['agriculture'],
    effect: { type: 'resource', food: 200 }
  },
  {
    id: 'r-agri-3',
    name: '곡물 창고',
    description: '매일 식량 +170, 금 +40',
    icon: '🏪',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['agriculture'],
    effect: { type: 'resource', food: 170, gold: 40 }
  },
  {
    id: 'r-agri-4',
    name: '밭갈이 개선',
    description: '매일 식량 +190',
    icon: '🌽',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['agriculture'],
    effect: { type: 'resource', food: 190 }
  },

  // --- 문화 (3장) ---
  {
    id: 'r-culture-1',
    name: '대극장',
    description: '매일 민심 +4',
    icon: '🎪',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['culture'],
    effect: { type: 'resource', morale: 4 }
  },
  {
    id: 'r-culture-2',
    name: '왕립 음악원',
    description: '매일 민심 +3, 금 +80',
    icon: '🎵',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['culture'],
    effect: { type: 'resource', morale: 3, gold: 80 }
  },
  {
    id: 'r-culture-3',
    name: '국립 미술관',
    description: '매일 민심 +4, 금 +60',
    icon: '🖼️',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['culture'],
    effect: { type: 'resource', morale: 4, gold: 60 }
  },

  // --- 군사 (5장) ---
  {
    id: 'r-military-1',
    name: '전술 교범',
    description: '전투 시 공격력 +18%',
    icon: '📜',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', attackBonus: 18 }
  },
  {
    id: 'r-military-2',
    name: '성벽 강화',
    description: '전투 시 방어력 +18%',
    icon: '🏰',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', defenseBonus: 18 }
  },
  {
    id: 'r-military-3',
    name: '전쟁의 기술',
    description: '전투 시 공격력 +12%, 방어력 +12%',
    icon: '⚔️',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', attackBonus: 12, defenseBonus: 12 }
  },
  {
    id: 'r-military-4',
    name: '중장갑 기병',
    description: '전투 시작 시 병력 +150, 공격력 +8%',
    icon: '🐴',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', military: 150, attackBonus: 8 }
  },
  {
    id: 'r-military-5',
    name: '궁병대',
    description: '전투 시 공격력 +15%',
    icon: '🏹',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', attackBonus: 15 }
  },

  // --- 마법 (4장) ---
  {
    id: 'r-magic-1',
    name: '마법 도서관',
    description: '전투 시 공격력 +15%',
    icon: '📚',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['magic'],
    effect: { type: 'combat', attackBonus: 15 }
  },
  {
    id: 'r-magic-2',
    name: '마법사 학교',
    description: '매일 금 +150, 민심 +1',
    icon: '🎓',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['magic'],
    effect: { type: 'resource', gold: 150, morale: 1 }
  },
  {
    id: 'r-magic-3',
    name: '마나 샘',
    description: '매일 금 +140, 식량 +60',
    icon: '💧',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['magic'],
    effect: { type: 'resource', gold: 140, food: 60 }
  },
  {
    id: 'r-magic-4',
    name: '마법 진지',
    description: '전투 시 방어력 +16%',
    icon: '🌀',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['magic'],
    effect: { type: 'combat', defenseBonus: 16 }
  },

  // --- 기술 (4장) ---
  {
    id: 'r-tech-1',
    name: '발명가 길드',
    description: '매일 금 +150',
    icon: '⚙️',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['technology'],
    effect: { type: 'resource', gold: 150 }
  },
  {
    id: 'r-tech-2',
    name: '공성 무기',
    description: '전투 시 공격력 +16%',
    icon: '🏹',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['technology'],
    effect: { type: 'combat', attackBonus: 16 }
  },
  {
    id: 'r-tech-3',
    name: '인쇄기',
    description: '매일 금 +130, 민심 +2',
    icon: '📰',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['technology'],
    effect: { type: 'resource', gold: 130, morale: 2 }
  },
  {
    id: 'r-tech-4',
    name: '나침반',
    description: '매일 금 +140, 식량 +50',
    icon: '🧭',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['technology'],
    effect: { type: 'resource', gold: 140, food: 50 }
  },

  // --- 종교 (2장) ---
  {
    id: 'r-religion-1',
    name: '대성당',
    description: '매일 민심 +3, 금 +100',
    icon: '⛪',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    synergyTags: ['religion'],
    effect: { type: 'resource', morale: 3, gold: 100 }
  },
  {
    id: 'r-religion-2',
    name: '성전 기사단',
    description: '전투 시 공격력 +14%, 민심 +1',
    icon: '⚔️',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['religion'],
    effect: { type: 'combat', attackBonus: 14 }
  },

  // --- 정복 (2장) ---
  {
    id: 'r-conquest-1',
    name: '전리품 약탈',
    description: '전투 승리 시 금 +400',
    icon: '💰',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_win',
    synergyTags: ['conquest'],
    effect: { type: 'resource', gold: 400 }
  },
  {
    id: 'r-conquest-2',
    name: '영토 확장',
    description: '전투 승리 시 금 +350, 인구 +30',
    icon: '🗺️',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_win',
    synergyTags: ['conquest'],
    effect: { type: 'resource', gold: 350, population: 30 }
  },

  // ========== 시너지 없는 RARE (9장) - 강화됨 ==========

  {
    id: 'r-neutral-1',
    name: '번영의 시대',
    description: '매일 금 +150, 식량 +150 (균형잡힌 발전)',
    icon: '🌈',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    effect: { type: 'resource', gold: 150, food: 150 }
  },
  {
    id: 'r-neutral-2',
    name: '예비군 소집',
    description: '전투 시작 시 병력 +220',
    icon: '🎖️',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    effect: { type: 'combat', military: 220 }
  },
  {
    id: 'r-neutral-3',
    name: '징병제 개선',
    description: '병력 모집 시 추가 +80 병력',
    icon: '🎯',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'recruit',
    effect: { type: 'resource', military: 80 }
  },
  {
    id: 'r-neutral-4',
    name: '풍요로운 수확',
    description: '매일 식량 +180, 민심 +2',
    icon: '🌾',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    effect: { type: 'resource', food: 180, morale: 2 }
  },
  {
    id: 'r-neutral-5',
    name: '상업 중심지',
    description: '매일 금 +190, 인구 +30',
    icon: '🏪',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'daily',
    effect: { type: 'resource', gold: 190, population: 30 }
  },
  {
    id: 'r-neutral-6',
    name: '전투 경험',
    description: '전투 시 공격력 +16%',
    icon: '⚔️',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    effect: { type: 'combat', attackBonus: 16 }
  },
  {
    id: 'r-neutral-7',
    name: '방어 전술',
    description: '전투 시 방어력 +17%',
    icon: '🛡️',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    effect: { type: 'combat', defenseBonus: 17 }
  },
  {
    id: 'r-neutral-8',
    name: '승전 축하',
    description: '전투 승리 시 민심 +5, 금 +250',
    icon: '🎉',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_win',
    effect: { type: 'resource', morale: 5, gold: 250 }
  },
  {
    id: 'r-neutral-9',
    name: '불굴의 정신',
    description: '전투 패배 시 민심 피해 -6 감소',
    icon: '💪',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_lose',
    effect: { type: 'resource', morale: 6 }
  },

  // ============================================================
  // EPIC 카드 (23장 - 기존 20장 + 장수 3장) - 모두 시너지
  // ============================================================

  // --- 무역 (3장) ---
  {
    id: 'e-trade-1',
    name: '실크로드',
    description: '매일 금 +350',
    icon: '🏪',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    synergyTags: ['trade'],
    effect: { type: 'resource', gold: 350 }
  },
  {
    id: 'e-trade-2',
    name: '무역 독점',
    description: '매일 금 +320, 민심 +2',
    icon: '👑',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    synergyTags: ['trade'],
    effect: { type: 'resource', gold: 320, morale: 2 }
  },
  {
    id: 'e-trade-3',
    name: '상업 제국',
    description: '매일 금 +300, 식량 +100',
    icon: '🌏',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    synergyTags: ['trade'],
    effect: { type: 'resource', gold: 300, food: 100 }
  },

  // --- 농업 (3장) ---
  {
    id: 'e-agri-1',
    name: '관개 시스템',
    description: '매일 식량 +350',
    icon: '💧',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    synergyTags: ['agriculture'],
    effect: { type: 'resource', food: 350 }
  },
  {
    id: 'e-agri-2',
    name: '비옥한 대지',
    description: '매일 식량 +320, 인구 +40',
    icon: '🌾',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    synergyTags: ['agriculture'],
    effect: { type: 'resource', food: 320, population: 40 }
  },
  {
    id: 'e-agri-3',
    name: '농업 혁명',
    description: '매일 식량 +300, 금 +100',
    icon: '🚜',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    synergyTags: ['agriculture'],
    effect: { type: 'resource', food: 300, gold: 100 }
  },

  // --- 문화 (2장) ---
  {
    id: 'e-culture-1',
    name: '박물관',
    description: '매일 민심 +5, 금 +150',
    icon: '🏛️',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    synergyTags: ['culture'],
    effect: { type: 'resource', morale: 5, gold: 150 }
  },
  {
    id: 'e-culture-2',
    name: '문화 중심지',
    description: '매일 민심 +6, 금 +120',
    icon: '🎨',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    synergyTags: ['culture'],
    effect: { type: 'resource', morale: 6, gold: 120 }
  },

  // --- 군사 (4장) ---
  {
    id: 'e-military-1',
    name: '정예 근위대',
    description: '전투 시작 시 병력 +350',
    icon: '🛡️',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', military: 350 }
  },
  {
    id: 'e-military-2',
    name: '전쟁의 신',
    description: '전투 시 공격력 +20%, 방어력 +20%',
    icon: '⚡',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', attackBonus: 20, defenseBonus: 20 }
  },
  {
    id: 'e-military-3',
    name: '전략가',
    description: '전투 시 공격력 +25%',
    icon: '🎖️',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', attackBonus: 25 }
  },
  {
    id: 'e-military-4',
    name: '요새',
    description: '전투 시 방어력 +25%',
    icon: '🏰',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', defenseBonus: 25 }
  },

  // --- 마법 (3장) ---
  {
    id: 'e-magic-1',
    name: '비전의 탑',
    description: '전투 시 공격력 +28%',
    icon: '🗼',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['magic'],
    effect: { type: 'combat', attackBonus: 28 }
  },
  {
    id: 'e-magic-2',
    name: '수정 궁전',
    description: '매일 금 +250, 민심 +3',
    icon: '💎',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    synergyTags: ['magic'],
    effect: { type: 'resource', gold: 250, morale: 3 }
  },
  {
    id: 'e-magic-3',
    name: '마법 결계',
    description: '전투 시 방어력 +23%',
    icon: '🔮',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['magic'],
    effect: { type: 'combat', defenseBonus: 23 }
  },

  // --- 기술 (2장) ---
  {
    id: 'e-tech-1',
    name: '증기 기관',
    description: '매일 금 +300, 병력 +50',
    icon: '⚙️',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    synergyTags: ['technology'],
    effect: { type: 'resource', gold: 300, military: 50 }
  },
  {
    id: 'e-tech-2',
    name: '화약 무기',
    description: '전투 시 공격력 +24%',
    icon: '💣',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['technology'],
    effect: { type: 'combat', attackBonus: 24 }
  },

  // --- 종교 (2장) ---
  {
    id: 'e-religion-1',
    name: '성지',
    description: '매일 민심 +6, 금 +150, 식량 +80',
    icon: '🕌',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    synergyTags: ['religion'],
    effect: { type: 'resource', morale: 6, gold: 150, food: 80 }
  },
  {
    id: 'e-religion-2',
    name: '신의 은총',
    description: '매일 민심 +5, 식량 +120',
    icon: '✨',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'daily',
    synergyTags: ['religion'],
    effect: { type: 'resource', morale: 5, food: 120 }
  },

  // --- 정복 (1장) ---
  {
    id: 'e-conquest-1',
    name: '정복의 깃발',
    description: '전투 승리 시 금 +600, 민심 +3',
    icon: '🚩',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_win',
    synergyTags: ['conquest'],
    effect: { type: 'resource', gold: 600, morale: 3 }
  },

  // ============================================================
  // LEGENDARY 카드 (9장 - 기존 8장 + 장수 1장) - 모두 시너지
  // ============================================================

  {
    id: 'l-trade-1',
    name: '세계 무역망',
    description: '매일 금 +600, 식량 +200, 민심 +3',
    icon: '🌍',
    image: '/images/passive/solderAdd.png',
    rarity: 'legendary',
    trigger: 'daily',
    synergyTags: ['trade'],
    effect: { type: 'resource', gold: 600, food: 200, morale: 3 }
  },
  {
    id: 'l-agri-1',
    name: '대지의 축복',
    description: '매일 식량 +700, 인구 +80, 민심 +3',
    icon: '🌾',
    image: '/images/passive/solderAdd.png',
    rarity: 'legendary',
    trigger: 'daily',
    synergyTags: ['agriculture'],
    effect: { type: 'resource', food: 700, population: 80, morale: 3 }
  },
  {
    id: 'l-culture-1',
    name: '문화의 정수',
    description: '매일 민심 +8, 금 +300, 인구 +50',
    icon: '🎭',
    image: '/images/passive/solderAdd.png',
    rarity: 'legendary',
    trigger: 'daily',
    synergyTags: ['culture'],
    effect: { type: 'resource', morale: 8, gold: 300, population: 50 }
  },
  {
    id: 'l-military-1',
    name: '불패의 군단',
    description: '전투 시작 시 병력 +600, 공격력 +35%',
    icon: '👹',
    image: '/images/passive/solderAdd.png',
    rarity: 'legendary',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', military: 600, attackBonus: 35 }
  },
  {
    id: 'l-magic-1',
    name: '대마법사의 유산',
    description: '전투 시 공격력 +40%, 매일 금 +400',
    icon: '🔮',
    image: '/images/passive/solderAdd.png',
    rarity: 'legendary',
    trigger: 'battle_start',
    synergyTags: ['magic'],
    effect: { type: 'combat', attackBonus: 40 }
  },
  {
    id: 'l-tech-1',
    name: '미래 기술',
    description: '매일 금 +500, 병력 +100, 민심 +3',
    icon: '🚀',
    image: '/images/passive/solderAdd.png',
    rarity: 'legendary',
    trigger: 'daily',
    synergyTags: ['technology'],
    effect: { type: 'resource', gold: 500, military: 100, morale: 3 }
  },
  {
    id: 'l-religion-1',
    name: '신의 축복',
    description: '매일 금 +500, 식량 +400, 민심 +4',
    icon: '✨',
    image: '/images/passive/solderAdd.png',
    rarity: 'legendary',
    trigger: 'daily',
    synergyTags: ['religion'],
    effect: { type: 'resource', gold: 500, food: 400, morale: 4 }
  },
  {
    id: 'l-conquest-1',
    name: '제국의 야망',
    description: '전투 승리 시 금 +1000, 병력 +150, 민심 +6',
    icon: '🔥',
    image: '/images/passive/solderAdd.png',
    rarity: 'legendary',
    trigger: 'battle_win',
    synergyTags: ['conquest'],
    effect: { type: 'resource', gold: 1000, military: 150, morale: 6 }
  },

  // ============================================================
  // 장수 카드 (35장 - 기존 25장 + 추가 10장)
  // Common 13장, Rare 11장, Epic 8장, Legendary 3장
  // ============================================================

  // ========== COMMON 장수 카드 (10장) ==========
  {
    id: 'gen-c-1',
    name: '검사 이한',
    description: '전투 시 공격력 +5%',
    icon: '⚔️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: { type: 'combat', attackBonus: 5 }
  },
  {
    id: 'gen-c-2',
    name: '궁수 민서',
    description: '전투 시 공격력 +4%',
    icon: '🏹',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: { type: 'combat', attackBonus: 4 }
  },
  {
    id: 'gen-c-3',
    name: '방패병 준호',
    description: '전투 시 방어력 +5%',
    icon: '🛡️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: { type: 'combat', defenseBonus: 5 }
  },
  {
    id: 'gen-c-4',
    name: '창병 서연',
    description: '전투 시 공격력 +5%',
    icon: '🔱',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: { type: 'combat', attackBonus: 5 }
  },
  {
    id: 'gen-c-5',
    name: '기병 태준',
    description: '전투 시 공격력 +5%, 방어력 +3%',
    icon: '🐴',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: { type: 'combat', attackBonus: 5, defenseBonus: 3 }
  },
  {
    id: 'gen-c-6',
    name: '참모 지우',
    description: '전투 시 방어력 +6%',
    icon: '📜',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: { type: 'combat', defenseBonus: 6 }
  },
  {
    id: 'gen-c-7',
    name: '도끼병 강민',
    description: '전투 시 공격력 +6%',
    icon: '🪓',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: { type: 'combat', attackBonus: 6 }
  },
  {
    id: 'gen-c-8',
    name: '치유사 혜진',
    description: '전투 승리 시 병력 +50',
    icon: '💊',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_win',
    effect: { type: 'resource', military: 50 }
  },
  {
    id: 'gen-c-9',
    name: '정찰병 유진',
    description: '전투 시 공격력 +4%, 방어력 +3%',
    icon: '🔍',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: { type: 'combat', attackBonus: 4, defenseBonus: 3 }
  },
  {
    id: 'gen-c-10',
    name: '대장장이 성호',
    description: '전투 시 공격력 +4%, 방어력 +4%',
    icon: '🔨',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    effect: { type: 'combat', attackBonus: 4, defenseBonus: 4 }
  },

  // ========== RARE 장수 카드 (8장) ==========
  {
    id: 'gen-r-1',
    name: '검성 리안',
    description: '전투 시 공격력 +10%',
    icon: '⚔️',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', attackBonus: 10 }
  },
  {
    id: 'gen-r-2',
    name: '신궁 아라',
    description: '전투 시 공격력 +9%',
    icon: '🏹',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', attackBonus: 9 }
  },
  {
    id: 'gen-r-3',
    name: '철벽 태오',
    description: '전투 시 방어력 +11%',
    icon: '🛡️',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', defenseBonus: 11 }
  },
  {
    id: 'gen-r-4',
    name: '천재 책사 현우',
    description: '전투 시 방어력 +10%',
    icon: '📚',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', defenseBonus: 10 }
  },
  {
    id: 'gen-r-5',
    name: '기마대장 소라',
    description: '전투 시 공격력 +8%, 방어력 +7%',
    icon: '🐴',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', attackBonus: 8, defenseBonus: 7 }
  },
  {
    id: 'gen-r-6',
    name: '암살자 카인',
    description: '전투 시 공격력 +11%',
    icon: '🗡️',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', attackBonus: 11 }
  },
  {
    id: 'gen-r-7',
    name: '마법사 루나',
    description: '전투 시 공격력 +9%, 방어력 +6%',
    icon: '🔮',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['magic', 'military'],
    effect: { type: 'combat', attackBonus: 9, defenseBonus: 6 }
  },
  {
    id: 'gen-r-8',
    name: '중장보병 진우',
    description: '전투 시 공격력 +8%, 방어력 +8%',
    icon: '⚔️',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', attackBonus: 8, defenseBonus: 8 }
  },

  // ========== EPIC 장수 카드 (5장) ==========
  {
    id: 'gen-e-1',
    name: '전쟁군주 엘리스',
    description: '전투 시 공격력 +17%, 방어력 +10%',
    icon: '👑',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['military', 'conquest'],
    effect: { type: 'combat', attackBonus: 17, defenseBonus: 10 }
  },
  {
    id: 'gen-e-2',
    name: '용기사 드레이크',
    description: '전투 시 공격력 +20%, 방어력 +8%',
    icon: '🐉',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['military', 'conquest'],
    effect: { type: 'combat', attackBonus: 20, defenseBonus: 8 }
  },
  {
    id: 'gen-e-3',
    name: '대마법사 세라핌',
    description: '전투 시 공격력 +18%, 방어력 +10%',
    icon: '🌟',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['magic', 'military'],
    effect: { type: 'combat', attackBonus: 18, defenseBonus: 10 }
  },
  {
    id: 'gen-e-4',
    name: '수호자 아이언',
    description: '전투 시 방어력 +22%, 공격력 +8%',
    icon: '🛡️',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', defenseBonus: 22, attackBonus: 8 }
  },
  {
    id: 'gen-e-5',
    name: '암살자 제로',
    description: '전투 시 공격력 +19%, 방어력 +7%',
    icon: '🌑',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['military', 'conquest'],
    effect: { type: 'combat', attackBonus: 19, defenseBonus: 7 }
  },

  // ========== LEGENDARY 장수 카드 (2장) ==========
  {
    id: 'gen-l-1',
    name: '불멸의 황제 아르테미스',
    description: '전투 시 공격력 +30%, 방어력 +20%',
    icon: '👑',
    image: '/images/passive/solderAdd.png',
    rarity: 'legendary',
    trigger: 'battle_start',
    synergyTags: ['military', 'conquest'],
    effect: { type: 'combat', attackBonus: 30, defenseBonus: 20 }
  },
  {
    id: 'gen-l-2',
    name: '신의 사도 미카엘',
    description: '전투 시 공격력 +25%, 방어력 +25%',
    icon: '✨',
    image: '/images/passive/solderAdd.png',
    rarity: 'legendary',
    trigger: 'battle_start',
    synergyTags: ['military', 'religion'],
    effect: { type: 'combat', attackBonus: 25, defenseBonus: 25 }
  },

  // ========== 추가 장수 카드 (10장) ==========
  // ========== COMMON 추가 장수 카드 (3장) ==========
  {
    id: 'gen-c-11',
    name: '방패의 수호자 브랜',
    description: '전투 시 방어력 +6%',
    icon: '🛡️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', defenseBonus: 6 }
  },
  {
    id: 'gen-c-12',
    name: '날쌘 정찰병 카일',
    description: '전투 시 공격력 +5%',
    icon: '🏃',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', attackBonus: 5 }
  },
  {
    id: 'gen-c-13',
    name: '노련한 용병 그렉',
    description: '전투 시 공격력 +4%, 방어력 +3%',
    icon: '⚔️',
    image: '/images/passive/solderAdd.png',
    rarity: 'common',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', attackBonus: 4, defenseBonus: 3 }
  },

  // ========== RARE 추가 장수 카드 (3장) ==========
  {
    id: 'gen-r-9',
    name: '마법검사 엘리나',
    description: '전투 시 공격력 +12%',
    icon: '🗡️',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['military', 'magic'],
    effect: { type: 'combat', attackBonus: 12 }
  },
  {
    id: 'gen-r-10',
    name: '철벽의 기사 로렌',
    description: '전투 시 방어력 +11%',
    icon: '🏰',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['military'],
    effect: { type: 'combat', defenseBonus: 11 }
  },
  {
    id: 'gen-r-11',
    name: '암흑기사 제이크',
    description: '전투 시 공격력 +10%, 방어력 +5%',
    icon: '⚫',
    image: '/images/passive/solderAdd.png',
    rarity: 'rare',
    trigger: 'battle_start',
    synergyTags: ['military', 'magic'],
    effect: { type: 'combat', attackBonus: 10, defenseBonus: 5 }
  },

  // ========== EPIC 추가 장수 카드 (3장) ==========
  {
    id: 'gen-e-6',
    name: '드래곤 슬레이어 시그문트',
    description: '전투 시 공격력 +18%',
    icon: '🐉',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['military', 'conquest'],
    effect: { type: 'combat', attackBonus: 18 }
  },
  {
    id: 'gen-e-7',
    name: '성녀 이사벨라',
    description: '전투 시 방어력 +16%',
    icon: '💫',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['military', 'religion'],
    effect: { type: 'combat', defenseBonus: 16 }
  },
  {
    id: 'gen-e-8',
    name: '전설의 용사 갈란',
    description: '전투 시 공격력 +15%, 방어력 +10%',
    icon: '⚡',
    image: '/images/passive/solderAdd.png',
    rarity: 'epic',
    trigger: 'battle_start',
    synergyTags: ['military', 'conquest'],
    effect: { type: 'combat', attackBonus: 15, defenseBonus: 10 }
  },

  // ========== LEGENDARY 추가 장수 카드 (1장) ==========
  {
    id: 'gen-l-3',
    name: '천상의 수호자 가브리엘',
    description: '전투 시 공격력 +28%, 방어력 +22%',
    icon: '🌟',
    image: '/images/passive/solderAdd.png',
    rarity: 'legendary',
    trigger: 'battle_start',
    synergyTags: ['military', 'religion', 'magic'],
    effect: { type: 'combat', attackBonus: 28, defenseBonus: 22 }
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
