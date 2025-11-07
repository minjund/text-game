<template>
  <div class="phaser-battle-container">
    <div ref="gameContainer" class="game-canvas"></div>
    <div class="battle-ui">
      <div class="battle-info">
        <h3>{{ battleInfo.turn }}턴</h3>
        <p>{{ battleInfo.message }}</p>
      </div>
      <button v-if="battleInfo.canContinue" class="btn btn-primary" @click="nextTurn">
        다음 턴
      </button>
      <button v-if="battleInfo.isFinished" class="btn btn-success" @click="closeBattle">
        {{ battleInfo.result === 'victory' ? '승리! 확인' : '패배... 확인' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as Phaser from 'phaser'
import type { Battle } from '../types/game'

const props = defineProps<{
  battle: Battle
}>()

const emit = defineEmits<{
  close: [result: 'victory' | 'defeat']
}>()

const gameContainer = ref<HTMLDivElement>()
let game: Phaser.Game | null = null

const battleInfo = ref({
  turn: 1,
  message: '전투가 시작되었습니다!',
  canContinue: true,
  isFinished: false,
  result: '' as 'victory' | 'defeat' | ''
})

/**
 * BattleScene - 전투 장면을 관리하는 Phaser Scene
 *
 * Best Practices Applied:
 * - 명확한 Scene 생명주기 관리 (preload -> create -> update)
 * - 리소스 정리를 위한 shutdown 메서드 구현
 * - 재사용 가능한 메서드로 기능 분리
 * - 상수와 설정값을 클래스 상단에 정의
 */
class BattleScene extends Phaser.Scene {
  // 상수 정의
  private readonly SPRITE_SCALE = 1.5
  private readonly ATTACK_DISTANCE = 120
  private readonly ATTACK_DURATION = 250
  private readonly JUMP_HEIGHT = 60
  private readonly HIT_PARTICLE_COUNT = 30
  private readonly PARTICLE_LIFESPAN = 600

  // 스프라이트 컨테이너
  private attackerSprites: Phaser.GameObjects.Sprite[] = []
  private defenderSprites: Phaser.GameObjects.Sprite[] = []
  private attackerTexts: Phaser.GameObjects.Text[] = []
  private defenderTexts: Phaser.GameObjects.Text[] = []

  // 파티클 이미터
  private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null

  constructor() {
    super({ key: 'BattleScene' })
  }

  /**
   * preload - 에셋 로드 단계
   * 텍스처 생성은 여기서 한 번만 수행
   */
  preload() {
    this.createCharacterTextures()
  }

  /**
   * 캐릭터 텍스처 생성
   * Graphics API를 사용하여 동적으로 스프라이트 생성
   */
  private createCharacterTextures(): void {
    // 공격자 텍스처 (블루 팀)
    this.createCharacterTexture('attacker', 0x4169e1, 0x6495ed)

    // 방어자 텍스처 (레드 팀)
    this.createCharacterTexture('defender', 0xe14141, 0xff6b6b)
  }

  /**
   * 개별 캐릭터 텍스처 생성 (재사용 가능한 메서드)
   */
  private createCharacterTexture(key: string, bodyColor: number, highlightColor: number): void {
    const graphics = this.add.graphics()

    // 몸통 (원형)
    graphics.fillStyle(bodyColor, 1)
    graphics.fillCircle(50, 50, 40)

    // 하이라이트 효과
    graphics.fillStyle(highlightColor, 0.5)
    graphics.fillCircle(45, 45, 15)

    // 눈
    graphics.fillStyle(0xffffff, 1)
    graphics.fillCircle(40, 40, 8)
    graphics.fillCircle(60, 40, 8)

    // 눈동자
    graphics.fillStyle(0x000000, 1)
    graphics.fillCircle(42, 42, 4)
    graphics.fillCircle(62, 42, 4)

    // 텍스처 생성 및 Graphics 객체 정리
    graphics.generateTexture(key, 100, 100)
    graphics.destroy()
  }

  /**
   * create - 게임 오브젝트 초기화
   * Scene이 시작될 때 한 번 실행
   */
  create() {
    this.createBackground()
    this.createDivider()
    this.createTitle()
    this.setupCharacters()
    this.setupParticleSystem()
  }

  /**
   * 배경 생성
   */
  private createBackground(): void {
    // 그라디언트 효과를 위한 여러 레이어
    this.add.rectangle(400, 300, 800, 600, 0x0f0f1e)
    this.add.rectangle(400, 150, 800, 300, 0x1a1a2e, 0.5)
    this.add.rectangle(400, 450, 800, 300, 0x252535, 0.3)
  }

  /**
   * 중앙 구분선 생성
   */
  private createDivider(): void {
    const divider = this.add.line(400, 300, 400, 0, 400, 600, 0x667eea, 0.3)
    divider.setLineWidth(3)

    // 빛나는 효과
    this.tweens.add({
      targets: divider,
      alpha: 0.6,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  /**
   * 타이틀 생성
   */
  private createTitle(): void {
    const title = this.add.text(
      400,
      30,
      `${props.battle.attacker.kingdomName} VS ${props.battle.defender.kingdomName}`,
      {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'Noto Sans KR, Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5)

    // 제목 반짝이는 효과
    this.tweens.add({
      targets: title,
      scale: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  /**
   * 캐릭터 배치 및 설정
   */
  private setupCharacters(): void {
    const attackerCount = Math.min(props.battle.attacker.generals.length, 3)
    const defenderCount = Math.min(props.battle.defender.generals.length, 3)

    // 공격자 팀 (왼쪽)
    for (let i = 0; i < attackerCount; i++) {
      this.createCharacter(
        'attacker',
        props.battle.attacker.generals[i],
        200,
        150 + i * 150,
        '#4169e1',
        true
      )
    }

    // 방어자 팀 (오른쪽)
    for (let i = 0; i < defenderCount; i++) {
      this.createCharacter(
        'defender',
        props.battle.defender.generals[i],
        600,
        150 + i * 150,
        '#e14141',
        false
      )
    }
  }

  /**
   * 개별 캐릭터 생성 (스프라이트 + 텍스트)
   */
  private createCharacter(
    textureKey: string,
    general: any,
    x: number,
    y: number,
    color: string,
    isAttacker: boolean
  ): void {
    // 스프라이트 생성
    const sprite = this.add.sprite(x, y, textureKey)
    sprite.setScale(this.SPRITE_SCALE)

    // 살짝 떠있는 애니메이션
    this.tweens.add({
      targets: sprite,
      y: y - 10,
      duration: 2000 + Math.random() * 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    // 이름 텍스트
    const nameText = this.add.text(x, y + 70, general.name, {
      fontSize: '18px',
      color: color,
      fontFamily: 'Noto Sans KR, Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5)

    // 컨테이너에 추가
    if (isAttacker) {
      this.attackerSprites.push(sprite)
      this.attackerTexts.push(nameText)
    } else {
      this.defenderSprites.push(sprite)
      this.defenderTexts.push(nameText)
    }
  }

  /**
   * 파티클 시스템 설정
   */
  private setupParticleSystem(): void {
    // 파티클 이미터 생성 (나중에 사용)
    this.particleEmitter = this.add.particles(0, 0, 'attacker', {
      speed: { min: 150, max: 300 },
      scale: { start: 0.4, end: 0 },
      rotate: { start: 0, end: 360 },
      blendMode: 'ADD',
      lifespan: this.PARTICLE_LIFESPAN,
      gravityY: 100,
      tint: 0xffd700,
      emitting: false
    })
  }

  /**
   * 공격 애니메이션 실행
   * @param isAttacker 공격자 여부
   * @param index 공격하는 캐릭터 인덱스
   * @param success 공격 성공 여부
   */
  public playAttackAnimation(isAttacker: boolean, index: number, success: boolean): void {
    const sprites = isAttacker ? this.attackerSprites : this.defenderSprites
    const texts = isAttacker ? this.attackerTexts : this.defenderTexts
    const sprite = sprites[index % sprites.length]
    const text = texts[index % texts.length]

    if (!sprite) return

    const originalX = sprite.x
    const originalY = sprite.y
    const targetX = isAttacker ? originalX + this.ATTACK_DISTANCE : originalX - this.ATTACK_DISTANCE

    // 공격 준비 (뒤로 살짝 당기기)
    this.tweens.add({
      targets: sprite,
      x: isAttacker ? originalX - 20 : originalX + 20,
      duration: 150,
      ease: 'Power2',
      onComplete: () => {
        // 공격 돌진
        this.tweens.add({
          targets: sprite,
          x: targetX,
          duration: this.ATTACK_DURATION,
          ease: 'Power3',
          yoyo: true,
          onYoyo: () => {
            if (success) {
              this.playHitEffects(isAttacker)
            }
          }
        })
      }
    })

    // 점프 효과
    this.tweens.add({
      targets: sprite,
      y: originalY - this.JUMP_HEIGHT,
      duration: this.ATTACK_DURATION,
      ease: 'Sine.easeOut',
      yoyo: true,
      delay: 150
    })

    // 회전 효과
    this.tweens.add({
      targets: sprite,
      angle: isAttacker ? 15 : -15,
      duration: this.ATTACK_DURATION,
      ease: 'Back.easeOut',
      yoyo: true,
      delay: 150
    })

    // 텍스트도 함께 움직임
    this.tweens.add({
      targets: text,
      x: isAttacker ? text.x + 30 : text.x - 30,
      duration: this.ATTACK_DURATION,
      ease: 'Power2',
      yoyo: true,
      delay: 150
    })
  }

  /**
   * 타격 효과 재생
   */
  private playHitEffects(isAttacker: boolean): void {
    const enemySprites = isAttacker ? this.defenderSprites : this.attackerSprites
    const hitX = isAttacker ? 600 : 200

    // 적 스프라이트 흔들기 및 깜빡임
    enemySprites.forEach((enemy, idx) => {
      // 흔들림 효과
      this.tweens.add({
        targets: enemy,
        x: enemy.x + (Math.random() - 0.5) * 20,
        y: enemy.y + (Math.random() - 0.5) * 20,
        duration: 50,
        yoyo: true,
        repeat: 3,
        ease: 'Linear'
      })

      // 깜빡임 효과
      this.tweens.add({
        targets: enemy,
        alpha: 0.3,
        tint: 0xff0000,
        duration: 100,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          enemy.clearTint()
        }
      })
    })

    // 파티클 폭발 효과
    this.createHitExplosion(hitX, 300)

    // 화면 흔들림
    this.cameras.main.shake(200, 0.005)
  }

  /**
   * 타격 폭발 효과 생성
   */
  private createHitExplosion(x: number, y: number): void {
    if (this.particleEmitter) {
      this.particleEmitter.setPosition(x, y)
      this.particleEmitter.explode(this.HIT_PARTICLE_COUNT)
    }

    // 추가 빛 효과
    const flash = this.add.circle(x, y, 80, 0xffff00, 0.6)
    this.tweens.add({
      targets: flash,
      scale: 2,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => flash.destroy()
    })
  }

  /**
   * shutdown - Scene 종료 시 리소스 정리
   * Best Practice: 메모리 누수 방지를 위한 명시적 정리
   */
  shutdown(): void {
    // 배열 초기화
    this.attackerSprites = []
    this.defenderSprites = []
    this.attackerTexts = []
    this.defenderTexts = []

    // 파티클 이미터 제거
    if (this.particleEmitter) {
      this.particleEmitter.destroy()
      this.particleEmitter = null
    }

    // 모든 트윈 정지
    this.tweens.killAll()
  }
}

const nextTurn = () => {
  if (!game || battleInfo.value.isFinished) return

  const scene = game.scene.getScene('BattleScene') as BattleScene
  const turn = battleInfo.value.turn

  // 로그에서 현재 턴 가져오기
  const currentLog = props.battle.log[turn - 1]
  if (!currentLog) {
    // 전투 종료 체크
    if (turn > 5) {
      finishBattle()
    }
    return
  }

  // 공격자/방어자 판단
  const isAttacker = props.battle.attacker.generals.some(g => g.name === currentLog.generalName)
  const generalIndex = isAttacker
    ? props.battle.attacker.generals.findIndex(g => g.name === currentLog.generalName)
    : props.battle.defender.generals.findIndex(g => g.name === currentLog.generalName)

  // 애니메이션 재생
  scene.playAttackAnimation(isAttacker, generalIndex, currentLog.success)

  // UI 업데이트
  battleInfo.value.message = currentLog.message
  battleInfo.value.turn = turn + 1

  // 5턴 이상이면 종료
  if (turn >= 5) {
    setTimeout(() => finishBattle(), 1000)
  }
}

const finishBattle = () => {
  // 승패 계산
  const victoryScore = props.battle.log
    .filter(l => props.battle.attacker.generals.some(g => g.name === l.generalName) && l.success)
    .length

  const defeatScore = props.battle.log
    .filter(l => props.battle.defender.generals.some(g => g.name === l.generalName) && l.success)
    .length

  const result = victoryScore > defeatScore ? 'victory' : 'defeat'

  battleInfo.value.isFinished = true
  battleInfo.value.canContinue = false
  battleInfo.value.result = result
  battleInfo.value.message = result === 'victory' ? '승리했습니다!' : '패배했습니다...'
}

const closeBattle = () => {
  emit('close', battleInfo.value.result)
}

onMounted(() => {
  if (!gameContainer.value) return

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: gameContainer.value,
    scene: BattleScene,
    backgroundColor: '#1a1a2e',
    physics: {
      default: 'arcade'
    }
  }

  game = new Phaser.Game(config)
})

onUnmounted(() => {
  if (game) {
    game.destroy(true)
  }
})
</script>

<style scoped>
.phaser-battle-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.game-canvas {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.battle-ui {
  width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.battle-info {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  text-align: center;
  color: white;
}

.battle-info h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.battle-info p {
  font-size: 16px;
  line-height: 1.5;
}

.btn {
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn-success {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
}
</style>
