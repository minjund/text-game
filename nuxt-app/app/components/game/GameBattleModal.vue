<template>
  <Transition name="modal">
    <div v-if="battle" class="fixed inset-0 bg-black/90 z-[10001]">
      <div class="w-full h-full flex flex-col bg-gradient-to-br from-slate-800 to-slate-900 md:border-2 md:border-red-600 md:rounded-lg md:max-w-5xl md:max-h-[90vh] md:m-auto md:mt-[5vh]">
        <!-- Header -->
        <div class="bg-gradient-to-r from-red-900 to-red-800 border-b-2 border-red-600 p-2 md:p-4 flex-shrink-0">
          <div class="flex items-center justify-between mb-1 md:mb-2">
            <h2 class="text-sm md:text-xl font-bold flex items-center gap-1 md:gap-2">
              <span>⚔️</span> 전장의 기록
            </h2>
            <button @click.stop="handleClose" class="text-xl md:text-2xl hover:text-red-400 transition-colors px-2 py-1">
              ✕
            </button>
          </div>

          <!-- Battle Status Bar -->
          <div v-if="!battle.result" class="space-y-1 md:space-y-2">
            <!-- Team Names -->
            <div class="flex items-center justify-between text-[10px] md:text-sm">
              <span class="font-bold text-blue-300 truncate max-w-[40%]">{{ battle.attacker.kingdomName }}</span>
              <span class="text-slate-400 text-[10px]">VS</span>
              <span class="font-bold text-red-300 truncate max-w-[40%]">{{ battle.defender.kingdomName }}</span>
            </div>

            <!-- Score Display -->
            <div class="flex items-center justify-center gap-2 md:gap-4 text-base md:text-xl font-bold">
              <div class="flex items-center gap-1 md:gap-2">
                <span class="text-blue-400">{{ attackerScore }}</span>
                <span class="text-[9px] md:text-xs text-slate-400">승점</span>
              </div>
              <span class="text-slate-500 text-sm">-</span>
              <div class="flex items-center gap-1 md:gap-2">
                <span class="text-[9px] md:text-xs text-slate-400">승점</span>
                <span class="text-red-400">{{ defenderScore }}</span>
              </div>
            </div>

            <!-- Battle Status Indicator -->
            <div class="flex items-center justify-center gap-1 md:gap-2 text-[10px] md:text-xs">
              <div v-if="scoreDifference > 2" class="flex items-center gap-0.5 md:gap-1 text-green-400">
                <span class="text-xs md:text-base">💪</span>
                <span class="font-bold">크게 우세!</span>
              </div>
              <div v-else-if="scoreDifference > 0" class="flex items-center gap-0.5 md:gap-1 text-blue-400">
                <span class="text-xs md:text-base">👍</span>
                <span class="font-bold">약간 우세</span>
              </div>
              <div v-else-if="scoreDifference === 0" class="flex items-center gap-0.5 md:gap-1 text-yellow-400">
                <span class="text-xs md:text-base">⚖️</span>
                <span class="font-bold">팽팽한 접전</span>
              </div>
              <div v-else-if="scoreDifference > -3" class="flex items-center gap-0.5 md:gap-1 text-orange-400">
                <span class="text-xs md:text-base">⚠️</span>
                <span class="font-bold">약간 열세</span>
              </div>
              <div v-else class="flex items-center gap-0.5 md:gap-1 text-red-400">
                <span class="text-xs md:text-base">🚨</span>
                <span class="font-bold">크게 열세!</span>
              </div>
            </div>

            <!-- Card Selection Timer -->
            <div v-if="isPaused && cardSelectionTime > 0" class="mt-1 md:mt-2">
              <div class="flex items-center gap-2">
                <div class="flex-1 bg-slate-700 rounded-full h-1.5 md:h-1 overflow-hidden">
                  <div
                    class="bg-yellow-400 h-full transition-all duration-1000 ease-linear"
                    :style="{ width: `${(cardSelectionTime / 15) * 100}%` }"
                  ></div>
                </div>
                <span class="text-xs md:text-[10px] text-yellow-400 min-w-[28px] md:min-w-[24px]">{{ cardSelectionTime }}s</span>
              </div>
            </div>
          </div>

          <!-- Final Result Display -->
          <div v-else class="flex items-center justify-center gap-2 md:gap-4 text-[10px] md:text-sm mt-1">
            <span class="font-bold text-blue-300 truncate max-w-[40%]">{{ battle.attacker.kingdomName }}</span>
            <span class="text-slate-400">VS</span>
            <span class="font-bold text-red-300 truncate max-w-[40%]">{{ battle.defender.kingdomName }}</span>
          </div>
        </div>

        <!-- Battle Log -->
        <div ref="battleLogContainer" class="flex-1 p-2 md:p-6 overflow-y-auto bg-slate-900/50 scroll-smooth">
          <div :class="{ 'opacity-50': isScrolling }">
            <div class="prose prose-invert max-w-none">
              <p v-for="(log, index) in battle.log" :key="index"
                 class="mb-1.5 md:mb-3 text-[11px] md:text-sm leading-relaxed"
                 :class="{
                   'text-slate-300': log.narrativeType === 'narration',
                   'text-amber-200 font-semibold': log.narrativeType === 'action',
                   'text-cyan-300 italic': log.narrativeType === 'dialogue'
                 }">
                <span v-if="log.narrativeType === 'narration'">{{ log.story }}</span>
                <span v-else-if="log.narrativeType === 'action'">{{ log.story }}</span>
                <span v-else-if="log.narrativeType === 'dialogue'">"{{ log.dialogue }}"</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Active Battle Cards Section -->
        <div v-if="battleActiveCards && battleActiveCards.length > 0 && !battle.result"
             :class="[
               'border-t-2 p-2 md:p-4 flex-shrink-0 transition-all duration-300',
               isPaused && cardSelectionTime > 0
                 ? 'border-yellow-500 bg-yellow-900/30 shadow-lg shadow-yellow-500/20'
                 : 'border-slate-700 bg-slate-900/80'
             ]">
          <h3 class="text-[10px] md:text-sm font-bold mb-2 text-amber-400">✨ 액티브 카드</h3>
          <div class="flex gap-1.5 md:gap-2 justify-start md:justify-center overflow-x-auto pb-1">
            <div v-for="card in battleActiveCards" :key="card.id"
                 :class="[
                   'relative bg-gradient-to-br rounded-lg p-1.5 md:p-3 border-2 w-24 md:w-36 flex-shrink-0',
                   isCardUsed(card.id)
                     ? 'from-gray-700 to-gray-800 border-gray-600 opacity-50 cursor-not-allowed'
                     : getCardGlowClass(card)
                 ]">
              <!-- Recommended Badge -->
              <div v-if="!isCardUsed(card.id) && isCardRecommended(card)"
                   class="absolute -top-1 -right-1 bg-yellow-500 text-black text-[8px] md:text-[10px] font-bold px-1 md:px-2 py-0.5 md:py-1 rounded-full animate-pulse z-10">
                추천!
              </div>

              <div class="text-xl md:text-3xl mb-0.5 md:mb-1 text-center">{{ card.icon }}</div>
              <div class="text-[10px] md:text-xs font-bold mb-0.5 md:mb-1 text-center truncate" :title="card.name">{{ card.name }}</div>
              <div class="text-[8px] md:text-[10px] text-center text-slate-300 mb-0.5 md:mb-1 line-clamp-2" :title="card.battleDescription">
                {{ card.battleDescription }}
              </div>

              <!-- Usage Hint -->
              <div v-if="!isCardUsed(card.id)" class="text-[7px] md:text-[9px] text-center text-amber-300 mb-1 md:mb-2 italic line-clamp-1">
                {{ getCardHint(card) }}
              </div>

              <button
                v-if="!isCardUsed(card.id)"
                @click="useCard(card)"
                :disabled="!isPaused || cardSelectionTime === 0"
                :class="[
                  'w-full px-1 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-bold transition-colors',
                  !isPaused || cardSelectionTime === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                    : isCardRecommended(card)
                    ? 'bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-700 animate-pulse' :
                  card.rarity === 'legendary' ? 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700' :
                  card.rarity === 'epic' ? 'bg-purple-600 hover:bg-purple-500 active:bg-purple-700' :
                  card.rarity === 'rare' ? 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700' :
                  'bg-gray-600 hover:bg-gray-500 active:bg-gray-700'
                ]">
                {{ isPaused && cardSelectionTime > 0 ? '사용' : '대기' }}
              </button>
              <div v-else class="text-[9px] md:text-xs text-center text-gray-400">사용됨</div>
            </div>
          </div>
        </div>

        <!-- Footer with Result -->
        <div v-if="battle.result" class="border-t-2 border-slate-600 p-3 md:p-4 flex-shrink-0 bg-slate-900">
          <div class="text-center mb-3 md:mb-4">
            <h3 class="text-lg md:text-2xl font-bold mb-1 md:mb-2"
                :class="battle.result === 'victory' ? 'text-green-400' : 'text-red-400'">
              {{ battle.result === 'victory' ? '🎉 승리!' : '😢 패배...' }}
            </h3>
            <p v-if="battle.result === 'victory'" class="text-xs md:text-sm text-slate-300">
              전리품: 금 +500, 식량 +300
            </p>
          </div>
          <button @click.stop="handleClose"
                  class="w-full bg-slate-700 hover:bg-slate-600 active:bg-slate-500 border-2 border-slate-500 rounded-lg py-3 md:py-4 font-bold transition-colors text-sm md:text-lg">
            전장을 떠난다
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Battle } from '~/types/game'
import type { ActiveCard } from '~/types/active-cards'

interface Props {
  battle: Battle | null
  isScrolling: boolean
  battleActiveCards?: ActiveCard[]
  usedActiveCards?: string[]
  attackerScore?: number
  defenderScore?: number
  isPaused?: boolean
  cardSelectionTime?: number
}

const props = withDefaults(defineProps<Props>(), {
  battleActiveCards: () => [],
  usedActiveCards: () => [],
  attackerScore: 0,
  defenderScore: 0,
  isPaused: false,
  cardSelectionTime: 0
})

const emit = defineEmits<{
  close: []
  useActiveCard: [card: ActiveCard]
}>()

// 점수 차이 계산
const scoreDifference = computed(() => {
  return props.attackerScore - props.defenderScore
})

const handleClose = () => {
  emit('close')
}

const useCard = (card: ActiveCard) => {
  emit('useActiveCard', card)
}

const isCardUsed = (cardId: string) => {
  return props.usedActiveCards?.includes(cardId) || false
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'from-gray-700 to-gray-800 border-gray-500'
    case 'rare':
      return 'from-blue-700 to-blue-800 border-blue-500'
    case 'epic':
      return 'from-purple-700 to-purple-800 border-purple-500'
    case 'legendary':
      return 'from-amber-700 to-amber-800 border-amber-500'
    default:
      return 'from-gray-700 to-gray-800 border-gray-500'
  }
}

// 카드 추천 시스템
const isCardRecommended = (card: ActiveCard) => {
  const diff = scoreDifference.value
  const effectType = card.effectType

  // 크게 열세 (차이 -3 이하)
  if (diff <= -3) {
    return ['heal', 'power_boost', 'defense_boost', 'enemy_weaken', 'morale_boost', 'reverse_momentum'].includes(effectType)
  }

  // 약간 열세 (차이 -2 ~ -1)
  if (diff < 0) {
    return ['heal', 'power_boost', 'defense_boost', 'enemy_weaken', 'morale_boost', 'turn_skip', 'reverse_momentum'].includes(effectType)
  }

  // 팽팽한 접전 (차이 0)
  if (diff === 0) {
    return ['instant_damage', 'power_boost', 'enemy_weaken', 'critical_strike', 'multi_strike'].includes(effectType)
  }

  // 약간 우세 (차이 1~2)
  if (diff <= 2) {
    return ['instant_damage', 'power_boost', 'critical_strike', 'multi_strike'].includes(effectType)
  }

  // 크게 우세 (차이 3 이상)
  return ['instant_damage', 'critical_strike', 'multi_strike'].includes(effectType)
}

const getCardHint = (card: ActiveCard) => {
  const effectType = card.effectType
  const diff = scoreDifference.value

  switch (effectType) {
    case 'instant_damage':
      if (diff >= 0) return '우세 시 추격용으로 적합'
      return '공격으로 역전 노려보기'

    case 'heal':
      if (diff < -2) return '열세일 때 필수!'
      if (diff < 0) return '열세 회복에 좋음'
      return '방어적 운영에 적합'

    case 'power_boost':
    case 'morale_boost':
      if (diff === 0) return '접전 시 승기 잡기'
      if (diff > 0) return '우세 확대에 유용'
      return '열세 회복에 도움'

    case 'defense_boost':
      if (diff < 0) return '열세 시 버티기'
      return '안정적인 방어 운영'

    case 'enemy_weaken':
      if (diff < -2) return '열세일 때 필수!'
      if (diff < 0) return '열세 만회의 기회'
      return '적 약화로 안정적 승리'

    case 'turn_skip':
      if (diff < 0) return '열세 시 시간 벌기'
      return '전략적 타이밍 조절'

    case 'critical_strike':
      if (diff >= 0) return '우세 시 결정타'
      return '한 방 역전의 기회'

    case 'multi_strike':
      if (diff >= 0) return '연속 공격으로 마무리'
      return '다수 공격으로 역전'

    case 'reverse_momentum':
      if (diff < -2) return '열세일 때 사용!'
      return '전세 역전의 순간'

    default:
      return '상황에 맞게 사용'
  }
}

const getCardGlowClass = (card: ActiveCard) => {
  if (isCardRecommended(card)) {
    return 'from-yellow-600 to-yellow-700 border-yellow-400 shadow-lg shadow-yellow-500/50 animate-pulse'
  }
  return getRarityColor(card.rarity)
}

const battleLogContainer = ref<HTMLElement | null>(null)
</script>
