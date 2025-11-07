<template>
  <div class="turn-counter-container">
    <!-- 턴 표시 -->
    <div class="turn-display">
      <div class="turn-icon">🎯</div>
      <div class="turn-info">
        <div class="turn-label">남은 턴</div>
        <div class="turn-value">
          <span class="current-turns" :class="{ 'low-turns': currentTurns < 20 }">
            {{ currentTurns }}
          </span>
          <span class="turn-separator">/</span>
          <span class="max-turns">{{ maxTurns }}</span>
        </div>
      </div>
    </div>

    <!-- 충전 시간 정보 -->
    <div v-if="currentTurns < maxTurns" class="recharge-info-container">
      <!-- 다음 1턴까지 남은 시간 -->
      <div v-if="timeUntilNext" class="recharge-info next-turn">
        <div class="recharge-header">
          <span class="recharge-icon">⏳</span>
          <span class="recharge-label">다음 1턴 충전까지</span>
        </div>
        <div class="recharge-time">
          <span v-if="timeUntilNext.days > 0" class="time-unit">{{ timeUntilNext.days }}<span class="unit-label">일</span> </span>
          <span class="time-unit">{{ String(timeUntilNext.hours).padStart(2, '0') }}<span class="unit-label">시간</span></span>
          <span class="time-separator">:</span>
          <span class="time-unit">{{ String(timeUntilNext.minutes).padStart(2, '0') }}<span class="unit-label">분</span></span>
          <span class="time-separator">:</span>
          <span class="time-unit">{{ String(timeUntilNext.seconds).padStart(2, '0') }}<span class="unit-label">초</span></span>
        </div>
      </div>

      <!-- 전체 충전까지 남은 시간 -->
      <div v-if="timeUntilFull" class="recharge-info full-charge">
        <div class="recharge-header">
          <span class="recharge-icon">🔋</span>
          <span class="recharge-label">전체 충전까지 ({{ maxTurns }}턴)</span>
        </div>
        <div class="recharge-time">
          <span v-if="timeUntilFull.days > 0" class="time-unit">{{ timeUntilFull.days }}<span class="unit-label">일</span> </span>
          <span class="time-unit">{{ String(timeUntilFull.hours).padStart(2, '0') }}<span class="unit-label">시간</span></span>
          <span class="time-separator">:</span>
          <span class="time-unit">{{ String(timeUntilFull.minutes).padStart(2, '0') }}<span class="unit-label">분</span></span>
          <span class="time-separator">:</span>
          <span class="time-unit">{{ String(timeUntilFull.seconds).padStart(2, '0') }}<span class="unit-label">초</span></span>
        </div>
      </div>
    </div>

    <!-- 최대 턴일 때 -->
    <div v-else class="max-turns-message">
      <span class="check-icon">✓</span>
      <span>턴이 가득 찼습니다!</span>
    </div>

    <!-- 턴 부족 경고 -->
    <div v-if="currentTurns === 0" class="no-turns-warning">
      <span class="warning-icon">⚠️</span>
      <span>턴이 부족합니다. 시간이 지나면 자동으로 회복됩니다.</span>
    </div>

    <!-- 디버그 버튼 (개발용) -->
    <div v-if="showDebugButtons" class="debug-controls">
      <button class="debug-btn" @click="$emit('recharge-all')" title="개발용: 턴 즉시 충전">
        ⚡ 턴 충전
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface Props {
  currentTurns: number
  maxTurns: number
  timeUntilNext: TimeRemaining | null
  timeUntilFull: TimeRemaining | null
  showDebugButtons?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  'recharge-all': []
}>()
</script>

<style scoped>
.turn-counter-container {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.turn-display {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.turn-icon {
  font-size: 48px;
  line-height: 1;
}

.turn-info {
  flex: 1;
}

.turn-label {
  font-size: 14px;
  font-weight: 600;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6px;
  font-family: 'Cinzel', serif;
}

.turn-value {
  font-size: 36px;
  font-weight: 800;
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: 'Courier New', monospace;
}

.current-turns {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s;
}

.current-turns.low-turns {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.turn-separator {
  color: #64748b;
  font-size: 32px;
}

.max-turns {
  color: #64748b;
  font-size: 28px;
}

.recharge-info-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recharge-info {
  padding: 16px;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid;
}

.recharge-info.next-turn {
  border-color: rgba(99, 102, 241, 0.4);
  background: rgba(99, 102, 241, 0.1);
}

.recharge-info.full-charge {
  border-color: rgba(34, 197, 94, 0.4);
  background: rgba(34, 197, 94, 0.1);
}

.recharge-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.recharge-icon {
  font-size: 20px;
}

.recharge-info.next-turn .recharge-icon {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.recharge-label {
  color: #cbd5e1;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.recharge-time {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-family: 'Courier New', monospace;
  font-size: 20px;
  font-weight: 800;
}

.recharge-info.next-turn .recharge-time {
  color: #a78bfa;
}

.recharge-info.full-charge .recharge-time {
  color: #86efac;
}

.time-unit {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
}

.unit-label {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.7;
  margin-left: 2px;
}

.time-separator {
  opacity: 0.5;
  font-weight: 700;
}

.max-turns-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  font-size: 14px;
  color: #86efac;
  font-weight: 600;
}

.check-icon {
  font-size: 20px;
}

.no-turns-warning {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  font-size: 13px;
  color: #fca5a5;
  font-weight: 600;
  margin-top: 12px;
}

.warning-icon {
  font-size: 20px;
}

.debug-controls {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
}

.debug-btn {
  width: 100%;
  padding: 10px 16px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.debug-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.debug-btn:active {
  transform: translateY(0);
}

/* 모바일 최적화 */
@media (max-width: 768px) {
  .turn-counter-container {
    padding: 20px;
  }

  .turn-icon {
    font-size: 40px;
  }

  .turn-value {
    font-size: 28px;
  }

  .max-turns {
    font-size: 24px;
  }

  .turn-separator {
    font-size: 24px;
  }
}
</style>
