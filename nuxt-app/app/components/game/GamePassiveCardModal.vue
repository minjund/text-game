<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="() => {}">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-600 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-900 to-purple-800 border-b-2 border-purple-600 p-4 text-center">
          <h2 class="text-2xl font-bold mb-1 flex items-center justify-center gap-2">
            <span>🎴</span> 축복의 카드
          </h2>
          <p class="text-purple-200">25일이 지났습니다! 3장 중 1장의 패시브 카드를 선택하세요.</p>
        </div>

        <!-- Cards Grid -->
        <div class="p-6 grid md:grid-cols-3 gap-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div v-for="card in cards" :key="card.id"
               @click="$emit('select-card', card)"
               class="relative bg-slate-700/50 border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-2xl"
               :class="{
                 'border-gray-500 hover:border-gray-400': card.rarity === 'common',
                 'border-blue-500 hover:border-blue-400': card.rarity === 'rare',
                 'border-purple-500 hover:border-purple-400': card.rarity === 'epic',
                 'border-orange-500 hover:border-orange-400': card.rarity === 'legendary'
               }">

            <!-- Card Image -->
            <div class="relative h-40 overflow-hidden">
              <img :src="card.image" :alt="card.name" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            </div>

            <!-- Card Content -->
            <div class="p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="text-2xl">{{ card.icon }}</div>
                <span class="px-2 py-1 rounded text-xs font-bold"
                      :class="{
                        'bg-gray-600': card.rarity === 'common',
                        'bg-blue-600': card.rarity === 'rare',
                        'bg-purple-600': card.rarity === 'epic',
                        'bg-orange-600': card.rarity === 'legendary'
                      }">
                  {{ getRarityLabel(card.rarity) }}
                </span>
              </div>
              <h3 class="text-lg font-bold mb-2">{{ card.name }}</h3>
              <p class="text-sm text-slate-400 mb-3">{{ card.description }}</p>
              <div class="flex justify-center">
                <span class="px-3 py-1 bg-slate-800 rounded-full text-xs">
                  {{ getTriggerLabel(card.trigger) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { PassiveCard } from '~/types/passive-cards'

interface Props {
  show: boolean
  cards: PassiveCard[]
}

defineProps<Props>()

defineEmits<{
  'select-card': [card: PassiveCard]
}>()

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
