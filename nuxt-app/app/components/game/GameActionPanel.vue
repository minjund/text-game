<template>
  <div class="w-80 space-y-3">
    <ActionButton
      icon="✨"
      title="신의 계명"
      description="신이 내린 계명을 확인합니다"
      variant="warning"
      @click="$emit('show-commandments')"
    />

    <ActionButton
      icon="🎴"
      title="보유 카드"
      description="보유한 패시브 카드를 확인합니다"
      variant="info"
      @click="$emit('show-passive-cards')"
    />

    <ActionButton
      icon="📚"
      title="카드 도감"
      description="모든 카드와 시너지 효과를 확인합니다"
      variant="info"
      @click="$emit('show-card-guide')"
    />

    <ActionButton
      icon="⚔️"
      title="일반 전투"
      description="적 세력과 전투를 벌입니다"
      variant="success"
      @click="$emit('start-normal-battle')"
    />

    <ActionButton
      icon="🛡️"
      title="병력 모집"
      description="금 200으로 병력 100 모집"
      variant="success"
      @click="$emit('recruit-soldiers')"
    />
  </div>
</template>

<script setup lang="ts">
import ActionButton from './ActionButton.vue'

defineEmits<{
  'show-generals': []
  'show-commandments': []
  'show-passive-cards': []
  'show-card-guide': []
  'start-normal-battle': []
  'recruit-soldiers': []
}>()
</script>
