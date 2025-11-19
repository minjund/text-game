<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm">
      <!-- 오버레이 (클릭 방지) -->
      <div class="absolute inset-0 pointer-events-none"></div>

      <!-- Page 1: 환영 및 게임 목표 -->
      <div v-if="currentStep === 1" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4 pointer-events-auto">
        <div class="bg-gradient-to-br from-amber-600 to-amber-700 border-2 border-amber-400 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl">
          <div class="text-center">
            <div class="text-5xl md:text-6xl mb-3 md:mb-4">👑</div>
            <h2 class="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">왕국의 통치자여!</h2>
            <div class="text-left bg-black/20 rounded-lg p-4 mb-4 space-y-3">
              <p class="text-sm md:text-base text-amber-100">
                <span class="text-yellow-300 font-bold">⏰ 목표:</span> <span class="text-red-300 font-bold">42일</span> 안에 <span class="text-red-300 font-bold">아카샤 제국</span>을 정복하세요!
              </p>
              <p class="text-sm md:text-base text-amber-100">
                <span class="text-yellow-300 font-bold">⚔️ 주의:</span> <span class="text-red-300 font-bold">7일마다 제국의 침략</span>이 시작됩니다!
              </p>
              <p class="text-sm md:text-base text-amber-100">
                <span class="text-yellow-300 font-bold">🔄 환생:</span> 실패해도 강력한 보너스와 함께 다시 시작할 수 있습니다.
              </p>
            </div>
            <button
              @click="nextStep"
              class="w-full px-6 py-3 bg-white text-amber-700 rounded-lg font-bold hover:bg-amber-50 transition-all shadow-lg"
            >
              다음: 자원 관리 →
            </button>
          </div>
        </div>
      </div>

      <!-- Page 2: 자원 관리 -->
      <div v-if="currentStep === 2" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl px-4 pointer-events-auto max-h-[90vh] overflow-y-auto">
        <div class="bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-blue-400 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl">
          <div class="text-center mb-4">
            <div class="text-4xl md:text-5xl mb-2">📊</div>
            <h2 class="text-xl md:text-2xl font-bold text-white mb-2">자원 관리</h2>
            <p class="text-sm md:text-base text-blue-200">왕국을 운영하는 핵심 자원들을 확인하세요</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <!-- 금화 -->
            <div class="bg-gradient-to-br from-yellow-600/30 to-amber-700/30 border-2 border-yellow-400/50 rounded-lg p-3 md:p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl md:text-3xl">💰</span>
                <h3 class="text-base md:text-lg font-bold text-yellow-300">금화</h3>
              </div>
              <p class="text-xs md:text-sm text-yellow-100">
                병사를 모집하고 왕국을 발전시키는데 필요합니다.<br/>
                <span class="text-yellow-300 font-bold">매일 자동 생산</span>됩니다.
              </p>
            </div>

            <!-- 식량 -->
            <div class="bg-gradient-to-br from-green-600/30 to-emerald-700/30 border-2 border-green-400/50 rounded-lg p-3 md:p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl md:text-3xl">🌾</span>
                <h3 class="text-base md:text-lg font-bold text-green-300">식량</h3>
              </div>
              <p class="text-xs md:text-sm text-green-100">
                병사들을 먹여 살리는데 필요합니다.<br/>
                식량이 부족하면 <span class="text-red-300 font-bold">민심이 떨어집니다</span>!
              </p>
            </div>

            <!-- 병력 -->
            <div class="bg-gradient-to-br from-red-600/30 to-red-700/30 border-2 border-red-400/50 rounded-lg p-3 md:p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl md:text-3xl">⚔️</span>
                <h3 class="text-base md:text-lg font-bold text-red-300">병력</h3>
              </div>
              <p class="text-xs md:text-sm text-red-100">
                전투의 핵심 자원입니다.<br/>
                <span class="text-yellow-300 font-bold">금화 200</span>으로 <span class="text-yellow-300 font-bold">병력 100</span>을 모집할 수 있습니다.
              </p>
            </div>

            <!-- 민심 -->
            <div class="bg-gradient-to-br from-purple-600/30 to-purple-700/30 border-2 border-purple-400/50 rounded-lg p-3 md:p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl md:text-3xl">❤️</span>
                <h3 class="text-base md:text-lg font-bold text-purple-300">민심</h3>
              </div>
              <p class="text-xs md:text-sm text-purple-100">
                왕국의 안정성을 나타냅니다.<br/>
                민심이 높을수록 <span class="text-yellow-300 font-bold">자원 생산량이 증가</span>합니다.
              </p>
            </div>
          </div>

          <button
            @click="nextStep"
            class="w-full px-6 py-3 bg-white text-blue-700 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-lg"
          >
            다음: 게임 기능 →
          </button>
        </div>
      </div>

      <!-- Page 3: 게임 기능 -->
      <div v-if="currentStep === 3" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-4 pointer-events-auto max-h-[90vh] overflow-y-auto">
        <div class="bg-gradient-to-br from-purple-600 to-pink-700 border-2 border-purple-400 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl">
          <div class="text-center mb-4">
            <div class="text-4xl md:text-5xl mb-2">🎮</div>
            <h2 class="text-xl md:text-2xl font-bold text-white mb-2">게임 기능</h2>
            <p class="text-sm md:text-base text-purple-200">왕국 운영에 필요한 모든 기능을 확인하세요</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 mb-4">
            <!-- 병력 모집 -->
            <div class="bg-gradient-to-br from-emerald-600/30 to-green-700/30 border-2 border-emerald-400/50 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-xl md:text-2xl">🛡️</span>
                <h3 class="text-sm md:text-base font-bold text-emerald-300">병력 모집</h3>
              </div>
              <p class="text-[10px] md:text-xs text-emerald-100">
                금화로 병사를 모집합니다. 전투에 필수!
              </p>
            </div>

            <!-- 신의 계명 -->
            <div class="bg-gradient-to-br from-amber-600/30 to-amber-700/30 border-2 border-amber-400/50 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-xl md:text-2xl">✨</span>
                <h3 class="text-sm md:text-base font-bold text-amber-300">신의 계명</h3>
              </div>
              <p class="text-[10px] md:text-xs text-amber-100">
                선택한 5가지 계명의 보너스를 확인합니다.
              </p>
            </div>

            <!-- 보유 카드 -->
            <div class="bg-gradient-to-br from-purple-600/30 to-purple-700/30 border-2 border-purple-400/50 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-xl md:text-2xl">🎴</span>
                <h3 class="text-sm md:text-base font-bold text-purple-300">보유 카드</h3>
              </div>
              <p class="text-[10px] md:text-xs text-purple-100">
                패시브 카드 목록 (최대 15장)을 확인합니다.
              </p>
            </div>

            <!-- 카드 덱 설정 -->
            <div class="bg-gradient-to-br from-orange-600/30 to-orange-700/30 border-2 border-orange-400/50 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-xl md:text-2xl">🃏</span>
                <h3 class="text-sm md:text-base font-bold text-orange-300">카드 덱 설정</h3>
              </div>
              <p class="text-[10px] md:text-xs text-orange-100">
                <span class="text-yellow-300 font-bold">내정 3장 + 전투 3장</span>을 장착합니다.
              </p>
            </div>

            <!-- 카드 도감 -->
            <div class="bg-gradient-to-br from-indigo-600/30 to-indigo-700/30 border-2 border-indigo-400/50 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-xl md:text-2xl">📚</span>
                <h3 class="text-sm md:text-base font-bold text-indigo-300">카드 도감</h3>
              </div>
              <p class="text-[10px] md:text-xs text-indigo-100">
                모든 카드 정보와 <span class="text-yellow-300 font-bold">시너지 효과</span>를 확인합니다.
              </p>
            </div>

            <!-- 일반 전투 -->
            <div class="bg-gradient-to-br from-red-600/30 to-red-700/30 border-2 border-red-400/50 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-xl md:text-2xl">⚔️</span>
                <h3 class="text-sm md:text-base font-bold text-red-300">일반 전투</h3>
              </div>
              <p class="text-[10px] md:text-xs text-red-100">
                적과 전투합니다. 승리 시 보상, 패배 시 민심 감소!
              </p>
            </div>
          </div>

          <div class="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-lg p-3 mb-4">
            <div class="flex items-start gap-2">
              <span class="text-xl md:text-2xl">💡</span>
              <div class="flex-1">
                <h3 class="text-sm md:text-base font-bold text-yellow-300 mb-1">중요 팁</h3>
                <ul class="text-[10px] md:text-xs text-yellow-100 space-y-1 list-disc list-inside">
                  <li><span class="font-bold">카드는 반드시 덱에 장착</span>해야 효과가 발동됩니다!</li>
                  <li>시너지 카드를 모아서 강력한 보너스를 얻으세요.</li>
                  <li>매일 자원이 자동 생산되니 자주 확인하세요.</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            @click="complete"
            class="w-full px-6 py-3 bg-white text-purple-700 rounded-lg font-bold hover:bg-purple-50 transition-all shadow-lg"
          >
            튜토리얼 완료! 게임 시작 🚀
          </button>
        </div>
      </div>

      <!-- 하단 진행 상태 -->
      <div v-if="currentStep >= 1 && currentStep <= 3" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-auto">
        <div
          v-for="i in 3"
          :key="i"
          class="h-2 rounded-full transition-all duration-300"
          :class="i === currentStep ? 'w-8 bg-amber-500' : i < currentStep ? 'w-2 bg-amber-600' : 'w-2 bg-gray-600'"
        ></div>
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
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const complete = () => {
  emit('complete')
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

.animate-bounce {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
