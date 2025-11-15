import Phaser from 'phaser'
import { BattleScene } from '~/scenes/BattleScene'
import type { General } from '~/types/game'

export const usePhaserBattle = () => {
  let game: Phaser.Game | null = null
  let battleScene: BattleScene | null = null

  // Phaser 게임 초기화
  const initGame = (containerId: string): Promise<void> => {
    return new Promise((resolve) => {
      if (game) {
        game.destroy(true)
        game = null
        battleScene = null
      }

      const container = document.getElementById(containerId)
      if (!container) {
        console.error('Container not found:', containerId)
        resolve()
        return
      }

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: container.clientWidth,
        height: 320, // 고정 높이
        parent: containerId,
        backgroundColor: '#1a1a2e',
        scene: [BattleScene],
        physics: {
          default: 'arcade',
          arcade: {
            debug: false
          }
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      }

      game = new Phaser.Game(config)

      // Scene 참조 저장
      game.events.once('ready', () => {
        battleScene = game?.scene.getScene('BattleScene') as BattleScene
        console.log('Phaser initialized, scene ready:', battleScene)
        resolve()
      })
    })
  }

  // 전투 초기화
  const startBattle = (playerGenerals: General[], enemyGenerals: General[]) => {
    if (!battleScene) {
      console.error('BattleScene not initialized')
      return
    }

    battleScene.initializeGenerals(playerGenerals, enemyGenerals)
  }

  // 공격 애니메이션 실행
  const playAttack = async (
    attackerName: string,
    defenderName: string,
    damage: number,
    isPlayerAttacker: boolean
  ) => {
    if (!battleScene) {
      console.warn('BattleScene not ready for playAttack')
      return
    }

    try {
      console.log(`Playing attack: ${attackerName} -> ${defenderName}, damage: ${damage}`)
      await battleScene.playAttackAnimation(
        attackerName,
        defenderName,
        damage,
        isPlayerAttacker
      )
    } catch (error) {
      console.error('Error in playAttack:', error)
    }
  }

  // 스킬 애니메이션 실행
  const playSkill = async (
    casterName: string,
    targetName: string,
    skillName: string,
    isPlayerCaster: boolean
  ) => {
    if (!battleScene) {
      console.warn('BattleScene not ready for playSkill')
      return
    }

    try {
      console.log(`Playing skill: ${skillName} by ${casterName}`)
      await battleScene.playSkillEffect(casterName, targetName, skillName, isPlayerCaster)
    } catch (error) {
      console.error('Error in playSkill:', error)
    }
  }

  // 힐 애니메이션 실행
  const playHeal = async (targetName: string, healAmount: number, isPlayer: boolean) => {
    if (!battleScene) {
      console.warn('BattleScene not ready for playHeal')
      return
    }

    try {
      await battleScene.playHealEffect(targetName, healAmount, isPlayer)
    } catch (error) {
      console.error('Error in playHeal:', error)
    }
  }

  // 승리 효과
  const playVictory = (isPlayerVictory: boolean) => {
    if (!battleScene) {
      console.warn('BattleScene not ready for playVictory')
      return
    }

    try {
      battleScene.playVictoryEffect(isPlayerVictory)
    } catch (error) {
      console.error('Error in playVictory:', error)
    }
  }

  // 게임 정리
  const destroyGame = () => {
    if (game) {
      game.destroy(true)
      game = null
      battleScene = null
    }
  }

  return {
    initGame,
    startBattle,
    playAttack,
    playSkill,
    playHeal,
    playVictory,
    destroyGame
  }
}
