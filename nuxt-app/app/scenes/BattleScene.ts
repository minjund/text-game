import Phaser from 'phaser'
import type { General } from '~/types/game'

export interface GeneralSprite {
  general: General
  container: Phaser.GameObjects.Container
  avatar: Phaser.GameObjects.Circle
  hpBar: Phaser.GameObjects.Graphics
  hpBarBg: Phaser.GameObjects.Graphics
  nameText: Phaser.GameObjects.Text
  statsText: Phaser.GameObjects.Text
  currentHp: number
  maxHp: number
}

export class BattleScene extends Phaser.Scene {
  private playerGenerals: GeneralSprite[] = []
  private enemyGenerals: GeneralSprite[] = []
  private particles?: Phaser.GameObjects.Particles.ParticleEmitter

  constructor() {
    super({ key: 'BattleScene' })
  }

  init(data: { playerGenerals: General[], enemyGenerals: General[] }) {
    this.playerGenerals = []
    this.enemyGenerals = []
  }

  create() {
    // 배경
    const bg = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      0x1a1a2e
    )

    // 중앙 구분선
    const divider = this.add.line(
      this.cameras.main.centerX,
      0,
      0,
      0,
      0,
      this.cameras.main.height,
      0x4a5568,
      0.5
    )
    divider.setOrigin(0.5, 0)

    // 파티클 매니저 생성
    this.createParticles()
  }

  // 장수 초기화
  public initializeGenerals(playerGenerals: General[], enemyGenerals: General[]) {
    // 기존 스프라이트 제거
    this.clearAllGenerals()

    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // 플레이어 장수들 (왼쪽)
    playerGenerals.forEach((general, index) => {
      const y = height / 2 + (index - playerGenerals.length / 2 + 0.5) * 100
      const sprite = this.createGeneralSprite(general, width * 0.25, y, true)
      this.playerGenerals.push(sprite)
    })

    // 적 장수들 (오른쪽)
    enemyGenerals.forEach((general, index) => {
      const y = height / 2 + (index - enemyGenerals.length / 2 + 0.5) * 100
      const sprite = this.createGeneralSprite(general, width * 0.75, y, false)
      this.enemyGenerals.push(sprite)
    })
  }

  // 장수 스프라이트 생성
  private createGeneralSprite(
    general: General,
    x: number,
    y: number,
    isPlayer: boolean
  ): GeneralSprite {
    const container = this.add.container(x, y)

    // 등급별 색상
    const rarityColors: Record<string, number> = {
      common: 0x9ca3af,
      rare: 0x3b82f6,
      epic: 0xa855f7,
      legendary: 0xf97316
    }
    const color = rarityColors[general.rarity] || rarityColors.common

    // 아바타 (원형)
    const avatar = this.add.circle(0, 0, 30, color, 0.8)
    avatar.setStrokeStyle(4, color, 1)

    // 이모지 텍스트 (장수 아이콘)
    const icon = this.add.text(0, 0, this.getGeneralIcon(general), {
      fontSize: '32px',
      align: 'center'
    })
    icon.setOrigin(0.5, 0.5)

    // HP 바 배경
    const hpBarBg = this.add.graphics()
    hpBarBg.fillStyle(0x000000, 0.5)
    hpBarBg.fillRoundedRect(-40, 40, 80, 8, 4)

    // HP 바
    const hpBar = this.add.graphics()

    // 이름
    const nameText = this.add.text(0, 55, general.name, {
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center'
    })
    nameText.setOrigin(0.5, 0)

    // 병력 수
    const statsText = this.add.text(0, -45, `병력: ${general.assignedSoldiers}`, {
      fontSize: '10px',
      color: '#94a3b8',
      align: 'center'
    })
    statsText.setOrigin(0.5, 0)

    container.add([hpBarBg, hpBar, avatar, icon, nameText, statsText])

    const maxHp = general.assignedSoldiers
    const sprite: GeneralSprite = {
      general,
      container,
      avatar,
      hpBar,
      hpBarBg,
      nameText,
      statsText,
      currentHp: maxHp,
      maxHp
    }

    this.updateHpBar(sprite)

    return sprite
  }

  // 장수 아이콘 선택
  private getGeneralIcon(general: General): string {
    if (general.title.includes('맹장') || general.title.includes('무장')) return '⚔️'
    if (general.title.includes('책사') || general.title.includes('군사')) return '📜'
    if (general.title.includes('궁수')) return '🏹'
    if (general.title.includes('기병')) return '🐎'
    if (general.title.includes('수비')) return '🛡️'
    return '⚔️'
  }

  // HP 바 업데이트
  private updateHpBar(sprite: GeneralSprite) {
    const hpPercent = Math.max(0, sprite.currentHp / sprite.maxHp)
    const barWidth = 80

    sprite.hpBar.clear()

    // HP 비율에 따른 색상
    let color = 0x10b981 // 초록
    if (hpPercent < 0.5) color = 0xfbbf24 // 노랑
    if (hpPercent < 0.25) color = 0xef4444 // 빨강

    sprite.hpBar.fillStyle(color, 1)
    sprite.hpBar.fillRoundedRect(-40, 40, barWidth * hpPercent, 8, 4)
  }

  // 공격 애니메이션
  public async playAttackAnimation(
    attackerName: string,
    defenderName: string,
    damage: number,
    isPlayerAttacker: boolean
  ): Promise<void> {
    return new Promise((resolve) => {
      const attacker = this.findGeneralSprite(attackerName, isPlayerAttacker)
      const defender = this.findGeneralSprite(defenderName, !isPlayerAttacker)

      if (!attacker || !defender) {
        resolve()
        return
      }

      // 공격자 펄스 효과
      this.tweens.add({
        targets: attacker.avatar,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          // 빔/화살표 발사
          this.shootProjectile(attacker, defender, () => {
            // 피격 효과
            this.playHitEffect(defender, damage)
            resolve()
          })
        }
      })
    })
  }

  // 발사체 애니메이션
  private shootProjectile(
    attacker: GeneralSprite,
    defender: GeneralSprite,
    onComplete: () => void
  ) {
    const projectile = this.add.circle(
      attacker.container.x,
      attacker.container.y,
      5,
      0xffff00,
      1
    )

    this.tweens.add({
      targets: projectile,
      x: defender.container.x,
      y: defender.container.y,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        projectile.destroy()
        onComplete()
      }
    })
  }

  // 피격 효과
  private playHitEffect(defender: GeneralSprite, damage: number) {
    // 흔들림 효과
    const originalX = defender.container.x

    this.tweens.add({
      targets: defender.container,
      x: originalX + 10,
      duration: 50,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        defender.container.x = originalX
      }
    })

    // 데미지 HP 감소
    defender.currentHp = Math.max(0, defender.currentHp - damage)
    this.updateHpBar(defender)

    // 데미지 텍스트
    this.showDamageText(defender.container.x, defender.container.y - 40, damage)

    // 파티클 효과
    this.createHitParticles(defender.container.x, defender.container.y)

    // HP가 0이면 사망 연출
    if (defender.currentHp <= 0) {
      this.playDeathAnimation(defender)
    }
  }

  // 데미지 텍스트
  private showDamageText(x: number, y: number, damage: number) {
    const damageText = this.add.text(x, y, `-${damage}`, {
      fontSize: '24px',
      color: '#ff4444',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    })
    damageText.setOrigin(0.5, 0.5)

    this.tweens.add({
      targets: damageText,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        damageText.destroy()
      }
    })
  }

  // 스킬 효과
  public async playSkillEffect(
    casterName: string,
    targetName: string,
    skillName: string,
    isPlayerCaster: boolean
  ): Promise<void> {
    return new Promise((resolve) => {
      const caster = this.findGeneralSprite(casterName, isPlayerCaster)
      const target = this.findGeneralSprite(targetName, !isPlayerCaster)

      if (!caster || !target) {
        resolve()
        return
      }

      // 스킬명 표시
      const skillText = this.add.text(
        caster.container.x,
        caster.container.y - 60,
        skillName,
        {
          fontSize: '14px',
          color: '#fbbf24',
          fontStyle: 'bold',
          backgroundColor: '#000000',
          padding: { x: 8, y: 4 }
        }
      )
      skillText.setOrigin(0.5, 0.5)

      // 스킬별 이펙트
      this.createSkillParticles(caster.container.x, caster.container.y, skillName)

      this.time.delayedCall(500, () => {
        skillText.destroy()
        resolve()
      })
    })
  }

  // 파티클 생성
  private createParticles() {
    // Phaser 3.60+에서는 ParticleEmitter 사용 방식이 변경됨
    // 간단한 파티클은 Graphics로 대체
  }

  // 타격 파티클
  private createHitParticles(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      const particle = this.add.circle(x, y, 3, 0xff6b6b, 1)
      const angle = (Math.PI * 2 * i) / 8
      const distance = 30

      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => {
          particle.destroy()
        }
      })
    }
  }

  // 스킬 파티클
  private createSkillParticles(x: number, y: number, skillName: string) {
    let color = 0xffd700

    if (skillName.includes('불') || skillName.includes('화')) {
      color = 0xff4500
    } else if (skillName.includes('번개') || skillName.includes('뇌')) {
      color = 0x00ffff
    } else if (skillName.includes('치유')) {
      color = 0x00ff00
    }

    for (let i = 0; i < 12; i++) {
      const particle = this.add.circle(x, y, 4, color, 0.8)

      this.tweens.add({
        targets: particle,
        x: x + Phaser.Math.Between(-50, 50),
        y: y + Phaser.Math.Between(-50, 50),
        alpha: 0,
        duration: Phaser.Math.Between(300, 600),
        ease: 'Power2',
        onComplete: () => {
          particle.destroy()
        }
      })
    }
  }

  // 사망 애니메이션
  private playDeathAnimation(sprite: GeneralSprite) {
    this.tweens.add({
      targets: sprite.container,
      alpha: 0,
      scaleX: 0.5,
      scaleY: 0.5,
      duration: 500,
      ease: 'Power2'
    })
  }

  // 승리 효과
  public playVictoryEffect(isPlayerVictory: boolean) {
    const winners = isPlayerVictory ? this.playerGenerals : this.enemyGenerals

    winners.forEach((sprite, index) => {
      if (sprite.currentHp > 0) {
        this.time.delayedCall(index * 100, () => {
          // 승리 펄스
          this.tweens.add({
            targets: sprite.container,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            yoyo: true,
            repeat: 2
          })

          // 반짝이는 파티클
          for (let i = 0; i < 20; i++) {
            const particle = this.add.circle(
              sprite.container.x,
              sprite.container.y,
              3,
              0xffd700,
              1
            )

            this.tweens.add({
              targets: particle,
              x: sprite.container.x + Phaser.Math.Between(-60, 60),
              y: sprite.container.y + Phaser.Math.Between(-60, 60),
              alpha: 0,
              duration: 1000,
              ease: 'Power2',
              onComplete: () => {
                particle.destroy()
              }
            })
          }
        })
      }
    })
  }

  // 장수 찾기
  private findGeneralSprite(name: string, isPlayer: boolean): GeneralSprite | null {
    const list = isPlayer ? this.playerGenerals : this.enemyGenerals
    const found = list.find(s => s.general.name === name)

    // 장수를 찾지 못하면 첫 번째 장수 반환
    if (!found && list.length > 0) {
      console.warn(`General ${name} not found, using first general instead`)
      return list[0]
    }

    return found || null
  }

  // 모든 장수 제거
  private clearAllGenerals() {
    this.playerGenerals.forEach(sprite => {
      sprite.container.destroy()
    })
    this.enemyGenerals.forEach(sprite => {
      sprite.container.destroy()
    })
    this.playerGenerals = []
    this.enemyGenerals = []
  }

  // 힐 효과
  public async playHealEffect(targetName: string, healAmount: number, isPlayer: boolean): Promise<void> {
    return new Promise((resolve) => {
      const target = this.findGeneralSprite(targetName, isPlayer)
      if (!target) {
        resolve()
        return
      }

      // HP 회복
      target.currentHp = Math.min(target.maxHp, target.currentHp + healAmount)
      this.updateHpBar(target)

      // 힐 텍스트
      const healText = this.add.text(
        target.container.x,
        target.container.y - 40,
        `+${healAmount}`,
        {
          fontSize: '24px',
          color: '#10b981',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 4
        }
      )
      healText.setOrigin(0.5, 0.5)

      this.tweens.add({
        targets: healText,
        y: target.container.y - 80,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => {
          healText.destroy()
          resolve()
        }
      })

      // 초록 파티클
      for (let i = 0; i < 10; i++) {
        const particle = this.add.circle(
          target.container.x,
          target.container.y,
          4,
          0x10b981,
          0.8
        )

        this.tweens.add({
          targets: particle,
          y: target.container.y - Phaser.Math.Between(30, 60),
          alpha: 0,
          duration: 1000,
          ease: 'Power2',
          onComplete: () => {
            particle.destroy()
          }
        })
      }
    })
  }
}
