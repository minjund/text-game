<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/90 flex items-center justify-center z-[10002] p-2 sm:p-4" @click.self="$emit('close')">
      <div class="bg-gradient-to-br from-green-900 to-emerald-950 border-4 border-green-600 rounded-lg sm:rounded-xl w-full max-w-md max-h-[95vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-center p-3 sm:p-4 border-b-2 border-green-600/50 bg-green-950/50 flex-shrink-0">
          <div class="text-center">
            <span class="text-4xl sm:text-5xl block mb-2">🏕️</span>
            <h2 class="text-xl sm:text-2xl font-bold text-green-200">휴식처</h2>
            <p class="text-xs sm:text-sm text-green-300 mt-1">잠시 쉬어가세요</p>
          </div>
        </div>

        <!-- 선택지들 -->
        <div class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          <!-- 병력 회복 -->
          <button
            @click="selectOption('heal')"
            class="w-full bg-slate-800/50 border-2 border-green-600 hover:border-green-400 rounded-lg p-4 transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/50"
          >
            <div class="flex items-start gap-3">
              <span class="text-3xl sm:text-4xl">💊</span>
              <div class="flex-1 text-left">
                <h3 class="font-bold text-green-300 text-base sm:text-lg mb-1">병력 회복</h3>
                <p class="text-xs sm:text-sm text-slate-300">잃어버린 병력의 20%를 회복합니다</p>
                <p class="text-xs text-green-400 mt-1">권장: 전투가 많이 남았을 때</p>
              </div>
            </div>
          </button>

          <!-- 카드 제거 -->
          <button
            @click="selectOption('remove-card')"
            class="w-full bg-slate-800/50 border-2 border-purple-600 hover:border-purple-400 rounded-lg p-4 transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
          >
            <div class="flex items-start gap-3">
              <span class="text-3xl sm:text-4xl">🗑️</span>
              <div class="flex-1 text-left">
                <h3 class="font-bold text-purple-300 text-base sm:text-lg mb-1">카드 정리</h3>
                <p class="text-xs sm:text-sm text-slate-300">불필요한 카드 1장을 제거하여 덱을 정리합니다</p>
                <p class="text-xs text-purple-400 mt-1">권장: 약한 카드가 있을 때</p>
              </div>
            </div>
          </button>

          <!-- 명상 (랜덤 소량 보상) -->
          <button
            @click="selectOption('meditate')"
            class="w-full bg-slate-800/50 border-2 border-blue-600 hover:border-blue-400 rounded-lg p-4 transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
          >
            <div class="flex items-start gap-3">
              <span class="text-3xl sm:text-4xl">🧘</span>
              <div class="flex-1 text-left">
                <h3 class="font-bold text-blue-300 text-base sm:text-lg mb-1">명상</h3>
                <p class="text-xs sm:text-sm text-slate-300">고요히 명상하여 작은 깨달음을 얻습니다</p>
                <p class="text-xs text-blue-400 mt-1">보상: 금 100~300 또는 식량 50~200</p>
              </div>
            </div>
          </button>
        </div>

        <!-- Footer -->
        <div class="p-3 sm:p-4 border-t-2 border-green-600/50 bg-green-950/50 flex-shrink-0">
          <button
            @click="$emit('close')"
            class="w-full px-4 py-2 sm:py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-white transition-colors text-sm sm:text-base"
          >
            그냥 지나간다
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'close': []
  'select': [option: 'heal' | 'remove-card' | 'meditate']
}>()

const selectOption = (option: 'heal' | 'remove-card' | 'meditate') => {
  emit('select', option)
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

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>
