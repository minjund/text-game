<template>
  <div v-if="show" class="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-2 sm:p-4">
    <div class="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-2 sm:border-4 border-yellow-500 rounded-xl sm:rounded-2xl p-3 sm:p-6 max-w-2xl w-full shadow-xl shadow-yellow-500/30">
      <!-- 제목 -->
      <div class="text-center mb-3 sm:mb-6">
        <div class="text-3xl sm:text-4xl mb-2 animate-bounce">🔀</div>
        <h2 class="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-1">
          갈림길
        </h2>
        <p class="text-xs sm:text-sm text-gray-300">
          어느 방향으로 갈까요?
        </p>
      </div>

      <!-- 남은 이동 칸 -->
      <div class="text-center mb-3 sm:mb-5 p-2 sm:p-3 bg-blue-900/50 border-2 border-blue-500 rounded-lg">
        <p class="text-sm sm:text-lg font-bold text-blue-300">
          남은 이동 칸: {{ remainingSteps }}
        </p>
      </div>

      <!-- 경로 선택 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
        <button
          v-for="(path, index) in paths"
          :key="path.id"
          @click="selectPath(path.id)"
          class="group relative p-4 sm:p-6 bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border-2 sm:border-3 border-slate-600 hover:border-yellow-500 rounded-lg sm:rounded-xl transition-all duration-300 active:scale-95 shadow-md hover:shadow-yellow-500/50"
        >
          <!-- 경로 번호 -->
          <div class="absolute -top-2 -left-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-base sm:text-lg shadow-md">
            {{ index + 1 }}
          </div>

          <!-- 노드 아이콘 -->
          <div class="text-4xl sm:text-5xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
            {{ getNodeInfo(path.type).icon }}
          </div>

          <!-- 노드 이름 -->
          <div class="text-base sm:text-lg font-bold text-white mb-1">
            {{ getNodeInfo(path.type).name }}
          </div>

          <!-- 노드 설명 -->
          <div class="text-xs sm:text-sm text-gray-400">
            {{ getNodeInfo(path.type).description }}
          </div>

          <!-- 호버 효과 -->
          <div class="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
        </button>
      </div>

      <!-- 안내 문구 -->
      <div class="mt-3 sm:mt-5 text-center text-xs sm:text-sm text-gray-400">
        선택 후 자동으로 이동을 계속합니다
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdventureNode, NodeType } from '~/types/adventure'
import { NODE_INFO } from '~/types/adventure'

interface Props {
  show: boolean
  paths: AdventureNode[]
  remainingSteps: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'select': [nodeId: string]
}>()

const getNodeInfo = (type: NodeType) => {
  return NODE_INFO[type]
}

const selectPath = (nodeId: string) => {
  emit('select', nodeId)
}
</script>
