<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-2 md:p-4">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-red-600 rounded-lg md:rounded-xl w-full max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="bg-gradient-to-r from-red-900 to-red-800 border-b-2 border-red-600 p-3 md:p-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base md:text-2xl font-bold flex items-center gap-1 md:gap-2">
              <span>⚔️</span> 전투 난이도 선택
            </h2>
            <button @click="close" class="text-xl md:text-2xl hover:text-red-400 transition-colors px-2 py-1">
              ✕
            </button>
          </div>
          <p class="text-[10px] md:text-sm text-slate-300 mt-1 md:mt-2">
            난이도에 따라 적의 강도와 보상이 달라집니다
          </p>
        </div>

        <!-- Difficulty Options -->
        <div class="p-3 md:p-6 space-y-2 md:space-y-3">
          <!-- Easy -->
          <button
            @click="selectDifficulty('easy')"
            class="w-full bg-gradient-to-br from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 border-2 border-green-500 rounded-lg p-3 md:p-4 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div class="flex items-start gap-2 md:gap-3">
              <div class="text-2xl md:text-4xl mt-0.5 md:mt-1">🛡️</div>
              <div class="flex-1 text-left">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-sm md:text-xl font-bold">쉬움</h3>
                  <span class="px-1.5 md:px-2 py-0.5 md:py-1 bg-green-900 text-[9px] md:text-xs rounded font-bold">초보자 추천</span>
                </div>
                <p class="text-[10px] md:text-sm text-green-200 mb-1.5 md:mb-2">약한 적과 전투를 벌입니다</p>
                <div class="flex flex-wrap gap-1 md:gap-2 text-[9px] md:text-xs">
                  <span class="px-1.5 md:px-2 py-0.5 bg-black/30 rounded">적 병력: 낮음</span>
                  <span class="px-1.5 md:px-2 py-0.5 bg-black/30 rounded">보상: 금 +300</span>
                </div>
              </div>
            </div>
          </button>

          <!-- Normal -->
          <button
            @click="selectDifficulty('normal')"
            class="w-full bg-gradient-to-br from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 border-2 border-blue-500 rounded-lg p-3 md:p-4 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div class="flex items-start gap-2 md:gap-3">
              <div class="text-2xl md:text-4xl mt-0.5 md:mt-1">⚔️</div>
              <div class="flex-1 text-left">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-sm md:text-xl font-bold">보통</h3>
                  <span class="px-1.5 md:px-2 py-0.5 md:py-1 bg-blue-900 text-[9px] md:text-xs rounded font-bold">균형잡힌 난이도</span>
                </div>
                <p class="text-[10px] md:text-sm text-blue-200 mb-1.5 md:mb-2">적당한 강도의 전투입니다</p>
                <div class="flex flex-wrap gap-1 md:gap-2 text-[9px] md:text-xs">
                  <span class="px-1.5 md:px-2 py-0.5 bg-black/30 rounded">적 병력: 보통</span>
                  <span class="px-1.5 md:px-2 py-0.5 bg-black/30 rounded">보상: 금 +500</span>
                </div>
              </div>
            </div>
          </button>

          <!-- Hard -->
          <button
            @click="selectDifficulty('hard')"
            class="w-full bg-gradient-to-br from-orange-700 to-orange-800 hover:from-orange-600 hover:to-orange-700 border-2 border-orange-500 rounded-lg p-3 md:p-4 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div class="flex items-start gap-2 md:gap-3">
              <div class="text-2xl md:text-4xl mt-0.5 md:mt-1">🔥</div>
              <div class="flex-1 text-left">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-sm md:text-xl font-bold">어려움</h3>
                  <span class="px-1.5 md:px-2 py-0.5 md:py-1 bg-orange-900 text-[9px] md:text-xs rounded font-bold">도전 과제</span>
                </div>
                <p class="text-[10px] md:text-sm text-orange-200 mb-1.5 md:mb-2">강력한 적과의 치열한 전투</p>
                <div class="flex flex-wrap gap-1 md:gap-2 text-[9px] md:text-xs">
                  <span class="px-1.5 md:px-2 py-0.5 bg-black/30 rounded">적 병력: 높음</span>
                  <span class="px-1.5 md:px-2 py-0.5 bg-black/30 rounded">보상: 금 +800</span>
                </div>
              </div>
            </div>
          </button>

          <!-- Very Hard -->
          <button
            @click="selectDifficulty('veryhard')"
            class="w-full bg-gradient-to-br from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 border-2 border-purple-500 rounded-lg p-3 md:p-4 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div class="flex items-start gap-2 md:gap-3">
              <div class="text-2xl md:text-4xl mt-0.5 md:mt-1">💀</div>
              <div class="flex-1 text-left">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-sm md:text-xl font-bold">매우 어려움</h3>
                  <span class="px-1.5 md:px-2 py-0.5 md:py-1 bg-purple-900 text-[9px] md:text-xs rounded font-bold animate-pulse">극한의 도전</span>
                </div>
                <p class="text-[10px] md:text-sm text-purple-200 mb-1.5 md:mb-2">죽음을 각오한 전투, 최고의 보상</p>
                <div class="flex flex-wrap gap-1 md:gap-2 text-[9px] md:text-xs">
                  <span class="px-1.5 md:px-2 py-0.5 bg-black/30 rounded">적 병력: 매우 높음</span>
                  <span class="px-1.5 md:px-2 py-0.5 bg-black/30 rounded">보상: 금 +1200</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        <!-- Footer -->
        <div class="border-t-2 border-slate-700 p-3 md:p-4 bg-slate-900/50">
          <div class="flex items-start gap-2 text-[10px] md:text-xs text-slate-400">
            <span class="text-base md:text-xl">💡</span>
            <div>
              <span class="font-bold text-slate-300">팁:</span> 전투 중 일시정지 버튼을 눌러 액티브 카드를 사용할 수 있습니다!
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  select: [difficulty: 'easy' | 'normal' | 'hard' | 'veryhard']
}>()

const close = () => {
  emit('close')
}

const selectDifficulty = (difficulty: 'easy' | 'normal' | 'hard' | 'veryhard') => {
  emit('select', difficulty)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
