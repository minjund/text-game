import type { PassiveCard } from './passive-cards'
import type { General } from './game'

// 노드 타입
export type NodeType =
  | 'start'      // 시작
  | 'battle'     // 일반 전투
  | 'elite'      // 엘리트 전투
  | 'boss'       // 보스 전투
  | 'event'      // 랜덤 이벤트
  | 'shop'       // 상점
  | 'rest'       // 휴식
  | 'treasure'   // 보물

// 노드 상태
export type NodeStatus = 'locked' | 'available' | 'current' | 'completed'

// 모험 노드
export interface AdventureNode {
  id: string
  type: NodeType
  status: NodeStatus
  position: { x: number; y: number } // 맵상 위치
  connections: string[] // 연결된 노드 ID들

  // 전투 관련 (type이 battle, elite, boss일 때)
  enemy?: {
    name: string
    power: number
    health: number
    rewards: AdventureReward
  }

  // 이벤트 관련 (type이 event일 때)
  eventId?: string

  // 완료 여부
  completed: boolean
}

// 모험 보상
export interface AdventureReward {
  gold: number
  food: number
  cards?: PassiveCard[] // 선택 가능한 카드들
  general?: General // 장수 영입 기회
}

// 모험 상태
export interface AdventureState {
  active: boolean // 모험 중인지
  currentNodeId: string | null // 현재 위치
  nodes: AdventureNode[] // 전체 노드들
  depth: number // 진행 깊이 (1~5층)

  // 모험 시작 시 상태 저장
  startingResources: {
    soldiers: number
    gold: number
    food: number
  }

  // 누적 보상
  accumulatedRewards: {
    gold: number
    food: number
    soldiers: number
    cards: PassiveCard[]
  }

  // 모험 중 이벤트 기록
  visitedNodes: string[]

  // 모험 결과
  result?: 'victory' | 'defeat' | 'retreat'
}

// 노드 정보 템플릿
export const NODE_INFO: Record<NodeType, { icon: string; name: string; description: string; color: string }> = {
  start: {
    icon: '🚪',
    name: '입구',
    description: '모험이 시작되는 곳',
    color: 'slate'
  },
  battle: {
    icon: '⚔️',
    name: '전투',
    description: '적과의 전투',
    color: 'red'
  },
  elite: {
    icon: '🔥',
    name: '엘리트',
    description: '강력한 적과의 전투',
    color: 'orange'
  },
  boss: {
    icon: '👑',
    name: '보스',
    description: '최종 관문',
    color: 'purple'
  },
  event: {
    icon: '❓',
    name: '이벤트',
    description: '무슨 일이 일어날까?',
    color: 'blue'
  },
  shop: {
    icon: '🏪',
    name: '상점',
    description: '물건을 사고팔 수 있는 곳',
    color: 'yellow'
  },
  rest: {
    icon: '🏕️',
    name: '휴식처',
    description: '회복하거나 강화할 수 있는 곳',
    color: 'green'
  },
  treasure: {
    icon: '💎',
    name: '보물',
    description: '귀중한 보상을 얻을 수 있는 곳',
    color: 'cyan'
  }
}

// 적 템플릿
export interface EnemyTemplate {
  name: string
  basePower: number
  baseHealth: number
  type: 'normal' | 'elite' | 'boss'
}

export const ENEMY_TEMPLATES: EnemyTemplate[] = [
  // 일반 적
  { name: '산적단', basePower: 300, baseHealth: 800, type: 'normal' },
  { name: '용병 부대', basePower: 350, baseHealth: 900, type: 'normal' },
  { name: '반란군', basePower: 400, baseHealth: 1000, type: 'normal' },
  { name: '야만족', basePower: 380, baseHealth: 950, type: 'normal' },
  { name: '도적 연합', basePower: 420, baseHealth: 1100, type: 'normal' },

  // 엘리트 적
  { name: '흑기사단', basePower: 600, baseHealth: 1500, type: 'elite' },
  { name: '드래곤 기사', basePower: 650, baseHealth: 1600, type: 'elite' },
  { name: '암살자 길드', basePower: 700, baseHealth: 1400, type: 'elite' },

  // 보스
  { name: '고대 용', basePower: 1000, baseHealth: 3000, type: 'boss' },
  { name: '마왕', basePower: 1200, baseHealth: 3500, type: 'boss' },
  { name: '타락한 영웅', basePower: 1100, baseHealth: 3200, type: 'boss' }
]
