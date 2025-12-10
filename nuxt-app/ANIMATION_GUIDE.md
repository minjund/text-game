# 🎬 게임 애니메이션 가이드

Kingdom Wars 게임에 사용할 수 있는 애니메이션 시스템 가이드입니다.

## 📦 설치된 라이브러리

```bash
npm install gsap @vueuse/motion @formkit/auto-animate
```

### 1. **GSAP** - 프로페셔널 애니메이션 엔진
- 복잡한 타임라인 기반 애니메이션
- 게임 전투 이펙트, 양피지 펼치기 등
- 정밀한 제어 필요한 애니메이션

### 2. **VueUse Motion** - Vue 전용 애니메이션
- Vue 컴포넌트와 완벽 통합
- 선언적 애니메이션 스타일
- 페이지 전환, 요소 진입 효과

### 3. **Auto Animate** - 자동 애니메이션
- 리스트, 모달 자동 애니메이션
- 설정 없이 사용 가능
- 장수 목록, 카드 컬렉션 등

---

## 🎯 사용 가능한 애니메이션

### 1. 모달 줌인/줌아웃 (`useModalZoom`)

**용도:** 모달창, 팝업, 알림창

```vue
<script setup>
import { useModalZoom } from '~/composables/useAnimations'

const modalRef = ref()
const showModal = ref(false)
const { openModal, closeModal } = useModalZoom()

watch(showModal, async (newVal) => {
  if (newVal) {
    await nextTick()
    openModal(modalRef.value)
  }
})

const close = () => {
  closeModal(modalRef.value, () => {
    showModal.value = false
  })
}
</script>

<template>
  <div v-if="showModal" ref="modalRef" class="modal">
    모달 내용
  </div>
</template>
```

**효과:** 0.5 스케일에서 1.0으로 튕기면서 나타남 (back.out 이징)

---

### 2. 양피지 펼치기/접기 (`useParchmentUnfold`)

**용도:** 이벤트 스토리, 공지사항, 계명 선택

```vue
<script setup>
import { useParchmentUnfold } from '~/composables/useAnimations'

const parchmentRef = ref()
const { unfold, fold } = useParchmentUnfold()

const show = async () => {
  showParchment.value = true
  await nextTick()
  unfold(parchmentRef.value)
}

const hide = () => {
  fold(parchmentRef.value, () => {
    showParchment.value = false
  })
}
</script>

<template>
  <div v-if="showParchment" ref="parchmentRef" class="parchment">
    <div class="parchment-content">제목</div>
    <div class="parchment-content">내용 1</div>
    <div class="parchment-content">내용 2</div>
  </div>
</template>
```

**중요:** 내부 요소에 `.parchment-content` 클래스를 붙여야 순차 페이드인됩니다.

---

### 3. 버튼 클릭 효과 (`useButtonPulse`)

**용도:** 중요한 버튼, CTA 버튼

```vue
<script setup>
import { useButtonPulse } from '~/composables/useAnimations'

const buttonRef = ref()
const { pulse, shine } = useButtonPulse()

const handleClick = () => {
  pulse(buttonRef.value) // 펄스 효과
  // 또는
  shine(buttonRef.value) // 빛나는 효과
}
</script>

<template>
  <button ref="buttonRef" @click="handleClick">
    클릭!
  </button>
</template>
```

**효과:**
- `pulse`: 버튼이 눌리는 듯한 스케일 효과
- `shine`: 빛이 좌→우로 지나가는 효과

---

### 4. 카드 뒤집기 (`useCardFlip`)

**용도:** 패시브 카드 선택, 랜덤 보상

```vue
<script setup>
import { useCardFlip } from '~/composables/useAnimations'

const cardRef = ref()
const isFlipped = ref(false)
const { flip, flipBack } = useCardFlip()

const handleFlip = () => {
  if (!isFlipped.value) {
    flip(cardRef.value, () => {
      isFlipped.value = true // 90도 회전 시점에 실행
    })
  } else {
    flipBack(cardRef.value, () => {
      isFlipped.value = false
    })
  }
}
</script>

<template>
  <div
    ref="cardRef"
    @click="handleFlip"
    style="perspective: 1000px; transform-style: preserve-3d"
  >
    <div v-show="!isFlipped">앞면</div>
    <div v-show="isFlipped">뒷면</div>
  </div>
</template>
```

---

### 5. 리소스 카운터 (`useCounterAnimation`)

**용도:** 골드, 식량, 군대 수 변화 표시

```vue
<script setup>
import { useCounterAnimation } from '~/composables/useAnimations'

const goldRef = ref()
const currentGold = ref(1000)
const { animateValue } = useCounterAnimation()

const gainGold = (amount: number) => {
  const newValue = currentGold.value + amount
  animateValue(goldRef.value, currentGold.value, newValue, 1)
  currentGold.value = newValue
}
</script>

<template>
  <span ref="goldRef">{{ currentGold.toLocaleString() }}</span>
</template>
```

**효과:** 숫자가 부드럽게 카운트업/다운됩니다.

---

### 6. 전투 이펙트 (`useBattleEffects`)

**용도:** 전투 시스템, 피격 효과

```vue
<script setup>
import { useBattleEffects } from '~/composables/useAnimations'

const targetRef = ref()
const { shake, flash, criticalHit } = useBattleEffects()

const attack = () => {
  shake(targetRef.value) // 흔들림
  flash(targetRef.value, '#ff0000') // 빨간 플래시
}

const critical = () => {
  criticalHit(targetRef.value) // 크리티컬 효과
}
</script>

<template>
  <div ref="targetRef" class="enemy">
    🛡️ 적
  </div>
</template>
```

**효과:**
- `shake`: 좌우로 빠르게 흔들림
- `flash`: 지정한 색상으로 플래시
- `criticalHit`: 스케일업 + 노란 빛 효과

---

### 7. 페이지 전환 (`usePageTransition`)

**용도:** 페이지 라우팅, 화면 전환

```vue
<script setup>
import { usePageTransition } from '~/composables/useAnimations'

const pageRef = ref()
const { fadeIn, slideIn } = usePageTransition()

onMounted(() => {
  fadeIn(pageRef.value)
  // 또는
  slideIn(pageRef.value, 'right') // 오른쪽에서 슬라이드
})
</script>

<template>
  <div ref="pageRef">
    페이지 내용
  </div>
</template>
```

---

### 8. 알림 애니메이션 (`useNotificationAnimation`)

**용도:** 토스트 메시지, 게임 알림

```vue
<script setup>
import { useNotificationAnimation } from '~/composables/useAnimations'

const notifRef = ref()
const { bounceIn, slideOut } = useNotificationAnimation()

const show = async () => {
  showNotif.value = true
  await nextTick()
  bounceIn(notifRef.value)

  // 3초 후 자동 닫기
  setTimeout(() => {
    slideOut(notifRef.value, () => {
      showNotif.value = false
    })
  }, 3000)
}
</script>

<template>
  <div v-if="showNotif" ref="notifRef" class="notification">
    알림 메시지
  </div>
</template>
```

---

### 9. 자동 리스트 애니메이션 (Auto Animate)

**용도:** 장수 목록, 카드 컬렉션, 이벤트 로그

```vue
<script setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'

const [listRef] = useAutoAnimate()

const generals = ref([
  { id: 1, name: '조운' },
  { id: 2, name: '관우' },
])

const addGeneral = () => {
  generals.value.push({ id: 3, name: '장비' })
}
</script>

<template>
  <div ref="listRef">
    <div v-for="general in generals" :key="general.id">
      {{ general.name }}
    </div>
  </div>
</template>
```

**특징:** 아이템 추가/삭제 시 자동으로 부드러운 애니메이션 적용

---

### 10. VueUse Motion (선언적 애니메이션)

**용도:** 컴포넌트 진입 효과

```vue
<script setup>
import { useMotion } from '@vueuse/motion'

const target = ref()

useMotion(target, {
  initial: {
    opacity: 0,
    y: 100,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 500,
    },
  },
})
</script>

<template>
  <div ref="target">
    페이드인되는 요소
  </div>
</template>
```

---

## 🎮 게임별 사용 예시

### GameEventModal.vue - 이벤트 모달

```vue
<script setup>
import { useModalZoom, useParchmentUnfold } from '~/composables/useAnimations'

const modalRef = ref()
const parchmentRef = ref()
const { openModal, closeModal } = useModalZoom()
const { unfold } = useParchmentUnfold()

watch(showEvent, async (newVal) => {
  if (newVal) {
    await nextTick()
    openModal(modalRef.value)
    setTimeout(() => {
      if (parchmentRef.value) {
        unfold(parchmentRef.value)
      }
    }, 300) // 모달이 열린 후 양피지 펼치기
  }
})
</script>
```

### GameBattleModal.vue - 전투 시스템

```vue
<script setup>
import { useBattleEffects, useCounterAnimation } from '~/composables/useAnimations'

const enemyRef = ref()
const playerHpRef = ref()
const { shake, flash, criticalHit } = useBattleEffects()
const { animateValue } = useCounterAnimation()

const onAttack = (isCritical: boolean) => {
  shake(enemyRef.value)
  if (isCritical) {
    criticalHit(enemyRef.value)
  } else {
    flash(enemyRef.value, '#ff4444')
  }
}

const onDamage = (oldHp: number, newHp: number) => {
  animateValue(playerHpRef.value, oldHp, newHp, 0.5)
}
</script>
```

### GameGeneralsModal.vue - 장수 모집

```vue
<script setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { useCardFlip } from '~/composables/useAnimations'

const [generalsListRef] = useAutoAnimate()
const { flip } = useCardFlip()

const onRecruitCard = (cardElement: HTMLElement) => {
  flip(cardElement, () => {
    // 카드가 뒤집힐 때 장수 정보 표시
    showGeneralInfo.value = true
  })
}
</script>

<template>
  <div ref="generalsListRef">
    <GeneralCard
      v-for="general in generals"
      :key="general.id"
      @click="onRecruitCard"
    />
  </div>
</template>
```

---

## 🎨 성능 최적화 팁

1. **애니메이션은 60fps 유지**
   - GSAP는 자동 최적화
   - transform, opacity 속성 사용 (width, height 피하기)

2. **will-change 속성 활용**
```css
.animated-element {
  will-change: transform, opacity;
}
```

3. **불필요한 애니메이션 정리**
```js
const tl = gsap.timeline()
tl.kill() // 컴포넌트 언마운트 시 타임라인 정리
```

4. **Auto Animate 비활성화**
```vue
const [listRef] = useAutoAnimate({
  duration: 150, // 기본 250ms보다 빠르게
})
```

---

## 📚 추가 자료

- [GSAP 공식 문서](https://greensock.com/docs/)
- [VueUse Motion 가이드](https://motion.vueuse.org/)
- [Auto Animate 문서](https://auto-animate.formkit.com/)

---

## 🧪 테스트 페이지

예시를 보려면 `/examples/animations` 경로로 이동하세요.

```bash
# 개발 서버 실행
cd nuxt-app
npm run dev
```

그 후 브라우저에서 컴포넌트 임포트:
```vue
<template>
  <AnimationExamples />
</template>

<script setup>
import AnimationExamples from '~/components/examples/AnimationExamples.vue'
</script>
```
