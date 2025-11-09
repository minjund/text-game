<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click="$emit('close')">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden" @click.stop>
        <!-- Header -->
        <div class="bg-gradient-to-r from-slate-700 to-slate-800 border-b-2 border-slate-600 p-4 flex items-center justify-between">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <span>⚔️</span> 장수 관리
          </h2>
          <button @click="$emit('close')" class="text-2xl hover:text-red-400 transition-colors">✕</button>
        </div>

        <!-- Generals List -->
        <div class="p-3 sm:p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          <!-- Empty State -->
          <div v-if="generals.length === 0" class="text-center py-8 sm:py-12 text-slate-400">
            <div class="text-5xl sm:text-6xl mb-3 sm:mb-4">⚔️</div>
            <p class="text-base sm:text-lg font-bold mb-2">보유한 장수가 없습니다</p>
            <p class="text-xs sm:text-sm">이벤트를 진행하여 장수를 영입하세요!</p>
          </div>

          <!-- Generals Grid -->
          <div v-else class="grid gap-4 md:grid-cols-2">
          <div v-for="general in generals" :key="general.id"
               class="bg-slate-700/50 border-2 rounded-lg p-4"
               :class="{
                 'border-gray-500': general.rarity === 'common',
                 'border-blue-500': general.rarity === 'rare',
                 'border-purple-500': general.rarity === 'epic'
               }">

            <!-- General Info -->
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="text-lg font-bold">{{ general.name }}</h3>
                <p class="text-sm text-slate-400">{{ general.title }}</p>
              </div>
              <span class="px-2 py-1 rounded text-xs font-bold"
                    :class="{
                      'bg-gray-600': general.rarity === 'common',
                      'bg-blue-600': general.rarity === 'rare',
                      'bg-purple-600': general.rarity === 'epic'
                    }">
                {{ getRarityLabel(general.rarity) }}
              </span>
            </div>

            <!-- Stats -->
            <div class="space-y-2 mb-3">
              <div class="flex items-center gap-2">
                <span class="text-lg">⚔️</span>
                <div class="flex-1">
                  <div class="flex justify-between text-xs mb-1">
                    <span>무력</span>
                    <span class="font-bold">{{ general.stats.power }}</span>
                  </div>
                  <div class="w-full bg-slate-900 rounded-full h-2">
                    <div class="bg-red-500 h-2 rounded-full" :style="{ width: general.stats.power + '%' }"></div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-lg">🧠</span>
                <div class="flex-1">
                  <div class="flex justify-between text-xs mb-1">
                    <span>지력</span>
                    <span class="font-bold">{{ general.stats.intelligence }}</span>
                  </div>
                  <div class="w-full bg-slate-900 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" :style="{ width: general.stats.intelligence + '%' }"></div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-lg">👑</span>
                <div class="flex-1">
                  <div class="flex justify-between text-xs mb-1">
                    <span>통솔</span>
                    <span class="font-bold">{{ general.stats.leadership }}</span>
                  </div>
                  <div class="w-full bg-slate-900 rounded-full h-2">
                    <div class="bg-yellow-500 h-2 rounded-full" :style="{ width: general.stats.leadership + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Skills -->
            <div v-if="general.skills.length > 0" class="mb-3">
              <h4 class="text-sm font-bold mb-1 flex items-center gap-1">
                <span>✨</span> 스킬
              </h4>
              <div class="flex flex-wrap gap-1">
                <div v-for="skill in general.skills" :key="skill.id"
                     class="bg-purple-900/50 px-2 py-1 rounded text-xs flex items-center gap-1">
                  <span class="font-semibold">{{ skill.name }}</span>
                  <span class="text-purple-300">{{ skill.successRate }}%</span>
                </div>
              </div>
            </div>
            <div v-else class="mb-3">
              <span class="text-xs text-slate-500">💫 스킬 없음</span>
            </div>

            <!-- Current Assigned Soldiers (Read-only) -->
            <div class="mb-3">
              <label class="text-sm font-bold mb-1 flex items-center gap-1">
                <span>🎖️</span> 현재 배치 병력
              </label>
              <div class="w-full bg-slate-900/50 border border-slate-600 rounded px-3 py-2 text-slate-300">
                {{ general.assignedSoldiers.toLocaleString() }} 명
              </div>
            </div>

            <!-- New Soldier Assignment Input -->
            <div class="mb-3">
              <label class="text-sm font-bold mb-1 flex items-center gap-1">
                <span>⚔️</span> 병력 배치/회수
              </label>
              <input type="number" v-model.number="newAssignments[general.id]"
                     :max="maxSoldiers" :min="-general.assignedSoldiers" step="100" placeholder="0"
                     class="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                     @input="validateAssignment(general.id)" />
              <p class="text-xs text-slate-400 mt-1">
                양수: 배치, 음수: 회수 (가용 병력: {{ maxSoldiers.toLocaleString() }}명)
              </p>
            </div>

            <!-- Assign Soldiers Button -->
            <button @click="handleAssignSoldiers(general.id)"
                    :disabled="!newAssignments[general.id] || newAssignments[general.id] === 0"
                    class="w-full bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600 rounded py-2 text-sm font-bold transition-colors mb-2 disabled:opacity-50 disabled:cursor-not-allowed">
              병력 배치
            </button>

            <!-- Dismiss Button -->
            <button @click="$emit('dismiss-general', general.id)"
                    class="w-full bg-red-900/50 hover:bg-red-800/50 border border-red-600 rounded py-2 text-sm font-bold transition-colors">
              장수 해고
            </button>

          </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { General } from '~/types/game'

interface Props {
  show: boolean
  generals: General[]
  maxSoldiers: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  'dismiss-general': [generalId: string]
  'assign-soldiers': [generalId: string, amount: number]
}>()

// Track new soldier assignments for each general
const newAssignments = reactive<Record<string, number>>({})

const getRarityLabel = (rarity: string) => {
  const labels: Record<string, string> = {
    common: '일반',
    rare: '희귀',
    epic: '영웅',
    legendary: '전설'
  }
  return labels[rarity] || rarity
}

const validateAssignment = (generalId: string) => {
  const amount = newAssignments[generalId]
  if (!amount) return

  const general = props.generals.find(g => g.id === generalId)
  if (!general) return

  // 병력 배치인 경우 (양수)
  if (amount > 0) {
    // 가용 병력을 초과할 수 없음
    if (amount > props.maxSoldiers) {
      newAssignments[generalId] = props.maxSoldiers
    }
  }
  // 병력 회수인 경우 (음수)
  else if (amount < 0) {
    // 현재 배치된 병력보다 많이 회수할 수 없음
    if (Math.abs(amount) > general.assignedSoldiers) {
      newAssignments[generalId] = -general.assignedSoldiers
    }
  }
}

const handleAssignSoldiers = (generalId: string) => {
  const amount = newAssignments[generalId]
  if (!amount || amount === 0) return

  emit('assign-soldiers', generalId, amount)
  // Reset the input after emitting
  newAssignments[generalId] = 0
}
</script>
