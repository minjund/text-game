import { ref, type Ref, onUnmounted, watch } from 'vue'
import type { Battle, BattleLog, Kingdom, General } from '../types/game'
import type { ActiveCard, ActiveCardEffect } from '../types/active-cards'
import { empireKingdom, generateRandomEnemies } from '../data/mockData'
import { useRealtimeBattle } from './useRealtimeBattle'

export interface BattleRecord extends Battle {
  timestamp: string
  kingdomName: string
}

// 전투 중 버프/디버프 효과 추적
interface BattleEffect {
  type: ActiveCardEffect
  power: number
  duration: number
  remainingTurns: number
}

interface UseBattleSystemOptions {
  kingdom: Ref<Kingdom>
  enemyKingdoms: any[]
  permanentEffects: Ref<any[]>
  empire: Ref<{ name: string; defeated: boolean; totalFortresses: number }>
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void
  synergyBattleEffects?: Ref<{ military: number; attackBonus: number; defenseBonus: number }>
  isWeeklyInvasion?: Ref<boolean>
  showReincarnationModal?: Ref<boolean>
  selectedBattleCards?: Ref<any[]> // 선택된 전투 카드
  battleActiveCards?: Ref<ActiveCard[]> // 전투에 가져온 액티브 카드
}

export const useBattleSystem = (options: UseBattleSystemOptions) => {
  const { kingdom, enemyKingdoms, permanentEffects, empire, showNotification, synergyBattleEffects, isWeeklyInvasion, showReincarnationModal, selectedBattleCards, battleActiveCards } = options

  // 실시간 전투 시스템
  const { isBattleRunning, isPaused, startRealtimeBattle, stopBattle, pauseBattle, resumeBattle, skipToEnd } = useRealtimeBattle()

  // State
  const currentBattle = ref<Battle | null>(null)
  const battleType = ref<'pve' | 'pvp'>('pve')
  const currentBattleMode = ref<'empire' | 'normal'>('normal') // 제국 전투 vs 일반 전투
  const battleRecords = ref<BattleRecord[]>([])
  const battleLogContainer = ref<HTMLElement | null>(null)
  const isScrolling = ref(false)

  // 액티브 카드 관련 상태
  const usedActiveCards = ref<string[]>([]) // 사용된 카드 ID 목록
  const activeEffects = ref<BattleEffect[]>([]) // 현재 활성화된 버프/디버프
  const attackerScore = ref(0) // 아군 공격 성공 횟수
  const defenderScore = ref(0) // 적군 공격 성공 횟수
  const currentTurn = ref(0) // 현재 턴

  // 카드 선택 타이머 관련 상태
  const cardSelectionTime = ref(0) // 남은 시간 (초)
  const cardSelectionTimer = ref<any>(null)
  const previousBattleState = ref<string>('팽팽한 접전') // 이전 전투 상태 ("크게 우세", "약간 우세", "팽팽한 접전", "약간 열세", "크게 열세")

  // 컴포넌트 언마운트 시 전투 중지
  onUnmounted(() => {
    stopBattle()
    if (cardSelectionTimer.value) {
      clearInterval(cardSelectionTimer.value)
      cardSelectionTimer.value = null
    }
  })

  // 카드 선택 타이머 시작
  const startCardSelectionTimer = () => {
    cardSelectionTime.value = 15

    if (cardSelectionTimer.value) {
      clearInterval(cardSelectionTimer.value)
    }

    cardSelectionTimer.value = setInterval(() => {
      cardSelectionTime.value--

      if (cardSelectionTime.value <= 0) {
        clearInterval(cardSelectionTimer.value)
        cardSelectionTimer.value = null
        // 시간 초과 시 자동으로 전투 재개
        if (currentBattle.value) {
          resumeBattle(currentBattle.value)
        }
      }
    }, 1000)
  }

  // 카드 선택 타이머 중지
  const stopCardSelectionTimer = () => {
    if (cardSelectionTimer.value) {
      clearInterval(cardSelectionTimer.value)
      cardSelectionTimer.value = null
    }
    cardSelectionTime.value = 0
  }

  // Battle Status 계산 함수
  const getBattleStatus = (scoreDiff: number): string => {
    if (scoreDiff > 2) return '크게 우세'
    if (scoreDiff > 0) return '약간 우세'
    if (scoreDiff === 0) return '팽팽한 접전'
    if (scoreDiff > -3) return '약간 열세'
    return '크게 열세'
  }

  // Battle Status에 따른 나레이션
  const getStatusChangeNarration = (newStatus: string): string => {
    switch (newStatus) {
      case '크게 우세':
        return '💪 압도적인 우세! 지금이 결정타를 날릴 때다! 카드를 선택하라! (15초)'
      case '약간 우세':
        return '👍 우리가 앞서고 있다! 이 기세를 몰아갈 카드를 선택하라! (15초)'
      case '팽팽한 접전':
        return '⚖️ 팽팽한 접전! 지금 카드 한 장이 승부를 가를 것이다! (15초)'
      case '약간 열세':
        return '⚠️ 조금씩 밀리고 있다! 전세를 역전시킬 카드를 선택하라! (15초)'
      case '크게 열세':
        return '🚨 위급한 상황! 지금이 마지막 기회다! 카드를 선택하라! (15초)'
      default:
        return '⚡ 전세가 바뀌었다! 카드를 선택하라! (15초)'
    }
  }

  // 점수 변화 감지 및 전투 일시정지
  watch([attackerScore, defenderScore], ([newAttacker, newDefender], [oldAttacker, oldDefender]) => {
    // 전투가 진행 중이고 일시정지 상태가 아닐 때만 체크
    if (!isBattleRunning.value || isPaused.value || !currentBattle.value) return

    const scoreDiff = newAttacker - newDefender
    const currentState = getBattleStatus(scoreDiff)

    // 첫 점수 변경 시 열세면 바로 일시정지
    const isFirstScore = oldAttacker === 0 && oldDefender === 0
    const isLosing = scoreDiff < 0

    // 상태가 변경되었는지 체크 OR 첫 점수가 열세인 경우
    const stateChanged = previousBattleState.value !== currentState
    const shouldPause = stateChanged || (isFirstScore && isLosing)

    if (shouldPause) {
      // 전투 일시정지
      pauseBattle()

      // 상태 전환 로그 추가
      const transitionLog: BattleLog = {
        turn: currentTurn.value,
        generalName: '',
        action: '',
        success: true,
        message: '',
        story: isFirstScore && isLosing
          ? '🚨 불리한 출발! 적의 선제공격을 허용했다! 즉시 대응이 필요하다! (15초)'
          : getStatusChangeNarration(currentState),
        narrativeType: 'narration'
      }
      currentBattle.value.log.push(transitionLog)

      // 스크롤 아래로
      setTimeout(() => {
        const container = document.querySelector('.overflow-y-auto')
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          })
        }
      }, 100)

      // 15초 타이머 시작
      startCardSelectionTimer()
    }

    // 현재 상태 저장
    previousBattleState.value = currentState
  })

  // 전투 기록 불러오기
  const loadBattleRecords = () => {
    if (process.client) {
      const saved = localStorage.getItem('battleRecords')
      if (saved) {
        try {
          battleRecords.value = JSON.parse(saved)
        } catch (e) {
          console.error('전투 기록 불러오기 실패:', e)
          battleRecords.value = []
        }
      }
    }
  }

  // 전투 기록 저장
  const saveBattleRecord = (battle: Battle) => {
    if (!battle) return

    const record: BattleRecord = {
      ...battle,
      timestamp: new Date().toISOString(),
      kingdomName: kingdom.value.name
    }

    battleRecords.value.unshift(record)

    // 최대 50개까지만 저장
    if (battleRecords.value.length > 50) {
      battleRecords.value = battleRecords.value.slice(0, 50)
    }

    if (process.client) {
      localStorage.setItem('battleRecords', JSON.stringify(battleRecords.value))
    }
  }

  // 액션 나레이션 생성
  const generateActionNarration = (general: General, skill: any, success: boolean, isAttacker: boolean): string => {
    const templates = success ? [
      `${general.name}이(가) ${skill.name}을(를) 시전했다! 적진이 술렁이며 혼란에 빠진다.`,
      `"이걸로 끝이다!" ${general.name}의 ${skill.name}이(가) 전장을 가른다. 적병들이 비명을 지르며 쓰러진다.`,
      `${general.name}이(가) 전장을 누비며 ${skill.name}을(를) 펼쳤다. 적의 대형이 무너진다!`,
      `순식간에 ${general.name}이(가) 전진하며 ${skill.name}! 적진에서 비명소리가 울려퍼진다.`,
      `${general.name}의 공격이 빛을 발한다. ${skill.name}의 위력이 전장을 뒤흔든다!`,
      `${general.name}이(가) 말을 몰고 돌진한다! ${skill.name}이(가) 작렬하며 적진에 구멍이 뚫린다!`,
      `전장에 섬광이 번쩍인다! ${general.name}의 ${skill.name}이(가) 적을 강타한다!`,
      `${general.name}이(가) 함성과 함께 ${skill.name}을(를) 발동했다! 적군의 대열이 크게 흔들린다!`,
      `피와 땀이 뒤섞인 전장에서 ${general.name}의 ${skill.name}이(가) 빛을 발한다!`,
      `"지금이다!" ${general.name}이(가) 외치며 ${skill.name}을(를) 펼친다. 적군이 공포에 질려 뒤로 물러선다!`,
      `${general.name}의 눈빛이 번뜩인다. ${skill.name}의 위력 앞에 적군이 속수무책으로 무너진다!`,
      `전장의 먼지가 가라앉자 ${general.name}의 ${skill.name}이(가) 적진을 초토화시킨 모습이 드러난다!`,
      `${general.name}이(가) 전술적 기회를 포착했다! ${skill.name}이(가) 완벽하게 작동한다!`,
      `적군의 빈틈을 노려 ${general.name}이(가) ${skill.name}을(를) 가한다! 치명타다!`,
      `하늘을 찌르는 함성과 함께 ${general.name}의 ${skill.name}이(가) 적을 제압한다!`
    ] : [
      `${general.name}이(가) ${skill.name}을(를) 시도했으나 적이 이를 막아냈다.`,
      `"젠장!" ${general.name}의 ${skill.name}이(가) 빗나갔다. 적이 비웃으며 반격을 준비한다.`,
      `${general.name}이(가) 공격했으나 적의 방어가 견고하다. ${skill.name}이(가) 무위로 돌아간다.`,
      `${general.name}의 ${skill.name}이(가) 실패했다! 적장이 의기양양하게 외친다.`,
      `집중력이 흐트러졌다. ${general.name}의 ${skill.name}이(가) 제대로 발동되지 않았다.`,
      `${general.name}이(가) ${skill.name}을(를) 시전하려 했으나 적이 재빠르게 회피했다!`,
      `타이밍을 잘못 잡았다! ${general.name}의 ${skill.name}이(가) 허공을 가른다.`,
      `적군이 방진을 굳게 구축했다. ${general.name}의 ${skill.name}이(가) 막혔다!`,
      `"너무 늦었다!" 적장이 외친다. ${general.name}의 ${skill.name}이(가) 무력화되었다.`,
      `${general.name}이(가) 균형을 잃으며 비틀거린다. ${skill.name}이(가) 빗나가버렸다!`,
      `적군의 선제 방어로 ${general.name}의 ${skill.name}이(가) 봉쇄당했다!`,
      `전장의 혼란 속에서 ${general.name}의 ${skill.name}이(가) 제대로 발휘되지 못했다.`,
      `"막아라!" 적의 함성과 함께 ${general.name}의 ${skill.name}이(가) 저지되었다!`,
      `${general.name}이(가) 반격을 받으며 ${skill.name}을(를) 제대로 완성하지 못했다!`,
      `적장의 뛰어난 판단력이 ${general.name}의 ${skill.name}을(를) 무력화시켰다!`
    ]

    return templates[Math.floor(Math.random() * templates.length)]
  }

  // 대사 생성
  const generateDialogue = (general: General, skill: any, success: boolean): string => {
    if (success) {
      const dialogues = [
        "크아악! 이 정도 실력으로 감히!",
        "이것이 나의 힘이다!",
        "하하하! 어디 한번 막아보시지!",
        "이 정도로는 부족하지!",
        "더 세게! 더 빠르게!",
        "이것으로 끝이 아니다!",
        "자, 다음은 누구냐?!",
        "흥, 생각보다 약하군.",
        "나의 검을 받아라!",
        "이 정도는 예상했다!",
        "완벽한 타이밍이다!",
        "전세가 기울었다!",
        "승리는 우리 것이다!",
        "무릎을 꿇어라!",
        "이것이 진정한 전사의 힘이다!",
        "흐흐, 재미있군!",
        "오늘이 네 마지막 날이다!",
        "항복하는 것이 현명할 것이다!",
        "내 앞을 막을 자는 없다!",
        "전장은 나의 무대다!"
      ]
      return dialogues[Math.floor(Math.random() * dialogues.length)]
    } else {
      const dialogues = [
        "크윽... 이럴 수가!",
        "젠장, 빗나갔어!",
        "아직 끝나지 않았다!",
        "이번엔 내가 방심했을 뿐!",
        "다음엔 반드시...!",
        "흠, 상대가 만만치 않군.",
        "이 정도일 줄이야...",
        "후퇴하지 마라! 계속 싸워라!",
        "이럴 리가 없는데...",
        "재정비가 필요하다!",
        "침착하게, 침착하게!",
        "아직 기회는 있다!",
        "다시 한번만...!",
        "실수했다... 하지만!",
        "이런, 계산 착오였나!",
        "방심은 금물이다!",
        "적이 예상보다 강하군!",
        "전열을 재정비하라!",
        "포기할 수 없다!",
        "반드시 승리한다!"
      ]
      return dialogues[Math.floor(Math.random() * dialogues.length)]
    }
  }

  // 액티브 카드 사용 (실시간)
  const useActiveCard = (card: ActiveCard) => {
    if (!currentBattle.value) return

    // 이미 사용한 카드인지 확인
    if (usedActiveCards.value.includes(card.id)) {
      showNotification('이미 사용한 카드입니다!', 'error')
      return
    }

    // 전투가 끝났는지 확인
    if (currentBattle.value.result) {
      showNotification('전투가 이미 종료되었습니다!', 'error')
      return
    }

    // 전투가 진행 중이 아니면 사용 불가
    if (!isBattleRunning.value) {
      showNotification('전투가 진행 중이 아닙니다!', 'error')
      return
    }

    // 발동 확률 체크
    const activationRate = getCardActivationRate(card)
    const success = Math.random() * 100 < activationRate

    // 카드 사용 처리
    usedActiveCards.value.push(card.id)

    // 카드 효과 로그 생성
    const cardLogs = generateCardActivationStory(card, success)

    // 현재 전투 로그에 추가
    if (currentBattle.value) {
      currentBattle.value.log.push(...cardLogs)

      // 부드럽게 스크롤 아래로 (최신 로그 보이도록)
      setTimeout(() => {
        const container = document.querySelector('.overflow-y-auto')
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          })
        }
      }, 100)
    }

    if (success) {
      showNotification(`${card.name} 발동 성공!`, 'success')
    } else {
      showNotification(`${card.name} 발동 실패...`, 'error')
    }

    // 카드 사용 후 타이머 중지하고 전투 재개
    stopCardSelectionTimer()
    if (isPaused.value && currentBattle.value) {
      resumeBattle(currentBattle.value)
    }
  }

  // 현재 활성화된 효과 보너스 계산
  const calculateActiveEffectBonus = (): number => {
    let bonus = 0

    activeEffects.value.forEach(effect => {
      if (effect.type === 'power_boost' || effect.type === 'morale_boost') {
        bonus += effect.power
      }
    })

    return bonus
  }

  // 적군 디버프 계산
  const calculateEnemyDebuff = (): number => {
    let debuff = 0

    activeEffects.value.forEach(effect => {
      if (effect.type === 'enemy_weaken') {
        debuff += effect.power
      }
    })

    return debuff
  }

  // 턴 종료 시 효과 업데이트
  const updateActiveEffects = () => {
    activeEffects.value = activeEffects.value.filter(effect => {
      effect.remainingTurns -= 1
      return effect.remainingTurns > 0
    })
  }

  // 스크롤 애니메이션 시작
  const startScrollAnimation = () => {
    isScrolling.value = true

    const container = document.querySelector('.story-battle-log')
    if (!container) return

    // 맨 아래에서 시작
    container.scrollTop = container.scrollHeight

    // 천천히 위로 스크롤
    const scrollDuration = 20000 // 20초에 걸쳐 스크롤
    const startTime = Date.now()
    const startScroll = container.scrollHeight

    const scroll = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / scrollDuration, 1)

      // ease-out 효과
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      container.scrollTop = startScroll - (startScroll * easeProgress)

      if (progress < 1) {
        requestAnimationFrame(scroll)
      } else {
        isScrolling.value = false
      }
    }

    requestAnimationFrame(scroll)
  }

  // 액티브 카드 발동 확률 계산 (80-95%)
  const getCardActivationRate = (card: ActiveCard): number => {
    const baseRate = {
      'common': 95,
      'rare': 90,
      'epic': 85,
      'legendary': 80
    }
    return baseRate[card.rarity] || 90
  }

  // 액티브 카드 발동 스토리 생성
  const generateCardActivationStory = (card: ActiveCard, success: boolean): BattleLog[] => {
    const logs: BattleLog[] = []

    if (!success) {
      // 발동 실패
      const failureStories = [
        `✨ ${card.name}을(를) 발동하려 했으나 실패했다! 마력이 제대로 응집되지 않는다!`,
        `⚡ ${card.name}의 발동을 시도했지만 전장의 혼란으로 집중할 수 없었다!`,
        `💫 ${card.name}을(를) 사용하려는 순간, 적의 방해로 효과가 무산되었다!`,
        `🌟 ${card.name}이(가) 빛을 발하려 했으나 곧 사그라들었다. 타이밍을 놓쳤다!`,
        `⭐ ${card.name}의 발동에 실패했다! 더 신중한 타이밍이 필요했다!`
      ]
      logs.push({
        turn: currentTurn.value,
        generalName: '',
        action: card.name,
        success: false,
        message: '',
        story: failureStories[Math.floor(Math.random() * failureStories.length)],
        narrativeType: 'narration'
      })
      return logs
    }

    // 발동 성공
    logs.push({
      turn: currentTurn.value,
      generalName: '플레이어',
      action: card.name,
      success: true,
      message: '',
      story: `✨ ${card.name}을(를) 발동했다! ${card.battleDescription}`,
      narrativeType: 'narration'
    })

    // 효과 타입별 처리
    switch (card.effectType) {
      case 'instant_damage':
        const damage = Math.floor(card.power / 20)
        defenderScore.value = Math.max(0, defenderScore.value - damage)
        logs.push({
          turn: currentTurn.value,
          generalName: '',
          action: '',
          success: true,
          message: '',
          story: `💥 강렬한 일격이 적진을 강타했다! 적군의 전열이 크게 흔들린다!`,
          narrativeType: 'narration'
        })
        logs.push({
          turn: currentTurn.value,
          generalName: '',
          action: '',
          success: true,
          message: '',
          story: `⚔️ 적군 병사들이 비명을 지르며 쓰러진다! 전세가 ${damage}만큼 역전되었다!`,
          narrativeType: 'narration'
        })
        break

      case 'heal':
        attackerScore.value += Math.floor(card.power / 15)
        logs.push({
          turn: currentTurn.value,
          generalName: '',
          action: '',
          success: true,
          message: '',
          story: `🩹 따뜻한 빛이 아군을 감싼다! 부상병들이 다시 일어선다!`,
          narrativeType: 'narration'
        })
        logs.push({
          turn: currentTurn.value,
          generalName: '',
          action: '',
          success: true,
          message: '',
          story: `💚 아군의 사기가 크게 상승했다! 전투력이 회복되어 반격할 준비가 되었다!`,
          narrativeType: 'narration'
        })
        break

      case 'turn_skip':
        activeEffects.value.push({
          type: 'turn_skip',
          power: card.power,
          duration: card.duration || card.power,
          remainingTurns: card.duration || card.power
        })
        logs.push({
          turn: currentTurn.value,
          generalName: '',
          action: '',
          success: true,
          message: '',
          story: `🌪️ 강력한 기운이 전장을 휩쓴다! 적군이 움직이지 못하고 경직되었다!`,
          narrativeType: 'narration'
        })
        logs.push({
          turn: currentTurn.value,
          generalName: '',
          action: '',
          success: true,
          message: '',
          story: `⏸️ ${card.power}턴 동안 적의 공격이 무력화된다! 절호의 기회다!`,
          narrativeType: 'narration'
        })
        break

      case 'power_boost':
      case 'defense_boost':
      case 'morale_boost':
        activeEffects.value.push({
          type: card.effectType,
          power: card.power,
          duration: card.duration || 2,
          remainingTurns: card.duration || 2
        })
        const buffType = card.effectType === 'power_boost' ? '공격력' : card.effectType === 'defense_boost' ? '방어력' : '사기'
        logs.push({
          turn: currentTurn.value,
          generalName: '',
          action: '',
          success: true,
          message: '',
          story: `🔥 아군에게 강력한 버프가 걸렸다! ${buffType}이(가) 급상승한다!`,
          narrativeType: 'narration'
        })
        logs.push({
          turn: currentTurn.value,
          generalName: '',
          action: '',
          success: true,
          message: '',
          story: `⚡ ${card.duration || 2}턴 동안 전투력이 ${card.power}% 증가! 이제 적을 압도할 수 있다!`,
          narrativeType: 'narration'
        })
        break

      case 'critical_strike':
        activeEffects.value.push({
          type: 'critical_strike',
          power: 100,
          duration: 1,
          remainingTurns: 1
        })
        logs.push({
          turn: currentTurn.value,
          generalName: '',
          action: '',
          success: true,
          message: '',
          story: `⚔️ 검이 붉은 빛으로 물들었다! 다음 공격은 치명타가 될 것이다!`,
          narrativeType: 'narration'
        })
        break

      case 'reverse_momentum':
        const reverseAmount = Math.floor(card.power / 10)
        attackerScore.value += reverseAmount
        defenderScore.value = Math.max(0, defenderScore.value - reverseAmount)
        logs.push({
          turn: currentTurn.value,
          generalName: '',
          action: '',
          success: true,
          message: '',
          story: `🌊 전장의 흐름이 완전히 역전되었다! 절망적이던 상황이 반전된다!`,
          narrativeType: 'narration'
        })
        logs.push({
          turn: currentTurn.value,
          generalName: '',
          action: '',
          success: true,
          message: '',
          story: `🔄 승리가 눈앞에 보인다! 아군의 함성이 하늘을 찌른다!`,
          narrativeType: 'narration'
        })
        break

      case 'multi_strike':
        for (let i = 0; i < card.power; i++) {
          attackerScore.value += 1
          logs.push({
            turn: currentTurn.value,
            generalName: kingdom.value.ruler || '지휘관',
            action: `연속 공격 ${i + 1}`,
            success: true,
            message: '',
            story: `⚡ ${kingdom.value.ruler || '지휘관'}의 ${i + 1}번째 연속 공격! 적이 속수무책으로 당한다!`,
            narrativeType: 'action'
          })
        }
        logs.push({
          turn: currentTurn.value,
          generalName: '',
          action: '',
          success: true,
          message: '',
          story: `💫 완벽한 연속 공격이었다! 적진이 초토화되었다!`,
          narrativeType: 'narration'
        })
        break

      case 'enemy_weaken':
        activeEffects.value.push({
          type: 'enemy_weaken',
          power: card.power,
          duration: card.duration || 3,
          remainingTurns: card.duration || 3
        })
        logs.push({
          turn: currentTurn.value,
          generalName: '',
          action: '',
          success: true,
          message: '',
          story: `☠️ 어둠의 기운이 적군을 감싼다! 저주가 걸렸다!`,
          narrativeType: 'narration'
        })
        logs.push({
          turn: currentTurn.value,
          generalName: '',
          action: '',
          success: true,
          message: '',
          story: `🌑 ${card.duration || 3}턴 동안 적의 전투력이 ${card.power}% 감소한다! 적장이 당황하고 있다!`,
          narrativeType: 'narration'
        })
        break
    }

    return logs
  }

  // 완전한 전투 스토리 미리 생성
  const generateCompleteBattle = async () => {
    if (!currentBattle.value) {
      return
    }

    // 초기화
    attackerScore.value = 0
    defenderScore.value = 0
    currentTurn.value = 0
    usedActiveCards.value = []
    activeEffects.value = []
    previousBattleState.value = '팽팽한 접전'
    stopCardSelectionTimer()

    const logs: BattleLog[] = []

    // 오프닝 나레이션
    logs.push({
      turn: 0,
      generalName: '',
      action: '',
      success: true,
      message: '',
      story: `⚔️ ${currentBattle.value.attacker.kingdomName}의 군대가 ${currentBattle.value.defender.kingdomName}의 영토에 진입했다.`,
      narrativeType: 'narration'
    })

    logs.push({
      turn: 0,
      generalName: '',
      action: '',
      success: true,
      message: '',
      story: `🏰 양군이 대치하며 살기가 가득한 시선을 교환한다. 전쟁의 서막이 오른다...`,
      narrativeType: 'narration'
    })

    // 전투에 가져온 액티브 카드 확인
    const availableCards = battleActiveCards?.value || []
    const cardActivationTurns: number[] = []

    // 카드 발동 턴 미리 결정 (균등하게 분산) - 플레이어가 수동으로 사용 안함
    // if (availableCards.length > 0) {
    //   const totalTurns = 18
    //   const interval = Math.floor(totalTurns / (availableCards.length + 1))
    //   for (let i = 0; i < availableCards.length; i++) {
    //     cardActivationTurns.push((i + 1) * interval)
    //   }
    // }

    // 랜덤 전투 이벤트
    const battleEvents = [
      { turn: 3, story: '🌧️ 갑자기 비가 내리기 시작했다! 시야가 흐려진다!' },
      { turn: 4, story: '☀️ 햇빛이 우리 편을 비춘다! 아군의 사기가 올라간다!' },
      { turn: 6, story: '🌪️ 강풍이 불어온다! 화살 공격이 빗나가기 쉬워졌다!' },
      { turn: 7, story: '⚡ 천둥소리가 전장을 뒤흔든다! 양군 모두 잠시 움찔한다!' },
      { turn: 8, story: '🔥 전장 한쪽에서 화염이 번진다! 혼란이 가중된다!' },
      { turn: 9, story: '❄️ 차가운 바람이 분다! 병사들이 몸을 움츠린다!' },
      { turn: 11, story: '🌑 먹구름이 해를 가린다! 전장이 어두워졌다!' },
      { turn: 12, story: '🦅 독수리 떼가 날아간다! 불길한 징조인가?' },
      { turn: 13, story: '💀 전사자들의 시체가 쌓여간다... 참혹한 광경이다!' },
      { turn: 14, story: '🌟 하늘에서 빛이 내려온다! 신의 가호인가!' }
    ]

    // 전투 시작 (15-18턴)
    const totalTurns = 15 + Math.floor(Math.random() * 4)
    for (let turn = 1; turn <= totalTurns; turn++) {
      currentTurn.value = turn

      // 자동 액티브 카드 발동 비활성화 (플레이어가 수동으로 사용)
      // const cardIndex = cardActivationTurns.indexOf(turn)
      // if (cardIndex !== -1 && cardIndex < availableCards.length) {
      //   const card = availableCards[cardIndex]
      //   const activationRate = getCardActivationRate(card)
      //   const success = Math.random() * 100 < activationRate
      //
      //   const cardLogs = generateCardActivationStory(card, success)
      //   logs.push(...cardLogs)
      //
      //   if (success) {
      //     usedActiveCards.value.push(card.id)
      //   }
      // }

      // 랜덤 이벤트 (30% 확률)
      if (Math.random() < 0.3) {
        const availableEvents = battleEvents.filter(e => e.turn === turn)
        if (availableEvents.length > 0) {
          const event = availableEvents[Math.floor(Math.random() * availableEvents.length)]
          logs.push({
            turn,
            generalName: '',
            action: '',
            success: true,
            message: '',
            story: event.story,
            narrativeType: 'narration'
          })
        }
      }

      // 중간 나레이션 추가 (5턴, 10턴, 15턴)
      if (turn === 5) {
        const currentScore = attackerScore.value - defenderScore.value
        const narratives = [
          `⚡ 전투가 점점 치열해진다! 양측 모두 한 치의 양보도 없이 맞서고 있다!`,
          `💥 피아 구분이 어려울 정도로 격렬한 난전이 벌어진다!`,
          `🔊 함성과 비명이 뒤섞여 전장이 아수라장이 되었다!`,
          `⚔️ 어느 쪽도 물러서지 않는다! 승부는 아직 알 수 없다!`
        ]
        logs.push({
          turn,
          generalName: '',
          action: '',
          success: true,
          message: '',
          story: narratives[Math.floor(Math.random() * narratives.length)],
          narrativeType: 'narration'
        })
      } else if (turn === 10) {
        const currentScore = attackerScore.value - defenderScore.value
        if (currentScore > 0) {
          const winningNarratives = [
            `🔥 우리 군이 우세하다! 적군의 사기가 떨어지기 시작했다!`,
            `💪 아군의 기세가 하늘을 찌른다! 적들이 두려움에 떨고 있다!`,
            `🎯 완벽한 전술이다! 적의 대형이 무너지기 시작했다!`,
            `⚡ 승기를 잡았다! 이대로 밀어붙이면 승리할 수 있다!`
          ]
          logs.push({
            turn,
            generalName: '',
            action: '',
            success: true,
            message: '',
            story: winningNarratives[Math.floor(Math.random() * winningNarratives.length)],
            narrativeType: 'narration'
          })
        } else if (currentScore < 0) {
          const losingNarratives = [
            `⚠️ 전세가 불리하다! 반격의 기회를 노려야 한다!`,
            `😰 아군이 밀리고 있다! 사기가 떨어지고 있다!`,
            `💔 이대로는 위험하다! 무언가 돌파구가 필요하다!`,
            `🚨 적의 공세가 거세다! 방어선을 재정비해야 한다!`
          ]
          logs.push({
            turn,
            generalName: '',
            action: '',
            success: true,
            message: '',
            story: losingNarratives[Math.floor(Math.random() * losingNarratives.length)],
            narrativeType: 'narration'
          })
        } else {
          const evenNarratives = [
            `⚔️ 팽팽한 접전이 이어진다! 누가 먼저 무너질 것인가!`,
            `⚖️ 양쪽 모두 일진일퇴를 거듭하고 있다! 긴장감이 감돈다!`,
            `🔥 막상막하의 대결! 조금의 실수가 승부를 가를 것이다!`,
            `💫 백중지세다! 다음 순간이 승패를 결정지을 것이다!`
          ]
          logs.push({
            turn,
            generalName: '',
            action: '',
            success: true,
            message: '',
            story: evenNarratives[Math.floor(Math.random() * evenNarratives.length)],
            narrativeType: 'narration'
          })
        }
      } else if (turn === 15) {
        logs.push({
          turn,
          generalName: '',
          action: '',
          success: true,
          message: '',
          story: `💀 전투가 막바지에 이르렀다! 이제 곧 승부가 결정된다!`,
          narrativeType: 'narration'
        })
      }

      const isAttackerTurn = turn % 2 === 1
      const activeGenerals = isAttackerTurn
        ? currentBattle.value.attacker.generals
        : currentBattle.value.defender.generals

      if (activeGenerals.length === 0) {
        continue
      }

      const general = activeGenerals[Math.floor(Math.random() * activeGenerals.length)]

      if (!general.skills || general.skills.length === 0) {
        continue
      }

      const skill = general.skills[Math.floor(Math.random() * general.skills.length)]

      // 영구 효과 + 시너지 카드 효과 + 액티브 카드 효과 적용
      let battleBonus = 0
      if (isAttackerTurn) {
        // 영구 효과
        permanentEffects.value.forEach(effect => {
          if (effect.value?.battleBonus) battleBonus += effect.value.battleBonus
        })

        // 시너지 카드 공격력 보너스
        if (synergyBattleEffects?.value?.attackBonus) {
          battleBonus += synergyBattleEffects.value.attackBonus
        }

        // 액티브 카드 버프 효과
        battleBonus += calculateActiveEffectBonus()
      } else {
        // 적군의 경우 디버프 적용
        battleBonus -= calculateEnemyDebuff()
      }

      // 턴 스킵 효과 확인
      const hasTurnSkip = activeEffects.value.some(e => e.type === 'turn_skip')
      let success = false

      if (!isAttackerTurn && hasTurnSkip) {
        // 적군 턴이고 턴 스킵 효과가 있으면 무조건 실패
        success = false
        logs.push({
          turn,
          generalName: general.name,
          action: skill.name,
          success: false,
          message: '',
          story: `🚫 ${general.name}이(가) 공격을 시도했으나 무력화되었다! 몸이 굳어 움직일 수 없다!`,
          narrativeType: 'action'
        })
      } else {
        // 정상 공격
        const adjustedSuccessRate = Math.min(95, skill.successRate + battleBonus)
        success = Math.random() * 100 < adjustedSuccessRate

        // 행동 나레이션
        const actionStory = generateActionNarration(general, skill, success, isAttackerTurn)
        logs.push({
          turn,
          generalName: general.name,
          action: skill.name,
          success,
          message: '',
          story: actionStory,
          narrativeType: 'action'
        })

        // 성공 시 점수 증가
        if (success) {
          // 치명타 효과 확인
          const hasCritical = activeEffects.value.some(e => e.type === 'critical_strike')
          const scoreGain = hasCritical ? 2 : 1

          if (isAttackerTurn) {
            attackerScore.value += scoreGain
            if (hasCritical) {
              logs.push({
                turn,
                generalName: '',
                action: '',
                success: true,
                message: '',
                story: `💥 치명타 발동! 2배의 피해를 입혔다!`,
                narrativeType: 'narration'
              })
              // 치명타 효과 제거
              activeEffects.value = activeEffects.value.filter(e => e.type !== 'critical_strike')
            }
          } else {
            defenderScore.value += scoreGain
          }
        }

        // 대사 추가 (40% 확률)
        if (Math.random() > 0.6) {
          const dialogue = generateDialogue(general, skill, success)
          logs.push({
            turn,
            generalName: general.name,
            action: '',
            success,
            message: '',
            speaker: general.name,
            dialogue,
            narrativeType: 'dialogue'
          })
        }
      }

      // 턴 종료 시 효과 업데이트
      updateActiveEffects()
    }

    // 결과 계산 (임시 변수에 저장, 나중에 설정)
    const battleResult = attackerScore.value > defenderScore.value ? 'victory' : 'defeat'

    // 클라이막스 나레이션
    if (battleResult === 'victory') {
      logs.push({
        turn: 998,
        generalName: '',
        action: '',
        success: true,
        message: '',
        story: `🎆 결정적인 순간! 적군의 방어선이 무너진다!`,
        narrativeType: 'narration'
      })
      logs.push({
        turn: 998,
        generalName: '',
        action: '',
        success: true,
        message: '',
        story: `🏳️ 적장이 후퇴를 명령한다! 적군이 전장에서 도망치기 시작했다!`,
        narrativeType: 'narration'
      })
    } else {
      logs.push({
        turn: 998,
        generalName: '',
        action: '',
        success: true,
        message: '',
        story: `💔 아군의 전선이 무너지고 있다! 더 이상 버틸 수 없다!`,
        narrativeType: 'narration'
      })
      logs.push({
        turn: 998,
        generalName: '',
        action: '',
        success: true,
        message: '',
        story: `🏳️ 부득이하게 후퇴 명령이 떨어진다... 재정비가 필요하다.`,
        narrativeType: 'narration'
      })
    }

    // 엔딩 나레이션
    const endingStory = battleResult === 'victory'
      ? `🎉 치열한 전투 끝에 ${currentBattle.value.attacker.kingdomName}이(가) 승리를 거머쥐었다! (아군: ${attackerScore.value}, 적군: ${defenderScore.value})`
      : `😔 ${currentBattle.value.defender.kingdomName}의 방어선을 뚫지 못했다. (아군: ${attackerScore.value}, 적군: ${defenderScore.value})`

    logs.push({
      turn: 999,
      generalName: '',
      action: '',
      success: true,
      message: '',
      story: endingStory,
      narrativeType: 'narration'
    })

    // 전투 후 통계
    const usedCardsCount = usedActiveCards.value.length
    if (usedCardsCount > 0) {
      logs.push({
        turn: 999,
        generalName: '',
        action: '',
        success: true,
        message: '',
        story: `📊 전투 중 ${usedCardsCount}장의 액티브 카드가 성공적으로 발동되었다.`,
        narrativeType: 'narration'
      })
    }

    // 실시간 전투 시작 (0.7초마다 로그 하나씩 추가)
    startRealtimeBattle(currentBattle.value, logs)

    // 전투가 끝나면 결과 처리 (전체 로그 수 * 0.7초 후)
    const totalDuration = logs.length * 700 + 500
    setTimeout(() => {
      if (currentBattle.value) {
        // 최종 점수로 결과 재계산 (플레이어가 카드를 사용했을 수 있음)
        const finalResult = attackerScore.value > defenderScore.value ? 'victory' : 'defeat'
        // 결과를 설정 (UI에 표시됨)
        currentBattle.value.result = finalResult
        // 결과 처리
        handleBattleEnd(finalResult)
      }
    }, totalDuration)
  }

  // 스토리 기반 전투 시작
  const startStoryBattle = async (enemyName?: string, enemyPower?: number, mode: 'empire' | 'normal' = 'normal') => {
    // 병력이 없으면 전투 불가
    if (kingdom.value.resources.soldiers <= 0) {
      showNotification('병력이 부족합니다!', 'error')
      return
    }

    // 전투 모드 설정
    currentBattleMode.value = mode

    // 전투 카드 효과 계산
    let cardAttackBonus = 0
    let cardDefenseBonus = 0
    let cardSkillBonus = 0

    if (selectedBattleCards?.value && selectedBattleCards.value.length > 0) {
      selectedBattleCards.value.forEach(card => {
        if (card.effect) {
          cardAttackBonus += card.effect.attackBonus || 0
          cardDefenseBonus += card.effect.defenseBonus || 0
          cardSkillBonus += card.effect.skillPowerBonus || 0
        }
      })
      console.log(`전투 카드 효과 - 공격: +${cardAttackBonus}%, 방어: +${cardDefenseBonus}%, 스킬: +${cardSkillBonus}%`)
    }

    // 전투용 임시 지휘관 생성 (장수 시스템 제거로 인한 대체)
    const basePower = 50 + Math.floor(cardAttackBonus * 0.5) // 카드 공격력 보너스 일부 반영
    const baseSuccessRate = 65 + Math.floor(cardSkillBonus * 0.3) // 카드 스킬 보너스 일부 반영

    const battleCommander = {
      id: 'battle-commander',
      name: kingdom.value.ruler || '사령관',
      title: '지휘관',
      rarity: 'common' as const,
      stats: {
        power: basePower,
        intelligence: 50,
        leadership: 50
      },
      skills: [
        {
          id: 'basic-attack',
          name: '전군 돌격',
          description: '전군이 일제히 돌격한다',
          successRate: Math.min(95, baseSuccessRate), // 최대 95%
          effect: {
            type: 'damage',
            value: 100 + cardSkillBonus // 스킬 데미지에 카드 효과 추가
          }
        }
      ],
      assignedSoldiers: kingdom.value.resources.soldiers + Math.floor(kingdom.value.resources.soldiers * cardDefenseBonus / 100) // 방어 보너스를 병력으로 변환
    }

    const battleGenerals = [battleCommander]

    // 시너지 카드 전투 효과 적용 (병력 추가)
    if (synergyBattleEffects?.value?.military && synergyBattleEffects.value.military > 0) {
      // 임시로 첫 번째 장수에게 추가 병력 배치
      const generalsWithBonus = battleGenerals.map((g, index) => {
        if (index === 0) {
          return {
            ...g,
            assignedSoldiers: g.assignedSoldiers + synergyBattleEffects.value.military
          }
        }
        return g
      })

      // 제국 전투 모드면 제국군, 아니면 랜덤 적 생성
      let enemyName: string
      let enemyGenerals: any[]

      if (mode === 'empire') {
        enemyName = empireKingdom.name
        enemyGenerals = empireKingdom.generals
      } else {
        // 랜덤 적 생성 (1-3명)
        const randomEnemyCount = 1 + Math.floor(Math.random() * 3)
        enemyGenerals = generateRandomEnemies(randomEnemyCount)

        // 랜덤 적 왕국 이름
        const enemyKingdomNames = [
          '검은 성채', '붉은 요새', '얼음 왕국', '그림자 제국', '화염의 땅',
          '폭풍의 성', '악마의 성채', '천둥의 왕국', '독사의 소굴', '어둠의 탑',
          '철벽 요새', '혈맹의 땅', '죽음의 성', '파괴의 전당', '광란의 성채',
          '잔혹한 제국', '악몽의 왕국', '피의 성채', '복수의 땅', '절망의 요새'
        ]
        enemyName = enemyKingdomNames[Math.floor(Math.random() * enemyKingdomNames.length)]
      }

      currentBattle.value = {
        id: '1',
        attacker: {
          kingdomName: kingdom.value.name,
          generals: generalsWithBonus
        },
        defender: {
          kingdomName: enemyName,
          generals: enemyGenerals
        },
        log: [],
        result: undefined
      }
    } else {
      // 제국 전투 모드면 제국군, 아니면 랜덤 적 생성
      let enemyName: string
      let enemyGenerals: any[]

      if (mode === 'empire') {
        enemyName = empireKingdom.name
        enemyGenerals = empireKingdom.generals
      } else {
        // 랜덤 적 생성 (1-3명)
        const randomEnemyCount = 1 + Math.floor(Math.random() * 3)
        enemyGenerals = generateRandomEnemies(randomEnemyCount)

        // 랜덤 적 왕국 이름
        const enemyKingdomNames = [
          '검은 성채', '붉은 요새', '얼음 왕국', '그림자 제국', '화염의 땅',
          '폭풍의 성', '악마의 성채', '천둥의 왕국', '독사의 소굴', '어둠의 탑',
          '철벽 요새', '혈맹의 땅', '죽음의 성', '파괴의 전당', '광란의 성채',
          '잔혹한 제국', '악몽의 왕국', '피의 성채', '복수의 땅', '절망의 요새'
        ]
        enemyName = enemyKingdomNames[Math.floor(Math.random() * enemyKingdomNames.length)]
      }

      currentBattle.value = {
        id: '1',
        attacker: {
          kingdomName: kingdom.value.name,
          generals: battleGenerals
        },
        defender: {
          kingdomName: enemyName,
          generals: enemyGenerals
        },
        log: [],
        result: undefined
      }
    }

    // 스토리 전투 시작 - 모든 로그를 미리 생성
    await generateCompleteBattle()
  }

  // 전투 타입 선택 (PVE 전용으로 간소화)
  const selectBattleType = (type: 'pve' | 'pvp', mode: 'empire' | 'normal' = 'normal') => {
    battleType.value = 'pve' // 항상 PVE로 고정

    // 병력이 없으면 전투 불가
    if (kingdom.value.resources.soldiers <= 0) {
      showNotification('병력이 부족합니다!', 'error')
      return
    }

    // PVE 전투 시작
    startStoryBattle(mode)
  }

  // 텍스트 클래스 판별 (아군/적군/나레이션)
  const getTextClass = (log: BattleLog): string => {
    if (log.narrativeType === 'narration') {
      return 'text-narration'
    }

    if (!currentBattle.value) return 'text-narration'

    // 아군인지 적군인지 확인
    const isAlly = currentBattle.value.attacker.generals.some(g => g.name === log.generalName || g.name === log.speaker)

    if (log.narrativeType === 'dialogue') {
      return isAlly ? 'text-ally-dialogue' : 'text-enemy-dialogue'
    }

    return isAlly ? 'text-ally' : 'text-enemy'
  }

  const closeBattle = () => {
    // 실시간 전투 중지
    stopBattle()

    // 전투 기록 저장
    if (currentBattle.value) {
      saveBattleRecord(currentBattle.value)
    }

    // 전투 병력 손실 (전체 병력의 30%)
    const casualty = Math.floor(kingdom.value.resources.soldiers * 0.3)
    kingdom.value.resources.soldiers = Math.max(0, kingdom.value.resources.soldiers - casualty)

    currentBattle.value = null
  }

  // 전투 종료 처리 (PVE 전용)
  const handleBattleEnd = (result: 'victory' | 'defeat') => {
    if (result === 'victory') {
      kingdom.value.resources.gold += 500
      kingdom.value.resources.food += 300

      // 제국 전투 승리
      if (currentBattleMode.value === 'empire') {
        empire.value.defeated = true
        showNotification('🎉 아카샤 대제국을 무너뜨렸습니다! 당신의 왕국이 승리했습니다! 🎉', 'success')

        // 환생 모달 표시
        if (showReincarnationModal) {
          setTimeout(() => {
            showReincarnationModal.value = true
          }, 2000)
        }
      } else {
        // 일반 전투 승리
        showNotification('전투에서 승리했습니다!', 'success')
      }
    } else {
      // 패배 처리
      if (currentBattleMode.value === 'empire') {
        // 제국 전투 패배 - 멸망 (환생 모달은 사용자가 전투 모달을 닫을 때 표시)
        setTimeout(() => {
          showNotification('💀 제국군을 막지 못했습니다. 왕국이 멸망했습니다...', 'error')
        }, 1000)
      } else {
        // 일반 전투 패배 - 병사만 손실
        setTimeout(() => {
          showNotification('전투에서 패배했습니다. 병력을 잃었습니다.', 'error')
        }, 1000)
      }
    }
  }

  return {
    // State
    currentBattle,
    battleType,
    currentBattleMode,
    battleRecords,
    battleLogContainer,
    isScrolling,
    usedActiveCards,
    activeEffects,
    attackerScore,
    defenderScore,
    currentTurn,
    isBattleRunning,
    isPaused,
    cardSelectionTime,

    // Methods
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
    handleBattleEnd,
    useActiveCard,
    calculateActiveEffectBonus,
    calculateEnemyDebuff,
    updateActiveEffects,
    stopBattle
  }
}
