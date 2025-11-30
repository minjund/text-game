<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'mobile-web-app-capable', content: 'yes' },
  ],
})
</script>

<template>
  <div class="game-container">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&family=Cinzel:wght@400;600;700;900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh;
  color: #e2e8f0;
  overflow-x: hidden;
  position: relative;
  background: #000;
  /* 모바일 드래그 방지 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
  overscroll-behavior: none;
}


.game-container {
  min-height: 100vh;
  padding: 0;
  position: relative;
  z-index: 1;
}

/* 공통 스타일 */
.card {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(148, 163, 184, 0.1);
  margin-bottom: 25px;
  transition: all 0.3s;
}

.card:hover {
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border-color: rgba(148, 163, 184, 0.2);
}

.btn {
  padding: 12px 28px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-family: 'Cinzel', serif;
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
  width: 300px;
  height: 300px;
}

.btn:hover {
  transform: translateY(-3px);
}

.btn:active {
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.btn-primary:hover {
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.6);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.btn-danger:hover {
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.6);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.btn-warning:hover {
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.6);
}

.btn-info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-info:hover {
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
}

.btn:disabled {
  background: rgba(71, 85, 105, 0.5);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn:disabled::before {
  display: none;
}

/* 스크롤바 스타일 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #8b5cf6 0%, #6366f1 100%);
  border-radius: 10px;
  border: 2px solid rgba(15, 23, 42, 0.3);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #a78bfa 0%, #818cf8 100%);
}

/* 선택 스타일 */
::selection {
  background: rgba(139, 92, 246, 0.3);
  color: #e0e7ff;
}
</style>
