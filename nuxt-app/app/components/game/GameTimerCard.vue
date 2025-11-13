<template>
  <div
    class="bg-gradient-to-br from-indigo-900/50 to-slate-800/50 border-2 rounded-xl p-4"
    :class="borderClass"
  >
    <div class="flex items-center gap-2 mb-3">
      <span class="text-2xl">⏰</span>
      <span class="text-base font-semibold">제국 정복 기한</span>
    </div>
    <div v-if="!isExpired" class="flex justify-center gap-4 text-center">
      <div class="flex flex-col">
        <span class="text-3xl font-bold">{{ days }}</span>
        <span class="text-sm text-slate-400">일 남음</span>
      </div>
    </div>
    <div v-else class="text-center text-red-400 font-bold text-xl">시간 종료!</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

const props = defineProps<Props>()

const borderClass = computed(() => {
  if (props.isExpired) return 'border-red-500'
  if (props.days < 7) return 'border-yellow-500'  // 1주 미만이면 경고
  return 'border-indigo-500'
})
</script>
