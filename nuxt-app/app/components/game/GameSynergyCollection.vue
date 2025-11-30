<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
         @click.self="$emit('close')">
      <div class="bg-slate-900/95 rounded-2xl border-2 border-purple-500/50 shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 border-b-2 border-purple-500/30">
          <div class="flex items-center justify-between">
            <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              🎴 보유 카드 & 시너지
            </h2>
            <button @click="$emit('close')" class="text-slate-400 hover:text-white text-3xl">
              ×
            </button>
          </div>
          <p class="text-slate-300 mt-2">
            보유 카드: {{ cards.length }}개 | 활성 시너지: {{ synergies.length }}개
          </p>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <!-- Active Synergies -->
          <div v-if="synergies.length > 0" class="mb-8">
            <h3 class="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
              <span>✨</span>
              <span>활성 시너지</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="synergy in synergies"
                :key="synergy.id"
                class="bg-gradient-to-br from-purple-800/50 to-blue-800/50 rounded-xl border-2 border-purple-400 p-5 shadow-lg"
              >
                <div class="flex items-start gap-4">
                  <div class="text-5xl">{{ synergy.icon }}</div>
                  <div class="flex-1">
                    <h4 class="text-xl font-bold text-purple-300 mb-2">
                      {{ synergy.name }}
                    </h4>
                    <p class="text-sm text-slate-300 mb-3">
                      {{ synergy.description }}
                    </p>
                    <div class="space-y-1">
                      <div v-if="synergy.effect.gold" class="flex items-center gap-2 text-sm">
                        <span class="text-yellow-400">💰</span>
                        <span class="text-white">금 +{{ synergy.effect.gold }}</span>
                      </div>
                      <div v-if="synergy.effect.food" class="flex items-center gap-2 text-sm">
                        <span class="text-green-400">🌾</span>
                        <span class="text-white">식량 +{{ synergy.effect.food }}</span>
                      </div>
                      <div v-if="synergy.effect.morale" class="flex items-center gap-2 text-sm">
                        <span class="text-pink-400">❤️</span>
                        <span class="text-white">민심 +{{ synergy.effect.morale }}</span>
                      </div>
                      <div v-if="synergy.effect.attackBonus" class="flex items-center gap-2 text-sm">
                        <span class="text-orange-400">🗡️</span>
                        <span class="text-white">공격력 +{{ synergy.effect.attackBonus }}%</span>
                      </div>
                      <div v-if="synergy.effect.defenseBonus" class="flex items-center gap-2 text-sm">
                        <span class="text-blue-400">🛡️</span>
                        <span class="text-white">방어력 +{{ synergy.effect.defenseBonus }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cards -->
          <div>
            <h3 class="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span>🎴</span>
              <span>보유 카드</span>
            </h3>

            <div v-if="cards.length === 0" class="text-center py-12 text-slate-400">
              <div class="text-6xl mb-4">📭</div>
              <p class="text-xl">아직 보유한 카드가 없습니다</p>
              <p class="text-sm mt-2">상점이나 이벤트에서 카드를 획득할 수 있습니다</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div
                v-for="card in cards"
                :key="card.id"
                class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border-2 border-slate-600 p-4 hover:border-purple-400 transition-all duration-300"
              >
                <!-- Icon -->
                <div class="text-5xl text-center mb-3">
                  {{ card.icon }}
                </div>

                <!-- Name -->
                <h4 class="text-lg font-bold text-center mb-2 text-purple-300">
                  {{ card.name }}
                </h4>

                <!-- Tag Badge -->
                <div class="flex justify-center mb-3">
                  <span class="px-2 py-1 rounded-full text-xs font-bold"
                        :class="getTagColor(card.tag)">
                    {{ getTagName(card.tag) }}
                  </span>
                </div>

                <!-- Description -->
                <p class="text-xs text-center text-slate-300 mb-3">
                  {{ card.description }}
                </p>

                <!-- Effects (compact) -->
                <div class="space-y-1 bg-slate-800/50 rounded-lg p-2">
                  <div v-if="card.effect.gold" class="flex items-center justify-between text-xs">
                    <span class="text-yellow-400">💰</span>
                    <span class="text-white font-bold">+{{ card.effect.gold }}</span>
                  </div>
                  <div v-if="card.effect.food" class="flex items-center justify-between text-xs">
                    <span class="text-green-400">🌾</span>
                    <span class="text-white font-bold">+{{ card.effect.food }}</span>
                  </div>
                  <div v-if="card.effect.morale" class="flex items-center justify-between text-xs">
                    <span class="text-pink-400">❤️</span>
                    <span class="text-white font-bold">+{{ card.effect.morale }}</span>
                  </div>
                  <div v-if="card.effect.military" class="flex items-center justify-between text-xs">
                    <span class="text-red-400">⚔️</span>
                    <span class="text-white font-bold">+{{ card.effect.military }}</span>
                  </div>
                  <div v-if="card.effect.attackBonus" class="flex items-center justify-between text-xs">
                    <span class="text-orange-400">🗡️</span>
                    <span class="text-white font-bold">+{{ card.effect.attackBonus }}%</span>
                  </div>
                  <div v-if="card.effect.defenseBonus" class="flex items-center justify-between text-xs">
                    <span class="text-blue-400">🛡️</span>
                    <span class="text-white font-bold">+{{ card.effect.defenseBonus }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Effects Summary -->
          <div class="mt-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl border-2 border-blue-500/50 p-6">
            <h3 class="text-xl font-bold text-blue-400 mb-4 text-center">
              📊 총 효과
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center">
                <div class="text-yellow-400 text-2xl mb-2">💰</div>
                <div class="text-sm text-slate-400">금</div>
                <div class="text-2xl font-bold text-white">+{{ totalEffects.gold }}</div>
              </div>
              <div class="text-center">
                <div class="text-green-400 text-2xl mb-2">🌾</div>
                <div class="text-sm text-slate-400">식량</div>
                <div class="text-2xl font-bold text-white">+{{ totalEffects.food }}</div>
              </div>
              <div class="text-center">
                <div class="text-pink-400 text-2xl mb-2">❤️</div>
                <div class="text-sm text-slate-400">민심</div>
                <div class="text-2xl font-bold text-white">+{{ totalEffects.morale }}</div>
              </div>
              <div class="text-center">
                <div class="text-red-400 text-2xl mb-2">⚔️</div>
                <div class="text-sm text-slate-400">병력</div>
                <div class="text-2xl font-bold text-white">+{{ totalEffects.military }}</div>
              </div>
              <div v-if="totalEffects.attackBonus > 0" class="text-center">
                <div class="text-orange-400 text-2xl mb-2">🗡️</div>
                <div class="text-sm text-slate-400">공격력</div>
                <div class="text-2xl font-bold text-white">+{{ totalEffects.attackBonus }}%</div>
              </div>
              <div v-if="totalEffects.defenseBonus > 0" class="text-center">
                <div class="text-blue-400 text-2xl mb-2">🛡️</div>
                <div class="text-sm text-slate-400">방어력</div>
                <div class="text-2xl font-bold text-white">+{{ totalEffects.defenseBonus }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { SynergyCard, SynergyBonus } from '~/types/synergy-cards'

defineProps<{
  show: boolean
  cards: SynergyCard[]
  synergies: SynergyBonus[]
  totalEffects: {
    gold: number
    food: number
    morale: number
    military: number
    attackBonus: number
    defenseBonus: number
  }
}>()

defineEmits<{
  close: []
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
