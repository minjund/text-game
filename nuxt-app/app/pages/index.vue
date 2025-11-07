<template>
  <div class="welcome-page">
    <!-- 헤더 -->
    <header class="main-header">
      <div class="logo">
        <span class="logo-icon">⚔️</span>
        <span class="logo-text">Kingdom Wars</span>
      </div>
      <nav class="nav-links">
        <NuxtLink to="/god" class="nav-link">게임 시작</NuxtLink>
      </nav>
    </header>

    <!-- 히어로 섹션 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="title-line-1">전설의 왕국을</span>
          <span class="title-line-2">건설하라</span>
        </h1>
        <p class="hero-description">
          장수를 모으고, 군대를 키우고, 적을 정복하라.<br/>
          당신의 왕국이 역사에 길이 남을 것입니다.
        </p>
        <div class="hero-buttons">
          <NuxtLink to="/god" class="btn btn-primary btn-huge">
            <span class="btn-icon">✨</span>
            게임 시작
          </NuxtLink>
        </div>

        <!-- 게임 통계 -->
        <div class="game-stats">
          <div class="stat-item">
            <div class="stat-number">{{ animatedPlayers }}</div>
            <div class="stat-label">활성 플레이어</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ animatedKingdoms }}</div>
            <div class="stat-label">건설된 왕국</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ animatedBattles }}</div>
            <div class="stat-label">진행된 전투</div>
          </div>
        </div>
      </div>

      <!-- Phaser 애니메이션 -->
      <PhaserHeroAnimation />

      <!-- 배경 애니메이션 -->
      <div class="hero-background">
        <div class="floating-element element-1">⚔️</div>
        <div class="floating-element element-2">🛡️</div>
        <div class="floating-element element-3">👑</div>
        <div class="floating-element element-4">🏰</div>
        <div class="floating-element element-5">⚡</div>
        <div class="floating-element element-6">💎</div>
      </div>
    </section>

    <!-- 특징 섹션 -->
    <section class="features-section">
      <h2 class="section-title">게임 특징</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">✨</div>
          <h3>신의 계명</h3>
          <p>신이 되어 나라의 기초가 될 5가지 계명을 정하세요</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <h3>전설의 장수</h3>
          <p>고유한 스킬을 가진 장수들을 수집하고 육성하세요</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚔️</div>
          <h3>전략적 전투</h3>
          <p>텍스트 기반 전투로 장수의 스킬을 활용하세요</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🏰</div>
          <h3>왕국 경영</h3>
          <p>식량, 금, 병력을 관리하며 왕국을 성장시키세요</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎴</div>
          <h3>랜덤 이벤트</h3>
          <p>매일 다른 이벤트로 독특한 스토리를 만들어가세요</p>
        </div>
      </div>
    </section>

    <!-- CTA 섹션 -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>지금 당신의 전설을 시작하세요</h2>
        <p>무료로 플레이하고 최고의 통치자가 되어보세요</p>
        <NuxtLink to="/god" class="btn btn-primary btn-huge">
          <span class="btn-icon">✨</span>
          게임 시작
        </NuxtLink>
      </div>
    </section>

    <!-- 푸터 -->
    <footer class="main-footer">
      <p>&copy; 2025 Kingdom Wars. Made with ❤️ by Claude</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 애니메이션 숫자
const animatedPlayers = ref(0)
const animatedKingdoms = ref(0)
const animatedBattles = ref(0)

const targetPlayers = 1247
const targetKingdoms = 892
const targetBattles = 15634

// 숫자 애니메이션
const animateNumber = (from: number, to: number, duration: number, callback: (val: number) => void) => {
  const startTime = Date.now()
  const step = () => {
    const progress = Math.min((Date.now() - startTime) / duration, 1)
    const value = Math.floor(from + (to - from) * progress)
    callback(value)
    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }
  step()
}

onMounted(() => {
  animateNumber(0, targetPlayers, 2000, (val) => animatedPlayers.value = val)
  animateNumber(0, targetKingdoms, 2200, (val) => animatedKingdoms.value = val)
  animateNumber(0, targetBattles, 2400, (val) => animatedBattles.value = val)
})
</script>

<style scoped>
.welcome-page {
  min-height: 100vh;
}

/* 헤더 */
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 900;
  font-family: 'Cinzel', serif;
  color: #e2e8f0;
}

.logo-icon {
  font-size: 32px;
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.6));
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s;
  padding: 8px 20px;
  border-radius: 8px;
}

.nav-link:hover {
  background: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
}

/* 히어로 섹션 */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 20px 50px;
  overflow: hidden;
}

.hero-content {
  max-width: 900px;
  text-align: center;
  z-index: 10;
  position: relative;
}

.hero-title {
  font-family: 'Cinzel', serif;
  font-size: 80px;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title-line-1 {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleGlow 3s ease-in-out infinite;
}

.title-line-2 {
  background: linear-gradient(135deg, #ec4899 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleGlow 3s ease-in-out infinite;
  animation-delay: 0.5s;
}

@keyframes titleGlow {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5)); }
  50% { filter: drop-shadow(0 0 40px rgba(139, 92, 246, 0.8)); }
}

.hero-description {
  font-size: 20px;
  color: #94a3b8;
  line-height: 1.8;
  margin-bottom: 50px;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 80px;
}

.btn {
  padding: 18px 40px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
  font-family: 'Cinzel', serif;
  text-transform: uppercase;
  letter-spacing: 2px;
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

.btn-primary {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(139, 92, 246, 0.6);
}

.btn-huge {
  padding: 24px 60px;
  font-size: 22px;
}

.btn-icon {
  font-size: 28px;
  position: relative;
  z-index: 1;
}

/* 게임 통계 */
.game-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 48px;
  font-weight: 900;
  font-family: 'Cinzel', serif;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 배경 애니메이션 */
.hero-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 0;
}

.floating-element {
  position: absolute;
  font-size: 60px;
  opacity: 0.1;
  animation: floatElement 20s ease-in-out infinite;
  filter: blur(2px);
}

.element-1 { top: 10%; left: 10%; animation-delay: 0s; }
.element-2 { top: 20%; right: 15%; animation-delay: 3s; }
.element-3 { top: 60%; left: 5%; animation-delay: 6s; }
.element-4 { bottom: 15%; right: 10%; animation-delay: 9s; }
.element-5 { top: 40%; left: 50%; animation-delay: 12s; }
.element-6 { bottom: 30%; left: 20%; animation-delay: 15s; }

@keyframes floatElement {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(30px, -30px) rotate(90deg); }
  50% { transform: translate(0, -60px) rotate(180deg); }
  75% { transform: translate(-30px, -30px) rotate(270deg); }
}

/* 특징 섹션 */
.features-section {
  padding: 100px 60px;
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  font-size: 48px;
  font-family: 'Cinzel', serif;
  font-weight: 900;
  text-align: center;
  margin-bottom: 60px;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
}

.feature-card {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  border: 2px solid rgba(139, 92, 246, 0.2);
  transition: all 0.4s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.feature-card:hover {
  transform: translateY(-10px);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 20px 50px rgba(139, 92, 246, 0.3);
}

.feature-icon {
  font-size: 64px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.4));
}

.feature-card h3 {
  font-size: 24px;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 15px;
  font-family: 'Cinzel', serif;
}

.feature-card p {
  font-size: 16px;
  color: #94a3b8;
  line-height: 1.6;
}

/* CTA 섹션 */
.cta-section {
  padding: 100px 60px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.cta-content h2 {
  font-size: 48px;
  font-family: 'Cinzel', serif;
  font-weight: 900;
  color: #e2e8f0;
  margin-bottom: 20px;
}

.cta-content p {
  font-size: 20px;
  color: #94a3b8;
  margin-bottom: 40px;
}

/* 푸터 */
.main-footer {
  padding: 40px 60px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
}

/* 반응형 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 48px;
  }

  .game-stats {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .main-header {
    padding: 20px 30px;
  }
}
</style>
