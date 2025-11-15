<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/90 flex items-center justify-center z-[10002] p-2 sm:p-4" @click.self="$emit('close')">
      <div class="bg-gradient-to-br from-yellow-900 to-amber-950 border-4 border-yellow-600 rounded-lg sm:rounded-xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-3 sm:p-4 border-b-2 border-yellow-600/50 bg-yellow-950/50 flex-shrink-0">
          <div class="flex items-center gap-2 sm:gap-3">
            <span class="text-3xl sm:text-4xl">🏪</span>
            <div>
              <h2 class="text-xl sm:text-2xl font-bold text-yellow-200">떠돌이 상인</h2>
              <p class="text-xs sm:text-sm text-yellow-300">귀한 물건들을 판매합니다</p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="text-yellow-400 hover:text-white text-xl sm:text-2xl px-1 sm:px-2"
          >
            ✕
          </button>
        </div>

        <!-- 현재 보유 자원 -->
        <div class="p-3 sm:p-4 bg-slate-900/50 border-b border-yellow-700/50 flex-shrink-0">
          <div class="flex items-center gap-3 sm:gap-4 justify-center">
            <div class="flex items-center gap-2 bg-slate-800/70 border border-yellow-600 rounded-lg px-3 py-1.5">
              <span class="text-lg sm:text-xl">💰</span>
              <span class="text-yellow-300 font-bold text-sm sm:text-base">{{ currentGold }}</span>
            </div>
            <div class="flex items-center gap-2 bg-slate-800/70 border border-green-600 rounded-lg px-3 py-1.5">
              <span class="text-lg sm:text-xl">🍖</span>
              <span class="text-green-300 font-bold text-sm sm:text-base">{{ currentFood }}</span>
            </div>
          </div>
        </div>

        <!-- 상품 목록 -->
        <div class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          <!-- 병사 모집 -->
          <div class="bg-slate-800/50 border-2 border-slate-600 rounded-lg p-3 sm:p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl">⚔️</span>
                <div>
                  <h3 class="font-bold text-white text-sm sm:text-base">병사 200명 모집</h3>
                  <p class="text-xs text-slate-400">전투력을 보강합니다</p>
                </div>
              </div>
              <button
                @click="buyItem('soldiers')"
                :disabled="currentGold < 400"
                :class="[
                  'px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold transition-all text-sm sm:text-base',
                  currentGold >= 400
                    ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                ]"
              >
                💰 400
              </button>
            </div>
          </div>

          <!-- 식량 구매 -->
          <div class="bg-slate-800/50 border-2 border-slate-600 rounded-lg p-3 sm:p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🍖</span>
                <div>
                  <h3 class="font-bold text-white text-sm sm:text-base">식량 500</h3>
                  <p class="text-xs text-slate-400">비상 식량을 확보합니다</p>
                </div>
              </div>
              <button
                @click="buyItem('food')"
                :disabled="currentGold < 200"
                :class="[
                  'px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold transition-all text-sm sm:text-base',
                  currentGold >= 200
                    ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                ]"
              >
                💰 200
              </button>
            </div>
          </div>

          <!-- 랜덤 카드 구매 -->
          <div class="bg-slate-800/50 border-2 border-purple-600 rounded-lg p-3 sm:p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🎴</span>
                <div>
                  <h3 class="font-bold text-purple-300 text-sm sm:text-base">신비한 카드 팩</h3>
                  <p class="text-xs text-slate-400">3장 중 1장 선택 가능</p>
                </div>
              </div>
              <button
                @click="buyItem('card')"
                :disabled="currentGold < 300"
                :class="[
                  'px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold transition-all text-sm sm:text-base',
                  currentGold >= 300
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                ]"
              >
                💰 300
              </button>
            </div>
          </div>

          <!-- 병력 회복 -->
          <div class="bg-slate-800/50 border-2 border-green-600 rounded-lg p-3 sm:p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl">💊</span>
                <div>
                  <h3 class="font-bold text-green-300 text-sm sm:text-base">병력 회복 (10%)</h3>
                  <p class="text-xs text-slate-400">잃은 병력의 일부를 회복합니다</p>
                </div>
              </div>
              <button
                @click="buyItem('heal')"
                :disabled="currentFood < 200"
                :class="[
                  'px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold transition-all text-sm sm:text-base',
                  currentFood >= 200
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                ]"
              >
                🍖 200
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 sm:p-4 border-t-2 border-yellow-600/50 bg-yellow-950/50 flex-shrink-0">
          <button
            @click="$emit('close')"
            class="w-full px-4 py-2 sm:py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-white transition-colors text-sm sm:text-base"
          >
            떠난다
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  currentGold: number
  currentFood: number
}

defineProps<Props>()

const emit = defineEmits<{
  'close': []
  'buy': [itemType: 'soldiers' | 'food' | 'card' | 'heal']
}>()

const buyItem = (itemType: 'soldiers' | 'food' | 'card' | 'heal') => {
  emit('buy', itemType)
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
