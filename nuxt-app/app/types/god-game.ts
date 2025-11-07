// 계명 타입 정의
export interface Commandment {
  id: string
  name: string
  description: string
  icon: string
  pros: string[]
  cons: string[]
  effects: {
    morale: number // 민심 (기존 happiness + order)
    gold: number // 금 (기존 economy)
    military: number // 군사력
    food: number // 식량
    population: number // 인구 증가율
  }
}

// 나라 상태
export interface NationState {
  name: string
  selectedCommandments: Commandment[]
  stats: {
    morale: number // 민심
    gold: number // 금
    military: number // 군사력
    food: number // 식량
    population: number // 인구
    year: number // 년도
  }
  events: GameEvent[]
}

// 게임 이벤트
export interface GameEvent {
  id: string
  year: number
  title: string
  description: string
  choices: EventChoice[]
}

export interface EventChoice {
  text: string
  effects: Partial<NationState['stats']>
}

// 사용 가능한 계명 리스트
export const AVAILABLE_COMMANDMENTS: Commandment[] = [
  {
    id: 'no-fighting',
    name: '싸우지 마라',
    description: '모든 형태의 폭력과 전쟁을 금지한다',
    icon: '☮️',
    pros: [
      '민심 크게 상승',
      '평화로운 사회 형성',
      '문화와 예술 발전'
    ],
    cons: [
      '외부 침략에 취약',
      '군사력 대폭 약화',
      '범죄자 처벌 어려움'
    ],
    effects: {
      morale: 25,
      gold: 10,
      military: -35,
      food: 5,
      population: 10
    }
  },
  {
    id: 'no-adultery',
    name: '혼외자와 관계를 맺지 마라',
    description: '결혼한 자는 배우자 외의 사람과 성관계를 금지한다',
    icon: '💑',
    pros: [
      '가정의 안정으로 민심 안정',
      '출산율 증가로 인구 증가',
      '도덕적 사회 구축'
    ],
    cons: [
      '개인의 자유 제한',
      '이혼율 증가 가능성',
      '은밀한 범죄 증가'
    ],
    effects: {
      morale: 20,
      gold: 5,
      military: 0,
      food: 0,
      population: 15
    }
  },
  {
    id: 'no-coveting',
    name: '남의 것을 탐내지 마라',
    description: '타인의 재산과 지위를 부러워하거나 빼앗지 말라',
    icon: '🚫',
    pros: [
      '사회 안정으로 민심 상승',
      '범죄율 감소',
      '공동체 의식 강화'
    ],
    cons: [
      '경쟁심 약화로 금 생산 둔화',
      '야망 있는 인재 유출',
      '군사력 약화'
    ],
    effects: {
      morale: 30,
      gold: -15,
      military: -10,
      food: 5,
      population: 0
    }
  },
  {
    id: 'pay-taxes',
    name: '세금을 내라',
    description: '모든 국민은 수입의 일정 부분을 세금으로 납부해야 한다',
    icon: '💰',
    pros: [
      '국가 금고 대폭 증가',
      '공공 시설 발전',
      '강력한 군대 유지 가능'
    ],
    cons: [
      '민심 크게 하락',
      '탈세 시도 증가',
      '인구 이탈'
    ],
    effects: {
      morale: -20,
      gold: 40,
      military: 25,
      food: 0,
      population: -10
    }
  },
  {
    id: 'serve-nation',
    name: '나라에 봉사하라',
    description: '모든 성인은 일정 기간 국가를 위해 봉사해야 한다',
    icon: '🎖️',
    pros: [
      '강력한 군사력 확보',
      '애국심 고취',
      '식량 생산 증가'
    ],
    cons: [
      '개인의 자유 제한으로 민심 하락',
      '금 생산 감소',
      '젊은 층의 반발'
    ],
    effects: {
      morale: -15,
      gold: -10,
      military: 45,
      food: 15,
      population: -5
    }
  },
  {
    id: 'honor-parents',
    name: '부모를 공경하라',
    description: '자식은 부모를 존경하고 모셔야 한다',
    icon: '👴',
    pros: [
      '전통 가치로 민심 안정',
      '노인 복지 자연 해결',
      '세대 간 화합'
    ],
    cons: [
      '노인 부양 부담으로 금 감소',
      '젊은 세대 경제적 압박',
      '사회 변화 저항'
    ],
    effects: {
      morale: 20,
      gold: -10,
      military: 5,
      food: 0,
      population: 10
    }
  },
  {
    id: 'no-lying',
    name: '거짓말을 하지 마라',
    description: '모든 거짓말과 속임수를 금지한다',
    icon: '🤥',
    pros: [
      '신뢰 사회로 민심 상승',
      '상거래 투명성으로 금 증가',
      '법적 분쟁 감소'
    ],
    cons: [
      '외교적 불리함',
      '군사 작전 어려움',
      '비밀 유지 불가'
    ],
    effects: {
      morale: 25,
      gold: 20,
      military: -20,
      food: 0,
      population: 0
    }
  },
  {
    id: 'no-stealing',
    name: '도둑질하지 마라',
    description: '타인의 재산을 훔치는 모든 행위를 금지한다',
    icon: '🔒',
    pros: [
      '재산권 보호로 금 증가',
      '경제 활동 활성화',
      '사회 안정으로 민심 상승'
    ],
    cons: [
      '빈부격차 심화',
      '궁핍한 자의 생존 위협',
      '혁명 가능성으로 인구 감소'
    ],
    effects: {
      morale: 20,
      gold: 25,
      military: 10,
      food: 0,
      population: -10
    }
  },
  {
    id: 'work-hard',
    name: '열심히 일하라',
    description: '모든 국민은 게으름 피우지 않고 근면해야 한다',
    icon: '💪',
    pros: [
      '금 대폭 증가',
      '식량 생산 증가',
      '국가 경쟁력 상승'
    ],
    cons: [
      '과로로 민심 크게 하락',
      '삶의 질 저하',
      '출산율 감소로 인구 감소'
    ],
    effects: {
      morale: -25,
      gold: 45,
      military: 15,
      food: 25,
      population: -20
    }
  },
  {
    id: 'share-wealth',
    name: '부를 나누라',
    description: '부유한 자는 가난한 자와 재산을 나눠야 한다',
    icon: '🤝',
    pros: [
      '빈부격차 해소로 민심 대폭 상승',
      '사회 안정성 증가',
      '인구 증가'
    ],
    cons: [
      '부자들의 이탈로 금 감소',
      '근로 의욕 저하',
      '군사력 약화'
    ],
    effects: {
      morale: 35,
      gold: -30,
      military: -5,
      food: 10,
      population: 15
    }
  },
  {
    id: 'protect-nature',
    name: '자연을 보호하라',
    description: '환경을 훼손하는 모든 행위를 제한한다',
    icon: '🌳',
    pros: [
      '지속 가능한 발전',
      '식량 생산 증가',
      '건강한 환경으로 인구 증가'
    ],
    cons: [
      '산업 발전 제한으로 금 감소',
      '군사 시설 건설 어려움',
      '일자리 감소'
    ],
    effects: {
      morale: 20,
      gold: -20,
      military: -10,
      food: 30,
      population: 15
    }
  },
  {
    id: 'pursue-knowledge',
    name: '지식을 추구하라',
    description: '모든 국민은 교육받고 학문을 연구해야 한다',
    icon: '📚',
    pros: [
      '기술 발전으로 금 증가',
      '인재 양성',
      '문명 수준 향상으로 민심 상승'
    ],
    cons: [
      '교육 비용으로 초기 금 감소',
      '즉각적 식량 생산 감소',
      '실용성 약화'
    ],
    effects: {
      morale: 15,
      gold: 10,
      military: 10,
      food: -10,
      population: 5
    }
  }
]