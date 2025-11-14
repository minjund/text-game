// 가짜 데이터
import type { Kingdom, General, EventCard, Skill, PlayerProfile, CrossroadCard } from '../types/game'

// 스킬 데이터
export const skills: Record<string, Skill> = {
  thunderStrike: {
    id: 'thunderStrike',
    name: '천둥격',
    description: '하늘의 번개를 불러 적에게 강력한 피해를 입힌다',
    successRate: 65,
    effect: { type: 'damage', value: 300 }
  },
  ironDefense: {
    id: 'ironDefense',
    name: '철벽수비',
    description: '아군의 방어력을 대폭 상승시킨다',
    successRate: 75,
    effect: { type: 'defense', value: 200 }
  },
  策略: {
    id: 'strategy',
    name: '기묘한 책략',
    description: '적의 허점을 찌르는 계략을 펼친다',
    successRate: 55,
    effect: { type: 'damage', value: 250 }
  },
  healingRitual: {
    id: 'healingRitual',
    name: '치유의식',
    description: '아군의 사기를 회복시킨다',
    successRate: 80,
    effect: { type: 'buff', value: 150 }
  },
  duel: {
    id: 'duel',
    name: '일기토',
    description: '적 장수에게 일대일 결투를 신청한다',
    successRate: 50,
    effect: { type: 'damage', value: 400 }
  },
  arrowRain: {
    id: 'arrowRain',
    name: '화살비',
    description: '적군에게 무수한 화살을 쏟아붓는다',
    successRate: 70,
    effect: { type: 'damage', value: 200 }
  },
  flameBurst: {
    id: 'flameBurst',
    name: '화염폭발',
    description: '불길이 적진을 휩쓴다',
    successRate: 60,
    effect: { type: 'damage', value: 280 }
  },
  iceLance: {
    id: 'iceLance',
    name: '빙창',
    description: '얼음의 창으로 적을 관통한다',
    successRate: 68,
    effect: { type: 'damage', value: 260 }
  },
  windSlash: {
    id: 'windSlash',
    name: '풍신참',
    description: '바람의 칼날로 적을 베어버린다',
    successRate: 72,
    effect: { type: 'damage', value: 240 }
  },
  earthquake: {
    id: 'earthquake',
    name: '대지진동',
    description: '땅을 흔들어 적의 균형을 무너뜨린다',
    successRate: 58,
    effect: { type: 'damage', value: 290 }
  },
  shadowStrike: {
    id: 'shadowStrike',
    name: '암영습격',
    description: '그림자에서 기습공격을 가한다',
    successRate: 62,
    effect: { type: 'damage', value: 270 }
  },
  holyLight: {
    id: 'holyLight',
    name: '성스러운 빛',
    description: '신성한 빛으로 아군을 보호한다',
    successRate: 78,
    effect: { type: 'buff', value: 180 }
  },
  berserk: {
    id: 'berserk',
    name: '광전사의 분노',
    description: '이성을 버리고 힘을 폭발시킨다',
    successRate: 45,
    effect: { type: 'damage', value: 450 }
  },
  poisonMist: {
    id: 'poisonMist',
    name: '독무',
    description: '독안개로 적의 전력을 약화시킨다',
    successRate: 65,
    effect: { type: 'damage', value: 220 }
  },
  lightningChain: {
    id: 'lightningChain',
    name: '연쇄번개',
    description: '번개가 여러 적을 관통한다',
    successRate: 55,
    effect: { type: 'damage', value: 310 }
  },
  ironWall: {
    id: 'ironWall',
    name: '철벽진',
    description: '난공불락의 방어진을 구축한다',
    successRate: 82,
    effect: { type: 'defense', value: 250 }
  },
  swordDance: {
    id: 'swordDance',
    name: '검무',
    description: '화려한 검술로 적을 압도한다',
    successRate: 70,
    effect: { type: 'damage', value: 230 }
  },
  dragonRoar: {
    id: 'dragonRoar',
    name: '용의 포효',
    description: '용의 함성으로 적을 위압한다',
    successRate: 52,
    effect: { type: 'damage', value: 320 }
  },
  meteorStrike: {
    id: 'meteorStrike',
    name: '유성낙하',
    description: '하늘에서 운석을 떨어뜨린다',
    successRate: 48,
    effect: { type: 'damage', value: 420 }
  },
  healingWave: {
    id: 'healingWave',
    name: '치유의 물결',
    description: '치유의 파동으로 아군 전체를 회복시킨다',
    successRate: 85,
    effect: { type: 'buff', value: 200 }
  }
}

// 스킬 배열 (랜덤 선택용)
export const skillsArray = Object.values(skills)

// 장수 데이터
export const mockGenerals: General[] = [
  {
    id: '1',
    name: '강철의 카론',
    title: '불패의 맹장',
    image: '/images/generals/karon.png',
    stats: { power: 92, intelligence: 45, leadership: 78 },
    skills: [skills.thunderStrike, skills.duel],
    assignedSoldiers: 0
  },
  {
    id: '2',
    name: '현자 엘리온',
    title: '지혜의 책사',
    image: '/images/generals/elion.png',
    stats: { power: 38, intelligence: 95, leadership: 82 },
    skills: [skills.策略, skills.healingRitual],
    assignedSoldiers: 0
  },
  {
    id: '3',
    name: '바람의 리나',
    title: '신궁',
    image: '/images/generals/lina.png',
    stats: { power: 75, intelligence: 68, leadership: 70 },
    skills: [skills.arrowRain, skills.ironDefense],
    assignedSoldiers: 0
  },
  {
    id: '4',
    name: '검성 아르테미스',
    title: '백전노장',
    image: '/images/generals/artemis.png',
    stats: { power: 88, intelligence: 72, leadership: 85 },
    skills: [skills.duel, skills.ironDefense],
    assignedSoldiers: 0
  }
]

// 국가 초기 데이터
export const mockKingdom: Kingdom = {
  id: '1',
  name: '아스트랄 왕국',
  ruler: '플레이어',
  resources: {
    food: 5000,
    gold: 3000,
    soldiers: 2000,
    morale: 75
  },
  day: 0
}

// 랜덤 이벤트 카드들
export const eventCards: EventCard[] = [
  {
    id: 'event1',
    title: '떠돌이 상인',
    description: '먼 이국에서 온 상인이 식량을 팔겠다고 제안합니다.',
    choices: [
      {
        text: '금 500을 주고 식량 1000을 구매한다',
        cost: { gold: 500 },
        reward: { food: 1000 }
      },
      {
        text: '거절한다',
        reward: {}
      }
    ]
  },
  {
    id: 'event2',
    title: '역병 발생',
    description: '마을에 알 수 없는 병이 퍼지고 있습니다. 신속한 대응이 필요합니다.',
    choices: [
      {
        text: '식량 800을 소모하여 치료한다',
        cost: { food: 800 },
        reward: { morale: 10 }
      },
      {
        text: '방치한다 (민심 하락)',
        reward: { morale: -20 }
      }
    ]
  },
  {
    id: 'event3',
    title: '풍년',
    description: '올해는 날씨가 좋아 농사가 대풍이었습니다!',
    choices: [
      {
        text: '수확을 거둔다',
        reward: { food: 1500, morale: 5 }
      }
    ]
  },
  {
    id: 'event4',
    title: '무기 상인',
    description: '먼 나라에서 온 무기 상인이 훌륭한 검과 갑옷을 팔고 있습니다.',
    choices: [
      {
        text: '금 1000을 주고 무기를 구매한다',
        cost: { gold: 1000 },
        reward: { soldiers: 300, morale: 5 }
      },
      {
        text: '거절한다',
        reward: {}
      }
    ]
  },
  {
    id: 'event5',
    title: '반란의 조짐',
    description: '영토 변경에서 민란의 기운이 감지됩니다.',
    choices: [
      {
        text: '금 600을 투자하여 진압한다',
        cost: { gold: 600 },
        reward: { morale: 5 }
      },
      {
        text: '병력 300을 파견한다',
        cost: { soldiers: 300 },
        reward: { morale: -5 }
      }
    ]
  },
  {
    id: 'event6',
    title: '의문의 보물',
    description: '성 지하에서 오래된 보물 상자를 발견했습니다.',
    choices: [
      {
        text: '열어본다',
        reward: { gold: 800 }
      },
      {
        text: '무시한다',
        reward: {}
      }
    ]
  }
]

// 적 국가 (침략 시뮬레이션용)
export const enemyKingdoms = [
  {
    name: '검은 성채',
    generals: [
      {
        id: 'e1',
        name: '암흑기사 모르간',
        title: '어둠의 군주',
        stats: { power: 85, intelligence: 60, leadership: 75 },
        skills: [skills.thunderStrike, skills.duel],
        assignedSoldiers: 1500
      },
      {
        id: 'e2',
        name: '그림자 암살자',
        title: '밤의 추적자',
        stats: { power: 78, intelligence: 70, leadership: 65 },
        skills: [skills.策略, skills.arrowRain],
        assignedSoldiers: 1200
      }
    ]
  },
  {
    name: '은빛 제국',
    generals: [
      {
        id: 'e3',
        name: '성기사 레온',
        title: '빛의 수호자',
        stats: { power: 80, intelligence: 75, leadership: 88 },
        skills: [skills.ironDefense, skills.healingRitual],
        assignedSoldiers: 1800
      }
    ]
  }
]

// 아카샤 대제국 (최종 보스 - 막강한 전력)
export const empireKingdom = {
  name: '아카샤 대제국',
  generals: [
    {
      id: 'emp1',
      name: '제국 황제 아카샤',
      title: '절대 군주',
      stats: { power: 99, intelligence: 98, leadership: 99 },
      skills: [skills.thunderStrike, skills.duel, skills.策略],
      assignedSoldiers: 5000
    },
    {
      id: 'emp2',
      name: '제국 원수 드라코',
      title: '용의 화신',
      stats: { power: 97, intelligence: 90, leadership: 96 },
      skills: [skills.thunderStrike, skills.ironDefense],
      assignedSoldiers: 4500
    },
    {
      id: 'emp3',
      name: '대장군 발키리',
      title: '전장의 여신',
      stats: { power: 95, intelligence: 88, leadership: 94 },
      skills: [skills.duel, skills.arrowRain],
      assignedSoldiers: 4000
    },
    {
      id: 'emp4',
      name: '대현자 아르카누스',
      title: '마법의 현자',
      stats: { power: 75, intelligence: 99, leadership: 92 },
      skills: [skills.策略, skills.healingRitual],
      assignedSoldiers: 3500
    },
    {
      id: 'emp5',
      name: '철벽장군 아이언클래드',
      title: '불패의 방패',
      stats: { power: 93, intelligence: 85, leadership: 95 },
      skills: [skills.ironDefense, skills.duel],
      assignedSoldiers: 4000
    }
  ]
}

// 멀티플레이 - 다른 플레이어들 (목 데이터)
export const mockPlayers: PlayerProfile[] = [
  {
    id: 'player1',
    username: '드래곤슬레이어',
    kingdomName: '용의 둥지',
    level: 25,
    rank: 1,
    totalWins: 145,
    totalLosses: 32,
    trophies: 2850,
    lastActive: new Date(Date.now() - 3600000), // 1시간 전
    kingdom: {
      id: 'k1',
      name: '용의 둥지',
      ruler: '드래곤슬레이어',
      resources: { food: 8000, gold: 6000, soldiers: 3500, morale: 85 },
      day: 50
    },
    generals: [
      {
        id: 'p1g1',
        name: '화염용사 이그니스',
        title: '용살자',
        stats: { power: 95, intelligence: 70, leadership: 88 },
        skills: [skills.thunderStrike, skills.duel],
        assignedSoldiers: 2000
      },
      {
        id: 'p1g2',
        name: '마법사 메를린',
        title: '현자',
        stats: { power: 50, intelligence: 98, leadership: 85 },
        skills: [skills.策略, skills.healingRitual],
        assignedSoldiers: 1500
      }
    ]
  },
  {
    id: 'player2',
    username: '전략의달인',
    kingdomName: '지혜의 탑',
    level: 22,
    rank: 2,
    totalWins: 132,
    totalLosses: 28,
    trophies: 2640,
    lastActive: new Date(Date.now() - 7200000), // 2시간 전
    kingdom: {
      id: 'k2',
      name: '지혜의 탑',
      ruler: '전략의달인',
      resources: { food: 7500, gold: 5500, soldiers: 3200, morale: 90 },
      day: 45
    },
    generals: [
      {
        id: 'p2g1',
        name: '책략가 공명',
        title: '천재 군사',
        stats: { power: 55, intelligence: 99, leadership: 92 },
        skills: [skills.策略, skills.ironDefense],
        assignedSoldiers: 1800
      },
      {
        id: 'p2g2',
        name: '검성 무명',
        title: '검의 달인',
        stats: { power: 90, intelligence: 65, leadership: 75 },
        skills: [skills.duel, skills.thunderStrike],
        assignedSoldiers: 1400
      }
    ]
  },
  {
    id: 'player3',
    username: '무적의전사',
    kingdomName: '강철요새',
    level: 20,
    rank: 3,
    totalWins: 118,
    totalLosses: 35,
    trophies: 2420,
    lastActive: new Date(Date.now() - 10800000), // 3시간 전
    kingdom: {
      id: 'k3',
      name: '강철요새',
      ruler: '무적의전사',
      resources: { food: 7000, gold: 5000, soldiers: 4000, morale: 80 },
      day: 42
    },
    generals: [
      {
        id: 'p3g1',
        name: '철벽장군 타노스',
        title: '불패의 수호자',
        stats: { power: 88, intelligence: 60, leadership: 95 },
        skills: [skills.ironDefense, skills.duel],
        assignedSoldiers: 2500
      },
      {
        id: 'p3g2',
        name: '궁수왕 로빈',
        title: '백발백중',
        stats: { power: 82, intelligence: 70, leadership: 72 },
        skills: [skills.arrowRain, skills.策略],
        assignedSoldiers: 1500
      }
    ]
  },
  {
    id: 'player4',
    username: '폭풍전사',
    kingdomName: '천둥의 땅',
    level: 18,
    rank: 4,
    totalWins: 95,
    totalLosses: 42,
    trophies: 2180,
    lastActive: new Date(Date.now() - 14400000), // 4시간 전
    kingdom: {
      id: 'k4',
      name: '천둥의 땅',
      ruler: '폭풍전사',
      resources: { food: 6500, gold: 4800, soldiers: 3300, morale: 78 },
      day: 38
    },
    generals: [
      {
        id: 'p4g1',
        name: '뇌신 제우스',
        title: '천둥의 주인',
        stats: { power: 91, intelligence: 75, leadership: 80 },
        skills: [skills.thunderStrike, skills.arrowRain],
        assignedSoldiers: 2000
      }
    ]
  },
  {
    id: 'player5',
    username: '그림자군주',
    kingdomName: '어둠의 왕국',
    level: 19,
    rank: 5,
    totalWins: 103,
    totalLosses: 48,
    trophies: 2050,
    lastActive: new Date(Date.now() - 18000000), // 5시간 전
    kingdom: {
      id: 'k5',
      name: '어둠의 왕국',
      ruler: '그림자군주',
      resources: { food: 6000, gold: 4500, soldiers: 3100, morale: 72 },
      day: 35
    },
    generals: [
      {
        id: 'p5g1',
        name: '암살자 섀도우',
        title: '어둠의 검',
        stats: { power: 85, intelligence: 88, leadership: 70 },
        skills: [skills.策略, skills.duel],
        assignedSoldiers: 1800
      },
      {
        id: 'p5g2',
        name: '마녀 모르가나',
        title: '저주의 마녀',
        stats: { power: 60, intelligence: 92, leadership: 75 },
        skills: [skills.策略, skills.healingRitual],
        assignedSoldiers: 1300
      }
    ]
  }
]


// 갈림길 카드 (25일마다)
export const crossroadCards: CrossroadCard[] = [
  {
    id: "crossroad1",
    title: "🌟 왕국의 갈림길",
    description: "왕국이 중대한 기로에 섰습니다. 어느 길을 선택하시겠습니까?",
    choices: [
      {
        text: "🌾 농업 혁명",
        description: "신기술을 도입하여 농업 생산성을 비약적으로 향상시킵니다.",
        effect: {
          type: "production",
          name: "농업 혁명",
          description: "매일 식량 생산 +50%",
          value: { foodBonus: 50 }
        }
      },
      {
        text: "💰 상업 번영",
        description: "무역로를 개척하고 상업을 발전시킵니다.",
        effect: {
          type: "production",
          name: "상업 번영",
          description: "매일 금 생산 +50%",
          value: { goldBonus: 50 }
        }
      },
      {
        text: "⚔️ 군사 개혁",
        description: "군대를 효율적으로 재편하여 유지비를 절감합니다.",
        effect: {
          type: "discount",
          name: "군사 개혁",
          description: "병력 유지비 -50%",
          value: { upkeepDiscount: 50 }
        }
      }
    ]
  },
  {
    id: "crossroad2",
    title: "🏛️ 왕국의 미래",
    description: "왕국의 미래를 결정할 중요한 선택의 순간입니다.",
    choices: [
      {
        text: "👥 민심 안정",
        description: "백성들의 삶의 질을 개선하여 영구적으로 민심을 높입니다.",
        effect: {
          type: "bonus",
          name: "민심 안정",
          description: "영구 민심 +15",
          value: { moraleBonus: 15 }
        }
      },
      {
        text: "🛡️ 병력 모집 개선",
        description: "징병 제도를 개선하여 병력 모집 비용을 절감합니다.",
        effect: {
          type: "discount",
          name: "징병 제도 개선",
          description: "병력 모집 비용 -50%",
          value: { recruitDiscount: 50 }
        }
      },
      {
        text: "⚡ 전투 훈련 강화",
        description: "정예 훈련으로 전투력을 향상시킵니다.",
        effect: {
          type: "bonus",
          name: "정예 훈련",
          description: "전투 승률 +20%",
          value: { battleBonus: 20 }
        }
      }
    ]
  }
]

// 랜덤 이름 생성용 데이터
const firstNames = [
  '강철의', '불꽃의', '얼음의', '그림자', '빛의', '어둠의', '번개', '폭풍의', '대지의', '천상의',
  '지옥의', '영원한', '불멸의', '광기의', '지혜의', '용맹한', '잔혹한', '냉혹한', '고독한', '광란의',
  '침묵의', '절망의', '희망의', '분노의', '복수의', '정의의', '악마의', '천사의', '신성한', '저주받은'
]

const lastNames = [
  '카론', '엘리온', '리나', '아르테미스', '드라코', '발키리', '아르카누스', '모르간', '레온', '제우스',
  '섀도우', '모르가나', '이그니스', '메를린', '공명', '무명', '타노스', '로빈', '아킬레스', '헥토르',
  '오딘', '토르', '로키', '프레이야', '헤라', '아테나', '포세이돈', '하데스', '아레스', '아폴론'
]

const titles = [
  '불패의 맹장', '지혜의 책사', '신궁', '백전노장', '용의 화신', '전장의 여신', '마법의 현자',
  '어둠의 군주', '빛의 수호자', '천둥의 주인', '어둠의 검', '저주의 마녀', '용살자', '검의 달인',
  '불패의 수호자', '백발백중', '전사의 왕', '암흑기사', '성검의 주인', '광전사', '무쌍의 영웅',
  '철벽의 방패', '질풍의 칼날', '혈전의 귀신', '전략의 대가', '파괴자', '학살자', '구원자', '심판자'
]

// 랜덤 적 장수 생성
export const generateRandomEnemy = (): General => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const title = titles[Math.floor(Math.random() * titles.length)]

  // 스킬 랜덤 선택 (2-3개)
  const skillCount = 2 + Math.floor(Math.random() * 2)
  const selectedSkills: Skill[] = []
  const availableSkills = [...skillsArray]

  for (let i = 0; i < skillCount && availableSkills.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableSkills.length)
    const skill = availableSkills[randomIndex]
    if (skill) {
      selectedSkills.push(skill)
      availableSkills.splice(randomIndex, 1)
    }
  }

  // 능력치 랜덤 생성 (60-95)
  const power = 60 + Math.floor(Math.random() * 36)
  const intelligence = 60 + Math.floor(Math.random() * 36)
  const leadership = 60 + Math.floor(Math.random() * 36)

  // 병력 수 랜덤 (1000-2500)
  const soldiers = 1000 + Math.floor(Math.random() * 1501)

  // 능력치 합계로 등급 결정
  const totalStats = power + intelligence + leadership
  let rarity: 'common' | 'rare' | 'epic'
  if (totalStats >= 250) {
    rarity = 'epic'
  } else if (totalStats >= 220) {
    rarity = 'rare'
  } else {
    rarity = 'common'
  }

  return {
    id: `random-${Date.now()}-${Math.random()}`,
    name: `${firstName} ${lastName}`,
    title: title || '전사',
    rarity,
    stats: { power, intelligence, leadership },
    skills: selectedSkills,
    assignedSoldiers: soldiers
  }
}

// 랜덤 적군 생성 (1-3명)
export const generateRandomEnemies = (count?: number): General[] => {
  const enemyCount = count || (1 + Math.floor(Math.random() * 3))
  const enemies: General[] = []

  for (let i = 0; i < enemyCount; i++) {
    enemies.push(generateRandomEnemy())
  }

  return enemies
}
