<template>
  <header class="hidden md:flex bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 px-8 py-4">
    <div class="max-w-7xl mx-auto w-full flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="text-4xl">👑</div>
        <div>
          <h1 class="text-2xl font-bold text-amber-100">{{ kingdomName }}</h1>
          <p class="text-sm text-slate-400">제 {{ day }}일 통치</p>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2">
          <span class="text-2xl">🍖</span>
          <div>
            <p class="text-xs text-slate-400">식량</p>
            <p class="text-lg font-bold">{{ resources.food }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2">
          <span class="text-2xl">💰</span>
          <div>
            <p class="text-xs text-slate-400">금화</p>
            <p class="text-lg font-bold">{{ resources.gold }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2">
          <span class="text-2xl">⚔️</span>
          <div>
            <p class="text-xs text-slate-400">병사</p>
            <p class="text-lg font-bold">{{ resources.soldiers }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2">
          <span class="text-2xl">❤️</span>
          <div>
            <p class="text-xs text-slate-400">사기</p>
            <p class="text-lg font-bold">{{ resources.morale }}</p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Resources } from '~/composables/useGameResources'

interface Props {
  kingdomName: string
  day: number
  resources: Resources
}

defineProps<Props>()
</script>
