<template>
  <div
      class="min-h-screen text-white flex flex-col overflow-hidden relative bg-slate-900"
  >
    <!-- Background Video -->
    <video
      autoplay
      loop
      muted
      playsinline
      class="absolute inset-0 w-full h-full object-cover z-0"
      :src="`${useRuntimeConfig().app.baseURL}images/background/base_back_ani.mp4`"
    ></video>

    <!-- Background Overlay -->
    <div class="absolute inset-0 bg-black/40 z-0"></div>

    <!-- Content Wrapper - Mobile View Container (Centered) -->
    <div class="relative z-10 flex flex-col min-h-screen max-w-md mx-auto w-full bg-black/20">
    <!-- Start Card Selection (After Story) -->
    <GameStartCardSelection
      v-if="tutorialState?.storyCompleted && !tutorialState?.hasSelectedStartCards"
      :cards="startCardOptions"
      @confirm="handleStartCardsSelected"
    />

    <!-- Interactive Tutorial (Day 0) -->
    <GameInteractiveTutorial
      :show="showTutorial"
      @complete="completeTutorial"
      @skip="skipTutorial"
    />

    <!-- Mobile Top Resources (Fixed) -->
    <GameMobileResources
      v-if="!adventureState?.active"
      :resources="kingdom.resources"
      :timer="remainingTime"
      :current-day="kingdom.day"
      :reincarnation-count="reincarnationData.count"
      :commandment-effects="commandmentEffects"
      @show-resource-help="handleShowResourceHelp"
    />

    <!-- Desktop Components - Hidden (Using Mobile Layout Only) -->

    <!-- Mobile Main Content Area (Spacer) -->
    <div class="flex-1"></div>

    <!-- Mobile Bottom Action Buttons (Fixed) -->
    <GameMobileActions
      v-if="!adventureState?.active"
      :unlocked-features="tutorialState?.unlockedFeatures || []"
      @show-battle-history="showBattleHistory = true"
      @show-passive-cards="showPassiveCardsCollection = true"
      @show-card-deck="showCardDeckModal = true"
      @show-card-guide="showCardCollection = true"
      @start-normal-battle="handleStartAdventure"
      @recruit-soldiers="recruitSoldiers"
    />


    <!-- Event Card Modal -->
    <GameEventModal
      :event="currentEvent"
      :current-resources="kingdom.resources"
      @close="handleEventClose"
      @select-choice="handleEventSelectChoice"
    />

    <!-- Crossroad Modal -->
    <GameCrossroadModal
      :crossroad="currentCrossroad"
      @close="handleCrossroadClose"
      @select-choice="handleCrossroadSelectChoice"
    />

    <!-- Story Battle Modal -->
    <GameBattleModal
      :battle="currentBattle"
      :is-scrolling="isScrolling"
      :battle-active-cards="battleActiveCards"
      :used-active-cards="usedActiveCards"
      :attacker-score="attackerScore"
      :defender-score="defenderScore"
      :is-paused="isPaused"
      :card-selection-time="cardSelectionTime"
      :current-day="kingdom.day"
      @close="closeBattle"
      @use-active-card="useActiveCard"
      @complete-tutorial="handleBattleTutorialComplete"
      @pause-tutorial="handleBattleTutorialPause"
      @manual-pause="manualPauseBattle"
      @manual-resume="manualResumeBattle"
      @skip-to-result="handleSkipToResult"
    />

    <!-- Passive Card Selection Modal -->
    <GamePassiveCardModal
      :show="showPassiveCardSelection"
      :cards="availablePassiveCards"
      @select-card="handlePassiveCardSelect"
    />

    <!-- Active Cards Modal -->
    <GameActiveCardsModal
      :show="showActiveCardsModal"
      :owned-active-cards="ownedActiveCards"
      :battle-active-cards="battleActiveCards"
      :max-battle-cards="maxBattleCards"
      @close="showActiveCardsModal = false"
      @add-to-deck="addToBattleDeck"
      @remove-from-deck="removeFromBattleDeck"
    />

    <!-- Reincarnation Modal -->
    <GameReincarnationModal
      :show="showReincarnationModal"
      :available-cards="reincarnationCardOptions"
      :reincarnation-count="reincarnationData.count"
      :highest-day="Math.max(reincarnationData.highestDay, kingdom.day)"
      :total-days-played="reincarnationData.totalDaysPlayed + kingdom.day"
      :inherited-cards-count="reincarnationData.inheritedCards?.length || 0"
      @select-card="handleReincarnationCardSelect"
      @reincarnate-without-card="handleReincarnationWithoutCard"
    />

    <!-- Passive Cards Collection Modal -->
    <GamePassiveCardsModal
      :show="showPassiveCardsCollection"
      :passive-cards="playerPassiveCards"
      :inherited-card-ids="reincarnationData.inheritedCards.map(c => c.id)"
      @close="showPassiveCardsCollection = false"
    />

    <!-- Card Collection Modal -->
    <GameCardCollection
      :show="showCardCollection"
      :player-cards="playerPassiveCards"
      @close="showCardCollection = false"
    />

    <!-- Card Deck Modal -->
    <GameCardDeckModal
      v-model="showCardDeckModal"
      :card-deck="cardDeck"
      :available-domestic-cards="availableDomesticCards"
      :available-battle-cards="availableBattleCards"
      :equipped-cards="equippedCards"
      @equip-card="(card, type, index) => equipCard(card, type, index)"
      @unequip-card="(type, index) => unequipCard(type, index)"
    />

    <!-- Commandments Modal -->
    <GameCommandmentsModal
      :show="showCommandments"
      :commandments="godGameState?.selectedCommandments || []"
      @close="showCommandments = false"
    />

    <!-- Battle History Modal -->
    <GameBattleHistoryModal
      :show="showBattleHistory"
      :battles="battleHistory"
      @close="showBattleHistory = false"
    />

    <!-- Advisor Modal (Tutorial) -->
    <GameAdvisorModal
      :show="showAdvisorModal"
      :title="currentAdvisorMessage?.title || ''"
      :message="currentAdvisorMessage?.message || ''"
      :rewards="currentAdvisorMessage?.rewards"
      :urgent="currentAdvisorMessage?.urgent"
      :important="currentAdvisorMessage?.important"
      :final="currentAdvisorMessage?.final"
      @close="closeAdvisorModal"
      @confirm="closeAdvisorModal"
    />

    <!-- Synergy Card Selection Modal -->
    <GameSynergyCardSelection
      :show="showSynergyCardSelection"
      :cards="availableSynergyCards"
      @close="showSynergyCardSelection = false"
      @select-card="selectSynergyCard"
    />

    <!-- Synergy Cards Collection Modal -->
    <GameSynergyCollection
      :show="showSynergyCardsCollection"
      :cards="synergyPlayerCards"
      :synergies="activeSynergies"
      :total-effects="synergyTotalEffects.totalEffects"
      @close="showSynergyCardsCollection = false"
    />

    <!-- Synergy Card Guide Modal -->
    <GameSynergyGuide
      :show="showSynergyGuide"
      @close="showSynergyGuide = false"
    />

    <!-- Resource Help Modal -->
    <GameResourceHelp
      :show="showResourceHelp"
      :resource-type="selectedResourceType"
      @close="showResourceHelp = false"
    />

    <!-- Daily Card Exchange Modal -->
    <GameDailyCardExchange
      :show="showDailyCardExchange"
      :current-cards="playerPassiveCards"
      :new-cards="availableDailyCards"
      @close="showDailyCardExchange = false"
      @skip="handleSkipDailyExchange"
      @exchange="handleCardExchange"
      @add="handleAddDailyCard"
    />

    <!-- Adventure Map -->
    <GameAdventureMap
      v-if="adventureState?.active"
      :nodes="adventureState?.nodes || []"
      :current-node-id="adventureState?.currentNodeId || null"
      :accumulated-rewards="adventureState?.accumulatedRewards || {}"
      :visible-cells="adventureState?.visibleCells || new Set()"
      :is-selecting-path="adventureState?.isSelectingPath || false"
      :available-paths="adventureState?.availablePaths || []"
      @node-click="handleAdventureNodeClick"
      @retreat="handleRetreat"
    />

    <!-- Adventure Shop Modal -->
    <GameAdventureShop
      :show="showAdventureShop"
      :current-gold="kingdom.resources.gold"
      :current-food="kingdom.resources.food"
      @close="handleAdventureShopClose"
      @buy="handleAdventureShopBuy"
    />

    <!-- Adventure Rest Modal -->
    <GameAdventureRest
      :show="showAdventureRest"
      @close="showAdventureRest = false"
      @select="handleAdventureRestSelect"
    />

    <!-- Battle Card Selection Modal -->
    <GameBattleCardSelection
      :show="showBattleCardSelection"
      :enemy-name="pendingBattle.enemyName"
      :enemy-power="pendingBattle.enemyPower"
      :player-power="kingdom.resources.soldiers"
      :deck-battle-cards="cardDeck.battle"
      :is-boss-battle="isBossBattle"
      @confirm="handleBattleCardsConfirm"
      @cancel="handleBattleCardCancel"
    />

    <!-- Dice Roulette -->
    <GameDiceRoulette
      :show="showDiceRoulette"
      :dice-results="adventureState?.diceResults || []"
      :current-index="adventureState?.currentDiceIndex || 0"
      :is-rolling="isDiceRolling"
      @roll="handleRollDice"
      @use-next="handleUseNextDice"
      @confirm="handleDiceConfirm"
    />

    <!-- Dice Progress (상단 작은 표시) -->
    <GameDiceProgress
      :show="showDiceProgress"
      :dice-results="adventureState?.diceResults || []"
      :current-index="adventureState?.currentDiceIndex || 0"
    />

    <!-- Path Selection (로드맵에서 직접 선택) -->
    <!-- <GamePathSelection
      :show="adventureState?.isSelectingPath || false"
      :paths="adventureState?.availablePaths || []"
      :remaining-steps="adventureState?.remainingSteps || 0"
      @select="handlePathSelect"
    /> -->

    <!-- Notification -->
    <Transition name="notification">
      <div v-if="notification"
           class="fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[200px]"
           :class="{
             'bg-green-600 border-2 border-green-400': notification.type === 'success',
             'bg-red-600 border-2 border-red-400': notification.type === 'error',
             'bg-blue-600 border-2 border-blue-400': notification.type === 'info'
           }">
        <span class="text-2xl">
          {{ notification.type === 'success' ? '✓' : notification.type === 'error' ? '✗' : 'ℹ' }}
        </span>
        <span class="font-semibold">{{ notification.message }}</span>
      </div>
    </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { PermanentEffect } from '../types/game'
import type { PassiveCard } from '../types/passive-cards'
import { drawRandomCards, MAX_PASSIVE_CARDS, MAX_INHERITED_CARDS } from '../types/passive-cards'
import { enemyKingdoms } from '../data/mockData'
import { useGodGame } from '~/composables/useGodGame'
import { useRealTimeGameTimer } from '~/composables/useRealTimeGameTimer'

// 항상 표시되는 컴포넌트 (즉시 로드)
import GameMobileResources from '~/components/game/GameMobileResources.vue'
import GameMobileActions from '~/components/game/GameMobileActions.vue'
import GameDesktopHeader from '~/components/game/GameDesktopHeader.vue'
import GameLeftSidebar from '~/components/game/GameLeftSidebar.vue'
import GameActionPanel from '~/components/game/GameActionPanel.vue'

// 모달 컴포넌트들 (Lazy Loading으로 초기 번들 크기 최적화)
const GameStartCardSelection = defineAsyncComponent(() => import('~/components/game/GameStartCardSelection.vue'))
const GameBattleModal = defineAsyncComponent(() => import('~/components/game/GameBattleModal.vue'))
const GameGeneralsModal = defineAsyncComponent(() => import('~/components/game/GameGeneralsModal.vue'))
const GameEventModal = defineAsyncComponent(() => import('~/components/game/GameEventModal.vue'))
const GameCrossroadModal = defineAsyncComponent(() => import('~/components/game/GameCrossroadModal.vue'))
const GamePassiveCardModal = defineAsyncComponent(() => import('~/components/game/GamePassiveCardModal.vue'))
const GameActiveCardsModal = defineAsyncComponent(() => import('~/components/game/GameActiveCardsModal.vue'))
const GameReincarnationModal = defineAsyncComponent(() => import('~/components/game/GameReincarnationModal.vue'))
const GamePassiveCardsModal = defineAsyncComponent(() => import('~/components/game/GamePassiveCardsModal.vue'))
const GameCardCollection = defineAsyncComponent(() => import('~/components/game/GameCardCollection.vue'))
const GameCommandmentsModal = defineAsyncComponent(() => import('~/components/game/GameCommandmentsModal.vue'))
const GameBattleHistoryModal = defineAsyncComponent(() => import('~/components/game/GameBattleHistoryModal.vue'))
const GameAdvisorModal = defineAsyncComponent(() => import('~/components/game/GameAdvisorModal.vue'))
const GameSynergyCardSelection = defineAsyncComponent(() => import('~/components/game/GameSynergyCardSelection.vue'))
const GameSynergyCollection = defineAsyncComponent(() => import('~/components/game/GameSynergyCollection.vue'))
const GameSynergyGuide = defineAsyncComponent(() => import('~/components/game/GameSynergyGuide.vue'))
const GameDailyCardExchange = defineAsyncComponent(() => import('~/components/game/GameDailyCardExchange.vue'))
const GameResourceHelp = defineAsyncComponent(() => import('~/components/game/GameResourceHelp.vue'))
const GameAdventureMap = defineAsyncComponent(() => import('~/components/game/GameAdventureMap.vue'))
const GameAdventureShop = defineAsyncComponent(() => import('~/components/game/GameAdventureShop.vue'))
const GameAdventureRest = defineAsyncComponent(() => import('~/components/game/GameAdventureRest.vue'))
const GameBattleCardSelection = defineAsyncComponent(() => import('~/components/game/GameBattleCardSelection.vue'))
const GameInteractiveTutorial = defineAsyncComponent(() => import('~/components/game/GameInteractiveTutorial.vue'))
const GameCardDeckModal = defineAsyncComponent(() => import('~/components/game/GameCardDeckModal.vue'))
const GameDiceRoulette = defineAsyncComponent(() => import('~/components/game/GameDiceRoulette.vue'))
const GameDiceProgress = defineAsyncComponent(() => import('~/components/game/GameDiceProgress.vue'))
const GamePathSelection = defineAsyncComponent(() => import('~/components/game/GamePathSelection.vue'))

// Composables
import { useNotification } from '~/composables/useNotification'
import { useTutorial } from '~/composables/useTutorial'
import { useGameKingdom } from '~/composables/useGameKingdom'
import { useGamePassiveCards } from '~/composables/useGamePassiveCards'
import { useGameReincarnation } from '~/composables/useGameReincarnation'
import { useBattleSystem } from '~/composables/useBattleSystem'
import { useEventSystem } from '~/composables/useEventSystem'
import { useSynergyCards } from '~/composables/useSynergyCards'
import { useAdventureSystem } from '~/composables/useAdventureSystem'
import { useActiveCards } from '~/composables/useActiveCards'
import { useCardDeck } from '~/composables/useCardDeck'
import { useBGM } from '~/composables/useBGM'
import { convertPassiveCardsToActiveCards } from '~/utils/cardConverter'

// 신 게임 상태 가져오기
const { nationState: godGameState, startCards: godStartCards } = useGodGame()

// BGM 관리
const { playBGM, stopBGM } = useBGM()

// 영구 효과
const permanentEffects = ref<PermanentEffect[]>([])

// 알림 시스템
const { notification, showNotification } = useNotification()

// 튜토리얼 시스템
const {
  tutorialState,
  isFeatureUnlocked,
  advanceDay,
  onRecruitSoldiers: tutorialOnRecruitSoldiers,
  onAssignGenerals: tutorialOnAssignGenerals,
  onCompleteFirstBattle,
  completeStory,
  completeStartCardSelection,
  resetTutorial,
  skipTutorial
} = useTutorial()

// 조언자 모달 상태
const showAdvisorModal = ref(false)
const currentAdvisorMessage = ref<any>(null)

// 액티브 카드 모달 상태
const showActiveCardsModal = ref(false)

// 실시간 타이머 (현실시간 12일)
const { remainingTime, gameStartTime, gameEndTime } = useRealTimeGameTimer()

// 계명 효과 계산 (일일 변동사항)
const commandmentEffects = computed(() => {
  if (!godGameState.value?.selectedCommandments || godGameState.value.selectedCommandments.length === 0) {
    return null
  }

  const total = {
    morale: 0,
    gold: 0,
    military: 0,
    food: 0,
    population: 0
  }

  godGameState.value.selectedCommandments.forEach(commandment => {
    total.morale += commandment.effects.morale
    total.gold += commandment.effects.gold
    total.military += commandment.effects.military
    total.food += commandment.effects.food
    total.population += commandment.effects.population
  })

  return total
})

// 패시브 카드 시스템
const {
  playerPassiveCards,
  showPassiveCardSelection,
  availablePassiveCards,
  availableCardsForReincarnation
} = useGamePassiveCards()

// 카드 덱 시스템
const {
  cardDeck,
  equippedCards,
  availableDomesticCards,
  availableBattleCards,
  equipCard,
  unequipCard,
  loadDeck,
  getActiveCardsForTrigger
} = useCardDeck(playerPassiveCards)

// 덱 모달 상태
const showCardDeckModal = ref(false)

// 액티브 카드 시스템
const {
  ownedActiveCards,
  battleActiveCards,
  maxBattleCards,
  loadActiveCards,
  saveActiveCards,
  addActiveCard,
  addRandomActiveCard,
  addToBattleDeck,
  removeFromBattleDeck,
  clearBattleDeck,
  grantStarterCards
} = useActiveCards({ showNotification })

// 게임 시작 시 액티브 카드 로드
if (process.client) {
  loadActiveCards()

  // 튜토리얼 완료 후 첫 시작이면 스타터 카드 지급
  const hasGrantedStarter = localStorage.getItem('hasGrantedStarterActiveCards')
  if (!hasGrantedStarter && ownedActiveCards.value.length === 0) {
    grantStarterCards()
    localStorage.setItem('hasGrantedStarterActiveCards', 'true')
  }
}

// 액티브 카드 저장
watch(ownedActiveCards, (newCards) => {
  if (process.client) {
    const cardIds = newCards.map(card => card.id)
    localStorage.setItem('activeCards', JSON.stringify(cardIds))
  }
}, { deep: true })

// 환생용 랜덤 카드 3장
const reincarnationCardOptions = ref<PassiveCard[]>([])

// 시너지 카드 시스템
const {
  playerCards: synergyPlayerCards,
  showCardSelection: showSynergyCardSelection,
  availableCards: availableSynergyCards,
  activeSynergies,
  totalEffects: synergyTotalEffects,
  dailyEffects: synergyDailyEffects,
  battleEffects: synergyBattleEffects,
  drawCards: drawSynergyCards,
  selectCard: selectSynergyCard,
  applyDailyEffects: applySynergyDailyEffects,
  applyBattleEffects: applySynergyBattleEffects
} = useSynergyCards()

// 왕국 상태
const { kingdom, empire, recruitSoldiers: baseRecruitSoldiers, calculateProduction } = useGameKingdom(
  godGameState,
  permanentEffects,
  showNotification
)

// 병력 모집 (튜토리얼 포함)
const recruitSoldiers = () => {
  baseRecruitSoldiers()

  // 튜토리얼: 병력 모집 완료 기록
  tutorialOnRecruitSoldiers()
}

// 패시브 카드 컬렉션 모달
const showPassiveCardsCollection = ref(false)

// 카드 도감 모달
const showCardCollection = ref(false)

// 시너지 카드 컬렉션 모달
const showSynergyCardsCollection = ref(false)

// 시너지 카드 도감 모달
const showSynergyGuide = ref(false)

// 일일 카드 교환 모달
const showDailyCardExchange = ref(false)
const availableDailyCards = ref<PassiveCard[]>([])

// 신의 계명 모달
const showCommandments = ref(false)

// 전투 히스토리 모달
const showBattleHistory = ref(false)

// 전투 히스토리 데이터
interface BattleRecord {
  timestamp: number
  result: 'victory' | 'defeat'
  enemyName: string
  battleType: string
  day: number
  score?: {
    player: number
    enemy: number
  }
}

const battleHistory = ref<BattleRecord[]>([])

// localStorage에서 전투 히스토리 로드
const loadBattleHistory = () => {
  if (process.client) {
    const saved = localStorage.getItem('battleHistory')
    if (saved) {
      try {
        battleHistory.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load battle history:', e)
        battleHistory.value = []
      }
    }
  }
}

// localStorage에 전투 히스토리 저장
const saveBattleHistory = () => {
  if (process.client) {
    localStorage.setItem('battleHistory', JSON.stringify(battleHistory.value))
  }
}

// 전투 기록 추가
const addBattleRecord = (record: BattleRecord) => {
  battleHistory.value.push(record)
  // 최대 100개 기록만 유지
  if (battleHistory.value.length > 100) {
    battleHistory.value = battleHistory.value.slice(-100)
  }
  saveBattleHistory()
}

// 튜토리얼 모달 (0일차)
const showTutorial = ref(false)

// 자원 도움말 모달
const showResourceHelp = ref(false)
const selectedResourceType = ref<'food' | 'gold' | 'morale' | 'soldiers' | null>(null)

// 자원 도움말 핸들러
const handleShowResourceHelp = (type: 'food' | 'gold' | 'morale' | 'soldiers') => {
  selectedResourceType.value = type
  showResourceHelp.value = true
}

// 튜토리얼 핸들러
const closeTutorial = () => {
  showTutorial.value = false
}

const completeTutorial = () => {
  showTutorial.value = false
  // tutorialState의 tutorialCompleted를 true로 설정 (useTutorial에서 자동 저장)
  tutorialState.value.tutorialCompleted = true
  tutorialState.value.isActive = false
  if (process.client) {
    localStorage.setItem('tutorialState', JSON.stringify(tutorialState.value))
  }
  showNotification('튜토리얼을 완료했습니다! 게임을 시작하세요!', 'success')
}

// 환생 시스템
const {
  showReincarnationModal,
  reincarnationData,
  loadReincarnationData,
  resetGameKeepProgress,
  selectInheritedCard,
  reincarnateWithoutCard
} = useGameReincarnation(
  kingdom,
  playerPassiveCards,
  godGameState,
  showNotification
)

// 게임 시작 시 환생 데이터 로드
if (process.client) {
  loadReincarnationData()
}

// 환생 카드 선택 핸들러 (보스 승리 시 스토리로 이동하지 않음)
const handleReincarnationCardSelect = (card: PassiveCard) => {
  if (isBossBattleVictory.value) {
    // 보스 승리 시: 카드만 추가하고 메인 화면 유지
    const hasCard = reincarnationData.value.inheritedCards.some(c => c.id === card.id)
    if (!hasCard) {
      if (reincarnationData.value.inheritedCards.length >= MAX_INHERITED_CARDS) {
        reincarnationData.value.inheritedCards.shift()
      }
      reincarnationData.value.inheritedCards.push(card)
    }

    if (process.client) {
      localStorage.setItem('reincarnationData', JSON.stringify(reincarnationData.value))
    }

    showNotification(`${card.name} 카드를 획득했습니다! (누적 상속 카드: ${reincarnationData.value.inheritedCards.length}개)`, 'success')
    showReincarnationModal.value = false
    isBossBattleVictory.value = false
  } else {
    // 일반 환생: 스토리로 이동
    selectInheritedCard(card)
  }
}

// 환생 포기 핸들러 (보스 승리 시 스토리로 이동하지 않음)
const handleReincarnationWithoutCard = () => {
  if (isBossBattleVictory.value) {
    // 보스 승리 시: 그냥 모달만 닫기
    showNotification('카드를 선택하지 않았습니다.', 'info')
    showReincarnationModal.value = false
    isBossBattleVictory.value = false
  } else {
    // 일반 환생: 스토리로 이동
    reincarnateWithoutCard()
  }
}

// 모험 시스템
const {
  adventureState,
  moveCompletedNodeId,
  currentNode,
  availableNodes,
  startAdventure,
  moveToNode,
  completeNode,
  completeAdventure,
  retreatAdventure,
  failAdventure,
  rollDice,
  useNextDice,
  startAutoMove,
  selectPath,
  NODE_INFO
} = useAdventureSystem(kingdom.value.resources, showNotification)

// 모험 떠나기 핸들러
const handleRetreat = () => {
  console.log('[handleRetreat] 모험 떠나기 - 완전히 종료하고 처음부터 시작')

  // 기본 BGM으로 전환
  playBGM('base', { loop: true, volume: 0.3 })

  // 룰렛 관련 UI 숨기기
  showDiceRoulette.value = false
  showDiceProgress.value = false

  // retreatAdventure 호출 (보상 50% 지급 및 상태 초기화)
  retreatAdventure()
}

// 모험 관련 모달 상태
const showAdventureShop = ref(false)
const showAdventureRest = ref(false)

// 주사위 관련 상태
const showDiceRoulette = ref(false)
const showDiceProgress = ref(false)
const isDiceRolling = ref(false)

// 주사위 굴리기 핸들러
const handleRollDice = async () => {
  isDiceRolling.value = true
  // 룰렛 애니메이션 효과
  await new Promise(resolve => setTimeout(resolve, 1000))
  rollDice()
  isDiceRolling.value = false
  showNotification('룰렛 5개 숫자 생성! 확인 버튼을 눌러주세요.', 'success')
}

// 룰렛 확인 핸들러
const handleDiceConfirm = () => {
  console.log('[handleDiceConfirm] 룰렛 확인 버튼 클릭')
  // 룰렛 모달 닫기
  showDiceRoulette.value = false
  // 상단 진행 표시 켜기
  showDiceProgress.value = true

  // 첫 번째 숫자 사용 시작
  setTimeout(() => {
    const steps = useNextDice()
    console.log('[handleDiceConfirm] 첫 번째 주사위 사용 - steps:', steps)
    showNotification(`${steps}칸 이동합니다!`, 'info')
    startAutoMove(steps)
  }, 300)
}

// 다음 주사위 사용 핸들러
const handleUseNextDice = () => {
  const steps = useNextDice()
  showNotification(`${steps}칸 이동합니다!`, 'info')
  // 룰렛 모달은 계속 열려 있음 (진행 상황 확인용)
  startAutoMove(steps)
}

// 경로 선택 핸들러
const handlePathSelect = (nodeId: string) => {
  selectPath(nodeId)
}

// 모험 시작 핸들러
const handleStartAdventure = () => {
  // 모험 BGM 재생
  playBGM('adventure', { loop: true, volume: 0.3 })

  // 이미 맵이 있으면 재개, 없으면 새로 시작
  if (adventureState.value.nodes.length > 0) {
    console.log('[handleStartAdventure] 기존 맵 재개')
    adventureState.value.active = true
    adventureState.value.result = undefined

    // 주사위 결과가 있으면 자동으로 이동 재개
    if (adventureState.value.diceResults.length > 0 && adventureState.value.currentDiceIndex < adventureState.value.diceResults.length) {
      console.log('[handleStartAdventure] 기존 룰렛 결과 유지 - 자동 이동 재개')
      showDiceProgress.value = true
      showDiceRoulette.value = false

      // 자동으로 다음 숫자 사용 시작
      setTimeout(() => {
        autoUseNextDice()
      }, 1000) // 1초 후 자동 시작
    } else {
      console.log('[handleStartAdventure] 룰렛 모달 열기')
      showDiceRoulette.value = true
      showDiceProgress.value = false
    }
  } else {
    console.log('[handleStartAdventure] 새 모험 시작')
    startAdventure()
    showDiceRoulette.value = true
    showDiceProgress.value = false
  }
}

// 전투 카드 선택 모달
const showBattleCardSelection = ref(false)
const pendingBattle = ref({
  enemyName: '',
  enemyPower: 0,
  battleType: 'normal' as 'normal' | 'empire'
})
const selectedBattleCards = ref<any[]>([]) // 전투에 사용할 액티브 카드

// ==================== PVP 관련 State - 주석 처리됨 ====================
// 멀티플레이 상태
/*
const myProfile = ref<PlayerProfile>({
  id: 'me',
  username: kingdom.value.ruler,
  kingdomName: kingdom.value.name,
  level: 1,
  rank: 0,
  totalWins: 0,
  totalLosses: 0,
  trophies: 1000,
  lastActive: new Date(),
  kingdom: kingdom.value,
  generals: generals.value
})
const players = ref<PlayerProfile[]>(mockPlayers)
const selectedOpponent = ref<PlayerProfile | null>(null)

// 정렬된 리더보드
const leaderboard = computed(() => {
  const allPlayers = [myProfile.value, ...players.value]
  return allPlayers.sort((a, b) => b.trophies - a.trophies).map((p, index) => ({
    ...p,
    rank: index + 1
  }))
})
*/
// ==================== PVP 관련 State 끝 ====================

// 7일차 침략 전투 플래그
const isWeeklyInvasion = ref(false)

// 보스 전투 플래그
const isBossBattle = ref(false)
const isBossBattleVictory = ref(false) // 보스 전투 승리 여부

// 전투 시스템
const {
  currentBattle,
  battleType,
  battleRecords,
  battleLogContainer,
  isScrolling,
  loadBattleRecords,
  saveBattleRecord,
  selectBattleType,
  startStoryBattle,
  generateCompleteBattle,
  startScrollAnimation,
  generateActionNarration,
  generateDialogue,
  getTextClass,
  closeBattle: closeBattleInternal,
  handleBattleEnd,
  currentBattleMode,
  useActiveCard,
  usedActiveCards,
  activeEffects,
  attackerScore,
  defenderScore,
  currentTurn,
  isPaused,
  cardSelectionTime,
  stopCardSelectionTimer,
  manualPauseBattle,
  manualResumeBattle
} = useBattleSystem({
  kingdom,
  enemyKingdoms,
  permanentEffects,
  empire,
  showNotification,
  synergyBattleEffects,
  isWeeklyInvasion,
  showReincarnationModal,
  selectedBattleCards,
  battleActiveCards
})

// 결과 빨리보기 - 전투를 즉시 종료
const handleSkipToResult = () => {
  if (!currentBattle.value) return

  // 전투를 일시정지
  if (!isPaused.value) {
    manualPauseBattle()
  }

  // 현재 점수를 기반으로 결과 결정
  const playerWins = attackerScore.value > defenderScore.value

  // 결과 설정
  currentBattle.value.result = playerWins ? 'victory' : 'defeat'

  // 결과 로그 추가
  const resultLog = {
    turn: 999,
    generalName: '심판관',
    action: '전투 종료',
    success: true,
    message: '',
    story: playerWins
      ? `🎉 ${currentBattle.value.attacker.kingdomName}의 승리! (${attackerScore.value} vs ${defenderScore.value})`
      : `😔 ${currentBattle.value.defender.kingdomName}의 승리... (${attackerScore.value} vs ${defenderScore.value})`,
    narrativeType: 'narration' as const
  }

  currentBattle.value.log.push(resultLog)

  // 스크롤을 맨 아래로
  setTimeout(() => {
    const container = document.querySelector('.overflow-y-auto')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, 100)
}

// 전투 종료 처리
const closeBattle = () => {
  // 전투 결과 및 모드 확인
  const battleResult = currentBattle.value?.result
  const battleMode = currentBattleMode.value

  // 전투 기록 저장
  if (currentBattle.value && battleResult) {
    const record: BattleRecord = {
      timestamp: Date.now(),
      result: battleResult,
      enemyName: currentBattle.value.defender.kingdomName,
      battleType: battleMode || 'pve',
      day: kingdom.value.day,
      score: {
        player: attackerScore.value,
        enemy: defenderScore.value
      }
    }
    addBattleRecord(record)
  }

  // 기존 closeBattle 로직 실행
  closeBattleInternal()

  // BGM 복원: 모험 중이면 adventure BGM, 아니면 base BGM
  if (adventureState?.value?.active) {
    playBGM('adventure', { loop: true, volume: 0.3 })
  } else {
    playBGM('base', { loop: true, volume: 0.3 })
  }

  // 모험 모드인 경우 (보스 전투 포함)
  if (adventureState?.value?.active) {
    handleAdventureBattleEnd(battleResult as 'victory' | 'defeat')
    return
  }

  // 제국 전투 패배한 경우에만 환생 모달 표시 (주간 침략)
  if (battleResult === 'defeat' && battleMode === 'empire') {
    setTimeout(() => {
      if (isWeeklyInvasion) {
        isWeeklyInvasion.value = false
      }
      showReincarnationModal.value = true
    }, 500)
  }
}

// 전투 중 카드 사용 처리
const handleUseBattleCard = (card: any) => {
  if (!currentBattle.value) return

  // 전투 로그에 카드 사용 기록 추가
  const cardUseLog = {
    turn: currentBattle.value.log.length,
    generalName: kingdom.value.ruler || '군주',
    action: card.name,
    success: true,
    message: '',
    story: `${kingdom.value.ruler || '군주'}이(가) ${card.icon} ${card.name} 카드를 사용했다! ${card.description}`,
    narrativeType: 'action' as const
  }

  // 결과 로그 전에 카드 사용 로그 삽입
  const resultLogIndex = currentBattle.value.log.findIndex(log => log.turn === 999)
  if (resultLogIndex !== -1) {
    currentBattle.value.log.splice(resultLogIndex, 0, cardUseLog)
  } else {
    currentBattle.value.log.push(cardUseLog)
  }

  // 카드 효과 즉시 적용 (전투 결과에 영향)
  if (card.effect) {
    // 공격력/방어력/스킬 보너스를 아군 장수에게 즉시 적용
    if (currentBattle.value.attacker.generals.length > 0) {
      currentBattle.value.attacker.generals.forEach(general => {
        if (card.effect.attackBonus) {
          general.stats.power += Math.floor(general.stats.power * card.effect.attackBonus / 100)
        }
        if (card.effect.defenseBonus) {
          general.assignedSoldiers += Math.floor(general.assignedSoldiers * card.effect.defenseBonus / 100)
        }
        if (card.effect.skillPowerBonus) {
          general.skills.forEach(skill => {
            if (skill.successRate) {
              skill.successRate = Math.min(95, skill.successRate + card.effect.skillPowerBonus)
            }
          })
        }
      })
    }

    // 알림 표시
    showNotification(`${card.icon} ${card.name} 카드를 사용했습니다!`, 'success')
  }

  // 스크롤을 최신 로그로 이동
  setTimeout(() => {
    const container = document.querySelector('.story-battle-log')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, 100)
}

// 게임 시작시 전투 기록 불러오기
loadBattleRecords()

// 게임 초기화 시 god 페이지에서 선택한 카드들 추가
if (process.client && godStartCards.value && godStartCards.value.length > 0) {
  godStartCards.value.forEach((card: any) => {
    if (!playerPassiveCards.value.some(c => c.id === card.id)) {
      playerPassiveCards.value.push(card)
    }
  })
  console.log('초기 카드 추가됨:', godStartCards.value.length, '개')
}

// 이벤트 시스템
const {
  currentEvent,
  currentCrossroad,
  drawEventCard,
  selectPassiveCard,
  applyPassiveEffects,
  getRarityLabel,
  getTriggerLabel,
  canAffordChoice,
  selectChoice,
  closeEvent,
  selectCrossroadChoice,
  closeCrossroad
} = useEventSystem({
  kingdom,
  playerPassiveCards,
  showPassiveCardSelection,
  availablePassiveCards,
  permanentEffects,
  reincarnationData,
  showReincarnationModal,
  showNotification,
  calculateProduction,
  synergyDailyEffects,
  godGameState
})

// 이벤트 모달 닫기 핸들러 (선택 없이 닫기만 할 때)
const handleEventClose = () => {
  console.log('[handleEventClose] 호출됨')
  closeEvent()
  // 선택지를 고른 경우 handleEventSelectChoice에서 이미 자동 이동 처리했으므로
  // 여기서는 자동 이동하지 않음 (중복 방지)
}

// 이벤트 선택지 핸들러 (모험 중일 때 자동 이동)
const handleEventSelectChoice = (choiceIndex: number) => {
  console.log('[handleEventSelectChoice] 호출됨 - choice:', choiceIndex)
  selectChoice(choiceIndex)
  if (adventureState.value?.active) {
    console.log('[handleEventSelectChoice] 모험 중 - 다음 숫자 자동 사용')
    autoUseNextDice()
  } else {
    console.log('[handleEventSelectChoice] 모험 중이 아님')
  }
}

// 갈림길 모달 닫기 핸들러 (선택 없이 닫기만 할 때)
const handleCrossroadClose = () => {
  closeCrossroad()
  // 선택지를 고른 경우 handleCrossroadSelectChoice에서 이미 자동 이동 처리했으므로
  // 여기서는 자동 이동하지 않음 (중복 방지)
}

// 갈림길 선택지 핸들러 (모험 중일 때 자동 이동)
const handleCrossroadSelectChoice = (choiceIndex: number) => {
  selectCrossroadChoice(choiceIndex)
  if (adventureState.value?.active) {
    console.log('[handleCrossroadSelectChoice] 모험 중 - 다음 숫자 자동 사용')
    autoUseNextDice()
  }
}

// 게임 일수 기반 침략으로 변경 (handleNextDay에서 처리)

// 환생 모달이 열릴 때 보유한 모든 카드 표시 (중복 상속 가능)
watch(showReincarnationModal, (isOpen) => {
  if (isOpen && process.client) {
    // 보유한 모든 카드를 표시 (중복 상속 허용)
    reincarnationCardOptions.value = playerPassiveCards.value

    console.log('환생 가능한 카드:', reincarnationCardOptions.value.length, '장')
    console.log('이미 상속한 카드:', reincarnationData.inheritedCards.length, '장')
  }
})

// 자동 이동 완료 시 최종 칸의 이벤트 실행 및 다음 숫자 자동 사용
watch(
  () => moveCompletedNodeId.value,
  (nodeId) => {
    if (!nodeId) return

    console.log('[watch moveCompleted] 🎯 이동 완료 시그널 수신:', nodeId)

    // 100ms 후에 이벤트 트리거 (상태 안정화 대기)
    setTimeout(() => {
      const node = adventureState.value.nodes.find(n => n.id === nodeId)

      console.log('[watch moveCompleted] 📍 도착 노드:', {
        id: node?.id,
        type: node?.type,
        gridX: node?.gridX,
        gridY: node?.gridY,
        completed: node?.completed
      })

      if (node && !node.completed) {
        // 완료되지 않은 노드 - 이벤트 실행
        console.log('[watch moveCompleted] ✅ 이벤트 실행!')
        triggerNodeEvent(node)
      } else if (node && node.completed) {
        // 완료된 칸 - 다음 숫자 자동 사용
        console.log('[watch moveCompleted] ♻️ 이미 완료된 노드 - 다음 숫자 자동 사용')
        autoUseNextDice()
      } else {
        console.log('[watch moveCompleted] ⚠️ 노드를 찾을 수 없음')
      }

      // 시그널 초기화 (다음 이동을 위해)
      moveCompletedNodeId.value = null
    }, 100)
  }
)

// 현실시간 12일 경과 시 세계 멸망 및 게임 리셋
watch(
  () => remainingTime.value.isExpired,
  (isExpired) => {
    if (isExpired) {
      console.log('[게임 리셋] 현실시간 12일 경과 - 세계가 멸망합니다!')

      // 알림 표시
      showNotification('⚠️ 현실시간 12일이 경과했습니다! 세계가 멸망하여 게임이 초기화됩니다...', 'error')

      // 2초 후 게임 리셋
      setTimeout(() => {
        if (process.client) {
          // localStorage에서 게임 관련 데이터 제거 (환생 데이터는 유지)
          localStorage.removeItem('gameData')
          localStorage.removeItem('gameStartTime')
          localStorage.removeItem('invasionTracker')
          localStorage.removeItem('playerName')
          localStorage.removeItem('kingdomName')
          localStorage.removeItem('tutorialProgress')

          // 스토리 페이지로 리다이렉트
          window.location.href = '/story'
        }
      }, 2000)
    }
  }
)

// 이동마다 계명과 내정 카드 효과 적용
const applyMovementEffects = () => {
  let totalGold = 0
  let totalFood = 0
  let totalMorale = 0
  let totalSoldiers = 0

  // 1. 계명 효과 적용
  if (godGameState.value) {
    const effects = godGameState.value.commandmentEffects
    if (effects) {
      if (effects.gold) {
        kingdom.value.resources.gold += effects.gold
        totalGold += effects.gold
      }
      if (effects.food) {
        kingdom.value.resources.food += effects.food
        totalFood += effects.food
      }
      if (effects.morale) {
        kingdom.value.resources.morale = Math.min(100, Math.max(0, kingdom.value.resources.morale + effects.morale))
        totalMorale += effects.morale
      }
      if (effects.military) {
        kingdom.value.resources.soldiers += effects.military
        totalSoldiers += effects.military
      }
    }
  }

  // 2. 내정 카드 효과 적용 (daily 트리거)
  const domesticCards = cardDeck.value.domestic.filter(c => c !== null) as PassiveCard[]
  domesticCards.forEach(card => {
    if (card.effect) {
      if (card.effect.gold) {
        kingdom.value.resources.gold += card.effect.gold
        totalGold += card.effect.gold
      }
      if (card.effect.food) {
        kingdom.value.resources.food += card.effect.food
        totalFood += card.effect.food
      }
      if (card.effect.morale) {
        kingdom.value.resources.morale = Math.min(100, Math.max(0, kingdom.value.resources.morale + card.effect.morale))
        totalMorale += card.effect.morale
      }
      if (card.effect.military) {
        kingdom.value.resources.soldiers += card.effect.military
        totalSoldiers += card.effect.military
      }
    }
  })

  // 효과 알림 (변동이 있을 경우에만)
  if (totalGold !== 0 || totalFood !== 0 || totalMorale !== 0 || totalSoldiers !== 0) {
    let message = '이동 효과: '
    const effects = []
    if (totalGold !== 0) effects.push(`금 ${totalGold > 0 ? '+' : ''}${totalGold}`)
    if (totalFood !== 0) effects.push(`식량 ${totalFood > 0 ? '+' : ''}${totalFood}`)
    if (totalMorale !== 0) effects.push(`민심 ${totalMorale > 0 ? '+' : ''}${totalMorale}`)
    if (totalSoldiers !== 0) effects.push(`병력 ${totalSoldiers > 0 ? '+' : ''}${totalSoldiers}`)

    message += effects.join(', ')
    showNotification(message, 'success')
  }
}

// 이벤트 처리 완료 후 자동으로 다음 숫자 사용
const autoUseNextDice = () => {
  console.log('[autoUseNextDice] 🎲 호출됨')
  console.log('[autoUseNextDice] currentDiceIndex:', adventureState.value.currentDiceIndex)
  console.log('[autoUseNextDice] total:', adventureState.value.diceResults.length)
  console.log('[autoUseNextDice] diceResults:', adventureState.value.diceResults)
  console.log('[autoUseNextDice] adventureActive:', adventureState.value.active)

  // 모험이 비활성화되었는지 확인
  if (!adventureState.value.active) {
    console.log('[autoUseNextDice] ⚠️ 모험이 비활성화됨 - 중단')
    return
  }

  // 아직 사용할 숫자가 남아있으면 자동으로 다음 숫자 사용
  if (adventureState.value.currentDiceIndex < adventureState.value.diceResults.length) {
    console.log('[autoUseNextDice] ✅ 다음 숫자 사용 가능!')

    // 이동 전 계명 효과와 내정 카드 효과 적용
    applyMovementEffects()

    // 즉시 실행 (딜레이 제거)
    const steps = useNextDice()
    console.log('[autoUseNextDice] 다음 주사위:', steps, '칸')
    showNotification(`${steps}칸 이동합니다!`, 'info')

    setTimeout(() => {
      console.log('[autoUseNextDice] 자동 이동 시작!')
      startAutoMove(steps)
    }, 500) // 0.5초만 딜레이
  } else {
    // 모든 숫자 사용 완료 - 룰렛 다시 열기
    console.log('[autoUseNextDice] ✅ 모든 숫자 사용 완료 - 룰렛 다시 열기')

    // 진행 표시 숨기기
    showDiceProgress.value = false

    // 주사위 결과 초기화
    adventureState.value.diceResults = []
    adventureState.value.currentDiceIndex = 0

    setTimeout(() => {
      showDiceRoulette.value = true
      showNotification('모든 숫자를 사용했습니다! 다시 룰렛을 돌려주세요.', 'info')
    }, 800)
  }
}

// 조언자 모달 표시
const showAdvisorMessage = (message: any) => {
  currentAdvisorMessage.value = message
  showAdvisorModal.value = true
}

// 조언자 모달 닫기
const closeAdvisorModal = () => {
  showAdvisorModal.value = false

  // 보상 지급
  if (currentAdvisorMessage.value?.rewards) {
    const rewards = currentAdvisorMessage.value.rewards
    if (rewards.gold) kingdom.value.resources.gold += rewards.gold
    if (rewards.food) kingdom.value.resources.food += rewards.food
    if (rewards.soldiers) kingdom.value.resources.soldiers += rewards.soldiers
  }

  currentAdvisorMessage.value = null
}

// 패시브 카드 선택 핸들러 (모험 중일 때 자동 이동 재개)
const handlePassiveCardSelect = (card: any) => {
  console.log('[handlePassiveCardSelect] 카드 선택됨:', card.name)

  // 원래 selectPassiveCard 호출
  selectPassiveCard(card)

  // 모험 중일 때는 카드 선택 후 자동으로 다음 숫자 사용
  if (adventureState.value?.active) {
    console.log('[handlePassiveCardSelect] 모험 중 - 다음 숫자 자동 사용')
    setTimeout(() => {
      autoUseNextDice()
    }, 500) // 0.5초 딜레이
  }
}

// ==================== 모험 시스템 핸들러 ====================
// 노드 이벤트 트리거 (룰렛 자동 이동 후 호출됨)
const triggerNodeEvent = (node: any) => {
  console.log('[triggerNodeEvent] 노드 이벤트 트리거 - type:', node.type, 'gridX:', node.gridX, 'gridY:', node.gridY)

  // 모든 노드 타입에서 먼저 moveToNode 호출 (같은 층 다른 노드 비활성화)
  moveToNode(node.id)

  switch (node.type) {
    case 'start':
      // 시작 노드는 즉시 완료 처리
      const startNode = adventureState.value.nodes.find(n => n.id === node.id)
      if (startNode) {
        startNode.status = 'completed'
        startNode.completed = true
      }
      // currentNodeId는 유지 (다음 이동의 시작점으로 사용)

      // 다음 날 로직 실행
      processNextDay()

      // 시작 노드 완료 후 자동으로 다음 숫자 사용
      if (adventureState.value.active) {
        console.log('[triggerNodeEvent] 🚪 start 노드 완료')
        console.log('[triggerNodeEvent] ✅ 다음 숫자 사용 예약')
        console.log('[triggerNodeEvent] currentDiceIndex:', adventureState.value.currentDiceIndex, '/ total:', adventureState.value.diceResults.length)
        autoUseNextDice()
      } else {
        console.log('[triggerNodeEvent] ⚠️ 모험 중이 아님')
      }
      break

    case 'battle':
    case 'elite':
    case 'boss':
      // 전투 카드 선택 모달 표시
      if (node.enemy) {
        // 보스 전투인 경우 플래그 설정
        if (node.type === 'boss') {
          isBossBattle.value = true
        }

        pendingBattle.value = {
          enemyName: node.enemy.name,
          enemyPower: node.enemy.power,
          battleType: node.type === 'boss' ? 'empire' : 'normal'
        }

        // 카드 선택 모달 표시
        showBattleCardSelection.value = true
      }
      break

    case 'event':
      // 이벤트 노드는 즉시 완료 처리
      const eventNode = adventureState.value.nodes.find(n => n.id === node.id)
      if (eventNode) {
        eventNode.status = 'completed'
        eventNode.completed = true
      }
      // currentNodeId는 유지 (다음 이동의 시작점으로 사용)

      // 모험 중일 때는 이벤트 카드를 직접 뽑아야 함
      if (adventureState.value.active) {
        console.log('[triggerNodeEvent] ❓ event 노드 - 이벤트 카드 뽑기')
        drawEventCard()
        // 이벤트 선택/닫기 시 handleEventClose/handleEventSelectChoice에서 autoUseNextDice() 호출
      } else {
        // 일반 게임 모드에서는 processNextDay() 호출
        processNextDay()
      }
      break

    case 'shop':
      // 상점 모달 열기
      showAdventureShop.value = true
      break

    case 'rest':
      // 휴식처 모달 열기
      showAdventureRest.value = true
      break

    case 'treasure':
      // 보물 즉시 지급
      const treasureReward = {
        gold: Math.floor(Math.random() * 300) + 200, // 200~500
        food: Math.floor(Math.random() * 200) + 100, // 100~300
        cards: drawRandomCards(1)
      }
      completeNode(treasureReward)
      showNotification(
        `💎 보물 발견! 금 +${treasureReward.gold}, 식량 +${treasureReward.food}`,
        'success'
      )

      // 보물 노드는 즉시 완료 처리
      const treasureNode = adventureState.value.nodes.find(n => n.id === node.id)
      if (treasureNode) {
        treasureNode.status = 'completed'
        treasureNode.completed = true
      }
      // currentNodeId는 유지 (다음 이동의 시작점으로 사용)

      // 다음 날 로직 실행
      processNextDay()

      // 보물 노드 완료 후 자동으로 다음 숫자 사용
      if (adventureState.value.active) {
        console.log('[triggerNodeEvent] 💎 treasure 노드 완료')
        console.log('[triggerNodeEvent] ✅ 다음 숫자 사용 예약')
        console.log('[triggerNodeEvent] currentDiceIndex:', adventureState.value.currentDiceIndex, '/ total:', adventureState.value.diceResults.length)
        autoUseNextDice()
      } else {
        console.log('[triggerNodeEvent] ⚠️ 모험 중이 아님')
      }
      break
  }
}

// 모험 노드 클릭 처리 (사용자가 미로에서 직접 클릭)
const handleAdventureNodeClick = (node: any) => {
  console.log('Node clicked:', node.type, node)

  // 갈림길 선택 중일 때: 로드맵에서 직접 선택 가능
  if (adventureState.value.isSelectingPath) {
    // 선택 가능한 경로 중 하나인지 확인
    const isValidPath = adventureState.value.availablePaths.some(p => p.id === node.id)
    if (isValidPath) {
      selectPath(node.id)

      // 노드 타입별 아이콘
      const nodeIcons: Record<string, string> = {
        'battle': '⚔️',
        'elite': '🔥',
        'boss': '👑',
        'event': '❓',
        'shop': '🏪',
        'rest': '🏕️',
        'treasure': '💎',
        'start': '🚪'
      }
      const icon = nodeIcons[node.type] || '➡️'
      showNotification(`${icon} 방향으로 이동합니다!`, 'info')
    } else {
      showNotification('선택 가능한 경로가 아닙니다.', 'error')
    }
    return
  }

  // 완료된 칸을 다시 클릭한 경우: 인접한 칸이면 이동만 하고 이벤트는 실행하지 않음
  if (node.completed) {
    // 현재 노드와 인접한지 확인
    const currentNode = adventureState.value.nodes.find(n => n.id === adventureState.value.currentNodeId)
    if (currentNode && currentNode.connections.includes(node.id)) {
      moveToNode(node.id)
      showNotification('이미 완료한 칸으로 되돌아왔습니다.', 'info')
    } else {
      showNotification('현재 위치와 인접한 칸만 이동할 수 있습니다.', 'error')
    }
    return
  }

  // 사용 가능한(available) 칸을 클릭한 경우: 룰렛을 통해서만 이동 가능
  if (node.status === 'available') {
    showNotification('룰렛을 돌려서 이동해주세요!', 'info')
    return
  }

  // 잠긴(locked) 칸은 클릭 불가
  showNotification('아직 갈 수 없는 곳입니다.', 'error')
}

// 상점 닫기 처리
const handleAdventureShopClose = () => {
  console.log('[handleAdventureShopClose] 🏪 상점 닫기 호출됨')
  showAdventureShop.value = false

  // 현재 노드 완료 처리 및 다음 경로 선택 가능하게
  if (currentNode.value) {
    console.log('[handleAdventureShopClose] 현재 노드:', currentNode.value.type, currentNode.value.gridX, currentNode.value.gridY)
    currentNode.value.status = 'completed'
    currentNode.value.completed = true
    currentNode.value.connections.forEach(connId => {
      const connNode = adventureState.value.nodes.find(n => n.id === connId)
      if (connNode && connNode.status === 'locked') {
        connNode.status = 'available'
      }
    })
    // currentNodeId는 유지 (다음 이동의 시작점으로 사용)
    // adventureState.value.currentNodeId = null

    // 다음 날 로직 실행
    processNextDay()

    // 상점 완료 후 자동으로 다음 숫자 사용
    if (adventureState.value.active) {
      console.log('[handleAdventureShopClose] ✅ 모험 중 - 자동으로 다음 숫자 사용')
      console.log('[handleAdventureShopClose] currentDiceIndex:', adventureState.value.currentDiceIndex, '/ total:', adventureState.value.diceResults.length)
      autoUseNextDice()
    } else {
      console.log('[handleAdventureShopClose] ⚠️ 모험 중이 아님')
    }
  } else {
    console.log('[handleAdventureShopClose] ⚠️ currentNode가 없음')
  }
}

// 상점 구매 처리
const handleAdventureShopBuy = (itemType: 'soldiers' | 'food' | 'card' | 'heal') => {
  let purchased = false

  switch (itemType) {
    case 'soldiers':
      if (kingdom.value.resources.gold >= 400) {
        kingdom.value.resources.gold -= 400
        kingdom.value.resources.soldiers += 200
        showNotification('병사 200명 모집!', 'success')
        purchased = true
      }
      break

    case 'food':
      if (kingdom.value.resources.gold >= 200) {
        kingdom.value.resources.gold -= 200
        kingdom.value.resources.food += 500
        showNotification('식량 500 구매!', 'success')
        purchased = true
      }
      break

    case 'card':
      if (kingdom.value.resources.gold >= 300) {
        kingdom.value.resources.gold -= 300

        // 랜덤 카드 3장 제공
        availablePassiveCards.value = drawRandomCards(3)

        // 카드 선택 모달 표시 (handlePassiveCardSelect에서 자동 이동 재개)
        showPassiveCardSelection.value = true
        showNotification('카드를 선택하세요!', 'info')
        purchased = true
      }
      break

    case 'heal':
      if (kingdom.value.resources.food >= 200) {
        kingdom.value.resources.food -= 200
        const healAmount = Math.floor(adventureState.value.startingResources.soldiers * 0.1)
        kingdom.value.resources.soldiers += healAmount
        showNotification(`병력 ${healAmount}명 회복!`, 'success')
        purchased = true
      }
      break
  }

  // 구매가 성공했으면 상점 닫기 (카드 제외 - 카드는 선택 후 닫기)
  if (purchased && itemType !== 'card') {
    handleAdventureShopClose()
  }
}

// 휴식처 선택 처리
const handleAdventureRestSelect = (option: 'heal' | 'remove-card' | 'meditate') => {
  switch (option) {
    case 'heal':
      const healAmount = Math.floor(adventureState.value.startingResources.soldiers * 0.2)
      kingdom.value.resources.soldiers += healAmount
      showNotification(`🏕️ 휴식으로 병력 ${healAmount}명 회복!`, 'success')
      break

    case 'remove-card':
      // TODO: 카드 제거 모달 표시 (나중에 구현)
      showNotification('🗑️ 카드 정리 기능은 준비 중입니다', 'info')
      break

    case 'meditate':
      const randomGold = Math.floor(Math.random() * 200) + 100 // 100~300
      const randomFood = Math.floor(Math.random() * 150) + 50 // 50~200
      kingdom.value.resources.gold += randomGold
      kingdom.value.resources.food += randomFood
      showNotification(`🧘 명상... 금 +${randomGold}, 식량 +${randomFood}`, 'success')
      break
  }

  console.log('[handleAdventureRestSelect] 🏕️ 휴식처 선택:', option)
  showAdventureRest.value = false

  // 현재 노드 완료 처리 및 다음 경로 선택 가능하게
  if (currentNode.value) {
    console.log('[handleAdventureRestSelect] 현재 노드:', currentNode.value.type, currentNode.value.gridX, currentNode.value.gridY)
    currentNode.value.status = 'completed'
    currentNode.value.completed = true
    currentNode.value.connections.forEach(connId => {
      const connNode = adventureState.value.nodes.find(n => n.id === connId)
      if (connNode && connNode.status === 'locked') {
        connNode.status = 'available'
      }
    })
    // currentNodeId는 유지 (다음 이동의 시작점으로 사용)
    // adventureState.value.currentNodeId = null

    // 다음 날 로직 실행
    processNextDay()

    // 휴식처 완료 후 자동으로 다음 숫자 사용
    if (adventureState.value.active) {
      console.log('[handleAdventureRestSelect] ✅ 모험 중 - 자동으로 다음 숫자 사용')
      console.log('[handleAdventureRestSelect] currentDiceIndex:', adventureState.value.currentDiceIndex, '/ total:', adventureState.value.diceResults.length)
      autoUseNextDice()
    } else {
      console.log('[handleAdventureRestSelect] ⚠️ 모험 중이 아님')
    }
  } else {
    console.log('[handleAdventureRestSelect] ⚠️ currentNode가 없음')
  }
}

// 전투 카드 선택 취소 (도망가기)
const handleBattleCardCancel = () => {
  showBattleCardSelection.value = false

  // 모험 중일 때: 전투를 건너뛰고 현재 노드를 완료 처리한 후 다음 숫자 사용
  if (adventureState.value?.active && currentNode.value) {
    console.log('[handleBattleCardCancel] 전투 회피 - 다음 숫자 사용')

    // 현재 노드를 완료 처리 (전투를 피했지만 방문은 완료)
    currentNode.value.status = 'completed'
    currentNode.value.completed = true

    // 보스 전투 플래그 초기화
    if (isBossBattle.value) {
      isBossBattle.value = false
    }

    // 다음 숫자 자동 사용
    setTimeout(() => {
      autoUseNextDice()
    }, 300)
  }
}

// 전투 카드 선택 완료 후 전투 시작
const handleBattleCardsConfirm = () => {
  showBattleCardSelection.value = false

  // 배틀 덱 초기화
  clearBattleDeck()

  // 덱의 전투 슬롯 카드를 액티브 카드로 변환하여 추가
  const deckBattleCards = convertPassiveCardsToActiveCards(cardDeck.value.battle)
  deckBattleCards.forEach(card => {
    addToBattleDeck(card)
  })

  // 로그
  console.log(`덱 전투 카드 ${deckBattleCards.length}장:`, deckBattleCards.map(c => c.name))
  console.log('총 battleActiveCards:', battleActiveCards.value)

  // 전투 시작
  startStoryBattle(
    pendingBattle.value.enemyName,
    pendingBattle.value.enemyPower,
    pendingBattle.value.battleType
  )
}

// 모험 전투 종료 후 처리
const handleAdventureBattleEnd = (result: 'victory' | 'defeat') => {
  if (!currentNode.value || !currentNode.value.enemy) return

  // 보스 전투인 경우
  if (isBossBattle.value) {
    if (result === 'victory') {
      // 보스 승리: 보상 지급 + 환생 카드 선택 + 메인 화면 유지
      const bossReward = {
        gold: 5000,
        food: 3000,
        soldiers: 1000
      }
      kingdom.value.resources.gold += bossReward.gold
      kingdom.value.resources.food += bossReward.food
      kingdom.value.resources.soldiers += bossReward.soldiers

      showNotification(`👑 보스 처치! 금 +${bossReward.gold}, 식량 +${bossReward.food}, 병력 +${bossReward.soldiers}`, 'success')

      // 모험 완료
      completeAdventure()

      // 환생 모달 표시 (승리해도 카드 선택 가능, 하지만 스토리로 이동하지 않음)
      setTimeout(() => {
        isBossBattle.value = false
        isBossBattleVictory.value = true // 승리 플래그 설정
        showReincarnationModal.value = true
      }, 1000)
    } else {
      // 보스 패배: 환생 모달 표시 (스토리로 이동)
      setTimeout(() => {
        isBossBattle.value = false
        isBossBattleVictory.value = false
        showReincarnationModal.value = true
      }, 500)
    }
    return
  }

  // 일반 전투인 경우
  if (result === 'victory') {
    // 보상 지급
    completeNode(currentNode.value.enemy.rewards)
    showNotification(
      `승리! 금 +${currentNode.value.enemy.rewards.gold}, 식량 +${currentNode.value.enemy.rewards.food}`,
      'success'
    )

    // 카드 보상이 있는지 확인
    const hasCardReward = currentNode.value.enemy.rewards.cards && currentNode.value.enemy.rewards.cards.length > 0

    // 카드 보상이 있으면 카드 선택 모달 표시
    if (hasCardReward) {
      availablePassiveCards.value = currentNode.value.enemy.rewards.cards
      showPassiveCardSelection.value = true
      console.log('[handleAdventureBattleEnd] 카드 선택 모달 표시 - 자동 이동은 카드 선택 후 재개')
    }

    // 현재 노드를 완료 상태로 변경하고, 연결된 노드들을 선택 가능하게 만들기
    currentNode.value.status = 'completed'
    currentNode.value.completed = true

    // 연결된 노드들을 available로 변경 (사용자가 선택할 수 있도록)
    currentNode.value.connections.forEach(connId => {
      const connNode = adventureState.value.nodes.find(n => n.id === connId)
      if (connNode && connNode.status === 'locked') {
        connNode.status = 'available'
      }
    })

    // currentNodeId는 유지 (다음 이동의 시작점으로 사용)
    // adventureState.value.currentNodeId = null

    // 다음 날 로직 실행
    processNextDay()

    // 전투 완료 후 자동으로 다음 숫자 사용 (모험 중이고 카드 보상이 없을 때만)
    if (adventureState.value.active && !hasCardReward) {
      console.log('[handleAdventureBattleEnd] ⚔️ 전투 승리 - 카드 보상 없음')
      console.log('[handleAdventureBattleEnd] ✅ 자동으로 다음 숫자 사용')
      console.log('[handleAdventureBattleEnd] currentDiceIndex:', adventureState.value.currentDiceIndex, '/ total:', adventureState.value.diceResults.length)
      autoUseNextDice()
    } else if (adventureState.value.active && hasCardReward) {
      console.log('[handleAdventureBattleEnd] ⚔️ 전투 승리 - 카드 보상 있음, 카드 선택 후 재개')
    } else {
      console.log('[handleAdventureBattleEnd] ⚠️ 모험 중이 아님')
    }
  } else {
    // 패배 - 병력 손실하고 계속 진행
    const lostSoldiers = Math.floor(kingdom.value.resources.soldiers * 0.3)
    kingdom.value.resources.soldiers = Math.max(0, kingdom.value.resources.soldiers - lostSoldiers)

    showNotification(
      `패배... 병력 ${lostSoldiers}명 손실. 모험은 계속됩니다.`,
      'error'
    )

    // 현재 노드를 완료 상태로 변경 (패배해도 다시 싸우지 않음)
    currentNode.value.status = 'completed'
    currentNode.value.completed = true

    // 연결된 노드들을 available로 변경
    currentNode.value.connections.forEach(connId => {
      const connNode = adventureState.value.nodes.find(n => n.id === connId)
      if (connNode && connNode.status === 'locked') {
        connNode.status = 'available'
      }
    })

    // currentNodeId는 유지 (다음 이동의 시작점으로 사용)
    // adventureState.value.currentNodeId = null

    // 다음 날 로직 실행
    processNextDay()

    // 패배 후에도 자동으로 다음 숫자 사용 (모험 중일 때만)
    if (adventureState.value.active) {
      console.log('[handleAdventureBattleEnd] ⚔️ 전투 패배')
      console.log('[handleAdventureBattleEnd] ✅ 자동으로 다음 숫자 사용')
      console.log('[handleAdventureBattleEnd] currentDiceIndex:', adventureState.value.currentDiceIndex, '/ total:', adventureState.value.diceResults.length)
      autoUseNextDice()
    } else {
      console.log('[handleAdventureBattleEnd] ⚠️ 모험 중이 아님')
    }
  }
}

// 0회차로 완전 리셋 (환생 데이터 및 모든 진행도 초기화)
const resetToZero = () => {
  if (process.client) {
    // 모든 게임 데이터 삭제
    localStorage.removeItem('reincarnationData')
    localStorage.removeItem('gameData')
    localStorage.removeItem('passiveCards')
    localStorage.removeItem('gameStartTime')
    localStorage.removeItem('tutorialState')
    localStorage.removeItem('synergyCards')

    showNotification('게임을 처음부터 다시 시작합니다...', 'info')

    // 1초 후 페이지 새로고침
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }
}

// 다음 날 진행 로직 (노드 완료 시 자동 실행)
const processNextDay = () => {
  console.log('[processNextDay] 호출됨 - day:', kingdom.value.day, '→', kingdom.value.day + 1, 'adventureActive:', adventureState.value?.active)

  // 하루 증가
  kingdom.value.day++

  // 모험 중일 때는 특별 이벤트 스킵
  if (adventureState.value?.active) {
    console.log('[processNextDay] 모험 중 - 특별 이벤트 스킵')
    showNotification(`${kingdom.value.day}일차`, 'info')
    return
  }

  // 튜토리얼 이벤트 체크
  const tutorialEvent = advanceDay(kingdom.value.day)
  if (tutorialEvent) {
    // 조언자 모달 표시
    showAdvisorMessage(tutorialEvent)
    return
  }

  // 제국 침략 체크 (7일마다: 7, 14, 21, 28, 35일)
  if (kingdom.value.day % 7 === 0 && kingdom.value.day > 0 && kingdom.value.day < 42) {
    const weekNumber = kingdom.value.day / 7
    showNotification(`⚔️ ${weekNumber}주차! 제국군이 전면 침략해옵니다!`, 'error')

    // 침략 플래그 설정
    isWeeklyInvasion.value = true
    selectBattleType('pve', 'empire')
    return
  }

  // 42일 도달 시 완전 리셋 (게임 일수 기반)
  if (kingdom.value.day >= 42) {
    showNotification('🔄 42일이 지났습니다. 게임을 처음부터 다시 시작합니다...', 'info')
    // 완전 리셋 (환생이 아님)
    setTimeout(() => {
      resetToZero()
    }, 2000)
    return
  }

  // 일반 날짜: 이벤트 없음, 로드맵 진행만 계속
  showNotification(`${kingdom.value.day}일차가 시작되었습니다.`, 'info')
}

// 일일 카드 교환 건너뛰기
const handleSkipDailyExchange = () => {
  showDailyCardExchange.value = false
  showNotification('카드 교환을 건너뛰었습니다.', 'info')
}

// 카드 교환 처리
const handleCardExchange = (oldCard: PassiveCard, newCard: PassiveCard) => {
  const index = playerPassiveCards.value.findIndex(c => c.id === oldCard.id)
  if (index !== -1) {
    playerPassiveCards.value.splice(index, 1, newCard)
    showNotification(`${oldCard.name}을(를) ${newCard.name}(으)로 교환했습니다!`, 'success')
    showDailyCardExchange.value = false
  }
}

// 패시브 카드 추가 (15장 제한) - useEventSystem의 selectPassiveCard와 별도
const addPassiveCardWithLimit = (card: PassiveCard): boolean => {
  // 이미 보유 중인지 확인
  const alreadyOwned = playerPassiveCards.value.some(c => c.id === card.id)
  if (alreadyOwned) {
    showNotification('이미 보유한 카드입니다!', 'error')
    return false
  }

  // 최대 보유 수 확인
  if (playerPassiveCards.value.length >= MAX_PASSIVE_CARDS) {
    showNotification(`최대 ${MAX_PASSIVE_CARDS}장까지만 보유할 수 있습니다!`, 'error')
    return false
  }

  playerPassiveCards.value.push(card)
  return true
}

// 일일 카드 추가 (보유 카드가 없을 때)
const handleAddDailyCard = (card: PassiveCard) => {
  if (addPassiveCardWithLimit(card)) {
    showNotification(`${card.name} 카드를 획득했습니다!`, 'success')
    showDailyCardExchange.value = false
  }
}

// ==================== PVP 함수 - 주석 처리됨 ====================
/*
// PVP 상대 선택
const selectPVPOpponent = (opponent: PlayerProfile) => {
  selectedOpponent.value = opponent
  showPVPSelection.value = false
  startStoryBattle()
}
*/
// ==================== PVP 함수 끝 ====================

// ==================== 튜토리얼 스토리 ====================
// 스토리 완료 핸들러
const handleStoryComplete = () => {
  completeStory()
  showNotification('이제 왕국의 기반이 될 카드를 선택하세요', 'info')
}

// 시작 카드 옵션 (기본 카드 풀에서 선택)
const startCardOptions = computed(() => {
  // availablePassiveCards에서 9개 정도를 제공
  const allCards = availablePassiveCards.value || []
  // 일반 ~ 희귀 등급 카드만 선택
  const basicCards = allCards.filter(card =>
    card.rarity === 'common' || card.rarity === 'rare'
  )
  // 최대 9개까지
  return basicCards.slice(0, 9)
})

// 시작 카드 선택 완료 핸들러
const handleStartCardsSelected = (cards: any[]) => {
  // 선택한 카드를 패시브 카드에 추가
  let addedCount = 0
  cards.forEach(card => {
    if (addPassiveCardWithLimit(card)) {
      addedCount++
    }
  })

  completeStartCardSelection()
  showNotification(`${addedCount}개의 카드를 획득했습니다!`, 'success')
}

// 전장의 기록 튜토리얼 완료 핸들러 (0일차 -> 1일차)
const handleBattleTutorialComplete = () => {
  // 전투 재개
  manualResumeBattle()

  // 0일차일 때만 1일차로 진행
  if (kingdom.value.day === 0) {
    kingdom.value.day = 1
    showNotification('⚔️ 전투 준비 완료! 1일차가 시작됩니다!', 'success')
  } else {
    showNotification('⚔️ 전투 가이드를 완료했습니다!', 'success')
  }
}

// 전장의 기록 튜토리얼 일시정지 핸들러
const handleBattleTutorialPause = (isPausedTutorial: boolean) => {
  // 튜토리얼 시작 시: 타이머 정지 + 전투 일시정지
  if (isPausedTutorial) {
    stopCardSelectionTimer()
    manualPauseBattle() // 전투 로그 진행 멈추기
  }
}
// ==================== 튜토리얼 스토리 끝 ====================

onMounted(() => {
  if (process.client) {
    // 카드 덱 로드
    loadDeck()

    // 전투 히스토리 로드
    loadBattleHistory()

    // 디버깅: tutorialState 확인
    console.log('📘 Tutorial State:', {
      currentDay: kingdom.value.day,
      hasSelectedStartCards: tutorialState.value?.hasSelectedStartCards,
      tutorialCompleted: tutorialState.value?.tutorialCompleted,
      showTutorial: showTutorial.value,
      fullState: tutorialState.value
    })

    // 메인 튜토리얼 표시 - 테스트용: 무조건 표시
    console.log('✅ Tutorial will show in 500ms')
    setTimeout(() => {
      showTutorial.value = true
      console.log('🎯 showTutorial set to:', showTutorial.value)
    }, 500)

    // 기본 BGM 재생
    playBGM('base', { loop: true, volume: 0.3 })
  }
})

onUnmounted(() => {
  // 컴포넌트 언마운트 시 BGM 정지
  stopBGM()
})

</script>
