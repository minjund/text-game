<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="() => {}">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-600 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-cyan-900 to-cyan-800 border-b-2 border-cyan-600 p-4">
          <h2 class="text-2xl font-bold mb-1 flex items-center justify-center gap-2">
            <span>💫</span> 환생의 시간
          </h2>
          <p class="text-center text-cyan-200">100일을 견뎌냈습니다! 환생하여 더 강해질 시간입니다.</p>

          <!-- Stats -->
          <div class="flex justify-around mt-4 text-center">
            <div class="flex flex-col">
              <span class="text-xs text-slate-400">환생 횟수</span>
              <span class="text-lg font-bold">{{ reincarnationCount + 1 }}회</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-slate-400">최고 기록</span>
              <span class="text-lg font-bold">{{ highestDay }}일</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-slate-400">총 플레이</span>
              <span class="text-lg font-bold">{{ totalDaysPlayed }}일</span>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <!-- With Cards -->
          <div v-if="availableCards.length > 0">
            <h3 class="text-xl font-bold mb-2 flex items-center gap-2">
              <span>🎴</span> 상속할 카드를 선택하세요
            </h3>
            <p class="text-sm text-slate-400 mb-4">선택한 카드는 다음 게임 시작 시 자동으로 적용됩니다.</p>

            <!-- Cards Grid -->
            <div class="grid md:grid-cols-3 gap-4 mb-4">
              <div v-for="card in availableCards" :key="card.id"
                   @click="$emit('select-card', card)"
                   class="relative bg-slate-700/50 border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105"
                   :class="{
                     'border-gray-500 hover:border-gray-400': card.rarity === 'common',
                     'border-blue-500 hover:border-blue-400': card.rarity === 'rare',
                     'border-purple-500 hover:border-purple-400': card.rarity === 'epic',
                     'border-orange-500 hover:border-orange-400': card.rarity === 'legendary'
                   }">

                <!-- Card Image -->
                <div class="relative h-32 overflow-hidden">
                  <img :src="card.image" :alt="card.name" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                </div>

                <!-- Card Content -->
                <div class="p-3">
                  <div class="flex items-center justify-between mb-2">
                    <div class="text-xl">{{ card.icon }}</div>
                    <span class="px-2 py-0.5 rounded text-xs font-bold"
                          :class="{
                            'bg-gray-600': card.rarity === 'common',
                            'bg-blue-600': card.rarity === 'rare',
                            'bg-purple-600': card.rarity === 'epic',
                            'bg-orange-600': card.rarity === 'legendary'
                          }">
                      {{ getRarityLabel(card.rarity) }}
                    </span>
                  </div>
                  <h3 class="font-bold mb-1">{{ card.name }}</h3>
                  <p class="text-xs text-slate-400 mb-2">{{ card.description }}</p>
                  <div class="flex justify-center">
                    <span class="px-2 py-0.5 bg-slate-800 rounded-full text-xs">
                      {{ getTriggerLabel(card.trigger) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Skip Button -->
            <button @click="$emit('reincarnate-without-card')"
                    class="w-full bg-slate-700 hover:bg-slate-600 border border-slate-500 rounded-lg py-3 font-bold transition-colors">
              카드 없이 환생
            </button>
          </div>

          <!-- Without Cards -->
          <div v-else class="text-center py-8">
            <p class="text-lg mb-2">보유한 패시브 카드가 없습니다.</p>
            <p class="text-slate-400 mb-6">환생하여 새로운 시작을 하세요!</p>
            <button @click="$emit('reincarnate-without-card')"
                    class="bg-cyan-600 hover:bg-cyan-500 rounded-lg px-8 py-3 font-bold text-lg transition-colors inline-flex items-center gap-2">
              <span>💫</span> 환생하기
            </button>
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
  availableCards: PassiveCard[]
  reincarnationCount: number
  highestDay: number
  totalDaysPlayed: number
}

defineProps<Props>()

defineEmits<{
  'select-card': [card: PassiveCard]
  'reincarnate-without-card': []
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
