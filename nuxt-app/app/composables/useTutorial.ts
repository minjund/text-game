import { ref, computed } from 'vue'

export interface TutorialState {
  isActive: boolean
  currentDay: number
  tutorialCompleted: boolean
  storyCompleted: boolean // 스토리 진행 완료 여부
  hasSelectedStartCards: boolean // 시작 카드 선택 완료 여부
  hasRecruitedSoldiers: boolean
  hasAssignedGenerals: boolean
  hasCompletedFirstBattle: boolean
  hasSeenBattleTutorial: boolean // 전장의 기록 튜토리얼 확인 여부
  hasSeenCardSelectionTutorial: boolean // 전투 카드 선택 튜토리얼 확인 여부
  unlockedFeatures: string[]
  shownMessages: string[]
}

const STORAGE_KEY = 'tutorialState'

export const useTutorial = () => {

  const tutorialState = ref<TutorialState>({
    isActive: true,
    currentDay: 0,
    tutorialCompleted: false,
    storyCompleted: false,
    hasSelectedStartCards: false,
    hasRecruitedSoldiers: false,
    hasAssignedGenerals: false,
    hasCompletedFirstBattle: false,
    hasSeenBattleTutorial: false,
    hasSeenCardSelectionTutorial: false,
    unlockedFeatures: [],
    shownMessages: []
  })

  // 기능 해금 상태 확인
  const isFeatureUnlocked = (feature: string) => {
    return tutorialState.value.unlockedFeatures.includes(feature)
  }

  // 메시지가 이미 표시되었는지 확인
  const hasShownMessage = (messageId: string) => {
    return tutorialState.value.shownMessages.includes(messageId)
  }

  // 로컬스토리지에서 상태 로드
  const loadState = (): TutorialState | null => {
    if (!process.client) return null

    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to load tutorial state:', e)
      return null
    }
  }

  // 로컬스토리지에 상태 저장
  const saveState = () => {
    if (!process.client) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tutorialState.value))
  }

  // 초기화
  const initializeTutorial = () => {
    const savedState = loadState()
    if (savedState) {
      // 기본값과 병합하여 누락된 필드 방지
      tutorialState.value = {
        ...tutorialState.value,
        ...savedState,
        unlockedFeatures: savedState.unlockedFeatures || [],
        shownMessages: savedState.shownMessages || []
      }

      // 기존 저장 상태에 storyCompleted, hasSelectedStartCards가 없으면 추가
      if (tutorialState.value.storyCompleted === undefined) {
        tutorialState.value.storyCompleted = true // 기존 사용자는 스토리 건너뛰기
      }
      if (tutorialState.value.hasSelectedStartCards === undefined) {
        tutorialState.value.hasSelectedStartCards = true // 기존 사용자는 카드 선택 건너뛰기
      }
      // 기존 저장 상태에 hasSeenBattleTutorial이 없으면 false로 초기화
      if (tutorialState.value.hasSeenBattleTutorial === undefined) {
        tutorialState.value.hasSeenBattleTutorial = false
        saveState()
      }
      // 기존 저장 상태에 hasSeenCardSelectionTutorial이 없으면 false로 초기화
      if (tutorialState.value.hasSeenCardSelectionTutorial === undefined) {
        tutorialState.value.hasSeenCardSelectionTutorial = false
        saveState()
      }
      // 기존 저장 상태에 synergyCards가 없으면 추가
      if (!tutorialState.value.unlockedFeatures.includes('synergyCards')) {
        tutorialState.value.unlockedFeatures.push('synergyCards')
        saveState()
      }
    } else {
      // 첫 플레이: 스토리부터 시작
      tutorialState.value.unlockedFeatures = []
      saveState()
    }
  }

  // 기능 해금
  const unlockFeature = (feature: string) => {
    if (!tutorialState.value.unlockedFeatures.includes(feature)) {
      tutorialState.value.unlockedFeatures.push(feature)
      saveState()
    }
  }

  // 메시지 표시 기록
  const markMessageShown = (messageId: string) => {
    if (!tutorialState.value.shownMessages.includes(messageId)) {
      tutorialState.value.shownMessages.push(messageId)
      saveState()
    }
  }

  // 일차 진행 (다음 날 버튼 클릭 시)
  const advanceDay = (kingdomDay: number) => {
    if (!tutorialState.value.isActive) return null
    tutorialState.value.currentDay = kingdomDay

    // if (kingdomDay === 0) {
    //   return handleDay1()
    // } else if (kingdomDay === 1) {
    //   return handleDay2()
    // } else if (kingdomDay === 2) {
    //   return handleDay3()
    // } else if (kingdomDay === 3) {
    //   return handleDay4()
    // } else if (kingdomDay === 4) {
    //   return handleDay5()
    // }

    return null
  }

  // 제 1일: 왕국의 첫걸음
  const handleDay1 = () => {
    if (hasShownMessage('day1_welcome')) return null

    markMessageShown('day1_welcome')

    return {
      messageId: 'day1_welcome',
      title: '왕국의 첫걸음',
      message: '폐하, 즉위를 축하드립니다! 왕국을 건설할 기반 자금을 드립니다. \n 다음 날을 눌러 하루를 지내보세요.',
      rewards: {
        gold: 1000,
        food: 1000
      },
      type: 'advisor' as const
    }
  }

  // 제 2일: 군대의 필요성
  const handleDay2 = () => {
    if (hasShownMessage('day2_army')) return null

    markMessageShown('day2_army')

    unlockFeature('recruit')
    unlockFeature('generals')

    return {
      messageId: 'day2_army',
      title: '군대의 필요성',
      message: '왕국이 무방비 상태입니다! **병력 모집**으로 병사를 모으고, **장수 관리**에서 장수에게 지휘를 맡기십시오.',
      type: 'advisor' as const,
      highlight: ['recruit', 'generals']
    }
  }

  // 제 3일: 배치 확인 또는 첫 전투
  const handleDay3 = () => {
    // 병력을 모집했지만 배치하지 않은 경우
    if (tutorialState.value.hasRecruitedSoldiers && !tutorialState.value.hasAssignedGenerals) {
      if (!hasShownMessage('day3_unassigned')) {
        markMessageShown('day3_unassigned')
        return {
          messageId: 'day3_unassigned',
          title: '배치가 필요합니다',
          message: '폐하! 모집한 병사들이 훈련도 없이 막사에서 식량만 축내고 있습니다! **장수 관리**에서 장수에게 배치해야 즉시 전투 준비가 됩니다!',
          type: 'advisor' as const,
          urgent: true,
          highlight: ['generals']
        }
      }
    }

    // 아무것도 안 한 경우
    if (!tutorialState.value.hasRecruitedSoldiers) {
      if (!hasShownMessage('day3_no_action')) {
        markMessageShown('day3_no_action')
        return {
          messageId: 'day3_no_action',
          title: '병력이 필요합니다',
          message: '폐하! 병력이 없으면 약탈자조차 막을 수 없습니다. 어서 **병력 모집**을 시작하십시오.',
          type: 'advisor' as const,
          urgent: true,
          highlight: ['recruit']
        }
      }
    }

    // 정상적으로 배치한 경우 - 제국 침략 해금은 이미 완료됨
    if (tutorialState.value.hasAssignedGenerals && !hasShownMessage('day3_ready')) {
      markMessageShown('day3_ready')
      return {
        messageId: 'day3_ready',
        title: '전투 준비 완료',
        message: '군대가 준비되었습니다! 국경의 **약탈자 소굴**을 토벌하여 왕국의 위엄을 보이십시오.',
        type: 'advisor' as const,
        highlight: ['battle']
      }
    }

    return null
  }

  // 제 4일: 대전쟁과 엔딩
  const handleDay4 = () => {
    if (hasShownMessage('day4_war')) return null

    markMessageShown('day4_war')

    // 대전쟁 타이머와 카운터 해금
    unlockFeature('warTimer')
    unlockFeature('warCounter')

    return {
      messageId: 'day4_war',
      title: '대전쟁과 엔딩',
      message: '폐하, 드디어 바깥 세계의 정보가 들어왔습니다.\n\n우리는 거대한 **대전쟁**의 한복판에 있습니다. 타이머가 다하기 전에 숙적인 \'제국\'을 **20번 격파**하여 전쟁을 우리의 승리로 이끌어야 합니다!\n\n이것이 우리의 최종 목표입니다.',
      type: 'advisor' as const,
      important: true
    }
  }

  // 제 5일: 미래의 예고
  const handleDay5 = () => {
    if (hasShownMessage('day5_future')) return null

    markMessageShown('day5_future')

    // 25일 카드, 100일 환생 아이콘 해금
    unlockFeature('futureCards')
    // 신의 계명, 시너지 카드도 해금
    unlockFeature('commandments')
    unlockFeature('synergyCards')

    // 튜토리얼 완료
    tutorialState.value.tutorialCompleted = true
    tutorialState.value.isActive = false
    saveState()

    return {
      messageId: 'day5_future',
      title: '미래의 예고',
      message: '이제 모든 것을 아셨습니다.\n\n' +
          '🎴 **25일차**에는 왕국의 운명을 정할 **시너지 카드**를 뽑게 됩니다. 같은 종류의 카드를 모으면 강력한 시너지 효과가 발동됩니다!\n\n' +
          '🐍 **일주일**이 되는 날. 제국이 침략을 시작 합니다. 여기서 승리 하시면 엔딩 입니다.\n\n' +
          '패배하실 경우 카드 한장을 가지고 환생을 합니다. \n\n' +
          '행운을 빕니다, 폐하!',
      type: 'advisor' as const,
      final: true
    }
  }

  // 병력 모집 완료 시 호출
  const onRecruitSoldiers = () => {
    tutorialState.value.hasRecruitedSoldiers = true
    saveState()
  }

  // 장수 배치 완료 시 호출
  const onAssignGenerals = () => {
    if (!tutorialState.value.hasAssignedGenerals) {
      tutorialState.value.hasAssignedGenerals = true

      // 제국 침략 해금
      unlockFeature('battle')

      saveState()
    }
  }

  // 첫 전투 완료 시 호출
  const onCompleteFirstBattle = () => {
    tutorialState.value.hasCompletedFirstBattle = true
    saveState()
  }

  // 전장의 기록 튜토리얼 완료 처리
  const completeBattleTutorial = () => {
    tutorialState.value.hasSeenBattleTutorial = true
    saveState()
  }

  // 전투 카드 선택 튜토리얼 완료 처리
  const completeCardSelectionTutorial = () => {
    tutorialState.value.hasSeenCardSelectionTutorial = true
    saveState()
  }

  // 스토리 완료 처리
  const completeStory = () => {
    tutorialState.value.storyCompleted = true
    saveState()
  }

  // 시작 카드 선택 완료 처리
  const completeStartCardSelection = () => {
    tutorialState.value.hasSelectedStartCards = true
    // 모든 기능 해금
    tutorialState.value.unlockedFeatures = [
      'nextDay',
      'futureCards',
      'commandments',
      'synergyCards'
    ]
    tutorialState.value.tutorialCompleted = true
    tutorialState.value.isActive = false
    saveState()
  }

  // 튜토리얼 리셋 (디버그용)
  const resetTutorial = () => {
    if (process.client) {
      localStorage.removeItem(STORAGE_KEY)
      tutorialState.value = {
        isActive: true,
        currentDay: 1,
        tutorialCompleted: false,
        storyCompleted: false,
        hasSelectedStartCards: false,
        hasRecruitedSoldiers: false,
        hasAssignedGenerals: false,
        hasCompletedFirstBattle: false,
        hasSeenBattleTutorial: false,
        hasSeenCardSelectionTutorial: false,
        unlockedFeatures: [],
        shownMessages: []
      }
      saveState()
    }
  }

  // 튜토리얼 강제 완료 (스킵)
  const skipTutorial = () => {
    tutorialState.value.isActive = false
    tutorialState.value.tutorialCompleted = true
    tutorialState.value.unlockedFeatures = [
      'nextDay',
      'recruit',
      'generals',
      'battle',
      'warTimer',
      'warCounter',
      'futureCards',
      'commandments',
      'synergyCards'
    ]
    saveState()
  }

  // 초기화
  if (process.client) {
    initializeTutorial()
  }


  return {
    tutorialState,
    isFeatureUnlocked,
    hasShownMessage,
    advanceDay,
    onRecruitSoldiers,
    onAssignGenerals,
    onCompleteFirstBattle,
    completeBattleTutorial,
    completeCardSelectionTutorial,
    completeStory,
    completeStartCardSelection,
    resetTutorial,
    skipTutorial,
    unlockFeature,
    markMessageShown
  }
}
