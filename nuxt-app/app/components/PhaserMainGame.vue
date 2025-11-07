<script setup lang="ts">
import Phaser from 'phaser';

const props = defineProps<{
  kingdom: {
    name: string;
    ruler: string;
    day: number;
    resources: {
      food: number;
      gold: number;
      soldiers: number;
      morale: number;
    };
  };
  empire: {
    name: string;
    defeatedFortresses: number;
    totalFortresses: number;
  };
  remainingTime: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  };
  godGameState?: {
    selectedCommandments: Array<{ id: string; icon: string; name: string; description: string }>;
  } | null;
  reincarnationData: {
    count: number;
  };
}>();

const emit = defineEmits<{
  showGenerals: [];
  selectBattleType: [type: string];
  drawEventCard: [];
}>();

let game: Phaser.Game | null = null;
const gameCanvas = ref<HTMLDivElement | null>(null);

class MainGameScene extends Phaser.Scene {
  private resources!: {
    food: { sprite: Phaser.GameObjects.Sprite; text: Phaser.GameObjects.Text };
    gold: { sprite: Phaser.GameObjects.Sprite; text: Phaser.GameObjects.Text };
    soldiers: { sprite: Phaser.GameObjects.Sprite; text: Phaser.GameObjects.Text };
    morale: { sprite: Phaser.GameObjects.Sprite; text: Phaser.GameObjects.Text };
  };
  private actionButtons!: Array<Phaser.GameObjects.Container>;
  private particles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private kingdomBanner!: Phaser.GameObjects.Container;
  private timeBanner!: Phaser.GameObjects.Container;
  private commandmentBanner!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'MainGameScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // 배경 그라디언트
    this.createBackground(width, height);

    // 파티클 효과 (떠다니는 빛 효과)
    this.createParticles(width, height);

    // 상단 배너 (왕국 정보)
    this.createKingdomBanner(width);

    // 중앙 왼쪽: 리소스 표시
    this.createResourceDisplay(width, height);

    // 중앙 오른쪽: 액션 버튼들
    this.createActionButtons(width, height);

    // 하단: 타이머 및 제국 정복 진행도
    this.createBottomPanel(width, height);

    // 왼쪽 사이드: 계명 표시
    if (props.godGameState?.selectedCommandments && props.godGameState.selectedCommandments.length > 0) {
      this.createCommandmentPanel(height);
    }
  }

  private createBackground(width: number, height: number) {
    // 그라디언트 배경
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x0f3460, 1);
    graphics.fillRect(0, 0, width, height);

    // 별 배경
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const star = this.add.circle(x, y, 1, 0xffffff, Phaser.Math.FloatBetween(0.3, 0.8));

      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.2, 1),
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
      });
    }
  }

  private createParticles(width: number, height: number) {
    // 황금 파티클 효과
    const particles = this.add.particles(0, 0, 'particle', {
      x: { min: 0, max: width },
      y: { min: 0, max: height },
      speed: { min: 10, max: 30 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 3000,
      frequency: 200,
      blendMode: 'ADD',
    });
  }

  private createKingdomBanner(width: number) {
    this.kingdomBanner = this.add.container(width / 2, 60);

    // 배너 배경
    const bannerBg = this.add.graphics();
    bannerBg.fillStyle(0x2d3561, 0.9);
    bannerBg.fillRoundedRect(-300, -40, 600, 80, 10);
    bannerBg.lineStyle(3, 0xffd700, 1);
    bannerBg.strokeRoundedRect(-300, -40, 600, 80, 10);
    this.kingdomBanner.add(bannerBg);

    // 왕관 아이콘
    const crownText = this.add.text(-280, -25, '👑', {
      fontSize: '40px',
    });
    this.kingdomBanner.add(crownText);

    // 왕국 이름
    const kingdomName = this.add.text(0, -20, props.kingdom.name, {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffd700',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);
    this.kingdomBanner.add(kingdomName);

    // 통치자 이름
    const rulerName = this.add.text(0, 15, `통치자: ${props.kingdom.ruler}`, {
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 2,
    }).setOrigin(0.5);
    this.kingdomBanner.add(rulerName);

    // 재위 기간
    const reignDays = this.add.text(220, -10, `📅 ${props.kingdom.day}일`, {
      fontSize: '16px',
      color: '#ffffff',
    });
    this.kingdomBanner.add(reignDays);

    // 환생 횟수
    if (props.reincarnationData.count > 0) {
      const reincarnation = this.add.text(220, 10, `♻️ ${props.reincarnationData.count}회`, {
        fontSize: '16px',
        color: '#00ff00',
      });
      this.kingdomBanner.add(reincarnation);
    }

    // 빛나는 효과
    this.tweens.add({
      targets: bannerBg,
      alpha: 0.8,
      duration: 2000,
      yoyo: true,
      repeat: -1,
    });
  }

  private createResourceDisplay(width: number, height: number) {
    const startX = 150;
    const startY = 200;
    const spacing = 120;

    const resourceConfigs = [
      { key: 'food', emoji: '🌾', label: '식량', value: props.kingdom.resources.food, color: 0x90EE90 },
      { key: 'gold', emoji: '💰', label: '금', value: props.kingdom.resources.gold, color: 0xFFD700 },
      { key: 'soldiers', emoji: '⚔️', label: '병력', value: props.kingdom.resources.soldiers, color: 0xFF6B6B },
      { key: 'morale', emoji: '❤️', label: '민심', value: props.kingdom.resources.morale, color: 0xFF69B4 },
    ];

    this.resources = {} as any;

    resourceConfigs.forEach((config, index) => {
      const container = this.add.container(startX, startY + index * spacing);

      // 배경 패널
      const panel = this.add.graphics();
      panel.fillStyle(0x1e2749, 0.8);
      panel.fillRoundedRect(-60, -50, 280, 100, 10);
      panel.lineStyle(2, config.color, 1);
      panel.strokeRoundedRect(-60, -50, 280, 100, 10);
      container.add(panel);

      // 이모지 아이콘
      const icon = this.add.text(-40, -10, config.emoji, {
        fontSize: '48px',
      }).setOrigin(0.5);
      container.add(icon);

      // 라벨
      const label = this.add.text(30, -25, config.label, {
        fontSize: '20px',
        color: '#ffffff',
        fontStyle: 'bold',
      });
      container.add(label);

      // 값
      const valueText = this.add.text(30, 5, `${config.value.toLocaleString()}`, {
        fontSize: '28px',
        color: '#' + config.color.toString(16).padStart(6, '0'),
        fontStyle: 'bold',
      });
      container.add(valueText);

      // 파티클 효과
      const resourceParticles = this.add.particles(0, 0, 'particle', {
        x: -40,
        y: -10,
        speed: 20,
        scale: { start: 0.2, end: 0 },
        alpha: { start: 0.5, end: 0 },
        lifespan: 1000,
        frequency: 500,
        tint: config.color,
      });
      container.add(resourceParticles);

      // 호버 효과
      const hitArea = this.add.rectangle(0, 0, 280, 100, 0xffffff, 0).setInteractive();
      container.add(hitArea);

      hitArea.on('pointerover', () => {
        this.tweens.add({
          targets: container,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 200,
        });
      });

      hitArea.on('pointerout', () => {
        this.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
        });
      });

      this.resources[config.key as keyof typeof this.resources] = {
        sprite: icon,
        text: valueText,
      };
    });
  }

  private createActionButtons(width: number, height: number) {
    const startX = width - 250;
    const startY = 200;
    const spacing = 130;

    const actionConfigs = [
      { emoji: '👥', title: '장수 관리', desc: '장수를 확인하고\n병력을 배치합니다', color: 0x4A90E2, event: 'showGenerals' },
      { emoji: '⚔️', title: '제국 침략', desc: '제국의 요새를\n공격합니다', color: 0xE74C3C, event: 'selectBattleType' },
      { emoji: '🎴', title: '이벤트 카드', desc: '운명의 카드를\n뽑습니다', color: 0x9B59B6, event: 'drawEventCard' },
    ];

    this.actionButtons = [];

    actionConfigs.forEach((config, index) => {
      const container = this.add.container(startX, startY + index * spacing);

      // 배경
      const bg = this.add.graphics();
      bg.fillStyle(config.color, 0.8);
      bg.fillRoundedRect(-100, -50, 200, 100, 15);
      bg.lineStyle(3, 0xffffff, 0.8);
      bg.strokeRoundedRect(-100, -50, 200, 100, 15);
      container.add(bg);

      // 아이콘
      const icon = this.add.text(-70, -20, config.emoji, {
        fontSize: '48px',
      });
      container.add(icon);

      // 제목
      const title = this.add.text(10, -30, config.title, {
        fontSize: '18px',
        fontStyle: 'bold',
        color: '#ffffff',
      });
      container.add(title);

      // 설명
      const desc = this.add.text(10, -5, config.desc, {
        fontSize: '12px',
        color: '#cccccc',
      });
      container.add(desc);

      // 인터랙티브 영역
      const hitArea = this.add.rectangle(0, 0, 200, 100, 0xffffff, 0).setInteractive();
      container.add(hitArea);

      // 클릭 효과
      hitArea.on('pointerdown', () => {
        this.tweens.add({
          targets: container,
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 100,
          yoyo: true,
          onComplete: () => {
            if (config.event === 'showGenerals') {
              emit('showGenerals');
            } else if (config.event === 'selectBattleType') {
              emit('selectBattleType', 'pve');
            } else if (config.event === 'drawEventCard') {
              emit('drawEventCard');
            }
          },
        });

        // 클릭 파티클
        const clickParticles = this.add.particles(container.x, container.y, 'particle', {
          speed: { min: 50, max: 100 },
          scale: { start: 0.4, end: 0 },
          alpha: { start: 1, end: 0 },
          lifespan: 500,
          quantity: 10,
          tint: config.color,
        });

        this.time.delayedCall(500, () => {
          clickParticles.destroy();
        });
      });

      // 호버 효과
      hitArea.on('pointerover', () => {
        this.tweens.add({
          targets: [bg],
          alpha: 1,
          duration: 200,
        });
        this.tweens.add({
          targets: container,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 200,
        });
      });

      hitArea.on('pointerout', () => {
        this.tweens.add({
          targets: [bg],
          alpha: 0.8,
          duration: 200,
        });
        this.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
        });
      });

      // 떠다니는 애니메이션
      this.tweens.add({
        targets: container,
        y: startY + index * spacing + 5,
        duration: 2000 + index * 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.actionButtons.push(container);
    });
  }

  private createBottomPanel(width: number, height: number) {
    const panelY = height - 120;

    // 타이머 패널
    this.timeBanner = this.add.container(width / 2 - 200, panelY);

    const timerBg = this.add.graphics();
    const isCritical = props.remainingTime.days < 3 && !props.remainingTime.isExpired;
    const timerColor = props.remainingTime.isExpired ? 0x8B0000 : (isCritical ? 0xFF4500 : 0x2d3561);

    timerBg.fillStyle(timerColor, 0.9);
    timerBg.fillRoundedRect(-150, -40, 300, 80, 10);
    timerBg.lineStyle(2, 0xffd700, 1);
    timerBg.strokeRoundedRect(-150, -40, 300, 80, 10);
    this.timeBanner.add(timerBg);

    const timerIcon = this.add.text(-130, -25, '⏰', { fontSize: '24px' });
    this.timeBanner.add(timerIcon);

    const timerTitle = this.add.text(-95, -25, '대전쟁 종료까지', {
      fontSize: '16px',
      color: '#ffffff',
    });
    this.timeBanner.add(timerTitle);

    const timeText = props.remainingTime.isExpired
      ? '전쟁 종료!'
      : `${props.remainingTime.days}일 ${props.remainingTime.hours}:${props.remainingTime.minutes}:${props.remainingTime.seconds}`;

    const timerValue = this.add.text(0, 10, timeText, {
      fontSize: '24px',
      fontStyle: 'bold',
      color: props.remainingTime.isExpired ? '#ff0000' : '#ffd700',
    }).setOrigin(0.5);
    this.timeBanner.add(timerValue);

    // 제국 정복 진행도
    const conquestX = width / 2 + 200;
    const conquestBanner = this.add.container(conquestX, panelY);

    const conquestBg = this.add.graphics();
    conquestBg.fillStyle(0x2d3561, 0.9);
    conquestBg.fillRoundedRect(-150, -40, 300, 80, 10);
    conquestBg.lineStyle(2, 0xff6b6b, 1);
    conquestBg.strokeRoundedRect(-150, -40, 300, 80, 10);
    conquestBanner.add(conquestBg);

    const conquestIcon = this.add.text(-130, -25, '⚡', { fontSize: '24px' });
    conquestBanner.add(conquestIcon);

    const conquestTitle = this.add.text(-95, -25, `${props.empire.name} 정복`, {
      fontSize: '16px',
      color: '#ffffff',
    });
    conquestBanner.add(conquestTitle);

    const conquestProgress = this.add.text(0, 10, `${props.empire.defeatedFortresses} / ${props.empire.totalFortresses}`, {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ff6b6b',
    }).setOrigin(0.5);
    conquestBanner.add(conquestProgress);

    // 진행 바
    const progressBarBg = this.add.graphics();
    progressBarBg.fillStyle(0x000000, 0.5);
    progressBarBg.fillRoundedRect(-120, 25, 240, 10, 5);
    conquestBanner.add(progressBarBg);

    const progressPercent = (props.empire.defeatedFortresses / props.empire.totalFortresses);
    const progressBar = this.add.graphics();
    progressBar.fillStyle(0xff6b6b, 1);
    progressBar.fillRoundedRect(-120, 25, 240 * progressPercent, 10, 5);
    conquestBanner.add(progressBar);
  }

  private createCommandmentPanel(height: number) {
    const commandments = props.godGameState?.selectedCommandments || [];
    if (commandments.length === 0) return;

    const panelX = 80;
    const startY = 200;

    this.commandmentBanner = this.add.container(panelX, startY);

    const bg = this.add.graphics();
    bg.fillStyle(0x2d3561, 0.8);
    bg.fillRoundedRect(-70, -30, 140, 400, 10);
    bg.lineStyle(2, 0x9b59b6, 1);
    bg.strokeRoundedRect(-70, -30, 140, 400, 10);
    this.commandmentBanner.add(bg);

    const title = this.add.text(0, -10, '✨ 신의 계명', {
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#9b59b6',
    }).setOrigin(0.5);
    this.commandmentBanner.add(title);

    commandments.forEach((commandment, index) => {
      const y = 25 + index * 65;

      const commandmentBg = this.add.graphics();
      commandmentBg.fillStyle(0x1e2749, 0.9);
      commandmentBg.fillRoundedRect(-60, y - 20, 120, 55, 8);
      this.commandmentBanner.add(commandmentBg);

      const icon = this.add.text(0, y - 5, commandment.icon, {
        fontSize: '32px',
      }).setOrigin(0.5);
      this.commandmentBanner.add(icon);

      const name = this.add.text(0, y + 20, commandment.name, {
        fontSize: '10px',
        color: '#ffffff',
        wordWrap: { width: 110 },
      }).setOrigin(0.5);
      this.commandmentBanner.add(name);

      // 빛나는 효과
      this.tweens.add({
        targets: icon,
        scale: 1.1,
        duration: 1500 + index * 200,
        yoyo: true,
        repeat: -1,
      });
    });
  }

  preload() {
    // 파티클용 간단한 원 생성
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xffffff);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('particle', 8, 8);
    graphics.destroy();
  }
}

onMounted(() => {
  if (!gameCanvas.value || !import.meta.client) return;

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: gameCanvas.value,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#1a1a2e',
    scene: MainGameScene,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  };

  game = new Phaser.Game(config);
});

onUnmounted(() => {
  if (game) {
    game.destroy(true);
    game = null;
  }
});
</script>

<template>
  <div ref="gameCanvas" class="phaser-main-game"></div>
</template>

<style scoped>
.phaser-main-game {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.phaser-main-game canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>