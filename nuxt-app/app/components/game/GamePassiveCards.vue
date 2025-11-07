<template>
  <div
    v-if="passiveCards.length > 0"
    class="bg-purple-900/20 border-2 border-purple-600/50 rounded-xl p-4"
  >
    <h3 class="text-base font-bold text-purple-200 mb-3 flex items-center gap-2">
      <span>🎴</span> 보유한 패시브 카드
    </h3>
    <div class="space-y-2">
      <div
        v-for="(card, index) in passiveCards"
        :key="index"
        class="flex items-center gap-2 p-2 rounded-lg"
        :class="getRarityClass(card.rarity)"
      >
        <span class="text-xl">{{ card.icon }}</span>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold truncate">{{ card.name }}</p>
          <p class="text-xs text-slate-400 truncate">{{ card.trigger }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PassiveCard {
  icon: string
  name: string
  trigger: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface Props {
  passiveCards: PassiveCard[]
}

defineProps<Props>()

const getRarityClass = (rarity: string) => {
  const classMap: Record<string, string> = {
    common: 'bg-gray-700/50',
    rare: 'bg-blue-900/30',
    epic: 'bg-purple-900/30',
    legendary: 'bg-orange-900/30'
  }
  return classMap[rarity] || 'bg-gray-700/50'
}
</script>
