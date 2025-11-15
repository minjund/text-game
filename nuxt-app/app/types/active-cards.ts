// 액티브 카드 - 전투 중 직접 사용하는 카드
export type ActiveCardEffect =
  | 'instant_damage'      // 즉시 대미지
  | 'heal'                // 아군 회복
  | 'turn_skip'           // 적 턴 스킵
  | 'power_boost'         // 일시적 공격력 대폭 증가
  | 'defense_boost'       // 일시적 방어력 대폭 증가
  | 'critical_strike'     // 다음 공격 치명타
  | 'reverse_momentum'    // 전세 역전
  | 'multi_strike'        // 연속 공격
  | 'enemy_weaken'        // 적 약화
  | 'morale_boost'        // 사기 진작

export interface ActiveCard {
  id: string
  name: string
  description: string
  icon: string
  image: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  cost?: number // 사용 비용 (턴 포인트 등, 현재는 사용 안함)
  effectType: ActiveCardEffect
  power: number // 효과의 강도 (대미지량, 회복량, 증가율 등)
  duration?: number // 지속 턴 수 (버프/디버프용)
  // 전투 효과 설명 (게임 내 표시용)
  battleDescription: string
}

// 액티브 카드 목록
export const ACTIVE_CARDS: ActiveCard[] = [
  // === 일반 등급 ===
  {
    id: 'active_quick_strike',
    name: '신속한 일격',
    description: '빠른 속도로 적에게 중간 데미지를 입힙니다',
    icon: '⚡',
    image: '/cards/quick_strike.png',
    rarity: 'common',
    effectType: 'instant_damage',
    power: 20,
    battleDescription: '적에게 20의 즉시 피해를 입힙니다'
  },
  {
    id: 'active_minor_heal',
    name: '응급 치료',
    description: '아군의 부상을 치료하여 전열을 정비합니다',
    icon: '💊',
    image: '/cards/minor_heal.png',
    rarity: 'common',
    effectType: 'heal',
    power: 15,
    battleDescription: '아군 병력이 15% 회복됩니다'
  },
  {
    id: 'active_inspire',
    name: '사기 진작',
    description: '아군의 사기를 높여 전투력을 상승시킵니다',
    icon: '📣',
    image: '/cards/inspire.png',
    rarity: 'common',
    effectType: 'morale_boost',
    power: 15,
    duration: 2,
    battleDescription: '2턴 동안 아군 공격 성공률 +15%'
  },
  {
    id: 'active_power_strike',
    name: '강타',
    description: '강력한 일격으로 적에게 큰 피해를 입힙니다',
    icon: '💥',
    image: '/cards/power_strike.png',
    rarity: 'common',
    effectType: 'instant_damage',
    power: 30,
    battleDescription: '적에게 30의 즉시 피해를 입힙니다'
  },

  // === 희귀 등급 ===
  {
    id: 'active_shield_wall',
    name: '방패의 장벽',
    description: '든든한 방어막을 형성하여 적의 공격을 막습니다',
    icon: '🛡️',
    image: '/cards/shield_wall.png',
    rarity: 'rare',
    effectType: 'defense_boost',
    power: 30,
    duration: 2,
    battleDescription: '2턴 동안 아군 방어력 +30%'
  },
  {
    id: 'active_war_cry',
    name: '전쟁의 함성',
    description: '강력한 함성으로 아군을 고무하고 적을 위축시킵니다',
    icon: '🔊',
    image: '/cards/war_cry.png',
    rarity: 'rare',
    effectType: 'power_boost',
    power: 25,
    duration: 2,
    battleDescription: '2턴 동안 아군 공격력 +25%'
  },
  {
    id: 'active_devastating_blow',
    name: '파멸의 일격',
    description: '치명적인 공격으로 적에게 막대한 피해를 입힙니다',
    icon: '⚔️',
    image: '/cards/devastating_blow.png',
    rarity: 'rare',
    effectType: 'instant_damage',
    power: 45,
    battleDescription: '적에게 45의 치명적인 피해를 입힙니다'
  },
  {
    id: 'active_tactical_retreat',
    name: '전술적 후퇴',
    description: '일시적으로 후퇴하여 전열을 재정비합니다',
    icon: '🔄',
    image: '/cards/tactical_retreat.png',
    rarity: 'rare',
    effectType: 'heal',
    power: 25,
    battleDescription: '아군 병력이 25% 회복됩니다'
  },
  {
    id: 'active_smoke_bomb',
    name: '연막탄',
    description: '연막을 펼쳐 적의 시야를 가리고 공격을 회피합니다',
    icon: '💨',
    image: '/cards/smoke_bomb.png',
    rarity: 'rare',
    effectType: 'turn_skip',
    power: 1,
    battleDescription: '적의 다음 1턴을 무효화합니다'
  },

  // === 영웅 등급 ===
  {
    id: 'active_berserker_rage',
    name: '광전사의 분노',
    description: '극한의 분노로 압도적인 전투력을 발휘합니다',
    icon: '😤',
    image: '/cards/berserker_rage.png',
    rarity: 'epic',
    effectType: 'power_boost',
    power: 40,
    duration: 3,
    battleDescription: '3턴 동안 아군 공격력 +40%'
  },
  {
    id: 'active_divine_shield',
    name: '신성한 방패',
    description: '신의 가호를 받아 절대 방어를 펼칩니다',
    icon: '✨',
    image: '/cards/divine_shield.png',
    rarity: 'epic',
    effectType: 'defense_boost',
    power: 50,
    duration: 3,
    battleDescription: '3턴 동안 아군 방어력 +50%'
  },
  {
    id: 'active_thunderbolt',
    name: '천둥의 일격',
    description: '하늘의 천둥을 소환하여 적을 강타합니다',
    icon: '⚡',
    image: '/cards/thunderbolt.png',
    rarity: 'epic',
    effectType: 'instant_damage',
    power: 60,
    battleDescription: '적에게 60의 천둥 피해를 입힙니다'
  },
  {
    id: 'active_double_strike',
    name: '연속 돌격',
    description: '연속된 공격으로 적을 압도합니다',
    icon: '⚔️⚔️',
    image: '/cards/double_strike.png',
    rarity: 'epic',
    effectType: 'multi_strike',
    power: 2,
    battleDescription: '즉시 2번의 추가 공격을 실행합니다'
  },
  {
    id: 'active_curse_of_weakness',
    name: '약화의 저주',
    description: '적에게 저주를 걸어 전투력을 크게 감소시킵니다',
    icon: '🌑',
    image: '/cards/curse_weakness.png',
    rarity: 'epic',
    effectType: 'enemy_weaken',
    power: 30,
    duration: 3,
    battleDescription: '3턴 동안 적 공격력 -30%'
  },

  // === 전설 등급 ===
  {
    id: 'active_gods_judgment',
    name: '신의 심판',
    description: '신의 힘을 빌려 적을 심판합니다',
    icon: '⚡️',
    image: '/cards/gods_judgment.png',
    rarity: 'legendary',
    effectType: 'instant_damage',
    power: 100,
    battleDescription: '적에게 100의 절대적인 피해를 입힙니다'
  },
  {
    id: 'active_miracle',
    name: '기적의 부활',
    description: '기적을 일으켜 아군을 완전히 회복시킵니다',
    icon: '✨',
    image: '/cards/miracle.png',
    rarity: 'legendary',
    effectType: 'heal',
    power: 50,
    battleDescription: '아군 병력이 50% 회복됩니다'
  },
  {
    id: 'active_reverse_fate',
    name: '운명의 역전',
    description: '전세를 완전히 역전시킵니다',
    icon: '🔄',
    image: '/cards/reverse_fate.png',
    rarity: 'legendary',
    effectType: 'reverse_momentum',
    power: 50,
    battleDescription: '전투 점수를 크게 역전시킵니다 (성공 공격 +3)'
  },
  {
    id: 'active_time_stop',
    name: '시간 정지',
    description: '시간을 멈춰 적의 공격을 완전히 무력화합니다',
    icon: '⏸️',
    image: '/cards/time_stop.png',
    rarity: 'legendary',
    effectType: 'turn_skip',
    power: 2,
    battleDescription: '적의 다음 2턴을 무효화합니다'
  },
  {
    id: 'active_ultimate_power',
    name: '궁극의 힘',
    description: '모든 힘을 해방하여 압도적인 전투력을 발휘합니다',
    icon: '💫',
    image: '/cards/ultimate_power.png',
    rarity: 'legendary',
    effectType: 'power_boost',
    power: 60,
    duration: 3,
    battleDescription: '3턴 동안 아군 공격력 +60%'
  },
  {
    id: 'active_triple_strike',
    name: '삼연격',
    description: '세 번의 연속 공격으로 적을 제압합니다',
    icon: '⚔️⚔️⚔️',
    image: '/cards/triple_strike.png',
    rarity: 'legendary',
    effectType: 'multi_strike',
    power: 3,
    battleDescription: '즉시 3번의 추가 공격을 실행합니다'
  }
]
