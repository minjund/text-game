<template>
  <div ref="gameContainer" class="absolute inset-0 pointer-events-none z-10"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Phaser from 'phaser'

const gameContainer = ref<HTMLDivElement | null>(null)
let game: Phaser.Game | null = null

onMounted(() => {
  if (!gameContainer.value) return

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: gameContainer.value,
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    pixelArt: false, // 안티앨리어싱 활성화로 부드러운 이미지
    render: {
      transparent: true,
      antialias: true,
      antialiasGL: true,
      premultipliedAlpha: true
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 }, // 캐릭터는 공중에 떠 있으므로 중력 0
        debug: false
      }
    },
    scene: {
      preload,
      create,
      update
    }
  }

  game = new Phaser.Game(config)

  let ariel: Phaser.Physics.Arcade.Sprite
  let currentEmotion = 'idle' // 현재 캐릭터의 감정 상태

  function preload(this: Phaser.Scene) {
    // 스프라이트시트 로드 (3x2 그리드, 1024x1024 이미지)
    this.load.spritesheet('ariel', '/images/character/assistant_touch3-removebg.png', {
      frameWidth: 342,  // 1024 / 3 ≈ 342
      frameHeight: 512  // 1024 / 2 = 512
    })
  }

  function create(this: Phaser.Scene) {
    const centerX = this.cameras.main.width / 2
    const centerY = this.cameras.main.height / 2

    // 모바일 화면 크기에 맞게 스케일 조정
    const isMobile = window.innerWidth < 768
    const scale = isMobile ? 0.7 : 0.7 // (이전 질문에서처럼 0.45 등으로 수정하셔도 됩니다)

    // 캐릭터 스프라이트 생성 (physics sprite)
    ariel = this.physics.add.sprite(centerX, centerY + (isMobile ? 20 : 0), 'ariel')
    ariel.setScale(scale)

    // --- 여기부터 애니메이션 코드 수정 ---

    // [수정] Idle 애니메이션 (프레임 0 고정)
    // 'idle'은 더 이상 왕복하지 않고, 눈 뜬 0번 프레임에 고정됩니다.
    this.anims.create({
      key: 'idle',
      frames: [{ key: 'ariel', frame: 0 }],
      frameRate: 10
    })

    // [추가] 자연스러운 깜빡임 애니메이션 (0 -> 1 -> 0)
    // 눈 뜸 -> 감음 -> 눈 뜸 순서로 1회만 재생됩니다.
    this.anims.create({
      key: 'blink',
      frames: this.anims.generateFrameNumbers('ariel', { frames: [0, 1, 0] }),
      frameRate: 10, // 빠른 속도로 재생
      repeat: 0      // 1번만 재생
    })

    // 행복한 표정 애니메이션 (프레임 2) - 기존 코드 동일
    this.anims.create({
      key: 'happy',
      frames: [{ key: 'ariel', frame: 2 }],
      frameRate: 10
    })

    // 놀란 표정 애니메이션 (프레임 3) - 기존 코드 동일
    this.anims.create({
      key: 'surprised',
      frames: [{ key: 'ariel', frame: 3 }],
      frameRate: 10
    })

    // 슬픈 표정 애니메이션 (프레임 4) - 기존 코드 동일
    this.anims.create({
      key: 'sad',
      frames: [{ key: 'ariel', frame: 4 }],
      frameRate: 10
    })

    // 화난 표정 애니메이션 (프레임 5) - 기존 코드 동일
    this.anims.create({
      key: 'angry',
      frames: [{ key: 'ariel', frame: 5 }],
      frameRate: 10,
      repeat: 0
    })

    // 초기 애니메이션 재생
    ariel.play('idle') // 'idle' (0번 프레임 고정) 상태로 시작

    // [추가] 랜덤 깜빡임 타이머 로직
    const triggerBlink = () => {
      // 현재 감정 상태가 'idle'이고, 다른 애니메이션 재생 중이 아닐 때만
      if (currentEmotion === 'idle' && ariel.anims.currentAnim.key === 'idle') {
        ariel.play('blink')
      }

      // 다음 깜빡임 예약 (2초에서 5초 사이 랜덤)
      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 5000),
        callback: triggerBlink,
        callbackScope: this
      })
    }

    // [추가] 'blink' 애니메이션 완료 시 'idle'로 복귀
    // 'blink' (0->1->0)가 끝나면, 다시 'idle'(0번 프레임 고정) 상태로 돌려놓습니다.
    ariel.on('animationcomplete-blink', () => {
      if (currentEmotion === 'idle') {
        ariel.play('idle')
      }
    })

    // 최초 깜빡임 타이머 시작
    triggerBlink()

    // 캐릭터 스프라이트가 클릭 이벤트를 받을 수 있도록 설정
    ariel.setInteractive({ useHandCursor: true })

    // 캐릭터 클릭 시 이벤트 처리
    ariel.on('pointerdown', () => {
      // 클릭할 때마다 표정 순서대로 변경 (자동 복귀 없음)
      if (currentEmotion === 'idle') {
        currentEmotion = 'happy'
        ariel.play('happy')

        // 클릭 피드백: 살짝 튕기는 효과
        this.tweens.add({
          targets: ariel,
          scaleX: scale * 1.15,
          scaleY: scale * 1.15,
          duration: 100,
          yoyo: true,
          ease: 'Power2'
        })

      } else if (currentEmotion === 'happy') {
        currentEmotion = 'surprised'
        ariel.play('surprised')

        // 클릭 피드백
        this.tweens.add({
          targets: ariel,
          y: ariel.y - 20,
          duration: 100,
          yoyo: true,
          ease: 'Power2'
        })

      } else if (currentEmotion === 'surprised') {
        currentEmotion = 'sad'
        ariel.play('sad')

        // 클릭 피드백
        this.tweens.add({
          targets: ariel,
          scaleX: scale * 0.95,
          scaleY: scale * 0.95,
          duration: 200,
          yoyo: true,
          ease: 'Power2'
        })

      } else if (currentEmotion === 'sad') {
        currentEmotion = 'angry'
        ariel.play('angry')

        // 클릭 피드백: 흔들림 효과
        this.tweens.add({
          targets: ariel,
          angle: -5,
          duration: 50,
          yoyo: true,
          repeat: 3,
          ease: 'Power2'
        })

      } else if (currentEmotion === 'angry') {
        currentEmotion = 'idle'
        ariel.play('idle')
      }
    })

    // 호버 효과 (데스크톱)
    ariel.on('pointerover', () => {
      if (currentEmotion === 'idle') {
        this.tweens.add({
          targets: ariel,
          scaleX: scale * 1.05,
          scaleY: scale * 1.05,
          duration: 200,
          ease: 'Power2'
        })
      }
    })

    ariel.on('pointerout', () => {
      if (currentEmotion === 'idle') {
        this.tweens.add({
          targets: ariel,
          scaleX: scale,
          scaleY: scale,
          duration: 200,
          ease: 'Power2'
        })
      }
    })

    // 화면 크기 변경 시 캐릭터 위치 및 스케일 조정
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      const newIsMobile = gameSize.width < 768
      const newScale = newIsMobile ? 0.3 : 0.5
      const newCenterY = gameSize.height / 2 + (newIsMobile ? 20 : 0)

      ariel.setPosition(gameSize.width / 2, newCenterY)
      ariel.setScale(newScale)
    })

    // 부드러운 등장 애니메이션
    ariel.setAlpha(0)
    ariel.setScale(0)
    this.tweens.add({
      targets: ariel,
      alpha: 1,
      scaleX: scale,
      scaleY: scale,
      duration: 800,
      ease: 'Back.easeOut'
    })
  }

  function update(this: Phaser.Scene) {
    // 게임 루프 (필요시 추가 로직)
  }

  // 윈도우 리사이즈 핸들러
  const handleResize = () => {
    if (game) {
      game.scale.resize(window.innerWidth, window.innerHeight)
    }
  }

  window.addEventListener('resize', handleResize)

  // cleanup 시 리스너 제거
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})

onUnmounted(() => {
  if (game) {
    game.destroy(true)
    game = null
  }
})
</script>

<style scoped>
/* Phaser 캔버스가 다른 UI 요소를 방해하지 않도록 */
div {
  pointer-events: none;
}

:deep(canvas) {
  pointer-events: auto;
}
</style>
