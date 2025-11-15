import { ref, type Ref } from 'vue'
import type { ActiveCard } from '../types/active-cards'
import { ACTIVE_CARDS } from '../types/active-cards'

interface UseActiveCardsOptions {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void
}

export const useActiveCards = (options: UseActiveCardsOptions) => {
  const { showNotification } = options

  // State
  const ownedActiveCards = ref<ActiveCard[]>([])
  const battleActiveCards = ref<ActiveCard[]>([]) // 전투에 가져갈 카드 (최대 5장)
  const maxBattleCards = 5

  // localStorage에서 카드 불러오기
  const loadActiveCards = () => {
    if (process.client) {
      const saved = localStorage.getItem('activeCards')
      if (saved) {
        try {
          const cardIds = JSON.parse(saved)
          ownedActiveCards.value = ACTIVE_CARDS.filter(card => cardIds.includes(card.id))
        } catch (e) {
          console.error('액티브 카드 불러오기 실패:', e)
          ownedActiveCards.value = []
        }
      }
    }
  }

  // localStorage에 카드 저장
  const saveActiveCards = () => {
    if (process.client) {
      const cardIds = ownedActiveCards.value.map(card => card.id)
      localStorage.setItem('activeCards', JSON.stringify(cardIds))
    }
  }

  // 새 카드 획득
  const addActiveCard = (card: ActiveCard) => {
    if (!ownedActiveCards.value.find(c => c.id === card.id)) {
      ownedActiveCards.value.push(card)
      saveActiveCards()
      showNotification(`새로운 액티브 카드 획득: ${card.name}`, 'success')
    }
  }

  // 랜덤 카드 획득
  const addRandomActiveCard = (rarity?: 'common' | 'rare' | 'epic' | 'legendary') => {
    const availableCards = rarity
      ? ACTIVE_CARDS.filter(card => card.rarity === rarity)
      : ACTIVE_CARDS

    const newCards = availableCards.filter(card =>
      !ownedActiveCards.value.find(c => c.id === card.id)
    )

    if (newCards.length === 0) {
      showNotification('이미 모든 액티브 카드를 소유하고 있습니다!', 'info')
      return
    }

    const randomCard = newCards[Math.floor(Math.random() * newCards.length)]
    addActiveCard(randomCard)
  }

  // 전투 덱에 카드 추가
  const addToBattleDeck = (card: ActiveCard) => {
    if (battleActiveCards.value.length >= maxBattleCards) {
      showNotification('전투 덱은 최대 5장까지만 가능합니다!', 'error')
      return false
    }

    if (battleActiveCards.value.find(c => c.id === card.id)) {
      showNotification('이미 덱에 있는 카드입니다!', 'error')
      return false
    }

    battleActiveCards.value.push(card)
    showNotification(`${card.name}을(를) 전투 덱에 추가했습니다`, 'success')
    return true
  }

  // 전투 덱에서 카드 제거
  const removeFromBattleDeck = (cardId: string) => {
    const index = battleActiveCards.value.findIndex(c => c.id === cardId)
    if (index !== -1) {
      const removed = battleActiveCards.value.splice(index, 1)[0]
      showNotification(`${removed.name}을(를) 전투 덱에서 제거했습니다`, 'info')
      return true
    }
    return false
  }

  // 전투 덱 초기화
  const clearBattleDeck = () => {
    battleActiveCards.value = []
  }

  // 시작 카드 지급 (튜토리얼용)
  const grantStarterCards = () => {
    const starterCardIds = [
      'active_quick_strike',  // 신속한 일격
      'active_minor_heal',    // 응급 치료
      'active_inspire'        // 사기 진작
    ]

    starterCardIds.forEach(id => {
      const card = ACTIVE_CARDS.find(c => c.id === id)
      if (card) {
        addActiveCard(card)
      }
    })
  }

  return {
    // State
    ownedActiveCards,
    battleActiveCards,
    maxBattleCards,

    // Methods
    loadActiveCards,
    saveActiveCards,
    addActiveCard,
    addRandomActiveCard,
    addToBattleDeck,
    removeFromBattleDeck,
    clearBattleDeck,
    grantStarterCards
  }
}
