<template>
  <GameCard
    :variant="rarityVariant"
    :hoverable="true"
    :clickable="clickable"
    :selected="selected"
    @click="$emit('click', general)"
  >
    <div class="general-card">
      <div class="general-header">
        <div class="general-name">{{ general.name }}</div>
        <GameBadge :variant="rarityBadgeVariant" size="small">
          {{ general.rarity }}
        </GameBadge>
      </div>

      <div class="general-stats">
        <div class="stat-row">
          <span class="stat-label">⚔️ 공격력</span>
          <span class="stat-value">{{ general.attack }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">🛡️ 방어력</span>
          <span class="stat-value">{{ general.defense }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">❤️ 체력</span>
          <span class="stat-value">{{ general.health }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">⚡ 속도</span>
          <span class="stat-value">{{ general.speed }}</span>
        </div>
      </div>

      <div v-if="general.skills && general.skills.length > 0" class="general-skills">
        <div class="skills-label">스킬</div>
        <div class="skills-list">
          <GameBadge
            v-for="(skill, index) in general.skills"
            :key="index"
            variant="primary"
            size="small"
          >
            {{ skill }}
          </GameBadge>
        </div>
      </div>
    </div>
  </GameCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import GameCard from '~/components/ui/GameCard.vue'
import GameBadge from '~/components/ui/GameBadge.vue'

interface General {
  name: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  attack: number
  defense: number
  health: number
  speed: number
  skills?: string[]
}

interface Props {
  general: General
  clickable?: boolean
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clickable: false,
  selected: false
})

defineEmits<{
  click: [general: General]
}>()

const rarityVariant = computed(() => {
  const variantMap = {
    common: 'default',
    rare: 'info',
    epic: 'primary',
    legendary: 'warning'
  }
  return variantMap[props.general.rarity] as 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
})

const rarityBadgeVariant = computed(() => {
  return `rarity-${props.general.rarity}` as 'rarity-common' | 'rarity-rare' | 'rarity-epic' | 'rarity-legendary'
})
</script>

<style scoped>
.general-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.general-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.general-name {
  font-size: 18px;
  font-weight: 700;
  font-family: 'Cinzel', serif;
  color: #e2e8f0;
  flex: 1;
}

.general-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #e2e8f0;
  font-family: 'Cinzel', serif;
}

.general-skills {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skills-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
