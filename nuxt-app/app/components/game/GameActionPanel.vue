<template>
  <div class="w-80 space-y-3">
    <ActionButton
      icon="👥"
      title="장수 관리"
      description="장수를 확인하고 병력을 배치합니다"
      variant="info"
      @click="$emit('show-generals')"
    />

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
      title="제국 침략"
      description="제국의 요새를 공격합니다"
      variant="danger"
      @click="$emit('start-battle')"
    />

    <ActionButton
      icon="🎴"
      title="다음 날"
      description="하루를 보내고 랜덤 이벤트 발생"
      variant="primary"
      @click="$emit('next-day')"
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
  'start-battle': []
  'next-day': []
  'recruit-soldiers': []
}>()
</script>
