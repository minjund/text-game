import { ref, type Ref } from 'vue'
import type { Battle, BattleLog, Kingdom, General } from '../types/game'
import { empireKingdom } from '../data/mockData'

export interface BattleRecord extends Battle {
  timestamp: string
  kingdomName: string
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
}

export const useBattleSystem = (options: UseBattleSystemOptions) => {
  const { kingdom, enemyKingdoms, permanentEffects, empire, showNotification, synergyBattleEffects, isWeeklyInvasion, showReincarnationModal } = options

  // State
  const currentBattle = ref<Battle | null>(null)
  const battleType = ref<'pve' | 'pvp'>('pve')
  const currentBattleMode = ref<'empire' | 'normal'>('normal') // 제국 전투 vs 일반 전투
  const battleRecords = ref<BattleRecord[]>([])
  const battleLogContainer = ref<HTMLElement | null>(null)
  const isScrolling = ref(false)

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
      `${general.name}의 공격이 빛을 발한다. ${skill.name}의 위력이 전장을 뒤흔든다!`
    ] : [
      `${general.name}이(가) ${skill.name}을(를) 시도했으나 적이 이를 막아냈다.`,
      `"젠장!" ${general.name}의 ${skill.name}이(가) 빗나갔다. 적이 비웃으며 반격을 준비한다.`,
      `${general.name}이(가) 공격했으나 적의 방어가 견고하다. ${skill.name}이(가) 무위로 돌아간다.`,
      `${general.name}의 ${skill.name}이(가) 실패했다! 적장이 의기양양하게 외친다.`,
      `집중력이 흐트러졌다. ${general.name}의 ${skill.name}이(가) 제대로 발동되지 않았다.`
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
        "흥, 생각보다 약하군."
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
        "후퇴하지 마라! 계속 싸워라!"
      ]
      return dialogues[Math.floor(Math.random() * dialogues.length)]
    }
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

  // 완전한 전투 스토리 미리 생성
  const generateCompleteBattle = async () => {
    if (!currentBattle.value) {
      return
    }

    const logs: BattleLog[] = []

    // 오프닝 나레이션
    logs.push({
      turn: 0,
      generalName: '',
      action: '',
      success: true,
      message: '',
      story: `${currentBattle.value.attacker.kingdomName}의 군대가 ${currentBattle.value.defender.kingdomName}의 영토에 진입했다. 전쟁의 서막이 오른다...`,
      narrativeType: 'narration'
    })

    // 전투 시작
    for (let turn = 1; turn <= 8; turn++) {
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

      // 영구 효과 + 시너지 카드 효과 적용 (아군만)
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
      }

      const adjustedSuccessRate = Math.min(95, skill.successRate + battleBonus)
      const success = Math.random() * 100 < adjustedSuccessRate

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

      // 대사 추가 (랜덤)
      if (Math.random() > 0.4) {
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

    // 결과 계산
    const attackerScore = logs.filter(l =>
      currentBattle.value!.attacker.generals.some(g => g.name === l.generalName) && l.success
    ).length

    const defenderScore = logs.filter(l =>
      currentBattle.value!.defender.generals.some(g => g.name === l.generalName) && l.success
    ).length

    currentBattle.value.result = attackerScore > defenderScore ? 'victory' : 'defeat'

    // 엔딩 나레이션
    const endingStory = currentBattle.value.result === 'victory'
      ? `치열한 전투 끝에 ${currentBattle.value.attacker.kingdomName}이 승리를 거머쥐었다! 적군은 전장에서 퇴각하며 패배를 인정했다.`
      : `${currentBattle.value.defender.kingdomName}의 방어선을 뚫지 못했다. ${currentBattle.value.attacker.kingdomName}의 군대는 어쩔 수 없이 후퇴해야 했다...`

    logs.push({
      turn: 999,
      generalName: '',
      action: '',
      success: true,
      message: '',
      story: endingStory,
      narrativeType: 'narration'
    })

    // 모든 로그를 한번에 설정
    currentBattle.value.log = logs

    // 스크롤 애니메이션 시작
    await new Promise(resolve => setTimeout(resolve, 100))
    startScrollAnimation()

    handleBattleEnd(currentBattle.value.result)
  }

  // 스토리 기반 전투 시작
  const startStoryBattle = async (mode: 'empire' | 'normal' = 'normal') => {
    // 병력이 없으면 전투 불가
    if (kingdom.value.resources.soldiers <= 0) {
      showNotification('병력이 부족합니다!', 'error')
      return
    }

    // 전투 모드 설정
    currentBattleMode.value = mode

    // 전투용 임시 지휘관 생성 (장수 시스템 제거로 인한 대체)
    const battleCommander = {
      id: 'battle-commander',
      name: kingdom.value.ruler || '사령관',
      title: '지휘관',
      rarity: 'common' as const,
      stats: {
        power: 50,
        intelligence: 50,
        leadership: 50
      },
      skills: [
        {
          id: 'basic-attack',
          name: '전군 돌격',
          description: '전군이 일제히 돌격한다',
          successRate: 65,
          effect: {
            type: 'damage',
            value: 100
          }
        }
      ],
      assignedSoldiers: kingdom.value.resources.soldiers
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

      // 제국 전투 모드면 제국군, 아니면 일반 적
      const enemy = mode === 'empire'
        ? empireKingdom
        : enemyKingdoms[Math.floor(Math.random() * enemyKingdoms.length)]
      const enemyName = enemy.name
      const enemyGenerals = enemy.generals

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
      // 제국 전투 모드면 제국군, 아니면 일반 적
      const enemy = mode === 'empire'
        ? empireKingdom
        : enemyKingdoms[Math.floor(Math.random() * enemyKingdoms.length)]
      const enemyName = enemy.name
      const enemyGenerals = enemy.generals

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
    handleBattleEnd
  }
}
