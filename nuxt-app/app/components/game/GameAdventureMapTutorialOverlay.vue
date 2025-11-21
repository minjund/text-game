<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[10003] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-4">
      <!-- 튜토리얼 포인터 및 설명 -->
      <div class="absolute inset-0 pointer-events-none">
        <!-- Step 1: 로드맵 시스템 소개 -->
        <div v-if="currentStep === 1" class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-lg px-2 md:px-4">
          <div class="bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-blue-400 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-2xl pointer-events-auto">
            <div class="flex items-start gap-2 md:gap-4">
              <div class="text-3xl md:text-5xl">🗺️</div>
              <div class="flex-1">
                <h3 class="text-base md:text-xl font-bold text-white mb-1 md:mb-2">전장의 기록에 오신 것을 환영합니다!</h3>
                <p class="text-xs md:text-sm text-blue-100 mb-2 md:mb-3">
                  7개 층으로 이루어진 로드맵을 따라 다양한 노드를 탐험하세요.
                </p>
                <div class="text-[10px] md:text-xs text-blue-50 space-y-0.5 md:space-y-1 bg-black/20 rounded-lg p-2 md:p-3">
                  <div>• 🗡️ 전투: 적과 싸워 보상 획득</div>
                  <div>• 🏪 상점: 금으로 카드 구매</div>
                  <div>• 🛏️ 휴식: 병력 회복</div>
                  <div>• 📦 보물: 즉시 보상 획득</div>
                  <div>• 🎲 이벤트: 선택지에 따른 결과</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: 경로 선택 설명 -->
        <div v-if="currentStep === 2" class="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-full max-w-md px-2 md:px-4">
          <div class="bg-gradient-to-br from-purple-600 to-pink-700 border-2 border-purple-400 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-2xl pointer-events-auto animate-bounce-slow">
            <div class="flex items-start gap-2 md:gap-4">
              <div class="text-3xl md:text-5xl">🎯</div>
              <div class="flex-1">
                <h3 class="text-base md:text-xl font-bold text-white mb-1 md:mb-2">경로 선택하기</h3>
                <p class="text-xs md:text-sm text-purple-100 mb-2 md:mb-3">
                  하단에서 시작해 상단 목표까지 도달하세요!
                </p>
                <div class="text-[10px] md:text-xs text-purple-50 space-y-0.5 md:space-y-1 bg-black/20 rounded-lg p-2 md:p-3">
                  <div>• 📍 현재 위치에서 연결된 노드만 선택 가능</div>
                  <div>• 각 노드는 한 번만 방문 가능</div>
                  <div>• 전략적으로 경로를 선택하세요!</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: 누적 보상 설명 -->
        <div v-if="currentStep === 3" class="absolute top-2 md:top-4 left-2 md:left-4 w-full max-w-xs px-2 md:px-4">
          <div class="bg-gradient-to-br from-yellow-600 to-amber-700 border-2 border-yellow-400 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-2xl pointer-events-auto">
            <div class="flex items-start gap-2 md:gap-4">
              <div class="text-3xl md:text-5xl">💰</div>
              <div class="flex-1">
                <h3 class="text-base md:text-xl font-bold text-white mb-1 md:mb-2">누적 보상</h3>
                <p class="text-xs md:text-sm text-yellow-100 mb-2 md:mb-3">
                  상단의 누적 보상을 확인하세요.
                </p>
                <div class="text-[10px] md:text-xs text-yellow-50 space-y-0.5 md:space-y-1 bg-black/20 rounded-lg p-2 md:p-3">
                  <div>• 모든 노드에서 획득한 보상 합계</div>
                  <div>• 완주 또는 포기 시 왕국에 적용</div>
                  <div>• 실패 시 보상 절반만 획득</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: 포기 버튼 및 목표 -->
        <div v-if="currentStep === 4" class="absolute top-2 md:top-4 right-2 md:right-4 w-full max-w-xs px-2 md:px-4">
          <div class="bg-gradient-to-br from-red-600 to-rose-700 border-2 border-red-400 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-2xl pointer-events-auto">
            <div class="flex items-start gap-2 md:gap-4">
              <div class="text-3xl md:text-5xl">⚠️</div>
              <div class="flex-1">
                <h3 class="text-base md:text-xl font-bold text-white mb-1 md:mb-2">포기 버튼</h3>
                <p class="text-xs md:text-sm text-red-100 mb-2 md:mb-3">
                  위험하다면 언제든지 포기할 수 있습니다.
                </p>
                <div class="text-[10px] md:text-xs text-red-50 space-y-0.5 md:space-y-1 bg-black/20 rounded-lg p-2 md:p-3">
                  <div>• 포기 시 누적 보상 그대로 획득</div>
                  <div>• 전투 패배 시 보상 절반만 획득</div>
                  <div>• 신중하게 판단하세요!</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5: 완료 -->
        <div v-if="currentStep === 5" class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-md px-2 md:px-4">
          <div class="bg-gradient-to-br from-green-600 to-emerald-700 border-2 border-green-400 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl pointer-events-auto">
            <div class="text-center">
              <div class="text-4xl md:text-6xl mb-2 md:mb-4">⚔️</div>
              <h3 class="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3">모험을 시작하세요!</h3>
              <p class="text-xs md:text-sm text-green-100 mb-3 md:mb-4">
                7개 층을 탐험하고 막대한 보상을 얻으세요.<br/>
                행운을 빕니다, 폐하!
              </p>
              <button
                @click="complete"
                class="px-6 py-2 md:px-8 md:py-3 bg-white text-green-700 rounded-lg font-bold hover:bg-green-50 transition-all shadow-lg text-base md:text-lg"
              >
                탐험 시작! 🗺️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 하단 네비게이션 (Step 1-4) -->
      <div v-if="currentStep < 5" class="absolute bottom-2 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 pointer-events-auto">
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
            v-for="i in 5"
            :key="i"
            class="h-1.5 md:h-2 rounded-full transition-all duration-300"
            :class="i === currentStep ? 'w-6 md:w-8 bg-blue-500' : 'w-1.5 md:w-2 bg-slate-600'"
          ></div>
        </div>

        <!-- 다음 버튼 -->
        <button
          @click="nextStep"
          class="px-3 py-2 md:px-6 md:py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all flex items-center gap-1 md:gap-2 shadow-lg shadow-blue-500/30 text-xs md:text-base"
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
  if (currentStep.value < 5) {
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
