<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-600 rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-900 to-purple-800 border-b-2 border-purple-600 p-4 flex items-center justify-between flex-shrink-0">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <span>✨</span> 액티브 카드 컬렉션
          </h2>
          <button @click="close" class="text-2xl hover:text-purple-400 transition-colors px-3 py-2 -mr-2">
            ✕
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Battle Deck Section -->
          <div class="mb-6">
            <h3 class="text-lg font-bold mb-3 text-amber-400">🎴 전투 덱 ({{ battleActiveCards.length }}/{{ maxBattleCards }})</h3>
            <div v-if="battleActiveCards.length === 0" class="text-center py-8 text-slate-400">
              전투에 가져갈 카드를 선택하세요 (최대 {{ maxBattleCards }}장)
            </div>
            <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div v-for="card in battleActiveCards" :key="card.id"
                   :class="[
                     'relative bg-gradient-to-br rounded-lg p-4 border-2 cursor-pointer hover:scale-105 transition-transform',
                     getRarityColor(card.rarity)
                   ]"
                   @click="removeFromDeck(card)">
                <div class="absolute top-2 right-2 bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  ✕
                </div>
                <div class="text-4xl mb-2 text-center">{{ card.icon }}</div>
                <div class="text-sm font-bold mb-1 text-center">{{ card.name }}</div>
                <div class="text-xs text-center text-slate-300 mb-2">{{ card.battleDescription }}</div>
                <div class="text-xs text-center opacity-75">{{ getRarityText(card.rarity) }}</div>
              </div>
            </div>
          </div>

          <!-- Owned Cards Section -->
          <div>
            <h3 class="text-lg font-bold mb-3 text-blue-400">📚 보유 카드 ({{ ownedActiveCards.length }}장)</h3>
            <div v-if="ownedActiveCards.length === 0" class="text-center py-8 text-slate-400">
              아직 보유한 액티브 카드가 없습니다
            </div>
            <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div v-for="card in ownedActiveCards" :key="card.id"
                   :class="[
                     'relative bg-gradient-to-br rounded-lg p-4 border-2 transition-all',
                     isInBattleDeck(card.id)
                       ? 'opacity-50 cursor-not-allowed'
                       : 'cursor-pointer hover:scale-105',
                     getRarityColor(card.rarity)
                   ]"
                   @click="addToDeck(card)">
                <div v-if="isInBattleDeck(card.id)" class="absolute top-2 right-2 bg-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div class="text-4xl mb-2 text-center">{{ card.icon }}</div>
                <div class="text-sm font-bold mb-1 text-center">{{ card.name }}</div>
                <div class="text-xs text-center text-slate-300 mb-2 line-clamp-2">{{ card.battleDescription }}</div>
                <div class="text-xs text-center opacity-75">{{ getRarityText(card.rarity) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t-2 border-slate-600 p-4 flex gap-3 flex-shrink-0">
          <button @click="close"
                  class="flex-1 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 border-2 border-slate-500 rounded-lg py-3 font-bold transition-colors">
            닫기
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { ActiveCard } from '~/types/active-cards'

interface Props {
  show: boolean
  ownedActiveCards: ActiveCard[]
  battleActiveCards: ActiveCard[]
  maxBattleCards: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  addToDeck: [card: ActiveCard]
  removeFromDeck: [card: ActiveCard]
}>()

const close = () => {
  emit('close')
}

const addToDeck = (card: ActiveCard) => {
  if (!isInBattleDeck(card.id)) {
    emit('addToDeck', card)
  }
}

const removeFromDeck = (card: ActiveCard) => {
  emit('removeFromDeck', card)
}

const isInBattleDeck = (cardId: string) => {
  return props.battleActiveCards.some(c => c.id === cardId)
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'from-gray-700 to-gray-800 border-gray-500'
    case 'rare':
      return 'from-blue-700 to-blue-800 border-blue-500'
    case 'epic':
      return 'from-purple-700 to-purple-800 border-purple-500'
    case 'legendary':
      return 'from-amber-700 to-amber-800 border-amber-500'
    default:
      return 'from-gray-700 to-gray-800 border-gray-500'
  }
}

const getRarityText = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return '일반'
    case 'rare':
      return '희귀'
    case 'epic':
      return '영웅'
    case 'legendary':
      return '전설'
    default:
      return '일반'
  }
}
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
