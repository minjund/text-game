<template>
  <Transition name="modal">
    <div v-if="battle" class="fixed inset-0 bg-black/90 z-[10001]">
      <div class="w-full h-full flex flex-col bg-gradient-to-br from-slate-800 to-slate-900 sm:border-2 sm:border-red-600 sm:rounded-lg sm:max-w-5xl sm:max-h-[90vh] sm:m-auto sm:mt-[5vh]">
        <!-- Header -->
        <div class="bg-gradient-to-r from-red-900 to-red-800 border-b-2 border-red-600 p-3 sm:p-4 flex-shrink-0">
          <div class="flex items-center justify-between">
            <h2 class="text-base sm:text-xl font-bold flex items-center gap-2">
              <span>⚔️</span> 전장의 기록
            </h2>
            <button @click.stop="handleClose" class="text-2xl hover:text-red-400 transition-colors px-3 py-2 -mr-2">
              ✕
            </button>
          </div>
          <div class="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm mt-1">
            <span class="font-bold text-blue-300">{{ battle.attacker.kingdomName }}</span>
            <span class="text-slate-400">VS</span>
            <span class="font-bold text-red-300">{{ battle.defender.kingdomName }}</span>
          </div>
        </div>

        <!-- Phaser Battle Canvas (모바일에서 숨김) -->
        <div id="phaser-battle-container" class="hidden sm:block w-full bg-slate-950" style="height: 200px;"></div>

        <!-- Battle Log -->
        <div ref="battleLogContainer" class="flex-1 p-3 sm:p-6 overflow-y-auto bg-slate-900/50">
          <div :class="{ 'opacity-50': isScrolling }">
            <div class="prose prose-invert max-w-none">
              <p v-for="(log, index) in battle.log" :key="index"
                 class="mb-2 sm:mb-3 text-xs sm:text-sm leading-relaxed"
                 :class="{
                   'text-slate-300': log.narrativeType === 'narration',
                   'text-amber-200 font-semibold': log.narrativeType === 'action',
                   'text-cyan-300 italic': log.narrativeType === 'dialogue'
                 }">
                <span v-if="log.narrativeType === 'narration'">{{ log.story }}</span>
                <span v-else-if="log.narrativeType === 'action'">{{ log.story }}</span>
                <span v-else-if="log.narrativeType === 'dialogue'">"{{ log.dialogue }}"</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Footer with Result -->
        <div v-if="battle.result" class="border-t-2 border-slate-600 p-4 flex-shrink-0 bg-slate-900">
          <div class="text-center mb-4">
            <h3 class="text-xl sm:text-2xl font-bold mb-2"
                :class="battle.result === 'victory' ? 'text-green-400' : 'text-red-400'">
              {{ battle.result === 'victory' ? '🎉 승리!' : '😢 패배...' }}
            </h3>
            <p v-if="battle.result === 'victory'" class="text-sm text-slate-300">
              전리품: 금 +500, 식량 +300
            </p>
          </div>
          <button @click.stop="handleClose"
                  class="w-full bg-slate-700 hover:bg-slate-600 active:bg-slate-500 border-2 border-slate-500 rounded-lg py-4 font-bold transition-colors text-lg">
            전장을 떠난다
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import type { Battle, BattleLog } from '~/types/game'
import { usePhaserBattle } from '~/composables/usePhaserBattle'

interface Props {
  battle: Battle | null
  isScrolling: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const handleClose = () => {
  emit('close')
}

const battleLogContainer = ref<HTMLElement | null>(null)
const { initGame, startBattle, playAttack, playSkill, playHeal, playVictory, destroyGame } = usePhaserBattle()

let isAnimating = false
let processedLogCount = 0

// Phaser 초기화
onMounted(async () => {
  if (process.client && props.battle) {
    // 약간의 딜레이를 주어 DOM이 완전히 렌더링되도록 함
    await new Promise(resolve => setTimeout(resolve, 100))

    await initGame('phaser-battle-container')
    console.log('Phaser game initialized')

    // 장수 초기화
    if (props.battle) {
      startBattle(
        props.battle.attacker.generals,
        props.battle.defender.generals
      )
      console.log('Battle started with generals:', props.battle.attacker.generals, props.battle.defender.generals)
    }
  }
})

// 전투 로그 변화 감지 및 애니메이션 실행
watch(
  () => props.battle?.log,
  async (newLogs) => {
    if (!newLogs) return

    // 이미 애니메이션 중이면 대기
    if (isAnimating) {
      console.log('Animation already in progress, waiting...')
      return
    }

    // 새로 추가된 로그만 처리
    const unprocessedLogs = newLogs.slice(processedLogCount)

    if (unprocessedLogs.length === 0) return

    console.log(`Processing ${unprocessedLogs.length} new logs, starting from ${processedLogCount}`)

    isAnimating = true

    for (const log of unprocessedLogs) {
      await processLogAnimation(log)
      processedLogCount++

      // 각 로그 사이에 작은 딜레이
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    isAnimating = false

    // 전투 결과에 따라 승리 효과
    if (props.battle?.result) {
      await new Promise(resolve => setTimeout(resolve, 500))
      playVictory(props.battle.result === 'victory')
    }
  },
  { deep: true, immediate: true }
)

// 로그에 따른 애니메이션 처리
const processLogAnimation = async (log: BattleLog) => {
  if (!props.battle) return

  // 나레이션이나 대사는 애니메이션 없이 스킵
  if (log.narrativeType === 'narration' || log.narrativeType === 'dialogue') {
    return
  }

  // 액션만 처리
  if (log.narrativeType === 'action' && log.action) {
    console.log('Processing action:', log.action, 'by', log.generalName)

    // 공격자와 방어자 파싱
    const attackerName = log.generalName

    // 공격자가 아군인지 판단
    const isPlayerAttacker = props.battle.attacker.generals.some(g => g.name === attackerName)

    // 방어자 이름 추측 (적 장수 중 첫번째)
    const defenderGenerals = isPlayerAttacker ? props.battle.defender.generals : props.battle.attacker.generals
    const defenderName = defenderGenerals.length > 0 ? defenderGenerals[0].name : ''

    console.log(`Attack animation: ${attackerName} -> ${defenderName}, isPlayer: ${isPlayerAttacker}`)

    // 스킬 사용 시 스킬 애니메이션
    if (log.action && log.action.trim() !== '') {
      await playSkill(attackerName, defenderName, log.action, isPlayerAttacker)
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // 데미지 파싱 (예: "500 데미지" 또는 "적진이 술렁이며" 등)
    // 기본 데미지 값 설정
    const damage = log.success ? 150 : 50

    // 공격 애니메이션
    await playAttack(attackerName, defenderName, damage, isPlayerAttacker)
  }

  // 치유 판정
  if (log.story?.includes('회복') || log.story?.includes('치유')) {
    const healMatch = log.story.match(/(\d+)/)
    const healAmount = healMatch ? parseInt(healMatch[1]) : 100

    const isPlayer = props.battle.attacker.generals.some(g => g.name === log.generalName)
    await playHeal(log.generalName, healAmount, isPlayer)
  }
}

// 컴포넌트 정리
onUnmounted(() => {
  destroyGame()
  processedLogCount = 0
})

// battle prop이 변경될 때 리셋
watch(
  () => props.battle,
  async (newBattle) => {
    processedLogCount = 0
    isAnimating = false

    if (newBattle && process.client) {
      // 새 전투 시작 시 Phaser 재초기화
      await new Promise(resolve => setTimeout(resolve, 100))
      destroyGame()
      await initGame('phaser-battle-container')
      startBattle(
        newBattle.attacker.generals,
        newBattle.defender.generals
      )
      console.log('Battle restarted')
    }
  }
)
</script>
