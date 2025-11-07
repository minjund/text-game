<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80" @click.self="$emit('close')">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-600/50 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b-2 border-purple-600/30 bg-purple-900/20">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🎴</span>
            <div>
              <h2 class="text-xl font-bold text-purple-200">패시브 카드 컬렉션</h2>
              <p class="text-xs text-slate-400">보유 중인 패시브 카드 목록</p>
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
          <div v-if="passiveCards.length === 0" class="text-center py-12 text-slate-500">
            <div class="text-6xl mb-4">🎴</div>
            <p class="text-lg">보유한 패시브 카드가 없습니다</p>
            <p class="text-sm mt-2">이벤트를 진행하여 패시브 카드를 획득하세요!</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="(card, index) in passiveCards"
              :key="index"
              class="border-2 rounded-lg p-4 transition-all hover:scale-105"
              :class="getCardClass(card.rarity)"
            >
              <div class="flex items-start gap-3">
                <div class="text-4xl">{{ card.icon }}</div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-lg font-bold">{{ card.name }}</h3>
                    <span
                      class="text-xs px-2 py-0.5 rounded-full font-bold"
                      :class="getRarityBadgeClass(card.rarity)"
                    >
                      {{ getRarityLabel(card.rarity) }}
                    </span>
                  </div>
                  <p class="text-sm text-slate-300 mb-2">{{ card.description }}</p>
                  <div class="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                    <span class="font-semibold">발동:</span> {{ card.trigger }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t-2 border-purple-600/30 bg-purple-900/20">
          <div class="flex justify-between items-center text-sm text-slate-400">
            <span>총 {{ passiveCards.length }}개의 패시브 카드</span>
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
interface PassiveCard {
  icon: string
  name: string
  description: string
  trigger: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface Props {
  show: boolean
  passiveCards: PassiveCard[]
}

defineProps<Props>()
defineEmits<{
  'close': []
}>()

const getCardClass = (rarity: string) => {
  const classMap: Record<string, string> = {
    common: 'bg-gray-800/50 border-gray-600 hover:border-gray-500',
    rare: 'bg-blue-900/30 border-blue-600 hover:border-blue-500',
    epic: 'bg-purple-900/30 border-purple-600 hover:border-purple-500',
    legendary: 'bg-orange-900/30 border-orange-600 hover:border-orange-500'
  }
  return classMap[rarity] || classMap.common
}

const getRarityBadgeClass = (rarity: string) => {
  const classMap: Record<string, string> = {
    common: 'bg-gray-600 text-gray-200',
    rare: 'bg-blue-600 text-blue-100',
    epic: 'bg-purple-600 text-purple-100',
    legendary: 'bg-orange-600 text-orange-100'
  }
  return classMap[rarity] || classMap.common
}

const getRarityLabel = (rarity: string) => {
  const labelMap: Record<string, string> = {
    common: '일반',
    rare: '희귀',
    epic: '영웅',
    legendary: '전설'
  }
  return labelMap[rarity] || '일반'
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
</style>
