<template>
  <div class="phaser-hero-animation">
    <div ref="phaserContainer" class="phaser-canvas-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Phaser from 'phaser'

const phaserContainer = ref<HTMLDivElement | null>(null)
let game: Phaser.Game | null = null

class HeroAnimationScene extends Phaser.Scene {
  private particles: Phaser.GameObjects.Particles.ParticleEmitter[] = []
  private glowCircles: Phaser.GameObjects.Arc[] = []
  private energyOrbs: Phaser.GameObjects.Arc[] = []

  constructor() {
    super({ key: 'HeroAnimationScene' })
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height
    const centerX = width / 2
    const centerY = height / 2

    // 중앙 에너지 코어 생성
    this.createEnergyCore(centerX, centerY)

    // 빛나는 원형 파동 생성
    this.createGlowingRings(centerX, centerY)

    // 떠다니는 에너지 구체들 생성
    this.createEnergyOrbs()

    // 파티클 효과 생성
    this.createParticleEffects(centerX, centerY)

    // 빛나는 선 효과
    this.createLightningEffect(centerX, centerY)

    // 마우스 인터랙션 추가
    this.addInteraction(centerX, centerY)
  }

  createEnergyCore(x: number, y: number) {
    // 중앙 코어
    const core = this.add.circle(x, y, 40, 0x8b5cf6, 1)
    core.setBlendMode(Phaser.BlendModes.ADD)

    // 코어 펄스 애니메이션
    this.tweens.add({
      targets: core,
      scale: 1.2,
      alpha: 0.8,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    // 내부 밝은 코어
    const innerCore = this.add.circle(x, y, 20, 0xffffff, 1)
    innerCore.setBlendMode(Phaser.BlendModes.ADD)

    this.tweens.add({
      targets: innerCore,
      scale: 1.5,
      alpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  createGlowingRings(x: number, y: number) {
    const ringCount = 5

    for (let i = 0; i < ringCount; i++) {
      const radius = 60 + (i * 30)
      const ring = this.add.circle(x, y, radius, 0x8b5cf6, 0.1)
      ring.setStrokeStyle(2, 0x8b5cf6, 0.5)
      ring.setBlendMode(Phaser.BlendModes.ADD)
      this.glowCircles.push(ring)

      // 링 확장 애니메이션
      this.tweens.add({
        targets: ring,
        scale: 1.5,
        alpha: 0,
        duration: 3000,
        repeat: -1,
        delay: i * 600,
        ease: 'Power2'
      })
    }
  }

  createEnergyOrbs() {
    const orbCount = 12
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    for (let i = 0; i < orbCount; i++) {
      const angle = (i / orbCount) * Math.PI * 2
      const radius = 200
      const x = width / 2 + Math.cos(angle) * radius
      const y = height / 2 + Math.sin(angle) * radius

      const orb = this.add.circle(x, y, 8, 0x6366f1, 1)
      orb.setBlendMode(Phaser.BlendModes.ADD)
      this.energyOrbs.push(orb)

      // 궤도 회전 애니메이션
      this.tweens.add({
        targets: orb,
        angle: 360,
        duration: 8000 + (i * 200),
        repeat: -1,
        ease: 'Linear'
      })

      // 궤도 이동
      const orbit = this.tweens.add({
        targets: orb,
        x: width / 2 + Math.cos(angle + Math.PI * 2) * radius,
        y: height / 2 + Math.sin(angle + Math.PI * 2) * radius,
        duration: 8000,
        repeat: -1,
        ease: 'Linear',
        onUpdate: () => {
          const currentAngle = orbit.progress * Math.PI * 2 + angle
          orb.x = width / 2 + Math.cos(currentAngle) * radius
          orb.y = height / 2 + Math.sin(currentAngle) * radius
        }
      })

      // 펄스 효과
      this.tweens.add({
        targets: orb,
        scale: 1.5,
        alpha: 0.5,
        duration: 1000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    }
  }

  createParticleEffects(x: number, y: number) {
    // 간단한 파티클 효과 (이미지 없이)
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      const particle = this.add.circle(x, y, 2, 0x8b5cf6, 0.8)
      particle.setBlendMode(Phaser.BlendModes.ADD)

      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 300
      const targetX = x + Math.cos(angle) * distance
      const targetY = y + Math.sin(angle) * distance

      this.tweens.add({
        targets: particle,
        x: targetX,
        y: targetY,
        alpha: 0,
        duration: 2000 + Math.random() * 2000,
        repeat: -1,
        delay: Math.random() * 2000,
        onRepeat: () => {
          particle.x = x
          particle.y = y
          particle.alpha = 0.8
        }
      })
    }
  }

  createLightningEffect(x: number, y: number) {
    // 번개 같은 선 효과
    const lineCount = 8

    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * Math.PI * 2
      const length = 150
      const endX = x + Math.cos(angle) * length
      const endY = y + Math.sin(angle) * length

      const line = this.add.line(0, 0, x, y, endX, endY, 0x8b5cf6, 0.3)
      line.setLineWidth(2)
      line.setBlendMode(Phaser.BlendModes.ADD)

      // 번쩍이는 효과
      this.tweens.add({
        targets: line,
        alpha: 0.8,
        duration: 500 + Math.random() * 500,
        yoyo: true,
        repeat: -1,
        delay: i * 100,
        ease: 'Sine.easeInOut'
      })

      // 회전 효과
      this.tweens.add({
        targets: line,
        angle: 360,
        duration: 20000,
        repeat: -1,
        ease: 'Linear'
      })
    }
  }

  addInteraction(centerX: number, centerY: number) {
    // 마우스 움직임에 반응하는 효과
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      const dx = pointer.x - centerX
      const dy = pointer.y - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // 마우스가 가까이 오면 반응
      if (distance < 200) {
        const ripple = this.add.circle(pointer.x, pointer.y, 30, 0x8b5cf6, 0.5)
        ripple.setBlendMode(Phaser.BlendModes.ADD)

        this.tweens.add({
          targets: ripple,
          scale: 3,
          alpha: 0,
          duration: 800,
          ease: 'Power2',
          onComplete: () => {
            ripple.destroy()
          }
        })
      }
    })

    // 클릭 효과
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const explosion = this.add.circle(pointer.x, pointer.y, 10, 0xffffff, 1)
      explosion.setBlendMode(Phaser.BlendModes.ADD)

      this.tweens.add({
        targets: explosion,
        scale: 5,
        alpha: 0,
        duration: 600,
        ease: 'Power3',
        onComplete: () => {
          explosion.destroy()
        }
      })

      // 폭발 파티클
      for (let i = 0; i < 20; i++) {
        const particle = this.add.circle(pointer.x, pointer.y, 3, 0x8b5cf6, 1)
        particle.setBlendMode(Phaser.BlendModes.ADD)

        const angle = (i / 20) * Math.PI * 2
        const distance = 100
        const targetX = pointer.x + Math.cos(angle) * distance
        const targetY = pointer.y + Math.sin(angle) * distance

        this.tweens.add({
          targets: particle,
          x: targetX,
          y: targetY,
          alpha: 0,
          duration: 800,
          ease: 'Power2',
          onComplete: () => {
            particle.destroy()
          }
        })
      }
    })
  }

  update() {
    // 필요시 매 프레임 업데이트
  }
}

onMounted(() => {
  if (!phaserContainer.value) return

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: phaserContainer.value,
    width: 800,
    height: 600,
    transparent: true,
    scene: HeroAnimationScene,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false
      }
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  }

  game = new Phaser.Game(config)
})

onUnmounted(() => {
  if (game) {
    game.destroy(true)
    game = null
  }
})
</script>

<style scoped>
.phaser-hero-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 600px;
  z-index: 5;
  pointer-events: auto;
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