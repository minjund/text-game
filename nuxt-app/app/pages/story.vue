<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
    <!-- 스토리 진행 화면 -->
    <div v-if="gameState === 'story'" class="min-h-screen p-4 sm:p-6 md:p-8 lg:p-10">
      <div class="max-w-[1000px] mx-auto w-full">
        <!-- 텍스트 디스플레이 -->
        <div class="bg-slate-800/80 backdrop-blur-xl border-2 border-slate-600/20 rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 mb-6 md:mb-8 min-h-[250px] md:min-h-[300px]">
          <div
            v-for="(text, index) in visibleTexts"
            :key="index"
            class="text-base sm:text-lg md:text-xl leading-relaxed mb-4 md:mb-5"
            :class="isDialogue(text) ? 'text-slate-400 italic' : 'text-slate-200'"
          >
            <span v-if="index < typedLines">{{ text }}</span>
            <span v-else-if="index === typedLines">{{ currentLineTypedText }}</span>
          </div>
        </div>

        <!-- 선택지 버튼 (choice_intro 또는 reward 챕터에서만) -->
        <div v-if="showPathChoices" class="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 mt-6 md:mt-8">
          <button
            v-for="path in availablePaths"
            :key="path.id"
            @click="selectPathFromStory(path.id)"
            class="px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 bg-slate-800/80 backdrop-blur-xl border-2 border-amber-500/50 rounded-lg md:rounded-xl text-amber-400 font-bold text-base sm:text-lg cursor-pointer transition-all hover:bg-amber-400/20 hover:border-amber-400/80 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:translate-y-[-4px] active:translate-y-[-2px] flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-center"
          >
            {{ path.icon }} {{ path.name }}
          </button>
        </div>

        <!-- 세부 선택지 버튼 (각 장소 내부 선택) -->
        <div v-else-if="showLocationChoices" class="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 mt-6 md:mt-8">
          <button
            v-for="choice in locationChoices"
            :key="choice.id"
            @click="selectLocationChoice(choice.id)"
            class="flex flex-col items-stretch w-full sm:min-w-[250px] sm:max-w-[300px] px-4 py-4 sm:px-5 sm:py-5 gap-2 sm:gap-3 bg-slate-800/80 backdrop-blur-xl border-2 border-amber-500/50 rounded-lg md:rounded-xl text-amber-400 font-bold cursor-pointer transition-all hover:bg-amber-400/20 hover:border-amber-400/80 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:translate-y-[-4px] active:translate-y-[-2px]"
          >
            <div class="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
              <span class="text-[28px] sm:text-[32px]">{{ choice.icon }}</span>
              <span class="font-bold text-amber-400">{{ choice.name }}</span>
            </div>
            <div class="text-xs sm:text-sm text-slate-300 font-normal text-left">{{ choice.description }}</div>
          </button>
        </div>

        <!-- 왕국 이름 입력 -->
        <div v-else-if="showNationNameInput" class="space-y-4 sm:space-y-6">
          <input
            v-model="localNationName"
            type="text"
            placeholder="왕국의 이름을 입력하세요..."
            class="w-full max-w-[600px] px-4 py-3 sm:px-6 sm:py-3.5 md:px-7 md:py-4 text-base sm:text-lg md:text-xl border-2 border-amber-400/30 rounded-lg md:rounded-xl bg-slate-800/60 text-slate-200 mx-auto mb-3 sm:mb-4 block transition-all focus:outline-none focus:border-amber-400/80 focus:shadow-[0_0_20px_rgba(251,191,36,0.3)] placeholder:text-slate-500"
            @keyup.enter="confirmNationName"
          />
          <div class="flex justify-center">
            <button
              @click="confirmNationName"
              class="w-full sm:w-auto px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 rounded-lg md:rounded-xl font-bold text-base sm:text-lg hover:translate-y-[-2px] hover:shadow-[0_8px_20px_rgba(251,191,36,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-[-1px]"
              :disabled="!localNationName.trim()"
            >
              확정하기
            </button>
          </div>
        </div>

        <!-- 5계명 선택 영역 (commandments 챕터에 도달했을 때만 표시) -->
        <div v-else-if="showCommandmentsSection && showNextHandle" ref="commandmentsSection" class="mt-12 sm:mt-16 md:mt-20 pt-8 sm:pt-10 border-t-2 border-amber-400/30">
          <div class="max-w-[1600px] mx-auto">
            <div class="max-w-[800px] mx-auto mb-10">
              <div class="flex justify-between items-center mb-2.5 gap-5 flex-col md:flex-row md:items-center">
                <span class="text-base font-semibold text-slate-300">선택된 계명: {{ localSelectedCommandments.length }} / 5 </span>
                <span class="text-base font-semibold text-slate-300">(선택에 따라 게임의 이벤트가 다르게 발생합니다.)</span>
                <button
                    v-if="rerollCount < maxRerolls"
                    @click="rerollCommandments"
                    class="px-4 py-2 bg-gradient-to-br from-violet-600 to-indigo-600 border-2 border-violet-600/50 rounded-lg text-white font-semibold text-sm cursor-pointer transition-all whitespace-nowrap hover:bg-gradient-to-br hover:from-violet-700 hover:to-indigo-700 hover:border-violet-600/80 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:translate-y-[-2px] w-full md:w-auto text-center"
                >
                  🎲 계명 다시 뽑기 ({{ maxRerolls - rerollCount }}번 남음)
                </button>
                <span v-else class="text-sm text-slate-500 italic">리롤 기회 사용됨</span>
              </div>
              <div class="h-3 bg-slate-800/80 rounded-md overflow-hidden border border-amber-400/30">
                <div class="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-[width] duration-300 shadow-[0_0_10px_rgba(251,191,36,0.6)]" :style="{ width: (localSelectedCommandments.length / 5 * 100) + '%' }"></div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              <div
                  v-for="commandment in availableCommandments"
                  :key="commandment.id"
                  class="bg-slate-800/60 backdrop-blur-xl rounded-xl p-4 border-2 transition-all relative"
                  :class="{
                  'border-amber-400/80 bg-amber-400/10 shadow-[0_0_30px_rgba(251,191,36,0.3)]': isSelected(commandment),
                  'opacity-40 cursor-not-allowed': !isSelected(commandment) && localSelectedCommandments.length >= 5,
                  'border-slate-600/20 hover:border-amber-400/50 hover:shadow-[0_4px_20px_rgba(251,191,36,0.15)]': !isSelected(commandment) && localSelectedCommandments.length < 5,
                  'bg-slate-800/80': expandedCommandments[commandment.id]
                }"
              >
                <!-- Compact Header -->
                <div class="flex items-center gap-2 cursor-pointer mb-2" @click.stop="toggleExpand(commandment.id)">
                  <span class="text-[28px] drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">{{ commandment.icon }}</span>
                  <h3 class="text-base font-bold text-slate-200 flex-1">{{ commandment.name }}</h3>
                  <div class="ml-auto flex items-center gap-2">
                    <div v-if="isSelected(commandment)" class="w-5 h-5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-[0_2px_8px_rgba(16,185,129,0.5)]">✓</div>
                    <span class="text-xs text-slate-300 transition-transform duration-300" :class="{ 'rotate-180': expandedCommandments[commandment.id] }">▼</span>
                  </div>
                </div>

                <!-- Collapsed View -->
                <div v-if="!expandedCommandments[commandment.id]" class="mt-1">
                  <p class="text-xs text-slate-400 mb-2 leading-normal">{{ commandment.description.slice(0, 60) }}...</p>
                  <button
                      @click.stop="toggleCommandment(commandment)"
                      class="w-full px-3 py-1.5 bg-amber-400/20 border border-amber-400/40 rounded-md text-amber-400 font-semibold text-xs cursor-pointer transition-all hover:bg-amber-400/30 hover:border-amber-400/60 disabled:opacity-40 disabled:cursor-not-allowed"
                      :disabled="!isSelected(commandment) && localSelectedCommandments.length >= 5"
                  >
                    {{ isSelected(commandment) ? '✓ 선택됨' : '선택하기' }}
                  </button>
                </div>

                <!-- Expanded View -->
                <div v-else class="mt-1 animate-[slideDown_0.3s_ease]" @click.stop>
                  <p class="text-[13px] text-slate-400 mb-3 leading-relaxed">{{ commandment.description }}</p>

                  <div class="mb-3">
                    <div class="mb-3">
                      <h4 class="text-xs font-bold mb-1.5 flex items-center gap-1 text-emerald-400 before:content-['✓'] before:text-sm">장점</h4>
                      <ul class="list-none pl-0">
                        <li v-for="(pro, index) in commandment.pros" :key="index" class="text-xs py-0.5 pl-4 relative text-emerald-300 before:content-['•'] before:absolute before:left-2">
                          {{ pro }}
                        </li>
                      </ul>
                    </div>

                    <div class="mb-3">
                      <h4 class="text-xs font-bold mb-1.5 flex items-center gap-1 text-red-500 before:content-['✗'] before:text-sm">단점</h4>
                      <ul class="list-none pl-0">
                        <li v-for="(con, index) in commandment.cons" :key="index" class="text-xs py-0.5 pl-4 relative text-red-300 before:content-['•'] before:absolute before:left-2">
                          {{ con }}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-1.5">
                    <div v-if="commandment.effects.morale !== 0" class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold" :class="commandment.effects.morale > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'">
                      민심: {{ commandment.effects.morale > 0 ? '+' : '' }}{{ commandment.effects.morale }}
                    </div>
                    <div v-if="commandment.effects.gold !== 0" class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold" :class="commandment.effects.gold > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'">
                      금: {{ commandment.effects.gold > 0 ? '+' : '' }}{{ commandment.effects.gold }}
                    </div>
                    <div v-if="commandment.effects.military !== 0" class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold" :class="commandment.effects.military > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'">
                      군사: {{ commandment.effects.military > 0 ? '+' : '' }}{{ commandment.effects.military }}
                    </div>
                    <div v-if="commandment.effects.food !== 0" class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold" :class="commandment.effects.food > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'">
                      식량: {{ commandment.effects.food > 0 ? '+' : '' }}{{ commandment.effects.food }}
                    </div>
                    <div v-if="commandment.effects.population !== 0" class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold" :class="commandment.effects.population > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'">
                      인구: {{ commandment.effects.population > 0 ? '+' : '' }}{{ commandment.effects.population }}
                    </div>
                  </div>

                  <button
                      @click.stop="toggleCommandment(commandment)"
                      class="w-full px-4 py-2 bg-gradient-to-br from-amber-400 to-amber-500 border-0 rounded-lg text-slate-800 font-bold text-[13px] cursor-pointer transition-all mt-2.5 hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(251,191,36,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
                      :disabled="!isSelected(commandment) && localSelectedCommandments.length >= 5"
                  >
                    {{ isSelected(commandment) ? '✓ 선택 해제' : '이 계명 선택하기' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="text-center px-4">
              <button
                  @click="confirmCommandments"
                  class="w-full sm:w-auto px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 rounded-lg md:rounded-xl font-bold text-base sm:text-lg hover:translate-y-[-2px] hover:shadow-[0_8px_20px_rgba(251,191,36,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-[-1px]"
                  :disabled="localSelectedCommandments.length !== 5"
              >
                <span class="mr-2">⚡</span>
                계명 확정하기
              </button>
            </div>
          </div>
        </div>

        <!-- 일반 컨트롤 버튼 -->
        <div v-else-if="showNextHandle" class="flex justify-center sm:justify-end items-center">
          <button
            @click="handleNext"
            class="w-full sm:w-auto px-8 py-3 sm:px-9 sm:py-3.5 md:px-10 md:py-3.5 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 rounded-lg md:rounded-xl font-bold text-base sm:text-lg hover:translate-y-[-2px] hover:shadow-[0_8px_20px_rgba(251,191,36,0.4)] transition-all active:translate-y-[-1px]"
          >
            다음 →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import { tutorialStory } from '~/data/tutorialStory'
import { AVAILABLE_COMMANDMENTS, type Commandment } from '~/types/god-game'
import { type PassiveCard } from '~/types/passive-cards'
import { useGodGame } from '~/composables/useGodGame'

const router = useRouter()
const { setNationName, setSelectedCommandments, setStartCards, initializeNation } = useGodGame()

// 게임 상태
type GameState = 'start' | 'story' | 'cards'
const gameState = ref<GameState>('story')

onMounted(() => {
  setTimeout(() => {
    typeText()
  }, 100)
})

// 스토리 상태
const currentChapterIndex = ref(0)

// 계명 섹션 ref
const commandmentsSection = ref<HTMLElement | null>(null)

// 타이핑 애니메이션 상태
const typedLines = ref(0) // 완전히 타이핑된 줄 수
const currentLineTypedText = ref('') // 현재 줄에서 타이핑된 텍스트
const isTyping = ref(false)
let typingTimer: NodeJS.Timeout | null = null

// 왕국 이름
const localNationName = ref('')

// 경로 추적
const visitedPaths = ref<string[]>([]) // 방문한 경로들

// 계명 선택
const availableCommandments = ref<Commandment[]>([])
const localSelectedCommandments = ref<Commandment[]>([])
const expandedCommandments = ref<Record<string, boolean>>({})
const rerollCount = ref(0) // 리롤 횟수
const maxRerolls = 1 // 최대 리롤 횟수

// 랜덤으로 6개의 계명 선택
const selectRandomCommandments = () => {
  const shuffled = [...AVAILABLE_COMMANDMENTS].sort(() => Math.random() - 0.5)
  availableCommandments.value = shuffled.slice(0, 6)
}

// 초기 계명 6개 선택
selectRandomCommandments()

// 카드 선택
const availableStartCards = ref<PassiveCard[]>([])
const selectedStartCards = ref<PassiveCard[]>([])

// 선택지 표시 여부
const showPathChoices = computed(() => {
  const chapterId = currentChapter.value?.id
  return (chapterId === 'choice_intro' || chapterId?.endsWith('_reward')) &&
         visitedPaths.value.length < 3
})

// 세부 선택지 표시 여부 (각 장소 내부 선택)
const showLocationChoices = computed(() => {
  const chapterId = currentChapter.value?.id
  return chapterId === 'path_admin_choice' ||
          chapterId === 'path_military_choice' ||
          chapterId === 'path_market_choice'
})

// 왕국 이름 입력 표시 여부 (chapter6에서만)
const showNationNameInput = computed(() => {
  const chapterId = currentChapter.value?.id
  return chapterId === 'chapter5'
})

// 계명 선택 섹션 표시 여부 (commandments 챕터에 도달했을 때)
const showCommandmentsSection = computed(() => {
  const chapterId = currentChapter.value?.id
  return chapterId === 'commandments'
})

// 사용 가능한 경로
const availablePaths = computed(() => {
  const allPaths = [
    { id: 'admin', name: '행정실', icon: '📜' },
    { id: 'military', name: '훈련장', icon: '⚔️' },
    { id: 'market', name: '시장', icon: '🏪' }
  ]

  return allPaths.filter(path => !visitedPaths.value.includes(path.id))
})

// 각 장소별 세부 선택지
const locationChoices = computed(() => {
  const chapterId = currentChapter.value?.id

  if (chapterId === 'path_admin_choice') {
    return [
      { id: 'tax', name: '재정 개혁', icon: '💰', description: '세금 체계를 정비합니다' },
      { id: 'trade', name: '무역 확대', icon: '🚢', description: '해상 무역로를 개척합니다' }
    ]
  } else if (chapterId === 'path_military_choice') {
    return [
      { id: 'infantry', name: '보병 강화', icon: '🛡️', description: '중장보병을 육성합니다' },
      { id: 'cavalry', name: '기병 육성', icon: '🐎', description: '경기병을 훈련시킵니다' }
    ]
  } else if (chapterId === 'path_market_choice') {
    return [
      { id: 'festival', name: '축제 개최', icon: '🎉', description: '백성들에게 즐거움을 줍니다' },
      { id: 'farm', name: '농업 지원', icon: '🌾', description: '농사를 도와줍니다' }
    ]
  }

  return []
})

// Computed
const currentChapter = computed(() => tutorialStory[currentChapterIndex.value])
const currentTexts = computed(() => {
  const chapter = currentChapter.value
  if (!chapter) return []

  // 왕국 이름을 스토리에 동적으로 반영
  if (localNationName.value && chapter.texts) {
    return chapter.texts.map(text =>
      text.replace(/엘드벨/g, localNationName.value)
    )
  }

  return chapter.texts || []
})

// 챕터의 모든 텍스트 표시
const visibleTexts = computed(() => {
  return currentTexts.value
})

const isLastChapter = computed(() => currentChapterIndex.value >= tutorialStory.length - 1)

// 대사 체크
const isDialogue = (text: string): boolean => {
  return text.startsWith("'") || text.startsWith('"')
}

// 타이핑 애니메이션
const typeText = () => {
  if (typingTimer) {
    clearTimeout(typingTimer)
    typingTimer = null
  }

  typedLines.value = 0
  currentLineTypedText.value = ''
  isTyping.value = true

  const texts = currentTexts.value
  if (texts.length === 0) {
    isTyping.value = false
    return
  }

  let currentLine = 0
  let currentChar = 0

  const typeNextChar = () => {
    if (currentLine >= texts.length) {
      isTyping.value = false
      return
    }

    const currentText = texts[currentLine]

    if (currentChar < currentText.length) {
      currentLineTypedText.value = currentText.substring(0, currentChar + 1)
      currentChar++
      typingTimer = setTimeout(typeNextChar, 10)
    } else {
      // 현재 줄 완료
      typedLines.value = currentLine + 1
      currentLineTypedText.value = ''
      currentLine++
      currentChar = 0

      if (currentLine < texts.length) {
        typingTimer = setTimeout(typeNextChar, 100) // 줄 바꿈 시 짧은 대기
      } else {
        isTyping.value = false
      }
    }
  }

  typeNextChar()
}



// 타이핑 즉시 완료
const completeTyping = () => {
  if (typingTimer) {
    clearTimeout(typingTimer)
    typingTimer = null
  }
  typedLines.value = currentTexts.value.length
  currentLineTypedText.value = ''
  isTyping.value = false
}

// 챕터 변경 감지
watch(currentChapterIndex, () => {
  typeText()
})

const showNextHandle = computed(() => {
  return !isTyping.value
})

// 다음 버튼 핸들러
const handleNext = () => {
  // 타이핑 중이면 즉시 완료
  if (isTyping.value) {
    completeTyping()
    return
  }

  const chapterId = currentChapter.value?.id

  if (chapterId === 'commandments') {
    // 계명 섹션으로 스크롤
    setTimeout(() => {
      commandmentsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return
  } else if (chapterId === 'choice_intro') {
    // choice_intro 끝나면 선택지 대기 (showPathChoices가 true가 됨)
    return
  } else if (chapterId === 'path_admin_tax' || chapterId === 'path_admin_trade' ||
             chapterId === 'path_military_infantry' || chapterId === 'path_military_cavalry' ||
             chapterId === 'path_market_festival' || chapterId === 'path_market_farm') {
    // 세부 선택 완료 후 다시 장소 선택으로 또는 epilogue로
    if (visitedPaths.value.length >= 3) {
      // 3개 다 방문했으면 epilogue로
      const epilogueIndex = tutorialStory.findIndex(ch => ch.id === 'epilogue')
      if (epilogueIndex !== -1) {
        currentChapterIndex.value = epilogueIndex
      }
    } else {
      // 아직 방문할 곳이 남았으면 choice_intro로
      const choiceIntroIndex = tutorialStory.findIndex(ch => ch.id === 'choice_intro')
      if (choiceIntroIndex !== -1) {
        currentChapterIndex.value = choiceIntroIndex
      }
    }
    return
  } else if (chapterId === 'epilogue') {
    // epilogue 끝나면 게임 시작
    startActualGame()
    return
  }

  // 다음 챕터로
  if (!isLastChapter.value) {
    currentChapterIndex.value++
  }
}

// 게임 시작
const startStory = () => {
  gameState.value = 'story'
  // 첫 챕터 타이핑 시작
  setTimeout(() => {
    typeText()
  }, 100)
}

// 스토리 중 경로 선택
const selectPathFromStory = async (pathId: string) => {
  // 방문 기록 추가
  visitedPaths.value.push(pathId)

  // 해당 경로의 첫 챕터 찾기
  const pathChapters: Record<string, number> = {
    admin: tutorialStory.findIndex(ch => ch.id === 'path_admin_1'),
    military: tutorialStory.findIndex(ch => ch.id === 'path_military_1'),
    market: tutorialStory.findIndex(ch => ch.id === 'path_market_1')
  }

  const chapterIndex = pathChapters[pathId]
  if (chapterIndex !== -1) {
    currentChapterIndex.value = chapterIndex
  }
}

// 세부 선택지 선택 (각 장소 내부 선택)
const selectLocationChoice = async (choiceId: string) => {
  const chapterId = currentChapter.value?.id
  let targetChapterId = ''
  let pathType = ''

  // 현재 장소와 선택에 따라 타겟 챕터 결정
  if (chapterId === 'path_admin_choice') {
    pathType = 'admin'
    targetChapterId = choiceId === 'tax' ? 'path_admin_tax' : 'path_admin_trade'
  } else if (chapterId === 'path_military_choice') {
    pathType = 'military'
    targetChapterId = choiceId === 'infantry' ? 'path_military_infantry' : 'path_military_cavalry'
  } else if (chapterId === 'path_market_choice') {
    pathType = 'market'
    targetChapterId = choiceId === 'festival' ? 'path_market_festival' : 'path_market_farm'
  }

  // 선택에 따라 특정 카드 지급
  const receivedCard = await getCardForChoice(pathType, choiceId)
  selectedStartCards.value.push(receivedCard)

  // 해당 챕터로 이동
  const targetChapterIndex = tutorialStory.findIndex(ch => ch.id === targetChapterId)
  if (targetChapterIndex !== -1) {
    currentChapterIndex.value = targetChapterIndex
  }
}

// 선택에 따라 특정 카드 지급 (일반 등급만, 좋은 카드 or 꽝 카드)
const getCardForChoice = async (pathType: string, choiceId: string): Promise<PassiveCard> => {
  const { PASSIVE_CARDS } = await import('~/types/passive-cards')

  let filteredCards: PassiveCard[] = []

  // 행정실 선택
  if (pathType === 'admin') {
    if (choiceId === 'tax') {
      // 재정 개혁: 좋은 선택 - 금 생산 증가 카드 (일반 등급)
      filteredCards = PASSIVE_CARDS.filter(card =>
        card.rarity === 'common' &&
        card.effect.gold && card.effect.gold > 0
      )
    } else {
      // 무역 확대: 꽝 선택 - 효과 없거나 약한 카드
      filteredCards = PASSIVE_CARDS.filter(card =>
        card.rarity === 'common' &&
        (!card.effect.gold || card.effect.gold <= 0) &&
        (!card.effect.food || card.effect.food <= 0) &&
        (!card.effect.military || card.effect.military <= 0)
      )
    }
  }
  // 훈련장 선택
  else if (pathType === 'military') {
    if (choiceId === 'infantry') {
      // 보병 강화: 좋은 선택 - 방어/군사력 증가 카드 (일반 등급)
      filteredCards = PASSIVE_CARDS.filter(card =>
        card.rarity === 'common' &&
        ((card.effect.defenseBonus && card.effect.defenseBonus > 0) ||
         (card.effect.military && card.effect.military > 0))
      )
    } else {
      // 기병 육성: 꽝 선택 - 효과 없거나 약한 카드
      filteredCards = PASSIVE_CARDS.filter(card =>
        card.rarity === 'common' &&
        (!card.effect.attackBonus || card.effect.attackBonus <= 0) &&
        (!card.effect.defenseBonus || card.effect.defenseBonus <= 0) &&
        (!card.effect.military || card.effect.military <= 0)
      )
    }
  }
  // 시장 선택
  else if (pathType === 'market') {
    if (choiceId === 'festival') {
      // 축제 개최: 꽝 선택 - 효과 없거나 약한 카드
      filteredCards = PASSIVE_CARDS.filter(card =>
        card.rarity === 'common' &&
        (!card.effect.morale || card.effect.morale <= 0) &&
        (!card.effect.population || card.effect.population <= 0)
      )
    } else {
      // 농업 지원: 좋은 선택 - 식량 증가 카드 (일반 등급)
      filteredCards = PASSIVE_CARDS.filter(card =>
        card.rarity === 'common' &&
        card.effect.food && card.effect.food > 0
      )
    }
  }

  // 이미 선택한 카드는 제외
  filteredCards = filteredCards.filter(c =>
    !selectedStartCards.value.some(sc => sc.id === c.id)
  )

  // 랜덤으로 1개 선택
  if (filteredCards.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredCards.length)
    return filteredCards[randomIndex]!
  }

  // 만약 사용 가능한 카드가 없으면 일반 등급 카드에서 랜덤 선택
  const commonCards = PASSIVE_CARDS.filter(card => card.rarity === 'common')
  const randomIndex = Math.floor(Math.random() * commonCards.length)
  return commonCards[randomIndex]!
}

// 실제 게임 시작
const startActualGame = () => {
  // 전역 상태에 저장
  setNationName(localNationName.value)
  setSelectedCommandments(localSelectedCommandments.value)
  setStartCards(selectedStartCards.value)
  initializeNation()

  // 게임 페이지로 이동
  router.push('/game')
}

// 왕국 이름 확정
const confirmNationName = () => {
  if (!localNationName.value.trim()) return

  // 다음 챕터로 (chapter7)
  const findIndex = tutorialStory.findIndex(ch => ch.id === 'chapter6')
  if (findIndex !== -1) {
    currentChapterIndex.value = findIndex
  }
}

// 계명 리롤
const rerollCommandments = () => {
  if (rerollCount.value >= maxRerolls) return

  rerollCount.value++
  localSelectedCommandments.value = [] // 선택 초기화
  selectRandomCommandments()
}

// 계명 토글
const toggleExpand = (commandmentId: string) => {
  expandedCommandments.value[commandmentId] = !expandedCommandments.value[commandmentId]
}

const toggleCommandment = (commandment: Commandment) => {
  const index = localSelectedCommandments.value.findIndex(c => c.id === commandment.id)
  if (index > -1) {
    localSelectedCommandments.value.splice(index, 1)
  } else if (localSelectedCommandments.value.length < 5) {
    localSelectedCommandments.value.push(commandment)
  }
}

const isSelected = (commandment: Commandment) => {
  return localSelectedCommandments.value.some(c => c.id === commandment.id)
}

// 계명 확정
const confirmCommandments = () => {
  if (localSelectedCommandments.value.length !== 5) return

  // 다음 챕터로 (chapter8)
  const findIndex = tutorialStory.findIndex(ch => ch.id === 'chapter8')
  if (findIndex !== -1) {
    currentChapterIndex.value = findIndex
  }

  // 스토리 상단으로 스크롤
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 100)
}

// 카드 선택
const toggleCard = (card: PassiveCard) => {
  if (isCardSelected(card.id)) {
    selectedStartCards.value = selectedStartCards.value.filter(c => c.id !== card.id)
  } else if (selectedStartCards.value.length < 3) {
    selectedStartCards.value.push(card)
  }
}

const isCardSelected = (cardId: string) => {
  return selectedStartCards.value.some(c => c.id === cardId)
}

const getRarityLabel = (rarity: string): string => {
  const labels: Record<string, string> = {
    common: '일반',
    rare: '희귀',
    epic: '영웅',
    legendary: '전설'
  }
  return labels[rarity] || rarity
}

// 게임 시작
const startGame = () => {
  if (selectedStartCards.value.length !== 3) return

  // 전역 상태에 저장
  setNationName(localNationName.value)
  setSelectedCommandments(localSelectedCommandments.value)
  setStartCards(selectedStartCards.value)
  initializeNation()

  // 게임 페이지로 이동
  router.push('/game')
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
