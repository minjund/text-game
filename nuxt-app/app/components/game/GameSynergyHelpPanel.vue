<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-2 sm:p-4" @click.self="$emit('close')">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-600/50 rounded-lg sm:rounded-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[85vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-3 sm:p-4 border-b-2 border-purple-600/30 bg-purple-900/20">
          <div class="flex items-center gap-2 sm:gap-3">
            <span class="text-2xl sm:text-3xl">✨</span>
            <div>
              <h2 class="text-base sm:text-lg md:text-xl font-bold text-purple-200">시너지 시스템 가이드</h2>
              <p class="text-[10px] sm:text-xs text-slate-400">같은 태그의 카드를 모아 강력한 보너스를 획득하세요</p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="text-slate-400 hover:text-white text-xl sm:text-2xl px-1 sm:px-2"
          >
            ✕
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
          <!-- 시너지란? -->
          <div class="bg-purple-900/30 border border-purple-600/50 rounded-lg p-3 sm:p-4">
            <h3 class="text-sm sm:text-base font-bold text-purple-300 mb-2 flex items-center gap-2">
              <span>💡</span> 시너지란?
            </h3>
            <p class="text-[10px] sm:text-xs text-slate-300 leading-relaxed mb-2">
              같은 태그를 가진 카드를 2개 또는 3개 모으면 <span class="text-yellow-300 font-bold">추가 보너스</span>가 발동됩니다!
            </p>
            <div class="bg-slate-800/50 p-2 rounded text-[10px] sm:text-xs text-slate-300">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-yellow-300">⭐</span>
                <span><span class="font-bold text-green-300">2개</span> 모으면 → 시너지 1단계 발동</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-yellow-300">⭐⭐</span>
                <span><span class="font-bold text-purple-300">3개</span> 모으면 → 시너지 2단계 발동 (더 강력!)</span>
              </div>
            </div>
          </div>

          <!-- 독립 카드 설명 -->
          <div class="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3 sm:p-4">
            <h3 class="text-sm sm:text-base font-bold text-blue-300 mb-2 flex items-center gap-2">
              <span>⭐</span> 독립 카드
            </h3>
            <p class="text-[10px] sm:text-xs text-slate-300 leading-relaxed">
              <span class="text-blue-300 font-bold">독립</span> 표시가 있는 카드는 시너지 없이도 <span class="text-green-300 font-bold">강력한 효과</span>를 제공합니다.
              빌드를 고민하지 않고 바로 사용할 수 있는 카드입니다!
            </p>
          </div>

          <!-- 8가지 시너지 태그 -->
          <div>
            <h3 class="text-sm sm:text-base font-bold text-purple-300 mb-3 flex items-center gap-2">
              <span>🎯</span> 시너지 태그 목록
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <!-- 무역 -->
              <div class="bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border border-yellow-600/50 rounded-lg p-2 sm:p-3">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xl sm:text-2xl">🏪</span>
                  <h4 class="text-xs sm:text-sm font-bold text-yellow-300">무역</h4>
                </div>
                <p class="text-[10px] sm:text-xs text-slate-300 mb-1">금과 경제 발전에 집중</p>
                <div class="bg-slate-900/50 p-1.5 rounded text-[9px] sm:text-[10px] space-y-0.5">
                  <div class="text-green-300">2개: 금 +200/일, 민심 +2</div>
                  <div class="text-purple-300">3개: 금 +400/일, 민심 +4</div>
                </div>
              </div>

              <!-- 군사 -->
              <div class="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-600/50 rounded-lg p-2 sm:p-3">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xl sm:text-2xl">⚔️</span>
                  <h4 class="text-xs sm:text-sm font-bold text-red-300">군사</h4>
                </div>
                <p class="text-[10px] sm:text-xs text-slate-300 mb-1">전투력과 병력 강화</p>
                <div class="bg-slate-900/50 p-1.5 rounded text-[9px] sm:text-[10px] space-y-0.5">
                  <div class="text-green-300">2개: 공격력 +15%, 방어력 +10%</div>
                  <div class="text-purple-300">3개: 공격력 +30%, 방어력 +20%</div>
                </div>
              </div>

              <!-- 농업 -->
              <div class="bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-600/50 rounded-lg p-2 sm:p-3">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xl sm:text-2xl">🌾</span>
                  <h4 class="text-xs sm:text-sm font-bold text-green-300">농업</h4>
                </div>
                <p class="text-[10px] sm:text-xs text-slate-300 mb-1">식량 생산과 인구 증가</p>
                <div class="bg-slate-900/50 p-1.5 rounded text-[9px] sm:text-[10px] space-y-0.5">
                  <div class="text-green-300">2개: 식량 +200/일, 인구 +20</div>
                  <div class="text-purple-300">3개: 식량 +400/일, 인구 +40</div>
                </div>
              </div>

              <!-- 문화 -->
              <div class="bg-gradient-to-r from-pink-900/20 to-pink-800/20 border border-pink-600/50 rounded-lg p-2 sm:p-3">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xl sm:text-2xl">🎭</span>
                  <h4 class="text-xs sm:text-sm font-bold text-pink-300">문화</h4>
                </div>
                <p class="text-[10px] sm:text-xs text-slate-300 mb-1">민심과 행복도 상승</p>
                <div class="bg-slate-900/50 p-1.5 rounded text-[9px] sm:text-[10px] space-y-0.5">
                  <div class="text-green-300">2개: 민심 +4, 금 +150/일</div>
                  <div class="text-purple-300">3개: 민심 +8, 금 +300/일</div>
                </div>
              </div>

              <!-- 마법 -->
              <div class="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border border-purple-600/50 rounded-lg p-2 sm:p-3">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xl sm:text-2xl">🔮</span>
                  <h4 class="text-xs sm:text-sm font-bold text-purple-300">마법</h4>
                </div>
                <p class="text-[10px] sm:text-xs text-slate-300 mb-1">신비한 능력과 보너스</p>
                <div class="bg-slate-900/50 p-1.5 rounded text-[9px] sm:text-[10px] space-y-0.5">
                  <div class="text-green-300">2개: 금 +150/일, 공격력 +10%</div>
                  <div class="text-purple-300">3개: 금 +300/일, 공격력 +20%</div>
                </div>
              </div>

              <!-- 종교 -->
              <div class="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-600/50 rounded-lg p-2 sm:p-3">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xl sm:text-2xl">⛪</span>
                  <h4 class="text-xs sm:text-sm font-bold text-blue-300">종교</h4>
                </div>
                <p class="text-[10px] sm:text-xs text-slate-300 mb-1">민심과 안정성 향상</p>
                <div class="bg-slate-900/50 p-1.5 rounded text-[9px] sm:text-[10px] space-y-0.5">
                  <div class="text-green-300">2개: 민심 +5, 식량 +100/일</div>
                  <div class="text-purple-300">3개: 민심 +10, 식량 +200/일</div>
                </div>
              </div>

              <!-- 기술 -->
              <div class="bg-gradient-to-r from-cyan-900/20 to-cyan-800/20 border border-cyan-600/50 rounded-lg p-2 sm:p-3">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xl sm:text-2xl">⚙️</span>
                  <h4 class="text-xs sm:text-sm font-bold text-cyan-300">기술</h4>
                </div>
                <p class="text-[10px] sm:text-xs text-slate-300 mb-1">생산성과 효율성 증가</p>
                <div class="bg-slate-900/50 p-1.5 rounded text-[9px] sm:text-[10px] space-y-0.5">
                  <div class="text-green-300">2개: 금 +100/일, 식량 +100/일</div>
                  <div class="text-purple-300">3개: 금 +200/일, 식량 +200/일</div>
                </div>
              </div>

              <!-- 정복 -->
              <div class="bg-gradient-to-r from-orange-900/20 to-orange-800/20 border border-orange-600/50 rounded-lg p-2 sm:p-3">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xl sm:text-2xl">🔥</span>
                  <h4 class="text-xs sm:text-sm font-bold text-orange-300">정복</h4>
                </div>
                <p class="text-[10px] sm:text-xs text-slate-300 mb-1">침략과 전투 보상 증가</p>
                <div class="bg-slate-900/50 p-1.5 rounded text-[9px] sm:text-[10px] space-y-0.5">
                  <div class="text-green-300">2개: 병력 +300, 공격력 +10%</div>
                  <div class="text-purple-300">3개: 병력 +600, 공격력 +20%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 전략 팁 -->
          <div class="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/50 rounded-lg p-3 sm:p-4">
            <h3 class="text-sm sm:text-base font-bold text-yellow-300 mb-2 flex items-center gap-2">
              <span>💡</span> 전략 팁
            </h3>
            <div class="space-y-2 text-[10px] sm:text-xs text-slate-300">
              <div class="flex gap-2">
                <span class="text-green-400 flex-shrink-0">✓</span>
                <p><span class="font-bold text-purple-300">시너지 빌드:</span> 같은 태그 카드를 모아 강력한 보너스 획득</p>
              </div>
              <div class="flex gap-2">
                <span class="text-green-400 flex-shrink-0">✓</span>
                <p><span class="font-bold text-blue-300">독립 빌드:</span> 독립 카드로 안정적이고 강력한 효과</p>
              </div>
              <div class="flex gap-2">
                <span class="text-green-400 flex-shrink-0">✓</span>
                <p><span class="font-bold text-yellow-300">혼합 빌드:</span> 시너지 카드 + 독립 카드를 적절히 조합</p>
              </div>
              <div class="flex gap-2">
                <span class="text-orange-400 flex-shrink-0">⚠</span>
                <p class="text-orange-200">카드를 교환할 때 <span class="font-bold">시너지 프리뷰</span>를 확인하세요!</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 sm:p-4 border-t-2 border-purple-600/30 bg-purple-900/20">
          <button
            @click="$emit('close')"
            class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-white transition-colors text-sm"
          >
            닫기
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

defineEmits<{
  'close': []
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

.modal-enter-active .bg-gradient-to-br,
.modal-leave-active .bg-gradient-to-br {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-gradient-to-br,
.modal-leave-to .bg-gradient-to-br {
  transform: scale(0.9);
}
</style>
