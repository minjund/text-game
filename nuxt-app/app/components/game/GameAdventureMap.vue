<template>
  <div class="fixed inset-0 bg-black/95 z-[9999] flex flex-col pt-16 sm:pt-14">
    <!-- 헤더: 누적 보상 & 떠나기 버튼 -->
    <div class="flex-shrink-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 p-3 sm:p-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 sm:gap-3 md:gap-6">
          <div class="flex items-center gap-1 sm:gap-2 bg-slate-800/50 border border-yellow-600 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2">
            <span class="text-base sm:text-lg md:text-xl">💰</span>
            <span class="text-yellow-300 font-bold text-sm sm:text-base md:text-lg">+{{ accumulatedRewards.gold }}</span>
          </div>
          <div class="flex items-center gap-1 sm:gap-2 bg-slate-800/50 border border-green-600 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2">
            <span class="text-base sm:text-lg md:text-xl">🍖</span>
            <span class="text-green-300 font-bold text-sm sm:text-base md:text-lg">+{{ accumulatedRewards.food }}</span>
          </div>
          <div class="flex items-center gap-1 sm:gap-2 bg-slate-800/50 border border-purple-600 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2">
            <span class="text-base sm:text-lg md:text-xl">🎴</span>
            <span class="text-purple-300 font-bold text-sm sm:text-base md:text-lg">{{ accumulatedRewards.cards.length }}</span>
          </div>
        </div>

        <button
          @click.stop="handleRetreat"
          class="px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 bg-red-700 hover:bg-red-600 active:bg-red-500 rounded-lg font-bold text-white transition-colors text-sm sm:text-base md:text-lg whitespace-nowrap touch-manipulation"
        >
          떠나기
        </button>
      </div>
    </div>

    <!-- 메인: 미로 영역 -->
    <div class="flex-1 overflow-auto p-2 sm:p-4 bg-gradient-to-b from-slate-900 to-black">
      <div class="w-full max-w-4xl mx-auto py-4 sm:py-8">
        <!-- 10x10 그리드 미로 -->
        <div class="grid gap-1 sm:gap-2" :style="{ gridTemplateColumns: `repeat(10, minmax(0, 1fr))` }">
          <div
            v-for="cell in mazeGrid"
            :key="cell.key"
            class="relative aspect-square"
          >
            <!-- 보이지 않는 칸 (완전히 숨김) -->
            <div
              v-if="!isCellVisible(cell.x, cell.y)"
              class="w-full h-full bg-black/80 border border-black/90 rounded"
            ></div>

            <!-- 보이는 벽 (노드가 없는 칸) -->
            <div
              v-else-if="!cell.node"
              class="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-stone-900 border-2 border-stone-700 rounded relative overflow-hidden"
            >
              <!-- 벽 텍스처 효과 -->
              <div class="absolute inset-0 opacity-20">
                <div class="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-stone-600/30 to-transparent"></div>
                <div class="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-stone-900/50 to-transparent"></div>
                <div class="absolute inset-0" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px);"></div>
              </div>
              <!-- 벽 아이콘 -->
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl sm:text-3xl opacity-30">🧱</span>
              </div>
            </div>

            <!-- 보이는 노드 (visible이거나 completed인 경우만) -->
            <button
              v-else
              @click.stop="handleNodeClick(cell.node)"
              :disabled="cell.node.status === 'locked'"
              :class="[
                'relative w-full h-full flex flex-col items-center justify-center rounded-lg border-2 sm:border-3 transition-all active:scale-95 touch-manipulation shadow-lg',
                getNodeClass(cell.node),
                cell.node.type === 'boss' && cell.node.status !== 'completed' ? 'animate-pulse-glow' : '',
                // 갈림길 선택 가능한 노드 강조 (매우 눈에 띄게)
                isSelectablePathNode(cell.node) ? 'animate-pulse-fast border-4 !border-yellow-300 !shadow-yellow-300/80 scale-110 z-10' : ''
              ]"
            >
              <!-- 보스 방 배경 효과 -->
              <div v-if="cell.node.type === 'boss' && cell.node.status !== 'completed'" class="absolute inset-0 rounded-lg animate-pulse-slow boss-glow"></div>

              <!-- 노드 아이콘 -->
              <span class="text-lg sm:text-2xl md:text-3xl mb-0.5 relative z-10">{{ getNodeInfo(cell.node.type).icon }}</span>

              <!-- 노드 이름 (작은 화면에서는 숨김) -->
              <span class="hidden sm:block text-[7px] sm:text-[9px] md:text-[10px] font-bold text-center leading-tight relative z-10">
                {{ getNodeInfo(cell.node.type).name }}
              </span>

              <!-- 현재 위치 표시 -->
              <div
                v-if="cell.node.status === 'current'"
                class="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-yellow-500/50"
              >
                <span class="text-[10px] sm:text-xs">📍</span>
              </div>

              <!-- 완료 표시 -->
              <div
                v-if="cell.node.status === 'completed'"
                class="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <span class="text-[8px] sm:text-[10px] font-bold">✓</span>
              </div>

              <!-- 갈림길 선택 가능 표시 -->
              <div
                v-if="isSelectablePathNode(cell.node)"
                class="absolute -top-2 -left-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 animate-bounce"
              >
                <span class="text-[12px] sm:text-[16px] font-bold">👆</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 로드맵 튜토리얼 오버레이 -->
    <GameAdventureMapTutorialOverlay
      :show="showTutorial"
      @complete="completeTutorial"
      @skip="skipTutorial"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { AdventureNode, NodeType } from '~/types/adventure'
import { NODE_INFO } from '~/types/adventure'
import GameAdventureMapTutorialOverlay from './GameAdventureMapTutorialOverlay.vue'

interface Props {
  nodes: AdventureNode[]
  currentNodeId: string | null
  accumulatedRewards: {
    gold: number
    food: number
    cards: any[]
  }
  visibleCells: Set<string>
  isSelectingPath?: boolean
  availablePaths?: AdventureNode[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'node-click': [node: AdventureNode]
  'retreat': []
}>()

// 튜토리얼 상태
const showTutorial = ref(false)

// 컴포넌트 마운트 시 튜토리얼 확인
onMounted(() => {
  if (process.client) {
    const hasSeenAdventureMapTutorial = localStorage.getItem('hasSeenAdventureMapTutorial')
    if (!hasSeenAdventureMapTutorial) {
      showTutorial.value = true
    }
  }
})

// 튜토리얼 완료
const completeTutorial = () => {
  if (process.client) {
    localStorage.setItem('hasSeenAdventureMapTutorial', 'true')
  }
  showTutorial.value = false
}

// 튜토리얼 건너뛰기
const skipTutorial = () => {
  if (process.client) {
    localStorage.setItem('hasSeenAdventureMapTutorial', 'true')
  }
  showTutorial.value = false
}

// 떠나기 버튼 핸들러
const handleRetreat = () => {
  emit('retreat')
}

// 10x10 그리드로 변환
const mazeGrid = computed(() => {
  const GRID_SIZE = 10
  const grid: Array<{ key: string; x: number; y: number; node: AdventureNode | null }> = []

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const node = props.nodes.find(n => n.gridX === x && n.gridY === y) || null
      grid.push({
        key: `${x}-${y}`,
        x,
        y,
        node
      })
    }
  }

  return grid
})

// 셀이 보이는지 체크
const isCellVisible = (x: number, y: number): boolean => {
  const key = `${x},${y}`
  return props.visibleCells.has(key)
}

// 노드 정보 가져오기
const getNodeInfo = (type: NodeType) => {
  return NODE_INFO[type]
}

// 노드 클래스
const getNodeClass = (node: AdventureNode) => {
  const info = getNodeInfo(node.type)
  const baseClass = 'backdrop-blur-sm'

  if (node.status === 'locked') {
    return `${baseClass} bg-slate-800/30 border-slate-600 opacity-50 cursor-not-allowed`
  }

  if (node.status === 'completed') {
    return `${baseClass} bg-green-900/30 border-green-600 opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer`
  }

  if (node.status === 'current') {
    return `${baseClass} bg-yellow-900/50 border-yellow-400 shadow-lg shadow-yellow-500/50 animate-pulse-slow`
  }

  // available
  const colorMap: Record<string, string> = {
    slate: 'bg-slate-700/50 border-slate-400 hover:border-slate-300',
    red: 'bg-red-900/50 border-red-500 hover:border-red-400 hover:shadow-red-500/50',
    orange: 'bg-orange-900/50 border-orange-500 hover:border-orange-400 hover:shadow-orange-500/50',
    purple: 'bg-purple-900/50 border-purple-500 hover:border-purple-400 hover:shadow-purple-500/50',
    blue: 'bg-blue-900/50 border-blue-500 hover:border-blue-400 hover:shadow-blue-500/50',
    yellow: 'bg-yellow-900/50 border-yellow-500 hover:border-yellow-400 hover:shadow-yellow-500/50',
    green: 'bg-green-900/50 border-green-500 hover:border-green-400 hover:shadow-green-500/50',
    cyan: 'bg-cyan-900/50 border-cyan-500 hover:border-cyan-400 hover:shadow-cyan-500/50'
  }

  return `${baseClass} ${colorMap[info.color]} hover:scale-110 hover:shadow-xl cursor-pointer`
}

// 갈림길 선택 가능한 노드인지 확인
const isSelectablePathNode = (node: AdventureNode): boolean => {
  if (!props.isSelectingPath || !props.availablePaths) return false
  return props.availablePaths.some(p => p.id === node.id)
}

// 노드 클릭 처리
const handleNodeClick = (node: AdventureNode) => {
  console.log('Node clicked:', node.type, node.status)

  if (node.status === 'available' || node.status === 'current' || node.status === 'completed') {
    console.log('Emitting node-click event')
    emit('node-click', node)
  } else {
    console.log('Node not clickable:', node.status)
  }
}
</script>

<style scoped>
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3);
  }
  50% {
    opacity: 0.9;
    box-shadow: 0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(168, 85, 247, 0.5);
  }
}

@keyframes pulse-fast {
  0%,
  100% {
    transform: scale(1.1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.9;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-pulse-fast {
  animation: pulse-fast 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.boss-glow {
  background: radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.3) 50%, transparent 100%);
}
</style>
