<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
         @click.self="$emit('close')">
      <div class="bg-slate-900/95 rounded-2xl border-2 border-purple-500/50 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 border-b-2 border-purple-500/30">
          <h2 class="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            ✨ 카드 선택 ✨
          </h2>
          <p class="text-center text-slate-300 mt-2">
            3개 중 1개를 선택하세요
          </p>
        </div>

        <!-- Cards -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              v-for="card in cards"
              :key="card.id"
              class="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border-2 border-slate-600 hover:border-purple-500 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl overflow-hidden"
              @click="$emit('select-card', card)"
            >
              <!-- Card Glow Effect -->
              <div class="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/20 group-hover:to-blue-500/20 transition-all duration-300"></div>

              <!-- Card Content -->
              <div class="relative p-6">
                <!-- Icon -->
                <div class="text-6xl text-center mb-4">
                  {{ card.icon }}
                </div>

                <!-- Name -->
                <h3 class="text-xl font-bold text-center mb-3 text-purple-300">
                  {{ card.name }}
                </h3>

                <!-- Tag Badge -->
                <div class="flex justify-center mb-4">
                  <span class="px-3 py-1 rounded-full text-xs font-bold"
                        :class="getTagColor(card.tag)">
                    {{ getTagName(card.tag) }}
                  </span>
                </div>

                <!-- Description -->
                <p class="text-sm text-center text-slate-300 mb-4">
                  {{ card.description }}
                </p>

                <!-- Effects -->
                <div class="space-y-2 bg-slate-800/50 rounded-lg p-4">
                  <div v-if="card.effect.gold" class="flex items-center justify-between text-sm">
                    <span class="text-yellow-400">💰 금:</span>
                    <span class="text-white font-bold">+{{ card.effect.gold }}</span>
                  </div>
                  <div v-if="card.effect.food" class="flex items-center justify-between text-sm">
                    <span class="text-green-400">🌾 식량:</span>
                    <span class="text-white font-bold">+{{ card.effect.food }}</span>
                  </div>
                  <div v-if="card.effect.morale" class="flex items-center justify-between text-sm">
                    <span class="text-pink-400">❤️ 민심:</span>
                    <span class="text-white font-bold">+{{ card.effect.morale }}</span>
                  </div>
                  <div v-if="card.effect.military" class="flex items-center justify-between text-sm">
                    <span class="text-red-400">⚔️ 병력:</span>
                    <span class="text-white font-bold">+{{ card.effect.military }}</span>
                  </div>
                  <div v-if="card.effect.population" class="flex items-center justify-between text-sm">
                    <span class="text-blue-400">👥 인구:</span>
                    <span class="text-white font-bold">+{{ card.effect.population }}</span>
                  </div>
                  <div v-if="card.effect.attackBonus" class="flex items-center justify-between text-sm">
                    <span class="text-orange-400">🗡️ 공격력:</span>
                    <span class="text-white font-bold">+{{ card.effect.attackBonus }}%</span>
                  </div>
                  <div v-if="card.effect.defenseBonus" class="flex items-center justify-between text-sm">
                    <span class="text-blue-400">🛡️ 방어력:</span>
                    <span class="text-white font-bold">+{{ card.effect.defenseBonus }}%</span>
                  </div>
                </div>

                <!-- Select Button -->
                <button class="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg transition-all duration-300 transform group-hover:scale-105">
                  선택하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { SynergyCard } from '~/types/synergy-cards'

defineProps<{
  show: boolean
  cards: SynergyCard[]
}>()

defineEmits<{
  close: []
  selectCard: [card: SynergyCard]
}>()

const getTagColor = (tag: string) => {
  const colors: Record<string, string> = {
    trade: 'bg-yellow-600 text-yellow-100',
    military: 'bg-red-600 text-red-100',
    agriculture: 'bg-green-600 text-green-100',
    culture: 'bg-purple-600 text-purple-100'
  }
  return colors[tag] || 'bg-gray-600 text-gray-100'
}

const getTagName = (tag: string) => {
  const names: Record<string, string> = {
    trade: '무역',
    military: '군사',
    agriculture: '농업',
    culture: '문화'
  }
  return names[tag] || tag
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
