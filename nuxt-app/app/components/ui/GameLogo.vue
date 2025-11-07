<template>
  <div class="game-logo">
    <div class="logo-icon">{{ icon }}</div>
    <h1 class="game-title">{{ title }}</h1>
    <p v-if="subtitle" class="game-subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  title: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  icon: '⚔️'
})
</script>

<style scoped>
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

@media (max-width: 768px) {
  .game-title {
    font-size: 48px;
  }

  .logo-icon {
    font-size: 60px;
  }

  .game-subtitle {
    font-size: 16px;
  }
}
</style>
