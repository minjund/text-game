import { ref, computed } from 'vue'
import type { PassiveCard, CardDeck } from '~/types/passive-cards'

export const useCardDeck = (playerCards: Ref<PassiveCard[]>) => {
  // 카드 덱 초기화 (내정 3장, 전투 3장)
  const cardDeck = ref<CardDeck>({
    domestic: [null, null, null],
    battle: [null, null, null]
  })

  // localStorage 키
  const DECK_STORAGE_KEY = 'cardDeck'

  // 카드가 내정 카드인지 확인
  const isDomesticCard = (card: PassiveCard): boolean => {
    return card.trigger === 'daily' || card.trigger === 'recruit'
  }

  // 카드가 전투 카드인지 확인
  const isBattleCard = (card: PassiveCard): boolean => {
    return card.isBattleCard === true ||
           card.trigger === 'battle_start' ||
           card.trigger === 'battle_win' ||
           card.trigger === 'battle_lose'
  }

  // 장착된 카드 목록
  const equippedCards = computed(() => {
    return [
      ...cardDeck.value.domestic.filter(c => c !== null),
      ...cardDeck.value.battle.filter(c => c !== null)
    ] as PassiveCard[]
  })

  // 장착 가능한 내정 카드 목록
  const availableDomesticCards = computed(() => {
    const equippedIds = equippedCards.value.map(c => c.id)
    return playerCards.value.filter(card =>
      isDomesticCard(card) && !equippedIds.includes(card.id)
    )
  })

  // 장착 가능한 전투 카드 목록
  const availableBattleCards = computed(() => {
    const equippedIds = equippedCards.value.map(c => c.id)
    return playerCards.value.filter(card =>
      isBattleCard(card) && !equippedIds.includes(card.id)
    )
  })

  // 카드를 덱에 장착
  const equipCard = (card: PassiveCard, slotType: 'domestic' | 'battle', slotIndex: number): boolean => {
    if (slotIndex < 0 || slotIndex > 2) return false

    // 카드 타입 검증
    if (slotType === 'domestic' && !isDomesticCard(card)) {
      return false
    }
    if (slotType === 'battle' && !isBattleCard(card)) {
      return false
    }

    // 이미 장착된 카드인지 확인
    if (equippedCards.value.some(c => c.id === card.id)) {
      return false
    }

    // 카드 장착
    cardDeck.value[slotType][slotIndex] = card
    saveDeck()
    return true
  }

  // 카드를 덱에서 제거
  const unequipCard = (slotType: 'domestic' | 'battle', slotIndex: number): boolean => {
    if (slotIndex < 0 || slotIndex > 2) return false

    cardDeck.value[slotType][slotIndex] = null
    saveDeck()
    return true
  }

  // 덱 저장
  const saveDeck = () => {
    if (process.client) {
      const deckData = {
        domestic: cardDeck.value.domestic.map(c => c?.id || null),
        battle: cardDeck.value.battle.map(c => c?.id || null)
      }
      localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(deckData))
    }
  }

  // 덱 로드
  const loadDeck = () => {
    if (process.client) {
      const saved = localStorage.getItem(DECK_STORAGE_KEY)
      if (saved) {
        try {
          const deckData = JSON.parse(saved)

          // ID로 카드 찾아서 복원
          cardDeck.value.domestic = deckData.domestic.map((id: string | null) => {
            if (!id) return null
            return playerCards.value.find(c => c.id === id) || null
          })

          cardDeck.value.battle = deckData.battle.map((id: string | null) => {
            if (!id) return null
            return playerCards.value.find(c => c.id === id) || null
          })
        } catch (e) {
          console.error('Failed to load deck:', e)
        }
      }
    }
  }

  // 덱 초기화
  const resetDeck = () => {
    cardDeck.value = {
      domestic: [null, null, null],
      battle: [null, null, null]
    }
    saveDeck()
  }

  // 특정 트리거에 해당하는 장착된 카드만 반환
  const getActiveCardsForTrigger = (trigger: 'daily' | 'battle_start' | 'battle_win' | 'battle_lose' | 'recruit'): PassiveCard[] => {
    return equippedCards.value.filter(card => card.trigger === trigger)
  }

  return {
    cardDeck,
    equippedCards,
    availableDomesticCards,
    availableBattleCards,
    isDomesticCard,
    isBattleCard,
    equipCard,
    unequipCard,
    saveDeck,
    loadDeck,
    resetDeck,
    getActiveCardsForTrigger
  }
}
