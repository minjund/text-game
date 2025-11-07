<template>
  <Transition name="modal">
    <div v-if="battle" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-red-600 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden" @click.stop>
        <!-- Header -->
        <div class="bg-gradient-to-r from-red-900 to-red-800 border-b-2 border-red-600 p-4">
          <h2 class="text-xl font-bold mb-2 flex items-center gap-2">
            <span>⚔️</span> 전장의 기록
          </h2>
          <div class="flex items-center justify-center gap-4 text-sm">
            <span class="font-bold text-blue-300">{{ battle.attacker.kingdomName }}</span>
            <span class="text-slate-400">VS</span>
            <span class="font-bold text-red-300">{{ battle.defender.kingdomName }}</span>
          </div>
        </div>

        <!-- Battle Log -->
        <div ref="battleLogContainer" class="p-6 overflow-y-auto max-h-[calc(90vh-200px)] bg-parchment-100">
          <div :class="{ 'opacity-50': isScrolling }">
            <div class="prose prose-invert max-w-none">
              <p v-for="(log, index) in battle.log" :key="index"
                 class="mb-3"
                 :class="{
                   'text-slate-300': log.narrativeType === 'narration',
                   'text-amber-200 font-semibold': log.narrativeType === 'action',
                   'text-cyan-300 italic': log.narrativeType === 'dialogue'
                 }">
                <span v-if="log.narrativeType === 'narration'">{{ log.story }}</span>
                <span v-else-if="log.narrativeType === 'action'">{{ log.story }}</span>
                <span v-else-if="log.narrativeType === 'dialogue'">"{{ log.dialogue }}"</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Footer with Result -->
        <div v-if="battle.result" class="border-t-2 border-slate-600 p-4">
          <div class="text-center mb-4">
            <h3 class="text-2xl font-bold mb-2"
                :class="battle.result === 'victory' ? 'text-green-400' : 'text-red-400'">
              {{ battle.result === 'victory' ? '🎉 승리!' : '😢 패배...' }}
            </h3>
            <p v-if="battle.result === 'victory'" class="text-slate-300">
              전리품: 금 +500, 식량 +300
            </p>
          </div>
          <button @click="$emit('close')"
                  class="w-full bg-slate-700 hover:bg-slate-600 border border-slate-500 rounded-lg py-3 font-bold transition-colors">
            전장을 떠난다
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Battle } from '~/types/game'

interface Props {
  battle: Battle | null
  isScrolling: boolean
}

defineProps<Props>()

defineEmits<{
  close: []
}>()
</script>
