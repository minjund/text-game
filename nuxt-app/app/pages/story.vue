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

            <!-- 선택한 계명의 일일 효과 합산 표시 -->
            <div v-if="localSelectedCommandments.length > 0" class="max-w-[800px] mx-auto mb-8 p-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-xl border-2 border-indigo-500/50 rounded-xl">
              <h3 class="text-lg font-bold text-indigo-200 mb-4 flex items-center gap-2">
                <span>📊</span> 매일 변화되는 수치 (합산)
              </h3>
              <div class="flex flex-wrap gap-2">
                <div v-if="totalDailyEffects.morale !== 0" class="px-4 py-2 rounded-lg text-sm font-semibold" :class="totalDailyEffects.morale > 0 ? 'bg-emerald-500/30 text-emerald-200 border-2 border-emerald-500/50' : 'bg-red-500/30 text-red-200 border-2 border-red-500/50'">
                  민심: {{ totalDailyEffects.morale > 0 ? '+' : '' }}{{ totalDailyEffects.morale }} /일
                </div>
                <div v-if="totalDailyEffects.gold !== 0" class="px-4 py-2 rounded-lg text-sm font-semibold" :class="totalDailyEffects.gold > 0 ? 'bg-emerald-500/30 text-emerald-200 border-2 border-emerald-500/50' : 'bg-red-500/30 text-red-200 border-2 border-red-500/50'">
                  금: {{ totalDailyEffects.gold > 0 ? '+' : '' }}{{ totalDailyEffects.gold }} /일
                </div>
                <div v-if="totalDailyEffects.military !== 0" class="px-4 py-2 rounded-lg text-sm font-semibold" :class="totalDailyEffects.military > 0 ? 'bg-emerald-500/30 text-emerald-200 border-2 border-emerald-500/50' : 'bg-red-500/30 text-red-200 border-2 border-red-500/50'">
                  병력: {{ totalDailyEffects.military > 0 ? '+' : '' }}{{ totalDailyEffects.military }} /일
                </div>
                <div v-if="totalDailyEffects.food !== 0" class="px-4 py-2 rounded-lg text-sm font-semibold" :class="totalDailyEffects.food > 0 ? 'bg-emerald-500/30 text-emerald-200 border-2 border-emerald-500/50' : 'bg-red-500/30 text-red-200 border-2 border-red-500/50'">
                  식량: {{ totalDailyEffects.food > 0 ? '+' : '' }}{{ totalDailyEffects.food }} /일
                </div>
                <div v-if="totalDailyEffects.population !== 0" class="px-4 py-2 rounded-lg text-sm font-semibold" :class="totalDailyEffects.population > 0 ? 'bg-emerald-500/30 text-emerald-200 border-2 border-emerald-500/50' : 'bg-red-500/30 text-red-200 border-2 border-red-500/50'">
                  인구: {{ totalDailyEffects.population > 0 ? '+' : '' }}{{ totalDailyEffects.population }} /일
                </div>
              </div>
              <p class="text-xs text-indigo-300/70 mt-3">* 다음 날을 누를 때마다 위 수치만큼 변화합니다</p>
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
const selectedPath = ref<string>('') // 선택한 경로
const eventCount = ref(0) // 현재 경로에서 획득한 이벤트 카드 수

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
  return chapterId === 'choice_intro'
})

// 세부 선택지 표시 여부 (각 이벤트 선택)
const showLocationChoices = computed(() => {
  const chapterId = currentChapter.value?.id
  return chapterId === 'path_admin_choice_1' ||
          chapterId === 'path_admin_choice_2' ||
          chapterId === 'path_admin_choice_3' ||
          chapterId === 'path_military_choice_1' ||
          chapterId === 'path_military_choice_2' ||
          chapterId === 'path_military_choice_3' ||
          chapterId === 'path_market_choice_1' ||
          chapterId === 'path_market_choice_2' ||
          chapterId === 'path_market_choice_3'
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
  return [
    { id: 'admin', name: '행정실', icon: '📜' },
    { id: 'military', name: '훈련장', icon: '⚔️' },
    { id: 'market', name: '시장', icon: '🏪' }
  ]
})

// 각 이벤트별 선택지
const locationChoices = computed(() => {
  const chapterId = currentChapter.value?.id

  // 행정실 이벤트들
  if (chapterId === 'path_admin_choice_1') {
    return [
      { id: 'success', name: '장부를 먼저 치운다', icon: '📚', description: '재빨리 장부를 들어올린다' },
      { id: 'fail', name: '잉크병을 잡는다', icon: '🖋️', description: '잉크병을 잡으려 한다' }
    ]
  } else if (chapterId === 'path_admin_choice_2') {
    return [
      { id: 'success', name: '조심스럽게 털어낸다', icon: '✨', description: '천천히 먼지를 털어낸다' },
      { id: 'fail', name: '빠르게 뒤적인다', icon: '💨', description: '급하게 상자를 뒤진다' }
    ]
  } else if (chapterId === 'path_admin_choice_3') {
    return [
      { id: 'success', name: '서기관 말에 집중', icon: '👂', description: '조언에 귀를 기울인다' },
      { id: 'fail', name: '찻잔을 잡는다', icon: '☕', description: '황급히 찻잔을 잡는다' }
    ]
  }
  // 훈련장 이벤트들
  else if (chapterId === 'path_military_choice_1') {
    return [
      { id: 'success', name: '자루를 잡는다', icon: '⚔️', description: '검날을 피하고 자루를 잡는다' },
      { id: 'fail', name: '검날을 잡는다', icon: '🩸', description: '검날을 잡으려 한다' }
    ]
  } else if (chapterId === 'path_military_choice_2') {
    return [
      { id: 'success', name: '균형을 잡는다', icon: '🛡️', description: '중심을 낮추고 버틴다' },
      { id: 'fail', name: '그냥 넘어진다', icon: '💥', description: '진흙에 그대로 넘어진다' }
    ]
  } else if (chapterId === 'path_military_choice_3') {
    return [
      { id: 'success', name: '말에 집중한다', icon: '🐎', description: '고삐를 잡고 말을 진정시킨다' },
      { id: 'fail', name: '떨어진 것을 본다', icon: '👀', description: '바닥의 물건을 본다' }
    ]
  }
  // 시장 이벤트들
  else if (chapterId === 'path_market_choice_1') {
    return [
      { id: 'success', name: '빨리 줍는다', icon: '🍎', description: '재빨리 사과를 줍는다' },
      { id: 'fail', name: '천천히 줍는다', icon: '🥀', description: '천천히 사과를 줍는다' }
    ]
  } else if (chapterId === 'path_market_choice_2') {
    return [
      { id: 'success', name: '참는다', icon: '🍞', description: '뜨거움을 참고 견딘다' },
      { id: 'fail', name: '떨어뜨린다', icon: '🔥', description: '너무 뜨거워 떨어뜨린다' }
    ]
  } else if (chapterId === 'path_market_choice_3') {
    return [
      { id: 'success', name: '금화를 잡는다', icon: '💰', description: '금화 주머니를 잡는다' },
      { id: 'fail', name: '땅에 넘어진다', icon: '💨', description: '그냥 땅바닥에 넘어진다' }
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
  } else if (chapterId === 'path_admin_event_1_success' || chapterId === 'path_admin_event_1_fail' ||
             chapterId === 'path_admin_event_2_success' || chapterId === 'path_admin_event_2_fail' ||
             chapterId === 'path_admin_event_3_success' || chapterId === 'path_admin_event_3_fail' ||
             chapterId === 'path_military_event_1_success' || chapterId === 'path_military_event_1_fail' ||
             chapterId === 'path_military_event_2_success' || chapterId === 'path_military_event_2_fail' ||
             chapterId === 'path_military_event_3_success' || chapterId === 'path_military_event_3_fail' ||
             chapterId === 'path_market_event_1_success' || chapterId === 'path_market_event_1_fail' ||
             chapterId === 'path_market_event_2_success' || chapterId === 'path_market_event_2_fail' ||
             chapterId === 'path_market_event_3_success' || chapterId === 'path_market_event_3_fail') {
    // 이벤트 완료 후
    if (eventCount.value >= 3) {
      // 3개 이벤트 다 완료했으면 epilogue로
      const epilogueIndex = tutorialStory.findIndex(ch => ch.id === 'epilogue')
      if (epilogueIndex !== -1) {
        currentChapterIndex.value = epilogueIndex
      }
    } else {
      // 아직 이벤트가 남았으면 다음 챕터로 진행
      if (!isLastChapter.value) {
        currentChapterIndex.value++
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

// 스토리 중 경로 선택
const selectPathFromStory = async (pathId: string) => {
  // 선택한 경로 저장
  selectedPath.value = pathId
  eventCount.value = 0

  // 해당 경로의 첫 챕터 찾기
  const pathChapters: Record<string, number> = {
    admin: tutorialStory.findIndex(ch => ch.id === 'path_admin_1'),
    military: tutorialStory.findIndex(ch => ch.id === 'path_military_1'),
    market: tutorialStory.findIndex(ch => ch.id === 'path_market_1')
  }

  const chapterIndex = pathChapters[pathId]
  if (chapterIndex !== undefined && chapterIndex !== -1) {
    currentChapterIndex.value = chapterIndex
  }
}

// 이벤트 선택지 선택 (성공/실패)
const selectLocationChoice = async (choiceId: string) => {
  const chapterId = currentChapter.value?.id
  let targetChapterId = ''

  // 현재 이벤트와 선택에 따라 타겟 챕터 결정
  if (chapterId === 'path_admin_choice_1') {
    targetChapterId = choiceId === 'success' ? 'path_admin_event_1_success' : 'path_admin_event_1_fail'
  } else if (chapterId === 'path_admin_choice_2') {
    targetChapterId = choiceId === 'success' ? 'path_admin_event_2_success' : 'path_admin_event_2_fail'
  } else if (chapterId === 'path_admin_choice_3') {
    targetChapterId = choiceId === 'success' ? 'path_admin_event_3_success' : 'path_admin_event_3_fail'
  } else if (chapterId === 'path_military_choice_1') {
    targetChapterId = choiceId === 'success' ? 'path_military_event_1_success' : 'path_military_event_1_fail'
  } else if (chapterId === 'path_military_choice_2') {
    targetChapterId = choiceId === 'success' ? 'path_military_event_2_success' : 'path_military_event_2_fail'
  } else if (chapterId === 'path_military_choice_3') {
    targetChapterId = choiceId === 'success' ? 'path_military_event_3_success' : 'path_military_event_3_fail'
  } else if (chapterId === 'path_market_choice_1') {
    targetChapterId = choiceId === 'success' ? 'path_market_event_1_success' : 'path_market_event_1_fail'
  } else if (chapterId === 'path_market_choice_2') {
    targetChapterId = choiceId === 'success' ? 'path_market_event_2_success' : 'path_market_event_2_fail'
  } else if (chapterId === 'path_market_choice_3') {
    targetChapterId = choiceId === 'success' ? 'path_market_event_3_success' : 'path_market_event_3_fail'
  }

  // 선택에 따라 카드 지급
  const eventNumber = eventCount.value + 1
  const receivedCard = await getCardForChoice(selectedPath.value, eventNumber, choiceId === 'success')
  selectedStartCards.value.push(receivedCard)
  eventCount.value++

  // 해당 챕터로 이동
  const targetChapterIndex = tutorialStory.findIndex(ch => ch.id === targetChapterId)
  if (targetChapterIndex !== -1) {
    currentChapterIndex.value = targetChapterIndex
  }
}

// 선택에 따라 시나리오 맞춤 카드 생성
const getCardForChoice = async (pathType: string, eventNumber: number, isSuccess: boolean): Promise<PassiveCard> => {
  // 시나리오에 맞는 커스텀 카드 생성
  const cardData: Record<string, Record<number, { success: PassiveCard, fail: PassiveCard }>> = {
    admin: {
      1: {
        success: {
          id: 'admin_1_success',
          name: '깔끔한 재정 장부',
          description: '장부를 잘 보존했다. 오래된 금융 지혜가 담겨있다.',
          rarity: 'common',
          icon: '📚',
          image: '📚',
          trigger: 'daily',
          effect: { type: 'resource', gold: 5 }
        },
        fail: {
          id: 'admin_1_fail',
          name: '얼룩진 종이 조각',
          description: '잉크가 번져서 읽을 수 없다. 아무 쓸모가 없다.',
          rarity: 'common',
          icon: '🖋️',
          image: '🖋️',
          trigger: 'daily',
          effect: { type: 'special' }
        }
      },
      2: {
        success: {
          id: 'admin_2_success',
          name: '고대의 금화',
          description: '먼지를 털어내고 발견한 선왕의 비상금. 반짝이는 보물이다.',
          rarity: 'common',
          icon: '💰',
          image: '💰',
          trigger: 'daily',
          effect: { type: 'resource', gold: 8 }
        },
        fail: {
          id: 'admin_2_fail',
          name: '먼지투성이 빈 상자',
          description: '급하게 뒤적이다 먼지만 뒤집어썼다. 상자는 비어있다.',
          rarity: 'common',
          icon: '📦',
          image: '📦',
          trigger: 'daily',
          effect: { type: 'special' }
        }
      },
      3: {
        success: {
          id: 'admin_3_success',
          name: '서기관의 조언서',
          description: '서기관의 지혜가 담긴 기록. 세금 징수의 비법이 적혀있다.',
          rarity: 'common',
          icon: '📜',
          image: '📜',
          trigger: 'daily',
          effect: { type: 'resource', gold: 6 }
        },
        fail: {
          id: 'admin_3_fail',
          name: '깨진 찻잔 조각',
          description: '찻잔만 깨뜨리고 조언은 놓쳤다. 쓸모없는 도자기 파편이다.',
          rarity: 'common',
          icon: '☕',
          image: '☕',
          trigger: 'daily',
          effect: { type: 'special' }
        }
      }
    },
    military: {
      1: {
        success: {
          id: 'military_1_success',
          name: '날카로운 강철검',
          description: '검을 능숙하게 다뤘다. 전투에서 큰 힘이 될 것이다.',
          rarity: 'common',
          icon: '⚔️',
          image: '⚔️',
          trigger: 'battle_start',
          effect: { type: 'combat', attackBonus: 10 }
        },
        fail: {
          id: 'military_1_fail',
          name: '부러진 검자루',
          description: '검날에 손을 베이고 검은 부러졌다. 무기로 쓸 수 없다.',
          rarity: 'common',
          icon: '🪓',
          image: '🪓',
          trigger: 'battle_start',
          effect: { type: 'special' }
        }
      },
      2: {
        success: {
          id: 'military_2_success',
          name: '빛나는 강철 갑옷',
          description: '균형을 잡아 갑옷이 빛난다. 방어력이 크게 증가한다.',
          rarity: 'common',
          icon: '🛡️',
          image: '🛡️',
          trigger: 'battle_start',
          effect: { type: 'combat', defenseBonus: 10 }
        },
        fail: {
          id: 'military_2_fail',
          name: '진흙 묻은 낡은 갑옷',
          description: '진흙탕에 넘어져 갑옷이 엉망이다. 제대로 된 방어력이 없다.',
          rarity: 'common',
          icon: '💩',
          image: '💩',
          trigger: 'battle_start',
          effect: { type: 'special' }
        }
      },
      3: {
        success: {
          id: 'military_3_success',
          name: '기병의 긴 창',
          description: '말을 능숙하게 다뤘다. 적진을 꿰뚫을 강력한 무기다.',
          rarity: 'common',
          icon: '🏇',
          image: '🏇',
          trigger: 'battle_start',
          effect: { type: 'combat', attackBonus: 12 }
        },
        fail: {
          id: 'military_3_fail',
          name: '말똥 묻은 누더기',
          description: '말에서 떨어져 말똥에 빠졌다. 악취만 진동한다.',
          rarity: 'common',
          icon: '💩',
          image: '💩',
          trigger: 'battle_start',
          effect: { type: 'special' }
        }
      }
    },
    market: {
      1: {
        success: {
          id: 'market_1_success',
          name: '신선한 빨간 사과',
          description: '재빨리 주워 상하지 않았다. 건강과 활력이 느껴진다.',
          rarity: 'common',
          icon: '🍎',
          image: '🍎',
          trigger: 'daily',
          effect: { type: 'resource', food: 5 }
        },
        fail: {
          id: 'market_1_fail',
          name: '짓눌린 썩은 사과',
          description: '사람들에게 밟혀 으깨졌다. 악취가 진동한다.',
          rarity: 'common',
          icon: '🥀',
          image: '🥀',
          trigger: 'daily',
          effect: { type: 'special' }
        }
      },
      2: {
        success: {
          id: 'market_2_success',
          name: '갓 구운 황금빵',
          description: '뜨거움을 참고 지킨 빵. 완벽한 황금빛이 빛난다.',
          rarity: 'common',
          icon: '🍞',
          image: '🍞',
          trigger: 'daily',
          effect: { type: 'resource', food: 7 }
        },
        fail: {
          id: 'market_2_fail',
          name: '흙 묻은 타버린 빵',
          description: '떨어뜨려 흙이 묻었다. 먹을 수가 없다.',
          rarity: 'common',
          icon: '🔥',
          image: '🔥',
          trigger: 'daily',
          effect: { type: 'special' }
        }
      },
      3: {
        success: {
          id: 'market_3_success',
          name: '잃어버린 금화 주머니',
          description: '넘어지면서도 금화를 건졌다. 상당한 재산이다.',
          rarity: 'common',
          icon: '💰',
          image: '💰',
          trigger: 'daily',
          effect: { type: 'resource', gold: 10 }
        },
        fail: {
          id: 'market_3_fail',
          name: '흙먼지 묻은 누더기',
          description: '그냥 땅바닥에 넘어졌다. 금화는 남이 주워갔다.',
          rarity: 'common',
          icon: '💨',
          image: '💨',
          trigger: 'daily',
          effect: { type: 'special' }
        }
      }
    }
  }

  const pathData = cardData[pathType]
  if (!pathData) {
    throw new Error(`Invalid path type: ${pathType}`)
  }

  const eventData = pathData[eventNumber]
  if (!eventData) {
    throw new Error(`Invalid event number: ${eventNumber}`)
  }

  return isSuccess ? eventData.success : eventData.fail
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

// 선택한 계명들의 일일 효과 합산
const totalDailyEffects = computed(() => {
  const total = {
    morale: 0,
    gold: 0,
    military: 0,
    food: 0,
    population: 0
  }

  localSelectedCommandments.value.forEach(commandment => {
    total.morale += commandment.effects.morale
    total.gold += commandment.effects.gold
    total.military += commandment.effects.military
    total.food += commandment.effects.food
    total.population += commandment.effects.population
  })

  return total
})

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
