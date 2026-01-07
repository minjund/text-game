<template>
  <div v-if="show" class="fixed top-2 left-1/2 transform -translate-x-1/2 z-[10000] w-[98%] sm:w-[90%] max-w-2xl px-2">
    <div class="relative bg-black/95 rounded-2xl border-2 sm:border-4 border-yellow-500 shadow-xl shadow-yellow-500/30 p-2 sm:p-4">
      <!-- 주사위 제목 (작게) -->
      <div class="text-center mb-2">
        <h2 class="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
          🎲 주사위
        </h2>
      </div>

      <!-- 주사위 3D (깔끔하게) -->
      <div class="relative bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-900 border-2 sm:border-3 border-yellow-600 rounded-xl p-4 sm:p-6 shadow-lg mb-2">
        <!-- 3개의 주사위 -->
        <div class="flex gap-4 sm:gap-8 justify-center items-center">
          <div
            v-for="(slot, index) in 3"
            :key="index"
            class="dice-container"
          >
            <!-- 3D 주사위 -->
            <div
              :class="[
                'dice',
                isRolling ? 'rolling' : '',
                diceResults[index] ? `show-${diceResults[index]}` : ''
              ]"
            >
              <!-- 주사위 6면 -->
              <div class="dice-face face-1">
                <span class="dot"></span>
              </div>
              <div class="dice-face face-2">
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
              <div class="dice-face face-3">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
              <div class="dice-face face-4">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
              <div class="dice-face face-5">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
              <div class="dice-face face-6">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
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
          <span class="relative z-10">🎲 주사위 굴리기</span>
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
  if (props.isRolling) return '주사위를 굴리는 중...'
  if (props.diceResults.length === 0) return '주사위를 굴려주세요!'
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
/* 주사위 컨테이너 */
.dice-container {
  perspective: 600px;
  width: 60px;
  height: 60px;
}

@media (min-width: 640px) {
  .dice-container {
    width: 80px;
    height: 80px;
  }
}

/* 주사위 */
.dice {
  width: 60px;
  height: 60px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-out;
}

@media (min-width: 640px) {
  .dice {
    width: 80px;
    height: 80px;
  }
}

/* 주사위 면 */
.dice-face {
  position: absolute;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  border: 2px solid #333;
  border-radius: 8px;
  display: grid;
  padding: 8px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

@media (min-width: 640px) {
  .dice-face {
    width: 80px;
    height: 80px;
    padding: 10px;
    border-radius: 10px;
  }
}

/* 점 */
.dot {
  width: 10px;
  height: 10px;
  background: #333;
  border-radius: 50%;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
}

@media (min-width: 640px) {
  .dot {
    width: 14px;
    height: 14px;
  }
}

/* 각 면의 점 배치 */
.face-1 {
  display: flex;
  justify-content: center;
  align-items: center;
}

.face-2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.face-2 .dot:nth-child(2) {
  align-self: flex-end;
}

.face-3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.face-3 .dot:nth-child(2) {
  align-self: center;
}
.face-3 .dot:nth-child(3) {
  align-self: flex-end;
}

.face-4 {
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(2, 1fr);
  gap: 18px;
  padding: 10px;
}

@media (min-width: 640px) {
  .face-4 {
    gap: 26px;
    padding: 14px;
  }
}

.face-5 {
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(2, 1fr);
  gap: 18px;
  padding: 10px;
}
.face-5 .dot:nth-child(5) {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
  justify-self: center;
  align-self: center;
}

@media (min-width: 640px) {
  .face-5 {
    gap: 26px;
    padding: 14px;
  }
}

.face-6 {
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(2, 1fr);
  gap: 8px;
  padding: 10px;
}

@media (min-width: 640px) {
  .face-6 {
    gap: 12px;
    padding: 14px;
  }
}

/* 주사위 6면 위치 */
.face-1 {
  transform: rotateY(0deg) translateZ(30px);
}
.face-2 {
  transform: rotateY(90deg) translateZ(30px);
}
.face-3 {
  transform: rotateY(180deg) translateZ(30px);
}
.face-4 {
  transform: rotateY(-90deg) translateZ(30px);
}
.face-5 {
  transform: rotateX(90deg) translateZ(30px);
}
.face-6 {
  transform: rotateX(-90deg) translateZ(30px);
}

@media (min-width: 640px) {
  .face-1 {
    transform: rotateY(0deg) translateZ(40px);
  }
  .face-2 {
    transform: rotateY(90deg) translateZ(40px);
  }
  .face-3 {
    transform: rotateY(180deg) translateZ(40px);
  }
  .face-4 {
    transform: rotateY(-90deg) translateZ(40px);
  }
  .face-5 {
    transform: rotateX(90deg) translateZ(40px);
  }
  .face-6 {
    transform: rotateX(-90deg) translateZ(40px);
  }
}

/* 굴리는 애니메이션 */
@keyframes roll-dice {
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  100% {
    transform: rotateX(720deg) rotateY(720deg);
  }
}

.dice.rolling {
  animation: roll-dice 1s ease-out;
}

/* 각 숫자 면 보여주기 */
.dice.show-1 {
  transform: rotateY(0deg) rotateX(0deg);
}
.dice.show-2 {
  transform: rotateY(-90deg) rotateX(0deg);
}
.dice.show-3 {
  transform: rotateY(-180deg) rotateX(0deg);
}
.dice.show-4 {
  transform: rotateY(90deg) rotateX(0deg);
}
.dice.show-5 {
  transform: rotateX(-90deg) rotateY(0deg);
}
.dice.show-6 {
  transform: rotateX(90deg) rotateY(0deg);
}
</style>
