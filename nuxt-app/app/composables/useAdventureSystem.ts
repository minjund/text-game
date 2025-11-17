import { ref, computed } from 'vue'
import type {
  AdventureState,
  AdventureNode,
  NodeType,
  AdventureReward,
  EnemyTemplate
} from '~/types/adventure'
import { NODE_INFO, ENEMY_TEMPLATES } from '~/types/adventure'
import type { Resources } from '~/types/game'
import { drawRandomCards } from '~/types/passive-cards'

export const useAdventureSystem = (
  resources: any,
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void
) => {
  // 모험 상태
  const adventureState = ref<AdventureState>({
    active: false,
    currentNodeId: null,
    nodes: [],
    depth: 0,
    startingResources: {
      soldiers: 0,
      gold: 0,
      food: 0
    },
    accumulatedRewards: {
      gold: 0,
      food: 0,
      soldiers: 0,
      cards: []
    },
    visitedNodes: []
  })

  // 맵 생성 (한 줄로 7개 노드)
  const generateAdventureMap = (): AdventureNode[] => {
    const nodes: AdventureNode[] = []
    const totalNodes = 7 // 총 7개 노드

    // 노드 타입 순서 정의 (시작 -> 중간 노드들 -> 보스)
    const nodeTypes: NodeType[] = [
      'start',    // 0번: 시작
      'battle',   // 1번: 일반 전투
      'event',    // 2번: 이벤트
      'shop',     // 3번: 상점
      'battle',   // 4번: 일반 전투
      'elite',    // 5번: 엘리트 전투
      'boss'      // 6번: 보스
    ]

    // 7개 노드 생성 (한 줄로 배치)
    for (let i = 0; i < totalNodes; i++) {
      const nodeId = `node_${i}`
      const type = nodeTypes[i]

      // 위치 계산 (x축으로 균등 분산, y는 중앙에 고정)
      const x = i / (totalNodes - 1) // 0.0 ~ 1.0
      const y = 0.5 // 중앙에 고정

      const node: AdventureNode = {
        id: nodeId,
        type,
        status: i === 0 ? 'current' : 'locked',
        position: { x, y },
        connections: [],
        completed: false
      }

      // 다음 노드와 연결 (마지막 노드 제외)
      if (i < totalNodes - 1) {
        node.connections.push(`node_${i + 1}`)
      }

      // 전투 노드면 적 정보 추가
      if (type === 'battle' || type === 'elite' || type === 'boss') {
        const enemy = generateEnemy(type, i)
        node.enemy = enemy
      }

      nodes.push(node)
    }

    return nodes
  }

  // 적 생성
  const generateEnemy = (type: 'battle' | 'elite' | 'boss', layer: number) => {
    const templates = ENEMY_TEMPLATES.filter(t => t.type === (type === 'battle' ? 'normal' : type))
    const template = templates[Math.floor(Math.random() * templates.length)]

    // 층에 따라 난이도 증가
    const difficultyMultiplier = 1 + (layer * 0.2)

    const power = Math.floor(template.basePower * difficultyMultiplier)
    const health = Math.floor(template.baseHealth * difficultyMultiplier)

    // 보상 계산
    const baseGold = type === 'boss' ? 1000 : type === 'elite' ? 500 : 300
    const baseFood = type === 'boss' ? 500 : type === 'elite' ? 300 : 200

    const rewards: AdventureReward = {
      gold: Math.floor(baseGold * difficultyMultiplier),
      food: Math.floor(baseFood * difficultyMultiplier),
      cards: drawRandomCards(type === 'boss' ? 3 : type === 'elite' ? 2 : 1)
    }

    return {
      name: template.name,
      power,
      health,
      rewards
    }
  }

  // 모험 시작
  const startAdventure = () => {
    // 현재 자원 저장
    adventureState.value.startingResources = {
      soldiers: resources.soldiers,
      gold: resources.gold,
      food: resources.food
    }

    // 맵 생성
    const nodes = generateAdventureMap()
    adventureState.value.nodes = nodes
    adventureState.value.active = true
    adventureState.value.depth = 0
    adventureState.value.currentNodeId = nodes[0].id
    adventureState.value.visitedNodes = []
    adventureState.value.accumulatedRewards = {
      gold: 0,
      food: 0,
      soldiers: 0,
      cards: []
    }

    showNotification('모험을 시작합니다!', 'info')
  }

  // 노드 이동
  const moveToNode = (nodeId: string) => {
    const node = adventureState.value.nodes.find(n => n.id === nodeId)
    if (!node) return

    // 현재 노드 완료 처리
    const currentNode = adventureState.value.nodes.find(n => n.id === adventureState.value.currentNodeId)
    if (currentNode) {
      currentNode.status = 'completed'
      currentNode.completed = true
    }

    // 새 노드로 이동
    node.status = 'current'
    adventureState.value.currentNodeId = nodeId
    adventureState.value.visitedNodes.push(nodeId)
    adventureState.value.depth++

    // 연결된 노드들을 available로 변경
    node.connections.forEach(connId => {
      const connNode = adventureState.value.nodes.find(n => n.id === connId)
      if (connNode && connNode.status === 'locked') {
        connNode.status = 'available'
      }
    })
  }

  // 노드 완료 (보상 획득)
  const completeNode = (rewards: AdventureReward) => {
    adventureState.value.accumulatedRewards.gold += rewards.gold
    adventureState.value.accumulatedRewards.food += rewards.food

    if (rewards.cards) {
      adventureState.value.accumulatedRewards.cards.push(...rewards.cards)
    }
  }

  // 모험 종료 - 승리
  const completeAdventure = () => {
    adventureState.value.result = 'victory'

    // 보상 지급
    resources.gold += adventureState.value.accumulatedRewards.gold
    resources.food += adventureState.value.accumulatedRewards.food

    showNotification(
      `모험 완료! 금 +${adventureState.value.accumulatedRewards.gold}, 식량 +${adventureState.value.accumulatedRewards.food}`,
      'success'
    )

    // 모험 종료
    adventureState.value.active = false
  }

  // 모험 포기 (지금까지 획득한 보상만 가져감)
  const retreatAdventure = () => {
    adventureState.value.result = 'retreat'

    // 보상의 50%만 가져감
    const halfGold = Math.floor(adventureState.value.accumulatedRewards.gold * 0.5)
    const halfFood = Math.floor(adventureState.value.accumulatedRewards.food * 0.5)

    resources.gold += halfGold
    resources.food += halfFood

    showNotification(`모험 포기... 금 +${halfGold}, 식량 +${halfFood} (50%)`, 'info')

    // 모험 종료
    adventureState.value.active = false
  }

  // 모험 실패 (패배)
  const failAdventure = () => {
    adventureState.value.result = 'defeat'

    // 병력 손실 30%
    resources.soldiers = Math.floor(resources.soldiers * 0.7)

    showNotification('모험 실패... 병력 30% 손실', 'error')

    // 모험 종료
    adventureState.value.active = false
  }

  // 현재 노드 가져오기
  const currentNode = computed(() => {
    if (!adventureState.value.currentNodeId) return null
    return adventureState.value.nodes.find(n => n.id === adventureState.value.currentNodeId) || null
  })

  // 이동 가능한 노드들
  const availableNodes = computed(() => {
    if (!currentNode.value) return []
    return adventureState.value.nodes.filter(n =>
      currentNode.value!.connections.includes(n.id) && n.status === 'available'
    )
  })

  return {
    adventureState,
    currentNode,
    availableNodes,
    startAdventure,
    moveToNode,
    completeNode,
    completeAdventure,
    retreatAdventure,
    failAdventure,
    NODE_INFO
  }
}
