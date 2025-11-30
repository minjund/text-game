// 게임 데이터 타입 정의

export interface Kingdom {
  id: string
  name: string
  ruler: string // 플레이어 이름
  resources: {
    food: number // 식량
    gold: number // 금
    soldiers: number // 병력
    morale: number // 민심 (0-100)
  }
  day: number // 게임 일수
}

export type GeneralRarity = 'common' | 'rare' | 'epic'

export interface General {
  id: string
  name: string
  title: string // 칭호 (예: 맹장, 책사, 궁수)
  rarity: GeneralRarity // 장수 등급: 일반(common), 희귀(rare), 영웅(epic)
  image?: string // 장수 이미지 경로
  stats: {
    power: number // 무력 (1-100)
    intelligence: number // 지력 (1-100)
    leadership: number // 통솔 (1-100)
  }
  skills: Skill[]
  assignedSoldiers: number // 배정된 병력
}

export interface Skill {
  id: string
  name: string
  description: string
  successRate: number // 성공 확률 (0-100)
  effect: {
    type: 'damage' | 'defense' | 'buff' | 'debuff'
    value: number
  }
}

export interface Battle {
  id: string
  attacker: {
    kingdomName: string
    generals: General[]
  }
  defender: {
    kingdomName: string
    generals: General[]
  }
  log: BattleLog[]
  result?: 'victory' | 'defeat' | 'ongoing'
}

export interface BattleLog {
  turn: number
  generalName: string
  action: string
  success: boolean
  message: string
  story?: string // 스토리 텍스트
  speaker?: string // 대사를 말하는 캐릭터
  dialogue?: string // 대사 내용
  narrativeType?: 'action' | 'dialogue' | 'narration' // 서술 타입
}

export interface EventCard {
  id: string
  title: string
  description: string
  choices: EventChoice[]
  image?: string // 나중에 이미지 추가 가능
}

export interface EventChoice {
  text: string
  cost?: {
    food?: number
    gold?: number
    soldiers?: number
  }
  reward?: {
    food?: number
    gold?: number
    soldiers?: number
    morale?: number
  }
  giveCard?: boolean // 카드 선택 모달을 열지 여부
  cardCount?: number // 제공할 카드 수 (기본값: 3)
}

// 갈림길 카드 (25일마다)
export interface CrossroadCard {
  id: string
  title: string
  description: string
  choices: CrossroadChoice[]
  image?: string
}

export interface CrossroadChoice {
  text: string
  description: string
  effect: PermanentEffect
}

export interface PermanentEffect {
  type: 'production' | 'discount' | 'bonus' | 'special'
  name: string
  description: string
  value?: {
    foodBonus?: number // 매일 식량 생산 보너스 %
    goldBonus?: number // 매일 금 생산 보너스 %
    upkeepDiscount?: number // 병력 유지비 감소 %
    recruitDiscount?: number // 병력 모집 비용 감소 %
    moraleBonus?: number // 민심 보너스
    battleBonus?: number // 전투 승률 보너스 %
  }
}

// 멀티플레이 타입
export interface PlayerProfile {
  id: string
  username: string
  kingdomName: string
  level: number
  rank: number
  totalWins: number
  totalLosses: number
  trophies: number
  lastActive: Date
  kingdom: Kingdom
  generals: General[]
}

export interface PVPMatch {
  id: string
  attacker: PlayerProfile
  defender: PlayerProfile
  battle: Battle
  trophyChange: number
  rewards: {
    gold: number
    food: number
  }
  timestamp: Date
}

export interface Leaderboard {
  players: LeaderboardEntry[]
  myRank?: number
}

export interface LeaderboardEntry {
  rank: number
  player: PlayerProfile
  trophies: number
  wins: number
  losses: number
}
