<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
    <div class="relative w-full max-w-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-2 border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden">
      <!-- 헤더 -->
      <div class="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-3xl">📖</span>
          <div>
            <h2 class="text-xl font-bold text-white">게임 가이드</h2>
            <p class="text-xs text-amber-100">버튼 기능을 배워보세요</p>
          </div>
        </div>
        <button
          @click="close"
          class="text-white/80 hover:text-white text-2xl transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- 진행 상태 바 -->
      <div class="flex items-center justify-center gap-2 py-3 bg-slate-900/50">
        <div
          v-for="i in 3"
          :key="i"
          class="h-2 rounded-full transition-all duration-300"
          :class="i === currentPage ? 'w-8 bg-amber-500' : 'w-2 bg-slate-600'"
        ></div>
      </div>

      <!-- 콘텐츠 -->
      <div class="p-6 md:p-8 min-h-[400px] flex flex-col">
        <!-- 페이지 1: 기본 관리 -->
        <div v-if="currentPage === 1" class="flex-1 flex flex-col">
          <div class="text-center mb-8">
            <div class="text-6xl mb-4">🏰</div>
            <h3 class="text-2xl font-bold text-amber-400 mb-2">기본 관리</h3>
            <p class="text-slate-300">왕국을 운영하는 기본 기능들입니다</p>
          </div>

          <div class="space-y-4 flex-1">
            <!-- 병력 모집 -->
            <div class="bg-slate-800/60 border-2 border-green-500/30 rounded-xl p-5 hover:border-green-500/60 transition-all">
              <div class="flex items-start gap-4">
                <div class="text-4xl">🛡️</div>
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-green-400 mb-1">병력 모집</h4>
                  <p class="text-sm text-slate-300 mb-2">금화 200을 소비하여 병력 100을 모집합니다</p>
                  <div class="flex items-center gap-2 text-xs text-slate-400">
                    <span class="bg-amber-900/40 px-2 py-1 rounded">💰 금화 -200</span>
                    <span class="text-slate-500">→</span>
                    <span class="bg-green-900/40 px-2 py-1 rounded">⚔️ 병력 +100</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 다음 날 -->
            <div class="bg-slate-800/60 border-2 border-blue-500/30 rounded-xl p-5 hover:border-blue-500/60 transition-all">
              <div class="flex items-start gap-4">
                <div class="text-4xl">📅</div>
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-blue-400 mb-1">다음 날</h4>
                  <p class="text-sm text-slate-300 mb-2">하루를 진행하고 자원을 생산합니다</p>
                  <div class="text-xs text-slate-400 space-y-1">
                    <div>• 자원 자동 생산 (식량, 금화)</div>
                    <div>• 랜덤 이벤트 발생 (70%)</div>
                    <div>• 카드 교환 기회 (30%)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 페이지 2: 전투와 카드 -->
        <div v-else-if="currentPage === 2" class="flex-1 flex flex-col">
          <div class="text-center mb-8">
            <div class="text-6xl mb-4">⚔️</div>
            <h3 class="text-2xl font-bold text-amber-400 mb-2">전투와 카드</h3>
            <p class="text-slate-300">전투를 하고 카드를 관리하세요</p>
          </div>

          <div class="space-y-4 flex-1">
            <!-- 일반 전투 -->
            <div class="bg-slate-800/60 border-2 border-red-500/30 rounded-xl p-5 hover:border-red-500/60 transition-all">
              <div class="flex items-start gap-4">
                <div class="text-4xl">⚔️</div>
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-red-400 mb-1">일반 전투</h4>
                  <p class="text-sm text-slate-300 mb-2">적 세력과 전투를 벌입니다</p>
                  <div class="text-xs text-slate-400 space-y-1">
                    <div>• 승리 시: 금화, 카드 획득</div>
                    <div>• 패배 시: 병력 손실</div>
                    <div>• 전투 카드를 사용해 승률 UP!</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 보유 카드 -->
            <div class="bg-slate-800/60 border-2 border-purple-500/30 rounded-xl p-5 hover:border-purple-500/60 transition-all">
              <div class="flex items-start gap-4">
                <div class="text-4xl">🎴</div>
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-purple-400 mb-1">보유 카드</h4>
                  <p class="text-sm text-slate-300 mb-2">현재 보유한 패시브 카드를 확인합니다</p>
                  <div class="text-xs text-slate-400">
                    패시브 카드는 자동으로 효과가 발동됩니다
                  </div>
                </div>
              </div>
            </div>

            <!-- 카드 도감 -->
            <div class="bg-slate-800/60 border-2 border-indigo-500/30 rounded-xl p-5 hover:border-indigo-500/60 transition-all">
              <div class="flex items-start gap-4">
                <div class="text-4xl">📚</div>
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-indigo-400 mb-1">카드 도감</h4>
                  <p class="text-sm text-slate-300 mb-2">모든 카드와 시너지 효과를 확인합니다</p>
                  <div class="text-xs text-slate-400">
                    시너지 효과로 더 강력한 보너스를 획득하세요!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 페이지 3: 특수 기능 -->
        <div v-else-if="currentPage === 3" class="flex-1 flex flex-col">
          <div class="text-center mb-8">
            <div class="text-6xl mb-4">✨</div>
            <h3 class="text-2xl font-bold text-amber-400 mb-2">특수 기능</h3>
            <p class="text-slate-300">게임을 더 깊이 즐기는 방법</p>
          </div>

          <div class="space-y-4 flex-1">
            <!-- 신의 계명 -->
            <div class="bg-slate-800/60 border-2 border-amber-500/30 rounded-xl p-5 hover:border-amber-500/60 transition-all">
              <div class="flex items-start gap-4">
                <div class="text-4xl">✨</div>
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-amber-400 mb-1">신의 계명</h4>
                  <p class="text-sm text-slate-300 mb-2">스토리 시작 시 선택한 5개의 계명을 확인합니다</p>
                  <div class="text-xs text-slate-400 space-y-1">
                    <div>• 계명마다 고유한 효과 보유</div>
                    <div>• 자원 생산량에 영향</div>
                    <div>• 게임 플레이 스타일 결정</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 목표 안내 -->
            <div class="bg-gradient-to-r from-amber-900/30 to-red-900/30 border-2 border-amber-500/50 rounded-xl p-5">
              <div class="text-center">
                <div class="text-3xl mb-3">🎯</div>
                <h4 class="text-lg font-bold text-amber-300 mb-2">게임 목표</h4>
                <p class="text-sm text-slate-200 mb-3">
                  42일 이내에 <span class="text-red-400 font-bold">아카샤 제국</span>을 정복하세요!
                </p>
                <div class="text-xs text-slate-300 space-y-1">
                  <div>• 7일마다 제국의 침략이 발생합니다</div>
                  <div>• 병력을 키우고 카드를 수집하세요</div>
                  <div>• 실패해도 환생으로 더 강해집니다</div>
                </div>
              </div>
            </div>

            <!-- 팁 -->
            <div class="bg-slate-900/40 border border-slate-700 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <span class="text-2xl">💡</span>
                <div class="text-xs text-slate-300">
                  <strong class="text-amber-400">팁:</strong> 다음 날을 진행하기 전에 병력을 충분히 모집하고,
                  카드를 잘 조합하면 전투에서 유리해집니다!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="bg-slate-900/50 px-6 py-4 flex items-center justify-between border-t border-slate-700">
        <!-- 이전 버튼 -->
        <button
          v-if="currentPage > 1"
          @click="previousPage"
          class="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
        >
          <span>←</span>
          <span>이전</span>
        </button>
        <div v-else></div>

        <!-- 페이지 표시 -->
        <div class="text-sm text-slate-400 font-medium">
          {{ currentPage }} / 3
        </div>

        <!-- 다음/시작 버튼 -->
        <button
          v-if="currentPage < 3"
          @click="nextPage"
          class="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-amber-500/30"
        >
          <span>다음</span>
          <span>→</span>
        </button>
        <button
          v-else
          @click="startGame"
          class="px-8 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-green-500/30 text-lg"
        >
          게임 시작! 🎮
        </button>
      </div>

      <!-- 건너뛰기 버튼 -->
      <button
        @click="skipTutorial"
        class="absolute top-20 right-6 text-xs text-slate-400 hover:text-slate-200 underline transition-colors"
      >
        건너뛰기
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  complete: []
  skip: []
}>()

const currentPage = ref(1)

const nextPage = () => {
  if (currentPage.value < 3) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const startGame = () => {
  emit('complete')
}

const close = () => {
  emit('close')
}

const skipTutorial = () => {
  emit('skip')
}

// 모달이 열릴 때마다 첫 페이지로 리셋
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    currentPage.value = 1
  }
})
</script>
