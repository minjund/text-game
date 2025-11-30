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
  // 이동 완료 시그널 (watch 트리거용)
  const moveCompletedNodeId = ref<string | null>(null)

  // 디버깅: 시그널 변경 감지
  watch(moveCompletedNodeId, (newVal) => {
    console.log('[useAdventureSystem] 📡 moveCompletedNodeId 변경됨:', newVal)
  })

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
    visitedNodes: [],
    visibleCells: new Set<string>(),
    diceResults: [],
    currentDiceIndex: 0,
    remainingSteps: 0,
    isMoving: false,
    isSelectingPath: false,
    availablePaths: []
  })

  // 미로 맵 생성 (10x10 그리드, 실제 벽 포함)
  const generateAdventureMap = (): AdventureNode[] => {
    const GRID_SIZE = 10
    const nodes: AdventureNode[] = []
    const grid: (AdventureNode | null)[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))

    // 통로가 될 칸들을 표시 (true = 통로, false = 벽)
    const isPath: boolean[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))

    // 노드 타입 풀 (가중치 기반)
    const nodeTypePool: NodeType[] = [
      'battle', 'battle', 'battle', 'battle', // 40%
      'event', 'event', // 20%
      'shop', // 10%
      'rest', // 10%
      'treasure', // 10%
      'elite' // 10%
    ]

    // 랜덤 노드 타입 선택
    const getRandomNodeType = (): NodeType => {
      return nodeTypePool[Math.floor(Math.random() * nodeTypePool.length)]
    }

    // 보스 위치를 랜덤하게 선택 (우하단 영역: x는 6~9, y는 6~9)
    const bossX = Math.floor(Math.random() * 4) + 6 // 6~9
    const bossY = Math.floor(Math.random() * 4) + 6 // 6~9

    console.log(`[generateAdventureMap] 보스 위치: (${bossX}, ${bossY})`)

    // 1단계: 시작점에서 보스까지 메인 경로 생성
    const mainPath: Array<{x: number, y: number}> = []
    let x = 0, y = 0
    mainPath.push({x, y})
    isPath[y][x] = true

    // 메인 경로: 보스까지 도달
    while (x < bossX || y < bossY) {
      const canGoRight = x < bossX
      const canGoDown = y < bossY

      if (canGoRight && canGoDown) {
        // 랜덤으로 우 또는 하
        if (Math.random() < 0.5) {
          x++
        } else {
          y++
        }
      } else if (canGoRight) {
        x++
      } else if (canGoDown) {
        y++
      }

      isPath[y][x] = true
      mainPath.push({x, y})
    }

    console.log(`[generateAdventureMap] 메인 경로 생성 완료 - ${mainPath.length}칸`)

    // 2단계: 메인 경로에서 분기 경로 생성 (일부는 막다른 길, 일부는 보스로 수렴)
    // 메인 경로의 중간 지점들에서 분기를 만듦
    let deadEndCount = 0
    let connectedBranchCount = 0

    for (let i = Math.floor(mainPath.length * 0.2); i < Math.floor(mainPath.length * 0.9); i++) {
      // 50% 확률로 분기 생성
      if (Math.random() < 0.5) {
        const branchStart = mainPath[i]

        // 분기 방향: 상하좌우 중 랜덤
        const directions = ['up', 'down', 'left', 'right']
        const direction = directions[Math.floor(Math.random() * directions.length)]

        // 분기 길이: 2-5칸
        const branchLength = Math.floor(Math.random() * 4) + 2
        let bx = branchStart.x
        let by = branchStart.y

        // 분기 경로 생성
        for (let j = 0; j < branchLength; j++) {
          if (direction === 'up' && by > 0) {
            by--
          } else if (direction === 'down' && by < GRID_SIZE - 1) {
            by++
          } else if (direction === 'left' && bx > 0) {
            bx--
          } else if (direction === 'right' && bx < GRID_SIZE - 1) {
            bx++
          } else {
            break // 경계에 도달하면 중단
          }

          if (!isPath[by][bx]) {
            isPath[by][bx] = true
          }
        }

        // 50% 확률로 막다른 길 또는 보스로 연결
        const isDeadEnd = Math.random() < 0.5

        if (isDeadEnd) {
          // 막다른 길: 여기서 중단 (보스나 메인 경로로 연결하지 않음)
          deadEndCount++
          console.log(`[generateAdventureMap] 막다른 길 생성: (${bx}, ${by})`)
        } else {
          // 분기 경로를 보스 방향으로 연결 (메인 경로로 합류하거나 보스로 직접)
          let attempts = 0
          const maxAttempts = 20
          while ((bx !== bossX || by !== bossY) && attempts < maxAttempts) {
            attempts++

            // 이미 메인 경로에 도달했으면 중단
            if (mainPath.some(p => p.x === bx && p.y === by) && (bx !== branchStart.x || by !== branchStart.y)) {
              break
            }

            // 보스 방향으로 이동
            const canGoRight = bx < bossX
            const canGoDown = by < bossY
            const canGoLeft = bx > bossX
            const canGoUp = by > bossY

            if (canGoRight && canGoDown) {
              if (Math.random() < 0.5) {
                bx++
              } else {
                by++
              }
            } else if (canGoLeft && canGoDown) {
              if (Math.random() < 0.5) {
                bx--
              } else {
                by++
              }
            } else if (canGoRight && canGoUp) {
              if (Math.random() < 0.5) {
                bx++
              } else {
                by--
              }
            } else if (canGoLeft && canGoUp) {
              if (Math.random() < 0.5) {
                bx--
              } else {
                by--
              }
            } else if (canGoRight) {
              bx++
            } else if (canGoDown) {
              by++
            } else if (canGoLeft) {
              bx--
            } else if (canGoUp) {
              by--
            } else {
              break
            }

            if (bx >= 0 && bx < GRID_SIZE && by >= 0 && by < GRID_SIZE) {
              isPath[by][bx] = true
            }
          }
          connectedBranchCount++
        }
      }
    }

    console.log(`[generateAdventureMap] 분기 경로 생성 완료 - 총 ${isPath.flat().filter(Boolean).length}칸 (막다른 길: ${deadEndCount}개, 연결 경로: ${connectedBranchCount}개)`)

    // 통로인 칸에만 노드 배치
    let nodeIdCounter = 0
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!isPath[y][x]) continue // 통로가 아니면 스킵 (벽)

        let nodeType: NodeType

        if (x === 0 && y === 0) {
          nodeType = 'start'
        } else if (x === bossX && y === bossY) {
          nodeType = 'boss'
        } else {
          nodeType = getRandomNodeType()
        }

        const node: AdventureNode = {
          id: `node_${x}_${y}`,
          type: nodeType,
          status: (x === 0 && y === 0) ? 'available' : 'locked',
          position: { x: x / (GRID_SIZE - 1), y: y / (GRID_SIZE - 1) },
          gridX: x,
          gridY: y,
          connections: [],
          completed: false,
          visible: (x === 0 && y === 0) || nodeType === 'boss' // 시작점과 보스 방은 항상 보임
        }

        // 전투 노드면 적 정보 추가
        if (nodeType === 'battle' || nodeType === 'elite' || nodeType === 'boss') {
          const distanceFromStart = Math.abs(x) + Math.abs(y)
          const layer = Math.floor(distanceFromStart / 2) // 거리 기반 난이도
          node.enemy = generateEnemy(nodeType, layer)
        }

        grid[y][x] = node
        nodes.push(node)
        nodeIdCounter++
      }
    }

    // 연결 설정: 상하좌우 (통로인 칸끼리만)
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const node = grid[y][x]
        if (!node) continue

        const directions = [
          { dx: 1, dy: 0 }, // 우
          { dx: 0, dy: 1 }, // 하
          { dx: -1, dy: 0 }, // 좌
          { dx: 0, dy: -1 } // 상
        ]

        for (const { dx, dy } of directions) {
          const nx = x + dx
          const ny = y + dy

          if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && grid[ny][nx]) {
            node.connections.push(grid[ny][nx]!.id)
          }
        }
      }
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
    adventureState.value.visitedNodes = []
    adventureState.value.visibleCells = new Set<string>()
    adventureState.value.accumulatedRewards = {
      gold: 0,
      food: 0,
      soldiers: 0,
      cards: []
    }

    // 시작 노드(0,0) 주변 칸들 보이게 설정
    const startX = 0, startY = 0
    const directions = [
      { dx: 0, dy: 0 },   // 현재 칸
      { dx: 1, dy: 0 },   // 우
      { dx: 0, dy: 1 },   // 하
      { dx: -1, dy: 0 },  // 좌
      { dx: 0, dy: -1 }   // 상
    ]

    directions.forEach(({ dx, dy }) => {
      const nx = startX + dx
      const ny = startY + dy
      if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
        adventureState.value.visibleCells.add(`${nx},${ny}`)
      }
    })

    // 보스 방도 항상 보이게 설정
    const bossNode = nodes.find(n => n.type === 'boss')
    if (bossNode && bossNode.gridX !== undefined && bossNode.gridY !== undefined) {
      adventureState.value.visibleCells.add(`${bossNode.gridX},${bossNode.gridY}`)
    }

    // 시작 노드를 현재 위치로 설정
    const startNode = nodes.find(n => n.gridX === 0 && n.gridY === 0)
    if (startNode) {
      startNode.status = 'current'
      adventureState.value.currentNodeId = startNode.id

      // 시작 노드의 인접 노드들 available로 설정
      startNode.connections.forEach(connId => {
        const connNode = nodes.find(n => n.id === connId)
        if (connNode) {
          connNode.visible = true
          connNode.status = 'available'
        }
      })
    }

    showNotification('모험을 시작합니다! 룰렛을 돌려주세요.', 'info')
  }

  // 노드 이동 (미로 버전 - 한 칸씩만 보이는 Fog of War, 되돌아가기 지원)
  const moveToNode = (nodeId: string) => {
    const node = adventureState.value.nodes.find(n => n.id === nodeId)
    if (!node || node.gridX === undefined || node.gridY === undefined) return

    // 현재 노드 완료 처리
    const currentNode = adventureState.value.nodes.find(n => n.id === adventureState.value.currentNodeId)
    if (currentNode) {
      // 현재 노드가 이미 완료된 노드가 아니었다면 완료 처리
      if (!currentNode.completed) {
        currentNode.status = 'completed'
        currentNode.completed = true
      } else {
        // 이미 완료된 노드였다면 다시 completed로 복귀
        currentNode.status = 'completed'
      }
      currentNode.visible = true // 완료된 칸은 계속 보임

      // 이전에 보였던 인접 칸들을 다시 숨김 (완료된 칸 제외)
      currentNode.connections.forEach(connId => {
        const connNode = adventureState.value.nodes.find(n => n.id === connId)
        if (connNode && !connNode.completed && connNode.id !== nodeId) {
          connNode.visible = false
          if (connNode.status === 'available') {
            connNode.status = 'locked'
          }
        }
      })
    }

    // 새 노드로 이동 (완료된 노드도 current로 만들 수 있음)
    node.status = 'current'
    adventureState.value.currentNodeId = nodeId

    // 방문 기록 (중복 방지)
    if (!adventureState.value.visitedNodes.includes(nodeId)) {
      adventureState.value.visitedNodes.push(nodeId)
      adventureState.value.depth++
    }

    // Fog of War: 모든 노드를 먼저 숨김 (완료된 칸 제외)
    adventureState.value.nodes.forEach(n => {
      if (!n.completed && n.id !== nodeId) {
        n.visible = false
      }
    })

    // 현재 노드만 보이기
    node.visible = true

    // 현재 위치 주변 칸들(상하좌우)을 visibleCells에 추가
    const directions = [
      { dx: 0, dy: 0 },   // 현재 칸
      { dx: 1, dy: 0 },   // 우
      { dx: 0, dy: 1 },   // 하
      { dx: -1, dy: 0 },  // 좌
      { dx: 0, dy: -1 }   // 상
    ]

    directions.forEach(({ dx, dy }) => {
      const nx = node.gridX! + dx
      const ny = node.gridY! + dy
      if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
        adventureState.value.visibleCells.add(`${nx},${ny}`)
      }
    })

    // 연결된 노드들 visible 처리 및 상태 변경
    node.connections.forEach(connId => {
      const connNode = adventureState.value.nodes.find(n => n.id === connId)
      if (connNode) {
        connNode.visible = true
        // 잠긴 칸만 available로 변경 (완료된 칸은 completed 상태 유지)
        if (connNode.status === 'locked') {
          connNode.status = 'available'
        }
        // 완료된 칸은 그대로 completed 상태 유지 (클릭은 가능하지만 시각적으로 구분됨)
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

  // 주사위 5개 굴리기
  const rollDice = () => {
    const results: number[] = []
    for (let i = 0; i < 5; i++) {
      results.push(Math.floor(Math.random() * 6) + 1) // 1-6
    }
    adventureState.value.diceResults = results
    adventureState.value.currentDiceIndex = 0
    return results
  }

  // 다음 주사위 사용
  const useNextDice = () => {
    console.log('[useNextDice] 호출 - currentDiceIndex:', adventureState.value.currentDiceIndex, 'total:', adventureState.value.diceResults.length)

    if (adventureState.value.currentDiceIndex >= adventureState.value.diceResults.length) {
      // 주사위 다 사용함 - 새로 굴리기
      console.log('[useNextDice] 모든 주사위 사용 완료')
      showNotification('주사위를 다시 굴립니다!', 'info')
      rollDice()
    }

    const steps = adventureState.value.diceResults[adventureState.value.currentDiceIndex]
    console.log('[useNextDice] steps:', steps, '(index:', adventureState.value.currentDiceIndex, ')')
    adventureState.value.currentDiceIndex++
    console.log('[useNextDice] currentDiceIndex 증가 →', adventureState.value.currentDiceIndex)
    adventureState.value.remainingSteps = steps
    return steps
  }

  // 자동 이동 시작
  const startAutoMove = (steps: number) => {
    console.log('[startAutoMove] 자동 이동 시작 - steps:', steps)
    adventureState.value.remainingSteps = steps
    adventureState.value.isMoving = true
    processNextStep()
  }

  // 다음 스텝 처리 (이동만 수행, 이벤트는 실행하지 않음)
  const processNextStep = () => {
    console.log('[processNextStep] 시작 - remainingSteps:', adventureState.value.remainingSteps)

    if (adventureState.value.remainingSteps <= 0) {
      // 이동 완료 - 최종 도착 칸에서 이벤트 실행을 위해 isMoving을 false로 설정
      console.log('[processNextStep] 이동 완료 - isMoving을 false로 설정')
      adventureState.value.isMoving = false
      return
    }

    const currentNode = adventureState.value.nodes.find(n => n.id === adventureState.value.currentNodeId)
    if (!currentNode) {
      console.log('[processNextStep] 현재 노드를 찾을 수 없음')
      adventureState.value.isMoving = false
      return
    }

    console.log('[processNextStep] 현재 노드:', currentNode.gridX, currentNode.gridY, currentNode.type)

    // 갈 수 있는 방향 찾기 (완료되지 않은 노드들)
    const availableConnections = currentNode.connections
      .map(connId => adventureState.value.nodes.find(n => n.id === connId))
      .filter(n => n && !n.completed) as AdventureNode[]

    console.log('[processNextStep] 갈 수 있는 방향:', availableConnections.length, '개')

    if (availableConnections.length === 0) {
      // 막다른 길 - 자동으로 되돌아가기
      console.log('[processNextStep] 막다른 길! 자동으로 되돌아갑니다...')
      showNotification('막다른 길! 자동으로 되돌아갑니다...', 'info')

      // 방문 기록에서 이전 노드 찾기
      const currentIndex = adventureState.value.visitedNodes.findIndex(id => id === adventureState.value.currentNodeId)
      if (currentIndex > 0) {
        const previousNodeId = adventureState.value.visitedNodes[currentIndex - 1]
        const previousNode = adventureState.value.nodes.find(n => n.id === previousNodeId)

        if (previousNode) {
          console.log('[processNextStep] 이전 노드로 이동:', previousNode.gridX, previousNode.gridY, previousNode.type)
          moveToNode(previousNode.id)
          adventureState.value.remainingSteps--

          // 다음 스텝 예약
          if (adventureState.value.remainingSteps > 0) {
            console.log('[processNextStep] 다음 스텝 예약 - 남은 칸:', adventureState.value.remainingSteps)
            setTimeout(() => processNextStep(), 1000)
          } else {
            // 이동 완료
            console.log('[processNextStep] ✅ 모든 이동 완료!')
            adventureState.value.isMoving = false

            // 이동 완료 시그널 발송
            if (adventureState.value.currentNodeId) {
              console.log('[processNextStep] 📡 이동 완료 시그널 발송:', adventureState.value.currentNodeId)
              moveCompletedNodeId.value = adventureState.value.currentNodeId
            }
          }
          return
        }
      }

      // 되돌아갈 곳이 없으면 중단
      console.log('[processNextStep] 되돌아갈 곳이 없음 - 이동 중단')
      adventureState.value.isMoving = false
      adventureState.value.remainingSteps = 0
      showNotification('더 이상 갈 곳이 없습니다!', 'error')
      return
    }

    if (availableConnections.length > 1) {
      // 갈림길 - 미로 맵에서 직접 선택
      console.log('[processNextStep] 갈림길 발견! 사용자 선택 대기')
      adventureState.value.isMoving = false
      adventureState.value.isSelectingPath = true
      adventureState.value.availablePaths = availableConnections

      // 선택 가능한 노드들을 available로 표시하고 보이게 설정
      availableConnections.forEach(node => {
        node.status = 'available'
        node.visible = true
        // visibleCells에도 추가
        if (node.gridX !== undefined && node.gridY !== undefined) {
          adventureState.value.visibleCells.add(`${node.gridX},${node.gridY}`)
        }
      })

      showNotification('🔀 갈림길입니다! 미로에서 가고 싶은 방향을 클릭하세요.', 'info')
      return
    }

    // 직진 - 자동 이동 (이벤트는 실행하지 않고 이동만)
    const nextNode = availableConnections[0]
    console.log('[processNextStep] 자동 직진:', nextNode.gridX, nextNode.gridY, nextNode.type)
    moveToNode(nextNode.id)
    adventureState.value.remainingSteps--

    // 보스 방에 도달하면 즉시 전투 시작 (남은 스텝 무시)
    if (nextNode.type === 'boss') {
      console.log('[processNextStep] 👑 보스 방 도달! 즉시 전투 시작')
      adventureState.value.remainingSteps = 0
      adventureState.value.isMoving = false

      // 이동 완료 시그널 발송 (전투 트리거)
      if (adventureState.value.currentNodeId) {
        console.log('[processNextStep] 📡 보스 전투 시그널 발송:', adventureState.value.currentNodeId)
        moveCompletedNodeId.value = adventureState.value.currentNodeId
      }
      return
    }

    // 다음 스텝 예약
    if (adventureState.value.remainingSteps > 0) {
      console.log('[processNextStep] 다음 스텝 예약 - 남은 칸:', adventureState.value.remainingSteps)
      setTimeout(() => processNextStep(), 1000) // 1초 딜레이
    } else {
      // 이동 완료
      console.log('[processNextStep] ✅ 모든 이동 완료!')
      console.log('[processNextStep] currentNodeId:', adventureState.value.currentNodeId)
      console.log('[processNextStep] remainingSteps:', adventureState.value.remainingSteps)

      adventureState.value.isMoving = false

      // 이동 완료 시그널 발송 (watch 트리거용)
      if (adventureState.value.currentNodeId) {
        console.log('[processNextStep] 📡 이동 완료 시그널 발송:', adventureState.value.currentNodeId)
        moveCompletedNodeId.value = adventureState.value.currentNodeId
      }
    }
  }

  // 경로 선택
  const selectPath = (nodeId: string) => {
    console.log('[selectPath] 경로 선택됨 - nodeId:', nodeId, '남은 칸:', adventureState.value.remainingSteps)
    adventureState.value.isSelectingPath = false
    const selectedNode = adventureState.value.nodes.find(n => n.id === nodeId)
    moveToNode(nodeId)
    adventureState.value.remainingSteps--

    // 보스 방에 도달하면 즉시 전투 시작 (남은 스텝 무시)
    if (selectedNode?.type === 'boss') {
      console.log('[selectPath] 👑 보스 방 도달! 즉시 전투 시작')
      adventureState.value.remainingSteps = 0
      adventureState.value.isMoving = false

      // 이동 완료 시그널 발송 (전투 트리거)
      if (adventureState.value.currentNodeId) {
        console.log('[selectPath] 📡 보스 전투 시그널 발송:', adventureState.value.currentNodeId)
        moveCompletedNodeId.value = adventureState.value.currentNodeId
      }
      return
    }

    // 이동 계속
    if (adventureState.value.remainingSteps > 0) {
      console.log('[selectPath] 이동 계속 - 남은 칸:', adventureState.value.remainingSteps)
      adventureState.value.isMoving = true
      setTimeout(() => processNextStep(), 1000) // 1초 딜레이
    } else {
      // 이동 완료
      console.log('[selectPath] ✅ 이동 완료!')
      console.log('[selectPath] currentNodeId:', adventureState.value.currentNodeId)

      adventureState.value.isMoving = false

      // 이동 완료 시그널 발송 (watch 트리거용)
      if (adventureState.value.currentNodeId) {
        console.log('[selectPath] 📡 이동 완료 시그널 발송:', adventureState.value.currentNodeId)
        moveCompletedNodeId.value = adventureState.value.currentNodeId
      }
    }
  }

  return {
    adventureState,
    moveCompletedNodeId,
    currentNode,
    availableNodes,
    startAdventure,
    moveToNode,
    completeNode,
    completeAdventure,
    retreatAdventure,
    failAdventure,
    rollDice,
    useNextDice,
    startAutoMove,
    selectPath,
    NODE_INFO
  }
}
