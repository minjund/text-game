<template>
  <div class="fixed top-0 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-1.5 pointer-events-none w-full max-w-md">
    <!-- Header Background -->
    <div
      class="backdrop-blur-md border-b border-gray-700 px-2 py-2 bg-cover bg-center bg-no-repeat relative min-h-[120px]"
      :style="{ backgroundImage: `url(${useRuntimeConfig().app.baseURL}images/background/header_back_ground.png)` }"
    >
    <!-- Overlay for better text visibility -->
    <div class="absolute inset-0 bg-black/60"></div>
    <!-- All resources in grid layout -->
    <div class="flex flex-col gap-1.5 relative z-10">
      <!-- Row 1: All Resources (Food, Gold, Soldiers, Morale) -->
      <div class="grid grid-cols-4 gap-1 pointer-events-auto">
        <!-- Food -->
        <div class="resource-display compact border-green-500">
          <span class="resource-icon">🍖</span>
          <div class="resource-info">
            <span class="resource-label">식량</span>
            <span class="resource-value">{{ resources.food }}</span>
          </div>
        </div>

        <!-- Gold -->
        <div class="resource-display compact border-yellow-500">
          <span class="resource-icon">💰</span>
          <div class="resource-info">
            <span class="resource-label">금</span>
            <span class="resource-value">{{ resources.gold }}</span>
          </div>
        </div>

        <!-- Soldiers -->
        <div class="resource-display compact border-red-500">
          <span class="resource-icon">⚔️</span>
          <div class="resource-info">
            <span class="resource-label">병사</span>
            <span class="resource-value">{{ resources.soldiers }}</span>
          </div>
        </div>

        <!-- Morale -->
        <div class="resource-display compact border-pink-500">
          <span class="resource-icon">❤️</span>
          <div class="resource-info">
            <span class="resource-label">민심</span>
            <span class="resource-value">{{ resources.morale }}</span>
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
        <div class="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-2 border-indigo-400 rounded-lg p-2 sm:p-2.5 backdrop-blur-sm shadow-lg">
          <div class="flex items-center gap-2 mb-1.5">
            <span class="text-xl sm:text-2xl">⚖️</span>
            <span class="text-xs sm:text-sm font-bold text-indigo-200">신의 계명 효과 (매일 적용)</span>
          </div>
          <div class="flex flex-wrap gap-1.5 sm:gap-2">
            <span v-if="commandmentEffects.morale !== 0" class="text-[10px] sm:text-xs px-2 py-1 rounded-md font-semibold border" :class="commandmentEffects.morale > 0 ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400' : 'bg-red-500/30 text-red-200 border-red-400'">
              😊 민심 {{ commandmentEffects.morale > 0 ? '+' : '' }}{{ commandmentEffects.morale }}
            </span>
            <span v-if="commandmentEffects.gold !== 0" class="text-[10px] sm:text-xs px-2 py-1 rounded-md font-semibold border" :class="commandmentEffects.gold > 0 ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400' : 'bg-red-500/30 text-red-200 border-red-400'">
              💰 금 {{ commandmentEffects.gold > 0 ? '+' : '' }}{{ commandmentEffects.gold }}
            </span>
            <span v-if="commandmentEffects.military !== 0" class="text-[10px] sm:text-xs px-2 py-1 rounded-md font-semibold border" :class="commandmentEffects.military > 0 ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400' : 'bg-red-500/30 text-red-200 border-red-400'">
              ⚔️ 병력 {{ commandmentEffects.military > 0 ? '+' : '' }}{{ commandmentEffects.military }}
            </span>
            <span v-if="commandmentEffects.food !== 0" class="text-[10px] sm:text-xs px-2 py-1 rounded-md font-semibold border" :class="commandmentEffects.food > 0 ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400' : 'bg-red-500/30 text-red-200 border-red-400'">
              🍖 식량 {{ commandmentEffects.food > 0 ? '+' : '' }}{{ commandmentEffects.food }}
            </span>
            <span v-if="commandmentEffects.population !== 0" class="text-[10px] sm:text-xs px-2 py-1 rounded-md font-semibold border" :class="commandmentEffects.population > 0 ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400' : 'bg-red-500/30 text-red-200 border-red-400'">
              👥 인구 {{ commandmentEffects.population > 0 ? '+' : '' }}{{ commandmentEffects.population }}
            </span>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Resources } from '~/composables/useGameResources'

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
  resources: Resources
  timer: TimerData
  currentDay: number
  reincarnationCount?: number
  commandmentEffects?: CommandmentEffects | null
}

const props = withDefaults(defineProps<Props>(), {
  reincarnationCount: 0,
  commandmentEffects: null
})

type ResourceType = 'food' | 'gold' | 'morale' | 'soldiers'

defineEmits<{
  'show-resource-help': [type: ResourceType]
}>()


// 다음 제국 침략까지 남은 일수 계산
const daysUntilInvasion = computed(() => {
  if (props.currentDay >= 12) return 0 // 12일 이후에는 침략 없음 (세계 멸망)
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
