<template>
  <div class="phaser-container" ref="phaserContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Phaser from 'phaser'

const props = defineProps<{
  isDaytime: boolean
}>()

const phaserContainer = ref<HTMLElement | null>(null)
let game: Phaser.Game | null = null
let scene: Phaser.Scene | null = null
let skyGradient: Phaser.GameObjects.Graphics | null = null
let sun: Phaser.GameObjects.Arc | null = null
let moon: Phaser.GameObjects.Arc | null = null
let stars: Phaser.GameObjects.Arc[] = []

class DayNightScene extends Phaser.Scene {
  private skyGradient!: Phaser.GameObjects.Graphics
  private sun!: Phaser.GameObjects.Arc
  private moon!: Phaser.GameObjects.Arc
  private stars: Phaser.GameObjects.Arc[] = []
  private clouds: Phaser.GameObjects.Ellipse[] = []
  private isDaytime: boolean = true

  constructor() {
    super({ key: 'DayNightScene' })
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // 하늘 그라디언트 배경
    this.skyGradient = this.add.graphics()
    this.updateSkyGradient()

    // 구름 생성 (낮에만 보임)
    this.createClouds()

    // 태양 생성
    this.sun = this.add.circle(width - 100, 80, 40, 0xFFD700)
    this.sun.setAlpha(1)

    // 태양 후광 효과
    const sunGlow = this.add.circle(width - 100, 80, 60, 0xFFA500, 0.3)

    // 달 생성
    this.moon = this.add.circle(width - 100, 80, 35, 0xE0E0E0)
    this.moon.setAlpha(0)

    // 별 생성 (밤에만 보임)
    this.createStars()

    // 초기 상태 설정
    this.setTimeOfDay(this.isDaytime)
  }

  createClouds() {
    const width = this.cameras.main.width
    const cloudPositions = [
      { x: 150, y: 100 },
      { x: 400, y: 60 },
      { x: 650, y: 120 },
      { x: 900, y: 80 }
    ]

    cloudPositions.forEach(pos => {
      const cloud = this.add.ellipse(pos.x, pos.y, 120, 60, 0xFFFFFF, 0.7)
      this.clouds.push(cloud)

      // 구름 애니메이션
      this.tweens.add({
        targets: cloud,
        x: pos.x + 50,
        duration: 8000 + Math.random() * 4000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    })
  }

  createStars() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // 별 100개 생성
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width
      const y = Math.random() * (height / 2)
      const size = Math.random() * 2 + 1
      const star = this.add.circle(x, y, size, 0xFFFFFF)
      star.setAlpha(0)
      this.stars.push(star)

      // 별 깜빡임 애니메이션
      this.tweens.add({
        targets: star,
        alpha: Math.random() * 0.8 + 0.2,
        duration: 1000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    }
  }

  updateSkyGradient() {
    if (!this.skyGradient) return

    const width = this.cameras.main.width
    const height = this.cameras.main.height

    this.skyGradient.clear()

    if (this.isDaytime) {
      // 낮 그라디언트: 하늘색 -> 연한 하늘색
      const gradient = this.skyGradient.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, '#87CEEB')
      gradient.addColorStop(1, '#E0F6FF')
      this.skyGradient.fillStyle(0x87CEEB)
    } else {
      // 밤 그라디언트: 진한 파란색 -> 검은색
      const gradient = this.skyGradient.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, '#0C1445')
      gradient.addColorStop(1, '#1a1a2e')
      this.skyGradient.fillStyle(0x0C1445)
    }

    this.skyGradient.fillRect(0, 0, width, height)
  }

  setTimeOfDay(isDaytime: boolean) {
    this.isDaytime = isDaytime

    // 하늘 그라디언트 업데이트
    this.updateSkyGradient()

    if (isDaytime) {
      // 낮으로 전환
      this.tweens.add({
        targets: this.sun,
        alpha: 1,
        duration: 2000,
        ease: 'Power2'
      })

      this.tweens.add({
        targets: this.moon,
        alpha: 0,
        duration: 2000,
        ease: 'Power2'
      })

      // 별 숨김
      this.stars.forEach(star => {
        this.tweens.add({
          targets: star,
          alpha: 0,
          duration: 2000,
          ease: 'Power2'
        })
      })

      // 구름 표시
      this.clouds.forEach(cloud => {
        this.tweens.add({
          targets: cloud,
          alpha: 0.7,
          duration: 2000,
          ease: 'Power2'
        })
      })
    } else {
      // 밤으로 전환
      this.tweens.add({
        targets: this.sun,
        alpha: 0,
        duration: 2000,
        ease: 'Power2'
      })

      this.tweens.add({
        targets: this.moon,
        alpha: 1,
        duration: 2000,
        ease: 'Power2'
      })

      // 별 표시
      this.stars.forEach(star => {
        this.tweens.add({
          targets: star,
          alpha: Math.random() * 0.8 + 0.2,
          duration: 2000,
          ease: 'Power2'
        })
      })

      // 구름 숨김
      this.clouds.forEach(cloud => {
        this.tweens.add({
          targets: cloud,
          alpha: 0,
          duration: 2000,
          ease: 'Power2'
        })
      })
    }
  }

  update() {
    // 필요시 매 프레임 업데이트 로직
  }
}

onMounted(() => {
  if (phaserContainer.value) {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1200,
      height: 300,
      parent: phaserContainer.value,
      backgroundColor: '#87CEEB',
      scene: DayNightScene,
      transparent: false,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
      }
    }

    game = new Phaser.Game(config)

    // Scene 가져오기
    game.events.once('ready', () => {
      scene = game?.scene.getScene('DayNightScene') as Phaser.Scene
    })
  }
})

// isDaytime prop 변경 감지
watch(() => props.isDaytime, (newVal) => {
  if (scene && scene.scene.isActive()) {
    (scene as any).setTimeOfDay(newVal)
  }
})

onUnmounted(() => {
  if (game) {
    game.destroy(true)
  }
})
</script>

<style scoped>
.phaser-container {
  width: 100%;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
</style>
