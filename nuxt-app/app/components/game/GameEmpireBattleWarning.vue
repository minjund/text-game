<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-2 sm:p-4" @click.self="$emit('close')">
      <div class="bg-gradient-to-br from-red-900 to-red-950 border-4 border-red-600 rounded-lg sm:rounded-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-pulse-slow">
        <!-- Header -->
        <div class="flex items-center justify-center p-3 sm:p-6 border-b-2 border-red-600/50 bg-red-950/50 flex-shrink-0">
          <div class="text-center">
            <div class="text-3xl sm:text-4xl md:text-5xl mb-1 sm:mb-2">⚠️</div>
            <h2 class="text-lg sm:text-2xl md:text-3xl font-bold text-red-200">제국과의 결전</h2>
            <p class="text-xs sm:text-sm md:text-base text-red-300 mt-1 sm:mt-2">아카샤 대제국과의 전면전</p>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-6 bg-slate-900/50">
          <!-- Warning Message -->
          <div class="bg-red-950/80 border-2 border-red-600 rounded-lg p-3 sm:p-4">
            <div class="flex items-start gap-2 sm:gap-3">
              <span class="text-2xl sm:text-3xl">💀</span>
              <div class="flex-1">
                <h3 class="text-base sm:text-lg font-bold text-red-200 mb-2">패배 시 왕국 멸망</h3>
                <p class="text-xs sm:text-sm text-red-300 leading-relaxed">
                  이 전투에서 패배하면 왕국이 멸망하고 <span class="font-bold text-yellow-300">환생</span>하게 됩니다.
                  신중하게 결정하세요.
                </p>
              </div>
            </div>
          </div>

          <!-- Battle Info -->
          <div class="space-y-2 sm:space-y-3">
            <div class="bg-slate-800/50 border border-slate-600 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg sm:text-xl">👑</span>
                <h4 class="text-sm sm:text-base font-bold text-slate-200">적 세력</h4>
              </div>
              <p class="text-xs sm:text-sm text-slate-300">아카샤 대제국 - 최강의 군사력을 보유한 제국군</p>
            </div>

            <div class="bg-slate-800/50 border border-slate-600 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg sm:text-xl">🎁</span>
                <h4 class="text-sm sm:text-base font-bold text-slate-200">승리 보상</h4>
              </div>
              <p class="text-xs sm:text-sm text-green-300">제국 정복 완료 - 금 +500, 식량 +300</p>
              <p class="text-xs sm:text-sm text-yellow-300">환생 시스템 활성화</p>
            </div>
          </div>

          <!-- Your Forces -->
          <div class="bg-blue-950/50 border border-blue-600 rounded-lg p-3">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg sm:text-xl">⚔️</span>
              <h4 class="text-sm sm:text-base font-bold text-blue-200">현재 전력</h4>
            </div>
            <div class="bg-slate-900/50 rounded p-2 text-xs sm:text-sm">
              <span class="text-slate-400">병력:</span>
              <span class="ml-2 font-bold text-white">{{ soldiers }}</span>
            </div>
          </div>

          <!-- Final Warning -->
          <div class="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/50 rounded-lg p-3">
            <div class="flex items-center gap-2">
              <span class="text-lg sm:text-xl">💡</span>
              <p class="text-xs sm:text-sm text-yellow-200">
                준비가 부족하다면 <span class="font-bold">일반 전투</span>로 경험과 자원을 먼저 획득하세요.
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 sm:p-6 border-t-2 border-red-600/50 bg-red-950/50 flex-shrink-0">
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              @click="$emit('close')"
              class="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-white transition-colors text-sm sm:text-base"
            >
              취소
            </button>
            <button
              @click="$emit('confirm')"
              class="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg font-bold text-white transition-all shadow-lg shadow-red-900/50 text-sm sm:text-base"
            >
              🔥 제국과 싸운다!
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  soldiers: number
}

defineProps<Props>()

defineEmits<{
  'close': []
  'confirm': []
}>()
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

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
  0%, 100% {
    border-color: rgb(220 38 38 / 0.5);
  }
  50% {
    border-color: rgb(220 38 38 / 1);
  }
}
</style>
