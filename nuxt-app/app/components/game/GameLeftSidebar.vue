<template>
  <div class="w-80 space-y-4">
    <GameTimerCard
      :days="timer.days"
      :hours="timer.hours"
      :minutes="timer.minutes"
      :seconds="timer.seconds"
      :is-expired="timer.isExpired"
    />

    <!-- Invasion Warning -->
    <div
      v-if="invasionWarning"
      class="bg-gradient-to-br border-2 rounded-xl p-4 text-center"
      :class="daysUntilInvasion <= 1 ? 'from-red-900/50 to-rose-900/50 border-red-500' : 'from-yellow-900/50 to-amber-900/50 border-yellow-500'"
    >
      <div class="text-lg font-bold animate-pulse">
        {{ invasionWarning }}
      </div>
    </div>

    <!-- 계명 일일 효과 표시 -->
    <div
      v-if="commandmentEffects && hasEffects"
      class="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-xl border-2 border-indigo-400 rounded-xl p-4 shadow-lg"
    >
      <h3 class="text-base font-bold text-indigo-200 mb-3 flex items-center gap-2">
        <span class="text-2xl">⚖️</span> 신의 계명 효과 (매일 적용)
      </h3>
      <div class="flex flex-wrap gap-2">
        <div v-if="commandmentEffects.morale !== 0" class="px-3 py-1.5 rounded-md text-sm font-semibold border" :class="commandmentEffects.morale > 0 ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400' : 'bg-red-500/30 text-red-200 border-red-400'">
          😊 민심 {{ commandmentEffects.morale > 0 ? '+' : '' }}{{ commandmentEffects.morale }}
        </div>
        <div v-if="commandmentEffects.gold !== 0" class="px-3 py-1.5 rounded-md text-sm font-semibold border" :class="commandmentEffects.gold > 0 ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400' : 'bg-red-500/30 text-red-200 border-red-400'">
          💰 금 {{ commandmentEffects.gold > 0 ? '+' : '' }}{{ commandmentEffects.gold }}
        </div>
        <div v-if="commandmentEffects.military !== 0" class="px-3 py-1.5 rounded-md text-sm font-semibold border" :class="commandmentEffects.military > 0 ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400' : 'bg-red-500/30 text-red-200 border-red-400'">
          ⚔️ 병력 {{ commandmentEffects.military > 0 ? '+' : '' }}{{ commandmentEffects.military }}
        </div>
        <div v-if="commandmentEffects.food !== 0" class="px-3 py-1.5 rounded-md text-sm font-semibold border" :class="commandmentEffects.food > 0 ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400' : 'bg-red-500/30 text-red-200 border-red-400'">
          🍖 식량 {{ commandmentEffects.food > 0 ? '+' : '' }}{{ commandmentEffects.food }}
        </div>
        <div v-if="commandmentEffects.population !== 0" class="px-3 py-1.5 rounded-md text-sm font-semibold border" :class="commandmentEffects.population > 0 ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400' : 'bg-red-500/30 text-red-200 border-red-400'">
          👥 인구 {{ commandmentEffects.population > 0 ? '+' : '' }}{{ commandmentEffects.population }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import GameTimerCard from './GameTimerCard.vue'

interface TimerData {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

interface CommandmentEffects {
  morale: number
  gold: number
  military: number
  food: number
  population: number
}

interface Props {
  timer: TimerData
  currentDay: number
  commandmentEffects?: CommandmentEffects | null
}

const props = defineProps<Props>()

// 다음 제국 침략까지 남은 일수 계산
const daysUntilInvasion = computed(() => {
  if (props.currentDay >= 42) return 0 // 42일 이후에는 침략 없음
  const nextInvasionDay = Math.ceil((props.currentDay + 1) / 7) * 7
  return nextInvasionDay - props.currentDay
})

// 침략 경고 메시지 (비활성화)
const invasionWarning = computed(() => {
  return '' // 제국 침략 카운트다운 표시 안함
})

// 계명 효과가 있는지 확인
const hasEffects = computed(() => {
  if (!props.commandmentEffects) return false
  const effects = props.commandmentEffects
  return effects.morale !== 0 || effects.gold !== 0 || effects.military !== 0 || effects.food !== 0 || effects.population !== 0
})
</script>
