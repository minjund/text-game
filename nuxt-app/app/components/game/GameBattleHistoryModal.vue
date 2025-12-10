<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/90 z-[10001] flex justify-center items-center p-4">
      <div class="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-600 rounded-lg max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-900 to-purple-800 border-b-2 border-purple-600 p-4 flex-shrink-0">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold flex items-center gap-2">
              📜 전쟁의 기록
            </h2>
            <button
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-bold rounded bg-red-600 hover:bg-red-500 active:bg-red-700 transition-colors"
            >
              닫기
            </button>
          </div>
          <p class="text-xs text-purple-300 mt-2">총 {{ battles.length }}회의 전투 기록</p>
        </div>

        <!-- Battle List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div v-if="battles.length === 0" class="text-center text-slate-400 py-12">
            <div class="text-4xl mb-3">⚔️</div>
            <p>아직 전투 기록이 없습니다.</p>
            <p class="text-xs mt-1">첫 전투를 시작해보세요!</p>
          </div>

          <div
            v-for="(battle, index) in sortedBattles"
            :key="index"
            class="bg-slate-700/50 backdrop-blur-sm border rounded-lg p-3 hover:bg-slate-700/70 transition-colors"
            :class="{
              'border-green-500': battle.result === 'victory',
              'border-red-500': battle.result === 'defeat'
            }"
          >
            <!-- Battle Header -->
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span v-if="battle.result === 'victory'" class="text-xl">🏆</span>
                <span v-else class="text-xl">💀</span>
                <span class="font-bold" :class="{
                  'text-green-400': battle.result === 'victory',
                  'text-red-400': battle.result === 'defeat'
                }">
                  {{ battle.result === 'victory' ? '승리' : '패배' }}
                </span>
              </div>
              <span class="text-xs text-slate-400">{{ formatDate(battle.timestamp) }}</span>
            </div>

            <!-- Battle Info -->
            <div class="space-y-1 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-slate-300">적:</span>
                <span class="text-white font-semibold">{{ battle.enemyName }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-300">타입:</span>
                <span class="text-purple-300">{{ getBattleType(battle.battleType) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-300">게임 일차:</span>
                <span class="text-blue-300">{{ battle.day }}일차</span>
              </div>
              <div v-if="battle.score" class="flex items-center justify-between pt-1 border-t border-slate-600">
                <span class="text-slate-300">점수:</span>
                <span class="font-mono" :class="{
                  'text-green-400': battle.score.player > battle.score.enemy,
                  'text-red-400': battle.score.player < battle.score.enemy,
                  'text-yellow-400': battle.score.player === battle.score.enemy
                }">
                  {{ battle.score.player }} : {{ battle.score.enemy }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div v-if="battles.length > 0" class="border-t-2 border-purple-600 p-4 bg-slate-800/50 flex-shrink-0">
          <div class="grid grid-cols-3 gap-3 text-center">
            <div>
              <div class="text-2xl font-bold text-green-400">{{ winCount }}</div>
              <div class="text-xs text-slate-400">승리</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-red-400">{{ loseCount }}</div>
              <div class="text-xs text-slate-400">패배</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-blue-400">{{ winRate }}%</div>
              <div class="text-xs text-slate-400">승률</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface BattleRecord {
  timestamp: number
  result: 'victory' | 'defeat'
  enemyName: string
  battleType: string
  day: number
  score?: {
    player: number
    enemy: number
  }
}

interface Props {
  show: boolean
  battles: BattleRecord[]
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  battles: () => []
})

defineEmits<{
  close: []
}>()

// 최신순 정렬
const sortedBattles = computed(() => {
  return [...props.battles].sort((a, b) => b.timestamp - a.timestamp)
})

// 통계
const winCount = computed(() => {
  return props.battles.filter(b => b.result === 'victory').length
})

const loseCount = computed(() => {
  return props.battles.filter(b => b.result === 'defeat').length
})

const winRate = computed(() => {
  if (props.battles.length === 0) return 0
  return Math.round((winCount.value / props.battles.length) * 100)
})

// 날짜 포맷팅
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}/${day} ${hours}:${minutes}`
}

// 전투 타입 한글 변환
const getBattleType = (type: string) => {
  switch (type) {
    case 'pve':
      return '일반 전투'
    case 'empire':
      return '제국 침략'
    case 'boss':
      return '보스 전투'
    default:
      return type
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
</style>
