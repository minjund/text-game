<template>
  <Transition name="modal">
    <div v-if="event" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click="$emit('close')">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-600 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden" @click.stop>
        <!-- Header -->
        <div class="bg-gradient-to-r from-amber-900 to-amber-800 border-b-2 border-amber-600 p-4">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <span>🎴</span> {{ event.title }}
          </h2>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <p class="text-slate-300 mb-6">{{ event.description }}</p>

          <!-- Choices -->
          <div class="space-y-3">
            <button v-for="(choice, index) in event.choices" :key="index"
                    @click="$emit('select-choice', choice)" :disabled="!canAffordChoice(choice)"
                    class="w-full bg-slate-700/50 hover:bg-slate-600/50 disabled:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-slate-600 hover:border-amber-500 disabled:border-slate-700 rounded-lg p-4 text-left transition-all">

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

                <!-- General -->
                <div v-if="choice.general" class="bg-slate-800/50 p-2 rounded">
                  <strong class="text-purple-400">⚔️ 장수:</strong>
                  <span class="ml-2">{{ choice.general.name }} ({{ choice.general.title }})</span>
                  <span class="ml-2 px-2 py-0.5 rounded text-xs"
                        :class="{
                          'bg-gray-600': choice.general.rarity === 'common',
                          'bg-blue-600': choice.general.rarity === 'rare',
                          'bg-purple-600': choice.general.rarity === 'epic'
                        }">
                    {{ getRarityLabel(choice.general.rarity) }}
                  </span>
                  <div class="mt-1 text-xs text-slate-400">
                    무력 {{ choice.general.stats.power }} | 지력 {{ choice.general.stats.intelligence }} | 통솔 {{ choice.general.stats.leadership }}
                  </div>
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

defineEmits<{
  close: []
  'select-choice': [choice: EventChoice]
}>()

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
