<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[10002] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-4">
      <!-- 튜토리얼 포인터 및 설명 -->
      <div class="absolute inset-0 pointer-events-none">
        <!-- Step 1: 전투 스코어 강조 -->
        <div v-if="currentStep === 1" class="absolute top-2 md:top-4 lg:top-8 left-1/2 -translate-x-1/2 w-full max-w-md px-2 md:px-4">
          <div class="bg-gradient-to-br from-yellow-600 to-amber-700 border-2 border-yellow-400 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-2xl pointer-events-auto animate-bounce-slow">
            <div class="flex items-start gap-2 md:gap-4">
              <div class="text-3xl md:text-5xl">🎯</div>
              <div class="flex-1">
                <h3 class="text-base md:text-xl font-bold text-white mb-1 md:mb-2">전투 승점 시스템</h3>
                <p class="text-xs md:text-sm text-yellow-100 mb-2 md:mb-3">
                  전투는 실시간으로 진행되며, 상단의 승점으로 전투 상황을 파악할 수 있습니다.
                </p>
                <div class="text-[10px] md:text-xs text-yellow-50 space-y-0.5 md:space-y-1 bg-black/20 rounded-lg p-2 md:p-3">
                  <div>• 💪 크게 우세: 승리 확률 높음</div>
                  <div>• ⚖️ 팽팽한 접전: 카드 사용이 중요!</div>
                  <div>• 🚨 크게 열세: 액티브 카드로 역전!</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: 전투 로그 강조 -->
        <div v-if="currentStep === 2" class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-lg px-2 md:px-4">
          <div class="bg-gradient-to-br from-cyan-600 to-blue-700 border-2 border-cyan-400 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-2xl pointer-events-auto">
            <div class="flex items-start gap-2 md:gap-4">
              <div class="text-3xl md:text-5xl">📖</div>
              <div class="flex-1">
                <h3 class="text-base md:text-xl font-bold text-white mb-1 md:mb-2">전투 로그 읽기</h3>
                <p class="text-xs md:text-sm text-cyan-100 mb-2 md:mb-3">
                  중앙의 전투 로그에서 실시간 전투 상황을 확인하세요.
                </p>
                <div class="text-[10px] md:text-xs text-cyan-50 space-y-1 md:space-y-2 bg-black/20 rounded-lg p-2 md:p-3">
                  <div class="flex items-center gap-1 md:gap-2">
                    <span class="w-12 md:w-16 text-slate-300 font-bold">흰색</span>
                    <span>상황 묘사</span>
                  </div>
                  <div class="flex items-center gap-1 md:gap-2">
                    <span class="w-12 md:w-16 text-amber-200 font-bold">노란색</span>
                    <span>액션</span>
                  </div>
                  <div class="flex items-center gap-1 md:gap-2">
                    <span class="w-12 md:w-16 text-cyan-300 font-bold">청록색</span>
                    <span>대사</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: 액티브 카드 강조 -->
        <div v-if="currentStep === 3" class="absolute bottom-2 md:bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-2 md:px-4">
          <div class="bg-gradient-to-br from-purple-600 to-pink-700 border-2 border-purple-400 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-2xl pointer-events-auto animate-pulse">
            <div class="flex items-start gap-2 md:gap-4">
              <div class="text-3xl md:text-5xl">✨</div>
              <div class="flex-1">
                <h3 class="text-base md:text-xl font-bold text-white mb-1 md:mb-2">액티브 카드 사용</h3>
                <p class="text-xs md:text-sm text-purple-100 mb-2 md:mb-3">
                  전투 중 노란색 타이머가 나타나면 15초 동안 카드를 사용할 수 있습니다!
                </p>
                <div class="text-[10px] md:text-xs text-purple-50 space-y-0.5 md:space-y-1 bg-black/20 rounded-lg p-2 md:p-3">
                  <div>• "추천!" 배지 = 현재 상황에 유리한 카드</div>
                  <div>• 각 카드는 전투당 1회만 사용 가능</div>
                  <div>• 타이머 내에 사용하지 않으면 기회 소멸</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: 완료 -->
        <div v-if="currentStep === 4" class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-md px-2 md:px-4">
          <div class="bg-gradient-to-br from-green-600 to-emerald-700 border-2 border-green-400 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl pointer-events-auto">
            <div class="text-center">
              <div class="text-4xl md:text-6xl mb-2 md:mb-4">🎉</div>
              <h3 class="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3">준비 완료!</h3>
              <p class="text-xs md:text-sm text-green-100 mb-3 md:mb-4">
                이제 전투를 시작할 준비가 되었습니다.<br/>
                행운을 빕니다, 폐하!
              </p>
              <button
                @click="complete"
                class="px-6 py-2 md:px-8 md:py-3 bg-white text-green-700 rounded-lg font-bold hover:bg-green-50 transition-all shadow-lg text-base md:text-lg"
              >
                전투 시작! ⚔️
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
            :class="i === currentStep ? 'w-6 md:w-8 bg-amber-500' : 'w-1.5 md:w-2 bg-slate-600'"
          ></div>
        </div>

        <!-- 다음 버튼 -->
        <button
          @click="nextStep"
          class="px-3 py-2 md:px-6 md:py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold transition-all flex items-center gap-1 md:gap-2 shadow-lg shadow-amber-500/30 text-xs md:text-base"
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
