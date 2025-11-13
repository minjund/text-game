<template>
  <div class="min-h-screen text-white flex flex-col overflow-hidden relative bg-cover bg-center bg-no-repeat" style="background-image: url('/images/background/base_back_groud.png');">
    <!-- Background Overlay -->
    <div class="absolute inset-0 bg-black/40 z-0"></div>

    <!-- Content Wrapper -->
    <div class="relative z-10 flex flex-col min-h-screen">
    <!-- Start Card Selection (After Story) -->
    <GameStartCardSelection
      v-if="tutorialState.storyCompleted && !tutorialState.hasSelectedStartCards"
      :cards="startCardOptions"
      @confirm="handleStartCardsSelected"
    />

    <!-- Mobile Top Resources (Fixed) -->
    <GameMobileResources
      v-if="!adventureState.active"
      :resources="kingdom.resources"
      :timer="remainingTime"
      :current-day="kingdom.day"
      :reincarnation-count="reincarnationData.count"
      :commandment-effects="commandmentEffects"
      @show-resource-help="handleShowResourceHelp"
    />

    <!-- Desktop Header -->
    <GameDesktopHeader
      v-if="!adventureState.active"
      :kingdom-name="kingdom.name"
      :day="kingdom.day"
      :resources="kingdom.resources"
      @show-resource-help="handleShowResourceHelp"
    />

    <!-- Desktop Main Content -->
    <div v-if="!adventureState.active" class="hidden md:flex flex-1 max-w-7xl mx-auto w-full p-8 gap-8">
      <!-- Left Sidebar - Stats -->
      <GameLeftSidebar
        :timer="remainingTime"
        :current-day="kingdom.day"
        :commandment-effects="commandmentEffects"
      />

      <!-- Center - Main Game Area with Character -->
<!--      <div class="flex-1 flex items-center justify-center relative">-->
<!--        <GameCharacter />-->
<!--      </div>-->

          <!-- Right Sidebar - Actions -->
      <GameActionPanel
        :unlocked-features="tutorialState.unlockedFeatures"
        @show-commandments="showCommandments = true"
        @show-passive-cards="showPassiveCardsCollection = true"
        @show-card-guide="showSynergyGuide = true"
        @start-normal-battle="startAdventure"
        @next-day="handleNextDay"
        @recruit-soldiers="recruitSoldiers"
      />
    </div>

    <!-- Mobile Main Content -->
<!--    <div class="md:hidden flex-1 overflow-hidden px-3 pt-32 pb-20 flex flex-col gap-3 justify-center relative">-->
<!--      <GameCharacter />-->
<!--    </div>-->

    <!-- Mobile Bottom Action Buttons (Fixed) -->
    <GameMobileActions
      v-if="!adventureState.active"
      :unlocked-features="tutorialState.unlockedFeatures"
      @show-commandments="showCommandments = true"
      @show-passive-cards="showPassiveCardsCollection = true"
      @show-card-guide="showSynergyGuide = true"
      @start-normal-battle="startAdventure"
      @next-day="handleNextDay"
      @recruit-soldiers="recruitSoldiers"
    />


    <!-- Event Card Modal -->
    <GameEventModal
      :event="currentEvent"
      :current-resources="kingdom.resources"
      @close="closeEvent"
      @select-choice="selectChoice"
    />

    <!-- Crossroad Modal -->
    <GameCrossroadModal
      :crossroad="currentCrossroad"
      @close="closeCrossroad"
      @select-choice="selectCrossroadChoice"
    />

    <!-- Story Battle Modal -->
    <GameBattleModal
      :battle="currentBattle"
      :is-scrolling="isScrolling"
      @close="closeBattle"
    />

    <!-- Passive Card Selection Modal -->
    <GamePassiveCardModal
      :show="showPassiveCardSelection"
      :cards="availablePassiveCards"
      @select-card="selectPassiveCard"
    />

    <!-- Reincarnation Modal -->
    <GameReincarnationModal
      :show="showReincarnationModal"
      :available-cards="reincarnationCardOptions"
      :reincarnation-count="reincarnationData.count"
      :highest-day="Math.max(reincarnationData.highestDay, kingdom.day)"
      :total-days-played="reincarnationData.totalDaysPlayed + kingdom.day"
      @select-card="selectInheritedCard"
      @reincarnate-without-card="reincarnateWithoutCard"
    />

    <!-- Passive Cards Collection Modal -->
    <GamePassiveCardsModal
      :show="showPassiveCardsCollection"
      :passive-cards="playerPassiveCards"
      @close="showPassiveCardsCollection = false"
    />

    <!-- Commandments Modal -->
    <GameCommandmentsModal
      :show="showCommandments"
      :commandments="godGameState?.selectedCommandments || []"
      @close="showCommandments = false"
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
      v-if="adventureState.active"
      :nodes="adventureState.nodes"
      :current-node-id="adventureState.currentNodeId"
      :accumulated-rewards="adventureState.accumulatedRewards"
      @node-click="handleAdventureNodeClick"
      @retreat="retreatAdventure"
    />

    <!-- Adventure Shop Modal -->
    <GameAdventureShop
      :show="showAdventureShop"
      :current-gold="kingdom.resources.gold"
      :current-food="kingdom.resources.food"
      @close="() => { showAdventureShop = false; if (currentNode) moveToNode(currentNode.id) }"
      @buy="handleAdventureShopBuy"
    />

    <!-- Adventure Rest Modal -->
    <GameAdventureRest
      :show="showAdventureRest"
      @close="showAdventureRest = false"
      @select="handleAdventureRestSelect"
    />

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
import { ref, computed, watch } from 'vue'
import type { PermanentEffect } from '../types/game'
import type { PassiveCard } from '../types/passive-cards'
import { drawRandomCards } from '../types/passive-cards'
import { enemyKingdoms } from '../data/mockData'
import { useGodGame } from '~/composables/useGodGame'

// 새로 만든 컴포넌트 import
import GameStartCardSelection from '~/components/game/GameStartCardSelection.vue'
import GameMobileResources from '~/components/game/GameMobileResources.vue'
import GameMobileActions from '~/components/game/GameMobileActions.vue'
import GameDesktopHeader from '~/components/game/GameDesktopHeader.vue'
import GameLeftSidebar from '~/components/game/GameLeftSidebar.vue'
import GameActionPanel from '~/components/game/GameActionPanel.vue'
import GameBattleModal from '~/components/game/GameBattleModal.vue'
import GameGeneralsModal from '~/components/game/GameGeneralsModal.vue'
import GameEventModal from '~/components/game/GameEventModal.vue'
import GameCrossroadModal from '~/components/game/GameCrossroadModal.vue'
import GamePassiveCardModal from '~/components/game/GamePassiveCardModal.vue'
import GameReincarnationModal from '~/components/game/GameReincarnationModal.vue'
import GamePassiveCardsModal from '~/components/game/GamePassiveCardsModal.vue'
import GameCommandmentsModal from '~/components/game/GameCommandmentsModal.vue'
import GameAdvisorModal from '~/components/game/GameAdvisorModal.vue'
import GameSynergyCardSelection from '~/components/game/GameSynergyCardSelection.vue'
import GameSynergyCollection from '~/components/game/GameSynergyCollection.vue'
import GameSynergyGuide from '~/components/game/GameSynergyGuide.vue'
import GameDailyCardExchange from '~/components/game/GameDailyCardExchange.vue'
import GameResourceHelp from '~/components/game/GameResourceHelp.vue'
import GameAdventureMap from '~/components/game/GameAdventureMap.vue'
import GameAdventureShop from '~/components/game/GameAdventureShop.vue'
import GameAdventureRest from '~/components/game/GameAdventureRest.vue'

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

// 신 게임 상태 가져오기
const { nationState: godGameState, startCards: godStartCards } = useGodGame()

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

// 게임 타이머 (게임 일수 기반)
const remainingTime = computed(() => {
  const daysLeft = Math.max(0, 42 - kingdom.value.day)
  return {
    days: daysLeft,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: daysLeft === 0
  }
})

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

// 시너지 카드 컬렉션 모달
const showSynergyCardsCollection = ref(false)

// 시너지 카드 도감 모달
const showSynergyGuide = ref(false)

// 일일 카드 교환 모달
const showDailyCardExchange = ref(false)
const availableDailyCards = ref<PassiveCard[]>([])

// 신의 계명 모달
const showCommandments = ref(false)

// 자원 도움말 모달
const showResourceHelp = ref(false)
const selectedResourceType = ref<'food' | 'gold' | 'morale' | 'soldiers' | null>(null)

// 자원 도움말 핸들러
const handleShowResourceHelp = (type: 'food' | 'gold' | 'morale' | 'soldiers') => {
  selectedResourceType.value = type
  showResourceHelp.value = true
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

// 모험 시스템
const {
  adventureState,
  currentNode,
  availableNodes,
  startAdventure,
  moveToNode,
  completeNode,
  completeAdventure,
  retreatAdventure,
  failAdventure,
  NODE_INFO
} = useAdventureSystem(kingdom.value.resources, showNotification)

// 모험 관련 모달 상태
const showAdventureShop = ref(false)
const showAdventureRest = ref(false)

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
  currentBattleMode
} = useBattleSystem({
  kingdom,
  enemyKingdoms,
  permanentEffects,
  empire,
  showNotification,
  synergyBattleEffects,
  isWeeklyInvasion,
  showReincarnationModal
})

// 전투 종료 처리 (제국 전투 패배 시에만 환생 모달 표시)
const closeBattle = () => {
  // 전투 결과 및 모드 확인
  const battleResult = currentBattle.value?.result
  const battleMode = currentBattleMode.value

  // 기존 closeBattle 로직 실행
  closeBattleInternal()

  // 모험 모드인 경우
  if (adventureState.value.active) {
    handleAdventureBattleEnd(battleResult as 'victory' | 'defeat')
    return
  }

  // 제국 전투 패배한 경우에만 환생 모달 표시
  if (battleResult === 'defeat' && battleMode === 'empire') {
    setTimeout(() => {
      if (isWeeklyInvasion) {
        isWeeklyInvasion.value = false
      }
      showReincarnationModal.value = true
    }, 500)
  }
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

// 게임 일수 기반 침략으로 변경 (handleNextDay에서 처리)

// 환생 모달이 열릴 때 랜덤 카드 3장 생성
watch(showReincarnationModal, (isOpen) => {
  if (isOpen && process.client) {
    // 전체 카드 풀에서 랜덤 3장 선택
    reincarnationCardOptions.value = drawRandomCards(3)
  }
})

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

// ==================== 모험 시스템 핸들러 ====================
// 모험 노드 클릭 처리
const handleAdventureNodeClick = (node: any) => {
  console.log('Node clicked:', node.type, node)

  switch (node.type) {
    case 'start':
      // 시작 노드는 자동으로 다음으로 이동
      moveToNode(node.id)
      break

    case 'battle':
    case 'elite':
    case 'boss':
      // 전투 시작 (전투 후 handleAdventureBattleEnd에서 노드 이동)
      if (node.enemy) {
        startStoryBattle(
          node.enemy.name,
          node.enemy.power,
          node.type === 'boss' ? 'empire' : 'normal'
        )
      }
      break

    case 'event':
      // 랜덤 이벤트 발생 (다음날 기능과 동일)
      const cardEventChance = Math.random()
      if (cardEventChance < 0.1) { // 10% 확률로 카드 교환 이벤트
        availableDailyCards.value = drawRandomCards(3)
        showDailyCardExchange.value = true
      } else {
        // 일반 이벤트 발생
        drawEventCard()
      }
      moveToNode(node.id)
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
      moveToNode(node.id)
      break
  }
}

// 상점 구매 처리
const handleAdventureShopBuy = (itemType: 'soldiers' | 'food' | 'card' | 'heal') => {
  switch (itemType) {
    case 'soldiers':
      if (kingdom.value.resources.gold >= 400) {
        kingdom.value.resources.gold -= 400
        kingdom.value.resources.soldiers += 200
        showNotification('병사 200명 모집!', 'success')
      }
      break

    case 'food':
      if (kingdom.value.resources.gold >= 200) {
        kingdom.value.resources.gold -= 200
        kingdom.value.resources.food += 500
        showNotification('식량 500 구매!', 'success')
      }
      break

    case 'card':
      if (kingdom.value.resources.gold >= 300) {
        kingdom.value.resources.gold -= 300
        // 카드 선택 모달 표시
        showPassiveCardSelection.value = true
        showNotification('카드를 선택하세요!', 'info')
      }
      break

    case 'heal':
      if (kingdom.value.resources.food >= 200) {
        kingdom.value.resources.food -= 200
        const healAmount = Math.floor(adventureState.value.startingResources.soldiers * 0.1)
        kingdom.value.resources.soldiers += healAmount
        showNotification(`병력 ${healAmount}명 회복!`, 'success')
      }
      break
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

  showAdventureRest.value = false
  if (currentNode.value) {
    moveToNode(currentNode.value.id)
  }
}

// 모험 전투 종료 후 처리
const handleAdventureBattleEnd = (result: 'victory' | 'defeat') => {
  if (!currentNode.value || !currentNode.value.enemy) return

  if (result === 'victory') {
    // 보상 지급
    completeNode(currentNode.value.enemy.rewards)
    showNotification(
      `승리! 금 +${currentNode.value.enemy.rewards.gold}, 식량 +${currentNode.value.enemy.rewards.food}`,
      'success'
    )

    // 카드 보상이 있으면 카드 선택 모달 표시
    if (currentNode.value.enemy.rewards.cards && currentNode.value.enemy.rewards.cards.length > 0) {
      availablePassiveCards.value = currentNode.value.enemy.rewards.cards
      showPassiveCardSelection.value = true
    }

    // 보스 처치 시 모험 완료
    if (currentNode.value.type === 'boss') {
      completeAdventure()
      return
    }

    // 다음 노드로 이동 가능하게 만들기
    moveToNode(currentNode.value.id)
  } else {
    // 패배
    failAdventure()
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

// 다음 날 진행 핸들러
const handleNextDay = () => {
  // 튜토리얼 이벤트 체크
  const tutorialEvent = advanceDay(kingdom.value.day + 1)
  if (tutorialEvent) {
    // 조언자 모달 표시
    showAdvisorMessage(tutorialEvent)
    return
  }

  // 제국 침략 체크 (다음 날짜가 7일마다: 7, 14, 21, 28, 35일)
  const nextDay = kingdom.value.day + 1
  if (nextDay % 7 === 0 && nextDay > 0 && nextDay < 42) {
    // 먼저 day를 증가시킴
    kingdom.value.day++

    const weekNumber = kingdom.value.day / 7
    showNotification(`⚔️ ${weekNumber}주차! 제국군이 전면 침략해옵니다!`, 'error')

    // 침략 플래그 설정
    isWeeklyInvasion.value = true
    selectBattleType('pve', 'empire')
    return
  }

  // 42일 도달 시 최종 체크 (게임 일수 기반)
  if (kingdom.value.day >= 42) {
    if (empire.value?.defeated) {
      showNotification('🎉 축하합니다! 아카샤 대제국을 무너뜨렸습니다!', 'success')
      // 환생 모달 표시
      setTimeout(() => {
        showReincarnationModal.value = true
      }, 2000)
    } else {
      showNotification('😢 시간 초과! 제국을 무너뜨리지 못했습니다...', 'error')
      // 환생 모달 표시
      setTimeout(() => {
        showReincarnationModal.value = true
      }, 2000)
    }
    return
  }

  // 25일마다 시너지 카드 선택 (100일 제외)
  if (kingdom.value.day % 25 === 0 && kingdom.value.day > 0 && kingdom.value.day !== 100) {
    // 먼저 하루를 진행
    drawEventCard()
    // 시너지 카드 선택 모달 표시
    drawSynergyCards()
    showNotification('🎴 25일이 지났습니다! 시너지 카드를 선택하세요!', 'info')
    return
  }

  // 일반 날짜: 랜덤으로 카드 교환 이벤트 또는 일반 이벤트
  const cardEventChance = Math.random()
  if (cardEventChance < 0.1) { // 10% 확률로 카드 교환 이벤트 발생
    availableDailyCards.value = drawRandomCards(3)
    showDailyCardExchange.value = true
  } else {
    // 일반 이벤트 카드 뽑기
    drawEventCard()
  }
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

// 일일 카드 추가 (보유 카드가 없을 때)
const handleAddDailyCard = (card: PassiveCard) => {
  playerPassiveCards.value.push(card)
  showNotification(`${card.name} 카드를 획득했습니다!`, 'success')
  showDailyCardExchange.value = false
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
  cards.forEach(card => {
    selectPassiveCard(card)
  })

  completeStartCardSelection()
  showNotification(`${cards.length}개의 카드를 획득했습니다!`, 'success')
}
// ==================== 튜토리얼 스토리 끝 ====================

</script>
