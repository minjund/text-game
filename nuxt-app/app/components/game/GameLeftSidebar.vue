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
      class="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-xl border-2 border-indigo-500/50 rounded-xl p-4"
    >
      <h3 class="text-sm font-bold text-indigo-200 mb-3 flex items-center gap-2">
        <span>⚖️</span> 계명 효과 (매일)
      </h3>
      <div class="flex flex-wrap gap-1.5">
        <div v-if="commandmentEffects.morale !== 0" class="px-2.5 py-1 rounded-md text-xs font-semibold" :class="commandmentEffects.morale > 0 ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40' : 'bg-red-500/30 text-red-200 border border-red-500/40'">
          민심 {{ commandmentEffects.morale > 0 ? '+' : '' }}{{ commandmentEffects.morale }}
        </div>
        <div v-if="commandmentEffects.gold !== 0" class="px-2.5 py-1 rounded-md text-xs font-semibold" :class="commandmentEffects.gold > 0 ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40' : 'bg-red-500/30 text-red-200 border border-red-500/40'">
          금 {{ commandmentEffects.gold > 0 ? '+' : '' }}{{ commandmentEffects.gold }}
        </div>
        <div v-if="commandmentEffects.military !== 0" class="px-2.5 py-1 rounded-md text-xs font-semibold" :class="commandmentEffects.military > 0 ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40' : 'bg-red-500/30 text-red-200 border border-red-500/40'">
          병력 {{ commandmentEffects.military > 0 ? '+' : '' }}{{ commandmentEffects.military }}
        </div>
        <div v-if="commandmentEffects.food !== 0" class="px-2.5 py-1 rounded-md text-xs font-semibold" :class="commandmentEffects.food > 0 ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40' : 'bg-red-500/30 text-red-200 border border-red-500/40'">
          식량 {{ commandmentEffects.food > 0 ? '+' : '' }}{{ commandmentEffects.food }}
        </div>
        <div v-if="commandmentEffects.population !== 0" class="px-2.5 py-1 rounded-md text-xs font-semibold" :class="commandmentEffects.population > 0 ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40' : 'bg-red-500/30 text-red-200 border border-red-500/40'">
          인구 {{ commandmentEffects.population > 0 ? '+' : '' }}{{ commandmentEffects.population }}
        </div>
      </div>
    </div>

    <GameTurnCounter
      :current-turns="turnData.currentTurns"
      :max-turns="turnData.maxTurns"
      :time-until-next="turnData.timeUntilNext"
      :time-until-full="turnData.timeUntilFull"
      :show-debug-buttons="true"
      @recharge-all="$emit('recharge-all-turns')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import GameTimerCard from './GameTimerCard.vue'
import GameTurnCounter from './GameTurnCounter.vue'

interface TimerData {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

interface TurnData {
  currentTurns: number
  maxTurns: number
  timeUntilNext: {
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null
  timeUntilFull: {
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null
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
  turnData: TurnData
  currentDay: number
  commandmentEffects?: CommandmentEffects | null
}

const props = defineProps<Props>()

defineEmits<{
  'recharge-all-turns': []
}>()

// 다음 제국 침략까지 남은 일수 계산
const daysUntilInvasion = computed(() => {
  if (props.currentDay >= 42) return 0 // 42일 이후에는 침략 없음
  const nextInvasionDay = Math.ceil((props.currentDay + 1) / 7) * 7
  return nextInvasionDay - props.currentDay
})

// 침략 경고 메시지
const invasionWarning = computed(() => {
  if (props.currentDay >= 42) return ''
  if (daysUntilInvasion.value === 0) return '⚔️ 오늘 제국 침략!'
  if (daysUntilInvasion.value === 1) return '⚔️ 내일 제국 침략!'
  return `⚔️ ${daysUntilInvasion.value}일 후 제국 침략`
})

// 계명 효과가 있는지 확인
const hasEffects = computed(() => {
  if (!props.commandmentEffects) return false
  const effects = props.commandmentEffects
  return effects.morale !== 0 || effects.gold !== 0 || effects.military !== 0 || effects.food !== 0 || effects.population !== 0
})
</script>
