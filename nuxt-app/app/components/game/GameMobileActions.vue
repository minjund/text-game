<template>
  <!-- Adventure Button - Floating above bottom bar -->
  <button
    @click="$emit('start-normal-battle')"
    class="fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-center bg-transparent rounded-lg active:opacity-70 transition-all h-[72px] w-[72px]"
    :style="{ bottom: 'calc(var(--bottom-bar-height, 72px) + 10px)' }"
  >
    <img
      :src="`${useRuntimeConfig().app.baseURL}images/button/adventure.png`"
      alt="모험"
      class="w-full h-full object-contain"
    />
  </button>

  <div
    class="fixed bottom-0 left-1/2 -translate-x-1/2 border-t border-gray-700 p-1 z-50 w-full max-w-md bg-cover bg-center bg-no-repeat relative"
    :style="{ backgroundImage: `url(${useRuntimeConfig().app.baseURL}images/background/under_back_ground.png)` }"
  >
    <!-- Overlay for better button visibility -->
    <div class="absolute inset-0 bg-black/60"></div>
    <div class="grid grid-cols-5 gap-1 relative z-10">
      <!-- Battle History Button -->
      <button
        @click="$emit('show-battle-history')"
        class="flex items-center justify-center bg-transparent rounded-lg active:opacity-70 transition-all h-16"
      >
        <img
          :src="`${useRuntimeConfig().app.baseURL}images/button/record.png`"
          alt="전쟁 기록"
          class="w-full h-full object-contain"
        />
      </button>

      <!-- Passive Cards Button -->
      <button
        @click="$emit('show-passive-cards')"
        class="flex items-center justify-center bg-transparent rounded-lg active:opacity-70 transition-all h-16"
      >
        <img
          :src="`${useRuntimeConfig().app.baseURL}images/button/card.png`"
          alt="카드"
          class="w-full h-full object-contain"
        />
      </button>

      <!-- Card Deck Button -->
      <button
        @click="$emit('show-card-deck')"
        class="flex items-center justify-center bg-transparent rounded-lg active:opacity-70 transition-all h-16"
      >
        <img
          :src="`${useRuntimeConfig().app.baseURL}images/button/deck.png`"
          alt="덱"
          class="w-full h-full object-contain"
        />
      </button>

      <!-- Card Guide Button -->
      <button
        @click="$emit('show-card-guide')"
        class="flex items-center justify-center bg-transparent rounded-lg active:opacity-70 transition-all h-16"
      >
        <img
          :src="`${useRuntimeConfig().app.baseURL}images/button/encyclopedia.png`"
          alt="도감"
          class="w-full h-full object-contain"
        />
      </button>

      <!-- Recruit Button -->
      <button
        @click="$emit('recruit-soldiers')"
        class="flex items-center justify-center bg-transparent rounded-lg active:opacity-70 transition-all h-16"
      >
        <img
          :src="`${useRuntimeConfig().app.baseURL}images/button/recruitment.png`"
          alt="모집"
          class="w-full h-full object-contain"
        />
      </button>
    </div>
    </div>
</template>

<script setup lang="ts">
defineEmits<{
  'show-generals': []
  'show-battle-history': []
  'show-passive-cards': []
  'show-card-deck': []
  'show-card-guide': []
  'start-normal-battle': []
  'recruit-soldiers': []
}>()
</script>
