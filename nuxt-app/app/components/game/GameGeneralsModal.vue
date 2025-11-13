<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4" @click="$emit('close')">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600 rounded-xl max-w-7xl w-full max-h-[95vh] overflow-hidden" @click.stop>
        <!-- Header -->
        <div class="bg-gradient-to-r from-slate-700 to-slate-800 border-b-2 border-slate-600 p-3 sm:p-4 flex items-center justify-between sticky top-0 z-10">
          <h2 class="text-lg sm:text-xl font-bold flex items-center gap-2">
            <span class="text-2xl">⚔️</span>
            <span>보유 장수</span>
            <span class="text-sm text-slate-400">({{ generals.length }})</span>
          </h2>
          <button @click="$emit('close')" class="text-2xl hover:text-red-400 transition-colors">✕</button>
        </div>

        <!-- Generals Card Grid -->
        <div class="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)]">
          <!-- Empty State -->
          <div v-if="generals.length === 0" class="text-center py-12 sm:py-16 text-slate-400">
            <div class="text-6xl sm:text-7xl mb-4">⚔️</div>
            <p class="text-lg sm:text-xl font-bold mb-2">보유한 장수가 없습니다</p>
            <p class="text-sm sm:text-base text-slate-500">카드 보상을 통해 장수를 영입하세요!</p>
          </div>

          <!-- Generals Card Grid -->
          <div v-else class="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="general in generals" :key="general.id"
                 class="general-card relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                 :class="{
                   'border-gray-500 bg-gradient-to-br from-gray-800/90 to-gray-900/90': general.rarity === 'common',
                   'border-blue-500 bg-gradient-to-br from-blue-900/40 to-blue-950/60': general.rarity === 'rare',
                   'border-purple-500 bg-gradient-to-br from-purple-900/40 to-purple-950/60': general.rarity === 'epic'
                 }">

              <!-- Rarity Glow Effect -->
              <div class="absolute inset-0 opacity-20 blur-xl"
                   :class="{
                     'bg-gray-500': general.rarity === 'common',
                     'bg-blue-500': general.rarity === 'rare',
                     'bg-purple-500': general.rarity === 'epic'
                   }"></div>

              <div class="relative border-2 rounded-xl p-4 sm:p-5"
                   :class="{
                     'border-gray-500': general.rarity === 'common',
                     'border-blue-500': general.rarity === 'rare',
                     'border-purple-500': general.rarity === 'epic'
                   }">

                <!-- Card Header -->
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-xl sm:text-2xl font-bold text-white mb-1 flex items-center gap-2">
                      {{ general.name }}
                      <span v-if="general.assignedSoldiers > 0" class="text-sm text-green-400">출전 중</span>
                    </h3>
                    <p class="text-sm sm:text-base font-medium"
                       :class="{
                         'text-gray-400': general.rarity === 'common',
                         'text-blue-300': general.rarity === 'rare',
                         'text-purple-300': general.rarity === 'epic'
                       }">{{ general.title }}</p>
                  </div>
                  <div class="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold border-2 shadow-lg"
                       :class="{
                         'bg-gray-700/80 border-gray-500 text-gray-200': general.rarity === 'common',
                         'bg-blue-700/80 border-blue-400 text-blue-100': general.rarity === 'rare',
                         'bg-purple-700/80 border-purple-400 text-purple-100': general.rarity === 'epic'
                       }">
                    {{ getRarityLabel(general.rarity) }}
                  </div>
                </div>

                <!-- Combat Power (Main Stat) -->
                <div class="mb-4 bg-slate-900/60 border-2 rounded-xl p-4"
                     :class="{
                       'border-gray-600': general.rarity === 'common',
                       'border-blue-600': general.rarity === 'rare',
                       'border-purple-600': general.rarity === 'epic'
                     }">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="text-3xl">⚔️</span>
                    <div class="flex-1">
                      <div class="text-xs text-slate-400 mb-1">전투력</div>
                      <div class="flex items-center gap-2">
                        <span class="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                          {{ getCombatPower(general) }}
                        </span>
                        <span class="text-sm text-slate-400">/100</span>
                      </div>
                    </div>
                  </div>
                  <div class="w-full bg-slate-950/80 rounded-full h-2 overflow-hidden">
                    <div class="h-2 rounded-full transition-all duration-500"
                         :class="{
                           'bg-gradient-to-r from-gray-500 to-gray-400': general.rarity === 'common',
                           'bg-gradient-to-r from-blue-500 to-cyan-400': general.rarity === 'rare',
                           'bg-gradient-to-r from-purple-500 to-pink-400': general.rarity === 'epic'
                         }"
                         :style="{ width: getCombatPower(general) + '%' }"></div>
                  </div>
                </div>

                <!-- Detailed Stats -->
                <div class="grid grid-cols-3 gap-2 mb-4">
                  <div class="bg-slate-900/40 border border-red-500/50 rounded-lg p-2 text-center">
                    <div class="text-xs text-slate-400 mb-1">💪 무력</div>
                    <div class="text-lg font-bold text-red-300">{{ general.stats.power }}</div>
                  </div>
                  <div class="bg-slate-900/40 border border-blue-500/50 rounded-lg p-2 text-center">
                    <div class="text-xs text-slate-400 mb-1">🧠 지력</div>
                    <div class="text-lg font-bold text-blue-300">{{ general.stats.intelligence }}</div>
                  </div>
                  <div class="bg-slate-900/40 border border-green-500/50 rounded-lg p-2 text-center">
                    <div class="text-xs text-slate-400 mb-1">👑 통솔</div>
                    <div class="text-lg font-bold text-green-300">{{ general.stats.leadership }}</div>
                  </div>
                </div>

                <!-- Skills -->
                <div class="mb-4">
                  <div v-if="general.skills.length > 0">
                    <h4 class="text-sm font-bold mb-2 flex items-center gap-1 text-yellow-400">
                      <span>✨</span> 보유 스킬
                    </h4>
                    <div class="space-y-2">
                      <div v-for="skill in general.skills" :key="skill.id"
                           class="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/50 px-3 py-2 rounded-lg">
                        <div class="flex items-center justify-between mb-1">
                          <span class="font-bold text-sm text-purple-100">{{ skill.name }}</span>
                          <span class="text-xs px-2 py-0.5 bg-purple-700 rounded-full">{{ skill.successRate }}%</span>
                        </div>
                        <p class="text-xs text-purple-200/80">{{ skill.description }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center py-2 text-sm text-slate-500 border border-slate-700 rounded-lg bg-slate-900/30">
                    💫 보유한 스킬이 없습니다
                  </div>
                </div>

                <!-- Assigned Soldiers -->
                <div v-if="general.assignedSoldiers > 0" class="mb-4 bg-green-900/30 border border-green-500/50 rounded-lg p-3 flex items-center justify-between">
                  <span class="text-sm font-medium text-green-200">배치 병력</span>
                  <span class="text-lg font-bold text-green-300">{{ general.assignedSoldiers.toLocaleString() }}명</span>
                </div>

                <!-- Dismiss Button -->
                <button @click="$emit('dismiss-general', general.id)"
                        class="w-full bg-gradient-to-r from-red-900/70 to-red-800/70 hover:from-red-800 hover:to-red-700 border-2 border-red-600 rounded-lg py-3 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg">
                  <span class="flex items-center justify-center gap-2">
                    <span>🚪</span>
                    <span>장수 해고</span>
                  </span>
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
import type { General } from '~/types/game'

interface Props {
  show: boolean
  generals: General[]
  maxSoldiers: number
}

defineProps<Props>()

defineEmits<{
  close: []
  'dismiss-general': [generalId: string]
  'assign-soldiers': [generalId: string, amount: number]
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

// 전투력 계산 (무력, 지력, 통솔의 평균)
const getCombatPower = (general: General) => {
  const { power, intelligence, leadership } = general.stats
  return Math.round((power + intelligence + leadership) / 3)
}
</script>

<style scoped>
.general-card {
  backdrop-filter: blur(10px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
