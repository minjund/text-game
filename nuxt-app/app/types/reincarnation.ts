import type { PassiveCard } from './passive-cards'

// 환생 정보
export interface ReincarnationData {
  count: number // 환생 횟수
  inheritedCard: PassiveCard | null // 현재 환생에서 선택한 카드 (하위 호환성)
  inheritedCards: PassiveCard[] // 누적된 모든 상속 카드
  totalDaysPlayed: number // 총 플레이한 일수
  highestDay: number // 최고 도달 일수
  bonuses: ReincarnationBonus[] // 환생 보너스
  kingdomName?: string // 왕국 이름 (환생 시 유지)
}

// 환생 보너스
export interface ReincarnationBonus {
  id: string
  name: string
  description: string
  icon: string
  effect: {
    morale?: number
    gold?: number
    military?: number
    food?: number
    population?: number
  }
}

// 환생 보너스 목록 (환생 횟수에 따라 누적)
export const REINCARNATION_BONUSES: ReincarnationBonus[] = [
  {
    id: 'first-reincarnation',
    name: '환생의 축복',
    description: '첫 환생 달성! 시작 자원 +10%',
    icon: '✨',
    effect: {
      gold: 100,
      food: 100,
      military: 50
    }
  },
  {
    id: 'veteran-soul',
    name: '숙련된 영혼',
    description: '2회 환생 달성! 시작 자원 +20%',
    icon: '🔮',
    effect: {
      gold: 200,
      food: 200,
      military: 100,
      morale: 5
    }
  },
  {
    id: 'master-reincarnator',
    name: '환생의 대가',
    description: '3회 환생 달성! 시작 자원 +30%',
    icon: '👑',
    effect: {
      gold: 300,
      food: 300,
      military: 150,
      morale: 10
    }
  },
  {
    id: 'immortal-legend',
    name: '불멸의 전설',
    description: '5회 환생 달성! 시작 자원 +50%',
    icon: '💫',
    effect: {
      gold: 500,
      food: 500,
      military: 250,
      morale: 15,
      population: 100
    }
  }
]

// 환생 보너스 계산
export function calculateReincarnationBonuses(reincarnationCount: number): ReincarnationBonus[] {
  const bonuses: ReincarnationBonus[] = []

  if (reincarnationCount >= 1) bonuses.push(REINCARNATION_BONUSES[0])
  if (reincarnationCount >= 2) bonuses.push(REINCARNATION_BONUSES[1])
  if (reincarnationCount >= 3) bonuses.push(REINCARNATION_BONUSES[2])
  if (reincarnationCount >= 5) bonuses.push(REINCARNATION_BONUSES[3])

  return bonuses
}

// 총 보너스 합계 계산
export function getTotalBonuses(bonuses: ReincarnationBonus[]) {
  return bonuses.reduce((total, bonus) => {
    return {
      morale: (total.morale || 0) + (bonus.effect.morale || 0),
      gold: (total.gold || 0) + (bonus.effect.gold || 0),
      military: (total.military || 0) + (bonus.effect.military || 0),
      food: (total.food || 0) + (bonus.effect.food || 0),
      population: (total.population || 0) + (bonus.effect.population || 0)
    }
  }, { morale: 0, gold: 0, military: 0, food: 0, population: 0 })
}
