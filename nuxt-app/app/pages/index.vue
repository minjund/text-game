<template>
  <div class="min-h-screen">
    <!-- 헤더 -->
    <header class="fixed top-0 left-0 right-0 z-[1000] px-4 sm:px-6 md:px-12 lg:px-16 py-4 md:py-5 flex justify-between items-center bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/20">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="text-2xl sm:text-3xl md:text-4xl drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">✨</span>
        <span class="text-base sm:text-lg md:text-xl lg:text-2xl font-black font-serif text-slate-200">갓 블레스 유 (GBU)</span>
      </div>
      <nav>
        <NuxtLink
          to="/story"
          class="text-slate-200 no-underline font-semibold text-sm sm:text-base px-3 sm:px-4 md:px-5 py-2 rounded-lg transition-all duration-300 hover:bg-purple-500/20 hover:text-purple-300"
        >
          게임 시작
        </NuxtLink>
      </nav>
    </header>

    <!-- 히어로 섹션 -->
    <section class="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
      <div class="max-w-4xl text-center z-10 relative w-full">
        <h1 class="font-serif font-black leading-tight mb-6 sm:mb-8 md:mb-10 flex flex-col gap-2 sm:gap-3">
          <span class="title-line-1 text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl">전설의 왕국을</span>
          <span class="title-line-2 text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl">건설하라</span>
        </h1>
        <p class="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 leading-relaxed mb-8 sm:mb-10 md:mb-12 px-4">
          장수를 모으고, 군대를 키우고, 적을 정복하라.<br class="hidden sm:block"/>
          당신의 왕국이 역사에 길이 남을 것입니다.
        </p>
        <div class="flex justify-center mb-12 sm:mb-16 md:mb-20">
          <NuxtLink to="/story" class="game-btn">
            <span class="text-xl sm:text-2xl md:text-3xl relative z-10">✨</span>
            <span class="relative z-10">게임 시작</span>
          </NuxtLink>
        </div>

        <!-- 게임 통계 -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10 bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-purple-500/20">
          <div class="text-center py-4 sm:py-0">
            <div class="stat-number text-3xl sm:text-4xl md:text-5xl">{{ animatedPlayers }}</div>
            <div class="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider mt-2">활성 플레이어</div>
          </div>
          <div class="text-center py-4 sm:py-0 border-t sm:border-t-0 sm:border-l sm:border-r border-purple-500/20">
            <div class="stat-number text-3xl sm:text-4xl md:text-5xl">{{ animatedKingdoms }}</div>
            <div class="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider mt-2">건설된 왕국</div>
          </div>
          <div class="text-center py-4 sm:py-0 border-t sm:border-t-0 border-purple-500/20">
            <div class="stat-number text-3xl sm:text-4xl md:text-5xl">{{ animatedBattles }}</div>
            <div class="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider mt-2">진행된 전투</div>
          </div>
        </div>
      </div>

      <!-- 배경 애니메이션 -->
      <div class="absolute w-full h-full top-0 left-0 overflow-hidden z-0">
        <div class="floating-element element-1">⚔️</div>
        <div class="floating-element element-2">🛡️</div>
        <div class="floating-element element-3">👑</div>
        <div class="floating-element element-4">🏰</div>
        <div class="floating-element element-5">⚡</div>
        <div class="floating-element element-6">💎</div>
      </div>
    </section>

    <!-- 특징 섹션 -->
    <section class="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto">
      <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-center mb-10 sm:mb-12 md:mb-16 section-title">게임 특징</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
        <div class="feature-card">
          <div class="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-5 drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]">✨</div>
          <h3 class="text-xl sm:text-2xl font-bold text-slate-200 mb-3 sm:mb-4 font-serif">신의 계명</h3>
          <p class="text-sm sm:text-base text-slate-400 leading-relaxed">신이 되어 나라의 기초가 될 5가지 계명을 정하세요</p>
        </div>
        <div class="feature-card">
          <div class="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-5 drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]">👥</div>
          <h3 class="text-xl sm:text-2xl font-bold text-slate-200 mb-3 sm:mb-4 font-serif">전설의 장수</h3>
          <p class="text-sm sm:text-base text-slate-400 leading-relaxed">고유한 스킬을 가진 장수들을 수집하고 육성하세요</p>
        </div>
        <div class="feature-card">
          <div class="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-5 drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]">⚔️</div>
          <h3 class="text-xl sm:text-2xl font-bold text-slate-200 mb-3 sm:mb-4 font-serif">전략적 전투</h3>
          <p class="text-sm sm:text-base text-slate-400 leading-relaxed">텍스트 기반 전투로 장수의 스킬을 활용하세요</p>
        </div>
        <div class="feature-card">
          <div class="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-5 drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]">🏰</div>
          <h3 class="text-xl sm:text-2xl font-bold text-slate-200 mb-3 sm:mb-4 font-serif">왕국 경영</h3>
          <p class="text-sm sm:text-base text-slate-400 leading-relaxed">식량, 금, 병력을 관리하며 왕국을 성장시키세요</p>
        </div>
        <div class="feature-card">
          <div class="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-5 drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]">🎴</div>
          <h3 class="text-xl sm:text-2xl font-bold text-slate-200 mb-3 sm:mb-4 font-serif">랜덤 이벤트</h3>
          <p class="text-sm sm:text-base text-slate-400 leading-relaxed">매일 다른 이벤트로 독특한 스토리를 만들어가세요</p>
        </div>
      </div>
    </section>

    <!-- CTA 섹션 -->
    <section class="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-purple-900/10 to-pink-900/10">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-200 mb-4 sm:mb-6">지금 당신의 전설을 시작하세요</h2>
        <p class="text-base sm:text-lg md:text-xl text-slate-400 mb-8 sm:mb-10 md:mb-12">무료로 플레이하고 최고의 통치자가 되어보세요</p>
        <NuxtLink to="/story" class="game-btn">
          <span class="text-xl sm:text-2xl md:text-3xl relative z-10">✨</span>
          <span class="relative z-10">게임 시작</span>
        </NuxtLink>
      </div>
    </section>

    <!-- 푸터 -->
    <footer class="py-8 sm:py-10 md:py-12 px-4 sm:px-6 text-center text-slate-500 text-xs sm:text-sm border-t border-purple-500/20">
      <p>&copy; 2025 갓 블레스 유 (GBU). Made with ❤️</p>
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
/* 타이틀 그라데이션 애니메이션 */
.title-line-1 {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleGlow 3s ease-in-out infinite;
}

.title-line-2 {
  background: linear-gradient(135deg, #ec4899 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleGlow 3s ease-in-out infinite;
  animation-delay: 0.5s;
}

@keyframes titleGlow {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5)); }
  50% { filter: drop-shadow(0 0 40px rgba(139, 92, 246, 0.8)); }
}

/* 섹션 타이틀 그라데이션 */
.section-title {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 게임 버튼 */
.game-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 2rem;
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: white;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
}

@media (min-width: 640px) {
  .game-btn {
    padding: 1rem 2.5rem;
    font-size: 1rem;
  }
}

@media (min-width: 768px) {
  .game-btn {
    padding: 1.25rem 3rem;
    font-size: 1.125rem;
  }
}

@media (min-width: 1024px) {
  .game-btn {
    padding: 1.5rem 3.75rem;
    font-size: 1.25rem;
  }
}

.game-btn::before {
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

.game-btn:hover::before {
  width: 400px;
  height: 400px;
}

.game-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(139, 92, 246, 0.6);
}

/* 통계 숫자 그라데이션 */
.stat-number {
  font-family: 'Cinzel', serif;
  font-weight: 900;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 특징 카드 */
.feature-card {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 1.25rem;
  padding: 2rem 1.5rem;
  text-align: center;
  border: 2px solid rgba(139, 92, 246, 0.2);
  transition: all 0.4s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.feature-card:hover {
  transform: translateY(-10px);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 20px 50px rgba(139, 92, 246, 0.3);
}

/* 배경 애니메이션 */
.floating-element {
  position: absolute;
  font-size: 3rem;
  opacity: 0.1;
  animation: floatElement 20s ease-in-out infinite;
  filter: blur(2px);
}

@media (min-width: 768px) {
  .floating-element {
    font-size: 3.75rem;
  }
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
</style>
