import { ref, type Ref } from 'vue'
import type { General, Kingdom } from '~/types/game'

export const useGameGenerals = (
  kingdom: Ref<Kingdom>,
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void
) => {
  const generals = ref<General[]>([])
  const showGenerals = ref(false)

  // 랜덤 장수 생성 함수
  const generateRandomGeneral = (rarity?: 'common' | 'rare' | 'epic'): General => {
    // 랭크별 확률 (지정되지 않은 경우)
    const randomRarity = rarity || (() => {
      const rand = Math.random()
      if (rand < 0.60) return 'common' // 60% 일반
      if (rand < 0.90) return 'rare'   // 30% 희귀
      return 'epic'                     // 10% 영웅
    })()

    // 랭크별 스탯 범위
    const statRanges: Record<'common' | 'rare' | 'epic', { min: number; max: number }> = {
      common: { min: 30, max: 50 },
      rare: { min: 50, max: 75 },
      epic: { min: 75, max: 95 }
    }

    const range = statRanges[randomRarity]
    const randomStat = () => Math.floor(Math.random() * (range.max - range.min + 1)) + range.min

    // 장수 이름과 칭호 풀 (판타지 가상 이름)
    const firstNames = ['아르', '카이', '레온', '세라', '노아', '루나', '제로', '미라', '리안', '소라', '엘리', '테오', '니나', '라이', '유리']
    const lastNames = ['스', '엘', '온', '드', '아', '리스', '베르', '윈', '하르트', '피르', '실', '페', '데', '나', '안']
    const titles = ['검성', '대마법사', '그림자', '수호자', '파괴자', '현자', '암살자', '전쟁군주', '현인', '용기사', '신궁', '칼날', '폭풍', '빛의 기사', '어둠의 지배자']

    const name = firstNames[Math.floor(Math.random() * firstNames.length)] +
                 lastNames[Math.floor(Math.random() * lastNames.length)]
    const title = titles[Math.floor(Math.random() * titles.length)]

    // 스킬 생성 (영웅 등급만 스킬 1개 보유)
    const skills: typeof General.prototype.skills = []

    if (randomRarity === 'epic') {
      const availableSkills = [
        { id: 'critical-strike', name: '필살의 일격', description: '강력한 일격으로 큰 피해를 입힌다', successRate: 70, effect: { type: 'damage' as const, value: 30 } },
        { id: 'defense-stance', name: '철벽 방어', description: '단단한 방어로 피해를 줄인다', successRate: 80, effect: { type: 'defense' as const, value: 25 } },
        { id: 'morale-boost', name: '사기 고양', description: '아군의 사기를 올린다', successRate: 85, effect: { type: 'buff' as const, value: 20 } },
        { id: 'confusion', name: '혼란', description: '적의 전의를 꺾는다', successRate: 65, effect: { type: 'debuff' as const, value: 20 } },
        { id: 'rapid-strike', name: '연속 공격', description: '빠른 연속 공격', successRate: 75, effect: { type: 'damage' as const, value: 25 } },
        { id: 'shield-wall', name: '방패의 벽', description: '완벽한 방어 진형', successRate: 70, effect: { type: 'defense' as const, value: 30 } }
      ]

      // 영웅은 1개의 랜덤 스킬 보유
      const randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)]
      skills.push(randomSkill)
    }

    return {
      id: `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      title,
      rarity: randomRarity,
      stats: {
        power: randomStat(),
        intelligence: randomStat(),
        leadership: randomStat()
      },
      skills,
      assignedSoldiers: 0
    }
  }

  // 장수 병력 배치
  const assignSoldiers = (generalId: string, amount: number) => {
    const general = generals.value.find(g => g.id === generalId)
    if (!general) return

    if (kingdom.value.resources.soldiers < amount) {
      showNotification('병력이 부족합니다!', 'error')
      return
    }

    kingdom.value.resources.soldiers = Math.max(0, kingdom.value.resources.soldiers - amount)
    general.assignedSoldiers += amount
    showNotification(`${general.name}에게 병력 ${amount}을 배치했습니다!`, 'success')
  }

  // 장수 병력 회수
  const unassignSoldiers = (generalId: string, amount: number) => {
    const general = generals.value.find(g => g.id === generalId)
    if (!general) return

    if (general.assignedSoldiers < amount) {
      showNotification('배치된 병력이 부족합니다!', 'error')
      return
    }

    general.assignedSoldiers -= amount
    kingdom.value.resources.soldiers += amount
    showNotification(`${general.name}에게서 병력 ${amount}을 회수했습니다!`, 'success')
  }

  // 장수 해고
  const dismissGeneral = (generalId: string) => {
    const general = generals.value.find(g => g.id === generalId)
    if (!general) return

    // 확인 메시지
    if (!confirm(`${general.name}을(를) 정말 해고하시겠습니까?`)) {
      return
    }

    // 배치된 병력 반환
    if (general.assignedSoldiers > 0) {
      kingdom.value.resources.soldiers += general.assignedSoldiers
    }

    // 장수 목록에서 제거
    generals.value = generals.value.filter(g => g.id !== generalId)

    showNotification(`${general.name}을(를) 해고했습니다.`, 'success')
  }

  return {
    generals,
    showGenerals,
    generateRandomGeneral,
    assignSoldiers,
    unassignSoldiers,
    dismissGeneral
  }
}
