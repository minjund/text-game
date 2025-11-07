<template>
  <div class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
    <div class="max-w-6xl w-full">
      <!-- Title -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
          왕으로서 첫 번째 선택
        </h1>
        <p class="text-xl text-slate-300">
          왕국의 기반이 될 3개의 카드를 선택하세요
        </p>
        <div class="text-slate-400 mt-2">
          ({{ selectedCards.length }} / 3 선택)
        </div>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          v-for="card in availableCards"
          :key="card.id"
          @click="toggleCard(card)"
          class="cursor-pointer transition-all transform hover:scale-105"
          :class="{
            'opacity-50': selectedCards.length >= 3 && !isSelected(card.id),
            'ring-4 ring-yellow-500': isSelected(card.id)
          }"
        >
          <div class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 rounded-xl p-6 h-full"
               :class="isSelected(card.id) ? 'border-yellow-500' : 'border-slate-700 hover:border-slate-600'">
            <!-- Card Header -->
            <div class="flex items-center justify-between mb-4">
              <div
                class="px-3 py-1 rounded-full text-sm font-bold"
                :class="{
                  'bg-green-900 text-green-300 border border-green-700': card.rarity === 'common',
                  'bg-blue-900 text-blue-300 border border-blue-700': card.rarity === 'rare',
                  'bg-purple-900 text-purple-300 border border-purple-700': card.rarity === 'epic',
                  'bg-orange-900 text-orange-300 border border-orange-700': card.rarity === 'legendary'
                }"
              >
                {{ getRarityLabel(card.rarity) }}
              </div>
              <div v-if="isSelected(card.id)" class="text-2xl">✓</div>
            </div>

            <!-- Card Title -->
            <h3 class="text-xl font-bold text-white mb-2">{{ card.name }}</h3>

            <!-- Card Description -->
            <p class="text-slate-300 text-sm mb-4">{{ card.description }}</p>

            <!-- Card Effects -->
            <div class="space-y-2">
              <div
                v-for="(effect, index) in card.effects"
                :key="index"
                class="bg-slate-700/50 rounded px-3 py-2 text-sm text-slate-200"
              >
                <span class="text-green-400 font-bold">✦</span> {{ effect.description }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirm Button -->
      <div class="flex justify-center">
        <button
          @click="confirmSelection"
          :disabled="selectedCards.length !== 3"
          class="px-12 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed text-white font-bold text-xl rounded-xl transition-all transform hover:scale-105 disabled:scale-100"
        >
          선택 완료
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PassiveCard } from '~/types/game'

interface Props {
  cards: PassiveCard[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  confirm: [cards: PassiveCard[]]
}>()

const selectedCards = ref<PassiveCard[]>([])

const availableCards = computed(() => props.cards)

const isSelected = (cardId: string) => {
  return selectedCards.value.some(c => c.id === cardId)
}

const toggleCard = (card: PassiveCard) => {
  if (isSelected(card.id)) {
    // Deselect
    selectedCards.value = selectedCards.value.filter(c => c.id !== card.id)
  } else if (selectedCards.value.length < 3) {
    // Select
    selectedCards.value.push(card)
  }
}

const confirmSelection = () => {
  if (selectedCards.value.length === 3) {
    emit('confirm', selectedCards.value)
  }
}

const getRarityLabel = (rarity: string): string => {
  const labels: Record<string, string> = {
    common: '일반',
    rare: '희귀',
    epic: '영웅',
    legendary: '전설'
  }
  return labels[rarity] || rarity
}
</script>
