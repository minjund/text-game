<template>
  <Transition name="modal">
    <div v-if="show && resourceType" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4" @click.self="$emit('close')">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 rounded-lg sm:rounded-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
           :class="getBorderClass(resourceType)">
        <!-- Header -->
        <div class="flex items-center justify-between p-2.5 sm:p-4 border-b-2 flex-shrink-0"
             :class="getHeaderClass(resourceType)">
          <div class="flex items-center gap-2 sm:gap-3">
            <span class="text-xl sm:text-2xl md:text-3xl">{{ getIcon(resourceType) }}</span>
            <div>
              <h2 class="text-base sm:text-xl md:text-2xl font-bold">{{ getTitle(resourceType) }}</h2>
              <p class="text-[10px] sm:text-xs md:text-sm text-slate-300">{{ getSubtitle(resourceType) }}</p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="text-slate-400 hover:text-white text-lg sm:text-xl md:text-2xl px-1 sm:px-2 flex-shrink-0"
          >
            ✕
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-2.5 sm:p-4 space-y-2.5 sm:space-y-4">
          <!-- Description -->
          <div class="bg-slate-800/50 border border-slate-600 rounded-lg p-2.5 sm:p-3">
            <h3 class="text-xs sm:text-sm md:text-base font-bold text-slate-200 mb-1.5 sm:mb-2">📝 설명</h3>
            <p class="text-[11px] sm:text-xs md:text-sm text-slate-300 leading-relaxed">{{ getDescription(resourceType) }}</p>
          </div>

          <!-- Effects -->
          <div class="bg-slate-800/50 border border-slate-600 rounded-lg p-2.5 sm:p-3">
            <h3 class="text-xs sm:text-sm md:text-base font-bold text-slate-200 mb-1.5 sm:mb-2">💫 영향</h3>
            <div class="space-y-1.5 sm:space-y-2">
              <div v-for="(effect, index) in getEffects(resourceType)" :key="index" class="flex items-start gap-1.5 sm:gap-2">
                <span class="text-yellow-400 flex-shrink-0 text-xs sm:text-sm">▶</span>
                <p class="text-[11px] sm:text-xs md:text-sm text-slate-300">{{ effect }}</p>
              </div>
            </div>
          </div>

          <!-- How to Get -->
          <div class="bg-slate-800/50 border border-slate-600 rounded-lg p-2.5 sm:p-3">
            <h3 class="text-xs sm:text-sm md:text-base font-bold text-slate-200 mb-1.5 sm:mb-2">✨ 획득 방법</h3>
            <div class="space-y-1.5 sm:space-y-2">
              <div v-for="(method, index) in getAcquisitionMethods(resourceType)" :key="index" class="flex items-start gap-1.5 sm:gap-2">
                <span class="text-green-400 flex-shrink-0 text-xs sm:text-sm">•</span>
                <p class="text-[11px] sm:text-xs md:text-sm text-slate-300">{{ method }}</p>
              </div>
            </div>
          </div>

          <!-- Tips -->
          <div class="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/50 rounded-lg p-2.5 sm:p-3">
            <h3 class="text-xs sm:text-sm md:text-base font-bold text-yellow-200 mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
              <span>💡</span> 팁
            </h3>
            <p class="text-[11px] sm:text-xs md:text-sm text-yellow-100 leading-relaxed">{{ getTip(resourceType) }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-2.5 sm:p-4 border-t-2 border-slate-600 bg-slate-900/50 flex-shrink-0">
          <button
            @click="$emit('close')"
            class="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-white transition-colors text-sm sm:text-base"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
type ResourceType = 'food' | 'gold' | 'morale' | 'soldiers'

interface Props {
  show: boolean
  resourceType: ResourceType | null
}

defineProps<Props>()

defineEmits<{
  'close': []
}>()

const getIcon = (type: ResourceType) => {
  const icons: Record<ResourceType, string> = {
    food: '🌾',
    gold: '💰',
    morale: '😊',
    soldiers: '⚔️'
  }
  return icons[type]
}

const getTitle = (type: ResourceType) => {
  const titles: Record<ResourceType, string> = {
    food: '식량',
    gold: '금',
    morale: '민심',
    soldiers: '병사'
  }
  return titles[type]
}

const getSubtitle = (type: ResourceType) => {
  const subtitles: Record<ResourceType, string> = {
    food: '왕국의 생존을 책임지는 기본 자원',
    gold: '경제력과 발전의 원동력',
    morale: '백성들의 행복과 충성도',
    soldiers: '왕국을 지키는 군사력'
  }
  return subtitles[type]
}

const getBorderClass = (type: ResourceType) => {
  const classes: Record<ResourceType, string> = {
    food: 'border-green-600/50',
    gold: 'border-yellow-600/50',
    morale: 'border-pink-600/50',
    soldiers: 'border-red-600/50'
  }
  return classes[type]
}

const getHeaderClass = (type: ResourceType) => {
  const classes: Record<ResourceType, string> = {
    food: 'border-green-600/30 bg-green-900/20',
    gold: 'border-yellow-600/30 bg-yellow-900/20',
    morale: 'border-pink-600/30 bg-pink-900/20',
    soldiers: 'border-red-600/30 bg-red-900/20'
  }
  return classes[type]
}

const getDescription = (type: ResourceType) => {
  const descriptions: Record<ResourceType, string> = {
    food: '식량은 왕국의 가장 기본적인 자원입니다. 백성들이 먹을 것이 없으면 왕국은 유지될 수 없습니다. 매일 일정량의 식량이 생산되며, 인구가 많을수록 더 많은 식량이 필요합니다.',
    gold: '금은 왕국의 경제력을 나타냅니다. 병사 모집, 건설, 무역 등 거의 모든 활동에 금이 필요합니다. 안정적인 금 수입원을 확보하는 것이 왕국 발전의 핵심입니다.',
    morale: '민심은 백성들의 행복도와 왕국에 대한 충성도를 나타냅니다. 민심이 높을수록 자원 생산이 증가하고, 낮으면 반란이나 이탈이 발생할 수 있습니다.',
    soldiers: '병사는 왕국의 군사력입니다. 제국의 침략을 막고 영토를 확장하기 위해서는 충분한 병력이 필요합니다. 전투에서 병사는 소모되므로 지속적인 모집이 필요합니다.'
  }
  return descriptions[type]
}

const getEffects = (type: ResourceType) => {
  const effects: Record<ResourceType, string[]> = {
    food: [
      '매일 자동으로 생산됩니다 (민심 × 10)',
      '인구가 증가하면 식량 생산량도 증가합니다',
      '부족하면 왕국이 위기에 처할 수 있습니다',
      '일부 이벤트나 카드로 추가 획득 가능'
    ],
    gold: [
      '병사 모집에 사용됩니다 (200 금 → 100 병사)',
      '일부 이벤트 선택지의 비용으로 사용',
      '전투 승리 시 보상으로 획득',
      '무역 관련 카드로 생산량 증가 가능'
    ],
    morale: [
      '민심이 높을수록 식량 생산량 증가 (민심 × 10)',
      '특정 이벤트의 성공률에 영향',
      '50 미만이면 왕국이 불안정해집니다',
      '80 이상이면 백성들의 충성도가 높아집니다'
    ],
    soldiers: [
      '전투에 필수적인 자원입니다',
      '병력이 많을수록 전투에서 유리합니다',
      '전투 후 30%의 병력 손실이 발생합니다',
      '장수 카드를 통해 전투 보너스를 받을 수 있습니다'
    ]
  }
  return effects[type]
}

const getAcquisitionMethods = (type: ResourceType) => {
  const methods: Record<ResourceType, string[]> = {
    food: [
      '매일 자동 생산 (민심 × 10)',
      '농업 관련 패시브 카드',
      '농업 시너지 카드 조합',
      '일부 이벤트의 보상'
    ],
    gold: [
      '전투 승리 보상 (+500)',
      '무역 관련 패시브 카드',
      '무역 시너지 카드 조합',
      '일부 이벤트의 보상',
      '계명 효과'
    ],
    morale: [
      '문화 관련 패시브 카드',
      '문화 시너지 카드 조합',
      '긍정적인 이벤트 선택',
      '계명 효과'
    ],
    soldiers: [
      '금 200으로 병사 100 모집',
      '군사 관련 패시브 카드 (전투 시 임시 추가)',
      '군사 시너지 카드 효과',
      '일부 이벤트의 보상'
    ]
  }
  return methods[type]
}

const getTip = (type: ResourceType) => {
  const tips: Record<ResourceType, string> = {
    food: '민심을 높게 유지하면 식량 생산량이 자동으로 증가합니다. 농업 카드와 문화 카드를 함께 조합하면 시너지 효과를 볼 수 있습니다!',
    gold: '초반에는 무역 카드로 안정적인 수입을 확보하세요. 전투는 금을 벌 수 있는 좋은 방법이지만 병력 손실을 고려해야 합니다.',
    morale: '민심은 식량 생산에 직접적인 영향을 줍니다. 80 이상을 유지하면 왕국 운영이 훨씬 수월해집니다. 문화 카드를 적극 활용하세요!',
    soldiers: '제국 전투 전에는 충분한 병력을 확보하세요. 일반 전투로 경험을 쌓고, 병력이 1000 이상일 때 제국에 도전하는 것을 권장합니다.'
  }
  return tips[type]
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
}
</style>
