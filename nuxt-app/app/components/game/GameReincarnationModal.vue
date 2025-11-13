<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-2 sm:p-4" @click.self="() => {}">
      <!-- Step 1: Defeat Scenario -->
      <div v-if="currentStep === 1" class="max-w-3xl w-full">
        <div class="bg-gradient-to-br from-red-950/80 to-black/80 border-2 border-red-600 rounded-lg p-4 sm:p-6 md:p-8 backdrop-blur-sm">
          <div class="text-center mb-6 sm:mb-8">
            <div class="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-pulse">💀</div>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-red-400 mb-2">왕국의 멸망</h2>
          </div>

          <div class="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8">
            <p v-for="(line, index) in visibleLines" :key="index"
               class="text-gray-200"
               :class="{ 'opacity-0 animate-fade-in': index === visibleLines.length - 1 }">
              {{ line }}
            </p>
          </div>

          <div v-if="showContinueButton" class="text-center">
            <button @click="nextStep"
                    class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 font-bold text-base sm:text-lg md:text-xl transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto">
              계속...
            </button>
          </div>
        </div>
      </div>

      <!-- Step 2: God Intervention & Card Selection -->
      <div v-if="currentStep === 2" class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-600 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-cyan-900 to-blue-900 border-b-2 border-cyan-600 p-4 sm:p-5 md:p-6">
          <div class="text-center mb-3 sm:mb-4">
            <div class="text-3xl sm:text-4xl md:text-5xl mb-1 sm:mb-2">✨</div>
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">신의 은총</h2>
            <p class="text-cyan-200 text-sm sm:text-base md:text-lg">당신은 신이었음을 기억하십니까?</p>
          </div>

          <div class="bg-black/30 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            <p class="text-center text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
              죽음의 순간, 당신의 신성이 깨어납니다.<br/>
              시간을 되돌릴 수는 없지만, 하나의 기억을 간직할 수 있습니다.<br/>
              <span class="text-cyan-400 font-bold">세 가지 운명 중 하나를 선택하세요.</span>
            </p>
          </div>

          <!-- Stats -->
          <div class="flex flex-wrap justify-around text-center gap-2 sm:gap-4">
            <div class="flex flex-col min-w-[80px]">
              <span class="text-[10px] sm:text-xs text-slate-400">환생 횟수</span>
              <span class="text-sm sm:text-base md:text-lg font-bold text-cyan-400">{{ reincarnationCount + 1 }}회</span>
            </div>
            <div class="flex flex-col min-w-[80px]">
              <span class="text-[10px] sm:text-xs text-slate-400">최고 기록</span>
              <span class="text-sm sm:text-base md:text-lg font-bold text-cyan-400">{{ highestDay }}일</span>
            </div>
            <div class="flex flex-col min-w-[80px]">
              <span class="text-[10px] sm:text-xs text-slate-400">총 플레이</span>
              <span class="text-sm sm:text-base md:text-lg font-bold text-cyan-400">{{ totalDaysPlayed }}일</span>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-240px)] sm:max-h-[calc(90vh-280px)] md:max-h-[calc(90vh-300px)]">
          <!-- Cards Grid -->
          <div v-if="availableCards.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div v-for="card in availableCards" :key="card.id"
                 @click="selectCard(card)"
                 class="relative bg-slate-700/50 border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
                 :class="{
                   'border-gray-500 hover:border-gray-400': card.rarity === 'common',
                   'border-blue-500 hover:border-blue-400': card.rarity === 'rare',
                   'border-purple-500 hover:border-purple-400': card.rarity === 'epic',
                   'border-orange-500 hover:border-orange-400': card.rarity === 'legendary'
                 }">

              <!-- Card Image -->
              <div class="relative h-24 sm:h-28 md:h-32 overflow-hidden">
                <img :src="card.image" :alt="card.name" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
              </div>

              <!-- Card Content -->
              <div class="p-2 sm:p-3">
                <div class="flex items-center justify-between mb-1 sm:mb-2">
                  <div class="text-lg sm:text-xl">{{ card.icon }}</div>
                  <span class="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold"
                        :class="{
                          'bg-gray-600': card.rarity === 'common',
                          'bg-blue-600': card.rarity === 'rare',
                          'bg-purple-600': card.rarity === 'epic',
                          'bg-orange-600': card.rarity === 'legendary'
                        }">
                    {{ getRarityLabel(card.rarity) }}
                  </span>
                </div>
                <h3 class="font-bold mb-1 text-sm sm:text-base">{{ card.name }}</h3>
                <p class="text-[10px] sm:text-xs text-slate-400 mb-1 sm:mb-2 line-clamp-2">{{ card.description }}</p>
                <div class="flex justify-center">
                  <span class="px-1.5 sm:px-2 py-0.5 bg-slate-800 rounded-full text-[10px] sm:text-xs">
                    {{ getTriggerLabel(card.trigger) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Skip Button -->
          <button @click="skipCard"
                  class="w-full bg-slate-700 hover:bg-slate-600 border border-slate-500 rounded-lg py-2.5 sm:py-3 font-bold text-sm sm:text-base transition-colors active:scale-95">
            기억을 버리고 환생
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PassiveCard } from '~/types/passive-cards'

interface Props {
  show: boolean
  availableCards: PassiveCard[]
  reincarnationCount: number
  highestDay: number
  totalDaysPlayed: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'select-card': [card: PassiveCard]
  'reincarnate-without-card': []
}>()

// Step management
const currentStep = ref(1)
const visibleLines = ref<string[]>([])
const showContinueButton = ref(false)

// Defeat scenario text
const defeatStory = [
  '성벽이 무너지고, 불길이 치솟습니다.',
  '백성들의 비명소리가 메아리칩니다.',
  '당신의 왕국은... 멸망했습니다.',
  '',
  '하지만 이것이 끝은 아닙니다.',
  '당신은 신이었던 존재.',
  '죽음조차 당신을 완전히 지울 수는 없습니다.'
]

// Watch for modal open
watch(() => props.show, (isOpen) => {
  if (isOpen) {
    // Reset to step 1
    currentStep.value = 1
    visibleLines.value = []
    showContinueButton.value = false

    // Start typing effect
    startTypingEffect()
  }
})

// Typing effect
const startTypingEffect = () => {
  let lineIndex = 0

  const showNextLine = () => {
    if (lineIndex < defeatStory.length) {
      visibleLines.value.push(defeatStory[lineIndex])
      lineIndex++
      setTimeout(showNextLine, 800) // 800ms between lines
    } else {
      // All lines shown, show continue button
      setTimeout(() => {
        showContinueButton.value = true
      }, 500)
    }
  }

  showNextLine()
}

// Move to next step
const nextStep = () => {
  currentStep.value = 2
}

// Select card
const selectCard = (card: PassiveCard) => {
  emit('select-card', card)
}

// Skip card
const skipCard = () => {
  emit('reincarnate-without-card')
}

const getRarityLabel = (rarity: string) => {
  const labels: Record<string, string> = {
    common: '일반',
    rare: '희귀',
    epic: '영웅',
    legendary: '전설'
  }
  return labels[rarity] || rarity
}

const getTriggerLabel = (trigger: string) => {
  const labels: Record<string, string> = {
    daily: '매일',
    battle_start: '전투 시작',
    battle_win: '전투 승리',
    battle_lose: '전투 패배',
    recruit: '병력 모집'
  }
  return labels[trigger] || trigger
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}
</style>
