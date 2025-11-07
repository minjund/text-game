import { ref, computed } from 'vue'
import type { PassiveCard } from '~/types/passive-cards'

export const useGamePassiveCards = () => {
  const playerPassiveCards = ref<PassiveCard[]>([])
  const showPassiveCardSelection = ref(false)
  const availablePassiveCards = ref<PassiveCard[]>([])
  const availableCardsForReincarnation = computed(() => playerPassiveCards.value)

  return {
    playerPassiveCards,
    showPassiveCardSelection,
    availablePassiveCards,
    availableCardsForReincarnation
  }
}
