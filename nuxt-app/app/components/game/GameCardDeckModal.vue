<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-2 md:p-4">
    <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl w-full max-w-6xl h-full md:h-auto max-h-[95vh] overflow-hidden border-2 border-yellow-500/30 shadow-2xl flex flex-col">
      <!-- Header -->
      <div class="flex-shrink-0 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 px-3 md:px-6 py-2 md:py-4 border-b border-yellow-500/30 flex items-center justify-between">
        <div class="flex items-center gap-2 md:gap-3">
          <span class="text-2xl md:text-3xl">🎴</span>
          <div>
            <h2 class="text-lg md:text-2xl font-bold text-yellow-400">카드 덱 설정</h2>
            <p class="text-xs md:text-sm text-gray-400">내정 카드 3장, 전투 카드 3장을 장착하세요</p>
          </div>
        </div>
        <button @click="$emit('update:modelValue', false)" class="text-gray-400 hover:text-white text-2xl md:text-3xl transition-colors">
          ✕
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 p-2 md:p-6 overflow-y-auto">
        <!-- Deck Slots -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 mb-4 md:mb-6">
          <!-- Domestic Cards Section -->
          <div class="bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-lg p-2 md:p-4 border border-blue-500/30">
            <div class="flex items-center gap-2 mb-2 md:mb-4">
              <span class="text-xl md:text-2xl">🏛️</span>
              <h3 class="text-base md:text-lg font-bold text-blue-400">내정 카드 (3/3)</h3>
            </div>
            <div class="grid grid-cols-3 gap-2 md:gap-3">
              <div
                v-for="(card, index) in cardDeck.domestic"
                :key="`domestic-${index}`"
                class="aspect-[2/3] rounded-lg border-2 transition-all cursor-pointer"
                :class="card ? 'border-blue-500 bg-gradient-to-br from-blue-900/40 to-blue-800/40 hover:border-blue-400' : 'border-dashed border-gray-600 bg-gray-800/30 hover:border-gray-500'"
                @click="handleSlotClick('domestic', index)"
              >
                <div v-if="card" class="p-1.5 md:p-2 h-full flex flex-col">
                  <!-- Rarity Badge -->
                  <div class="flex justify-between items-start mb-1">
                    <span class="text-xs px-1.5 py-0.5 rounded" :class="getRarityColor(card.rarity)">
                      {{ getRarityText(card.rarity) }}
                    </span>
                    <button
                      @click.stop="unequipCard('domestic', index)"
                      class="text-red-400 hover:text-red-300 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <!-- Icon -->
                  <div class="text-2xl md:text-3xl text-center mb-1">{{ card.icon }}</div>
                  <!-- Name -->
                  <div class="text-xs md:text-sm font-bold text-center text-white mb-1 line-clamp-2">{{ card.name }}</div>
                  <!-- Description -->
                  <div class="text-[10px] md:text-xs text-gray-300 text-center line-clamp-2 mt-auto">{{ card.description }}</div>
                </div>
                <div v-else class="h-full flex items-center justify-center text-gray-500">
                  <span class="text-3xl md:text-4xl">+</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Battle Cards Section -->
          <div class="bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-lg p-2 md:p-4 border border-red-500/30">
            <div class="flex items-center gap-2 mb-2 md:mb-4">
              <span class="text-xl md:text-2xl">⚔️</span>
              <h3 class="text-base md:text-lg font-bold text-red-400">전투 카드 (3/3)</h3>
            </div>
            <div class="grid grid-cols-3 gap-2 md:gap-3">
              <div
                v-for="(card, index) in cardDeck.battle"
                :key="`battle-${index}`"
                class="aspect-[2/3] rounded-lg border-2 transition-all cursor-pointer"
                :class="card ? 'border-red-500 bg-gradient-to-br from-red-900/40 to-red-800/40 hover:border-red-400' : 'border-dashed border-gray-600 bg-gray-800/30 hover:border-gray-500'"
                @click="handleSlotClick('battle', index)"
              >
                <div v-if="card" class="p-1.5 md:p-2 h-full flex flex-col">
                  <!-- Rarity Badge -->
                  <div class="flex justify-between items-start mb-1">
                    <span class="text-xs px-1.5 py-0.5 rounded" :class="getRarityColor(card.rarity)">
                      {{ getRarityText(card.rarity) }}
                    </span>
                    <button
                      @click.stop="unequipCard('battle', index)"
                      class="text-red-400 hover:text-red-300 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <!-- Icon -->
                  <div class="text-2xl md:text-3xl text-center mb-1">{{ card.icon }}</div>
                  <!-- Name -->
                  <div class="text-xs md:text-sm font-bold text-center text-white mb-1 line-clamp-2">{{ card.name }}</div>
                  <!-- Description -->
                  <div class="text-[10px] md:text-xs text-gray-300 text-center line-clamp-2 mt-auto">{{ card.description }}</div>
                </div>
                <div v-else class="h-full flex items-center justify-center text-gray-500">
                  <span class="text-3xl md:text-4xl">+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Available Cards Section -->
        <div v-if="selectedSlot" class="bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-lg p-2 md:p-4 border border-gray-600/30">
          <div class="flex items-center justify-between mb-2 md:mb-4">
            <div class="flex items-center gap-2">
              <span class="text-xl md:text-2xl">{{ selectedSlot.type === 'domestic' ? '🏛️' : '⚔️' }}</span>
              <h3 class="text-base md:text-lg font-bold text-yellow-400">
                {{ selectedSlot.type === 'domestic' ? '내정 카드 선택' : '전투 카드 선택' }}
              </h3>
            </div>
            <button
              @click="selectedSlot = null"
              class="text-sm text-gray-400 hover:text-white transition-colors"
            >
              취소
            </button>
          </div>

          <!-- Available Cards Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 max-h-[200px] md:max-h-[300px] overflow-y-auto">
            <div
              v-for="card in availableCards"
              :key="card.id"
              class="aspect-[2/3] rounded-lg border-2 transition-all cursor-pointer hover:scale-105"
              :class="{
                'border-blue-500 bg-gradient-to-br from-blue-900/40 to-blue-800/40 hover:border-blue-400': selectedSlot.type === 'domestic',
                'border-red-500 bg-gradient-to-br from-red-900/40 to-red-800/40 hover:border-red-400': selectedSlot.type === 'battle'
              }"
              @click="equipCardToSlot(card)"
            >
              <div class="p-1.5 md:p-2 h-full flex flex-col">
                <!-- Rarity Badge -->
                <div class="mb-1">
                  <span class="text-xs px-1.5 py-0.5 rounded" :class="getRarityColor(card.rarity)">
                    {{ getRarityText(card.rarity) }}
                  </span>
                </div>
                <!-- Icon -->
                <div class="text-2xl md:text-3xl text-center mb-1">{{ card.icon }}</div>
                <!-- Name -->
                <div class="text-xs md:text-sm font-bold text-center text-white mb-1 line-clamp-2">{{ card.name }}</div>
                <!-- Description -->
                <div class="text-[10px] md:text-xs text-gray-300 text-center line-clamp-2 mt-auto">{{ card.description }}</div>
              </div>
            </div>
          </div>

          <div v-if="availableCards.length === 0" class="text-center py-8 text-gray-400">
            <span class="text-4xl">📭</span>
            <p class="mt-2">장착 가능한 카드가 없습니다</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex-shrink-0 bg-gradient-to-r from-gray-900 to-gray-800 px-3 md:px-6 py-2 md:py-4 border-t border-gray-700 flex justify-between items-center">
        <div class="flex flex-col gap-1">
          <div class="text-xs md:text-sm text-gray-400">
            장착된 카드: {{ equippedCards.length }}/6
          </div>
          <div class="text-[10px] md:text-xs" :class="(availableDomesticCards.length + availableBattleCards.length + equippedCards.length) >= 15 ? 'text-orange-400' : 'text-gray-500'">
            총 보유: {{ availableDomesticCards.length + availableBattleCards.length + equippedCards.length }}/15장
          </div>
        </div>
        <button
          @click="$emit('update:modelValue', false)"
          class="px-4 md:px-6 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg font-bold hover:from-yellow-500 hover:to-orange-500 transition-all text-sm md:text-base"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PassiveCard, CardDeck } from '~/types/passive-cards'

interface Props {
  modelValue: boolean
  cardDeck: CardDeck
  availableDomesticCards: PassiveCard[]
  availableBattleCards: PassiveCard[]
  equippedCards: PassiveCard[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'equip-card': [card: PassiveCard, slotType: 'domestic' | 'battle', slotIndex: number]
  'unequip-card': [slotType: 'domestic' | 'battle', slotIndex: number]
}>()

const selectedSlot = ref<{ type: 'domestic' | 'battle', index: number } | null>(null)

const availableCards = computed(() => {
  if (!selectedSlot.value) return []
  return selectedSlot.value.type === 'domestic'
    ? props.availableDomesticCards
    : props.availableBattleCards
})

const handleSlotClick = (type: 'domestic' | 'battle', index: number) => {
  const card = props.cardDeck[type][index]
  if (!card) {
    selectedSlot.value = { type, index }
  }
}

const equipCardToSlot = (card: PassiveCard) => {
  if (!selectedSlot.value) return
  emit('equip-card', card, selectedSlot.value.type, selectedSlot.value.index)
  selectedSlot.value = null
}

const unequipCard = (type: 'domestic' | 'battle', index: number) => {
  emit('unequip-card', type, index)
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'bg-orange-500 text-white'
    case 'epic': return 'bg-purple-500 text-white'
    case 'rare': return 'bg-blue-500 text-white'
    case 'common': return 'bg-gray-500 text-white'
    default: return 'bg-gray-500 text-white'
  }
}

const getRarityText = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return '전설'
    case 'epic': return '영웅'
    case 'rare': return '희귀'
    case 'common': return '일반'
    default: return rarity
  }
}
</script>
