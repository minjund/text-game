<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm"
         @click.self="$emit('close')">
      <div class="bg-slate-900/95 rounded-xl sm:rounded-2xl border-2 border-purple-500/50 shadow-2xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-3 sm:p-4 md:p-6 border-b-2 border-purple-500/30">
          <div class="flex items-center justify-between">
            <h2 class="text-lg sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              📚 시너지 카드 도감
            </h2>
            <button @click="$emit('close')" class="text-slate-400 hover:text-white text-2xl sm:text-3xl">
              ×
            </button>
          </div>
          <p class="text-xs sm:text-sm md:text-base text-slate-300 mt-1 sm:mt-2">
            25일마다 획득할 수 있는 모든 카드와 시너지 효과를 확인하세요
          </p>
        </div>

        <!-- Content -->
        <div class="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-160px)] md:max-h-[calc(90vh-180px)]">
          <!-- 시너지 효과 설명 -->
          <div class="mb-4 sm:mb-6 md:mb-8 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg sm:rounded-xl border-2 border-purple-500/30 p-3 sm:p-4 md:p-6">
            <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-purple-400 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
              <span class="text-xl sm:text-2xl">✨</span>
              <span>시너지 시스템</span>
            </h3>
            <div class="space-y-2 sm:space-y-3 text-slate-300 text-xs sm:text-sm md:text-base">
              <p>• 같은 태그의 카드를 여러 개 모으면 <span class="text-purple-400 font-bold">강력한 시너지 효과</span>가 발동됩니다!</p>
              <p>• <span class="text-yellow-400 font-bold">무역/군사</span>: 3개 모으면 시너지 발동</p>
              <p>• <span class="text-green-400 font-bold">농업/문화</span>: 2개 모으면 시너지 발동</p>
              <p>• 시너지가 발동되면 카드 효과에 <span class="text-blue-400 font-bold">추가 보너스</span>가 적용됩니다</p>
            </div>
          </div>

          <!-- 무역 카드 (3개 시너지) -->
          <div class="mb-4 sm:mb-6 md:mb-8">
            <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">💰 무역 카드</h3>
              <span class="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold bg-yellow-600 text-yellow-100">
                3개 시너지
              </span>
            </div>

            <!-- 시너지 효과 -->
            <div class="mb-3 sm:mb-4 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-lg sm:rounded-xl border-2 border-yellow-500/30 p-3 sm:p-4">
              <div class="flex items-start gap-2 sm:gap-3 md:gap-4">
                <div class="text-3xl sm:text-4xl md:text-5xl">👑</div>
                <div class="flex-1">
                  <h4 class="text-base sm:text-lg md:text-xl font-bold text-yellow-300 mb-1 sm:mb-2">무역 제국 (3개 시너지)</h4>
                  <p class="text-xs sm:text-sm text-slate-300 mb-2 sm:mb-3">무역 카드 3개를 모으면 발동</p>
                  <div class="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                    <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <span class="text-yellow-400">💰</span>
                      <span class="text-white font-bold">금 +300</span>
                    </div>
                    <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <span class="text-pink-400">❤️</span>
                      <span class="text-white font-bold">민심 +3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 카드 목록 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              <div v-for="card in tradeCards" :key="card.id"
                   class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg sm:rounded-xl border-2 border-yellow-600/50 p-3 sm:p-4">
                <div class="text-3xl sm:text-4xl text-center mb-2 sm:mb-3">{{ card.icon }}</div>
                <h4 class="text-sm sm:text-base md:text-lg font-bold text-center mb-1 sm:mb-2 text-yellow-300">{{ card.name }}</h4>
                <p class="text-[10px] sm:text-xs text-center text-slate-300 mb-2 sm:mb-3 line-clamp-2">{{ card.description }}</p>
                <div class="space-y-1 bg-slate-800/50 rounded-lg p-2 sm:p-3">
                  <div v-if="card.effect.gold" class="flex items-center justify-between text-xs sm:text-sm">
                    <span class="text-yellow-400">💰</span>
                    <span class="text-white font-bold">+{{ card.effect.gold }}</span>
                  </div>
                  <div v-if="card.effect.food" class="flex items-center justify-between text-xs sm:text-sm">
                    <span class="text-green-400">🌾</span>
                    <span class="text-white font-bold">+{{ card.effect.food }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 군사 카드 (3개 시너지) -->
          <div class="mb-4 sm:mb-6 md:mb-8">
            <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-red-400">⚔️ 군사 카드</h3>
              <span class="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold bg-red-600 text-red-100">
                3개 시너지
              </span>
            </div>

            <!-- 시너지 효과 -->
            <div class="mb-3 sm:mb-4 bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-lg sm:rounded-xl border-2 border-red-500/30 p-3 sm:p-4">
              <div class="flex items-start gap-2 sm:gap-3 md:gap-4">
                <div class="text-3xl sm:text-4xl md:text-5xl">🏆</div>
                <div class="flex-1">
                  <h4 class="text-base sm:text-lg md:text-xl font-bold text-red-300 mb-1 sm:mb-2">무적의 군단 (3개 시너지)</h4>
                  <p class="text-xs sm:text-sm text-slate-300 mb-2 sm:mb-3">군사 카드 3개를 모으면 발동</p>
                  <div class="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                    <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <span class="text-orange-400">🗡️</span>
                      <span class="text-white font-bold">공격력 +25%</span>
                    </div>
                    <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <span class="text-blue-400">🛡️</span>
                      <span class="text-white font-bold">방어력 +15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 카드 목록 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              <div v-for="card in militaryCards" :key="card.id"
                   class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg sm:rounded-xl border-2 border-red-600/50 p-3 sm:p-4">
                <div class="text-3xl sm:text-4xl text-center mb-2 sm:mb-3">{{ card.icon }}</div>
                <h4 class="text-sm sm:text-base md:text-lg font-bold text-center mb-1 sm:mb-2 text-red-300">{{ card.name }}</h4>
                <p class="text-[10px] sm:text-xs text-center text-slate-300 mb-2 sm:mb-3 line-clamp-2">{{ card.description }}</p>
                <div class="space-y-1 bg-slate-800/50 rounded-lg p-2 sm:p-3">
                  <div v-if="card.effect.military" class="flex items-center justify-between text-xs sm:text-sm">
                    <span class="text-red-400">⚔️</span>
                    <span class="text-white font-bold">+{{ card.effect.military }}</span>
                  </div>
                  <div v-if="card.effect.attackBonus" class="flex items-center justify-between text-xs sm:text-sm">
                    <span class="text-orange-400">🗡️</span>
                    <span class="text-white font-bold">+{{ card.effect.attackBonus }}%</span>
                  </div>
                  <div v-if="card.effect.defenseBonus" class="flex items-center justify-between text-xs sm:text-sm">
                    <span class="text-blue-400">🛡️</span>
                    <span class="text-white font-bold">+{{ card.effect.defenseBonus }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 농업 카드 (2개 시너지) -->
          <div class="mb-4 sm:mb-6 md:mb-8">
            <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-green-400">🌾 농업 카드</h3>
              <span class="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold bg-green-600 text-green-100">
                2개 시너지
              </span>
            </div>

            <!-- 시너지 효과 -->
            <div class="mb-3 sm:mb-4 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg sm:rounded-xl border-2 border-green-500/30 p-3 sm:p-4">
              <div class="flex items-start gap-2 sm:gap-3 md:gap-4">
                <div class="text-3xl sm:text-4xl md:text-5xl">🌾</div>
                <div class="flex-1">
                  <h4 class="text-base sm:text-lg md:text-xl font-bold text-green-300 mb-1 sm:mb-2">풍년의 축복 (2개 시너지)</h4>
                  <p class="text-xs sm:text-sm text-slate-300 mb-2 sm:mb-3">농업 카드 2개를 모으면 발동</p>
                  <div class="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                    <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <span class="text-green-400">🌾</span>
                      <span class="text-white font-bold">식량 +200</span>
                    </div>
                    <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <span class="text-yellow-400">💰</span>
                      <span class="text-white font-bold">금 +100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 카드 목록 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              <div v-for="card in agricultureCards" :key="card.id"
                   class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg sm:rounded-xl border-2 border-green-600/50 p-3 sm:p-4">
                <div class="text-3xl sm:text-4xl text-center mb-2 sm:mb-3">{{ card.icon }}</div>
                <h4 class="text-sm sm:text-base md:text-lg font-bold text-center mb-1 sm:mb-2 text-green-300">{{ card.name }}</h4>
                <p class="text-[10px] sm:text-xs text-center text-slate-300 mb-2 sm:mb-3 line-clamp-2">{{ card.description }}</p>
                <div class="space-y-1 bg-slate-800/50 rounded-lg p-2 sm:p-3">
                  <div v-if="card.effect.food" class="flex items-center justify-between text-xs sm:text-sm">
                    <span class="text-green-400">🌾</span>
                    <span class="text-white font-bold">+{{ card.effect.food }}</span>
                  </div>
                  <div v-if="card.effect.population" class="flex items-center justify-between text-xs sm:text-sm">
                    <span class="text-blue-400">👥</span>
                    <span class="text-white font-bold">+{{ card.effect.population }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 문화 카드 (2개 시너지) -->
          <div class="mb-4 sm:mb-6 md:mb-8">
            <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-purple-400">🎭 문화 카드</h3>
              <span class="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold bg-purple-600 text-purple-100">
                2개 시너지
              </span>
            </div>

            <!-- 시너지 효과 -->
            <div class="mb-3 sm:mb-4 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg sm:rounded-xl border-2 border-purple-500/30 p-3 sm:p-4">
              <div class="flex items-start gap-2 sm:gap-3 md:gap-4">
                <div class="text-3xl sm:text-4xl md:text-5xl">✨</div>
                <div class="flex-1">
                  <h4 class="text-base sm:text-lg md:text-xl font-bold text-purple-300 mb-1 sm:mb-2">문화 부흥 (2개 시너지)</h4>
                  <p class="text-xs sm:text-sm text-slate-300 mb-2 sm:mb-3">문화 카드 2개를 모으면 발동</p>
                  <div class="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                    <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <span class="text-pink-400">❤️</span>
                      <span class="text-white font-bold">민심 +3</span>
                    </div>
                    <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <span class="text-yellow-400">💰</span>
                      <span class="text-white font-bold">금 +150</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 카드 목록 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              <div v-for="card in cultureCards" :key="card.id"
                   class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg sm:rounded-xl border-2 border-purple-600/50 p-3 sm:p-4">
                <div class="text-3xl sm:text-4xl text-center mb-2 sm:mb-3">{{ card.icon }}</div>
                <h4 class="text-sm sm:text-base md:text-lg font-bold text-center mb-1 sm:mb-2 text-purple-300">{{ card.name }}</h4>
                <p class="text-[10px] sm:text-xs text-center text-slate-300 mb-2 sm:mb-3 line-clamp-2">{{ card.description }}</p>
                <div class="space-y-1 bg-slate-800/50 rounded-lg p-2 sm:p-3">
                  <div v-if="card.effect.morale" class="flex items-center justify-between text-xs sm:text-sm">
                    <span class="text-pink-400">❤️</span>
                    <span class="text-white font-bold">+{{ card.effect.morale }}</span>
                  </div>
                  <div v-if="card.effect.gold" class="flex items-center justify-between text-xs sm:text-sm">
                    <span class="text-yellow-400">💰</span>
                    <span class="text-white font-bold">+{{ card.effect.gold }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SYNERGY_CARDS } from '~/types/synergy-cards'

defineProps<{
  show: boolean
}>()

defineEmits<{
  close: []
}>()

// 태그별로 카드 분류
const tradeCards = computed(() => SYNERGY_CARDS.filter(c => c.tag === 'trade'))
const militaryCards = computed(() => SYNERGY_CARDS.filter(c => c.tag === 'military'))
const agricultureCards = computed(() => SYNERGY_CARDS.filter(c => c.tag === 'agriculture'))
const cultureCards = computed(() => SYNERGY_CARDS.filter(c => c.tag === 'culture'))
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
