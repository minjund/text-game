<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80" @click.self="$emit('close')">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-600/50 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b-2 border-amber-600/30 bg-amber-900/20">
          <div class="flex items-center gap-3">
            <span class="text-3xl">✨</span>
            <div>
              <h2 class="text-xl font-bold text-amber-200">신의 계명</h2>
              <p class="text-xs text-slate-400">당신의 왕국에 내려진 신성한 계명</p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="text-slate-400 hover:text-white text-2xl px-2"
          >
            ✕
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="commandments.length === 0" class="text-center py-12 text-slate-500">
            <div class="text-6xl mb-4">✨</div>
            <p class="text-lg">선택된 신의 계명이 없습니다</p>
            <p class="text-sm mt-2">신 모드에서 계명을 선택하세요!</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="commandment in commandments"
              :key="commandment.id"
              class="border-2 border-amber-600/50 bg-amber-900/20 rounded-lg overflow-hidden transition-all"
              :class="{ 'bg-amber-900/30': expandedCommandments[commandment.id] }"
            >
              <!-- Header - Always Visible -->
              <div
                @click="toggleExpand(commandment.id)"
                class="flex items-center gap-3 p-3 cursor-pointer hover:bg-amber-900/30 transition-colors"
              >
                <div class="text-3xl">{{ commandment.icon }}</div>
                <h3 class="text-base font-bold text-amber-200 flex-1">{{ commandment.name }}</h3>
                <span class="text-amber-300 text-sm transition-transform" :class="{ 'rotate-180': expandedCommandments[commandment.id] }">
                  ▼
                </span>
              </div>

              <!-- Collapsed View - Brief -->
              <div v-if="!expandedCommandments[commandment.id]" class="px-3 pb-3">
                <p class="text-xs text-amber-100/70">{{ commandment.description.slice(0, 50) }}...</p>
              </div>

              <!-- Expanded View - Full Details -->
              <div v-else class="px-3 pb-3 space-y-3 animate-slideDown">
                <p class="text-sm text-amber-100/90 leading-relaxed">{{ commandment.description }}</p>

                <!-- Effects -->
                <div class="flex flex-wrap gap-2 pt-2 border-t border-amber-600/30">
                  <div v-if="commandment.effects.morale !== 0" class="stat-badge" :class="commandment.effects.morale > 0 ? 'positive' : 'negative'">
                    민심: {{ commandment.effects.morale > 0 ? '+' : '' }}{{ commandment.effects.morale }}
                  </div>
                  <div v-if="commandment.effects.gold !== 0" class="stat-badge" :class="commandment.effects.gold > 0 ? 'positive' : 'negative'">
                    금: {{ commandment.effects.gold > 0 ? '+' : '' }}{{ commandment.effects.gold }}
                  </div>
                  <div v-if="commandment.effects.military !== 0" class="stat-badge" :class="commandment.effects.military > 0 ? 'positive' : 'negative'">
                    군사: {{ commandment.effects.military > 0 ? '+' : '' }}{{ commandment.effects.military }}
                  </div>
                  <div v-if="commandment.effects.food !== 0" class="stat-badge" :class="commandment.effects.food > 0 ? 'positive' : 'negative'">
                    식량: {{ commandment.effects.food > 0 ? '+' : '' }}{{ commandment.effects.food }}
                  </div>
                  <div v-if="commandment.effects.population !== 0" class="stat-badge" :class="commandment.effects.population > 0 ? 'positive' : 'negative'">
                    인구: {{ commandment.effects.population > 0 ? '+' : '' }}{{ commandment.effects.population }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t-2 border-amber-600/30 bg-amber-900/20">
          <div class="flex justify-between items-center text-sm text-slate-400">
            <span>총 {{ commandments.length }}개의 신성한 계명</span>
            <button
              @click="$emit('close')"
              class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-white transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Commandment {
  id: string
  icon: string
  name: string
  description: string
  pros: string[]
  cons: string[]
  effects: {
    morale: number
    gold: number
    military: number
    food: number
    population: number
  }
}

interface Props {
  show: boolean
  commandments: Commandment[]
}

defineProps<Props>()
defineEmits<{
  'close': []
}>()

// 확장 상태 관리
const expandedCommandments = ref<Record<string, boolean>>({})

// 토글 함수
const toggleExpand = (commandmentId: string) => {
  expandedCommandments.value[commandmentId] = !expandedCommandments.value[commandmentId]
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-gradient-to-br,
.modal-leave-active .bg-gradient-to-br {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-gradient-to-br,
.modal-leave-to .bg-gradient-to-br {
  transform: scale(0.9);
}

.animate-slideDown {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-badge {
  padding: 3px 10px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 600;
}

.stat-badge.positive {
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.stat-badge.negative {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
</style>
