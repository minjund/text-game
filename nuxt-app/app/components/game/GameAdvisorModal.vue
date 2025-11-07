<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-backdrop" @click.self="handleClose">
      <div class="modal-container" :class="modalClass">
        <!-- 조언자 아이콘 -->
        <div class="advisor-avatar">
          <div class="avatar-circle">
            <span class="avatar-icon">🧙‍♂️</span>
          </div>
          <div v-if="urgent" class="urgent-badge">❗</div>
        </div>

        <!-- 타이틀 -->
        <h2 class="modal-title" :class="{ 'important': important || final }">
          {{ title }}
        </h2>

        <!-- 메시지 -->
        <div class="modal-message">
          <p v-for="(line, index) in messageLines" :key="index" class="message-line">
            {{ line }}
          </p>
        </div>

        <!-- 보상 표시 -->
        <div v-if="rewards" class="rewards-container">
          <div class="rewards-title">✨ 보상</div>
          <div class="rewards-grid">
            <div v-if="rewards.gold" class="reward-item">
              <span class="reward-icon">💰</span>
              <span class="reward-text">금 +{{ rewards.gold }}</span>
            </div>
            <div v-if="rewards.food" class="reward-item">
              <span class="reward-icon">🌾</span>
              <span class="reward-text">식량 +{{ rewards.food }}</span>
            </div>
            <div v-if="rewards.soldiers" class="reward-item">
              <span class="reward-icon">⚔️</span>
              <span class="reward-text">병사 +{{ rewards.soldiers }}</span>
            </div>
          </div>
        </div>

        <!-- 특별 메시지 (최종 튜토리얼) -->
        <div v-if="final" class="final-message">
          <div class="final-icon">🎓</div>
          <div class="final-text">튜토리얼 완료!</div>
        </div>

        <!-- 버튼 -->
        <div class="modal-actions">
          <button class="btn-confirm" :class="buttonClass" @click="handleConfirm">
            {{ confirmText }}
          </button>
        </div>

        <!-- 닫기 버튼 (긴급하지 않을 때만) -->
        <button v-if="!urgent && !important" class="btn-close" @click="handleClose">
          ✕
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Rewards {
  gold?: number
  food?: number
  soldiers?: number
}

interface Props {
  show: boolean
  title: string
  message: string
  rewards?: Rewards
  urgent?: boolean
  important?: boolean
  final?: boolean
  confirmText?: string
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: '확인'
})

const emit = defineEmits<{
  close: []
  confirm: []
}>()

// 메시지를 줄바꿈으로 분리
const messageLines = computed(() => {
  return props.message.split('\n').filter(line => line.trim())
})

// 모달 클래스
const modalClass = computed(() => ({
  'modal-urgent': props.urgent,
  'modal-important': props.important,
  'modal-final': props.final
}))

// 버튼 클래스
const buttonClass = computed(() => ({
  'btn-urgent': props.urgent,
  'btn-important': props.important,
  'btn-final': props.final
}))

const handleClose = () => {
  if (!props.urgent && !props.important) {
    emit('close')
  }
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  position: relative;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%);
  border: 2px solid rgba(139, 92, 246, 0.5);
  border-radius: 24px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: modal-slide-up 0.3s ease-out;
}

@keyframes modal-slide-up {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-container.modal-urgent {
  border-color: rgba(239, 68, 68, 0.6);
  box-shadow:
    0 20px 60px rgba(239, 68, 68, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.modal-container.modal-important {
  border-color: rgba(245, 158, 11, 0.6);
  box-shadow:
    0 20px 60px rgba(245, 158, 11, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.modal-container.modal-final {
  border-color: rgba(34, 197, 94, 0.6);
  box-shadow:
    0 20px 60px rgba(34, 197, 94, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.advisor-avatar {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.avatar-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.avatar-icon {
  font-size: 56px;
  line-height: 1;
}

.urgent-badge {
  position: absolute;
  top: -10px;
  right: calc(50% - 60px);
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.6);
  animation: urgent-pulse 2s ease-in-out infinite;
}

@keyframes urgent-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.modal-title {
  font-size: 28px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 24px;
  color: #e0e7ff;
  font-family: 'Cinzel', serif;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.modal-title.important {
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
}

.modal-message {
  margin-bottom: 24px;
}

.message-line {
  font-size: 16px;
  line-height: 1.8;
  color: #cbd5e1;
  margin-bottom: 12px;
  text-align: center;
}

.message-line:last-child {
  margin-bottom: 0;
}

.rewards-container {
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
}

.rewards-title {
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  color: #a78bfa;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.rewards-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.4);
}

.reward-icon {
  font-size: 24px;
}

.reward-text {
  font-size: 16px;
  font-weight: 700;
  color: #e0e7ff;
}

.final-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(34, 197, 94, 0.1);
  border: 2px solid rgba(34, 197, 94, 0.4);
  border-radius: 16px;
}

.final-icon {
  font-size: 32px;
}

.final-text {
  font-size: 20px;
  font-weight: 800;
  color: #86efac;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modal-actions {
  display: flex;
  justify-content: center;
}

.btn-confirm {
  padding: 16px 48px;
  font-size: 16px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
  font-family: 'Cinzel', serif;
}

.btn-confirm:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(139, 92, 246, 0.6);
}

.btn-confirm:active {
  transform: translateY(-1px);
}

.btn-confirm.btn-urgent {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.btn-confirm.btn-urgent:hover {
  box-shadow: 0 8px 28px rgba(239, 68, 68, 0.6);
}

.btn-confirm.btn-important {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.btn-confirm.btn-important:hover {
  box-shadow: 0 8px 28px rgba(245, 158, 11, 0.6);
}

.btn-confirm.btn-final {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.btn-confirm.btn-final:hover {
  box-shadow: 0 8px 28px rgba(34, 197, 94, 0.6);
}

.btn-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(71, 85, 105, 0.5);
  color: #cbd5e1;
  font-size: 20px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: rgba(239, 68, 68, 0.8);
  color: white;
  transform: rotate(90deg);
}

/* 모달 트랜지션 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* 모바일 최적화 */
@media (max-width: 768px) {
  .modal-container {
    padding: 28px 20px;
    max-height: 85vh;
  }

  .avatar-circle {
    width: 80px;
    height: 80px;
  }

  .avatar-icon {
    font-size: 48px;
  }

  .modal-title {
    font-size: 22px;
  }

  .message-line {
    font-size: 14px;
  }

  .btn-confirm {
    padding: 14px 36px;
    font-size: 14px;
  }

  .rewards-grid {
    gap: 12px;
  }

  .reward-item {
    padding: 8px 12px;
  }

  .reward-icon {
    font-size: 20px;
  }

  .reward-text {
    font-size: 14px;
  }
}
</style>
