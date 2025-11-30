<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center p-2 md:p-4">
      <div class="max-w-5xl w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-2xl border-2 border-purple-600 shadow-2xl max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-900 to-purple-800 border-b-2 border-purple-600 p-2 md:p-4">
          <h2 class="text-lg md:text-2xl font-bold text-center">⚔️ 전투 준비</h2>
        </div>

        <!-- Enemy Info -->
        <div class="bg-slate-800/50 border-b border-slate-700 p-2 md:p-4">
          <h3 class="text-sm md:text-lg font-bold mb-2 md:mb-3 text-amber-400">🎯 적 정보</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            <div class="bg-slate-900/50 rounded-lg p-2 md:p-3 border border-slate-700">
              <div class="text-[10px] md:text-xs text-slate-400 mb-0.5 md:mb-1">적군 이름</div>
              <div class="text-xs md:text-base font-bold text-red-400 truncate" :title="enemyName">{{ enemyName }}</div>
            </div>
            <div class="bg-slate-900/50 rounded-lg p-2 md:p-3 border border-slate-700">
              <div class="text-[10px] md:text-xs text-slate-400 mb-0.5 md:mb-1">병력</div>
              <div class="text-xs md:text-base font-bold text-orange-400">{{ enemyPower }}</div>
            </div>
            <div class="bg-slate-900/50 rounded-lg p-2 md:p-3 border border-slate-700">
              <div class="text-[10px] md:text-xs text-slate-400 mb-0.5 md:mb-1">예상 난이도</div>
              <div class="text-xs md:text-base font-bold" :class="difficultyColor">{{ difficulty }}</div>
            </div>
            <div class="bg-slate-900/50 rounded-lg p-2 md:p-3 border border-slate-700">
              <div class="text-[10px] md:text-xs text-slate-400 mb-0.5 md:mb-1">내 병력</div>
              <div class="text-xs md:text-base font-bold text-blue-400">{{ playerPower }}</div>
            </div>
          </div>
        </div>

        <!-- Battle Cards Selection -->
        <div class="flex-1 overflow-y-auto p-2 md:p-4">
          <!-- Header -->
          <div class="mb-3 md:mb-4">
            <h3 class="text-sm md:text-lg font-bold text-cyan-400 mb-2">🃏 전투 장착 카드</h3>
            <p class="text-xs md:text-sm text-slate-400">
              덱에 장착된 전투 카드가 이번 전투에서 사용됩니다
            </p>
          </div>

          <!-- Deck Battle Cards Display -->
          <div v-if="deckBattleCardsCount > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 mb-4">
            <div
              v-for="card in deckBattleCards.filter(c => c !== null)"
              :key="card.id"
              :class="[
                'relative bg-gradient-to-br rounded-lg md:rounded-xl border-2 p-3 md:p-4 transition-all',
                'from-slate-700 to-slate-800 border-slate-600',
                card.rarity === 'legendary' ? 'ring-2 ring-yellow-500' :
                card.rarity === 'epic' ? 'ring-2 ring-purple-500' :
                card.rarity === 'rare' ? 'ring-2 ring-blue-500' : ''
              ]"
            >

              <!-- Card Icon -->
              <div class="text-3xl md:text-4xl mb-1 md:mb-2 text-center">{{ card.icon }}</div>

              <!-- Card Name -->
              <div class="text-sm md:text-base text-center font-bold mb-1 md:mb-2" :class="{
                'text-yellow-400': card.rarity === 'legendary',
                'text-purple-400': card.rarity === 'epic',
                'text-blue-400': card.rarity === 'rare',
                'text-slate-300': card.rarity === 'common'
              }">
                {{ card.name }}
              </div>

              <!-- Card Description -->
              <div class="text-[10px] md:text-xs text-slate-400 text-center mb-1 md:mb-2 line-clamp-2">
                {{ card.description }}
              </div>

              <!-- Trigger Badge -->
              <div class="flex justify-center mb-1 md:mb-2">
                <span class="px-2 py-0.5 bg-slate-800/80 rounded-full text-[10px] md:text-xs text-cyan-300">
                  {{ getTriggerLabel(card.trigger) }}
                </span>
              </div>

              <!-- Card Rarity Badge -->
              <div class="flex justify-center">
                <span :class="[
                  'px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-bold',
                  card.rarity === 'legendary' ? 'bg-yellow-900/50 text-yellow-300' :
                  card.rarity === 'epic' ? 'bg-purple-900/50 text-purple-300' :
                  card.rarity === 'rare' ? 'bg-blue-900/50 text-blue-300' :
                  'bg-slate-700 text-slate-300'
                ]">
                  {{ card.rarity === 'legendary' ? '전설' :
                     card.rarity === 'epic' ? '영웅' :
                     card.rarity === 'rare' ? '희귀' : '일반' }}
                </span>
              </div>
            </div>
          </div>

          <!-- No Cards Message -->
          <div v-else class="text-center py-8 md:py-12">
            <div class="text-4xl md:text-6xl mb-3 md:mb-4">🚫</div>
            <div class="text-sm md:text-lg font-bold text-slate-300 mb-2">전투 카드가 없습니다</div>
            <div class="text-xs md:text-sm text-slate-400 mb-4">
              덱 설정에서 전투 슬롯에 카드를 장착하세요
            </div>
            <div class="bg-amber-900/30 border border-amber-600 rounded-lg p-3 max-w-sm mx-auto">
              <div class="text-xs md:text-sm text-amber-200">
                <div class="font-bold mb-1">💡 팁</div>
                <div>하단의 "덱" 버튼 → 전투 슬롯 3개에 카드 장착</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t-2 border-slate-700 p-2 md:p-4 bg-slate-900">
          <div class="flex gap-2 md:gap-3">
            <!-- 보스 전투가 아닐 때만 취소 버튼 표시 -->
            <button
              v-if="!isBossBattle"
              @click="$emit('cancel')"
              class="flex-1 px-3 md:px-6 py-2 md:py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm md:text-base font-bold transition-colors"
            >
              취소
            </button>
            <button
              @click="confirmSelection"
              :class="[
                'px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-lg text-sm md:text-base font-bold transition-colors shadow-lg',
                isBossBattle ? 'w-full' : 'flex-1'
              ]"
            >
              {{ deckBattleCardsCount > 0 ? `전투 시작 (카드 ${deckBattleCardsCount}장)` : '전투 시작 (카드 없음)' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 카드 선택 튜토리얼 오버레이 -->
      <GameBattleCardSelectionTutorialOverlay
        :show="showTutorial"
        @complete="completeTutorial"
        @skip="skipTutorial"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PassiveCard } from '~/types/passive-cards'
import GameBattleCardSelectionTutorialOverlay from './GameBattleCardSelectionTutorialOverlay.vue'
import { useTutorial } from '~/composables/useTutorial'

interface Props {
  show: boolean
  enemyName: string
  enemyPower: number
  playerPower: number
  deckBattleCards?: (PassiveCard | null)[] // 덱의 전투 카드
  isBossBattle?: boolean // 보스 전투 여부
}

const props = withDefaults(defineProps<Props>(), {
  deckBattleCards: () => []
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

// 튜토리얼 상태
const { tutorialState, completeCardSelectionTutorial } = useTutorial()
const showTutorial = ref(false)

// 모달이 열릴 때 튜토리얼 확인
watch(() => props.show, (newVal) => {
  if (newVal && process.client) {
    // tutorialState를 통해 확인
    if (!tutorialState.value?.hasSeenCardSelectionTutorial) {
      // 모달이 완전히 렌더링된 후 튜토리얼 표시
      setTimeout(() => {
        showTutorial.value = true
      }, 300)
    }
  }
})

// 튜토리얼 완료
const completeTutorial = () => {
  showTutorial.value = false
  completeCardSelectionTutorial()
}

// 튜토리얼 건너뛰기
const skipTutorial = () => {
  showTutorial.value = false
  completeCardSelectionTutorial()
}

// 덱 전투 카드 개수
const deckBattleCardsCount = computed(() => {
  return props.deckBattleCards?.filter(card => card !== null).length || 0
})

// 난이도 계산
const difficulty = computed(() => {
  const ratio = props.enemyPower / (props.playerPower || 1)
  if (ratio > 1.5) return '매우 어려움'
  if (ratio > 1.2) return '어려움'
  if (ratio > 0.8) return '보통'
  if (ratio > 0.5) return '쉬움'
  return '매우 쉬움'
})

const difficultyColor = computed(() => {
  const ratio = props.enemyPower / (props.playerPower || 1)
  if (ratio > 1.5) return 'text-red-500'
  if (ratio > 1.2) return 'text-orange-500'
  if (ratio > 0.8) return 'text-yellow-500'
  if (ratio > 0.5) return 'text-green-500'
  return 'text-blue-500'
})

// 전투 시작
const confirmSelection = () => {
  emit('confirm')
}

// 트리거 레이블
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
