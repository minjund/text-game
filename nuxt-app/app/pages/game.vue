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
      :resources="kingdom.resources"
      :timer="remainingTime"
      :turn-data="turnData"
      :current-day="kingdom.day"
      :reincarnation-count="reincarnationData.count"
      :commandment-effects="commandmentEffects"
    />

    <!-- Desktop Header -->
    <GameDesktopHeader
      :kingdom-name="kingdom.name"
      :day="kingdom.day"
      :resources="kingdom.resources"
    />

    <!-- Desktop Main Content -->
    <div class="hidden md:flex flex-1 max-w-7xl mx-auto w-full p-8 gap-8">
      <!-- Left Sidebar - Stats -->
      <GameLeftSidebar
        :timer="remainingTime"
        :turn-data="turnData"
        :current-day="kingdom.day"
        :commandment-effects="commandmentEffects"
        @recharge-all-turns="rechargeAllTurns"
      />

      <!-- Center - Main Game Area with Character -->
<!--      <div class="flex-1 flex items-center justify-center relative">-->
<!--        <GameCharacter />-->
<!--      </div>-->

          <!-- Right Sidebar - Actions -->
      <GameActionPanel
        :unlocked-features="tutorialState.unlockedFeatures"
        @show-generals="showGenerals = true"
        @show-commandments="showCommandments = true"
        @show-passive-cards="showPassiveCardsCollection = true"
        @show-card-guide="showSynergyGuide = true"
        @start-battle="selectBattleType('pve')"
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
      :unlocked-features="tutorialState.unlockedFeatures"
      @show-generals="showGenerals = true"
      @show-commandments="showCommandments = true"
      @show-passive-cards="showPassiveCardsCollection = true"
      @show-card-guide="showSynergyGuide = true"
      @start-battle="selectBattleType('pve')"
      @next-day="handleNextDay"
      @recruit-soldiers="recruitSoldiers"
    />

    <!-- Generals Modal -->
    <GameGeneralsModal
      :show="showGenerals"
      :generals="generals"
      :max-soldiers="kingdom.resources.soldiers"
      @close="handleCloseGeneralsModal"
      @dismiss-general="dismissGeneral"
      @assign-soldiers="handleAssignSoldiers"
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

// Composables
import { useNotification } from '~/composables/useNotification'
import { useRealTimeGameTimer } from '~/composables/useRealTimeGameTimer'
import { useTurnSystem } from '~/composables/useTurnSystem'
import { useTutorial } from '~/composables/useTutorial'
import { useGameKingdom } from '~/composables/useGameKingdom'
import { useGameGenerals } from '~/composables/useGameGenerals'
import { useGamePassiveCards } from '~/composables/useGamePassiveCards'
import { useGameReincarnation } from '~/composables/useGameReincarnation'
import { useBattleSystem } from '~/composables/useBattleSystem'
import { useEventSystem } from '~/composables/useEventSystem'
import { useSynergyCards } from '~/composables/useSynergyCards'

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

// 게임 타이머
const {
  gameStartTime,
  gameEndTime,
  remainingTime,
  currentWeek,
  elapsedDays,
  shouldInvadeThisWeek,
  markInvasionOccurred
} = useRealTimeGameTimer()

// 턴 시스템
const {
  currentTurns,
  maxTurns,
  formattedTimeUntilNext,
  formattedTimeUntilFull,
  useTurn,
  rechargeAllTurns
} = useTurnSystem()

// 턴 데이터 (GameLeftSidebar에 전달)
const turnData = computed(() => ({
  currentTurns: currentTurns.value,
  maxTurns: maxTurns,
  timeUntilNext: formattedTimeUntilNext.value,
  timeUntilFull: formattedTimeUntilFull.value
}))

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

// 장수 관리
const { generals, showGenerals, generateRandomGeneral, assignSoldiers, unassignSoldiers, dismissGeneral } = useGameGenerals(
  kingdom,
  showNotification
)

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
  generals,
  playerPassiveCards,
  godGameState,
  showNotification
)

// 게임 시작 시 환생 데이터 로드
if (process.client) {
  loadReincarnationData()
}

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
  closeBattle,
  handleBattleEnd
} = useBattleSystem({
  kingdom,
  generals,
  enemyKingdoms,
  permanentEffects,
  empire,
  showNotification,
  showGenerals,
  synergyBattleEffects,
  isWeeklyInvasion,
  showReincarnationModal
})

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
  generals,
  playerPassiveCards,
  showPassiveCardSelection,
  availablePassiveCards,
  permanentEffects,
  reincarnationData,
  showReincarnationModal,
  showNotification,
  calculateProduction,
  generateRandomGeneral,
  synergyDailyEffects,
  godGameState
})

// 현실 시간 기반 7일마다 제국 침략 감시
watch(shouldInvadeThisWeek, (shouldInvade) => {
  if (shouldInvade && process.client) {
    // 침략 발생
    const week = currentWeek.value
    showNotification(`⚔️ ${week}주차! 제국군이 전면 침략해옵니다!`, 'error')

    // 7일차 침략 플래그 설정
    isWeeklyInvasion.value = true
    selectBattleType('pve')

    // 침략 발생 기록
    markInvasionOccurred(week)
  }
}, { immediate: true })

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

// 장수 관리 모달 닫기
const handleCloseGeneralsModal = () => {
  showGenerals.value = false

  // 튜토리얼: 장수에게 병력이 배치되었는지 확인
  const hasAssignedSoldiers = generals.value.some(g => g.assignedSoldiers > 0)
  if (hasAssignedSoldiers) {
    tutorialOnAssignGenerals()
  }
}

// 장수 병력 배치/회수
const handleAssignSoldiers = (generalId: string, amount: number) => {
  if (amount > 0) {
    // 병력 배치
    assignSoldiers(generalId, amount)
  } else if (amount < 0) {
    // 병력 회수
    unassignSoldiers(generalId, Math.abs(amount))
  }
}

// 0회차로 완전 리셋 (환생 데이터 및 모든 진행도 초기화)
const resetToZero = () => {
  if (process.client) {
    // 모든 게임 데이터 삭제
    localStorage.removeItem('reincarnationData')
    localStorage.removeItem('gameData')
    localStorage.removeItem('passiveCards')
    localStorage.removeItem('turnSystemState')
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

// 다음 날 진행 핸들러 (턴 소모 + 튜토리얼)
const handleNextDay = () => {
  // 턴 체크
  if (currentTurns.value <= 0) {
    showNotification('턴이 부족합니다! 시간이 지나면 턴이 회복됩니다.', 'error')
    return
  }

  // 턴 소모
  if (useTurn()) {
    showNotification(`턴을 1 소모했습니다. (남은 턴: ${currentTurns.value})`, 'info')

    // 튜토리얼 이벤트 체크
    const tutorialEvent = advanceDay(kingdom.value.day + 1)
    if (tutorialEvent) {
      // 조언자 모달 표시
      showAdvisorMessage(tutorialEvent)
      return
    }

    // 42일 도달 시 최종 체크 (현실 시간 기반)
    if (elapsedDays.value >= 42) {
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
    if ((kingdom.value.day + 1) % 25 === 0 && kingdom.value.day + 1 !== 100) {
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
