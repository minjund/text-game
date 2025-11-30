import type { PassiveCard } from '~/types/passive-cards'
import type { ActiveCard, ActiveCardEffect } from '~/types/active-cards'

/**
 * 패시브 카드를 액티브 카드로 변환
 * 전투 덱의 패시브 카드를 전투 중 사용 가능한 액티브 카드로 변환합니다
 */
export function convertPassiveToActiveCard(passiveCard: PassiveCard): ActiveCard {
  const { effect } = passiveCard

  // 패시브 카드 효과를 기반으로 액티브 카드 효과 타입 결정
  let effectType: ActiveCardEffect = 'instant_damage'
  let power = 0
  let duration: number | undefined
  let battleDescription = ''

  // 전투 효과가 있는 경우
  if (effect.type === 'combat') {
    if (effect.attackBonus && effect.attackBonus > 0) {
      effectType = 'power_boost'
      power = effect.attackBonus
      duration = 2
      battleDescription = `2턴 동안 아군 공격력 +${effect.attackBonus}%`
    } else if (effect.defenseBonus && effect.defenseBonus > 0) {
      effectType = 'defense_boost'
      power = effect.defenseBonus
      duration = 2
      battleDescription = `2턴 동안 아군 방어력 +${effect.defenseBonus}%`
    } else if (effect.skillPowerBonus && effect.skillPowerBonus > 0) {
      effectType = 'power_boost'
      power = effect.skillPowerBonus
      duration = 2
      battleDescription = `2턴 동안 아군 스킬 위력 +${effect.skillPowerBonus}%`
    }
  }
  // 리소스 효과가 있는 경우 (치유나 사기 진작으로 변환)
  else if (effect.type === 'resource') {
    if (effect.morale && effect.morale > 0) {
      effectType = 'morale_boost'
      power = Math.min(effect.morale * 3, 30) // 사기를 % 보너스로 변환
      duration = 2
      battleDescription = `2턴 동안 아군 사기 +${power}%`
    } else if (effect.military && effect.military > 0) {
      effectType = 'instant_damage'
      power = Math.min(effect.military * 2, 50)
      battleDescription = `적에게 ${power}의 피해를 입힙니다`
    } else {
      // 기타 리소스는 회복으로 변환
      effectType = 'heal'
      power = 15
      battleDescription = '아군 병력이 15% 회복됩니다'
    }
  }
  // 특수 효과
  else if (effect.type === 'special') {
    effectType = 'morale_boost'
    power = 20
    duration = 2
    battleDescription = effect.description || '2턴 동안 아군 사기 +20%'
  }

  return {
    id: `converted_${passiveCard.id}`,
    name: passiveCard.name,
    description: passiveCard.description,
    icon: passiveCard.icon,
    image: passiveCard.image,
    rarity: passiveCard.rarity,
    effectType,
    power,
    duration,
    battleDescription
  }
}

/**
 * 여러 패시브 카드를 액티브 카드 배열로 변환
 */
export function convertPassiveCardsToActiveCards(passiveCards: (PassiveCard | null)[]): ActiveCard[] {
  return passiveCards
    .filter((card): card is PassiveCard => card !== null)
    .map(card => convertPassiveToActiveCard(card))
}
