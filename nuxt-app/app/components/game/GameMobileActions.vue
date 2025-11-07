<template>
  <div class="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 border-t border-gray-700 p-2 z-50">
    <div class="grid grid-cols-4 gap-2">
      <!-- Generals Button -->
      <button
        @click="$emit('show-generals')"
        class="flex flex-col items-center justify-center bg-gray-700/80 border border-gray-600 rounded-lg p-1.5 active:bg-gray-600 transition-all"
      >
        <div class="text-xl mb-0.5">👥</div>
        <h3 class="text-[9px] font-bold">장수</h3>
      </button>

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

      <!-- Card Guide Button -->
      <button
        @click="$emit('show-card-guide')"
        class="flex flex-col items-center justify-center bg-indigo-700/80 border border-indigo-600 rounded-lg p-1.5 active:bg-indigo-600 transition-all"
      >
        <div class="text-xl mb-0.5">📚</div>
        <h3 class="text-[9px] font-bold">도감</h3>
      </button>

      <!-- Battle Button -->
      <button
        @click="$emit('start-battle')"
        class="flex flex-col items-center justify-center bg-gray-700/80 border border-gray-600 rounded-lg p-1.5 active:bg-gray-600 transition-all"
      >
        <div class="text-xl mb-0.5">⚔️</div>
        <h3 class="text-[9px] font-bold">전투</h3>
      </button>

      <!-- Next Day Button -->
      <button
        @click="$emit('next-day')"
        class="flex flex-col items-center justify-center bg-blue-700/80 border border-blue-600 rounded-lg p-1.5 active:bg-blue-600 transition-all"
      >
        <div class="text-xl mb-0.5">📅</div>
        <h3 class="text-[9px] font-bold">다음날</h3>
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
  'show-card-guide': []
  'start-battle': []
  'next-day': []
  'recruit-soldiers': []
}>()
</script>
