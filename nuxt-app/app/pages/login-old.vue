<template>
  <div class="login-page">
    <!-- 로고 & 타이틀 -->
    <div class="game-logo">
      <div class="logo-icon">⚔️</div>
      <h1 class="game-title">Kingdom Wars</h1>
      <p class="game-subtitle">왕국의 운명을 결정하라</p>
    </div>

    <!-- 로그인 폼 -->
    <div class="login-container">
      <div class="login-card">
        <h2>🏰 로그인</h2>
        <p class="welcome-text">전설의 통치자여, 환영합니다</p>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">
              <span class="icon">👤</span>
              통치자 이름
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="이름을 입력하세요"
              required
              autocomplete="username"
            />
          </div>

          <div class="form-group">
            <label for="kingdom">
              <span class="icon">🏰</span>
              왕국 이름
            </label>
            <input
              id="kingdom"
              v-model="kingdomName"
              type="text"
              placeholder="왕국 이름을 입력하세요"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary btn-large">
            <span class="btn-icon">⚔️</span>
            게임 시작
          </button>
        </form>

        <div class="divider">
          <span>또는</span>
        </div>

        <button @click="quickStart" class="btn btn-secondary btn-large">
          <span class="btn-icon">⚡</span>
          빠른 시작
        </button>

        <p class="info-text">
          빠른 시작은 랜덤 이름으로 바로 게임을 시작합니다
        </p>
      </div>
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
    // 로컬 스토리지에 저장
    localStorage.setItem('playerName', username.value)
    localStorage.setItem('kingdomName', kingdomName.value)

    // 게임 화면으로 이동
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

/* 로고 */
.game-logo {
  text-align: center;
  margin-bottom: 50px;
  z-index: 10;
  position: relative;
}

.logo-icon {
  font-size: 80px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.6));
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.game-title {
  font-size: 64px;
  font-family: 'Cinzel', serif;
  font-weight: 900;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  text-shadow: 0 0 40px rgba(139, 92, 246, 0.5);
  letter-spacing: 2px;
}

.game-subtitle {
  font-size: 20px;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 4px;
}

/* 로그인 카드 */
.login-container {
  z-index: 10;
  position: relative;
}

.login-card {
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(30px);
  border-radius: 24px;
  padding: 50px 60px;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(139, 92, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(139, 92, 246, 0.2);
  min-width: 500px;
  max-width: 600px;
}

.login-card h2 {
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

/* 폼 */
.login-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 10px;
}

.form-group .icon {
  font-size: 20px;
}

.form-group input {
  width: 100%;
  padding: 16px 20px;
  background: rgba(15, 23, 42, 0.6);
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  color: #e2e8f0;
  font-size: 16px;
  transition: all 0.3s;
  font-family: 'Noto Sans KR', sans-serif;
}

.form-group input:focus {
  outline: none;
  border-color: #8b5cf6;
  background: rgba(15, 23, 42, 0.8);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.form-group input::placeholder {
  color: #64748b;
}

/* 버튼 */
.btn {
  width: 100%;
  padding: 18px 32px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Cinzel', serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-icon {
  font-size: 24px;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:hover::before {
  width: 400px;
  height: 400px;
}

.btn:hover {
  transform: translateY(-3px);
}

.btn-primary {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
}

.btn-primary:hover {
  box-shadow: 0 15px 40px rgba(139, 92, 246, 0.6);
}

.btn-secondary {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  color: white;
  box-shadow: 0 10px 30px rgba(100, 116, 139, 0.3);
}

.btn-secondary:hover {
  box-shadow: 0 15px 40px rgba(100, 116, 139, 0.5);
}

.btn-large {
  font-size: 20px;
  padding: 20px 40px;
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
  .login-card {
    min-width: auto;
    padding: 40px 30px;
  }

  .game-title {
    font-size: 48px;
  }

  .btn-large {
    font-size: 18px;
    padding: 16px 32px;
  }
}
</style>
