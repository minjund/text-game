<template>
  <div class="phaser-background">
    <div ref="phaserContainer" class="phaser-canvas-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Phaser from 'phaser'

const phaserContainer = ref<HTMLDivElement | null>(null)
let game: Phaser.Game | null = null

class BackgroundScene extends Phaser.Scene {
  private particles: Phaser.GameObjects.Image[] = []
  private particleCount = 15

  constructor() {
    super({ key: 'BackgroundScene' })
  }

  preload() {
    // solderAdd.png 이미지 로드
    this.load.image('soldier', '/images/passive/solderAdd.png')
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // 배경에 떠다니는 병사 이미지들 생성
    for (let i = 0; i < this.particleCount; i++) {
      const x = Phaser.Math.Between(0, width)
      const y = Phaser.Math.Between(0, height)

      const particle = this.add.image(x, y, 'soldier')
      particle.setAlpha(0.03) // 매우 투명하게
      particle.setScale(0.08 + Math.random() * 0.08) // 크기 랜덤
      particle.setDepth(0)

      // 랜덤 회전
      particle.setAngle(Phaser.Math.Between(0, 360))

      this.particles.push(particle)

      // 부유하는 애니메이션
      this.tweens.add({
        targets: particle,
        y: y + Phaser.Math.Between(-50, 50),
        x: x + Phaser.Math.Between(-30, 30),
        angle: particle.angle + Phaser.Math.Between(-15, 15),
        duration: 8000 + Math.random() * 4000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })

      // 페이드 인/아웃 효과
      this.tweens.add({
        targets: particle,
        alpha: 0.01 + Math.random() * 0.04,
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    }

    // 반짝이는 별 효과 추가
    this.createStars()
  }

  createStars() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, width)
      const y = Phaser.Math.Between(0, height)

      const star = this.add.circle(x, y, 1, 0xffffff, 0.3)
      star.setDepth(1)

      // 반짝이는 효과
      this.tweens.add({
        targets: star,
        alpha: 0.1,
        scale: 0.5,
        duration: 1500 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 2000
      })
    }
  }

  update() {
    // 추가 업데이트 로직이 필요하면 여기에
  }
}

onMounted(() => {
  if (!phaserContainer.value) return

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: phaserContainer.value,
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true,
    scene: BackgroundScene,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false
      }
    }
  }

  game = new Phaser.Game(config)

  // 윈도우 리사이즈 핸들링
  const handleResize = () => {
    if (game) {
      game.scale.resize(window.innerWidth, window.innerHeight)
    }
  }

  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (game) {
      game.destroy(true)
      game = null
    }
  })
})
</script>

<style scoped>
.phaser-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.phaser-canvas-container {
  width: 100%;
  height: 100%;
}

.phaser-canvas-container canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
