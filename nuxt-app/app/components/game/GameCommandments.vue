<template>
  <div
    v-if="commandments.length > 0"
    class="bg-amber-900/20 border-2 border-amber-600/50 rounded-xl p-4"
  >
    <h3 class="text-base font-bold text-amber-200 mb-3 flex items-center gap-2">
      <span>✨</span> 신의 계명
    </h3>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="commandment in commandments"
        :key="commandment.id"
        class="flex items-center gap-1 bg-amber-950/50 px-3 py-1 rounded-lg text-sm"
        :title="commandment.description"
      >
        <span>{{ commandment.icon }}</span>
        <span class="text-amber-100">{{ commandment.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Commandment {
  id: string
  icon: string
  name: string
  description: string
}

interface Props {
  commandments: Commandment[]
}

defineProps<Props>()
</script>
