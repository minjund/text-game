<template>
  <Transition name="modal">
    <div v-if="crossroad" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click="$emit('close')">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-indigo-600 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden" @click.stop>
        <!-- Header -->
        <div class="bg-gradient-to-r from-indigo-900 to-indigo-800 border-b-2 border-indigo-600 p-4">
          <h2 class="text-xl font-bold">{{ crossroad.title }}</h2>
          <p class="text-sm text-indigo-200">왕국의 운명을 결정할 선택의 순간</p>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <p class="text-slate-300 mb-6">{{ crossroad.description }}</p>

          <!-- Choices -->
          <div class="space-y-3">
            <button v-for="(choice, index) in crossroad.choices" :key="index"
                    @click="$emit('select-choice', choice)"
                    class="w-full bg-slate-700/50 hover:bg-slate-600/50 border-2 border-slate-600 hover:border-indigo-500 rounded-lg p-4 text-left transition-all">

              <div class="font-semibold text-lg mb-1">{{ choice.text }}</div>
              <div class="text-sm text-slate-400 mb-3">{{ choice.description }}</div>

              <!-- Permanent Effect -->
              <div class="bg-emerald-900/30 border border-emerald-600/50 rounded p-3">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-lg">✨</span>
                  <span class="font-bold text-emerald-200">{{ choice.effect.name }}</span>
                </div>
                <div class="text-sm text-emerald-100">{{ choice.effect.description }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { CrossroadCard, CrossroadChoice } from '~/types/game'

interface Props {
  crossroad: CrossroadCard | null
}

defineProps<Props>()

defineEmits<{
  close: []
  'select-choice': [choice: CrossroadChoice]
}>()
</script>
