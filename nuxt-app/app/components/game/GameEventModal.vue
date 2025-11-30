<template>
  <Transition name="modal">
    <div v-if="event" class="fixed inset-0 bg-black/90 z-[10000] flex justify-center">
      <div class="w-full max-w-md h-full flex flex-col bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-600 rounded-lg max-h-screen m-auto overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-amber-900 to-amber-800 border-b-2 border-amber-600 p-3 sm:p-4 flex-shrink-0">
          <h2 class="text-lg sm:text-xl font-bold flex items-center gap-2">
            <span>🎴</span> {{ event.title }}
          </h2>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-3 sm:p-6">
          <p class="text-slate-300 text-sm sm:text-base mb-4 sm:mb-6">{{ event.description }}</p>

          <!-- Choices -->
          <div class="space-y-3 sm:space-y-4">
            <button v-for="(choice, index) in event.choices" :key="index"
                    @click.stop="handleSelectChoice(choice)" :disabled="!canAffordChoice(choice)"
                    class="w-full bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-500/50 disabled:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-slate-600 hover:border-amber-500 disabled:border-slate-700 rounded-lg p-4 sm:p-5 text-left transition-all touch-manipulation text-base sm:text-lg">

              <div class="font-semibold mb-2">{{ choice.text }}</div>

              <div class="space-y-2 text-sm">
                <!-- Cost -->
                <div v-if="choice.cost && Object.keys(choice.cost).length > 0" class="flex flex-wrap gap-2">
                  <strong class="text-red-400">비용:</strong>
                  <span v-if="choice.cost.food" class="text-green-300">🌾 {{ choice.cost.food }}</span>
                  <span v-if="choice.cost.gold" class="text-yellow-300">💰 {{ choice.cost.gold }}</span>
                  <span v-if="choice.cost.soldiers" class="text-red-300">⚔️ {{ choice.cost.soldiers }}</span>
                </div>

                <!-- Reward -->
                <div v-if="choice.reward && Object.keys(choice.reward).length > 0" class="flex flex-wrap gap-2">
                  <strong class="text-green-400">보상:</strong>
                  <span v-if="choice.reward.food" class="text-green-300">🌾 +{{ choice.reward.food }}</span>
                  <span v-if="choice.reward.gold" class="text-yellow-300">💰 +{{ choice.reward.gold }}</span>
                  <span v-if="choice.reward.soldiers" class="text-red-300">⚔️ +{{ choice.reward.soldiers }}</span>
                  <span v-if="choice.reward.morale" class="text-pink-300">❤️ {{ choice.reward.morale > 0 ? '+' : '' }}{{ choice.reward.morale }}</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { EventCard, EventChoice } from '~/types/game'

interface Props {
  event: EventCard | null
  currentResources: {
    food: number
    gold: number
    soldiers: number
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  'select-choice': [choice: EventChoice]
}>()

const handleSelectChoice = (choice: EventChoice) => {
  if (canAffordChoice(choice)) {
    emit('select-choice', choice)
  }
}

const canAffordChoice = (choice: EventChoice): boolean => {
  if (!choice.cost) return true
  if (!props.currentResources) return true

  if (choice.cost.food && props.currentResources.food < choice.cost.food) return false
  if (choice.cost.gold && props.currentResources.gold < choice.cost.gold) return false
  if (choice.cost.soldiers && props.currentResources.soldiers < choice.cost.soldiers) return false

  return true
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
</script>
