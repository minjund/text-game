<template>
  <div class="fixed inset-0 bg-black/95 z-[9999] flex flex-col">
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

    <!-- 메인: 맵 영역 -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4 bg-gradient-to-b from-slate-900 to-black">
      <div class="w-full max-w-lg mx-auto py-4 sm:py-8">
        <!-- 7개 층을 세로로 배치 -->
        <div v-for="(layer, layerIndex) in layers" :key="`layer-${layerIndex}`" class="relative mb-4 sm:mb-6">
          <!-- 각 층의 노드들 -->
          <div class="relative min-h-[100px] sm:min-h-[120px] md:min-h-[140px]">
            <!-- 노드 버튼들 -->
            <div class="relative flex justify-center items-center gap-2 sm:gap-3 px-2" style="z-index: 10;">
              <button
                v-for="node in layer"
                :key="node.id"
                @click.stop="handleNodeClick(node)"
                :disabled="node.status === 'locked' || node.status === 'completed'"
                :class="[
                  'relative flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border-3 sm:border-4 transition-all active:scale-95 touch-manipulation shadow-lg',
                  'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 p-1 sm:p-2',
                  'flex-shrink-0',
                  getNodeClass(node)
                ]"
              >
                <!-- 노드 아이콘 -->
                <span class="text-xl sm:text-2xl md:text-3xl mb-0.5">{{ getNodeInfo(node.type).icon }}</span>

                <!-- 노드 이름 -->
                <span class="text-[7px] sm:text-[9px] md:text-[10px] font-bold text-center leading-tight">
                  {{ getNodeInfo(node.type).name }}
                </span>

                <!-- 현재 위치 표시 -->
                <div
                  v-if="node.status === 'current'"
                  class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-yellow-500/50"
                >
                  <span class="text-xs sm:text-sm">📍</span>
                </div>

                <!-- 완료 표시 -->
                <div
                  v-if="node.status === 'completed'"
                  class="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <span class="text-[10px] sm:text-xs font-bold">✓</span>
                </div>
              </button>
            </div>
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

// 노드들을 층별로 그룹화
const layers = computed(() => {
  const layerMap = new Map<number, AdventureNode[]>()

  props.nodes.forEach(node => {
    const layerIndex = Math.round(node.position.y * 6) // 7층이므로 0~6
    if (!layerMap.has(layerIndex)) {
      layerMap.set(layerIndex, [])
    }
    layerMap.get(layerIndex)!.push(node)
  })

  // 층별로 정렬하여 배열로 변환
  const sortedLayers: AdventureNode[][] = []
  for (let i = 0; i <= 6; i++) {
    if (layerMap.has(i)) {
      // 각 층 내에서 x 위치로 정렬
      const layer = layerMap.get(i)!.sort((a, b) => a.position.x - b.position.x)
      sortedLayers.push(layer)
    }
  }

  return sortedLayers
})

// ID로 노드 찾기
const getNodeById = (nodeId: string) => {
  return props.nodes.find(n => n.id === nodeId)
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
    return `${baseClass} bg-green-900/30 border-green-600 opacity-70 cursor-not-allowed`
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

// 노드 클릭 처리
const handleNodeClick = (node: AdventureNode) => {
  console.log('Node clicked:', node.type, node.status)
  if (node.status === 'available' || node.status === 'current') {
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
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.8);
  }
}

@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0) translateX(-50%);
  }
  50% {
    transform: translateY(-8px) translateX(-50%);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 1.5s ease-in-out infinite;
}
</style>
