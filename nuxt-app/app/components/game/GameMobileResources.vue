<template>
  <div class="md:hidden fixed top-2 left-2 right-2 z-50 flex flex-col gap-1.5 pointer-events-none">
    <!-- All resources in grid layout -->
    <div class="flex flex-col gap-1.5">
      <!-- Row 1: Timer and Turn -->
      <div class="flex justify-between gap-1.5">
        <!-- Timer - compact size -->
        <div class="flex-1 pointer-events-auto">
          <div
            class="resource-display compact"
            :class="timer.isExpired ? 'border-red-500' : timer.days < 7 ? 'border-yellow-500' : 'border-indigo-500'"
          >
            <span class="resource-icon">⏰</span>
            <div class="resource-info">
              <span class="resource-label">제국 정복 기한</span>
              <span v-if="!timer.isExpired" class="resource-value text-xs">
                {{ weeks }}주 {{ remainingDays }}일 {{ timer.hours }}:{{ String(timer.minutes).padStart(2, '0') }}
              </span>
              <span v-else class="resource-value text-xs text-red-400">종료!</span>
            </div>
          </div>
        </div>

        <!-- Turn Counter - compact size -->
        <div class="flex-1 pointer-events-auto">
          <div class="resource-display compact border-purple-500">
            <span class="resource-icon">🎯</span>
            <div class="resource-info">
              <span class="resource-label">남은 턴</span>
              <div class="flex items-center justify-between gap-2">
                <span
                  class="resource-value"
                  :class="turnData.currentTurns < 20 ? 'text-red-400' : 'text-purple-300'"
                >
                  {{ turnData.currentTurns }}/{{ turnData.maxTurns }}
                </span>
                <span v-if="turnData.timeUntilNext && turnData.currentTurns < turnData.maxTurns" class="text-[10px] text-slate-400">
                  {{ formatTimeUntilNext }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Row 2: Day and Reincarnation -->
      <div class="flex justify-between gap-1.5">
        <!-- Current Day -->
        <div class="flex-1 pointer-events-auto">
          <div class="resource-display compact border-blue-500">
            <span class="resource-icon">📅</span>
            <div class="resource-info">
              <span class="resource-label">게임 일차</span>
              <span class="resource-value">{{ currentDay }}일</span>
            </div>
          </div>
        </div>

        <!-- Reincarnation Count -->
        <div class="flex-1 pointer-events-auto">
          <div class="resource-display compact border-amber-500">
            <span class="resource-icon">♻️</span>
            <div class="resource-info">
              <span class="resource-label">환생</span>
              <span class="resource-value text-amber-300">{{ reincarnationCount }}회</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Invasion Warning -->
      <div v-if="invasionWarning" class="pointer-events-auto">
        <div
          class="resource-display compact text-center"
          :class="daysUntilInvasion <= 1 ? 'border-red-500 bg-red-900/30' : 'border-yellow-500 bg-yellow-900/20'"
        >
          <span class="resource-value text-xs w-full animate-pulse">
            {{ invasionWarning }}
          </span>
        </div>
      </div>

      <!-- Commandment Effects -->
      <div v-if="commandmentEffects && hasEffects" class="pointer-events-auto">
        <div class="resource-display compact border-indigo-500 bg-indigo-900/30">
          <span class="resource-icon">⚖️</span>
          <div class="resource-info w-full">
            <span class="resource-label">계명 효과 (매일)</span>
            <div class="flex flex-wrap gap-1 mt-1">
              <span v-if="commandmentEffects.morale !== 0" class="text-[9px] px-1.5 py-0.5 rounded" :class="commandmentEffects.morale > 0 ? 'bg-emerald-500/30 text-emerald-200' : 'bg-red-500/30 text-red-200'">
                민심 {{ commandmentEffects.morale > 0 ? '+' : '' }}{{ commandmentEffects.morale }}
              </span>
              <span v-if="commandmentEffects.gold !== 0" class="text-[9px] px-1.5 py-0.5 rounded" :class="commandmentEffects.gold > 0 ? 'bg-emerald-500/30 text-emerald-200' : 'bg-red-500/30 text-red-200'">
                금 {{ commandmentEffects.gold > 0 ? '+' : '' }}{{ commandmentEffects.gold }}
              </span>
              <span v-if="commandmentEffects.military !== 0" class="text-[9px] px-1.5 py-0.5 rounded" :class="commandmentEffects.military > 0 ? 'bg-emerald-500/30 text-emerald-200' : 'bg-red-500/30 text-red-200'">
                병력 {{ commandmentEffects.military > 0 ? '+' : '' }}{{ commandmentEffects.military }}
              </span>
              <span v-if="commandmentEffects.food !== 0" class="text-[9px] px-1.5 py-0.5 rounded" :class="commandmentEffects.food > 0 ? 'bg-emerald-500/30 text-emerald-200' : 'bg-red-500/30 text-red-200'">
                식량 {{ commandmentEffects.food > 0 ? '+' : '' }}{{ commandmentEffects.food }}
              </span>
              <span v-if="commandmentEffects.population !== 0" class="text-[9px] px-1.5 py-0.5 rounded" :class="commandmentEffects.population > 0 ? 'bg-emerald-500/30 text-emerald-200' : 'bg-red-500/30 text-red-200'">
                인구 {{ commandmentEffects.population > 0 ? '+' : '' }}{{ commandmentEffects.population }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Row 3: Food and Gold -->
      <div class="flex justify-between gap-1.5">
        <ResourceDisplay
          icon="🍖"
          label="식량"
          :value="resources.food"
          variant="compact"
        />
        <ResourceDisplay
          icon="💰"
          label="금"
          :value="resources.gold"
          variant="compact"
        />
      </div>

      <!-- Row 4: Soldiers and Morale -->
      <div class="flex justify-between gap-1.5">
        <ResourceDisplay
          icon="⚔️"
          label="병사"
          :value="resources.soldiers"
          variant="compact"
        />
        <ResourceDisplay
          icon="❤️"
          label="민심"
          :value="resources.morale"
          variant="compact"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ResourceDisplay from '~/components/game/ResourceDisplay.vue'
import type { Resources } from '~/composables/useGameResources'

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
  resources: Resources
  timer: TimerData
  turnData: TurnData
  currentDay: number
  reincarnationCount?: number
  commandmentEffects?: CommandmentEffects | null
}

const props = withDefaults(defineProps<Props>(), {
  reincarnationCount: 0,
  commandmentEffects: null
})

// 주와 남은 일 계산
const weeks = computed(() => Math.floor(props.timer.days / 7))
const remainingDays = computed(() => props.timer.days % 7)

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

// 다음 턴까지 남은 시간 포맷
const formatTimeUntilNext = computed(() => {
  if (!props.turnData.timeUntilNext) return ''
  const time = props.turnData.timeUntilNext

  if (time.hours > 0) {
    return `${time.hours}:${String(time.minutes).padStart(2, '0')}`
  } else if (time.minutes > 0) {
    return `${time.minutes}:${String(time.seconds).padStart(2, '0')}`
  } else {
    return `${time.seconds}초`
  }
})

// 계명 효과가 있는지 확인
const hasEffects = computed(() => {
  if (!props.commandmentEffects) return false
  const effects = props.commandmentEffects
  return effects.morale !== 0 || effects.gold !== 0 || effects.military !== 0 || effects.food !== 0 || effects.population !== 0
})
</script>

<style scoped>
/* Resource display styles to match ResourceDisplay component */
.resource-display {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 6px 12px;
  transition: all 0.3s;
}

.resource-display.compact {
  padding: 6px 12px;
  gap: 6px;
}

.resource-icon {
  font-size: 20px;
  filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.4));
}

.resource-info {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.resource-label {
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.resource-value {
  font-size: 14px;
  font-weight: 700;
  color: #e2e8f0;
  font-family: 'Cinzel', serif;
}

@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shine {
  animation: shine 2s infinite;
}
</style>
