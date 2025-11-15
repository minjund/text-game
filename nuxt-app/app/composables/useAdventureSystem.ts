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

  // 맵 생성
  const generateAdventureMap = (): AdventureNode[] => {
    const nodes: AdventureNode[] = []
    const layers = 5 // 5층
    const nodesPerLayer = [1, 4, 4, 3, 1] // 각 층별 노드 수

    let nodeIdCounter = 0

    // 층별로 노드 생성
    for (let layer = 0; layer < layers; layer++) {
      const layerNodes: AdventureNode[] = []
      const nodeCount = nodesPerLayer[layer]

      for (let i = 0; i < nodeCount; i++) {
        const nodeId = `node_${nodeIdCounter++}`

        // 노드 타입 결정
        let type: NodeType = 'battle'
        if (layer === 0) {
          type = 'start'
        } else if (layer === layers - 1) {
          type = 'boss'
        } else {
          // 중간층: 랜덤 타입
          const types: NodeType[] = ['battle', 'battle', 'elite', 'event', 'shop', 'rest', 'treasure']
          type = types[Math.floor(Math.random() * types.length)]
        }

        // 위치 계산 (x: 가로 분산, y: 층)
        const x = (i + 0.5) / nodeCount
        const y = layer / (layers - 1)

        const node: AdventureNode = {
          id: nodeId,
          type,
          status: layer === 0 ? 'current' : 'locked',
          position: { x, y },
          connections: [],
          completed: false
        }

        // 전투 노드면 적 정보 추가
        if (type === 'battle' || type === 'elite' || type === 'boss') {
          const enemy = generateEnemy(type, layer)
          node.enemy = enemy
        }

        layerNodes.push(node)
      }

      nodes.push(...layerNodes)
    }

    // 연결 설정: 각 층의 노드를 다음 층 노드들과 연결
    let currentLayerStart = 0
    for (let layer = 0; layer < layers - 1; layer++) {
      const currentLayerCount = nodesPerLayer[layer]
      const nextLayerCount = nodesPerLayer[layer + 1]
      const nextLayerStart = currentLayerStart + currentLayerCount

      for (let i = 0; i < currentLayerCount; i++) {
        const currentNode = nodes[currentLayerStart + i]

        // 다음 층의 1-3개 노드와 연결
        const connectionsCount = Math.min(nextLayerCount, Math.floor(Math.random() * 2) + 1)
        const possibleConnections = Array.from({ length: nextLayerCount }, (_, idx) => nextLayerStart + idx)

        // 랜덤하게 연결
        for (let j = 0; j < connectionsCount; j++) {
          if (possibleConnections.length > 0) {
            const randomIndex = Math.floor(Math.random() * possibleConnections.length)
            const targetNodeIndex = possibleConnections.splice(randomIndex, 1)[0]
            currentNode.connections.push(nodes[targetNodeIndex].id)
          }
        }

        // 최소 1개는 연결되도록 보장
        if (currentNode.connections.length === 0 && nextLayerCount > 0) {
          currentNode.connections.push(nodes[nextLayerStart].id)
        }
      }

      currentLayerStart += currentLayerCount
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
