<template>
  <div class="main-page">
    <!-- Phaser 배경 효과 -->
    <PhaserBackground />

    <!-- 중앙 배경 이미지 -->
    <div class="center-background-image"></div>

    <!-- 왕국 헤더 -->
    <header class="kingdom-header">
      <div class="kingdom-banner">
        <div class="banner-decoration left"></div>
        <div class="banner-center">
          <div class="crown-emblem">👑</div>
          <div class="kingdom-title">
            <h1 class="kingdom-name">{{ kingdom.name }}</h1>
            <p class="kingdom-subtitle">제{{ kingdom.day }}일 통치</p>
          </div>
        </div>
        <div class="banner-decoration right"></div>
      </div>
    </header>

      <div class="kingdom-stats-panel">
          <div class="stat-row">
            <div class="stat-badge">
              <span class="stat-icon">📅</span>
              <div class="stat-content">
                <span class="stat-label">재위 기간</span>
                <span class="stat-value">{{ kingdom.day }} 일</span>
              </div>
            </div>
            <div class="stat-badge" v-if="reincarnationData.count > 0">
              <span class="stat-icon">♻️</span>
              <div class="stat-content">
                <span class="stat-label">환생</span>
                <span class="stat-value">{{ reincarnationData.count }} 회</span>
              </div>
            </div>
          </div>

          <!-- 남은 시간 -->
          <div class="time-remaining-card" :class="{ 'time-expired': remainingTime.isExpired, 'time-critical': remainingTime.days < 3 && !remainingTime.isExpired }">
            <div class="time-header">
              <span class="time-icon">⏰</span>
              <span class="time-title">대전쟁 종료까지</span>
            </div>
            <div class="time-display">
              <div v-if="!remainingTime.isExpired" class="time-blocks">
                <div class="time-block">
                  <span class="time-number">{{ remainingTime.days }}</span>
                  <span class="time-unit">일</span>
                </div>
                <div class="time-separator">:</div>
                <div class="time-block">
                  <span class="time-number">{{ remainingTime.hours }}</span>
                  <span class="time-unit">시</span>
                </div>
                <div class="time-separator">:</div>
                <div class="time-block">
                  <span class="time-number">{{ remainingTime.minutes }}</span>
                  <span class="time-unit">분</span>
                </div>
                <div class="time-separator">:</div>
                <div class="time-block">
                  <span class="time-number">{{ remainingTime.seconds }}</span>
                  <span class="time-unit">초</span>
                </div>
              </div>
              <div v-else class="time-up-message">전쟁 종료!</div>
            </div>
          </div>

          <!-- 신의 계명 -->
          <div v-if="godGameState && godGameState.selectedCommandments.length > 0" class="commandments-panel">
            <h3 class="panel-title">✨ 신의 계명</h3>
            <div class="commandments-grid">
              <div
                v-for="commandment in godGameState.selectedCommandments"
                :key="commandment.id"
                class="commandment-item"
                :title="commandment.description"
              >
                <span class="commandment-icon">{{ commandment.icon }}</span>
                <span class="commandment-name">{{ commandment.name }}</span>
              </div>
            </div>
          </div>

          <!-- 패시브 카드 섹션 -->
          <div v-if="playerPassiveCards.length > 0" class="passive-cards-panel">
            <div class="passive-panel-background"></div>
            <h3 class="panel-title">🎴 보유한 패시브 카드</h3>
            <div class="passive-cards-list">
              <div v-for="(card, index) in playerPassiveCards" :key="index" class="passive-card-item" :class="'rarity-' + card.rarity">
                <span class="passive-card-icon">{{ card.icon }}</span>
                <div class="passive-card-info">
                  <div class="passive-card-name">{{ card.name }}</div>
                  <div class="passive-card-trigger">{{ getTriggerLabel(card.trigger) }}</div>
                </div>
                <span class="passive-card-rarity">{{ getRarityLabel(card.rarity) }}</span>
              </div>
            </div>
          </div>
        </div>

      <!-- 왕국 재화 (오른쪽) -->
      <div class="kingdom-resources-panel">
          <h3 class="panel-title">⚜️ 왕국의 재화</h3>
          <div class="resources-grid">
            <div class="resource-card food">
              <div class="resource-header">
                <span class="resource-icon">🌾</span>
                <span class="resource-label">식량</span>
              </div>
              <div class="resource-amount">{{ kingdom.resources.food.toLocaleString() }}</div>
              <div class="resource-bar">
                <div class="resource-bar-fill" :style="{ width: Math.min(100, kingdom.resources.food / 100) + '%' }"></div>
              </div>
            </div>

            <div class="resource-card gold">
              <div class="resource-header">
                <span class="resource-icon">💰</span>
                <span class="resource-label">금</span>
              </div>
              <div class="resource-amount">{{ kingdom.resources.gold.toLocaleString() }}</div>
              <div class="resource-bar">
                <div class="resource-bar-fill" :style="{ width: Math.min(100, kingdom.resources.gold / 100) + '%' }"></div>
              </div>
            </div>

            <div class="resource-card soldiers">
              <div class="resource-header">
                <span class="resource-icon">⚔️</span>
                <span class="resource-label">병력</span>
              </div>
              <div class="resource-amount">{{ kingdom.resources.soldiers.toLocaleString() }}</div>
              <div class="resource-bar">
                <div class="resource-bar-fill" :style="{ width: Math.min(100, kingdom.resources.soldiers / 50) + '%' }"></div>
              </div>
            </div>

            <div class="resource-card morale">
              <div class="resource-header">
                <span class="resource-icon">❤️</span>
                <span class="resource-label">민심</span>
              </div>
              <div class="resource-amount">{{ kingdom.resources.morale }}%</div>
              <div class="resource-bar">
                <div class="resource-bar-fill" :style="{ width: kingdom.resources.morale + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- 제국 정복 진행도 -->
          <div class="empire-conquest-panel">
            <div class="conquest-header">
              <span class="conquest-icon">⚡</span>
              <h3 class="conquest-title">{{ empire.name }} 정복</h3>
            </div>
            <div class="conquest-progress">
              <div class="conquest-stats">
                <span class="conquest-label">정복한 요새</span>
                <span class="conquest-count">{{ empire.defeatedFortresses }} / {{ empire.totalFortresses }}</span>
              </div>
              <div class="conquest-bar">
                <div class="conquest-bar-fill" :style="{ width: (empire.defeatedFortresses / empire.totalFortresses * 100) + '%' }">
                  <span class="conquest-percentage">{{ Math.floor(empire.defeatedFortresses / empire.totalFortresses * 100) }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 전투 준비 현황 -->
          <div class="battle-status-panel">
            <h3 class="panel-title">⚔️ 전투 준비 현황</h3>
            <div class="battle-stats-grid">
              <div class="battle-stat-card">
                <span class="battle-stat-icon">👥</span>
                <div class="battle-stat-info">
                  <span class="battle-stat-label">보유 장수</span>
                  <span class="battle-stat-value">{{ generals.length }}<span class="battle-stat-unit">명</span></span>
                </div>
              </div>

              <div class="battle-stat-card">
                <span class="battle-stat-icon">🛡️</span>
                <div class="battle-stat-info">
                  <span class="battle-stat-label">배치 병력</span>
                  <span class="battle-stat-value">{{ generals.reduce((sum, g) => sum + g.assignedSoldiers, 0).toLocaleString() }}</span>
                </div>
              </div>

              <div class="battle-stat-card">
                <span class="battle-stat-icon">🏆</span>
                <div class="battle-stat-info">
                  <span class="battle-stat-label">전투 준비도</span>
                  <span class="battle-stat-value" :class="{ 'ready': generals.some(g => g.assignedSoldiers > 0) }">
                    {{ generals.some(g => g.assignedSoldiers > 0) ? '준비 완료' : '미완료' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
    <aside class="action-sidebar">
      <div class="action-scroll">
        <button class="royal-action-card" @click="showGenerals = true">
          <div class="general-background-image"></div>
          <div class="action-ornament top"></div>
          <div class="action-card-inner">
            <div class="action-icon-wrapper">
              <div class="action-icon-bg"></div>
              <span class="action-icon">👥</span>
            </div>
            <div class="action-content">
              <h3 class="action-title">장수 관리</h3>
              <p class="action-desc">장수를 확인하고 병력을 배치합니다</p>
            </div>
          </div>
          <div class="action-ornament bottom"></div>
        </button>

        <button class="royal-action-card battle" @click="selectBattleType('pve')">
          <div class="battle-background-image"></div>
          <div class="action-ornament top"></div>
          <div class="action-card-inner">
            <div class="action-icon-wrapper">
              <div class="action-icon-bg"></div>
              <span class="action-icon">⚔️</span>
            </div>
            <div class="action-content">
              <h3 class="action-title">제국 침략</h3>
              <p class="action-desc">제국의 요새를 공격합니다</p>
            </div>
          </div>
          <div class="action-ornament bottom"></div>
        </button>

        <button class="royal-action-card event" @click="drawEventCard">
          <div class="event-background-image"></div>
          <div class="action-ornament top"></div>
          <div class="action-card-inner">
            <div class="action-icon-wrapper">
              <div class="action-icon-bg"></div>
              <span class="action-icon">🎴</span>
            </div>
            <div class="action-content">
              <h3 class="action-title">다음 날</h3>
              <p class="action-desc">하루를 보내고 랜덤 이벤트 발생</p>
            </div>
          </div>
          <div class="action-ornament bottom"></div>
        </button>

        <button class="royal-action-card recruit" @click="recruitSoldiers">
          <div class="recruit-background-image"></div>
          <div class="action-ornament top"></div>
          <div class="action-card-inner">
            <div class="action-icon-wrapper">
              <div class="action-icon-bg"></div>
              <span class="action-icon">🛡️</span>
            </div>
            <div class="action-content">
              <h3 class="action-title">병력 모집</h3>
              <p class="action-desc">금 200으로 병력 100 모집</p>
            </div>
          </div>
          <div class="action-ornament bottom"></div>
        </button>
      </div>
    </aside>
      </div>

    <!-- 게임 컨텐츠 영역 -->
    <div class="game-content">
      <!-- 메인 컨텐츠 영역 -->
      <main class="main-content">
        <div class="royal-info-panel">
          <div class="panel-header">
            <div class="panel-header-decoration left"></div>
            <div class="panel-header-center">
              <span class="panel-icon">📜</span>
              <h3 class="panel-header-title">왕국 현황</h3>
            </div>
            <div class="panel-header-decoration right"></div>
          </div>

          <!-- 영구 효과 섹션 -->
          <div v-if="permanentEffects.length > 0" class="royal-effects-section">
            <div class="section-divider">
              <div class="divider-line"></div>
              <span class="divider-text">✨ 왕국의 영구 효과</span>
              <div class="divider-line"></div>
            </div>
            <div class="royal-effects-list">
              <div v-for="(effect, index) in permanentEffects" :key="index" class="royal-effect-item">
                <div class="effect-icon-wrapper">
                  <span class="effect-icon">✨</span>
                </div>
                <div class="effect-info">
                  <div class="effect-name">{{ effect.name }}</div>
                  <div class="effect-description">{{ effect.description }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="tip-section">
            <h4>💡 게임 팁</h4>
            <ul>
              <li v-if="godGameState">선택한 계명이 왕국의 초기 자원에 영향을 줬습니다</li>
              <li>장수에게 병력을 배치한 후 침략을 시작하세요</li>
              <li>텍스트 전투: 클래식한 턴제 전투</li>
              <li>Phaser 전투: 실시간 애니메이션 전투</li>
              <li>민심이 낮아지면 병력 모집이 어려워집니다</li>
              <li>25일마다 왕국의 운명을 결정하는 갈림길이 나타납니다</li>
            </ul>
          </div>
        </div>
      </main>
    </div>

    <!-- 장수 관리 모달 -->
    <Transition name="modal">
      <div v-if="showGenerals" class="modal-overlay" @click="showGenerals = false">
        <div class="modal-content generals-modal" @click.stop>
          <div class="modal-header">
            <h2>⚔️ 장수 관리</h2>
            <button class="btn-close" @click="showGenerals = false">✕</button>
          </div>
          <div class="generals-grid">
            <div v-for="general in generals" :key="general.id" class="general-card-new">
              <div class="general-image-container">
                <img :src="general.image" :alt="general.name" class="general-image" />
              </div>
              <div class="general-details">
                <div class="general-header">
                  <div>
                    <h3 class="general-name">{{ general.name }}</h3>
                    <p class="general-title">{{ general.title }}</p>
                  </div>
                  <span class="general-rarity-badge" :class="`rarity-${general.rarity}`">
                    {{ getRarityLabel(general.rarity) }}
                  </span>
                </div>

                <div class="stats-grid">
                  <div class="stat-item">
                    <span class="stat-icon">⚔️</span>
                    <div class="stat-info">
                      <span class="stat-label">무력</span>
                      <div class="stat-bar">
                        <div class="stat-fill power" :style="{ width: general.stats.power + '%' }"></div>
                      </div>
                      <span class="stat-value">{{ general.stats.power }}</span>
                    </div>
                  </div>
                  <div class="stat-item">
                    <span class="stat-icon">🧠</span>
                    <div class="stat-info">
                      <span class="stat-label">지력</span>
                      <div class="stat-bar">
                        <div class="stat-fill intelligence" :style="{ width: general.stats.intelligence + '%' }"></div>
                      </div>
                      <span class="stat-value">{{ general.stats.intelligence }}</span>
                    </div>
                  </div>
                  <div class="stat-item">
                    <span class="stat-icon">👑</span>
                    <div class="stat-info">
                      <span class="stat-label">통솔</span>
                      <div class="stat-bar">
                        <div class="stat-fill leadership" :style="{ width: general.stats.leadership + '%' }"></div>
                      </div>
                      <span class="stat-value">{{ general.stats.leadership }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="general.skills.length > 0" class="skills-section">
                  <h4>✨ 스킬</h4>
                  <div class="skills-list">
                    <div v-for="skill in general.skills" :key="skill.id" class="skill-badge">
                      <span class="skill-name">{{ skill.name }}</span>
                      <span class="skill-rate">{{ skill.successRate }}%</span>
                    </div>
                  </div>
                </div>
                <div v-else class="no-skills">
                  <span class="no-skills-text">💫 스킬 없음</span>
                </div>

                <div class="assign-soldiers">
                  <label>🎖️ 배치 병력</label>
                  <input
                    type="number"
                    v-model.number="general.assignedSoldiers"
                    :max="kingdom.resources.soldiers"
                    min="0"
                    step="100"
                    class="soldier-input"
                  />
                </div>

                <button class="btn-dismiss-general" @click="dismissGeneral(general.id)">
                  🗑️ 장수 해고
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 이벤트 카드 모달 -->
    <Transition name="modal">
      <div v-if="currentEvent" class="modal-overlay" @click="closeEvent">
        <div class="modal-content event-modal" @click.stop>
          <div class="event-card-design">
            <div class="event-header">
              <h2>🎴 {{ currentEvent.title }}</h2>
            </div>
            <p class="event-description">{{ currentEvent.description }}</p>
            <div class="event-choices">
              <button
                v-for="(choice, index) in currentEvent.choices"
                :key="index"
                class="choice-button"
                @click="selectChoice(choice)"
                :disabled="!canAffordChoice(choice)"
              >
                <div class="choice-text">{{ choice.text }}</div>
                <div class="choice-effects">
                  <div v-if="choice.cost && Object.keys(choice.cost).length > 0" class="choice-cost">
                    <strong>비용:</strong>
                    <span v-if="choice.cost.food" class="cost-item food">🌾 {{ choice.cost.food }}</span>
                    <span v-if="choice.cost.gold" class="cost-item gold">💰 {{ choice.cost.gold }}</span>
                    <span v-if="choice.cost.soldiers" class="cost-item soldiers">⚔️ {{ choice.cost.soldiers }}</span>
                  </div>
                  <div v-if="choice.reward && Object.keys(choice.reward).length > 0" class="choice-reward">
                    <strong>보상:</strong>
                    <span v-if="choice.reward.food" class="reward-item food">🌾 +{{ choice.reward.food }}</span>
                    <span v-if="choice.reward.gold" class="reward-item gold">💰 +{{ choice.reward.gold }}</span>
                    <span v-if="choice.reward.soldiers" class="reward-item soldiers">⚔️ +{{ choice.reward.soldiers }}</span>
                    <span v-if="choice.reward.morale" class="reward-item morale">❤️ {{ choice.reward.morale > 0 ? '+' : '' }}{{ choice.reward.morale }}</span>
                  </div>
                  <div v-if="choice.general" class="choice-general-preview">
                    <strong>⚔️ 장수:</strong>
                    <span class="general-preview-name">{{ choice.general.name }} ({{ choice.general.title }})</span>
                    <span class="general-preview-rarity" :class="`rarity-${choice.general.rarity}`">
                      {{ getRarityLabel(choice.general.rarity) }}
                    </span>
                    <div class="general-preview-stats">
                      무력 {{ choice.general.stats.power }} | 지력 {{ choice.general.stats.intelligence }} | 통솔 {{ choice.general.stats.leadership }}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 갈림길 카드 모달 -->
    <Transition name="modal">
      <div v-if="currentCrossroad" class="modal-overlay" @click="closeCrossroad">
        <div class="modal-content crossroad-modal" @click.stop>
          <div class="crossroad-card-design">
            <div class="crossroad-header">
              <h2>{{ currentCrossroad.title }}</h2>
              <div class="crossroad-subtitle">왕국의 운명을 결정할 선택의 순간</div>
            </div>
            <p class="crossroad-description">{{ currentCrossroad.description }}</p>
            <div class="crossroad-choices">
              <button
                v-for="(choice, index) in currentCrossroad.choices"
                :key="index"
                class="crossroad-choice-button"
                @click="selectCrossroadChoice(choice)"
              >
                <div class="choice-title">{{ choice.text }}</div>
                <div class="choice-desc">{{ choice.description }}</div>
                <div class="choice-permanent-effect">
                  <div class="effect-badge">
                    <span class="effect-icon">✨</span>
                    <span class="effect-name">{{ choice.effect.name }}</span>
                  </div>
                  <div class="effect-description">{{ choice.effect.description }}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ==================== PVP 관련 UI - 주석 처리됨 ==================== -->
    <!-- 전투 타입 선택 모달 (PVE vs PVP) -->
    <!--
    <Transition name="modal">
      <div v-if="showBattleTypeSelection" class="modal-overlay" @click="showBattleTypeSelection = false">
        <div class="modal-content battle-mode-modal" @click.stop>
          <div class="modal-header">
            <h2>⚔️ 전투 타입 선택</h2>
            <button class="btn-close" @click="showBattleTypeSelection = false">✕</button>
          </div>
          <div class="battle-mode-grid">
            <button class="mode-card pve-card" @click="selectBattleType('pve')">
              <div class="mode-icon">🏰</div>
              <h3>NPC 침략</h3>
              <p>AI 국가를 침략합니다</p>
            </button>
            <button class="mode-card pvp-card" @click="selectBattleType('pvp')">
              <div class="mode-icon">🎯</div>
              <h3>플레이어 대전</h3>
              <p>다른 플레이어와 대결합니다</p>
              <span class="pvp-badge">+트로피</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    PVP 상대 선택 모달
    <Transition name="modal">
      <div v-if="showPVPSelection" class="modal-overlay" @click="showPVPSelection = false">
        <div class="modal-content pvp-selection-modal" @click.stop>
          <div class="modal-header">
            <h2>🎯 상대 선택</h2>
            <button class="btn-close" @click="showPVPSelection = false">✕</button>
          </div>
          <div class="pvp-players-list">
            <div v-for="player in players" :key="player.id" class="player-card" @click="selectPVPOpponent(player)">
              <div class="player-rank">#{player.rank}</div>
              <div class="player-info">
                <h3>{{ player.username }}</h3>
                <p class="kingdom-name">{{ player.kingdomName }}</p>
                <div class="player-stats">
                  <span class="stat">🏆 {{ player.trophies }}</span>
                  <span class="stat">⚔️ {{ player.totalWins }}승</span>
                  <span class="stat">💀 {{ player.totalLosses }}패</span>
                </div>
              </div>
              <div class="player-generals">
                <span class="generals-count">장수 {{ player.generals.length }}명</span>
                <span class="soldiers-count">병력 {{ player.generals.reduce((sum, g) => sum + g.assignedSoldiers, 0).toLocaleString() }}</span>
              </div>
            </div>
          </div>
          <div class="pvp-footer">
            <button class="btn btn-secondary" @click="showLeaderboard = true; showPVPSelection = false">
              📊 리더보드 보기
            </button>
          </div>
        </div>
      </div>
    </Transition>

    리더보드 모달
    <Transition name="modal">
      <div v-if="showLeaderboard" class="modal-overlay" @click="showLeaderboard = false">
        <div class="modal-content leaderboard-modal" @click.stop>
          <div class="modal-header">
            <h2>🏆 리더보드</h2>
            <button class="btn-close" @click="showLeaderboard = false">✕</button>
          </div>
          <div class="leaderboard-content">
            <div class="my-rank-card">
              <h3>내 순위</h3>
              <div class="rank-display">
                <span class="rank-number">#{{ myProfile.rank || leaderboard.findIndex(p => p.id === 'me') + 1 }}</span>
                <div class="rank-info">
                  <p class="username">{{ myProfile.username }}</p>
                  <p class="trophies">🏆 {{ myProfile.trophies }} 트로피</p>
                  <p class="record">{{ myProfile.totalWins }}승 {{ myProfile.totalLosses }}패</p>
                </div>
              </div>
            </div>
            <div class="leaderboard-list">
              <div v-for="entry in leaderboard" :key="entry.id"
                   :class="['leaderboard-entry', { 'is-me': entry.id === 'me' }]">
                <div class="entry-rank">
                  <span v-if="entry.rank === 1">🥇</span>
                  <span v-else-if="entry.rank === 2">🥈</span>
                  <span v-else-if="entry.rank === 3">🥉</span>
                  <span v-else>#{{ entry.rank }}</span>
                </div>
                <div class="entry-info">
                  <h4>{{ entry.username }}</h4>
                  <p>{{ entry.kingdomName }}</p>
                </div>
                <div class="entry-stats">
                  <span class="trophy">🏆 {{ entry.trophies }}</span>
                  <span class="record">{{ entry.wins }}승 {{ entry.losses }}패</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    -->
    <!-- ==================== PVP 관련 UI 끝 ==================== -->


    <!-- 스토리 전투 모달 -->
    <Transition name="modal">
      <div v-if="currentBattle" class="modal-overlay">
        <div class="modal-content story-battle-modal" @click.stop>
          <div class="story-battle-header">
            <div class="battle-title">
              <h2>⚔️ 전장의 기록</h2>
            </div>
            <div class="battle-vs">
              <span class="kingdom-name attacker">{{ currentBattle.attacker.kingdomName }}</span>
              <span class="vs-text">VS</span>
              <span class="kingdom-name defender">{{ currentBattle.defender.kingdomName }}</span>
            </div>
          </div>

          <div class="story-battle-log" ref="battleLogContainer">
            <div class="story-scroll-container" :class="{ 'scrolling': isScrolling }">
              <div class="story-book">
                <div class="story-text">
                  <p v-for="(log, index) in currentBattle.log" :key="index"
                     :class="getTextClass(log)">
                    <span v-if="log.narrativeType === 'narration'">{{ log.story }}</span>
                    <span v-else-if="log.narrativeType === 'action'">{{ log.story }}</span>
                    <span v-else-if="log.narrativeType === 'dialogue'" class="dialogue-text">"{{ log.dialogue }}"</span>
                  </p>
                  <div class="story-spacer"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="currentBattle.result" class="story-battle-result">
            <div :class="['result-banner', currentBattle.result]">
              <h3>{{ currentBattle.result === 'victory' ? '🎉 승리!' : '😢 패배...' }}</h3>
              <p v-if="currentBattle.result === 'victory'">전리품: 금 +500, 식량 +300</p>
              <!-- PVP 트로피 표시 (주석 처리됨) -->
              <!--
              <p v-if="battleType === 'pvp'">
                트로피: {{ currentBattle.result === 'victory' ? '+30' : '-20' }}
              </p>
              -->
            </div>
            <button class="btn btn-primary btn-large" @click="closeBattle">전장을 떠난다</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 패시브 카드 선택 모달 -->
    <Transition name="modal">
      <div v-if="showPassiveCardSelection" class="modal-overlay" @click.self="() => {}">
        <div class="passive-card-modal">
          <div class="passive-modal-header">
            <h2>🎴 축복의 카드</h2>
            <p>25일이 지났습니다! 3장 중 1장의 패시브 카드를 선택하세요.</p>
          </div>

          <div class="passive-cards-grid">
            <div
              v-for="card in availablePassiveCards"
              :key="card.id"
              class="passive-card"
              :class="'rarity-' + card.rarity"
              @click="selectPassiveCard(card)"
            >
              <!-- 카드 이미지 배경 -->
              <div class="card-image-container">
                <img :src="card.image" :alt="card.name" class="card-image" />
                <div class="card-image-overlay"></div>
              </div>

              <!-- 카드 컨텐츠 -->
              <div class="card-content-wrapper">
                <div class="passive-card-header">
                  <div class="passive-card-icon">{{ card.icon }}</div>
                  <div class="passive-card-rarity">{{ getRarityLabel(card.rarity) }}</div>
                </div>
                <h3 class="passive-card-name">{{ card.name }}</h3>
                <p class="passive-card-description">{{ card.description }}</p>
                <div class="passive-card-trigger">
                  <span class="trigger-badge">{{ getTriggerLabel(card.trigger) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 환생 모달 -->
    <Transition name="modal">
      <div v-if="showReincarnationModal" class="modal-overlay" @click.self="() => {}">
        <div class="reincarnation-modal">
          <div class="reincarnation-header">
            <h2>💫 환생의 시간</h2>
            <p>100일을 견뎌냈습니다! 환생하여 더 강해질 시간입니다.</p>
            <div class="reincarnation-stats">
              <div class="reincarnation-stat">
                <span class="stat-label">환생 횟수</span>
                <span class="stat-value">{{ reincarnationData.count + 1 }}회</span>
              </div>
              <div class="reincarnation-stat">
                <span class="stat-label">최고 기록</span>
                <span class="stat-value">{{ Math.max(reincarnationData.highestDay, kingdom.day) }}일</span>
              </div>
              <div class="reincarnation-stat">
                <span class="stat-label">총 플레이</span>
                <span class="stat-value">{{ reincarnationData.totalDaysPlayed + kingdom.day }}일</span>
              </div>
            </div>
          </div>

          <div v-if="availableCardsForReincarnation.length > 0" class="reincarnation-content">
            <h3>🎴 상속할 카드를 선택하세요</h3>
            <p class="reincarnation-description">선택한 카드는 다음 게임 시작 시 자동으로 적용됩니다.</p>

            <div class="reincarnation-cards-grid">
              <div
                v-for="card in availableCardsForReincarnation"
                :key="card.id"
                class="reincarnation-card"
                :class="'rarity-' + card.rarity"
                @click="selectInheritedCard(card)"
              >
                <div class="card-image-container">
                  <img :src="card.image" :alt="card.name" class="card-image" />
                  <div class="card-image-overlay"></div>
                </div>
                <div class="card-content-wrapper">
                  <div class="passive-card-header">
                    <div class="passive-card-icon">{{ card.icon }}</div>
                    <div class="passive-card-rarity">{{ getRarityLabel(card.rarity) }}</div>
                  </div>
                  <h3 class="passive-card-name">{{ card.name }}</h3>
                  <p class="passive-card-description">{{ card.description }}</p>
                  <div class="passive-card-trigger">
                    <span class="trigger-badge">{{ getTriggerLabel(card.trigger) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="reincarnation-actions">
              <button @click="reincarnateWithoutCard" class="btn btn-secondary">
                카드 없이 환생
              </button>
            </div>
          </div>

          <div v-else class="reincarnation-content">
            <div class="no-cards-message">
              <p>보유한 패시브 카드가 없습니다.</p>
              <p>환생하여 새로운 시작을 하세요!</p>
              <button @click="reincarnateWithoutCard" class="btn btn-primary btn-large">
                <span class="btn-icon">💫</span>
                환생하기
              </button>
            </div>
          </div>
        </div>
      </div>

    </Transition>

    <!-- 알림 메시지 -->
    <Transition name="notification">
      <div v-if="notification" :class="['notification', notification.type]">
        <span class="notification-icon">
          {{ notification.type === 'success' ? '✓' : notification.type === 'error' ? '✗' : 'ℹ' }}
        </span>
        {{ notification.message }}
      </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import type { Kingdom, General, EventCard, Battle, BattleLog, EventChoice, PlayerProfile, CrossroadCard, CrossroadChoice, PermanentEffect } from '../types/game'
import { mockKingdom, mockGenerals, eventCards, enemyKingdoms, mockPlayers, crossroadCards } from '../data/mockData'
import { useGodGame } from '~/composables/useGodGame'
import type { PassiveCard } from '../types/passive-cards'
import { drawRandomCards } from '../types/passive-cards'
import type { ReincarnationData } from '../types/reincarnation'
import { calculateReincarnationBonuses, getTotalBonuses } from '../types/reincarnation'

// 신 게임 상태 가져오기
const { nationState: godGameState } = useGodGame()

// 패시브 카드 상태
const playerPassiveCards = ref<PassiveCard[]>([])
const showPassiveCardSelection = ref(false)
const availablePassiveCards = ref<PassiveCard[]>([])

// 환생 시스템 상태
const showReincarnationModal = ref(false)
const reincarnationData = ref<ReincarnationData>({
  count: 0,
  inheritedCard: null,
  inheritedCards: [],
  totalDaysPlayed: 0,
  highestDay: 0,
  bonuses: []
})

// 환생 시 선택 가능한 카드들 (이미 상속받은 카드 제외)
const availableCardsForReincarnation = computed(() => {
  return playerPassiveCards.value.filter(card => {
    return !reincarnationData.value.inheritedCards.some(inherited => inherited.id === card.id)
  })
})

// 환생 데이터 로드
const loadReincarnationData = () => {
  if (process.client) {
    const saved = localStorage.getItem('reincarnationData')
    if (saved) {
      const loadedData = JSON.parse(saved)

      // 하위 호환성: inheritedCards가 없으면 빈 배열로 초기화
      if (!loadedData.inheritedCards) {
        loadedData.inheritedCards = []
      }

      reincarnationData.value = loadedData

      // 누적된 모든 상속 카드를 추가
      if (reincarnationData.value.inheritedCards.length > 0) {
        playerPassiveCards.value = [...reincarnationData.value.inheritedCards]
        console.log(`상속받은 카드들: ${reincarnationData.value.inheritedCards.map(c => c.name).join(', ')}`)
      }

      // 환생 보너스 적용
      if (reincarnationData.value.bonuses.length > 0) {
        const totalBonuses = getTotalBonuses(reincarnationData.value.bonuses)
        if (totalBonuses.gold) kingdom.value.resources.gold += totalBonuses.gold
        if (totalBonuses.food) kingdom.value.resources.food += totalBonuses.food
        if (totalBonuses.military) kingdom.value.resources.soldiers += totalBonuses.military
        if (totalBonuses.morale) kingdom.value.resources.morale = Math.min(100, kingdom.value.resources.morale + totalBonuses.morale)

        console.log(`환생 보너스 적용! (${reincarnationData.value.count}회 환생)`)
      }
    }
  }
}

// 로컬스토리지에서 플레이어 정보 가져오기
const loadPlayerData = () => {
  if (process.client) {
    const playerName = localStorage.getItem('playerName') || '플레이어'
    const kingdomName = localStorage.getItem('kingdomName') || '아스트랄 왕국'

    const loadedKingdom = JSON.parse(JSON.stringify(mockKingdom))

    // 신 게임 모드에서 온 경우 해당 이름과 리소스 사용
    if (godGameState.value && godGameState.value.name) {
      loadedKingdom.name = godGameState.value.name
      loadedKingdom.ruler = playerName

      // 신 게임 스탯을 기본 게임 리소스에 반영
      loadedKingdom.resources.food = godGameState.value.stats.food
      loadedKingdom.resources.gold = godGameState.value.stats.gold
      loadedKingdom.resources.soldiers = godGameState.value.stats.military
      loadedKingdom.resources.morale = Math.max(0, Math.min(100, godGameState.value.stats.morale))
    } else {
      loadedKingdom.name = kingdomName
      loadedKingdom.ruler = playerName
    }

    return loadedKingdom
  }
  return JSON.parse(JSON.stringify(mockKingdom))
}

// 게임 상태
const kingdom = ref<Kingdom>(loadPlayerData())
const generals = ref<General[]>([])

// 제국 상태 (제국 붕괴 시스템)
const empire = ref({
  name: '대 마법 제국',
  totalHealth: 100,
  currentHealth: 100,
  defeatedFortresses: 0, // 정복한 요새 수
  totalFortresses: 20 // 총 요새 수 (20번 승리해야 제국 붕괴)
})

// 랜덤 장수 생성 함수
const generateRandomGeneral = (rarity?: 'common' | 'rare' | 'epic'): General => {
  // 랭크별 확률 (지정되지 않은 경우)
  const randomRarity = rarity || (() => {
    const rand = Math.random()
    if (rand < 0.60) return 'common' // 60% 일반
    if (rand < 0.90) return 'rare'   // 30% 희귀
    return 'epic'                     // 10% 영웅
  })()

  // 랭크별 스탯 범위
  const statRanges: Record<'common' | 'rare' | 'epic', { min: number; max: number }> = {
    common: { min: 30, max: 50 },
    rare: { min: 50, max: 75 },
    epic: { min: 75, max: 95 }
  }

  const range = statRanges[randomRarity]
  const randomStat = () => Math.floor(Math.random() * (range.max - range.min + 1)) + range.min

  // 장수 이름과 칭호 풀 (판타지 가상 이름)
  const firstNames = ['아르', '카이', '레온', '세라', '노아', '루나', '제로', '미라', '리안', '소라', '엘리', '테오', '니나', '라이', '유리']
  const lastNames = ['스', '엘', '온', '드', '아', '리스', '베르', '윈', '하르트', '피르', '실', '페', '데', '나', '안']
  const titles = ['검성', '대마법사', '그림자', '수호자', '파괴자', '현자', '암살자', '전쟁군주', '현인', '용기사', '신궁', '칼날', '폭풍', '빛의 기사', '어둠의 지배자']

  const name = firstNames[Math.floor(Math.random() * firstNames.length)] +
               lastNames[Math.floor(Math.random() * lastNames.length)]
  const title = titles[Math.floor(Math.random() * titles.length)]

  // 스킬 생성 (영웅 등급만 스킬 1개 보유)
  const skills: typeof General.prototype.skills = []

  if (randomRarity === 'epic') {
    const availableSkills = [
      { id: 'critical-strike', name: '필살의 일격', description: '강력한 일격으로 큰 피해를 입힌다', successRate: 70, effect: { type: 'damage' as const, value: 30 } },
      { id: 'defense-stance', name: '철벽 방어', description: '단단한 방어로 피해를 줄인다', successRate: 80, effect: { type: 'defense' as const, value: 25 } },
      { id: 'morale-boost', name: '사기 고양', description: '아군의 사기를 올린다', successRate: 85, effect: { type: 'buff' as const, value: 20 } },
      { id: 'confusion', name: '혼란', description: '적의 전의를 꺾는다', successRate: 65, effect: { type: 'debuff' as const, value: 20 } },
      { id: 'rapid-strike', name: '연속 공격', description: '빠른 연속 공격', successRate: 75, effect: { type: 'damage' as const, value: 25 } },
      { id: 'shield-wall', name: '방패의 벽', description: '완벽한 방어 진형', successRate: 70, effect: { type: 'defense' as const, value: 30 } }
    ]

    // 영웅은 1개의 랜덤 스킬 보유
    const randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)]
    skills.push(randomSkill)
  }

  return {
    id: `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    title,
    rarity: randomRarity,
    stats: {
      power: randomStat(),
      intelligence: randomStat(),
      leadership: randomStat()
    },
    skills,
    assignedSoldiers: 0
  }
}

// 시간 기반 시스템 (현실 시간 3주)
const GAME_DURATION_DAYS = 21 // 3주
const getGameStartTime = () => {
  if (process.client) {
    const stored = localStorage.getItem('gameStartTime')
    if (stored) {
      return new Date(stored)
    } else {
      const now = new Date()
      localStorage.setItem('gameStartTime', now.toISOString())
      return now
    }
  }
  return new Date()
}

const gameStartTime = ref<Date>(getGameStartTime())
const gameEndTime = computed(() => {
  const end = new Date(gameStartTime.value)
  end.setDate(end.getDate() + GAME_DURATION_DAYS)
  return end
})

const remainingTime = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isExpired: false
})

// 남은 시간 계산
const updateRemainingTime = () => {
  const now = new Date()
  const diff = gameEndTime.value.getTime() - now.getTime()

  if (diff <= 0) {
    remainingTime.value = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true
    }
    return
  }

  remainingTime.value = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isExpired: false
  }
}

// 1초마다 시간 업데이트
if (process.client) {
  updateRemainingTime()
  setInterval(updateRemainingTime, 1000)
}

// 게임 시작 시 환생 데이터 로드
if (process.client) {
  loadReincarnationData()
}

// UI 상태
const showGenerals = ref(false)
// const showBattleTypeSelection = ref(false) // PVP - 주석 처리됨
const showBattleMode = ref(false)
// const showPVPSelection = ref(false) // PVP - 주석 처리됨
// const showLeaderboard = ref(false) // PVP - 주석 처리됨
const currentEvent = ref<EventCard | null>(null)
const currentCrossroad = ref<CrossroadCard | null>(null)
const currentBattle = ref<Battle | null>(null)
const battleMode = ref<'text' | 'phaser'>('text')
const battleType = ref<'pve' | 'pvp'>('pve') // 항상 'pve'로 고정
const notification = ref<{ message: string, type: string } | null>(null)

// 영구 효과
const permanentEffects = ref<PermanentEffect[]>([])

// ==================== PVP 관련 State - 주석 처리됨 ====================
// 멀티플레이 상태
/*
const myProfile = ref<PlayerProfile>({
  id: 'me',
  username: kingdom.value.ruler,
  kingdomName: kingdom.value.name,
  level: 1,
  rank: 0,
  totalWins: 0,
  totalLosses: 0,
  trophies: 1000,
  lastActive: new Date(),
  kingdom: kingdom.value,
  generals: generals.value
})
const players = ref<PlayerProfile[]>(mockPlayers)
const selectedOpponent = ref<PlayerProfile | null>(null)

// 정렬된 리더보드
const leaderboard = computed(() => {
  const allPlayers = [myProfile.value, ...players.value]
  return allPlayers.sort((a, b) => b.trophies - a.trophies).map((p, index) => ({
    ...p,
    rank: index + 1
  }))
})
*/
// ==================== PVP 관련 State 끝 ====================

// 알림 표시
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

// 병력 모집
const recruitSoldiers = () => {
  // 영구 효과 적용
  let recruitDiscount = 0
  permanentEffects.value.forEach(effect => {
    if (effect.value?.recruitDiscount) recruitDiscount += effect.value.recruitDiscount
  })

  const baseCost = 200
  const actualCost = Math.floor(baseCost * (1 - recruitDiscount / 100))

  if (kingdom.value.resources.gold >= actualCost) {
    kingdom.value.resources.gold -= actualCost
    kingdom.value.resources.soldiers += 100
    showNotification(`병력 100을 모집했습니다! (비용: 금 ${actualCost})`, 'success')
  } else {
    showNotification(`금이 부족합니다! (필요: ${actualCost})`, 'error')
  }
}

// 자원 생산 (영구 효과 적용)
const calculateProduction = () => {
  let foodBonus = 0
  let goldBonus = 0
  let upkeepDiscount = 0

  permanentEffects.value.forEach(effect => {
    if (effect.value?.foodBonus) foodBonus += effect.value.foodBonus
    if (effect.value?.goldBonus) goldBonus += effect.value.goldBonus
    if (effect.value?.upkeepDiscount) upkeepDiscount += effect.value.upkeepDiscount
  })

  const baseFoodProduction = Math.floor(kingdom.value.resources.morale * 10)
  const baseGoldProduction = 100 + Math.floor(kingdom.value.day * 5)

  const foodProduction = Math.floor(baseFoodProduction * (1 + foodBonus / 100))
  const goldProduction = Math.floor(baseGoldProduction * (1 + goldBonus / 100))

  kingdom.value.resources.food += foodProduction
  kingdom.value.resources.gold += goldProduction

  // 병력 유지 비용 (영구 효과 적용)
  const baseSoldierUpkeep = Math.floor(kingdom.value.resources.soldiers * 0.5)
  const soldierUpkeep = Math.floor(baseSoldierUpkeep * (1 - upkeepDiscount / 100))
  kingdom.value.resources.food = Math.max(0, kingdom.value.resources.food - soldierUpkeep)

  return { foodProduction, goldProduction, soldierUpkeep }
}

// 랜덤 이벤트 카드 뽑기
const drawEventCard = () => {
  kingdom.value.day++;

  // 패시브 카드 효과 적용 (daily 트리거)
  applyPassiveEffects('daily')

  // 자원 생산
  const { foodProduction, goldProduction, soldierUpkeep } = calculateProduction()

  // 식량 부족 시 민심 하락
  if (kingdom.value.resources.food < 1000) {
    kingdom.value.resources.morale = Math.max(0, kingdom.value.resources.morale - 5)
    showNotification('식량이 부족합니다! 민심이 하락했습니다.', 'error')
  }

  // 생산 알림
  showNotification(`자원 생산: 식량 +${foodProduction}, 금 +${goldProduction} (병력 유지비 -${soldierUpkeep})`, 'success')

  // 100일째 환생 시스템
  if (kingdom.value.day === 100) {
    // 환생 데이터 업데이트
    reincarnationData.value.totalDaysPlayed += kingdom.value.day
    if (kingdom.value.day > reincarnationData.value.highestDay) {
      reincarnationData.value.highestDay = kingdom.value.day
    }
    showReincarnationModal.value = true
    return
  }

  // 25일마다 패시브 카드 선택 (100일 제외)
  if (kingdom.value.day % 25 === 0) {
    availablePassiveCards.value = drawRandomCards(3)
    showPassiveCardSelection.value = true
    return
  }

  // 일반 이벤트
  const randomEvent = eventCards[Math.floor(Math.random() * eventCards.length)]
  const eventCopy = JSON.parse(JSON.stringify(randomEvent))

  // 30% 확률로 장수 영입 선택지 추가
  if (Math.random() < 0.3) {
    const rarityRoll = Math.random()
    let rarity: 'common' | 'rare' | 'epic'
    let cost = { gold: 0 }
    let choiceText = ''

    if (rarityRoll < 0.60) {
      rarity = 'common'
      cost.gold = 200
      choiceText = '떠돌이 장수를 영입한다 (금 -200)'
    } else if (rarityRoll < 0.90) {
      rarity = 'rare'
      cost.gold = 500
      choiceText = '유명한 장수를 영입한다 (금 -500)'
    } else {
      rarity = 'epic'
      cost.gold = 1000
      choiceText = '전설의 영웅을 영입한다 (금 -1000)'
    }

    const newGeneral = generateRandomGeneral(rarity)

    eventCopy.choices.push({
      text: choiceText,
      cost,
      general: newGeneral
    })
  }

  currentEvent.value = eventCopy
}

// 패시브 카드 선택
const selectPassiveCard = (card: PassiveCard) => {
  playerPassiveCards.value.push(card)
  showPassiveCardSelection.value = false
  availablePassiveCards.value = []
  showNotification(`${card.name} 카드를 획득했습니다!`, 'success')
}

// 패시브 효과 적용
const applyPassiveEffects = (trigger: string) => {
  const effects = playerPassiveCards.value.filter(card => card.trigger === trigger)

  effects.forEach(card => {
    if (card.effect.gold) kingdom.value.resources.gold += card.effect.gold
    if (card.effect.food) kingdom.value.resources.food += card.effect.food
    if (card.effect.morale) kingdom.value.resources.morale = Math.min(100, Math.max(0, kingdom.value.resources.morale + card.effect.morale))
    if (card.effect.military) kingdom.value.resources.soldiers += card.effect.military
  })
}

// 희귀도 라벨
const getRarityLabel = (rarity: string) => {
  const labels: Record<string, string> = {
    common: '일반',
    rare: '희귀',
    epic: '영웅',
    legendary: '전설'
  }
  return labels[rarity] || rarity
}

// 트리거 라벨
const getTriggerLabel = (trigger: string) => {
  const labels: Record<string, string> = {
    daily: '매일',
    battle_start: '전투 시작',
    battle_win: '전투 승리',
    battle_lose: '전투 패배',
    recruit: '병력 모집'
  }
  return labels[trigger] || trigger
}

// 게임 상태만 리셋 (나라 이름과 계명은 유지)
const resetGameKeepProgress = () => {
  // 기본 자원 값
  let baseResources = {
    food: 1000,
    gold: 1000,
    soldiers: 500,
    morale: 50
  }

  // 신 게임 스탯이 있으면 적용
  if (godGameState.value && godGameState.value.stats) {
    baseResources.food = godGameState.value.stats.food
    baseResources.gold = godGameState.value.stats.gold
    baseResources.soldiers = godGameState.value.stats.military
    baseResources.morale = Math.max(0, Math.min(100, godGameState.value.stats.morale))
  }

  // 환생 보너스 적용
  const totalBonuses = getTotalBonuses(reincarnationData.value.bonuses)
  if (totalBonuses.gold) baseResources.gold += totalBonuses.gold
  if (totalBonuses.food) baseResources.food += totalBonuses.food
  if (totalBonuses.military) baseResources.soldiers += totalBonuses.military
  if (totalBonuses.morale) baseResources.morale = Math.min(100, baseResources.morale + totalBonuses.morale)

  // 나라 이름은 유지하고 자원만 리셋
  kingdom.value.day = 0
  kingdom.value.resources = {
    ...baseResources,
    population: godGameState.value?.stats.population || 1000
  }

  // 장수는 초기화 (0명으로 시작)
  generals.value = []

  // 패시브 카드는 누적된 상속 카드들만 유지
  playerPassiveCards.value = [...reincarnationData.value.inheritedCards]

  // 게임 데이터 저장
  if (process.client) {
    localStorage.setItem('gameData', JSON.stringify(kingdom.value))
  }

  // 모달 닫기
  showReincarnationModal.value = false
}

// 환생 - 카드 선택
const selectInheritedCard = (card: PassiveCard) => {
  reincarnationData.value.inheritedCard = card

  // 선택한 카드를 누적 목록에 추가 (중복 방지)
  const hasCard = reincarnationData.value.inheritedCards.some(c => c.id === card.id)
  if (!hasCard) {
    reincarnationData.value.inheritedCards.push(card)
  }

  reincarnationData.value.count++
  reincarnationData.value.bonuses = calculateReincarnationBonuses(reincarnationData.value.count)

  // 로컬 스토리지에 환생 데이터 저장
  if (process.client) {
    localStorage.setItem('reincarnationData', JSON.stringify(reincarnationData.value))
  }

  showNotification(`${card.name} 카드를 가지고 환생합니다! (누적 상속 카드: ${reincarnationData.value.inheritedCards.length}개)`, 'success')

  // 게임 상태만 리셋 (나라 이름과 계명 유지)
  setTimeout(() => {
    resetGameKeepProgress()
  }, 2000)
}

// 환생 포기 (카드 없이 환생)
const reincarnateWithoutCard = () => {
  reincarnationData.value.inheritedCard = null
  reincarnationData.value.count++
  reincarnationData.value.bonuses = calculateReincarnationBonuses(reincarnationData.value.count)

  if (process.client) {
    localStorage.setItem('reincarnationData', JSON.stringify(reincarnationData.value))
  }

  showNotification(`카드 없이 환생합니다. (누적 상속 카드: ${reincarnationData.value.inheritedCards.length}개)`, 'info')

  setTimeout(() => {
    resetGameKeepProgress()
  }, 2000)
}

// 선택지 비용 확인
const canAffordChoice = (choice: EventChoice): boolean => {
  if (!choice.cost) return true

  if (choice.cost.food && kingdom.value.resources.food < choice.cost.food) return false
  if (choice.cost.gold && kingdom.value.resources.gold < choice.cost.gold) return false
  if (choice.cost.soldiers && kingdom.value.resources.soldiers < choice.cost.soldiers) return false

  return true
}

// 선택지 선택
const selectChoice = (choice: EventChoice) => {
  // 비용 차감
  if (choice.cost) {
    if (choice.cost.food) kingdom.value.resources.food -= choice.cost.food
    if (choice.cost.gold) kingdom.value.resources.gold -= choice.cost.gold
    if (choice.cost.soldiers) kingdom.value.resources.soldiers -= choice.cost.soldiers
  }

  // 보상 지급
  if (choice.reward) {
    if (choice.reward.food) kingdom.value.resources.food += choice.reward.food
    if (choice.reward.gold) kingdom.value.resources.gold += choice.reward.gold
    if (choice.reward.soldiers) kingdom.value.resources.soldiers += choice.reward.soldiers
    if (choice.reward.morale) {
      kingdom.value.resources.morale += choice.reward.morale
      kingdom.value.resources.morale = Math.max(0, Math.min(100, kingdom.value.resources.morale))
    }
  }

  // 장수 영입
  if (choice.general) {
    generals.value.push(choice.general)
    showNotification(`${choice.general.name}을(를) 영입했습니다!`, 'success')
  }

  closeEvent()
}

const closeEvent = () => {
  currentEvent.value = null
}

// 장수 해고
const dismissGeneral = (generalId: string) => {
  const general = generals.value.find(g => g.id === generalId)
  if (!general) return

  // 확인 메시지
  if (!confirm(`${general.name}을(를) 정말 해고하시겠습니까?`)) {
    return
  }

  // 배치된 병력 반환
  if (general.assignedSoldiers > 0) {
    kingdom.value.resources.soldiers += general.assignedSoldiers
  }

  // 장수 목록에서 제거
  generals.value = generals.value.filter(g => g.id !== generalId)

  showNotification(`${general.name}을(를) 해고했습니다.`, 'success')
}

// 갈림길 선택
const selectCrossroadChoice = (choice: CrossroadChoice) => {
  // 영구 효과 추가
  permanentEffects.value.push(choice.effect)

  // 즉시 적용되는 효과들
  if (choice.effect.value?.moraleBonus) {
    kingdom.value.resources.morale += choice.effect.value.moraleBonus
    kingdom.value.resources.morale = Math.max(0, Math.min(100, kingdom.value.resources.morale))
  }

  showNotification(`${choice.effect.name} 효과가 영구적으로 적용되었습니다!`, 'success')
  closeCrossroad()
}

const closeCrossroad = () => {
  currentCrossroad.value = null
}

// ==================== PVP 함수 - 주석 처리됨 ====================
/*
// PVP 상대 선택
const selectPVPOpponent = (opponent: PlayerProfile) => {
  selectedOpponent.value = opponent
  showPVPSelection.value = false
  startStoryBattle()
}
*/
// ==================== PVP 함수 끝 ====================

// 전투 타입 선택 (PVE 전용으로 간소화)
const selectBattleType = (type: 'pve' | 'pvp') => {
  battleType.value = 'pve' // 항상 PVE로 고정

  const assignedGenerals = generals.value.filter(g => g.assignedSoldiers > 0)

  if (assignedGenerals.length === 0) {
    showNotification('장수에게 병력을 배치해주세요!', 'error')
    showGenerals.value = true
    return
  }

  // PVE 전투 시작
  startStoryBattle()
}

// 스토리 기반 전투 시작
const battleLogContainer = ref<HTMLElement | null>(null)
const isScrolling = ref(false)

const startStoryBattle = async () => {
  const assignedGenerals = generals.value.filter(g => g.assignedSoldiers > 0)

  if (assignedGenerals.length === 0) {
    showNotification('장수에게 병력을 배치해주세요!', 'error')
    showGenerals.value = true
    return
  }

  // 항상 PVE - 제국의 적 선택
  const enemy = enemyKingdoms[Math.floor(Math.random() * enemyKingdoms.length)]
  const enemyName = enemy.name
  const enemyGenerals = enemy.generals

  /* PVP 로직 - 주석 처리됨
  if (battleType.value === 'pvp' && selectedOpponent.value) {
    enemyName = selectedOpponent.value.kingdomName
    enemyGenerals = selectedOpponent.value.generals
  }
  */

  currentBattle.value = {
    id: '1',
    attacker: {
      kingdomName: kingdom.value.name,
      generals: assignedGenerals
    },
    defender: {
      kingdomName: enemyName,
      generals: enemyGenerals
    },
    log: [],
    result: undefined
  }

  // 스토리 전투 시작 - 모든 로그를 미리 생성
  await generateCompleteBattle()
}

// 완전한 전투 스토리 미리 생성
const generateCompleteBattle = async () => {
  if (!currentBattle.value) return

  const logs: BattleLog[] = []

  // 오프닝 나레이션
  logs.push({
    turn: 0,
    generalName: '',
    action: '',
    success: true,
    message: '',
    story: `${currentBattle.value.attacker.kingdomName}의 군대가 ${currentBattle.value.defender.kingdomName}의 영토에 진입했다. 전쟁의 서막이 오른다...`,
    narrativeType: 'narration'
  })

  // 전투 시작
  for (let turn = 1; turn <= 8; turn++) {
    const isAttackerTurn = turn % 2 === 1
    const activeGenerals = isAttackerTurn
      ? currentBattle.value.attacker.generals
      : currentBattle.value.defender.generals

    const general = activeGenerals[Math.floor(Math.random() * activeGenerals.length)]
    const skill = general.skills[Math.floor(Math.random() * general.skills.length)]

    // 영구 효과 적용 (아군만)
    let battleBonus = 0
    if (isAttackerTurn) {
      permanentEffects.value.forEach(effect => {
        if (effect.value?.battleBonus) battleBonus += effect.value.battleBonus
      })
    }

    const adjustedSuccessRate = Math.min(95, skill.successRate + battleBonus)
    const success = Math.random() * 100 < adjustedSuccessRate

    // 행동 나레이션
    const actionStory = generateActionNarration(general, skill, success, isAttackerTurn)
    logs.push({
      turn,
      generalName: general.name,
      action: skill.name,
      success,
      message: '',
      story: actionStory,
      narrativeType: 'action'
    })

    // 대사 추가 (랜덤)
    if (Math.random() > 0.4) {
      const dialogue = generateDialogue(general, skill, success)
      logs.push({
        turn,
        generalName: general.name,
        action: '',
        success,
        message: '',
        speaker: general.name,
        dialogue,
        narrativeType: 'dialogue'
      })
    }
  }

  // 결과 계산
  const attackerScore = logs.filter(l =>
    currentBattle.value!.attacker.generals.some(g => g.name === l.generalName) && l.success
  ).length

  const defenderScore = logs.filter(l =>
    currentBattle.value!.defender.generals.some(g => g.name === l.generalName) && l.success
  ).length

  currentBattle.value.result = attackerScore > defenderScore ? 'victory' : 'defeat'

  // 엔딩 나레이션
  const endingStory = currentBattle.value.result === 'victory'
    ? `치열한 전투 끝에 ${currentBattle.value.attacker.kingdomName}이 승리를 거머쥐었다! 적군은 전장에서 퇴각하며 패배를 인정했다.`
    : `${currentBattle.value.defender.kingdomName}의 방어선을 뚫지 못했다. ${currentBattle.value.attacker.kingdomName}의 군대는 어쩔 수 없이 후퇴해야 했다...`

  logs.push({
    turn: 999,
    generalName: '',
    action: '',
    success: true,
    message: '',
    story: endingStory,
    narrativeType: 'narration'
  })

  // 모든 로그를 한번에 설정
  currentBattle.value.log = logs

  // 스크롤 애니메이션 시작
  await new Promise(resolve => setTimeout(resolve, 100))
  startScrollAnimation()

  handleBattleEnd(currentBattle.value.result)
}

// 스크롤 애니메이션 시작
const startScrollAnimation = () => {
  isScrolling.value = true

  const container = document.querySelector('.story-battle-log')
  if (!container) return

  // 맨 아래에서 시작
  container.scrollTop = container.scrollHeight

  // 천천히 위로 스크롤
  const scrollDuration = 20000 // 20초에 걸쳐 스크롤
  const startTime = Date.now()
  const startScroll = container.scrollHeight

  const scroll = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / scrollDuration, 1)

    // ease-out 효과
    const easeProgress = 1 - Math.pow(1 - progress, 3)

    container.scrollTop = startScroll - (startScroll * easeProgress)

    if (progress < 1) {
      requestAnimationFrame(scroll)
    } else {
      isScrolling.value = false
    }
  }

  requestAnimationFrame(scroll)
}

// 액션 나레이션 생성
const generateActionNarration = (general: General, skill: any, success: boolean, isAttacker: boolean): string => {
  const side = isAttacker ? '아군' : '적군'
  const templates = success ? [
    `${general.name}이(가) ${skill.name}을(를) 시전했다! 적진이 술렁이며 혼란에 빠진다.`,
    `"이걸로 끝이다!" ${general.name}의 ${skill.name}이(가) 전장을 가른다. 적병들이 비명을 지르며 쓰러진다.`,
    `${general.name}이(가) 전장을 누비며 ${skill.name}을(를) 펼쳤다. 적의 대형이 무너진다!`,
    `순식간에 ${general.name}이(가) 전진하며 ${skill.name}! 적진에서 비명소리가 울려퍼진다.`,
    `${general.name}의 공격이 빛을 발한다. ${skill.name}의 위력이 전장을 뒤흔든다!`
  ] : [
    `${general.name}이(가) ${skill.name}을(를) 시도했으나 적이 이를 막아냈다.`,
    `"젠장!" ${general.name}의 ${skill.name}이(가) 빗나갔다. 적이 비웃으며 반격을 준비한다.`,
    `${general.name}이(가) 공격했으나 적의 방어가 견고하다. ${skill.name}이(가) 무위로 돌아간다.`,
    `${general.name}의 ${skill.name}이(가) 실패했다! 적장이 의기양양하게 외친다.`,
    `집중력이 흐트러졌다. ${general.name}의 ${skill.name}이(가) 제대로 발동되지 않았다.`
  ]

  return templates[Math.floor(Math.random() * templates.length)]
}

// 대사 생성
const generateDialogue = (general: General, skill: any, success: boolean): string => {
  if (success) {
    const dialogues = [
      "크아악! 이 정도 실력으로 감히!",
      "이것이 나의 힘이다!",
      "하하하! 어디 한번 막아보시지!",
      "이 정도로는 부족하지!",
      "더 세게! 더 빠르게!",
      "이것으로 끝이 아니다!",
      "자, 다음은 누구냐?!",
      "흥, 생각보다 약하군."
    ]
    return dialogues[Math.floor(Math.random() * dialogues.length)]
  } else {
    const dialogues = [
      "크윽... 이럴 수가!",
      "젠장, 빗나갔어!",
      "아직 끝나지 않았다!",
      "이번엔 내가 방심했을 뿐!",
      "다음엔 반드시...!",
      "흠, 상대가 만만치 않군.",
      "이 정도일 줄이야...",
      "후퇴하지 마라! 계속 싸워라!"
    ]
    return dialogues[Math.floor(Math.random() * dialogues.length)]
  }
}

// 텍스트 클래스 판별 (아군/적군/나레이션)
const getTextClass = (log: BattleLog): string => {
  if (log.narrativeType === 'narration') {
    return 'text-narration'
  }

  if (!currentBattle.value) return 'text-narration'

  // 아군인지 적군인지 확인
  const isAlly = currentBattle.value.attacker.generals.some(g => g.name === log.generalName || g.name === log.speaker)

  if (log.narrativeType === 'dialogue') {
    return isAlly ? 'text-ally-dialogue' : 'text-enemy-dialogue'
  }

  return isAlly ? 'text-ally' : 'text-enemy'
}

// Phaser용 전투 로그 미리 생성
const generateBattleLog = () => {
  if (!currentBattle.value) return

  for (let turn = 1; turn <= 5; turn++) {
    const isAttackerTurn = turn % 2 === 1

    const activeGenerals = isAttackerTurn
      ? currentBattle.value.attacker.generals
      : currentBattle.value.defender.generals

    const general = activeGenerals[Math.floor(Math.random() * activeGenerals.length)]
    const skill = general.skills[Math.floor(Math.random() * general.skills.length)]

    const success = Math.random() * 100 < skill.successRate

    const log: BattleLog = {
      turn,
      generalName: general.name,
      action: skill.name,
      success,
      message: success
        ? `${skill.name}을(를) 성공적으로 시전했습니다! ${skill.effect.value}의 피해를 입혔습니다!`
        : `${skill.name} 시전에 실패했습니다...`
    }

    currentBattle.value.log.push(log)
  }
}

// 전투 계속
const continueBattle = () => {
  if (!currentBattle.value) return

  const turn = currentBattle.value.log.length + 1
  const isAttackerTurn = turn % 2 === 1

  const activeGenerals = isAttackerTurn
    ? currentBattle.value.attacker.generals
    : currentBattle.value.defender.generals

  const general = activeGenerals[Math.floor(Math.random() * activeGenerals.length)]
  const skill = general.skills[Math.floor(Math.random() * general.skills.length)]

  const success = Math.random() * 100 < skill.successRate

  const log: BattleLog = {
    turn,
    generalName: general.name,
    action: skill.name,
    success,
    message: success
      ? `${skill.name}을(를) 성공적으로 시전했습니다! ${skill.effect.value}의 피해를 입혔습니다!`
      : `${skill.name} 시전에 실패했습니다...`
  }

  currentBattle.value.log.push(log)

  // 5턴 후 랜덤으로 승패 결정
  if (turn >= 5) {
    const victoryScore = currentBattle.value.log
      .filter(l => currentBattle.value.attacker.generals.some(g => g.name === l.generalName) && l.success)
      .length

    const defeatScore = currentBattle.value.log
      .filter(l => currentBattle.value.defender.generals.some(g => g.name === l.generalName) && l.success)
      .length

    currentBattle.value.result = victoryScore > defeatScore ? 'victory' : 'defeat'
    handleBattleEnd(currentBattle.value.result)
  }
}

const closeBattle = () => {
  // 배치된 병력 소모
  generals.value.forEach(g => {
    if (g.assignedSoldiers > 0) {
      const casualty = Math.floor(g.assignedSoldiers * 0.3)
      kingdom.value.resources.soldiers -= casualty
      g.assignedSoldiers = 0
    }
  })

  currentBattle.value = null
}

// Phaser 전투 종료 처리
const handlePhaserBattleClose = (result: 'victory' | 'defeat') => {
  handleBattleEnd(result)
  closeBattle()
}

// 전투 종료 처리 (PVE 전용)
const handleBattleEnd = (result: 'victory' | 'defeat') => {
  if (result === 'victory') {
    kingdom.value.resources.gold += 500
    kingdom.value.resources.food += 300

    // 제국 체력 감소
    empire.value.defeatedFortresses++
    empire.value.currentHealth = Math.max(0, empire.value.currentHealth - 5)

    showNotification(`제국 요새 정복! (${empire.value.defeatedFortresses}/${empire.value.totalFortresses})`, 'success')

    // 제국 붕괴 확인
    if (empire.value.defeatedFortresses >= empire.value.totalFortresses) {
      setTimeout(() => {
        showNotification('🎉 제국을 무너뜨렸습니다! 당신의 왕국이 승리했습니다! 🎉', 'success')
      }, 1000)
    }

    /* PVP 트로피 로직 - 주석 처리됨
    if (battleType.value === 'pvp') {
      const trophyGain = 30
      myProfile.value.trophies += trophyGain
      myProfile.value.totalWins++
      showNotification(`승리! 트로피 +${trophyGain} (${myProfile.value.trophies})`, 'success')
    }
    */
  } else {
    showNotification('제국군에게 패배했습니다...', 'error')

    /* PVP 트로피 로직 - 주석 처리됨
    if (battleType.value === 'pvp') {
      const trophyLoss = 20
      myProfile.value.trophies = Math.max(0, myProfile.value.trophies - trophyLoss)
      myProfile.value.totalLosses++
      showNotification(`패배... 트로피 -${trophyLoss} (${myProfile.value.trophies})`, 'error')
    }
    */
  }
}
</script>

<style scoped>
.banner-decoration {
  width: 60px;
  height: 80px;
  background: linear-gradient(135deg, #b8860b 0%, #64748b 50%, #f4e5a1 100%);
  clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);
  box-shadow: 0 4px 12px rgba(100, 116, 139, 0.4);
}

.banner-decoration.left {
  transform: scaleX(-1);
}

.banner-center {
  flex: 1;
  text-align: center;
  padding: 0 40px;
}

.crown-emblem {
  font-size: 48px;
  margin-bottom: 10px;
  filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.8));
  animation: crownFloat 3s ease-in-out infinite;
}

@keyframes crownFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.kingdom-name {
  font-family: 'Cinzel', serif;
  font-size: 42px;
  font-weight: 900;
  color: #64748b;
  text-shadow:
    0 0 30px rgba(100, 116, 139, 0.8),
    3px 3px 8px rgba(0, 0, 0, 0.8),
    0 0 10px rgba(96, 165, 250, 0.6);
  letter-spacing: 4px;
  margin: 0;
  text-transform: uppercase;
}

.kingdom-subtitle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
  font-size: 18px;
}

.ruler-title {
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 14px;
}

.ruler-name {
  color: #e2e8f0;
  font-weight: 700;
  font-size: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* 정보 그리드 */
.kingdom-info-grid {
  display: grid;
  grid-template-columns: 400px 1fr 1fr;
  gap: 30px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
  padding: 30px;
  border-radius: 0 0 20px 20px;
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* 왼쪽 패널: 통계 */
.kingdom-stats-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 3px solid #64748b;
  border-radius: 16px;
  padding: 25px;
  background: rgba(30, 41, 59, 0.5);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.panel-title {
  position: relative;
  font-family: 'Cinzel', serif;
  font-size: 22px;
  font-weight: 800;
  color: #64748b;
  text-shadow: 0 0 10px rgba(100, 116, 139, 0.5);
  margin: 0 0 15px 0;
  border-bottom: 2px solid rgba(100, 116, 139, 0.3);
  padding-bottom: 10px;
  z-index: 1;
}

.stat-row {
  display: flex;
  gap: 15px;
}

.stat-badge {
  flex: 1;
  background: rgba(71, 85, 105, 0.5);
  border: none;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
}

.stat-badge:hover {
  background: rgba(71, 85, 105, 0.7);
  border-color: rgba(100, 116, 139, 0.5);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 32px;
  filter: drop-shadow(0 0 8px rgba(100, 116, 139, 0.4));
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  color: #e2e8f0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* 남은 시간 카드 */
.time-remaining-card {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.3) 100%);
  border: none;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.time-remaining-card.time-critical {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.3) 100%);
  border-color: rgba(245, 158, 11, 0.6);
  animation: timeCritical 1s ease-in-out infinite;
}

.time-remaining-card.time-expired {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(153, 27, 27, 0.3) 100%);
  border-color: rgba(239, 68, 68, 0.6);
  animation: timeExpired 0.5s ease-in-out infinite;
}

.time-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.time-icon {
  font-size: 24px;
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8));
}

.time-title {
  font-size: 16px;
  font-weight: 700;
  color: #93c5fd;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.time-display {
  text-align: center;
}

.time-blocks {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 10px 15px;
  min-width: 65px;
}

.time-number {
  font-size: 28px;
  font-weight: 900;
  color: #dbeafe;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
  font-family: 'Cinzel', serif;
}

.time-unit {
  font-size: 11px;
  color: #93c5fd;
  margin-top: 2px;
  font-weight: 600;
}

.time-separator {
  font-size: 24px;
  font-weight: 700;
  color: #93c5fd;
}

.time-up-message {
  font-size: 28px;
  font-weight: 900;
  color: #fca5a5;
  text-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
  animation: blink 1s ease-in-out infinite;
}

@keyframes timeCritical {
  0%, 100% { box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3); }
  50% { box-shadow: 0 4px 32px rgba(245, 158, 11, 0.6); }
}

@keyframes timeExpired {
  0%, 100% { box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 4px 32px rgba(239, 68, 68, 0.7); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 신의 계명 패널 */
.commandments-panel {
  background: rgba(251, 191, 36, 0.1);
  border: none;
  border-radius: 16px;
  padding: 20px;
}

.commandments-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.commandment-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(251, 191, 36, 0.15);
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  transition: all 0.3s;
  cursor: help;
}

.commandment-item:hover {
  background: rgba(251, 191, 36, 0.25);
  border-color: rgba(251, 191, 36, 0.5);
  transform: translateX(5px);
}

.commandment-icon {
  font-size: 24px;
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.6));
}

.commandment-name {
  font-size: 15px;
  font-weight: 700;
  color: #fef3c7;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* 패시브 카드 패널 */
.passive-cards-panel {
  position: relative;
  background: rgba(147, 51, 234, 0.1);
  border: none;
  border-radius: 16px;
  padding: 20px;
  margin-top: 20px;
  overflow: hidden;
}

.passive-panel-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/background/backgroundImage1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.08;
  pointer-events: none;
  z-index: 0;
  border-radius: 16px;
}

.passive-cards-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1;
}

.passive-card-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(147, 51, 234, 0.15);
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  transition: all 0.3s;
}

.passive-card-item:hover {
  background: rgba(147, 51, 234, 0.25);
  transform: translateX(5px);
}

.passive-card-icon {
  font-size: 28px;
  filter: drop-shadow(0 0 8px rgba(147, 51, 234, 0.5));
}

.passive-card-info {
  flex: 1;
}

.passive-card-name {
  font-size: 14px;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 4px;
}

.passive-card-trigger {
  font-size: 12px;
  color: #c4b5fd;
  font-weight: 500;
}

.passive-card-rarity {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 700;
  text-transform: uppercase;
}

.passive-card-item.rarity-common .passive-card-rarity {
  background: rgba(156, 163, 175, 0.3);
  color: #d1d5db;
}

.passive-card-item.rarity-rare .passive-card-rarity {
  background: rgba(59, 130, 246, 0.3);
  color: #93c5fd;
}

.passive-card-item.rarity-epic .passive-card-rarity {
  background: rgba(168, 85, 247, 0.3);
  color: #e9d5ff;
}

.passive-card-item.rarity-legendary .passive-card-rarity {
  background: rgba(251, 191, 36, 0.3);
  color: #fef3c7;
}

/* 전투 준비 현황 패널 */
.battle-status-panel {
  margin-top: 20px;
  background: rgba(239, 68, 68, 0.1);
  border: none;
  border-radius: 16px;
  padding: 20px;
}

.battle-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.battle-stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(239, 68, 68, 0.15);
  border: none;
  border-radius: 10px;
  padding: 15px;
  transition: all 0.3s;
}

.battle-stat-card:hover {
  background: rgba(239, 68, 68, 0.25);
  transform: translateY(-3px);
}

.battle-stat-icon {
  font-size: 32px;
  filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.6));
}

.battle-stat-info {
  flex: 1;
}

.battle-stat-label {
  display: block;
  font-size: 12px;
  color: #fca5a5;
  font-weight: 600;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.battle-stat-value {
  display: block;
  font-size: 20px;
  color: #ffffff;
  font-weight: 800;
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
}

.battle-stat-value.ready {
  color: #86efac;
}

.battle-stat-unit {
  font-size: 14px;
  color: #fca5a5;
  margin-left: 2px;
}

/* 오른쪽 패널: 자원 */
.kingdom-resources-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 3px solid #64748b;
  border-radius: 16px;
  padding: 25px;
  background: rgba(30, 41, 59, 0.5);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.resource-card {
  background: rgba(71, 85, 105, 0.5);
  border: none;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.resource-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, transparent 0%, rgba(100, 116, 139, 0.2) 100%);
  border-radius: 16px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s;
}

.resource-card:hover::before {
  opacity: 1;
}

.resource-card:hover {
  transform: translateY(-4px);
  border-color: rgba(100, 116, 139, 0.5);
  box-shadow: 0 8px 24px rgba(100, 116, 139, 0.2);
}

.resource-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.resource-icon {
  font-size: 28px;
  filter: drop-shadow(0 0 8px rgba(100, 116, 139, 0.4));
}

.resource-label {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.resource-amount {
  font-size: 26px;
  font-weight: 900;
  color: #e2e8f0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
  font-family: 'Cinzel', serif;
}

.resource-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.resource-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #64748b 0%, #f4e5a1 50%, #64748b 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
  box-shadow: 0 0 10px rgba(100, 116, 139, 0.6);
  animation: resourceShine 2s ease-in-out infinite;
}

@keyframes resourceShine {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 1; }
}

/* 제국 정복 패널 */
.empire-conquest-panel {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(153, 27, 27, 0.3) 100%);
  border: none;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);
}

.conquest-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.conquest-icon {
  font-size: 28px;
  filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.6));
}

.conquest-title {
  font-family: 'Cinzel', serif;
  font-size: 20px;
  font-weight: 800;
  color: #fca5a5;
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
  margin: 0;
}

.conquest-progress {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.conquest-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conquest-label {
  font-size: 13px;
  color: #fecaca;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.conquest-count {
  font-size: 18px;
  font-weight: 900;
  color: #fee2e2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-family: 'Cinzel', serif;
}

.conquest-bar {
  width: 100%;
  height: 24px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(220, 38, 38, 0.4);
}

.conquest-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #f87171 100%);
  border-radius: 10px;
  transition: width 0.5s ease;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: conquestPulse 2s ease-in-out infinite;
}

.conquest-percentage {
  font-size: 12px;
  font-weight: 900;
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
  font-family: 'Cinzel', serif;
}

@keyframes conquestPulse {
  0%, 100% { box-shadow: 0 0 15px rgba(239, 68, 68, 0.5); }
  50% { box-shadow: 0 0 25px rgba(239, 68, 68, 0.8); }
}

/* 게임 컨텐츠 레이아웃 */
.game-content {
  position: relative;
  margin-top: 30px;
  z-index: 10;
}

/* ========== 왕국 액션 사이드바 ========== */
.action-sidebar {
  width: 100%;
  flex-shrink: 0;
  border: 3px solid #64748b;
  border-radius: 16px;
  background: rgba(30, 41, 59, 0.5);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.sidebar-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: none;
  border-bottom: 2px solid #64748b;
  padding: 25px;
  position: relative;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.sidebar-emblem {
  font-size: 36px;
  margin-bottom: 10px;
  filter: drop-shadow(0 0 15px rgba(100, 116, 139, 0.8));
  animation: emblemGlow 2s ease-in-out infinite;
}

@keyframes emblemGlow {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.sidebar-title {
  font-family: 'Cinzel', serif;
  font-size: 26px;
  font-weight: 900;
  color: #64748b;
  text-shadow:
    0 0 20px rgba(100, 116, 139, 0.6),
    2px 2px 6px rgba(0, 0, 0, 0.8);
  letter-spacing: 3px;
  margin: 0;
  text-transform: uppercase;
}

.sidebar-decoration {
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 6px;
  background: linear-gradient(90deg, transparent 0%, #64748b 50%, transparent 100%);
  box-shadow: 0 0 10px rgba(100, 116, 139, 0.6);
}

.action-scroll {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
  border: none;
  border-top: 2px solid #64748b;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 왕실 액션 카드 */
.royal-action-card {
  position: relative;
  background: linear-gradient(135deg, rgba(71, 85, 105, 0.6) 0%, rgba(51, 65, 85, 0.8) 100%);
  border: none;
  border-radius: 12px;
  padding: 0;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.royal-action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(100, 116, 139, 0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.4s;
}

.royal-action-card:hover::before {
  opacity: 1;
}

.royal-action-card:hover {
  transform: translateY(-8px) scale(1.03);
  border-color: #64748b;
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.6),
    0 0 30px rgba(100, 116, 139, 0.5);
  background: linear-gradient(135deg, rgba(71, 85, 105, 0.8) 0%, rgba(51, 65, 85, 1) 100%);
}

.royal-action-card:active {
  transform: translateY(-2px) scale(0.98);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.action-ornament {
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, #64748b 50%, transparent 100%);
  position: relative;
  z-index: 1;
}

.action-ornament.top {
  opacity: 0.6;
}

.action-ornament.bottom {
  opacity: 0.4;
}

.action-card-inner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
  min-height: 100px;
  z-index: 1;
}

.action-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-icon-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(100, 116, 139, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 1; }
}

.action-icon {
  font-size: 52px;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 10px rgba(100, 116, 139, 0.6));
}

.action-content {
  flex: 1;
  text-align: left;
}

.action-title {
  font-family: 'Cinzel', serif;
  font-size: 22px;
  font-weight: 800;
  color: #64748b;
  margin: 0 0 8px 0;
  text-shadow: 0 0 10px rgba(100, 116, 139, 0.4);
  letter-spacing: 1px;
}

.action-desc {
  font-size: 15px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.6;
  font-weight: 500;
}

/* 특정 액션 카드 색상 */
.royal-action-card.battle {
  border-color: rgba(239, 68, 68, 0.5);
}

.royal-action-card.battle:hover {
  border-color: #ef4444;
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(239, 68, 68, 0.4);
}

.royal-action-card.battle .action-title {
  color: #fca5a5;
}

.royal-action-card.event {
  border-color: rgba(59, 130, 246, 0.5);
}

.royal-action-card.event:hover {
  border-color: #3b82f6;
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(59, 130, 246, 0.4);
}

.royal-action-card.event .action-title {
  color: #93c5fd;
}

.royal-action-card.recruit {
  border-color: rgba(34, 197, 94, 0.5);
}

.royal-action-card.recruit:hover {
  border-color: #22c55e;
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(34, 197, 94, 0.4);
}

.royal-action-card.recruit .action-title {
  color: #86efac;
}

.recruit-background-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/passive/solderAdd.png');
  background-size: 100px 100px;
  background-position: right 20px center;
  background-repeat: no-repeat;
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
  border-radius: 16px;
}

.general-background-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/generals/artemis.png');
  background-size: 110px 110px;
  background-position: right 15px center;
  background-repeat: no-repeat;
  opacity: 0.12;
  pointer-events: none;
  z-index: 0;
  border-radius: 16px;
}

.battle-background-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/generals/karon.png');
  background-size: 110px 110px;
  background-position: right 15px center;
  background-repeat: no-repeat;
  opacity: 0.12;
  pointer-events: none;
  z-index: 0;
  border-radius: 16px;
}

.event-background-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/generals/lina.png');
  background-size: 110px 110px;
  background-position: right 15px center;
  background-repeat: no-repeat;
  opacity: 0.12;
  pointer-events: none;
  z-index: 0;
  border-radius: 16px;
}

/* ========== 왕국 정보 패널 ========== */
.main-content {
  flex: 1;
}

.royal-info-panel {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
  border: 3px solid #64748b;
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.panel-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-bottom: 3px solid #64748b;
  padding: 25px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-header-decoration {
  width: 40px;
  height: 50px;
  background: linear-gradient(135deg, #b8860b 0%, #64748b 50%, #f4e5a1 100%);
  clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);
}

.panel-header-decoration.left {
  transform: scaleX(-1);
}

.panel-header-center {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-icon {
  font-size: 32px;
  filter: drop-shadow(0 0 15px rgba(100, 116, 139, 0.8));
}

.panel-header-title {
  font-family: 'Cinzel', serif;
  font-size: 24px;
  font-weight: 900;
  color: #64748b;
  text-shadow: 0 0 15px rgba(100, 116, 139, 0.6);
  letter-spacing: 2px;
  margin: 0;
  text-transform: uppercase;
}

.royal-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 30px;
}

.royal-stat-card {
  position: relative;
  background: linear-gradient(135deg, rgba(71, 85, 105, 0.5) 0%, rgba(51, 65, 85, 0.7) 100%);
  border-radius: 16px;
  padding: 25px;
  transition: all 0.3s;
  overflow: hidden;
}

.stat-card-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid rgba(100, 116, 139, 0.3);
  border-radius: 16px;
  transition: all 0.3s;
  pointer-events: none;
}

.royal-stat-card:hover .stat-card-border {
  border-color: #64748b;
  box-shadow: 0 0 20px rgba(100, 116, 139, 0.4);
}

.royal-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.stat-card-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon-circle {
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(100, 116, 139, 0.2) 0%, transparent 70%);
  border: 2px solid rgba(100, 116, 139, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  animation: statIconGlow 2s ease-in-out infinite;
}

@keyframes statIconGlow {
  0%, 100% { box-shadow: 0 0 10px rgba(100, 116, 139, 0.3); }
  50% { box-shadow: 0 0 20px rgba(100, 116, 139, 0.6); }
}

.stat-icon {
  font-size: 32px;
  filter: drop-shadow(0 0 8px rgba(100, 116, 139, 0.6));
}

.stat-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.stat-value {
  font-family: 'Cinzel', serif;
  font-size: 28px;
  font-weight: 900;
  color: #e2e8f0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.stat-value.ready {
  color: #86efac;
  text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.stat-unit {
  font-size: 18px;
  color: #94a3b8;
  font-weight: 600;
  margin-left: 4px;
}

/* 섹션 구분선 */
.section-divider {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 30px 30px 20px 30px;
}

.divider-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #64748b 50%, transparent 100%);
}

.divider-text {
  font-family: 'Cinzel', serif;
  font-size: 18px;
  font-weight: 800;
  color: #64748b;
  text-shadow: 0 0 10px rgba(100, 116, 139, 0.5);
  letter-spacing: 1px;
  white-space: nowrap;
}

/* 왕실 효과 섹션 */
.royal-effects-section {
  margin-top: 25px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%);
  border: 2px solid rgba(100, 116, 139, 0.4);
  border-radius: 16px;
  padding: 25px;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.royal-effects-section::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, transparent 0%, rgba(100, 116, 139, 0.1) 100%);
  border-radius: 16px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s;
}

.royal-effects-section:hover::before {
  opacity: 1;
}

.royal-effects-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.royal-effect-item {
  display: flex;
  align-items: center;
  gap: 18px;
  background: rgba(0, 0, 0, 0.3);
  padding: 18px 20px;
  border-radius: 12px;
  border-left: 4px solid #64748b;
  border-right: 1px solid rgba(100, 116, 139, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.royal-effect-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: linear-gradient(90deg, rgba(100, 116, 139, 0.2) 0%, transparent 100%);
  transition: width 0.4s ease;
}

.royal-effect-item:hover::before {
  width: 100%;
}

.royal-effect-item:hover {
  background: rgba(0, 0, 0, 0.4);
  transform: translateX(8px);
  border-left-color: #60a5fa;
  box-shadow: 0 4px 16px rgba(100, 116, 139, 0.2);
}

.effect-icon-wrapper {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(100, 116, 139, 0.2) 0%, rgba(100, 116, 139, 0.1) 100%);
  border: 2px solid rgba(100, 116, 139, 0.4);
  border-radius: 12px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.effect-icon-wrapper .effect-icon-badge {
  font-size: 28px;
  filter: drop-shadow(0 0 8px rgba(100, 116, 139, 0.6));
  animation: sparkle 2s infinite;
}

.effect-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.effect-name {
  font-size: 17px;
  font-weight: 800;
  color: #60a5fa;
  margin-bottom: 6px;
  font-family: 'Cinzel', serif;
  text-shadow: 0 0 10px rgba(96, 165, 250, 0.4);
  letter-spacing: 0.5px;
}

.effect-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* 팁 섹션 - 왕실 스타일 */
.tip-section {
  margin-top: 25px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
  border: 2px solid rgba(99, 102, 241, 0.4);
  border-radius: 16px;
  padding: 25px;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
}

.tip-section h4 {
  font-size: 20px;
  font-weight: 800;
  color: #c4b5fd;
  margin-bottom: 18px;
  font-family: 'Cinzel', serif;
  text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
  letter-spacing: 1px;
}

.tip-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tip-section li {
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  padding-left: 30px;
  position: relative;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.tip-section li::before {
  content: '⚜️';
  position: absolute;
  left: 0;
  font-size: 18px;
  filter: drop-shadow(0 0 6px rgba(99, 102, 241, 0.6));
}

/* 반응형 레이아웃 */
@media (max-width: 1200px) {
  .main-page {
    padding: 15px;
  }

  .kingdom-header {
    margin-bottom: 25px;
  }

  .kingdom-content {
    padding: 25px;
  }

  .kingdom-title h1 {
    font-size: 36px;
  }

  .resources {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}

@media (max-width: 1200px) {
  .kingdom-info-grid {
    grid-template-columns: 1fr;
  }

  .action-sidebar {
    max-width: 600px;
    margin: 0 auto;
  }
}

@media (max-width: 1024px) {
  .game-content {
    margin-top: 20px;
  }

  .action-sidebar {
    width: 100%;
    margin-bottom: 20px;
  }

  .battle-stats-grid {
    grid-template-columns: 1fr;
  }

  .action-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .action-button {
    padding: 15px;
  }

  .action-btn-icon {
    font-size: 40px;
  }

  .action-btn-content h3 {
    font-size: 18px;
  }

  .action-btn-content p {
    font-size: 12px;
  }

  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  /* 모달 크기 조정 */
  .modal-content {
    max-width: 95%;
    max-height: 85vh;
  }

  .generals-grid {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .general-card-new {
    flex-direction: column;
    text-align: center;
  }

  .general-image-container {
    width: 150px;
    height: 200px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .kingdom-title h1 {
    font-size: 28px;
  }

  .kingdom-title .ruler,
  .kingdom-title .day {
    font-size: 14px;
  }

  .resources {
    grid-template-columns: 1fr;
  }

  .resource-icon {
    font-size: 32px;
  }

  .resource-value {
    font-size: 22px;
  }

  .sidebar-title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .info-panel {
    padding: 20px;
  }

  .info-panel h3 {
    font-size: 22px;
    margin-bottom: 20px;
  }

  .tip-section {
    padding: 20px;
  }

  /* 전투 모달 */
  .battle-mode-grid {
    grid-template-columns: 1fr;
    padding: 25px;
    gap: 20px;
  }

  .mode-card {
    padding: 30px 20px;
  }

  .battle-log-container {
    padding: 20px;
    max-height: 400px;
  }

  /* PVP 모달 */
  .pvp-players-list {
    padding: 20px;
  }

  .player-card {
    flex-direction: column;
    text-align: center;
    padding: 15px;
  }

  .player-rank {
    font-size: 28px;
    margin-bottom: 10px;
  }

  .player-info h3 {
    font-size: 20px;
  }

  .player-stats {
    justify-content: center;
    flex-wrap: wrap;
  }

  .player-generals {
    text-align: center;
    margin-top: 10px;
  }

  /* 리더보드 */
  .leaderboard-content {
    padding: 20px;
  }

  .rank-display {
    flex-direction: column;
    text-align: center;
  }

  .rank-number {
    font-size: 48px;
    margin-bottom: 15px;
  }

  .leaderboard-entry {
    flex-direction: column;
    text-align: center;
    padding: 15px;
  }

  .entry-rank {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .entry-stats {
    text-align: center;
    margin-top: 10px;
  }
}

@media (max-width: 640px) {
  .main-page {
    padding: 10px;
  }

  .kingdom-header {
    border-radius: 16px;
    margin-bottom: 20px;
  }

  .kingdom-content {
    padding: 20px;
  }

  .kingdom-title h1 {
    font-size: 24px;
    letter-spacing: 1px;
  }

  .action-list {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .action-button {
    gap: 15px;
  }

  .action-btn-icon {
    font-size: 36px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .info-card {
    padding: 15px;
  }

  /* 모달 헤더 */
  .modal-header {
    padding: 20px;
  }

  .modal-header h2 {
    font-size: 24px;
  }

  .btn-close {
    width: 35px;
    height: 35px;
    font-size: 20px;
  }

  /* 장수 카드 */
  .general-image-container {
    width: 120px;
    height: 160px;
  }

  .general-name {
    font-size: 20px;
  }

  .stat-bar {
    height: 6px;
  }

  /* 이벤트 모달 */
  .event-card-design {
    padding: 25px;
  }

  .event-header h2 {
    font-size: 28px;
  }

  .event-description {
    font-size: 16px;
    padding: 20px;
  }

  .choice-button {
    padding: 15px;
  }

  .choice-text {
    font-size: 16px;
  }

  /* 전투 헤더 */
  .battle-vs {
    flex-direction: column;
    gap: 10px;
  }

  .kingdom-name {
    font-size: 16px;
    padding: 8px 16px;
  }

  .vs-text {
    font-size: 20px;
  }

  /* 버튼 크기 조정 */
  .btn {
    padding: 12px 24px;
    font-size: 14px;
  }

  .btn-large {
    padding: 14px 32px;
    font-size: 16px;
  }

  /* 알림 */
  .notification {
    top: 15px;
    right: 15px;
    left: 15px;
    padding: 15px 20px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .kingdom-title h1 {
    font-size: 20px;
  }

  .resources {
    gap: 10px;
  }

  .resource-item {
    padding: 15px;
    gap: 10px;
  }

  .resource-icon {
    font-size: 28px;
  }

  .resource-value {
    font-size: 20px;
  }

  .resource-label {
    font-size: 11px;
  }

  .action-button {
    padding: 12px;
  }

  .action-btn-content h3 {
    font-size: 16px;
  }

  .action-btn-content p {
    font-size: 11px;
  }

  .info-panel h3 {
    font-size: 20px;
  }

  .tip-section h4 {
    font-size: 16px;
  }

  .tip-section li {
    font-size: 13px;
  }

  /* 모달 */
  .modal-header h2 {
    font-size: 20px;
  }

  .general-name {
    font-size: 18px;
  }

  .player-card {
    padding: 12px;
  }

  .player-rank {
    font-size: 24px;
  }

  .player-info h3 {
    font-size: 18px;
  }
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%);
  border-radius: 24px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  font-size: 32px;
  color: white;
  font-weight: 700;
}

.btn-close {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  color: white;
  transition: all 0.3s;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

/* 장수 그리드 */
.generals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 25px;
  padding: 30px;
}

.general-card-new {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 20px;
  padding: 25px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 25px;
  transition: all 0.3s;
}

.general-card-new:hover {
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.general-image-container {
  flex-shrink: 0;
  width: 180px;
  height: 240px;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.general-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.general-details {
  flex: 1;
  color: white;
}

.general-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 10px;
}

.general-name {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 5px;
  color: #fff;
}

.general-title {
  font-size: 14px;
  color: #a0a0ff;
  font-weight: 500;
}

.general-rarity-badge {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.general-rarity-badge.rarity-common {
  background: linear-gradient(135deg, rgba(156, 163, 175, 0.4) 0%, rgba(107, 114, 128, 0.4) 100%);
  color: #f3f4f6;
  border: 1px solid rgba(156, 163, 175, 0.5);
}

.general-rarity-badge.rarity-rare {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.4) 100%);
  color: #dbeafe;
  border: 1px solid rgba(59, 130, 246, 0.6);
}

.general-rarity-badge.rarity-epic {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.5) 0%, rgba(147, 51, 234, 0.5) 100%);
  color: #f3e8ff;
  border: 1px solid rgba(168, 85, 247, 0.7);
  animation: epicGlow 2s ease-in-out infinite;
}

@keyframes epicGlow {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(168, 85, 247, 0.3), 0 0 15px rgba(168, 85, 247, 0.2);
  }
  50% {
    box-shadow: 0 2px 12px rgba(168, 85, 247, 0.6), 0 0 25px rgba(168, 85, 247, 0.4);
  }
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  font-size: 20px;
}

.stat-info {
  flex: 1;
  display: grid;
  grid-template-columns: 50px 1fr 40px;
  align-items: center;
  gap: 10px;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.stat-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s;
}

.stat-fill.power {
  background: linear-gradient(90deg, #ff6b6b, #ff8787);
}

.stat-fill.intelligence {
  background: linear-gradient(90deg, #4dabf7, #74c0fc);
}

.stat-fill.leadership {
  background: linear-gradient(90deg, #ffd43b, #ffe066);
}

.stat-value {
  font-size: 14px;
  font-weight: 700;
  text-align: right;
}

.skills-section h4 {
  font-size: 14px;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.9);
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.skill-badge {
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(75, 0, 130, 0.3));
  border: 1px solid rgba(138, 43, 226, 0.5);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.skill-name {
  font-weight: 600;
}

.skill-rate {
  color: #90ee90;
  font-weight: 700;
}

.assign-soldiers {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.assign-soldiers label {
  font-size: 14px;
  font-weight: 600;
}

.soldier-input {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
}

.soldier-input:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.15);
}

.no-skills {
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(100, 116, 139, 0.2);
  border-radius: 12px;
  text-align: center;
}

.no-skills-text {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 600;
}

.btn-dismiss-general {
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, rgba(153, 27, 27, 0.3) 100%);
  border: 2px solid rgba(239, 68, 68, 0.5);
  border-radius: 12px;
  color: #fca5a5;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-dismiss-general:hover {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.5) 0%, rgba(153, 27, 27, 0.5) 100%);
  border-color: rgba(239, 68, 68, 0.8);
  color: #fee2e2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-dismiss-general:active {
  transform: translateY(0);
}

/* 이벤트 모달 */
.event-modal {
  max-width: 700px;
}

.event-card-design {
  padding: 40px;
}

.event-header h2 {
  text-align: center;
  font-size: 36px;
  color: white;
  margin-bottom: 25px;
}

.event-description {
  font-size: 18px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 35px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
}

.event-choices {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.choice-button {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
  border: 2px solid rgba(102, 126, 234, 0.5);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
  color: white;
}

.choice-button:not(:disabled):hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5));
  transform: translateX(10px);
  border-color: rgba(102, 126, 234, 0.8);
}

.choice-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.choice-text {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.choice-effects {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}

.choice-cost, .choice-reward {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.cost-item, .reward-item {
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
}

.cost-item {
  color: #ff6b6b;
}

.reward-item {
  color: #51cf66;
}

.choice-general-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
  padding: 12px;
  background: rgba(100, 116, 139, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(100, 116, 139, 0.4);
}

.general-preview-name {
  font-weight: 700;
  color: #e2e8f0;
  font-size: 15px;
}

.general-preview-rarity {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-left: 8px;
}

.general-preview-rarity.rarity-common {
  background: linear-gradient(135deg, rgba(156, 163, 175, 0.4) 0%, rgba(107, 114, 128, 0.4) 100%);
  color: #f3f4f6;
  border: 1px solid rgba(156, 163, 175, 0.5);
}

.general-preview-rarity.rarity-rare {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.4) 100%);
  color: #dbeafe;
  border: 1px solid rgba(59, 130, 246, 0.6);
}

.general-preview-rarity.rarity-epic {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.5) 0%, rgba(147, 51, 234, 0.5) 100%);
  color: #f3e8ff;
  border: 1px solid rgba(168, 85, 247, 0.7);
}

.general-preview-stats {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 4px;
}

/* 갈림길 카드 모달 */
.crossroad-modal {
  max-width: 800px;
}

.crossroad-card-design {
  padding: 40px;
}

.crossroad-header {
  text-align: center;
  margin-bottom: 30px;
}

.crossroad-header h2 {
  font-size: 42px;
  color: #60a5fa;
  text-shadow: 0 0 20px rgba(96, 165, 250, 0.5);
  margin-bottom: 10px;
}

.crossroad-subtitle {
  font-size: 18px;
  color: rgba(96, 165, 250, 0.8);
  font-style: italic;
}

.crossroad-description {
  font-size: 18px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 35px;
  padding: 25px;
  background: rgba(96, 165, 250, 0.1);
  border-radius: 16px;
  border: 1px solid rgba(96, 165, 250, 0.3);
}

.crossroad-choices {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.crossroad-choice-button {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3));
  border: 2px solid rgba(139, 92, 246, 0.5);
  border-radius: 20px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.4s;
  text-align: left;
  color: white;
}

.crossroad-choice-button:hover {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6));
  transform: translateX(15px) scale(1.02);
  border-color: rgba(96, 165, 250, 0.8);
  box-shadow: 0 10px 40px rgba(139, 92, 246, 0.4);
}

.choice-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #60a5fa;
}

.choice-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
  line-height: 1.6;
}

.choice-permanent-effect {
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 12px;
  border-left: 4px solid #60a5fa;
}

.effect-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.effect-icon {
  font-size: 20px;
  animation: sparkle 2s infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.effect-name {
  font-size: 18px;
  font-weight: 700;
  color: #60a5fa;
}

.effect-description {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

/* 전투 모달 */
.battle-modal-new {
  max-width: 900px;
}

.battle-header-new {
  padding: 30px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.battle-header-new h2 {
  text-align: center;
  color: white;
  font-size: 32px;
  margin-bottom: 20px;
}

.battle-vs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  font-size: 20px;
}

.kingdom-name {
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 12px;
}

.kingdom-name.attacker {
  background: rgba(76, 175, 80, 0.3);
  color: #4CAF50;
  border: 2px solid #4CAF50;
}

.kingdom-name.defender {
  background: rgba(244, 67, 54, 0.3);
  color: #f44336;
  border: 2px solid #f44336;
}

.vs-text {
  font-weight: 900;
  color: white;
  font-size: 24px;
}

.battle-log-container {
  padding: 30px;
  max-height: 500px;
  overflow-y: auto;
}

.battle-log {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.battle-log-entry {
  background: rgba(255, 255, 255, 0.05);
  border-left: 4px solid #667eea;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s;
}

.battle-log-entry:hover {
  background: rgba(255, 255, 255, 0.08);
}

.log-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.log-turn {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.log-general {
  font-weight: 700;
  color: white;
  font-size: 16px;
}

.log-result {
  margin-left: auto;
  padding: 4px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
}

.log-result.success {
  background: rgba(76, 175, 80, 0.3);
  color: #4CAF50;
}

.log-result.fail {
  background: rgba(244, 67, 54, 0.3);
  color: #f44336;
}

.log-action {
  font-size: 15px;
  color: #a0a0ff;
  margin-bottom: 8px;
  font-weight: 600;
}

.log-message {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.battle-result-section, .battle-actions-section {
  padding: 30px;
  text-align: center;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

.battle-result {
  margin-bottom: 25px;
}

.battle-result h3 {
  font-size: 48px;
  margin-bottom: 15px;
}

.battle-result.victory h3 {
  color: #4CAF50;
}

.battle-result.defeat h3 {
  color: #f44336;
}

.battle-result p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
}

.btn {
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
}

.btn-warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.6);
}

.btn-large {
  padding: 18px 48px;
  font-size: 18px;
}

/* 알림 */
.notification {
  position: fixed;
  top: 30px;
  right: 30px;
  padding: 20px 30px;
  border-radius: 16px;
  color: white;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(10px);
}

.notification-icon {
  font-size: 24px;
  font-weight: 900;
}

.notification.success {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.95), rgba(56, 142, 60, 0.95));
  border: 2px solid #4CAF50;
}

.notification.error {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.95), rgba(211, 47, 47, 0.95));
  border: 2px solid #f44336;
}

.notification.info {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.95), rgba(25, 118, 210, 0.95));
  border: 2px solid #2196F3;
}

/* 트랜지션 */
.modal-enter-active, .modal-leave-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.notification-enter-active, .notification-leave-active {
  transition: all 0.3s;
}

.notification-enter-from {
  transform: translateX(400px);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(400px);
  opacity: 0;
}

.log-enter-active {
  transition: all 0.4s;
}

.log-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

/* 전투 모드 선택 */
.battle-mode-modal {
  max-width: 800px;
}

.battle-mode-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  padding: 40px;
}

.mode-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  padding: 40px 30px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  color: white;
}

.mode-card:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.4));
  border-color: rgba(102, 126, 234, 0.6);
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.mode-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.mode-card h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
}

.mode-card p {
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.5;
}

/* 스토리 전투 모달 */
.story-battle-modal {
  max-width: 900px;
  max-height: 90vh;
  background: linear-gradient(135deg, rgba(20, 20, 30, 0.98), rgba(30, 30, 40, 0.98));
}

.story-battle-header {
  padding: 25px 30px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
}

.battle-title h2 {
  text-align: center;
  color: white;
  font-size: 28px;
  margin-bottom: 15px;
  font-weight: 700;
}

.story-battle-log {
  position: relative;
  max-height: 500px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.4);
}

.story-scroll-container {
  padding: 40px 50px;
  height: 500px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.story-scroll-container::-webkit-scrollbar {
  display: none;
}

.story-book {
  max-width: 800px;
  margin: 0 auto;
  min-height: 100%;
}

.story-text {
  font-family: 'Noto Sans KR', serif;
  font-size: 17px;
  line-height: 2;
  color: rgba(255, 255, 255, 0.9);
  text-align: justify;
  letter-spacing: 0.3px;
  padding-bottom: 500px;
}

.story-text p {
  margin: 0 0 1.5em 0;
  text-indent: 1em;
  opacity: 1;
}

.story-spacer {
  height: 100vh;
}

/* 페이드 그라데이션 효과 - 위쪽 */
.story-battle-log::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to bottom, rgba(20, 20, 30, 1) 0%, transparent 100%);
  pointer-events: none;
  z-index: 10;
}

/* 페이드 그라데이션 효과 - 아래쪽 */
.story-battle-log::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: linear-gradient(to top, rgba(20, 20, 30, 1) 0%, transparent 100%);
  pointer-events: none;
  z-index: 10;
}

/* 나레이션 - 일반 텍스트 */
.text-narration {
  color: rgba(200, 220, 255, 0.95);
  font-style: italic;
}

/* 아군 액션 - 파란색 */
.text-ally {
  color: rgba(100, 180, 255, 1);
  font-weight: 500;
}

/* 적군 액션 - 빨간색 */
.text-enemy {
  color: rgba(255, 120, 120, 1);
  font-weight: 500;
}

/* 아군 대사 - 밝은 파란색 */
.text-ally-dialogue {
  color: rgba(150, 200, 255, 1);
  font-weight: 600;
  font-style: normal;
}

/* 적군 대사 - 밝은 빨간색 */
.text-enemy-dialogue {
  color: rgba(255, 150, 150, 1);
  font-weight: 600;
  font-style: normal;
}

.dialogue-text {
  font-style: italic;
}

/* 전투 결과 */
.story-battle-result {
  padding: 30px;
  text-align: center;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2));
}

.result-banner {
  margin-bottom: 25px;
  padding: 25px;
  border-radius: 16px;
  animation: resultPulse 1s ease-out;
}

@keyframes resultPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.result-banner.victory {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2));
  border: 2px solid rgba(34, 197, 94, 0.5);
  box-shadow: 0 0 30px rgba(34, 197, 94, 0.3);
}

.result-banner.defeat {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2));
  border: 2px solid rgba(239, 68, 68, 0.5);
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.3);
}

.result-banner h3 {
  font-size: 42px;
  margin-bottom: 15px;
  color: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.result-banner p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 8px 0;
}

/* 스토리 페이드 트랜지션 */
.story-fade-enter-active {
  transition: all 0.5s ease-out;
}

.story-fade-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.story-fade-leave-active {
  transition: all 0.3s ease-in;
}

.story-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* PVP 관련 스타일 */
.pvp-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #60a5fa 0%, #ffed4e 100%);
  color: #000;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(96, 165, 250, 0.4);
}

.pve-card {
  position: relative;
}

.pvp-card {
  position: relative;
}

/* PVP 선택 모달 */
.pvp-selection-modal {
  max-width: 900px;
}

.pvp-players-list {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 60vh;
  overflow-y: auto;
}

.player-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s;
  color: white;
}

.player-card:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border-color: #667eea;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.player-rank {
  font-size: 32px;
  font-weight: 900;
  color: #667eea;
  min-width: 60px;
  text-align: center;
}

.player-info {
  flex: 1;
}

.player-info h3 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 5px;
}

.player-info .kingdom-name {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 10px;
}

.player-stats {
  display: flex;
  gap: 15px;
  font-size: 14px;
}

.player-stats .stat {
  background: rgba(0, 0, 0, 0.3);
  padding: 5px 12px;
  border-radius: 20px;
}

.player-generals {
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: right;
  font-size: 13px;
  opacity: 0.9;
}

.pvp-footer {
  padding: 20px 30px;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.btn-secondary {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
  color: white;
  padding: 14px 32px;
  border: 2px solid rgba(102, 126, 234, 0.5);
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5));
  border-color: rgba(102, 126, 234, 0.8);
  transform: translateY(-2px);
}

/* 리더보드 모달 */
.leaderboard-modal {
  max-width: 800px;
}

.leaderboard-content {
  padding: 30px;
}

.my-rank-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
  border: 2px solid rgba(102, 126, 234, 0.4);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 30px;
  color: white;
}

.my-rank-card h3 {
  font-size: 18px;
  margin-bottom: 15px;
  opacity: 0.9;
}

.rank-display {
  display: flex;
  align-items: center;
  gap: 25px;
}

.rank-number {
  font-size: 56px;
  font-weight: 900;
  color: #60a5fa;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.rank-info p {
  margin: 5px 0;
}

.rank-info .username {
  font-size: 24px;
  font-weight: 700;
}

.rank-info .trophies {
  font-size: 20px;
  color: #60a5fa;
}

.rank-info .record {
  font-size: 16px;
  opacity: 0.8;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.leaderboard-entry {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s;
  color: white;
}

.leaderboard-entry.is-me {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
  border-color: rgba(102, 126, 234, 0.5);
}

.leaderboard-entry:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.entry-rank {
  font-size: 28px;
  font-weight: 700;
  min-width: 50px;
  text-align: center;
}

.entry-info {
  flex: 1;
}

.entry-info h4 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 3px;
}

.entry-info p {
  font-size: 13px;
  opacity: 0.8;
}

.entry-stats {
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: right;
  font-size: 14px;
}

.entry-stats .trophy {
  color: #60a5fa;
  font-weight: 700;
}

.entry-stats .record {
  opacity: 0.8;
  font-size: 12px;
}

/* 스크롤바 스타일링 */
.modal-content::-webkit-scrollbar,
.battle-log-container::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track,
.battle-log-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb,
.battle-log-container::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.5);
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb:hover,
.battle-log-container::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.7);
}

/* 패시브 카드 모달 */
.passive-card-modal {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%);
  border-radius: 24px;
  padding: 40px;
  max-width: 1200px;
  width: 90%;
  border: 2px solid rgba(139, 92, 246, 0.3);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);
}

.passive-modal-header {
  text-align: center;
  margin-bottom: 40px;
}

.passive-modal-header h2 {
  font-size: 42px;
  font-family: 'Cinzel', serif;
  font-weight: 900;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 15px;
}

.passive-modal-header p {
  font-size: 18px;
  color: #94a3b8;
}

.passive-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.passive-card {
  background: linear-gradient(145deg, rgba(20, 25, 35, 0.95), rgba(30, 35, 50, 0.95));
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border: 4px solid;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6);
  aspect-ratio: 2/3;
  min-height: 500px;
}

.passive-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  transform: rotate(45deg);
  transition: all 0.8s;
  z-index: 1;
}

.passive-card:hover::before {
  left: 100%;
}

.card-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.passive-card:hover .card-image {
  transform: scale(1.1);
}

.card-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.9) 100%);
  z-index: 1;
}

.card-content-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 25px;
  z-index: 2;
}

.passive-card.rarity-common {
  border-color: #9ca3af;
  box-shadow:
    0 15px 50px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(156, 163, 175, 0.3) inset;
}

.passive-card.rarity-rare {
  border-color: #3b82f6;
  box-shadow:
    0 15px 50px rgba(0, 0, 0, 0.6),
    0 0 30px rgba(59, 130, 246, 0.4),
    0 0 0 1px rgba(59, 130, 246, 0.5) inset;
}

.passive-card.rarity-epic {
  border-color: #a855f7;
  box-shadow:
    0 15px 50px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(168, 85, 247, 0.5),
    0 0 0 1px rgba(168, 85, 247, 0.6) inset;
}

.passive-card.rarity-legendary {
  border-color: #fbbf24;
  box-shadow:
    0 15px 50px rgba(0, 0, 0, 0.6),
    0 0 50px rgba(251, 191, 36, 0.7),
    0 0 0 2px rgba(251, 191, 36, 0.8) inset;
  animation: legendary-glow 2s ease-in-out infinite;
}

@keyframes legendary-glow {
  0%, 100% {
    box-shadow:
      0 15px 50px rgba(0, 0, 0, 0.6),
      0 0 50px rgba(251, 191, 36, 0.7),
      0 0 0 2px rgba(251, 191, 36, 0.8) inset;
  }
  50% {
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.8),
      0 0 70px rgba(251, 191, 36, 1),
      0 0 0 3px rgba(251, 191, 36, 1) inset;
  }
}

.passive-card:hover {
  transform: translateY(-15px) scale(1.08) rotateZ(2deg);
}

.passive-card.rarity-common:hover {
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.8),
    0 0 40px rgba(156, 163, 175, 0.5),
    0 0 0 2px rgba(156, 163, 175, 0.5) inset;
}

.passive-card.rarity-rare:hover {
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.8),
    0 0 50px rgba(59, 130, 246, 0.7),
    0 0 0 2px rgba(59, 130, 246, 0.8) inset;
}

.passive-card.rarity-epic:hover {
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.8),
    0 0 60px rgba(168, 85, 247, 0.8),
    0 0 0 3px rgba(168, 85, 247, 0.9) inset;
}

.passive-card.rarity-legendary:hover {
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.9),
    0 0 80px rgba(251, 191, 36, 1),
    0 0 0 4px rgba(251, 191, 36, 1) inset;
}

.passive-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.passive-card-icon {
  font-size: 64px;
  filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.6));
}

.passive-card-rarity {
  font-size: 13px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rarity-common .passive-card-rarity {
  background: rgba(156, 163, 175, 0.3);
  color: #d1d5db;
}

.rarity-rare .passive-card-rarity {
  background: rgba(59, 130, 246, 0.3);
  color: #93c5fd;
}

.rarity-epic .passive-card-rarity {
  background: rgba(168, 85, 247, 0.3);
  color: #e9d5ff;
}

.rarity-legendary .passive-card-rarity {
  background: rgba(251, 191, 36, 0.3);
  color: #fef3c7;
}

.passive-card-name {
  font-size: 22px;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 12px;
  font-family: 'Cinzel', serif;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.5px;
}

.passive-card-description {
  font-size: 15px;
  color: #cbd5e1;
  line-height: 1.5;
  margin-bottom: 18px;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.8);
  font-weight: 500;
}

.passive-card-trigger {
  display: flex;
  justify-content: center;
}

.trigger-badge {
  padding: 8px 16px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #c4b5fd;
}

/* 왕실 카드 섹션 */
.royal-cards-section {
  margin-top: 25px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.4) 100%);
  border: 2px solid rgba(100, 116, 139, 0.4);
  border-radius: 16px;
  padding: 25px;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
}

.royal-passive-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.royal-passive-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%);
  border-radius: 16px;
  padding: 0;
  border: 2px solid;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.royal-passive-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.4s;
  z-index: -1;
}

.royal-passive-card:hover::before {
  opacity: 1;
}

.royal-passive-card:hover {
  transform: translateY(-6px) scale(1.02);
}

/* 희귀도별 테두리 */
.royal-passive-card.rarity-common {
  border-color: #9ca3af;
  box-shadow: 0 4px 12px rgba(156, 163, 175, 0.2);
}

.royal-passive-card.rarity-common::before {
  background: linear-gradient(135deg, rgba(156, 163, 175, 0.3) 0%, transparent 100%);
}

.royal-passive-card.rarity-common:hover {
  border-color: #d1d5db;
  box-shadow: 0 8px 24px rgba(156, 163, 175, 0.4);
}

.royal-passive-card.rarity-rare {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.royal-passive-card.rarity-rare::before {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, transparent 100%);
}

.royal-passive-card.rarity-rare:hover {
  border-color: #60a5fa;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.5);
}

.royal-passive-card.rarity-epic {
  border-color: #a855f7;
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
}

.royal-passive-card.rarity-epic::before {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, transparent 100%);
}

.royal-passive-card.rarity-epic:hover {
  border-color: #c084fc;
  box-shadow: 0 8px 24px rgba(168, 85, 247, 0.5);
}

.royal-passive-card.rarity-legendary {
  border-color: #fbbf24;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
  animation: legendaryGlow 3s ease-in-out infinite;
}

.royal-passive-card.rarity-legendary::before {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, transparent 100%);
}

.royal-passive-card.rarity-legendary:hover {
  border-color: #fcd34d;
  box-shadow: 0 8px 32px rgba(251, 191, 36, 0.6);
}

@keyframes legendaryGlow {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4), 0 0 20px rgba(251, 191, 36, 0.2);
  }
  50% {
    box-shadow: 0 4px 20px rgba(251, 191, 36, 0.6), 0 0 30px rgba(251, 191, 36, 0.4);
  }
}

/* 카드 내부 */
.card-border-glow {
  padding: 2px;
  background: linear-gradient(135deg, rgba(100, 116, 139, 0.1) 0%, transparent 100%);
  border-radius: 14px;
}

.card-inner {
  background: rgba(15, 23, 42, 0.8);
  border-radius: 12px;
  padding: 18px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-icon-large {
  font-size: 42px;
  filter: drop-shadow(0 0 10px rgba(100, 116, 139, 0.4));
}

.card-rarity-badge {
  font-size: 10px;
  font-weight: 800;
  padding: 5px 10px;
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Cinzel', serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.rarity-common .card-rarity-badge {
  background: linear-gradient(135deg, rgba(156, 163, 175, 0.4) 0%, rgba(107, 114, 128, 0.4) 100%);
  color: #f3f4f6;
  border: 1px solid rgba(156, 163, 175, 0.5);
}

.rarity-rare .card-rarity-badge {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.4) 100%);
  color: #dbeafe;
  border: 1px solid rgba(59, 130, 246, 0.6);
}

.rarity-epic .card-rarity-badge {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(147, 51, 234, 0.4) 100%);
  color: #f3e8ff;
  border: 1px solid rgba(168, 85, 247, 0.6);
}

.rarity-legendary .card-rarity-badge {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.5) 0%, rgba(245, 158, 11, 0.5) 100%);
  color: #fffbeb;
  border: 1px solid rgba(251, 191, 36, 0.7);
  animation: badgeShine 2s ease-in-out infinite;
}

@keyframes badgeShine {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
  }
  50% {
    box-shadow: 0 2px 12px rgba(251, 191, 36, 0.6);
  }
}

.card-name {
  font-size: 16px;
  font-weight: 800;
  color: #e2e8f0;
  margin-bottom: 12px;
  font-family: 'Cinzel', serif;
  text-shadow: 0 0 8px rgba(100, 116, 139, 0.3);
  letter-spacing: 0.5px;
}

.card-trigger-text {
  font-size: 12px;
  color: #cbd5e1;
  padding: 6px 12px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* 환생 모달 */
.reincarnation-modal {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%);
  border-radius: 24px;
  padding: 40px;
  max-width: 1400px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  border: 3px solid rgba(251, 191, 36, 0.5);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.9),
    0 0 100px rgba(251, 191, 36, 0.3);
  animation: reincarnation-glow 3s ease-in-out infinite;
}

@keyframes reincarnation-glow {
  0%, 100% {
    box-shadow:
      0 30px 80px rgba(0, 0, 0, 0.9),
      0 0 100px rgba(251, 191, 36, 0.3);
  }
  50% {
    box-shadow:
      0 30px 80px rgba(0, 0, 0, 0.9),
      0 0 120px rgba(251, 191, 36, 0.5);
  }
}

.reincarnation-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 2px solid rgba(251, 191, 36, 0.3);
}

.reincarnation-header h2 {
  font-size: 48px;
  font-family: 'Cinzel', serif;
  font-weight: 900;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 15px;
  animation: title-shimmer 3s ease-in-out infinite;
}

@keyframes title-shimmer {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.5)); }
  50% { filter: drop-shadow(0 0 40px rgba(251, 191, 36, 0.8)); }
}

.reincarnation-header p {
  font-size: 20px;
  color: #cbd5e1;
  margin-bottom: 25px;
}

.reincarnation-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.reincarnation-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 30px;
  background: rgba(251, 191, 36, 0.1);
  border: 2px solid rgba(251, 191, 36, 0.3);
  border-radius: 16px;
  min-width: 150px;
}

.reincarnation-stat .stat-label {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.reincarnation-stat .stat-value {
  font-size: 32px;
  font-family: 'Cinzel', serif;
  font-weight: 900;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.reincarnation-content {
  text-align: center;
}

.reincarnation-content h3 {
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 10px;
  font-family: 'Cinzel', serif;
}

.reincarnation-description {
  font-size: 16px;
  color: #94a3b8;
  margin-bottom: 30px;
}

.reincarnation-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.reincarnation-card {
  background: linear-gradient(145deg, rgba(20, 25, 35, 0.95), rgba(30, 35, 50, 0.95));
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
  aspect-ratio: 2/3;
  min-height: 400px;
}

.reincarnation-card:hover {
  transform: translateY(-10px) scale(1.05);
}

.reincarnation-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.no-cards-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  gap: 20px;
}

.no-cards-message p {
  font-size: 20px;
  color: #94a3b8;
  margin: 0;
}

.no-cards-message p:first-child {
  font-size: 24px;
  color: #cbd5e1;
  font-weight: 600;
}

/* 반응형 - 태블릿 */
@media (max-width: 1024px) {
  .passive-cards-grid,
  .reincarnation-cards-grid {
    grid-template-columns: 1fr;
  }

  .reincarnation-stats {
    flex-direction: column;
    gap: 15px;
  }

  .reincarnation-stat {
    min-width: 100%;
  }

  .kingdom-info-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .action-sidebar {
    width: 100%;
  }
}

/* 모바일 최적화 - 스크롤 없는 고정 레이아웃 */
@media (max-width: 768px) {
  .main-page {
    padding: 0;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* 중앙 배경 이미지 모바일 크기 조정 */
  .main-page::before {
    width: min(60vw, 300px);
    height: min(60vw, 300px);
    opacity: 0.03;
  }

  /* 헤더 최소화 */
  .kingdom-header {
    margin-bottom: 0;
    flex-shrink: 0;
  }

  .kingdom-banner {
    padding: 8px 10px;
    border-radius: 0;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-height: auto;
  }

  .banner-decoration {
    display: none;
  }

  .banner-center {
    padding: 0;
    text-align: left;
    flex: 1;
  }

  .crown-emblem {
    display: none;
  }

  .kingdom-name {
    font-size: 16px;
    margin: 0;
  }

  .kingdom-subtitle {
    font-size: 10px;
    margin-top: 2px;
  }

  .ruler-title,
  .ruler-name {
    font-size: 10px;
  }

  /* 왕국 정보 그리드 - 모바일 레이아웃 (상단 + 오른쪽 + 하단) */
  .kingdom-info-grid {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 140px;
    grid-template-rows: 1fr auto;
    gap: 5px;
    padding: 5px;
    border-radius: 0;
    overflow: hidden;
  }

  /* 왕국 정보 (상단 왼쪽) - 대전쟁 타이머 + 패시브 카드 */
  .kingdom-stats-panel {
    grid-column: 1;
    grid-row: 1;
    padding: 8px;
    gap: 6px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .stat-row {
    flex-direction: column;
    gap: 5px;
  }

  .stat-badge {
    padding: 6px 8px;
    min-width: auto;
  }

  .stat-icon {
    font-size: 16px;
  }

  .stat-label {
    font-size: 10px;
  }

  .stat-value {
    font-size: 11px;
  }

  /* 타이머 축소 */
  .time-remaining-card {
    padding: 8px;
  }

  .time-header {
    margin-bottom: 6px;
  }

  .time-icon {
    font-size: 16px;
  }

  .time-title {
    font-size: 12px;
  }

  .time-blocks {
    gap: 4px;
  }

  .time-block {
    min-width: 30px;
  }

  .time-number {
    font-size: 18px;
  }

  .time-unit {
    font-size: 9px;
  }

  .time-separator {
    font-size: 14px;
    margin: 0 2px;
  }

  /* 패시브 카드 축소 */
  .passive-cards-panel {
    padding: 8px;
    margin-top: 6px;
  }

  .panel-title {
    font-size: 12px;
    margin-bottom: 6px;
    padding-bottom: 4px;
  }

  .passive-cards-list {
    gap: 4px;
  }

  .passive-card-item {
    padding: 5px;
    gap: 5px;
    border-radius: 6px;
  }

  .passive-card-icon {
    font-size: 16px;
    width: 24px;
    height: 24px;
  }

  .passive-card-info {
    flex: 1;
    min-width: 0;
  }

  .passive-card-name {
    font-size: 11px;
  }

  .passive-card-trigger {
    font-size: 9px;
  }

  .passive-card-rarity {
    font-size: 9px;
    padding: 2px 6px;
  }

  /* 신의 계명도 축소 */
  .commandments-panel {
    padding: 8px;
  }

  .commandments-grid {
    gap: 4px;
  }

  .commandment-item {
    padding: 4px 6px;
  }

  .commandment-icon {
    font-size: 14px;
  }

  .commandment-name {
    font-size: 10px;
  }

  /* 왕국 재화 (오른쪽) */
  .kingdom-resources-panel {
    grid-column: 2;
    grid-row: 1;
    padding: 8px;
    gap: 6px;
    overflow-y: auto;
  }

  .resources-grid {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .resource-card {
    padding: 6px;
  }

  .resource-header {
    margin-bottom: 4px;
  }

  .resource-icon {
    font-size: 14px;
  }

  .resource-label {
    font-size: 9px;
  }

  .resource-amount {
    font-size: 13px;
    margin-bottom: 3px;
  }

  .resource-bar {
    height: 4px;
  }

  /* 제국 정복 패널 축소 */
  .empire-conquest-panel {
    padding: 6px;
    margin-top: 6px;
  }

  .conquest-header {
    margin-bottom: 4px;
  }

  .conquest-icon {
    font-size: 14px;
  }

  .conquest-title {
    font-size: 11px;
  }

  .conquest-stats {
    margin-bottom: 4px;
  }

  .conquest-label,
  .conquest-count {
    font-size: 9px;
  }

  .conquest-bar {
    height: 12px;
  }

  .conquest-percentage {
    font-size: 9px;
  }

  /* 전투 준비 현황 축소 */
  .battle-status-panel {
    padding: 6px;
    margin-top: 6px;
  }

  .battle-stats-grid {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .battle-stat-card {
    padding: 6px;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }

  .battle-stat-icon {
    font-size: 16px;
  }

  .battle-stat-info {
    flex: 1;
  }

  .battle-stat-label {
    font-size: 9px;
    display: block;
    margin-bottom: 2px;
  }

  .battle-stat-value {
    font-size: 13px;
  }

  .battle-stat-unit {
    font-size: 10px;
  }

  /* 왕명 선택 (하단 전체) */
  .action-sidebar {
    grid-column: 1 / -1;
    grid-row: 2;
    width: 100%;
    height: auto;
    flex-shrink: 0;
  }

  .sidebar-header {
    padding: 6px 8px;
    min-height: auto;
  }

  .sidebar-emblem {
    font-size: 16px;
  }

  .sidebar-title {
    font-size: 13px;
  }

  .sidebar-decoration {
    display: none;
  }

  .action-scroll {
    padding: 6px;
    gap: 6px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .royal-action-card {
    min-height: 70px;
    padding: 0;
  }

  .action-ornament {
    display: none;
  }

  .action-card-inner {
    padding: 8px;
    min-height: 70px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }

  .action-icon-wrapper {
    width: 32px;
    height: 32px;
    margin: 0;
  }

  .action-icon-bg {
    width: 32px;
    height: 32px;
  }

  .action-icon {
    font-size: 24px;
  }

  .action-content {
    text-align: center;
  }

  .action-title {
    font-size: 12px;
    margin-bottom: 2px;
  }

  .action-desc {
    font-size: 9px;
    line-height: 1.2;
  }

  /* 배경 이미지 스타일 숨김 */
  .recruit-background-image,
  .general-background-image,
  .battle-background-image,
  .event-background-image {
    display: none;
  }

  /* 메인 컨텐츠 숨김 (모바일에서는 표시 안함) */
  .game-content {
    display: none;
  }

  /* 모달 모바일 최적화 */
  .modal-content {
    max-width: 95vw;
    max-height: 90vh;
    margin: 10px;
  }

  .generals-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .general-card-new {
    flex-direction: column;
  }

  .general-image-container {
    width: 100%;
    height: 180px;
  }

  /* 알림 */
  .notification {
    max-width: 90vw;
    font-size: 13px;
    padding: 10px 14px;
    top: 10px;
  }
}

/* 작은 모바일 (최소 화면) */
@media (max-width: 480px) {
  .kingdom-banner {
    padding: 6px 8px;
  }

  .kingdom-name {
    font-size: 14px;
  }

  .kingdom-subtitle {
    font-size: 9px;
  }

  .kingdom-info-grid {
    grid-template-columns: 1fr 120px;
    gap: 4px;
    padding: 4px;
  }

  .action-scroll {
    padding: 5px;
    gap: 5px;
  }

  .royal-action-card {
    min-height: 65px;
  }

  .action-card-inner {
    padding: 6px;
    min-height: 65px;
    gap: 3px;
  }

  .action-icon-wrapper {
    width: 28px;
    height: 28px;
  }

  .action-icon-bg {
    width: 28px;
    height: 28px;
  }

  .action-icon {
    font-size: 20px;
  }

  .action-title {
    font-size: 11px;
  }

  .action-desc {
    display: none; /* 작은 화면에서는 설명 숨김 */
  }

  .time-number {
    font-size: 16px;
  }

  .time-unit {
    font-size: 8px;
  }

  .time-separator {
    font-size: 12px;
  }

  .resource-amount {
    font-size: 12px;
  }

  .panel-title {
    font-size: 11px;
  }
}
</style>
