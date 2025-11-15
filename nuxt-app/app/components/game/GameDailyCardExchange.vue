<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/80 flex items-center justify-center z-[10002] p-2 sm:p-4" @click.self="$emit('close')">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-600/50 rounded-lg sm:rounded-xl w-full max-w-6xl max-h-[95vh] sm:max-h-[85vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-3 sm:p-4 border-b-2 border-blue-600/30 bg-blue-900/20">
          <div class="flex items-center gap-2 sm:gap-3">
            <span class="text-2xl sm:text-3xl">🎴</span>
            <div>
              <h2 class="text-base sm:text-lg md:text-xl font-bold text-blue-200">특별 카드 이벤트</h2>
              <p class="text-[10px] sm:text-xs text-slate-400">새로운 카드를 획득하거나 기존 카드와 교환할 수 있습니다</p>
            </div>
          </div>
          <div class="flex items-center gap-1 sm:gap-2">
            <button
              @click="showHelpPanel = true"
              class="text-purple-400 hover:text-purple-300 text-lg sm:text-xl px-1 sm:px-2 transition-colors"
              title="시너지 가이드"
            >
              ❓
            </button>
            <button
              @click="$emit('close')"
              class="text-slate-400 hover:text-white text-xl sm:text-2xl px-1 sm:px-2"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-3 sm:p-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <!-- Left Side: Current Cards -->
            <div>
              <h3 class="text-sm sm:text-base font-bold mb-2 sm:mb-3 text-purple-300 flex items-center gap-2">
                <span>📚</span> 보유 중인 카드
              </h3>
              <div v-if="currentCards.length === 0" class="text-center py-8 text-slate-500">
                <div class="text-4xl sm:text-5xl mb-2">🎴</div>
                <p class="text-sm sm:text-base">보유한 카드가 없습니다</p>
              </div>
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
                <div
                  v-for="(card, index) in currentCards"
                  :key="card.id"
                  class="border-2 rounded-lg p-2 sm:p-3 transition-all cursor-pointer"
                  :class="getCardClass(card.rarity, selectedCurrentCard?.id === card.id)"
                  @click="selectCurrentCard(card)"
                >
                  <div class="flex items-start gap-2">
                    <div class="text-2xl sm:text-3xl">{{ card.icon }}</div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center flex-wrap gap-1 mb-1">
                        <h4 class="text-xs sm:text-sm font-bold">{{ card.name }}</h4>
                        <span
                          class="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                          :class="getRarityBadgeClass(card.rarity)"
                        >
                          {{ getRarityLabel(card.rarity) }}
                        </span>
                      </div>
                      <p class="text-[10px] sm:text-xs text-slate-300 line-clamp-2">{{ card.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Side: New Cards -->
            <div>
              <h3 class="text-sm sm:text-base font-bold mb-2 sm:mb-3 text-green-300 flex items-center gap-2">
                <span>✨</span> 새로운 카드
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
                <div
                  v-for="card in newCards"
                  :key="card.id"
                  class="border-2 rounded-lg p-2 sm:p-3 transition-all cursor-pointer relative overflow-hidden"
                  :class="getCardClass(card.rarity, selectedNewCard?.id === card.id)"
                  @click="selectNewCard(card)"
                >
                  <!-- 시너지 없는 카드 표시 -->
                  <div v-if="!card.synergyTags || card.synergyTags.length === 0" class="absolute top-1 right-1 text-[10px] bg-blue-600/80 text-white px-2 py-0.5 rounded-full font-bold">
                    독립
                  </div>

                  <div class="flex items-start gap-2">
                    <div class="text-2xl sm:text-3xl">{{ card.icon }}</div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center flex-wrap gap-1 mb-1">
                        <h4 class="text-xs sm:text-sm font-bold">{{ card.name }}</h4>
                        <span
                          class="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                          :class="getRarityBadgeClass(card.rarity)"
                        >
                          {{ getRarityLabel(card.rarity) }}
                        </span>
                      </div>
                      <p class="text-[10px] sm:text-xs text-slate-300 line-clamp-2">{{ card.description }}</p>

                      <!-- 시너지 태그 표시 -->
                      <div v-if="card.synergyTags && card.synergyTags.length > 0" class="flex flex-wrap gap-1 mt-1">
                        <span
                          v-for="tag in card.synergyTags"
                          :key="tag"
                          class="text-[10px] bg-purple-600/50 text-purple-200 px-1.5 py-0.5 rounded"
                        >
                          {{ getTagIcon(tag) }} {{ getTagLabel(tag) }}
                        </span>
                      </div>

                      <div class="text-[10px] sm:text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded mt-1">
                        <span class="font-semibold">발동:</span> {{ getTriggerLabel(card.trigger) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 시너지 프리뷰 -->
              <div v-if="selectedNewCard && synergyPreview?.hasNewSynergies" class="mt-3 p-2 sm:p-3 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-2 border-purple-500/50 rounded-lg animate-pulse">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-lg sm:text-xl">✨</span>
                  <h4 class="text-xs sm:text-sm font-bold text-purple-200">시너지 발동!</h4>
                </div>

                <!-- 새로운 시너지 -->
                <div v-for="synergy in synergyPreview.newSynergies" :key="synergy.id" class="mb-2">
                  <div class="flex items-start gap-2">
                    <span class="text-base sm:text-lg">{{ synergy.icon }}</span>
                    <div class="flex-1">
                      <p class="text-[10px] sm:text-xs font-bold text-yellow-300">🆕 {{ synergy.name }}</p>
                      <p class="text-[10px] sm:text-xs text-purple-200">{{ synergy.description }}</p>
                    </div>
                  </div>
                </div>

                <!-- 업그레이드 시너지 -->
                <div v-for="synergy in synergyPreview.upgradedSynergies" :key="synergy.id" class="mb-2">
                  <div class="flex items-start gap-2">
                    <span class="text-base sm:text-lg">{{ synergy.icon }}</span>
                    <div class="flex-1">
                      <p class="text-[10px] sm:text-xs font-bold text-green-300">⬆️ {{ synergy.name }}</p>
                      <p class="text-[10px] sm:text-xs text-purple-200">{{ synergy.description }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 시너지 없는 카드 설명 -->
              <div v-else-if="selectedNewCard && (!selectedNewCard.synergyTags || selectedNewCard.synergyTags.length === 0)" class="mt-3 p-2 sm:p-3 bg-blue-900/30 border border-blue-600/50 rounded-lg">
                <div class="flex items-center gap-2">
                  <span class="text-base sm:text-lg">⭐</span>
                  <div>
                    <p class="text-[10px] sm:text-xs font-bold text-blue-200">독립 카드</p>
                    <p class="text-[10px] sm:text-xs text-slate-300">시너지 없이도 강력한 효과!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Instructions -->
          <div class="mt-4 p-3 bg-blue-900/30 border border-blue-600/50 rounded-lg">
            <p class="text-xs sm:text-sm text-blue-200">
              💡 <span class="font-bold">선택 방법:</span>
              <span v-if="currentCards.length === 0">
                새로운 카드를 선택하세요
              </span>
              <span v-else-if="currentCards.length < 3">
                {{ selectedNewCard && !selectedCurrentCard ? '카드를 추가하거나, 기존 카드를 선택해 교환하세요' :
                   selectedCurrentCard ? '새로운 카드를 선택하세요' :
                   '새로운 카드를 선택하거나, 기존 카드를 선택해 교환하세요' }}
              </span>
              <span v-else>
                {{ selectedCurrentCard ? '새로운 카드를 선택하세요' : '먼저 교환할 기존 카드를 선택하세요' }}
              </span>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 sm:p-4 border-t-2 border-blue-600/30 bg-blue-900/20">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3">
            <div class="text-xs sm:text-sm text-slate-400">
              <span v-if="selectedCurrentCard && selectedNewCard" class="text-green-400 font-bold">
                ⚡ 교환 준비 완료
              </span>
              <span v-else-if="selectedNewCard && !selectedCurrentCard && currentCards.length < 3" class="text-blue-400 font-bold">
                ✨ 추가 준비 완료
              </span>
              <span v-else>
                보유 {{ currentCards.length }}개 / 새 카드 {{ newCards.length }}개
              </span>
            </div>
            <div class="flex gap-2 w-full sm:w-auto">
              <button
                @click="$emit('skip')"
                class="flex-1 sm:flex-none px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-white transition-colors text-sm"
              >
                건너뛰기
              </button>

              <!-- 카드가 3장 미만: 교환 또는 추가 가능 -->
              <template v-if="currentCards.length > 0 && currentCards.length < 3">
                <button
                  @click="handleExchange"
                  :disabled="!selectedCurrentCard || !selectedNewCard"
                  class="flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  :class="selectedCurrentCard && selectedNewCard ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600'"
                >
                  교환하기
                </button>
                <button
                  @click="handleAddCard"
                  :disabled="!selectedNewCard || !!selectedCurrentCard"
                  class="flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  :class="selectedNewCard && !selectedCurrentCard ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-600'"
                >
                  카드 추가
                </button>
              </template>

              <!-- 카드가 3장: 교환만 가능 -->
              <button
                v-else-if="currentCards.length >= 3"
                @click="handleExchange"
                :disabled="!selectedCurrentCard || !selectedNewCard"
                class="flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                :class="selectedCurrentCard && selectedNewCard ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600'"
              >
                교환하기
              </button>

              <!-- 카드가 0장: 추가만 가능 -->
              <button
                v-else
                @click="handleAddCard"
                :disabled="!selectedNewCard"
                class="flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                :class="selectedNewCard ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-600'"
              >
                카드 추가
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 시너지 가이드 패널 -->
      <GameSynergyHelpPanel :show="showHelpPanel" @close="showHelpPanel = false" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PassiveCard, SynergyTag } from '~/types/passive-cards'
import { SYNERGY_EFFECTS } from '~/types/passive-cards'

interface Props {
  show: boolean
  currentCards: PassiveCard[]
  newCards: PassiveCard[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'close': []
  'skip': []
  'exchange': [oldCard: PassiveCard, newCard: PassiveCard]
  'add': [card: PassiveCard]
}>()

const selectedCurrentCard = ref<PassiveCard | null>(null)
const selectedNewCard = ref<PassiveCard | null>(null)
const showHelpPanel = ref(false)

// 시너지 카운트 계산
const countSynergyTags = (cards: PassiveCard[]) => {
  const tagCounts: Record<string, number> = {}
  cards.forEach(card => {
    if (card.synergyTags) {
      card.synergyTags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })
  return tagCounts
}

// 새 카드 선택 시 시너지 프리뷰 계산
const synergyPreview = computed(() => {
  if (!selectedNewCard.value) return null

  // 현재 덱에서 선택된 카드 제외
  let futureCards = [...props.currentCards]
  if (selectedCurrentCard.value) {
    futureCards = futureCards.filter(c => c.id !== selectedCurrentCard.value!.id)
  }
  // 새 카드 추가
  futureCards.push(selectedNewCard.value)

  const currentTagCounts = countSynergyTags(props.currentCards)
  const futureTagCounts = countSynergyTags(futureCards)

  const newSynergies: any[] = []
  const upgradedSynergies: any[] = []

  if (selectedNewCard.value.synergyTags) {
    selectedNewCard.value.synergyTags.forEach(tag => {
      const currentCount = currentTagCounts[tag] || 0
      const futureCount = futureTagCounts[tag] || 0

      // 2개 시너지 발동
      if (currentCount < 2 && futureCount >= 2) {
        const synergy = SYNERGY_EFFECTS.find(s => s.tag === tag && s.requiredCards === 2)
        if (synergy) {
          newSynergies.push({ ...synergy, count: futureCount })
        }
      }
      // 3개 시너지 발동
      if (currentCount < 3 && futureCount >= 3) {
        const synergy = SYNERGY_EFFECTS.find(s => s.tag === tag && s.requiredCards === 3)
        if (synergy) {
          if (currentCount >= 2) {
            upgradedSynergies.push({ ...synergy, count: futureCount })
          } else {
            newSynergies.push({ ...synergy, count: futureCount })
          }
        }
      }
    })
  }

  return {
    hasNewSynergies: newSynergies.length > 0 || upgradedSynergies.length > 0,
    newSynergies,
    upgradedSynergies,
    currentTagCounts: currentTagCounts,
    futureTagCounts: futureTagCounts
  }
})

const selectCurrentCard = (card: PassiveCard) => {
  if (selectedCurrentCard.value?.id === card.id) {
    selectedCurrentCard.value = null
  } else {
    selectedCurrentCard.value = card
  }
}

const selectNewCard = (card: PassiveCard) => {
  if (selectedNewCard.value?.id === card.id) {
    selectedNewCard.value = null
  } else {
    selectedNewCard.value = card
  }
}

const handleExchange = () => {
  if (selectedCurrentCard.value && selectedNewCard.value) {
    emit('exchange', selectedCurrentCard.value, selectedNewCard.value)
    selectedCurrentCard.value = null
    selectedNewCard.value = null
  }
}

const handleAddCard = () => {
  if (selectedNewCard.value) {
    emit('add', selectedNewCard.value)
    selectedNewCard.value = null
  }
}

const getCardClass = (rarity: string, isSelected: boolean) => {
  const baseClasses = isSelected
    ? 'ring-2 ring-yellow-400 scale-105 shadow-xl'
    : 'hover:scale-105'

  const rarityClasses: Record<string, string> = {
    common: 'bg-gray-800/50 border-gray-600 hover:border-gray-500',
    rare: 'bg-blue-900/30 border-blue-600 hover:border-blue-500',
    epic: 'bg-purple-900/30 border-purple-600 hover:border-purple-500',
    legendary: 'bg-orange-900/30 border-orange-600 hover:border-orange-500'
  }

  return `${baseClasses} ${rarityClasses[rarity] || rarityClasses.common}`
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

const getTriggerLabel = (trigger: string) => {
  const labels: Record<string, string> = {
    daily: '매일',
    battle_start: '전투 시작',
    battle_win: '전투 승리',
    battle_lose: '전투 패배',
    recruit: '병력 모집'
  }
  return labels[trigger] || trigger
}

const getTagIcon = (tag: SynergyTag) => {
  const icons: Record<SynergyTag, string> = {
    trade: '🏪',
    military: '⚔️',
    agriculture: '🌾',
    culture: '🎭',
    magic: '🔮',
    religion: '⛪',
    technology: '⚙️',
    conquest: '🔥'
  }
  return icons[tag]
}

const getTagLabel = (tag: SynergyTag) => {
  const labels: Record<SynergyTag, string> = {
    trade: '무역',
    military: '군사',
    agriculture: '농업',
    culture: '문화',
    magic: '마법',
    religion: '종교',
    technology: '기술',
    conquest: '정복'
  }
  return labels[tag]
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
