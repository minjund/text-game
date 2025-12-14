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

      <div class="flex items-center gap-4">
        <!-- Food -->
        <div class="flex items-center gap-2 bg-slate-800/60 backdrop-blur-sm border-2 border-green-500 rounded-lg px-4 py-2 relative group transition-all hover:shadow-lg hover:shadow-green-500/20">
          <span class="text-2xl">🍖</span>
          <div>
            <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">식량</p>
            <p class="text-lg font-bold text-slate-100">{{ resources.food }}</p>
          </div>
          <button
            @click="$emit('show-resource-help', 'food')"
            class="absolute -top-1 -right-1 w-5 h-5 bg-green-600 hover:bg-green-500 rounded-full text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            title="식량 도움말"
          >
            ?
          </button>
        </div>

        <!-- Gold -->
        <div class="flex items-center gap-2 bg-slate-800/60 backdrop-blur-sm border-2 border-yellow-500 rounded-lg px-4 py-2 relative group transition-all hover:shadow-lg hover:shadow-yellow-500/20">
          <span class="text-2xl">💰</span>
          <div>
            <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">금화</p>
            <p class="text-lg font-bold text-slate-100">{{ resources.gold }}</p>
          </div>
          <button
            @click="$emit('show-resource-help', 'gold')"
            class="absolute -top-1 -right-1 w-5 h-5 bg-yellow-600 hover:bg-yellow-500 rounded-full text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            title="금 도움말"
          >
            ?
          </button>
        </div>

        <!-- Soldiers -->
        <div class="flex items-center gap-2 bg-slate-800/60 backdrop-blur-sm border-2 border-red-500 rounded-lg px-4 py-2 relative group transition-all hover:shadow-lg hover:shadow-red-500/20">
          <span class="text-2xl">⚔️</span>
          <div>
            <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">병사</p>
            <p class="text-lg font-bold text-slate-100">{{ resources.soldiers }}</p>
          </div>
          <button
            @click="$emit('show-resource-help', 'soldiers')"
            class="absolute -top-1 -right-1 w-5 h-5 bg-red-600 hover:bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            title="병사 도움말"
          >
            ?
          </button>
        </div>

        <!-- Morale -->
        <div class="flex items-center gap-2 bg-slate-800/60 backdrop-blur-sm border-2 border-pink-500 rounded-lg px-4 py-2 relative group transition-all hover:shadow-lg hover:shadow-pink-500/20">
          <span class="text-2xl">❤️</span>
          <div>
            <p class="text-xs text-slate-400 font-semibold uppercase tracking-wider">민심</p>
            <p class="text-lg font-bold text-slate-100">{{ resources.morale }}</p>
          </div>
          <button
            @click="$emit('show-resource-help', 'morale')"
            class="absolute -top-1 -right-1 w-5 h-5 bg-pink-600 hover:bg-pink-500 rounded-full text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            title="민심 도움말"
          >
            ?
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Resources } from '~/composables/useGameResources'

type ResourceType = 'food' | 'gold' | 'morale' | 'soldiers'

interface Props {
  kingdomName: string
  day: number
  resources: Resources
}

defineProps<Props>()

defineEmits<{
  'show-resource-help': [type: ResourceType]
}>()
</script>
