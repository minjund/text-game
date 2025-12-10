<template>
  <div class="min-h-screen bg-slate-900 p-8">
    <div class="max-w-4xl mx-auto space-y-12">
      <h1 class="text-4xl font-bold text-white text-center mb-12">
        게임 애니메이션 예시
      </h1>

      <!-- 1. 모달 줌인/줌아웃 -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-purple-400">1. 모달 줌인/줌아웃</h2>
        <button
          @click="showZoomModal = !showZoomModal"
          class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          모달 열기/닫기
        </button>

        <div
          v-if="showZoomModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          @click="closeZoomModal"
        >
          <div
            ref="zoomModalRef"
            @click.stop
            class="bg-slate-800 rounded-xl p-8 max-w-md border-2 border-purple-500"
          >
            <h3 class="text-2xl font-bold text-white mb-4">줌 애니메이션 모달</h3>
            <p class="text-slate-300 mb-4">
              이 모달은 GSAP의 back.out 이징으로 튕기면서 나타납니다!
            </p>
            <button
              @click="closeZoomModal"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              닫기
            </button>
          </div>
        </div>
      </section>

      <!-- 2. 양피지 펼치기 -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-purple-400">2. 양피지 펼치기/접기</h2>
        <button
          @click="showParchment = !showParchment"
          class="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
        >
          양피지 토글
        </button>

        <div
          v-if="showParchment"
          ref="parchmentRef"
          class="bg-amber-50 rounded-lg p-8 border-4 border-amber-800 shadow-2xl relative overflow-hidden"
          style="background-image: url('data:image/svg+xml,%3Csvg width=\\'100\\' height=\\'100\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence baseFrequency=\\'0.9\\' /%3E%3C/filter%3E%3Crect width=\\'100\\' height=\\'100\\' filter=\\'url(%23noise)\\' opacity=\\'0.05\\' /%3E%3C/svg%3E')"
        >
          <div class="parchment-content">
            <h3 class="text-2xl font-serif font-bold text-amber-900 mb-4">
              왕실 칙령
            </h3>
          </div>
          <div class="parchment-content">
            <p class="text-amber-800 leading-relaxed mb-3">
              짐은 이 땅의 모든 백성에게 선포하노라.
            </p>
          </div>
          <div class="parchment-content">
            <p class="text-amber-800 leading-relaxed mb-3">
              용맹한 장수들이여, 앞으로 나서라!
            </p>
          </div>
          <div class="parchment-content">
            <p class="text-amber-700 text-sm italic text-right mt-6">
              - 왕의 인장 -
            </p>
          </div>
        </div>
      </section>

      <!-- 3. 버튼 펄스 & 샤인 효과 -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-purple-400">3. 버튼 클릭 효과</h2>
        <div class="flex gap-4">
          <button
            ref="pulseButtonRef"
            @click="handlePulse"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            펄스 효과
          </button>
          <button
            ref="shineButtonRef"
            @click="handleShine"
            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg relative overflow-hidden"
          >
            샤인 효과
          </button>
        </div>
      </section>

      <!-- 4. 카드 뒤집기 -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-purple-400">4. 카드 뒤집기</h2>
        <button
          @click="handleCardFlip"
          class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          카드 뒤집기
        </button>

        <div class="flex justify-center">
          <div
            ref="cardRef"
            class="w-48 h-64 rounded-xl shadow-2xl relative preserve-3d cursor-pointer"
            style="perspective: 1000px; transform-style: preserve-3d"
            @click="handleCardFlip"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center"
              :class="{ 'opacity-0': isCardFlipped, 'opacity-100': !isCardFlipped }"
            >
              <span class="text-6xl">🎴</span>
            </div>
            <div
              class="absolute inset-0 bg-gradient-to-br from-amber-500 to-red-600 rounded-xl flex items-center justify-center"
              :class="{ 'opacity-100': isCardFlipped, 'opacity-0': !isCardFlipped }"
            >
              <span class="text-6xl">⚔️</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. 리소스 카운터 애니메이션 -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-purple-400">5. 리소스 카운터</h2>
        <button
          @click="animateCounter"
          class="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
        >
          골드 획득!
        </button>

        <div class="bg-slate-800 rounded-lg p-6 border border-yellow-500">
          <div class="flex items-center justify-between">
            <span class="text-yellow-400 font-bold">💰 골드:</span>
            <span ref="counterRef" class="text-4xl font-bold text-yellow-400">
              {{ currentGold.toLocaleString() }}
            </span>
          </div>
        </div>
      </section>

      <!-- 6. 전투 이펙트 -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-purple-400">6. 전투 이펙트</h2>
        <div class="flex gap-4">
          <button
            @click="handleShake"
            class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            흔들림
          </button>
          <button
            @click="handleFlash"
            class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            플래시
          </button>
          <button
            @click="handleCritical"
            class="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
          >
            크리티컬!
          </button>
        </div>

        <div
          ref="battleTargetRef"
          class="bg-slate-800 rounded-lg p-8 border-2 border-red-500 text-center"
        >
          <span class="text-6xl">🛡️</span>
          <p class="text-white mt-4 text-xl font-bold">타겟</p>
        </div>
      </section>

      <!-- 7. Auto Animate 리스트 -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold text-purple-400">7. 자동 리스트 애니메이션</h2>
        <div class="flex gap-4">
          <button
            @click="addItem"
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            아이템 추가
          </button>
          <button
            @click="removeItem"
            class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            아이템 제거
          </button>
        </div>

        <div
          ref="listRef"
          class="space-y-2 bg-slate-800 rounded-lg p-6 min-h-[200px]"
        >
          <div
            v-for="item in items"
            :key="item.id"
            class="bg-purple-600 text-white p-4 rounded-lg flex items-center justify-between"
          >
            <span>{{ item.name }}</span>
            <button
              @click="removeSpecificItem(item.id)"
              class="text-red-300 hover:text-red-500"
            >
              ❌
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import {
  useModalZoom,
  useParchmentUnfold,
  useButtonPulse,
  useCardFlip,
  useCounterAnimation,
  useBattleEffects,
} from '~/composables/useAnimations'

// Refs
const zoomModalRef = ref<HTMLElement>()
const parchmentRef = ref<HTMLElement>()
const pulseButtonRef = ref<HTMLElement>()
const shineButtonRef = ref<HTMLElement>()
const cardRef = ref<HTMLElement>()
const counterRef = ref<HTMLElement>()
const battleTargetRef = ref<HTMLElement>()
const [listRef] = useAutoAnimate()

// States
const showZoomModal = ref(false)
const showParchment = ref(false)
const isCardFlipped = ref(false)
const currentGold = ref(1000)
const items = ref([
  { id: 1, name: '장수 - 조운' },
  { id: 2, name: '장수 - 관우' },
  { id: 3, name: '장수 - 장비' },
])

// Composables
const { openModal, closeModal } = useModalZoom()
const { unfold, fold } = useParchmentUnfold()
const { pulse, shine } = useButtonPulse()
const { flip, flipBack } = useCardFlip()
const { animateValue } = useCounterAnimation()
const { shake, flash, criticalHit } = useBattleEffects()

// 1. 모달 애니메이션
watch(showZoomModal, async (newVal) => {
  if (newVal) {
    await nextTick()
    if (zoomModalRef.value) {
      openModal(zoomModalRef.value)
    }
  }
})

const closeZoomModal = () => {
  if (zoomModalRef.value) {
    closeModal(zoomModalRef.value, () => {
      showZoomModal.value = false
    })
  }
}

// 2. 양피지 애니메이션
watch(showParchment, async (newVal) => {
  await nextTick()
  if (newVal && parchmentRef.value) {
    unfold(parchmentRef.value)
  }
})

// 3. 버튼 효과
const handlePulse = () => {
  if (pulseButtonRef.value) {
    pulse(pulseButtonRef.value)
  }
}

const handleShine = () => {
  if (shineButtonRef.value) {
    shine(shineButtonRef.value)
  }
}

// 4. 카드 뒤집기
const handleCardFlip = () => {
  if (!cardRef.value) return

  if (!isCardFlipped.value) {
    flip(cardRef.value, () => {
      isCardFlipped.value = true
    })
  } else {
    flipBack(cardRef.value, () => {
      isCardFlipped.value = false
    })
  }
}

// 5. 카운터 애니메이션
const animateCounter = () => {
  if (!counterRef.value) return

  const newGold = currentGold.value + Math.floor(Math.random() * 1000) + 500
  animateValue(counterRef.value, currentGold.value, newGold, 1)
  currentGold.value = newGold
}

// 6. 전투 이펙트
const handleShake = () => {
  if (battleTargetRef.value) {
    shake(battleTargetRef.value)
  }
}

const handleFlash = () => {
  if (battleTargetRef.value) {
    flash(battleTargetRef.value, '#ff4444')
  }
}

const handleCritical = () => {
  if (battleTargetRef.value) {
    criticalHit(battleTargetRef.value)
  }
}

// 7. 리스트 애니메이션
let nextId = 4
const addItem = () => {
  const generals = ['여포', '조조', '유비', '손권', '제갈량', '사마의', '동탁', '원소']
  const randomGeneral = generals[Math.floor(Math.random() * generals.length)]
  items.value.push({
    id: nextId++,
    name: `장수 - ${randomGeneral}`,
  })
}

const removeItem = () => {
  if (items.value.length > 0) {
    items.value.shift()
  }
}

const removeSpecificItem = (id: number) => {
  items.value = items.value.filter((item) => item.id !== id)
}
</script>

<style scoped>
.preserve-3d {
  transform-style: preserve-3d;
}
</style>
