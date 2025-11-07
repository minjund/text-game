export type GeneralRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface General {
  name: string
  rarity: GeneralRarity
  attack: number
  defense: number
  health: number
  speed: number
  skills: string[]
}

interface RarityConfig {
  weight: number
  attackRange: [number, number]
  defenseRange: [number, number]
  healthRange: [number, number]
  speedRange: [number, number]
  skillCount: number
}

const LAST_NAMES = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황']
const FIRST_NAMES = ['철수', '영희', '민수', '지훈', '수진', '영수', '혜진', '성호', '미나', '준호', '은지', '태양', '하늘', '별', '달', '구름']

const SKILLS = [
  '연속 공격', '강타', '방어 태세', '회복', '독 공격',
  '화염 공격', '냉기 공격', '번개 공격', '광역 공격', '집중 공격',
  '회피', '반격', '흡혈', '기절', '약화',
  '강화', '광폭화', '재생', '보호막', '신속'
]

const RARITY_CONFIG: Record<GeneralRarity, RarityConfig> = {
  common: {
    weight: 60,
    attackRange: [30, 50],
    defenseRange: [20, 40],
    healthRange: [100, 150],
    speedRange: [5, 10],
    skillCount: 1
  },
  rare: {
    weight: 25,
    attackRange: [45, 70],
    defenseRange: [35, 60],
    healthRange: [140, 200],
    speedRange: [8, 15],
    skillCount: 2
  },
  epic: {
    weight: 12,
    attackRange: [65, 100],
    defenseRange: [55, 90],
    healthRange: [180, 280],
    speedRange: [12, 20],
    skillCount: 3
  },
  legendary: {
    weight: 3,
    attackRange: [90, 150],
    defenseRange: [80, 130],
    healthRange: [250, 400],
    speedRange: [15, 30],
    skillCount: 4
  }
}

export const useGeneralGenerator = () => {
  const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const randomElement = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)]
  }

  const getRandomRarity = (): GeneralRarity => {
    const totalWeight = Object.values(RARITY_CONFIG).reduce((sum, config) => sum + config.weight, 0)
    let random = Math.random() * totalWeight

    for (const [rarity, config] of Object.entries(RARITY_CONFIG)) {
      random -= config.weight
      if (random <= 0) {
        return rarity as GeneralRarity
      }
    }

    return 'common'
  }

  const getRandomSkills = (count: number): string[] => {
    const shuffled = [...SKILLS].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  const generateRandomGeneral = (): General => {
    const rarity = getRandomRarity()
    const config = RARITY_CONFIG[rarity]

    const lastName = randomElement(LAST_NAMES)
    const firstName = randomElement(FIRST_NAMES)
    const name = `${lastName}${firstName}`

    const attack = randomInt(...config.attackRange)
    const defense = randomInt(...config.defenseRange)
    const health = randomInt(...config.healthRange)
    const speed = randomInt(...config.speedRange)
    const skills = getRandomSkills(config.skillCount)

    return {
      name,
      rarity,
      attack,
      defense,
      health,
      speed,
      skills
    }
  }

  const generateMultipleGenerals = (count: number): General[] => {
    return Array.from({ length: count }, () => generateRandomGeneral())
  }

  return {
    generateRandomGeneral,
    generateMultipleGenerals
  }
}
