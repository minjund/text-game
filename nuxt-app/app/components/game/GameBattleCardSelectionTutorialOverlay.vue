<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[10002] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-4">
      <!-- 튜토리얼 포인터 및 설명 -->
      <div class="absolute inset-0 pointer-events-none">
        <!-- Step 1: 적 정보 확인 -->
        <div v-if="currentStep === 1" class="absolute top-16 md:top-24 left-1/2 -translate-x-1/2 w-full max-w-md px-2 md:px-4">
          <div class="bg-gradient-to-br from-amber-600 to-orange-700 border-2 border-amber-400 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-2xl pointer-events-auto animate-bounce-slow">
            <div class="flex items-start gap-2 md:gap-4">
              <div class="text-3xl md:text-5xl">🎯</div>
              <div class="flex-1">
                <h3 class="text-base md:text-xl font-bold text-white mb-1 md:mb-2">적 정보 확인</h3>
                <p class="text-xs md:text-sm text-amber-100 mb-2 md:mb-3">
                  전투를 시작하기 전, 적의 정보를 확인하세요.
                </p>
                <div class="text-[10px] md:text-xs text-amber-50 space-y-0.5 md:space-y-1 bg-black/20 rounded-lg p-2 md:p-3">
                  <div>• 적군 이름과 병력 확인</div>
                  <div>• 예상 난이도를 참고해 전략 수립</div>
                  <div>• 내 병력과 비교하여 승산 판단</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: 액티브 카드 선택 -->
        <div v-if="currentStep === 2" class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-lg px-2 md:px-4">
          <div class="bg-gradient-to-br from-purple-600 to-pink-700 border-2 border-purple-400 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-2xl pointer-events-auto">
            <div class="flex items-start gap-2 md:gap-4">
              <div class="text-3xl md:text-5xl">🎴</div>
              <div class="flex-1">
                <h3 class="text-base md:text-xl font-bold text-white mb-1 md:mb-2">액티브 카드 선택</h3>
                <p class="text-xs md:text-sm text-purple-100 mb-2 md:mb-3">
                  전투에 사용할 액티브 카드를 최대 3장까지 선택하세요.
                </p>
                <div class="text-[10px] md:text-xs text-purple-50 space-y-0.5 md:space-y-1 bg-black/20 rounded-lg p-2 md:p-3">
                  <div>• 카드를 클릭하면 선택/해제</div>
                  <div>• 최대 3장까지 선택 가능</div>
                  <div>• 각 카드는 전투당 1회만 사용 가능</div>
                  <div>• 전투 중 일시정지 후 사용</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: 카드 등급 설명 -->
        <div v-if="currentStep === 3" class="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-full max-w-md px-2 md:px-4">
          <div class="bg-gradient-to-br from-blue-600 to-cyan-700 border-2 border-blue-400 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-2xl pointer-events-auto">
            <div class="flex items-start gap-2 md:gap-4">
              <div class="text-3xl md:text-5xl">💎</div>
              <div class="flex-1">
                <h3 class="text-base md:text-xl font-bold text-white mb-1 md:mb-2">카드 등급</h3>
                <p class="text-xs md:text-sm text-blue-100 mb-2 md:mb-3">
                  카드 테두리와 배지로 등급을 확인하세요.
                </p>
                <div class="text-[10px] md:text-xs text-blue-50 space-y-0.5 md:space-y-1 bg-black/20 rounded-lg p-2 md:p-3">
                  <div class="flex items-center gap-2">
                    <span class="text-yellow-400 font-bold">전설</span>
                    <span>최강 효과</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-purple-400 font-bold">영웅</span>
                    <span>강력한 효과</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-blue-400 font-bold">희귀</span>
                    <span>유용한 효과</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-slate-300 font-bold">일반</span>
                    <span>기본 효과</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: 완료 -->
        <div v-if="currentStep === 4" class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-md px-2 md:px-4">
          <div class="bg-gradient-to-br from-green-600 to-emerald-700 border-2 border-green-400 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl pointer-events-auto">
            <div class="text-center">
              <div class="text-4xl md:text-6xl mb-2 md:mb-4">⚔️</div>
              <h3 class="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3">전투 준비 완료!</h3>
              <p class="text-xs md:text-sm text-green-100 mb-3 md:mb-4">
                카드를 선택했다면 "선택 완료" 버튼을 눌러<br/>
                전투를 시작하세요!
              </p>
              <button
                @click="complete"
                class="px-6 py-2 md:px-8 md:py-3 bg-white text-green-700 rounded-lg font-bold hover:bg-green-50 transition-all shadow-lg text-base md:text-lg"
              >
                이해했습니다! ⚔️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 하단 네비게이션 (Step 1-3) -->
      <div v-if="currentStep < 4" class="absolute bottom-2 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 pointer-events-auto">
        <!-- 이전 버튼 -->
        <button
          v-if="currentStep > 1"
          @click="previousStep"
          class="px-3 py-2 md:px-6 md:py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all flex items-center gap-1 md:gap-2 text-xs md:text-base"
        >
          <span>←</span>
          <span>이전</span>
        </button>

        <!-- 진행 상태 -->
        <div class="flex items-center gap-1.5 md:gap-2">
          <div
            v-for="i in 4"
            :key="i"
            class="h-1.5 md:h-2 rounded-full transition-all duration-300"
            :class="i === currentStep ? 'w-6 md:w-8 bg-purple-500' : 'w-1.5 md:w-2 bg-slate-600'"
          ></div>
        </div>

        <!-- 다음 버튼 -->
        <button
          @click="nextStep"
          class="px-3 py-2 md:px-6 md:py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-all flex items-center gap-1 md:gap-2 shadow-lg shadow-purple-500/30 text-xs md:text-base"
        >
          <span>다음</span>
          <span>→</span>
        </button>

        <!-- 건너뛰기 -->
        <button
          @click="skip"
          class="ml-2 md:ml-4 text-[10px] md:text-xs text-slate-400 hover:text-slate-200 underline transition-colors"
        >
          건너뛰기
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  complete: []
  skip: []
}>()

const currentStep = ref(1)

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const complete = () => {
  emit('complete')
}

const skip = () => {
  emit('skip')
}

// 모달이 열릴 때마다 첫 스텝으로 리셋
watch(() => props.show, (newVal) => {
  if (newVal) {
    currentStep.value = 1
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
