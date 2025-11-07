<template>
  <GameCard
    :variant="selected ? 'primary' : 'default'"
    :hoverable="!disabled"
    :clickable="!disabled"
    :selected="selected"
    :disabled="disabled"
    @click="!disabled && $emit('click', commandment)"
  >
    <div class="commandment-card">
      <div class="commandment-header">
        <div class="commandment-icon">{{ commandment.icon }}</div>
        <div class="commandment-info">
          <h3 class="commandment-name">{{ commandment.name }}</h3>
          <GameBadge v-if="selected" variant="success" size="small">
            선택됨
          </GameBadge>
        </div>
      </div>

      <p class="commandment-description">{{ commandment.description }}</p>

      <div class="commandment-effects">
        <div v-if="commandment.pros.length > 0" class="effects-section">
          <h4 class="effects-title">장점</h4>
          <ul class="effects-list">
            <li v-for="(pro, index) in commandment.pros" :key="index" class="effect-item pro">
              <span class="bullet">✓</span>
              {{ pro }}
            </li>
          </ul>
        </div>

        <div v-if="commandment.cons.length > 0" class="effects-section">
          <h4 class="effects-title">단점</h4>
          <ul class="effects-list">
            <li v-for="(con, index) in commandment.cons" :key="index" class="effect-item con">
              <span class="bullet">✗</span>
              {{ con }}
            </li>
          </ul>
        </div>
      </div>

      <div v-if="commandment.effects" class="stat-effects">
        <GameBadge
          v-for="(value, key) in commandment.effects"
          :key="key"
          :variant="value > 0 ? 'success' : 'danger'"
          size="small"
        >
          {{ getEffectLabel(key) }}: {{ value > 0 ? '+' : '' }}{{ value }}
        </GameBadge>
      </div>
    </div>
  </GameCard>
</template>

<script setup lang="ts">
import GameCard from '~/components/ui/GameCard.vue'
import GameBadge from '~/components/ui/GameBadge.vue'

export interface Commandment {
  icon: string
  name: string
  description: string
  pros: string[]
  cons: string[]
  effects?: Record<string, number>
}

interface Props {
  commandment: Commandment
  selected?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  selected: false,
  disabled: false
})

defineEmits<{
  click: [commandment: Commandment]
}>()

const getEffectLabel = (key: string): string => {
  const labels: Record<string, string> = {
    morale: '민심',
    gold: '금',
    military: '군사력',
    food: '식량',
    culture: '문화'
  }
  return labels[key] || key
}
</script>

<style scoped>
.commandment-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.commandment-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.commandment-icon {
  font-size: 48px;
  filter: drop-shadow(0 2px 8px rgba(139, 92, 246, 0.4));
  flex-shrink: 0;
}

.commandment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.commandment-name {
  font-size: 22px;
  font-weight: 700;
  font-family: 'Cinzel', serif;
  color: #e2e8f0;
  margin: 0;
}

.commandment-description {
  font-size: 15px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.commandment-effects {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.effects-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.effects-title {
  font-size: 14px;
  font-weight: 700;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.effects-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.effect-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.bullet {
  font-weight: 700;
  flex-shrink: 0;
}

.effect-item.pro {
  color: #86efac;
}

.effect-item.pro .bullet {
  color: #22c55e;
}

.effect-item.con {
  color: #fca5a5;
}

.effect-item.con .bullet {
  color: #ef4444;
}

.stat-effects {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
}
</style>
