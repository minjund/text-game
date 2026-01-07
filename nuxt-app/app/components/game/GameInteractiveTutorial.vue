<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[9999] pointer-events-none">
      <!-- 4방향 오버레이로 구멍 뚫기 -->
      <template v-if="highlightArea">
        <!-- 상단 오버레이 -->
        <div
          class="absolute left-0 right-0 bg-black/50 pointer-events-auto transition-all duration-300"
          :style="{
            top: '0',
            height: highlightArea.top + 'px'
          }"
          @click.stop
        ></div>

        <!-- 하단 오버레이 -->
        <div
          class="absolute left-0 right-0 bottom-0 bg-black/50 pointer-events-auto transition-all duration-300"
          :style="{
            top: (highlightArea.top + highlightArea.height) + 'px'
          }"
          @click.stop
        ></div>

        <!-- 좌측 오버레이 -->
        <div
          class="absolute bg-black/50 pointer-events-auto transition-all duration-300"
          :style="{
            left: '0',
            top: highlightArea.top + 'px',
            width: highlightArea.left + 'px',
            height: highlightArea.height + 'px'
          }"
          @click.stop
        ></div>

        <!-- 우측 오버레이 -->
        <div
          class="absolute right-0 bg-black/50 pointer-events-auto transition-all duration-300"
          :style="{
            left: (highlightArea.left + highlightArea.width) + 'px',
            top: highlightArea.top + 'px',
            height: highlightArea.height + 'px'
          }"
          @click.stop
        ></div>

        <!-- 하이라이트 테두리 애니메이션 (클릭 방해하지 않음) -->
        <div
          class="absolute pointer-events-none transition-all duration-300"
          :style="{
            top: highlightArea.top + 'px',
            left: highlightArea.left + 'px',
            width: highlightArea.width + 'px',
            height: highlightArea.height + 'px',
          }"
        >
          <div class="absolute inset-0 border-4 border-yellow-400 rounded-lg animate-pulse shadow-lg shadow-yellow-400/50"></div>
          <!-- 반짝이는 효과 -->
          <div class="absolute inset-0 bg-yellow-400/20 rounded-lg animate-ping"></div>
        </div>
      </template>

      <!-- highlightArea가 없을 때 전체 오버레이 -->
      <div
        v-if="!highlightArea"
        class="absolute inset-0 bg-black/50 pointer-events-auto"
        @click.stop
      ></div>

      <!-- 하단 우측 어시스턴트 및 메시지 -->
      <div
        class="absolute right-2 max-w-sm pointer-events-auto z-[10000] transition-all duration-300"
        :class="hasVisibleModal ? 'bottom-4' : 'bottom-48'"
      >
        <div class="flex items-end gap-2">
          <!-- 어시스턴트 캐릭터 (왼쪽) -->
          <div class="animate-bounce-slow flex-shrink-0">
            <img
              :src="`${useRuntimeConfig().app.baseURL}images/character/assistant.png`"
              alt="어시스턴트"
              class="w-24 h-24 object-contain drop-shadow-2xl"
            />
          </div>

          <!-- 말풍선 (이미지 배경, 오른쪽) -->
          <div class="relative flex-1">
            <!-- 말풍선 본문 -->
            <div class="relative p-2.5 min-h-[100px]">
              <!-- 배경 이미지 -->
              <img
                :src="`${useRuntimeConfig().app.baseURL}images/object/chat_window.png`"
                alt="chat background"
                class="absolute inset-0 w-full h-full object-fill"
              />

              <!-- 텍스트 내용 -->
              <div class="relative z-10 text-left px-2 py-1">
                <h2 class="text-xs font-bold text-white mb-0.5 drop-shadow-lg">{{ steps[currentStep].title }}</h2>
                <p class="text-[10px] leading-relaxed text-white mb-1.5 drop-shadow-md">{{ steps[currentStep].message }}</p>

                <!-- 스킵 버튼 -->
                <button
                  @click="$emit('skip')"
                  class="text-[9px] text-white hover:text-yellow-200 underline drop-shadow-md"
                >
                  건너뛰기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  complete: []
  skip: []
  highlightButton: [buttonType: string]
}>()

const currentStep = ref(0)
const highlightArea = ref<{ top: number; left: number; width: number; height: number } | null>(null)
const hasVisibleModal = ref(false)

// 튜토리얼 단계 정의
const steps = [
  {
    title: '전쟁 기록을 확인해볼까? 📜',
    message: '아래 전쟁 기록 버튼을 눌러서 지금까지의 전투 기록을 확인해보세요.',
    targetButton: 'show-battle-history',
    buttonSelector: 'img[alt="전쟁 기록"]',
    waitForModal: true,
    nextAction: 'close-modal'
  },
  {
    title: '기록을 확인했어요! ✅',
    message: '닫기 버튼을 눌러서 모달을 닫아주세요.',
    targetButton: 'close-modal',
    buttonSelector: 'button:has(svg)',
    waitForModalClose: true
  },
  {
    title: '카드를 확인해볼까? 🎴',
    message: '카드 버튼을 눌러서 보유한 카드들을 확인해보세요.',
    targetButton: 'show-passive-cards',
    buttonSelector: 'img[alt="카드"]',
    waitForModal: true,
    nextAction: 'close-modal'
  },
  {
    title: '카드를 확인했어요! ✅',
    message: '닫기 버튼을 눌러서 모달을 닫아주세요.',
    targetButton: 'close-modal',
    buttonSelector: 'button:has(svg)',
    waitForModalClose: true
  },
  {
    title: '덱을 설정해볼까? 🃏',
    message: '덱 버튼을 눌러서 카드 덱을 설정해보세요.',
    targetButton: 'show-card-deck',
    buttonSelector: 'img[alt="덱"]',
    waitForModal: true,
    nextAction: 'setup-deck'
  },
  {
    title: '카드를 장착해보세요! 🎴',
    message: '내정 카드나 전투 카드를 선택해서 덱에 장착해보세요. 자유롭게 설정한 후 닫기 버튼을 눌러주세요.',
    targetButton: 'deck-setup-wait',
    buttonSelector: null,
    noHighlight: true,
    waitTime: 3000
  },
  {
    title: '설정이 완료되었나요? ✅',
    message: '카드 장착을 마쳤다면 닫기 버튼을 눌러주세요.',
    targetButton: 'close-modal',
    buttonSelector: 'button:has(svg)',
    waitForModalClose: true
  },
  {
    title: '도감을 확인해볼까? 📚',
    message: '도감 버튼을 눌러서 모든 카드 정보를 확인해보세요.',
    targetButton: 'show-card-guide',
    buttonSelector: 'img[alt="도감"]',
    waitForModal: true,
    nextAction: 'close-modal'
  },
  {
    title: '도감을 확인했어요! ✅',
    message: '닫기 버튼을 눌러서 모달을 닫아주세요.',
    targetButton: 'close-modal',
    buttonSelector: 'button:has(svg)',
    waitForModalClose: true
  },
  {
    title: '병력을 모집해볼까? 🛡️',
    message: '모집 버튼을 눌러서 병사를 모집해보세요.',
    targetButton: 'recruit-soldiers',
    buttonSelector: 'img[alt="모집"]',
    waitForAction: true
  },
  {
    title: '모험을 떠나볼까? ⚔️',
    message: '이제 모험 버튼을 눌러서 적과 전투를 시작해보세요!',
    targetButton: 'start-normal-battle',
    buttonSelector: 'img[alt="모험"]',
    isLast: true
  }
]

// DOM Observer
let modalObserver: MutationObserver | null = null

// 모달에서 닫기 버튼 찾기
const findCloseButton = (): HTMLElement | null => {
  // 모든 고정 위치의 요소 찾기
  const allFixed = document.querySelectorAll('.fixed.inset-0')
  console.log('Tutorial: Found fixed elements:', allFixed.length)

  for (const element of allFixed) {
    const el = element as HTMLElement
    // 튜토리얼 자체는 제외 (z-[9999])
    const zIndex = getComputedStyle(el).zIndex
    if (zIndex === '9999') continue

    // 보이는 요소만
    if (getComputedStyle(el).display === 'none' || el.offsetHeight === 0) continue

    console.log('Tutorial: Checking element for close button:', el.className)

    // 이 요소 내부에서 SVG가 있는 버튼 찾기
    const buttons = el.querySelectorAll('button')
    for (const btn of buttons) {
      const htmlBtn = btn as HTMLElement
      // SVG가 있거나, X 아이콘이거나, 닫기 관련 클래스가 있는 버튼 찾기
      if (
        htmlBtn.querySelector('svg') ||
        htmlBtn.textContent?.includes('×') ||
        htmlBtn.textContent?.includes('✕') ||
        htmlBtn.className.includes('close')
      ) {
        console.log('Tutorial: Found close button!', htmlBtn)
        return htmlBtn
      }
    }
  }

  console.warn('Tutorial: No close button found in any modal')
  return null
}

// 버튼 위치 계산 (재시도 로직 포함)
const calculateHighlightArea = (retryCount = 0) => {
  if (!props.show || currentStep.value >= steps.length) {
    highlightArea.value = null
    return
  }

  const step = steps[currentStep.value]

  // noHighlight 플래그가 있으면 하이라이트 제거
  if (step.noHighlight) {
    highlightArea.value = null
    console.log('Tutorial: No highlight for this step')
    // waitTime이 설정되어 있으면 자동으로 다음 단계로
    if (step.waitTime) {
      setTimeout(() => {
        nextStep()
      }, step.waitTime)
    }
    return
  }

  // 닫기 버튼의 경우 모달 내부에서 찾기
  let button: HTMLElement | null = null

  if (step.targetButton === 'close-modal') {
    button = findCloseButton()
  } else if (step.buttonSelector) {
    button = document.querySelector(step.buttonSelector)?.closest('button') as HTMLElement
  }

  if (button) {
    const rect = button.getBoundingClientRect()
    highlightArea.value = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
    console.log('Tutorial: Highlight area set', highlightArea.value)
  } else {
    console.warn('Tutorial: Button not found for', step.targetButton || step.buttonSelector, 'retry:', retryCount)

    // 재시도 (최대 20번, 300ms 간격 = 6초)
    if (retryCount < 20) {
      setTimeout(() => {
        calculateHighlightArea(retryCount + 1)
      }, 300)
    } else {
      // 버튼을 못 찾은 경우 하이라이트 제거
      highlightArea.value = null
    }
  }
}

// 모달이 열려있는지 확인하는 함수
const checkModalVisible = (): boolean => {
  const modals = document.querySelectorAll('.fixed.inset-0')
  for (const modal of modals) {
    const el = modal as HTMLElement
    // 튜토리얼 자체는 제외 (z-[9999])
    const zIndex = getComputedStyle(el).zIndex
    if (zIndex === '9999') continue

    // 보이는 모달인지 확인
    if (getComputedStyle(el).display !== 'none' && el.offsetHeight > 0) {
      return true
    }
  }
  return false
}

// 모달 상태를 지속적으로 체크
const updateModalState = () => {
  hasVisibleModal.value = checkModalVisible()
}

// 모달 열림/닫힘 감지
const watchForModalChange = (waitForOpen: boolean) => {
  if (modalObserver) {
    modalObserver.disconnect()
  }

  let checkCount = 0
  const maxChecks = 50 // 최대 5초 (100ms * 50)

  const checkInterval = setInterval(() => {
    checkCount++
    const isModalVisible = checkModalVisible()
    hasVisibleModal.value = isModalVisible

    if (waitForOpen && isModalVisible) {
      console.log('Tutorial: Modal opened, moving to next step')
      clearInterval(checkInterval)
      setTimeout(() => {
        nextStep()
      }, 300)
    } else if (!waitForOpen && !isModalVisible) {
      console.log('Tutorial: Modal closed, moving to next step')
      clearInterval(checkInterval)
      setTimeout(() => {
        nextStep()
      }, 300)
    }

    if (checkCount >= maxChecks) {
      console.warn('Tutorial: Modal change timeout')
      clearInterval(checkInterval)
    }
  }, 100)

  // MutationObserver도 병행 사용
  modalObserver = new MutationObserver(() => {
    updateModalState()
  })

  modalObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  })
}

// 다음 단계로
const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    console.log('Tutorial: Moving to step', currentStep.value + 1, steps[currentStep.value])

    // 모달 내부 요소의 경우 조금 긴 딜레이 (재시도 로직이 있으므로 짧게)
    const step = steps[currentStep.value]
    const delay = step.targetButton === 'close-modal' ? 300 : 100

    setTimeout(() => {
      calculateHighlightArea()
      setupButtonListeners()
    }, delay)
  } else {
    // 튜토리얼 완료
    console.log('Tutorial: Complete!')
    emit('complete')
  }
}

// 버튼 클릭 리스너 (재시도 로직 포함)
const setupButtonListeners = (retryCount = 0) => {
  const step = steps[currentStep.value]

  // noHighlight 단계는 리스너 설정 안 함
  if (step.noHighlight) {
    return
  }

  let button: HTMLElement | null = null

  // 닫기 버튼의 경우 모달 내부에서 찾기
  if (step.targetButton === 'close-modal') {
    button = findCloseButton()
  } else if (step.buttonSelector) {
    button = document.querySelector(step.buttonSelector)?.closest('button') as HTMLElement
  }

  if (button) {
    // 기존 리스너 제거
    button.removeEventListener('click', handleButtonClick, true)
    // 새 리스너 등록 (capture phase에서 감지)
    button.addEventListener('click', handleButtonClick, true)
    console.log('Tutorial: Listener attached to', step.targetButton, button)
  } else {
    console.error('Tutorial: Button not found for listener', step.targetButton || step.buttonSelector, 'retry:', retryCount)

    // 재시도 (최대 20번, 300ms 간격 = 6초)
    if (retryCount < 20) {
      setTimeout(() => {
        setupButtonListeners(retryCount + 1)
      }, 300)
    }
  }
}

const cleanupButtonListeners = () => {
  steps.forEach(step => {
    let button: HTMLElement | null = null

    if (step.targetButton === 'close-modal') {
      button = findCloseButton()
    } else if (step.buttonSelector) {
      button = document.querySelector(step.buttonSelector)?.closest('button') as HTMLElement
    }

    if (button) {
      button.removeEventListener('click', handleButtonClick, true)
    }
  })
}

const handleButtonClick = (e: Event) => {
  console.log('Tutorial: Button clicked!', e.target)
  const step = steps[currentStep.value]

  // 닫기 버튼을 클릭한 경우 즉시 다음 단계로
  if (step.targetButton === 'close-modal') {
    console.log('Tutorial: Close button clicked, moving to next step immediately')
    setTimeout(() => {
      nextStep()
    }, 300)
    return
  }

  // 버튼 클릭 후 다음 행동 결정
  if (step.waitForModal) {
    // 모달이 열릴 때까지 대기
    console.log('Tutorial: Waiting for modal to open...')
    watchForModalChange(true)
  } else if (step.waitForModalClose) {
    // 모달이 닫힐 때까지 대기
    console.log('Tutorial: Waiting for modal to close...')
    watchForModalChange(false)
  } else if (step.isLast) {
    // 마지막 단계 - 튜토리얼 완료
    console.log('Tutorial: Last step, completing...')
    setTimeout(() => {
      emit('complete')
    }, 500)
  } else {
    // 일반 버튼 - 즉시 다음 단계
    setTimeout(() => {
      nextStep()
    }, 300)
  }
}

// 모달이 show prop으로 열렸을 때 다음 단계로 이동
watch(() => props.show, (newVal) => {
  if (newVal) {
    currentStep.value = 0
    setTimeout(() => {
      calculateHighlightArea()
      setupButtonListeners()
    }, 100)
  } else {
    cleanupButtonListeners()
    if (modalObserver) {
      modalObserver.disconnect()
      modalObserver = null
    }
  }
})

// 윈도우 리사이즈 시 재계산
let resizeTimeout: ReturnType<typeof setTimeout>
const handleResize = () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(calculateHighlightArea, 100)
}

let modalCheckInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  window.addEventListener('resize', handleResize)

  // 모달 상태 지속적으로 체크
  modalCheckInterval = setInterval(() => {
    if (props.show) {
      updateModalState()
    }
  }, 200)

  if (props.show) {
    setTimeout(() => {
      calculateHighlightArea()
      setupButtonListeners()
      updateModalState()
    }, 100)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cleanupButtonListeners()
  if (modalObserver) {
    modalObserver.disconnect()
    modalObserver = null
  }
  if (modalCheckInterval) {
    clearInterval(modalCheckInterval)
    modalCheckInterval = null
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
