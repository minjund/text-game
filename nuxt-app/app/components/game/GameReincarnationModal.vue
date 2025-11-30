<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-2 sm:p-4" @click.self="() => {}">
      <!-- Step 1: Defeat Scenario -->
      <div v-if="currentStep === 1" class="w-full max-w-md">
        <div class="bg-gradient-to-br from-red-950/80 to-black/80 border-2 border-red-600 rounded-lg p-3 sm:p-4 md:p-6 backdrop-blur-sm">
          <div class="text-center mb-4 sm:mb-6">
            <div class="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 animate-pulse">💀</div>
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-red-400 mb-1 sm:mb-2">왕국의 멸망</h2>
          </div>

          <div class="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6">
            <p v-for="(line, index) in visibleLines" :key="index"
               class="text-gray-200"
               :class="{ 'opacity-0 animate-fade-in': index === visibleLines.length - 1 }">
              {{ line }}
            </p>
          </div>

          <div v-if="showContinueButton" class="text-center">
            <button @click="nextStep"
                    class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg px-6 py-2 sm:px-8 sm:py-2.5 md:px-10 md:py-3 font-bold text-sm sm:text-base md:text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg w-full sm:w-auto">
              계속...
            </button>
          </div>
        </div>
      </div>

      <!-- Step 2: God Intervention & Card Selection -->
      <div v-if="currentStep === 2" class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-600 rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-cyan-900 to-blue-900 border-b-2 border-cyan-600 p-3 sm:p-4 md:p-5">
          <div class="text-center mb-2 sm:mb-3">
            <div class="text-2xl sm:text-3xl md:text-4xl mb-1">✨</div>
            <h2 class="text-lg sm:text-xl md:text-2xl font-bold mb-1">신의 은총</h2>
            <p class="text-cyan-200 text-xs sm:text-sm md:text-base">당신은 신이었음을 기억하십니까?</p>
          </div>

          <div class="bg-black/30 rounded-lg p-2 sm:p-3 mb-2 sm:mb-3">
            <p class="text-center text-gray-300 text-[10px] sm:text-xs md:text-sm leading-relaxed">
              죽음의 순간, 당신의 신성이 깨어납니다.<br class="hidden sm:block"/>
              시간을 되돌릴 수는 없지만, 하나의 기억을 간직할 수 있습니다.<br class="hidden sm:block"/>
              <span class="text-cyan-400 font-bold block mt-1">카드 1장을 선택하여 다음 생으로 가져갈 수 있습니다.</span>
            </p>
            <div class="text-center mt-1 sm:mt-2">
              <span class="text-yellow-400 font-bold text-xs sm:text-sm">
                선택한 카드: {{ selectedCards.length }} / {{ maxSelection }}장
              </span>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div class="flex flex-col">
              <span class="text-[9px] sm:text-[10px] text-slate-400">환생 횟수</span>
              <span class="text-xs sm:text-sm md:text-base font-bold text-cyan-400">{{ reincarnationCount + 1 }}회</span>
            </div>
            <div class="flex flex-col">
              <span class="text-[9px] sm:text-[10px] text-slate-400">상속 카드</span>
              <span class="text-xs sm:text-sm md:text-base font-bold" :class="(inheritedCardsCount || 0) >= 6 ? 'text-orange-400' : 'text-cyan-400'">
                {{ inheritedCardsCount || 0 }}/6장
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-[9px] sm:text-[10px] text-slate-400">최고 기록</span>
              <span class="text-xs sm:text-sm md:text-base font-bold text-cyan-400">{{ highestDay }}일</span>
            </div>
            <div class="flex flex-col">
              <span class="text-[9px] sm:text-[10px] text-slate-400">총 플레이</span>
              <span class="text-xs sm:text-sm md:text-base font-bold text-cyan-400">{{ totalDaysPlayed }}일</span>
            </div>
          </div>
        </div>

        <!-- Content: Cards (Scrollable) -->
        <div class="p-3 sm:p-4 md:p-5 overflow-y-auto max-h-[calc(90vh-340px)] sm:max-h-[calc(90vh-360px)]">
          <!-- Cards Grid -->
          <div v-if="availableCards.length > 0" class="grid grid-cols-1 gap-3 sm:gap-4">
            <div v-for="card in availableCards" :key="card.id"
                 @click="toggleCard(card)"
                 class="relative bg-slate-700/50 border-2 rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01] hover:shadow-2xl active:scale-[0.99]"
                 :class="{
                   'border-yellow-400 ring-4 ring-yellow-400/50 scale-[1.01]': isCardSelected(card),
                   'border-gray-500 hover:border-gray-400': !isCardSelected(card) && card.rarity === 'common',
                   'border-blue-500 hover:border-blue-400': !isCardSelected(card) && card.rarity === 'rare',
                   'border-purple-500 hover:border-purple-400': !isCardSelected(card) && card.rarity === 'epic',
                   'border-orange-500 hover:border-orange-400': !isCardSelected(card) && card.rarity === 'legendary'
                 }">

              <!-- 선택 표시 -->
              <div v-if="isCardSelected(card)"
                   class="absolute top-2 right-2 w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-lg sm:text-xl shadow-lg z-10">
                ✓
              </div>

              <!-- Card Layout: Horizontal on mobile -->
              <div class="flex items-center gap-3 p-3 sm:p-4">
                <!-- Card Image -->
                <div class="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
                  <img :src="card.image" :alt="card.name" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div class="absolute bottom-1 left-1 text-2xl sm:text-3xl">{{ card.icon }}</div>
                </div>

                <!-- Card Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <h3 class="font-bold text-sm sm:text-base leading-tight">{{ card.name }}</h3>
                    <span class="px-2 py-1 rounded text-xs font-bold whitespace-nowrap flex-shrink-0"
                          :class="{
                            'bg-gray-600': card.rarity === 'common',
                            'bg-blue-600': card.rarity === 'rare',
                            'bg-purple-600': card.rarity === 'epic',
                            'bg-orange-600': card.rarity === 'legendary'
                          }">
                      {{ getRarityLabel(card.rarity) }}
                    </span>
                  </div>
                  <p class="text-xs sm:text-sm text-slate-300 mb-2 line-clamp-2">{{ card.description }}</p>
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-1 bg-slate-800/80 rounded-full text-xs text-cyan-300">
                      {{ getTriggerLabel(card.trigger) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 카드가 없을 때 메시지 -->
          <div v-if="availableCards.length === 0" class="text-center py-8 sm:py-12">
            <div class="text-5xl sm:text-6xl mb-4">📭</div>
            <p class="text-slate-300 text-base sm:text-lg font-bold mb-2">보유한 카드가 없습니다</p>
            <p class="text-slate-400 text-sm sm:text-base mb-4">모험을 통해 카드를 획득하세요</p>
            <div class="bg-cyan-900/30 border border-cyan-600 rounded-lg p-4 max-w-sm mx-auto">
              <p class="text-xs sm:text-sm text-cyan-200">
                💡 환생 보너스는 계속 적용됩니다
              </p>
            </div>
          </div>
        </div>

        <!-- Buttons (Fixed at bottom) -->
        <div class="p-3 sm:p-4 md:p-5 pt-0 space-y-2 sm:space-y-3">
          <!-- 선택 확인 버튼 -->
          <button
            @click="confirmSelection"
            :disabled="selectedCards.length === 0"
            :class="[
              'w-full rounded-lg py-3 sm:py-3.5 font-bold text-sm sm:text-base transition-all',
              selectedCards.length > 0
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 shadow-lg'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
            ]">
            선택한 카드로 환생
          </button>

          <!-- Skip Button -->
          <button @click="skipCard"
                  class="w-full bg-slate-700 hover:bg-slate-600 border border-slate-500 rounded-lg py-2 sm:py-2.5 font-bold text-xs sm:text-sm transition-colors active:scale-95">
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
  inheritedCardsCount?: number
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

// 선택된 카드들 (최대 1장)
const selectedCards = ref<PassiveCard[]>([])
const maxSelection = 1

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
    selectedCards.value = []

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

// Toggle card selection
const toggleCard = (card: PassiveCard) => {
  const index = selectedCards.value.findIndex(c => c.id === card.id)

  if (index !== -1) {
    // 이미 선택된 카드 - 선택 해제
    selectedCards.value.splice(index, 1)
  } else if (selectedCards.value.length < maxSelection) {
    // 선택되지 않은 카드 - 선택 추가 (최대 1장)
    selectedCards.value.push(card)
  } else {
    // 이미 1장 선택된 경우 - 교체
    selectedCards.value = [card]
  }
}

// 카드가 선택되어 있는지 확인
const isCardSelected = (card: PassiveCard) => {
  return selectedCards.value.some(c => c.id === card.id)
}

// 선택 확인 (직접 선택한 1장)
const confirmSelection = () => {
  if (selectedCards.value.length === 0) return

  // 선택한 카드 전달
  emit('select-card', selectedCards.value[0])
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
