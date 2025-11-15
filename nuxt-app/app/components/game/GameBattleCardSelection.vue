<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center p-2 md:p-4">
      <div class="max-w-5xl w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-2xl border-2 border-purple-600 shadow-2xl max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-900 to-purple-800 border-b-2 border-purple-600 p-2 md:p-4">
          <h2 class="text-lg md:text-2xl font-bold text-center">⚔️ 전투 준비</h2>
        </div>

        <!-- Enemy Info -->
        <div class="bg-slate-800/50 border-b border-slate-700 p-2 md:p-4">
          <h3 class="text-sm md:text-lg font-bold mb-2 md:mb-3 text-amber-400">🎯 적 정보</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            <div class="bg-slate-900/50 rounded-lg p-2 md:p-3 border border-slate-700">
              <div class="text-[10px] md:text-xs text-slate-400 mb-0.5 md:mb-1">적군 이름</div>
              <div class="text-xs md:text-base font-bold text-red-400 truncate" :title="enemyName">{{ enemyName }}</div>
            </div>
            <div class="bg-slate-900/50 rounded-lg p-2 md:p-3 border border-slate-700">
              <div class="text-[10px] md:text-xs text-slate-400 mb-0.5 md:mb-1">병력</div>
              <div class="text-xs md:text-base font-bold text-orange-400">{{ enemyPower }}</div>
            </div>
            <div class="bg-slate-900/50 rounded-lg p-2 md:p-3 border border-slate-700">
              <div class="text-[10px] md:text-xs text-slate-400 mb-0.5 md:mb-1">예상 난이도</div>
              <div class="text-xs md:text-base font-bold" :class="difficultyColor">{{ difficulty }}</div>
            </div>
            <div class="bg-slate-900/50 rounded-lg p-2 md:p-3 border border-slate-700">
              <div class="text-[10px] md:text-xs text-slate-400 mb-0.5 md:mb-1">내 병력</div>
              <div class="text-xs md:text-base font-bold text-blue-400">{{ playerPower }}</div>
            </div>
          </div>
        </div>

        <!-- Battle Cards Selection -->
        <div class="flex-1 overflow-y-auto p-2 md:p-4">
          <div class="mb-2 md:mb-3 flex items-center justify-between">
            <h3 class="text-sm md:text-lg font-bold text-cyan-400">🎴 액티브 카드 선택 (최대 3장)</h3>
            <div class="text-xs md:text-sm text-slate-400">
              선택: <span class="text-cyan-400 font-bold">{{ selectedCards.length }}</span> / 3
            </div>
          </div>

          <!-- No Battle Cards -->
          <div v-if="battleCards.length === 0" class="text-center py-8 md:py-12 text-slate-400">
            <div class="text-4xl md:text-6xl mb-2 md:mb-4">🚫</div>
            <div class="text-sm md:text-lg">보유한 액티브 카드가 없습니다</div>
            <div class="text-xs md:text-sm mt-1 md:mt-2">액티브 카드 없이 진행됩니다</div>
          </div>

          <!-- Battle Cards Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
            <div
              v-for="card in battleCards"
              :key="card.id"
              @click="toggleCard(card)"
              :class="[
                'relative bg-gradient-to-br rounded-lg md:rounded-xl border-2 p-3 md:p-4 cursor-pointer transition-all',
                isSelected(card)
                  ? 'from-purple-900 to-purple-800 border-purple-400 shadow-lg shadow-purple-500/50 scale-105'
                  : 'from-slate-700 to-slate-800 border-slate-600 hover:border-slate-500 hover:scale-102',
                card.rarity === 'legendary' ? 'ring-2 ring-yellow-500' :
                card.rarity === 'epic' ? 'ring-2 ring-purple-500' :
                card.rarity === 'rare' ? 'ring-2 ring-blue-500' : ''
              ]"
            >
              <!-- Selected Badge -->
              <div
                v-if="isSelected(card)"
                class="absolute -top-1.5 md:-top-2 -right-1.5 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm md:text-base font-bold shadow-lg"
              >
                ✓
              </div>

              <!-- Card Icon -->
              <div class="text-3xl md:text-4xl mb-1 md:mb-2 text-center">{{ card.icon }}</div>

              <!-- Card Name -->
              <div class="text-sm md:text-base text-center font-bold mb-1 md:mb-2" :class="{
                'text-yellow-400': card.rarity === 'legendary',
                'text-purple-400': card.rarity === 'epic',
                'text-blue-400': card.rarity === 'rare',
                'text-slate-300': card.rarity === 'common'
              }">
                {{ card.name }}
              </div>

              <!-- Card Description -->
              <div class="text-[10px] md:text-xs text-slate-400 text-center mb-1 md:mb-2">
                {{ card.description }}
              </div>

              <!-- Battle Description -->
              <div class="text-[10px] md:text-xs text-cyan-300 text-center font-semibold mb-1 md:mb-2 px-2 py-1 bg-cyan-900/30 rounded">
                {{ card.battleDescription }}
              </div>

              <!-- Card Rarity Badge -->
              <div class="flex justify-center">
                <span :class="[
                  'px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-bold',
                  card.rarity === 'legendary' ? 'bg-yellow-900/50 text-yellow-300' :
                  card.rarity === 'epic' ? 'bg-purple-900/50 text-purple-300' :
                  card.rarity === 'rare' ? 'bg-blue-900/50 text-blue-300' :
                  'bg-slate-700 text-slate-300'
                ]">
                  {{ card.rarity === 'legendary' ? '전설' :
                     card.rarity === 'epic' ? '영웅' :
                     card.rarity === 'rare' ? '희귀' : '일반' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t-2 border-slate-700 p-2 md:p-4 bg-slate-900">
          <div class="flex gap-2 md:gap-3">
            <button
              @click="$emit('cancel')"
              class="flex-1 px-3 md:px-6 py-2 md:py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm md:text-base font-bold transition-colors"
            >
              취소
            </button>
            <button
              @click="confirmSelection"
              class="flex-1 px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-lg text-sm md:text-base font-bold transition-colors shadow-lg"
            >
              {{ battleCards.length === 0 ? '전투 시작' : selectedCards.length > 0 ? `선택 완료 (${selectedCards.length}장)` : '카드 없이 시작' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PassiveCard } from '~/types/passive-cards'

interface Props {
  show: boolean
  enemyName: string
  enemyPower: number
  playerPower: number
  availableCards: any[] // 액티브 카드
}

const props = defineProps<Props>()

const emit = defineEmits<{
  confirm: [cards: any[]]
  cancel: []
}>()

const selectedCards = ref<any[]>([])

// 모든 액티브 카드 표시
const battleCards = computed(() => {
  return props.availableCards
})

// 난이도 계산
const difficulty = computed(() => {
  const ratio = props.enemyPower / (props.playerPower || 1)
  if (ratio > 1.5) return '매우 어려움'
  if (ratio > 1.2) return '어려움'
  if (ratio > 0.8) return '보통'
  if (ratio > 0.5) return '쉬움'
  return '매우 쉬움'
})

const difficultyColor = computed(() => {
  const ratio = props.enemyPower / (props.playerPower || 1)
  if (ratio > 1.5) return 'text-red-500'
  if (ratio > 1.2) return 'text-orange-500'
  if (ratio > 0.8) return 'text-yellow-500'
  if (ratio > 0.5) return 'text-green-500'
  return 'text-blue-500'
})

// 카드 선택/해제
const toggleCard = (card: PassiveCard) => {
  const index = selectedCards.value.findIndex(c => c.id === card.id)
  if (index !== -1) {
    selectedCards.value.splice(index, 1)
  } else if (selectedCards.value.length < 3) {
    selectedCards.value.push(card)
  }
}

const isSelected = (card: PassiveCard) => {
  return selectedCards.value.some(c => c.id === card.id)
}

const confirmSelection = () => {
  emit('confirm', selectedCards.value)
  selectedCards.value = []
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
