<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center p-2 sm:p-4">
      <div class="w-full max-w-6xl h-[95vh] sm:h-[90vh] bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl border-2 border-cyan-600 shadow-2xl flex flex-col">
        <!-- Header -->
        <div class="bg-gradient-to-r from-cyan-900 to-cyan-800 border-b-2 border-cyan-600 p-3 sm:p-4 flex-shrink-0">
          <div class="flex items-center justify-between">
            <h2 class="text-lg sm:text-2xl font-bold flex items-center gap-2">
              <span>📚</span>
              <span>카드 도감</span>
            </h2>
            <button
              @click="$emit('close')"
              class="text-2xl hover:text-cyan-400 transition-colors px-2 sm:px-3 py-1 sm:py-2 -mr-2"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex border-b-2 border-slate-700 bg-slate-900/50 flex-shrink-0">
          <button
            @click="activeTab = 'cards'"
            :class="[
              'flex-1 px-3 sm:px-6 py-2 sm:py-3 font-bold transition-colors text-sm sm:text-base',
              activeTab === 'cards'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            ]"
          >
            🎴 패시브 카드
          </button>
          <button
            @click="activeTab = 'synergy'"
            :class="[
              'flex-1 px-3 sm:px-6 py-2 sm:py-3 font-bold transition-colors text-sm sm:text-base',
              activeTab === 'synergy'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            ]"
          >
            ✨ 시너지 효과
          </button>
        </div>

        <!-- Tab Content -->
        <div class="flex-1 overflow-y-auto p-3 sm:p-6">
          <!-- Cards Tab -->
          <div v-if="activeTab === 'cards'" class="space-y-4">
            <!-- Filter Buttons -->
            <div class="flex flex-wrap gap-2 mb-4">
              <button
                @click="filterRarity = null"
                :class="[
                  'px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-bold transition-colors text-xs sm:text-sm',
                  filterRarity === null
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                ]"
              >
                전체
              </button>
              <button
                @click="filterRarity = 'common'"
                :class="[
                  'px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-bold transition-colors text-xs sm:text-sm',
                  filterRarity === 'common'
                    ? 'bg-slate-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                ]"
              >
                일반
              </button>
              <button
                @click="filterRarity = 'rare'"
                :class="[
                  'px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-bold transition-colors text-xs sm:text-sm',
                  filterRarity === 'rare'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                ]"
              >
                희귀
              </button>
              <button
                @click="filterRarity = 'epic'"
                :class="[
                  'px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-bold transition-colors text-xs sm:text-sm',
                  filterRarity === 'epic'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                ]"
              >
                영웅
              </button>
              <button
                @click="filterRarity = 'legendary'"
                :class="[
                  'px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-bold transition-colors text-xs sm:text-sm',
                  filterRarity === 'legendary'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                ]"
              >
                전설
              </button>
            </div>

            <!-- Card Stats -->
            <div class="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-700 mb-4">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <div class="text-slate-400">전체 카드</div>
                  <div class="text-lg sm:text-xl font-bold text-cyan-400">{{ allCards.length }}장</div>
                </div>
                <div>
                  <div class="text-slate-400">보유 카드</div>
                  <div class="text-lg sm:text-xl font-bold text-green-400">{{ ownedCards.length }}장</div>
                </div>
                <div>
                  <div class="text-slate-400">수집률</div>
                  <div class="text-lg sm:text-xl font-bold text-yellow-400">
                    {{ Math.floor((ownedCards.length / allCards.length) * 100) }}%
                  </div>
                </div>
                <div>
                  <div class="text-slate-400">필터링</div>
                  <div class="text-lg sm:text-xl font-bold text-purple-400">{{ filteredCards.length }}장</div>
                </div>
              </div>
            </div>

            <!-- Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                v-for="card in filteredCards"
                :key="card.id"
                :class="[
                  'relative bg-gradient-to-br rounded-lg p-3 sm:p-4 border-2 transition-all',
                  isOwned(card.id)
                    ? 'from-slate-700 to-slate-800 border-slate-500'
                    : 'from-slate-900 to-black border-slate-800 opacity-60',
                  getRarityClasses(card.rarity)
                ]"
              >
                <!-- Owned Badge -->
                <div
                  v-if="isOwned(card.id)"
                  class="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-xs sm:text-base"
                >
                  ✓
                </div>

                <!-- Lock Badge -->
                <div
                  v-else
                  class="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-slate-600 rounded-full flex items-center justify-center text-white shadow-lg text-xs sm:text-base"
                >
                  🔒
                </div>

                <!-- Card Icon -->
                <div class="text-3xl sm:text-4xl mb-2 text-center">{{ card.icon }}</div>

                <!-- Card Name -->
                <div
                  class="text-center font-bold mb-1 sm:mb-2 text-sm sm:text-base"
                  :class="getRarityTextColor(card.rarity)"
                >
                  {{ card.name }}
                </div>

                <!-- Card Rarity & Trigger -->
                <div class="flex justify-center gap-1 sm:gap-2 mb-2 flex-wrap">
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs',
                      getRarityBadgeColor(card.rarity)
                    ]"
                  >
                    {{ getRarityLabel(card.rarity) }}
                  </span>
                  <span class="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                    {{ getTriggerLabel(card.trigger) }}
                  </span>
                  <span v-if="card.isBattleCard" class="px-2 py-1 bg-red-900/50 rounded text-xs text-red-300">
                    전투
                  </span>
                </div>

                <!-- Card Description -->
                <div class="text-xs text-slate-400 text-center mb-2">
                  {{ card.description }}
                </div>

                <!-- Card Effects -->
                <div class="flex flex-wrap gap-1 justify-center text-xs">
                  <div v-if="card.effect.morale" class="px-2 py-1 bg-blue-900/30 rounded text-blue-300">
                    민심 {{ card.effect.morale > 0 ? '+' : '' }}{{ card.effect.morale }}
                  </div>
                  <div v-if="card.effect.gold" class="px-2 py-1 bg-yellow-900/30 rounded text-yellow-300">
                    금 {{ card.effect.gold > 0 ? '+' : '' }}{{ card.effect.gold }}
                  </div>
                  <div v-if="card.effect.military" class="px-2 py-1 bg-red-900/30 rounded text-red-300">
                    병력 {{ card.effect.military > 0 ? '+' : '' }}{{ card.effect.military }}
                  </div>
                  <div v-if="card.effect.food" class="px-2 py-1 bg-green-900/30 rounded text-green-300">
                    식량 {{ card.effect.food > 0 ? '+' : '' }}{{ card.effect.food }}
                  </div>
                  <div v-if="card.effect.population" class="px-2 py-1 bg-purple-900/30 rounded text-purple-300">
                    인구 {{ card.effect.population > 0 ? '+' : '' }}{{ card.effect.population }}
                  </div>
                  <div v-if="card.effect.attackBonus" class="px-2 py-1 bg-red-900/30 rounded text-red-300">
                    공격 +{{ card.effect.attackBonus }}%
                  </div>
                  <div v-if="card.effect.defenseBonus" class="px-2 py-1 bg-blue-900/30 rounded text-blue-300">
                    방어 +{{ card.effect.defenseBonus }}%
                  </div>
                  <div v-if="card.effect.skillPowerBonus" class="px-2 py-1 bg-purple-900/30 rounded text-purple-300">
                    스킬 +{{ card.effect.skillPowerBonus }}%
                  </div>
                </div>

                <!-- Synergy Tags -->
                <div v-if="card.synergyTags && card.synergyTags.length > 0" class="mt-2 flex flex-wrap gap-1 justify-center">
                  <span
                    v-for="tag in card.synergyTags"
                    :key="tag"
                    :class="['px-2 py-1 rounded text-xs font-bold', getSynergyTagColor(tag)]"
                  >
                    {{ getSynergyTagLabel(tag) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Synergy Tab -->
          <div v-if="activeTab === 'synergy'" class="space-y-4">
            <div class="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-700 mb-4">
              <h3 class="text-base sm:text-lg font-bold text-cyan-400 mb-2">시너지 효과란?</h3>
              <p class="text-xs sm:text-sm text-slate-300">
                같은 태그를 가진 카드를 여러 장 보유하면 추가 효과가 발동됩니다.
                카드를 수집하여 강력한 시너지 조합을 만드세요!
              </p>
            </div>

            <!-- Synergy Effects Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div
                v-for="synergy in allSynergyEffects"
                :key="synergy.id"
                :class="[
                  'relative bg-gradient-to-br rounded-lg p-3 sm:p-4 border-2 transition-all',
                  hasActiveSynergy(synergy)
                    ? 'from-purple-900 to-purple-800 border-purple-500 shadow-lg shadow-purple-500/50'
                    : 'from-slate-700 to-slate-800 border-slate-600'
                ]"
              >
                <!-- Active Badge -->
                <div
                  v-if="hasActiveSynergy(synergy)"
                  class="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-xs sm:text-base"
                >
                  ✓
                </div>

                <div class="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div class="text-3xl sm:text-4xl">{{ synergy.icon }}</div>
                  <div class="flex-1">
                    <h4 class="font-bold text-sm sm:text-base mb-1" :class="hasActiveSynergy(synergy) ? 'text-purple-300' : 'text-slate-300'">
                      {{ synergy.name }}
                    </h4>
                    <div class="text-xs text-slate-400 mb-2">
                      {{ synergy.description }}
                    </div>
                    <div class="flex items-center gap-2">
                      <span :class="['px-2 py-1 rounded text-xs font-bold', getSynergyTagColor(synergy.tag)]">
                        {{ getSynergyTagLabel(synergy.tag) }}
                      </span>
                      <span class="text-xs text-slate-400">
                        필요: {{ synergy.requiredCards }}장
                      </span>
                      <span class="text-xs font-bold" :class="hasActiveSynergy(synergy) ? 'text-green-400' : 'text-slate-500'">
                        ({{ getTagCount(synergy.tag) }}/{{ synergy.requiredCards }})
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Synergy Effects -->
                <div class="flex flex-wrap gap-1 text-xs">
                  <div v-if="synergy.effect.morale" class="px-2 py-1 bg-blue-900/30 rounded text-blue-300">
                    민심 +{{ synergy.effect.morale }}
                  </div>
                  <div v-if="synergy.effect.gold" class="px-2 py-1 bg-yellow-900/30 rounded text-yellow-300">
                    금 +{{ synergy.effect.gold }}
                  </div>
                  <div v-if="synergy.effect.military" class="px-2 py-1 bg-red-900/30 rounded text-red-300">
                    병력 +{{ synergy.effect.military }}
                  </div>
                  <div v-if="synergy.effect.food" class="px-2 py-1 bg-green-900/30 rounded text-green-300">
                    식량 +{{ synergy.effect.food }}
                  </div>
                  <div v-if="synergy.effect.population" class="px-2 py-1 bg-purple-900/30 rounded text-purple-300">
                    인구 +{{ synergy.effect.population }}
                  </div>
                  <div v-if="synergy.effect.attackBonus" class="px-2 py-1 bg-red-900/30 rounded text-red-300">
                    공격 +{{ synergy.effect.attackBonus }}%
                  </div>
                  <div v-if="synergy.effect.defenseBonus" class="px-2 py-1 bg-blue-900/30 rounded text-blue-300">
                    방어 +{{ synergy.effect.defenseBonus }}%
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
import { ref, computed } from 'vue'
import type { PassiveCard, SynergyEffect, SynergyTag } from '~/types/passive-cards'
import { PASSIVE_CARDS, SYNERGY_EFFECTS } from '~/types/passive-cards'

interface Props {
  show: boolean
  playerCards: PassiveCard[]
}

const props = defineProps<Props>()

defineEmits<{
  close: []
}>()

const activeTab = ref<'cards' | 'synergy'>('cards')
const filterRarity = ref<'common' | 'rare' | 'epic' | 'legendary' | null>(null)

// All cards from the database
const allCards = computed(() => PASSIVE_CARDS)
const allSynergyEffects = computed(() => SYNERGY_EFFECTS)

// Owned cards
const ownedCards = computed(() => props.playerCards)

// Filtered cards
const filteredCards = computed(() => {
  if (filterRarity.value === null) {
    return allCards.value
  }
  return allCards.value.filter(card => card.rarity === filterRarity.value)
})

// Check if player owns a card
const isOwned = (cardId: string) => {
  return ownedCards.value.some(card => card.id === cardId)
}

// Get synergy tag count
const getTagCount = (tag: SynergyTag) => {
  return ownedCards.value.filter(card =>
    card.synergyTags?.includes(tag)
  ).length
}

// Check if synergy is active
const hasActiveSynergy = (synergy: SynergyEffect) => {
  return getTagCount(synergy.tag) >= synergy.requiredCards
}

// Rarity classes
const getRarityClasses = (rarity: string) => {
  switch (rarity) {
    case 'legendary':
      return 'ring-2 ring-yellow-500'
    case 'epic':
      return 'ring-2 ring-purple-500'
    case 'rare':
      return 'ring-2 ring-blue-500'
    default:
      return ''
  }
}

const getRarityTextColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary':
      return 'text-yellow-400'
    case 'epic':
      return 'text-purple-400'
    case 'rare':
      return 'text-blue-400'
    default:
      return 'text-slate-300'
  }
}

const getRarityBadgeColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary':
      return 'bg-yellow-900/50 text-yellow-300'
    case 'epic':
      return 'bg-purple-900/50 text-purple-300'
    case 'rare':
      return 'bg-blue-900/50 text-blue-300'
    default:
      return 'bg-slate-700 text-slate-300'
  }
}

const getRarityLabel = (rarity: string) => {
  switch (rarity) {
    case 'legendary':
      return '전설'
    case 'epic':
      return '영웅'
    case 'rare':
      return '희귀'
    default:
      return '일반'
  }
}

const getTriggerLabel = (trigger: string) => {
  switch (trigger) {
    case 'daily':
      return '매일'
    case 'battle_start':
      return '전투시작'
    case 'battle_win':
      return '승리'
    case 'battle_lose':
      return '패배'
    case 'recruit':
      return '징집'
    default:
      return trigger
  }
}

const getSynergyTagColor = (tag: SynergyTag) => {
  switch (tag) {
    case 'trade':
      return 'bg-yellow-900/50 text-yellow-300'
    case 'military':
      return 'bg-red-900/50 text-red-300'
    case 'agriculture':
      return 'bg-green-900/50 text-green-300'
    case 'culture':
      return 'bg-purple-900/50 text-purple-300'
    case 'magic':
      return 'bg-blue-900/50 text-blue-300'
    case 'religion':
      return 'bg-amber-900/50 text-amber-300'
    case 'technology':
      return 'bg-cyan-900/50 text-cyan-300'
    case 'conquest':
      return 'bg-orange-900/50 text-orange-300'
    default:
      return 'bg-slate-700 text-slate-300'
  }
}

const getSynergyTagLabel = (tag: SynergyTag) => {
  switch (tag) {
    case 'trade':
      return '무역'
    case 'military':
      return '군사'
    case 'agriculture':
      return '농업'
    case 'culture':
      return '문화'
    case 'magic':
      return '마법'
    case 'religion':
      return '종교'
    case 'technology':
      return '기술'
    case 'conquest':
      return '정복'
    default:
      return tag
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
