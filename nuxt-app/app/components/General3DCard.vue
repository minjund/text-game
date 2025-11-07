<template>
  <div class="general-3d-card">
    <div class="card-3d-container">
      <TresCanvas v-bind="gl">
        <TresPerspectiveCamera :position="[0, 0, 5]" />
        <OrbitControls :enableZoom="false" :enablePan="false" />

        <!-- 조명 -->
        <TresAmbientLight :intensity="0.5" />
        <TresDirectionalLight :position="[3, 3, 3]" :intensity="1" />
        <TresPointLight :position="[-2, 2, 2]" :intensity="0.5" :color="lightColor" />

        <!-- 3D 카드 -->
        <TresMesh :position="[0, 0, 0]" :rotation="rotation">
          <!-- 카드 본체 -->
          <TresBoxGeometry :args="[2, 3, 0.1]" />
          <TresMeshStandardMaterial :color="cardColor" :metalness="0.3" :roughness="0.4" />
        </TresMesh>

        <!-- 장수 이름 표시를 위한 평면 -->
        <TresMesh :position="[0, 1.2, 0.06]">
          <TresPlaneGeometry :args="[1.8, 0.4]" />
          <TresMeshBasicMaterial :color="0x000000" :transparent="true" :opacity="0.7" />
        </TresMesh>

        <!-- 스탯 표시 구체들 -->
        <TresMesh :position="[-0.6, -0.8, 0.1]">
          <TresSphereGeometry :args="[0.15, 16, 16]" />
          <TresMeshStandardMaterial :color="0xff6b6b" :emissive="0xff6b6b" :emissiveIntensity="0.3" />
        </TresMesh>

        <TresMesh :position="[0, -0.8, 0.1]">
          <TresSphereGeometry :args="[0.15, 16, 16]" />
          <TresMeshStandardMaterial :color="0x4dabf7" :emissive="0x4dabf7" :emissiveIntensity="0.3" />
        </TresMesh>

        <TresMesh :position="[0.6, -0.8, 0.1]">
          <TresSphereGeometry :args="[0.15, 16, 16]" />
          <TresMeshStandardMaterial :color="0xffd43b" :emissive="0xffd43b" :emissiveIntensity="0.3" />
        </TresMesh>

        <!-- 스킬 효과 링 -->
        <TresMesh :position="[0, 0, 0]" :rotation="[Math.PI / 2, 0, 0]">
          <TresTorusGeometry :args="[1.2, 0.05, 16, 100]" />
          <TresMeshBasicMaterial :color="skillColor" :transparent="true" :opacity="0.6" />
        </TresMesh>
      </TresCanvas>
    </div>

    <div class="card-info">
      <h3>{{ general.name }}</h3>
      <p class="title">{{ general.title }}</p>
      <div class="stats-mini">
        <span>⚔️ {{ general.stats.power }}</span>
        <span>🧠 {{ general.stats.intelligence }}</span>
        <span>👑 {{ general.stats.leadership }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import type { General } from '../types/game'

const props = defineProps<{
  general: General
}>()

const gl = {
  alpha: true,
  antialias: true,
  toneMapping: 3,
  outputColorSpace: 'srgb'
}

const rotation = ref([0.1, 0, 0])

// 장수 스탯에 따른 색상
const cardColor = computed(() => {
  const power = props.general.stats.power
  if (power >= 90) return 0xffd700 // 금색
  if (power >= 80) return 0xff6b6b // 빨간색
  if (power >= 70) return 0x4dabf7 // 파란색
  return 0x51cf66 // 녹색
})

const lightColor = computed(() => {
  const intelligence = props.general.stats.intelligence
  if (intelligence >= 90) return 0x4dabf7
  if (intelligence >= 70) return 0x64dfdf
  return 0xffffff
})

const skillColor = computed(() => {
  const leadership = props.general.stats.leadership
  if (leadership >= 85) return 0xffd43b
  if (leadership >= 70) return 0xff6b6b
  return 0x4dabf7
})

// 카드 회전 애니메이션
let animationFrame: number
const animate = () => {
  rotation.value = [
    rotation.value[0],
    rotation.value[1] + 0.005,
    rotation.value[2]
  ]
  animationFrame = requestAnimationFrame(animate)
}

onMounted(() => {
  animate()
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped>
.general-3d-card {
  width: 280px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, rgba(30, 30, 46, 0.9), rgba(45, 45, 68, 0.9));
  border-radius: 16px;
  padding: 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.general-3d-card:hover {
  transform: translateY(-10px);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.card-3d-container {
  width: 240px;
  height: 280px;
  border-radius: 12px;
  overflow: hidden;
}

.card-info {
  text-align: center;
  color: white;
  margin-top: 15px;
}

.card-info h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
}

.card-info .title {
  font-size: 13px;
  color: #a0a0ff;
  margin-bottom: 10px;
}

.stats-mini {
  display: flex;
  justify-content: center;
  gap: 15px;
  font-size: 14px;
  font-weight: 600;
}
</style>
