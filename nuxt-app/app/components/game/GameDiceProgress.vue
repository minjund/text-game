<template>
  <div v-if="show" class="fixed top-2 left-1/2 transform -translate-x-1/2 z-[10000]">
    <div class="bg-black/90 border-2 border-yellow-500 rounded-lg px-3 py-2 shadow-xl">
      <div class="flex gap-2 items-center">
        <span class="text-xs text-yellow-300 font-bold">룰렛:</span>
        <div class="flex gap-1">
          <div
            v-for="(result, index) in diceResults"
            :key="index"
            :class="[
              'w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-300',
              index < currentIndex ? 'bg-gray-700 opacity-40 line-through' :
              index === currentIndex ? 'bg-gradient-to-br from-green-400 to-emerald-500 scale-110 animate-pulse shadow-md shadow-green-500/50' :
              'bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm'
            ]"
          >
            {{ result }}
          </div>
        </div>
        <span class="text-xs text-gray-400">{{ currentIndex + 1 }}/5</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  diceResults: number[]
  currentIndex: number
}

const props = defineProps<Props>()
</script>
