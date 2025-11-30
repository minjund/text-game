<template>
  <div class="fixed bottom-0 left-1/2 -translate-x-1/2 bg-black/90 border-t border-gray-700 p-2 z-50 w-full max-w-md">
    <div class="grid grid-cols-3 gap-1.5">
      <!-- Commandments Button -->
      <button
        @click="$emit('show-commandments')"
        class="flex flex-col items-center justify-center bg-amber-700/80 border border-amber-600 rounded-lg p-1.5 active:bg-amber-600 transition-all"
      >
        <div class="text-xl mb-0.5">✨</div>
        <h3 class="text-[9px] font-bold">계명</h3>
      </button>

      <!-- Passive Cards Button -->
      <button
        @click="$emit('show-passive-cards')"
        class="flex flex-col items-center justify-center bg-purple-700/80 border border-purple-600 rounded-lg p-1.5 active:bg-purple-600 transition-all"
      >
        <div class="text-xl mb-0.5">🎴</div>
        <h3 class="text-[9px] font-bold">카드</h3>
      </button>

      <!-- Card Deck Button -->
      <button
        @click="$emit('show-card-deck')"
        class="flex flex-col items-center justify-center bg-orange-700/80 border border-orange-600 rounded-lg p-1.5 active:bg-orange-600 transition-all"
      >
        <div class="text-xl mb-0.5">🃏</div>
        <h3 class="text-[9px] font-bold">덱</h3>
      </button>

      <!-- Card Guide Button -->
      <button
        @click="$emit('show-card-guide')"
        class="flex flex-col items-center justify-center bg-indigo-700/80 border border-indigo-600 rounded-lg p-1.5 active:bg-indigo-600 transition-all"
      >
        <div class="text-xl mb-0.5">📚</div>
        <h3 class="text-[9px] font-bold">도감</h3>
      </button>

      <!-- Adventure Button -->
      <button
        @click="$emit('start-normal-battle')"
        class="flex flex-col items-center justify-center bg-green-700/80 border border-green-600 rounded-lg p-1.5 active:bg-green-600 transition-all"
      >
        <div class="text-lg mb-0.5">⚔️</div>
        <h3 class="text-[8px] font-bold">모험</h3>
      </button>

      <!-- Recruit Button -->
      <button
        @click="$emit('recruit-soldiers')"
        class="flex flex-col items-center justify-center bg-gray-700/80 border border-gray-600 rounded-lg p-1.5 active:bg-gray-600 transition-all"
      >
        <div class="text-xl mb-0.5">🛡️</div>
        <h3 class="text-[9px] font-bold">모집</h3>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  'show-generals': []
  'show-commandments': []
  'show-passive-cards': []
  'show-card-deck': []
  'show-card-guide': []
  'start-normal-battle': []
  'recruit-soldiers': []
}>()
</script>
