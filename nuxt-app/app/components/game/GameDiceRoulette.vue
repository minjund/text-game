<template>
  <div v-if="show" class="fixed top-2 left-1/2 transform -translate-x-1/2 z-[10000] w-[98%] sm:w-[90%] max-w-2xl px-2">
    <div class="relative bg-black/95 rounded-2xl border-2 sm:border-4 border-yellow-500 shadow-xl shadow-yellow-500/30 p-2 sm:p-4">
      <!-- 룰렛 제목 (작게) -->
      <div class="text-center mb-2">
        <h2 class="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
          🎰 룰렛
        </h2>
      </div>

      <!-- 룰렛 슬롯 머신 (컴팩트) -->
      <div class="relative bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-900 border-2 sm:border-3 border-yellow-600 rounded-xl p-2 sm:p-3 shadow-lg mb-2">
        <!-- 3개의 룰렛 슬롯 (작게) -->
        <div class="flex gap-1 sm:gap-2 justify-center">
          <div
            v-for="(slot, index) in 3"
            :key="index"
            class="relative bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-yellow-500 rounded-lg w-10 h-16 sm:w-14 sm:h-24 overflow-hidden shadow-md"
          >
            <!-- 숫자 회전 애니메이션 -->
            <div
              v-if="isRolling"
              class="absolute inset-0 flex flex-col items-center justify-start animate-slot-spin"
            >
              <div v-for="num in [1,2,3,4,5,6,1,2,3,4,5,6]" :key="num" class="w-full h-1/3 flex items-center justify-center text-base sm:text-xl font-bold text-yellow-400">
                {{ num }}
              </div>
            </div>

            <!-- 최종 결과 -->
            <div
              v-else-if="diceResults[index]"
              class="absolute inset-0 flex items-center justify-center"
            >
              <div class="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 animate-bounce">
                {{ diceResults[index] }}
              </div>
            </div>

            <!-- 초기 상태 -->
            <div
              v-else
              class="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl text-gray-600"
            >
              ?
            </div>

            <!-- 슬롯 중앙 강조선 -->
            <div class="absolute top-1/2 left-0 right-0 h-px bg-red-500 transform -translate-y-1/2 pointer-events-none"></div>
          </div>
        </div>

        <!-- 진행 상황 표시 (컴팩트) -->
        <div v-if="diceResults.length > 0" class="mt-2 flex gap-1 sm:gap-2 justify-center">
          <div
            v-for="(result, index) in diceResults"
            :key="index"
            :class="[
              'w-7 h-7 sm:w-9 sm:h-9 rounded-md flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300',
              index < currentIndex - 1 ? 'bg-gray-700 opacity-40 line-through' :
              index === currentIndex - 1 ? 'bg-gradient-to-br from-green-400 to-emerald-500 scale-110 animate-pulse shadow-md shadow-green-500/50' :
              'bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm'
            ]"
          >
            {{ result }}
          </div>
        </div>
      </div>

      <!-- 상태 텍스트 -->
      <div v-if="diceResults.length > 0" class="text-center mt-2">
        <p class="text-xs sm:text-sm text-yellow-300 font-bold">
          {{ currentIndex }} / 3 - {{ statusText }}
        </p>
      </div>

      <!-- 버튼 (작게) -->
      <div class="flex justify-center gap-2 mt-2">
        <button
          v-if="!isRolling && diceResults.length === 0"
          @click="handleRoll"
          class="group relative px-3 py-1.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 active:scale-95 rounded-lg text-white font-bold text-xs sm:text-sm shadow-lg shadow-green-500/50 transition-all overflow-hidden"
        >
          <span class="relative z-10">🎰 룰렛 돌리기</span>
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
        </button>

        <button
          v-if="!isRolling && diceResults.length > 0 && currentIndex === 0"
          @click="handleConfirm"
          class="group relative px-3 py-1.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 active:scale-95 rounded-lg text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/50 transition-all overflow-hidden"
        >
          <span class="relative z-10">✅ 확인 (자동 이동 시작)</span>
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
        </button>

        <button
          v-if="!isRolling && currentIndex >= 3"
          @click="handleRoll"
          class="group relative px-3 py-1.5 sm:px-5 sm:py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 active:scale-95 rounded-lg text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/50 transition-all overflow-hidden"
        >
          <span class="relative z-10">🔄 다시 돌리기</span>
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  show: boolean
  diceResults: number[]
  currentIndex: number
  isRolling: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'roll': []
  'use-next': []
  'confirm': []
}>()

const statusText = computed(() => {
  if (props.isRolling) return '룰렛을 돌리는 중...'
  if (props.diceResults.length === 0) return '룰렛을 돌려주세요!'
  if (props.currentIndex >= 3) return '모든 숫자를 사용했습니다!'
  return `남은 숫자: ${3 - props.currentIndex}개`
})

const handleRoll = () => {
  emit('roll')
}

const handleUseNext = () => {
  emit('use-next')
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style scoped>
@keyframes slot-spin {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-75%);
  }
}

.animate-slot-spin {
  animation: slot-spin 0.3s linear infinite;
}
</style>
