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

  // 맵 생성 (7개 층, 각 층당 최대 4개 노드)
  const generateAdventureMap = (): AdventureNode[] => {
    const nodes: AdventureNode[] = []

    // 7개 층 구조: [1개] -> [4개] -> [4개] -> [4개] -> [4개] -> [3개] -> [1개]
    const layers = [
      // 층 0: 시작 (1개)
      [
        { type: 'start' as NodeType, x: 0.5 }
      ],
      // 층 1: 4개
      [
        { type: 'battle' as NodeType, x: 0.125 },
        { type: 'event' as NodeType, x: 0.375 },
        { type: 'shop' as NodeType, x: 0.625 },
        { type: 'rest' as NodeType, x: 0.875 }
      ],
      // 층 2: 4개
      [
        { type: 'battle' as NodeType, x: 0.125 },
        { type: 'elite' as NodeType, x: 0.375 },
        { type: 'treasure' as NodeType, x: 0.625 },
        { type: 'event' as NodeType, x: 0.875 }
      ],
      // 층 3: 4개
      [
        { type: 'battle' as NodeType, x: 0.125 },
        { type: 'shop' as NodeType, x: 0.375 },
        { type: 'battle' as NodeType, x: 0.625 },
        { type: 'rest' as NodeType, x: 0.875 }
      ],
      // 층 4: 4개
      [
        { type: 'event' as NodeType, x: 0.125 },
        { type: 'battle' as NodeType, x: 0.375 },
        { type: 'treasure' as NodeType, x: 0.625 },
        { type: 'elite' as NodeType, x: 0.875 }
      ],
      // 층 5: 3개
      [
        { type: 'battle' as NodeType, x: 0.25 },
        { type: 'elite' as NodeType, x: 0.5 },
        { type: 'shop' as NodeType, x: 0.75 }
      ],
      // 층 6: 보스 (1개)
      [
        { type: 'boss' as NodeType, x: 0.5 }
      ]
    ]

    let nodeIdCounter = 0
    const layerStartIndices: number[] = []

    // 각 층별로 노드 생성
    layers.forEach((layer, layerIndex) => {
      layerStartIndices.push(nodeIdCounter)
      const y = layerIndex / (layers.length - 1) // 0 ~ 1

      layer.forEach((nodeConfig) => {
        const node: AdventureNode = {
          id: `node_${nodeIdCounter}`,
          type: nodeConfig.type,
          status: nodeIdCounter === 0 ? 'available' : 'locked', // 첫 노드도 available로 시작
          position: { x: nodeConfig.x, y },
          connections: [],
          completed: false
        }

        // 전투 노드면 적 정보 추가
        if (nodeConfig.type === 'battle' || nodeConfig.type === 'elite' || nodeConfig.type === 'boss') {
          const enemy = generateEnemy(nodeConfig.type, layerIndex)
          node.enemy = enemy
        }

        nodes.push(node)
        nodeIdCounter++
      })
    })

    // 연결 설정: 각 노드를 다음 층의 같은 위치 + 좌우 1칸씩 연결
    layers.forEach((layer, layerIndex) => {
      if (layerIndex >= layers.length - 1) return // 마지막 층은 연결 안함

      const currentLayerStart = layerStartIndices[layerIndex]
      const nextLayerStart = layerStartIndices[layerIndex + 1]
      const nextLayer = layers[layerIndex + 1]

      layer.forEach((_, nodeIndexInLayer) => {
        const currentNodeIndex = currentLayerStart + nodeIndexInLayer
        const currentNode = nodes[currentNodeIndex]

        // 다음 층 노드들을 x 위치 기준으로 정렬하여 인덱스 목록 생성
        const sortedNextLayerIndices = nextLayer
          .map((node, idx) => ({ idx, x: node.x }))
          .sort((a, b) => a.x - b.x)

        // 현재 노드의 x 위치에 가장 가까운 노드 찾기
        const closestIndex = sortedNextLayerIndices.reduce((closest, current, idx) => {
          const distCurrent = Math.abs(current.x - currentNode.position.x)
          const distClosest = Math.abs(sortedNextLayerIndices[closest].x - currentNode.position.x)
          return distCurrent < distClosest ? idx : closest
        }, 0)

        // 가장 가까운 노드와 좌우 1칸씩 (최대 3개) 연결
        const connectIndices: number[] = []

        // 왼쪽 노드
        if (closestIndex > 0) {
          connectIndices.push(closestIndex - 1)
        }

        // 가운데 노드 (가장 가까운 노드)
        connectIndices.push(closestIndex)

        // 오른쪽 노드
        if (closestIndex < sortedNextLayerIndices.length - 1) {
          connectIndices.push(closestIndex + 1)
        }

        // 연결 추가
        connectIndices.forEach(sortedIdx => {
          const actualNodeIdx = sortedNextLayerIndices[sortedIdx].idx
          const targetIndex = nextLayerStart + actualNodeIdx
          currentNode.connections.push(nodes[targetIndex].id)
        })
      })
    })

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
    adventureState.value.currentNodeId = null // 시작 시 null로 설정
    adventureState.value.visitedNodes = []
    adventureState.value.accumulatedRewards = {
      gold: 0,
      food: 0,
      soldiers: 0,
      cards: []
    }

    showNotification('모험을 시작합니다! 시작 지점을 선택하세요.', 'info')
  }

  // 노드 이동
  const moveToNode = (nodeId: string) => {
    const node = adventureState.value.nodes.find(n => n.id === nodeId)
    if (!node) return

    // 선택한 노드(새로운 노드)와 같은 층의 다른 available 노드들을 locked로 변경
    const newNodeLayerY = node.position.y
    adventureState.value.nodes.forEach(n => {
      if (n.position.y === newNodeLayerY && n.status === 'available' && n.id !== nodeId) {
        n.status = 'locked'
      }
    })

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
