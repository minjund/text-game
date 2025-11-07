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
              <span
                class="resource-value"
                :class="turnData.currentTurns < 20 ? 'text-red-400' : 'text-purple-300'"
              >
                {{ turnData.currentTurns }}/{{ turnData.maxTurns }}
              </span>
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

      <!-- Row 2: Food and Gold -->
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

      <!-- Row 3: Soldiers and Morale -->
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

interface Props {
  resources: Resources
  timer: TimerData
  turnData: TurnData
  currentDay: number
}

const props = defineProps<Props>()

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
