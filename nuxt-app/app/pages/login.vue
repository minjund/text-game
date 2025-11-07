<template>
  <div class="login-page">
    <GameLogo
      title="Kingdom Wars"
      subtitle="왕국의 운명을 결정하라"
    />

    <div class="login-container">
      <GameCard>
        <template #default>
          <h2 class="login-title">🏰 로그인</h2>
          <p class="welcome-text">전설의 통치자여, 환영합니다</p>

          <form @submit.prevent="handleLogin" class="login-form">
            <FormInput
              id="username"
              v-model="username"
              label="통치자 이름"
              icon="👤"
              placeholder="이름을 입력하세요"
              autocomplete="username"
              :required="true"
            />

            <FormInput
              id="kingdom"
              v-model="kingdomName"
              label="왕국 이름"
              icon="🏰"
              placeholder="왕국 이름을 입력하세요"
              :required="true"
            />

            <GameButton
              type="submit"
              variant="primary"
              size="large"
              icon="⚔️"
              :full-width="true"
            >
              게임 시작
            </GameButton>
          </form>

          <div class="divider">
            <span>또는</span>
          </div>

          <GameButton
            variant="secondary"
            size="large"
            icon="⚡"
            :full-width="true"
            @click="quickStart"
          >
            빠른 시작
          </GameButton>

          <p class="info-text">
            빠른 시작은 랜덤 이름으로 바로 게임을 시작합니다
          </p>
        </template>
      </GameCard>
    </div>

    <!-- 배경 장식 -->
    <div class="background-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import GameLogo from '~/components/ui/GameLogo.vue'
import GameCard from '~/components/ui/GameCard.vue'
import GameButton from '~/components/ui/GameButton.vue'
import FormInput from '~/components/ui/FormInput.vue'

const router = useRouter()

const username = ref('')
const kingdomName = ref('')

// 랜덤 이름 생성
const randomNames = {
  rulers: ['카론', '엘리온', '아리아', '레온', '세라피나', '드라고', '루나', '맥시무스'],
  kingdoms: ['아스트랄', '크림슨', '에테르', '실버문', '드래곤하트', '피닉스', '아발론', '올림푸스']
}

const handleLogin = () => {
  if (username.value && kingdomName.value) {
    localStorage.setItem('playerName', username.value)
    localStorage.setItem('kingdomName', kingdomName.value)
    router.push('/game')
  }
}

const quickStart = () => {
  const randomRuler = randomNames.rulers[Math.floor(Math.random() * randomNames.rulers.length)]
  const randomKingdom = randomNames.kingdoms[Math.floor(Math.random() * randomNames.kingdoms.length)]

  localStorage.setItem('playerName', randomRuler)
  localStorage.setItem('kingdomName', `${randomKingdom} 왕국`)

  router.push('/game')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-container {
  z-index: 10;
  position: relative;
  min-width: 500px;
  max-width: 600px;
}

.login-title {
  font-size: 36px;
  font-family: 'Cinzel', serif;
  color: #e2e8f0;
  margin-bottom: 10px;
  text-align: center;
}

.welcome-text {
  text-align: center;
  color: #94a3b8;
  margin-bottom: 40px;
  font-size: 16px;
}

.login-form {
  margin-bottom: 30px;
}

/* 구분선 */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 30px 0;
  color: #64748b;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.divider span {
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
}

/* 정보 텍스트 */
.info-text {
  text-align: center;
  color: #64748b;
  font-size: 14px;
  margin-top: 15px;
}

/* 배경 장식 */
.background-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 0;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
  animation: decorationFloat 20s ease-in-out infinite;
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.circle-2 {
  width: 600px;
  height: 600px;
  bottom: -300px;
  right: -300px;
  animation-delay: 7s;
}

.circle-3 {
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 14s;
}

@keyframes decorationFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-50px, 50px) scale(0.9);
  }
}

/* 반응형 */
@media (max-width: 768px) {
  .login-container {
    min-width: auto;
    width: 100%;
  }
}
</style>
