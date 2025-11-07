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

interface Props {
  timer: TimerData
  turnData: TurnData
  currentDay: number
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
</script>
